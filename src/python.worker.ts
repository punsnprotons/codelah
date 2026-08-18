type RunRequest = {
  type: 'run';
  source: string;
  inputs: string[];
};

type RunResponse =
  | { type: 'passed'; value: number }
  | { type: 'failed'; message: string }
  | { type: 'ready' };

const indexURL = new URL('/pyodide/', self.location.origin).toString();
type PyodideRuntime = {
  globals: { set: (name: string, value: unknown) => void };
  runPythonAsync: (source: string) => Promise<unknown>;
};
declare function loadPyodide(options: { indexURL: string }): Promise<PyodideRuntime>;
declare function importScripts(...urls: string[]): void;

importScripts(new URL('pyodide.js', indexURL).toString());
const pyodideReady = loadPyodide({ indexURL });

void pyodideReady.then(() => {
  self.postMessage({ type: 'ready' } satisfies RunResponse);
});

self.addEventListener('message', async ({ data }: MessageEvent<RunRequest>) => {
  if (data.type !== 'run') return;

  try {
    const pyodide = await pyodideReady;
    pyodide.globals.set('codelah_inputs', data.inputs);
    await pyodide.runPythonAsync(`
import builtins
_codelah_values = iter(codelah_inputs)
builtins.input = lambda prompt='': next(_codelah_values)
`);
    await pyodide.runPythonAsync(data.source);
    const result = await pyodide.runPythonAsync('first_score');

    if (typeof result !== 'number' || result !== 4) {
      self.postMessage({
        type: 'failed',
        message: 'The test expected first_score to become the number 4.0 after the input is converted.',
      } satisfies RunResponse);
      return;
    }

    self.postMessage({ type: 'passed', value: result } satisfies RunResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Python could not run that step yet.';
    self.postMessage({ type: 'failed', message } satisfies RunResponse);
  }
});
