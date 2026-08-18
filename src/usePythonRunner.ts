import { useCallback, useEffect, useRef, useState } from 'react';

type RunState =
  | { status: 'loading' }
  | { status: 'idle' }
  | { status: 'running' }
  | { status: 'passed'; value: number }
  | { status: 'failed'; message: string }
  | { status: 'timed_out' };

export function usePythonRunner() {
  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);
  const [state, setState] = useState<RunState>({ status: 'loading' });

  const createWorker = useCallback(() => {
    const worker = new Worker(new URL('./python.worker.ts', import.meta.url));
    worker.onmessage = ({ data }: MessageEvent) => {
      if (data.type === 'ready') setState({ status: 'idle' });
      if (data.type === 'passed') {
        window.clearTimeout(timeoutRef.current);
        setState({ status: 'passed', value: data.value });
      }
      if (data.type === 'failed') {
        window.clearTimeout(timeoutRef.current);
        setState({ status: 'failed', message: data.message });
      }
    };
    workerRef.current = worker;
  }, []);

  useEffect(() => {
    createWorker();
    return () => {
      window.clearTimeout(timeoutRef.current);
      workerRef.current?.terminate();
    };
  }, [createWorker]);

  const run = useCallback((source: string) => {
    if (!workerRef.current) return;
    setState({ status: 'running' });
    workerRef.current.postMessage({ type: 'run', source, inputs: ['4'] });
    timeoutRef.current = window.setTimeout(() => {
      workerRef.current?.terminate();
      setState({ status: 'timed_out' });
      createWorker();
    }, 2500);
  }, [createWorker]);

  return { state, run };
}
