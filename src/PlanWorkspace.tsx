import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';

const REQUIRED_BLOCKS = [
  'collect_first_score',
  'collect_second_score',
  'choose_operation',
  'guard_zero_division',
  'show_result',
];

const blockLabels: Record<string, string> = {
  collect_first_score: 'Get first score',
  collect_second_score: 'Get second score',
  choose_operation: 'Choose an operation',
  guard_zero_division: 'Check for division by zero',
  show_result: 'Show result or helpful error',
};

let blocksRegistered = false;

function registerBlocks() {
  if (blocksRegistered) return;
  Blockly.defineBlocksWithJsonArray([
    {
      type: 'collect_first_score',
      message0: 'Get first score',
      previousStatement: null,
      nextStatement: null,
      colour: '#4f67d3',
      tooltip: 'Collect the first number for the calculator.',
    },
    {
      type: 'collect_second_score',
      message0: 'Get second score',
      previousStatement: null,
      nextStatement: null,
      colour: '#367cc9',
      tooltip: 'Collect the second number for the calculator.',
    },
    {
      type: 'choose_operation',
      message0: 'Choose an operation',
      previousStatement: null,
      nextStatement: null,
      colour: '#159b98',
      tooltip: 'Ask the learner which calculation to use.',
    },
    {
      type: 'guard_zero_division',
      message0: 'Before division, check second score is not zero',
      previousStatement: null,
      nextStatement: null,
      colour: '#a7b930',
      tooltip: 'Protect the program from division by zero.',
    },
    {
      type: 'show_result',
      message0: 'Show result or helpful error',
      previousStatement: null,
      nextStatement: null,
      colour: '#e98514',
      tooltip: 'Present a result or explain what needs to change.',
    },
  ]);
  blocksRegistered = true;
}

function getOrderedBlockTypes(workspace: Blockly.WorkspaceSvg): string[] | null {
  const topBlocks = workspace.getTopBlocks(true);
  if (topBlocks.length !== 1) return null;

  const types: string[] = [];
  let current: Blockly.Block | null = topBlocks[0];
  while (current) {
    types.push(current.type);
    current = current.getNextBlock();
  }
  return types;
}

type PlanWorkspaceProps = {
  onValid: () => void;
};

export function PlanWorkspace({ onValid }: PlanWorkspaceProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const [message, setMessage] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [mode, setMode] = useState<'drag' | 'keyboard'>('drag');
  const [keyboardPlan, setKeyboardPlan] = useState<string[]>([]);

  useEffect(() => {
    if (!host.current) return;
    registerBlocks();
    const theme = Blockly.Theme.defineTheme('codelah', {
      name: 'codelah',
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#f7f8f6',
        toolboxBackgroundColour: '#f7f8f6',
        toolboxForegroundColour: '#253029',
        flyoutBackgroundColour: '#f7f8f6',
        flyoutForegroundColour: '#253029',
        flyoutOpacity: 1,
        scrollbarColour: '#9caea0',
        insertionMarkerColour: '#557d1e',
        insertionMarkerOpacity: 0.3,
        cursorColour: '#557d1e',
      },
    });

    const nextWorkspace = Blockly.inject(host.current, {
      theme,
      toolbox: {
        kind: 'categoryToolbox',
        contents: [{
          kind: 'category',
          name: 'Steps',
          colour: '#557d1e',
          contents: REQUIRED_BLOCKS.map((type) => ({ kind: 'block', type })),
        }],
      },
      grid: { spacing: 20, length: 3, colour: '#d9e3d6', snap: true },
      trashcan: false,
      zoom: { controls: false, wheel: false, startScale: 0.93, maxScale: 1.28, minScale: 0.74 },
      move: { scrollbars: false, drag: true, wheel: false },
    });
    workspace.current = nextWorkspace;
    const toolbox = nextWorkspace.getToolbox();
    const stepsCategory = toolbox?.getToolboxItems()[0];
    if (stepsCategory) toolbox?.setSelectedItem(stepsCategory);
    const resize = () => Blockly.svgResize(nextWorkspace);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      nextWorkspace.dispose();
    };
  }, []);

  function validateTypes(types: string[] | null) {
    const matches = types?.length === REQUIRED_BLOCKS.length
      && types.every((type, index) => type === REQUIRED_BLOCKS[index]);

    if (matches) {
      setIsValid(true);
      setMessage('Plan complete. You protected the calculation before using it.');
      return;
    }

    setIsValid(false);
    if (!types || types.length !== REQUIRED_BLOCKS.length) {
      setMessage('Build one connected sequence using all five blocks. Start with the two scores.');
      return;
    }

    const guardIndex = types.indexOf('guard_zero_division');
    const resultIndex = types.indexOf('show_result');
    if (guardIndex === -1 || guardIndex > resultIndex) {
      setMessage('Before the calculator can show a division result, what value must it check?');
      return;
    }
    setMessage('Read the plan from top to bottom. What information does the program need before it can choose an operation?');
  }

  function validatePlan() {
    const types = mode === 'keyboard' ? keyboardPlan : workspace.current ? getOrderedBlockTypes(workspace.current) : null;
    validateTypes(types);
  }

  function addKeyboardBlock(type: string) {
    const expected = REQUIRED_BLOCKS[keyboardPlan.length];
    setIsValid(false);
    if (type !== expected) {
      setMessage(`Before ${blockLabels[type].toLowerCase()}, what is the next thing the program needs?`);
      return;
    }
    const nextPlan = [...keyboardPlan, type];
    setKeyboardPlan(nextPlan);
    setMessage(nextPlan.length === REQUIRED_BLOCKS.length ? 'All five planning blocks are in order. Check your plan.' : `Good. Now add step ${nextPlan.length + 1} of ${REQUIRED_BLOCKS.length}.`);
  }

  return (
    <section className="plan-stage" aria-labelledby="plan-title">
      <div className="plan-heading">
        <h1 id="plan-title">Build your plan.</h1>
        <p>Arrange the steps in the order your program should run.</p>
      </div>
      <div className="plan-layout">
        <div className={`blockly-host ${mode === 'keyboard' ? 'blockly-host--hidden' : ''}`} ref={host} aria-label="Pseudocode block workspace" />
        {mode === 'keyboard' && (
          <section className="keyboard-plan" aria-label="Keyboard pseudocode planner">
            <p className="panel-title">Build the plan with buttons</p>
            <ol>{keyboardPlan.map((type, index) => <li key={`${type}-${index}`}>{blockLabels[type]}</li>)}</ol>
            <div className="keyboard-plan__choices">{REQUIRED_BLOCKS.map((type) => <button disabled={keyboardPlan.includes(type)} key={type} onClick={() => addKeyboardBlock(type)} type="button">{blockLabels[type]}</button>)}</div>
          </section>
        )}
      </div>
      <div className={`plan-message ${message ? 'plan-message--visible' : ''} ${isValid ? 'plan-message--success' : ''}`} role="status">
        {message}
      </div>
      <div className="stage-actions">
        <button className="sr-only" onClick={() => { setMode((current) => current === 'drag' ? 'keyboard' : 'drag'); setIsValid(false); setMessage(mode === 'drag' ? 'Use the buttons to build the plan one step at a time.' : ''); }} type="button">{mode === 'drag' ? 'Use keyboard planner' : 'Use drag-and-drop'}</button>
        {isValid ? (
          <button className="primary-button" onClick={onValid} type="button">Continue</button>
        ) : (
          <button className="primary-button" onClick={validatePlan} type="button">Submit plan</button>
        )}
      </div>
    </section>
  );
}
