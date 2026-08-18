import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { loadPyodide } from 'pyodide';

const appSource = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
const sourceMatch = appSource.match(/const assembledCalculator = `([\s\S]*?)`;/);
if (!sourceMatch) throw new Error('Could not find the assembled calculator source in App.tsx.');

const pyodide = await loadPyodide();

async function runCalculator(inputs) {
  pyodide.globals.set('codelah_inputs', inputs);
  await pyodide.runPythonAsync(`
import builtins
_codelah_values = iter(codelah_inputs)
_codelah_output = []
builtins.input = lambda prompt='': next(_codelah_values)
builtins.print = lambda *args, **kwargs: _codelah_output.append(' '.join(str(arg) for arg in args))
`);
  await pyodide.runPythonAsync(sourceMatch[1]);
  const output = await pyodide.runPythonAsync('_codelah_output');
  const values = output.toJs();
  output.destroy();
  return values;
}

const cases = [
  { inputs: ['10', '5', '+'], expected: ['Result: 10.0 + 5.0 = 15.0'] },
  { inputs: ['10', '5', '-'], expected: ['Result: 10.0 - 5.0 = 5.0'] },
  { inputs: ['4', '3', '*'], expected: ['Result: 4.0 * 3.0 = 12.0'] },
  { inputs: ['8', '2', '/'], expected: ['Result: 8.0 / 2.0 = 4.0'] },
  { inputs: ['8', '0', '/'], expected: ['Error: You cannot divide by zero!'] },
  { inputs: ['8', '2', '%'], expected: ['Error: Choose +, -, *, or /.'] },
];

for (const testCase of cases) {
  assert.deepEqual(await runCalculator(testCase.inputs), testCase.expected);
}

console.log(`Calculator lesson checks passed (${cases.length} scenarios).`);
