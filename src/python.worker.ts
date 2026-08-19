type RunRequest = {
  type: 'run';
  source: string;
  inputs: string[];
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
    pyodide.globals.set('codelah_source', data.source);
    const output = JSON.parse(String(await pyodide.runPythonAsync(`
import builtins
import json

_codelah_values = iter(codelah_inputs)
_codelah_output = []
_codelah_builtins = dict(vars(builtins))
_codelah_builtins['input'] = lambda prompt='': next(_codelah_values)
_codelah_builtins['print'] = lambda *args, **kwargs: _codelah_output.append(' '.join(str(arg) for arg in args))
def _codelah_number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return value

_codelah_scope = {
    '__builtins__': _codelah_builtins,
    # These are test-fixture values, not required learner variable names.
    'first_score': _codelah_number(codelah_inputs[0]) if len(codelah_inputs) > 0 else None,
    'second_score': _codelah_number(codelah_inputs[1]) if len(codelah_inputs) > 1 else None,
    'operation': codelah_inputs[2] if len(codelah_inputs) > 2 else None,
}
exec(compile(codelah_source, '<learner code>', 'exec'), _codelah_scope, _codelah_scope)
json.dumps(_codelah_output)
`))) as string[];
    self.postMessage({ type: 'passed', output } satisfies RunResponse);
  } catch (error) {
    const detail = error instanceof Error ? error.message.split('\n')[0] : 'Python could not run that step yet.';
    self.postMessage({ type: 'failed', message: `Python found an issue: ${detail}` } satisfies RunResponse);
  }
});
