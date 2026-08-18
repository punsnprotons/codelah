import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const source = resolve('node_modules/pyodide');
const target = resolve('public/pyodide');

mkdirSync(resolve('public'), { recursive: true });
cpSync(source, target, { recursive: true, force: true });
