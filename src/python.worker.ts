type RunRequest = {
  type: 'run';
  source: string;
  inputs: string[];
  assertion?: string;
  failureMessage?: string;
};

type RunResponse =
  | { type: 'passed'; output: string[] }
  | { type: 'failed'; message: string }
  | { type: 'ready' };

type PyodideRuntime = {
  globals: { set: (name: string, value: unknown) => void };
  runPythonAsync: (source: string) => Promise<unknown>;
};

const indexURL = new URL('/pyodide/', self.location.origin).toString();
type PyodideModule = { loadPyodide: (options: { indexURL: string }) => Promise<PyodideRuntime> };
const pyodideReady = import(/* @vite-ignore */ new URL('pyodide.mjs', indexURL).toString())
  .then((module) => (module as PyodideModule).loadPyodide({ indexURL }));

void pyodideReady
  .then(() => self.postMessage({ type: 'ready' } satisfies RunResponse))
  .catch((error) => {
    const detail = error instanceof Error ? error.message : 'Pyodide could not start.';
    self.postMessage({ type: 'failed', message: `Python runtime could not start: ${detail}` } satisfies RunResponse);
  });

self.addEventListener('message', async ({ data }: MessageEvent<RunRequest>) => {
  if (data.type !== 'run') return;
  try {
    const pyodide = await pyodideReady;
    pyodide.globals.set('codelah_inputs', data.inputs);
    await pyodide.runPythonAsync(`
import builtins
import json
_codelah_values = iter(codelah_inputs)
_codelah_output = []
builtins.input = lambda prompt='': next(_codelah_values)
builtins.print = lambda *args, **kwargs: _codelah_output.append(' '.join(str(arg) for arg in args))
`);
    await pyodide.runPythonAsync(data.source);
    if (data.assertion) {
      const assertionPassed = await pyodide.runPythonAsync(data.assertion);
      if (assertionPassed !== true) {
        self.postMessage({ type: 'failed', message: data.failureMessage ?? 'That block is not producing the expected value yet.' } satisfies RunResponse);
        return;
      }
    }
    const output = JSON.parse(String(await pyodide.runPythonAsync('json.dumps(_codelah_output)'))) as string[];
    self.postMessage({ type: 'passed', output } satisfies RunResponse);
  } catch (error) {
    const detail = error instanceof Error ? error.message.split('\n')[0] : 'Python could not run that step yet.';
    self.postMessage({ type: 'failed', message: `Python found an issue: ${detail}` } satisfies RunResponse);
  }
});
