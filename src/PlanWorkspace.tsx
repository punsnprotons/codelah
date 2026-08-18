import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly';

const REQUIRED_BLOCKS = [
  'collect_first_score',
  'collect_second_score',
  'choose_operation',
  'guard_zero_division',
  'show_result',
];

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
  context: { label: string; project: string; fact: string };
  onValid: () => void;
};

export function PlanWorkspace({ context, onValid }: PlanWorkspaceProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const workspace = useRef<Blockly.WorkspaceSvg | null>(null);
  const [message, setMessage] = useState('Drag the thinking blocks into one connected plan.');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!host.current) return;
    registerBlocks();
    const theme = Blockly.Theme.defineTheme('codelah', {
      name: 'codelah',
      base: Blockly.Themes.Classic,
      componentStyles: {
        workspaceBackgroundColour: '#151817',
        toolboxBackgroundColour: '#1d211f',
        toolboxForegroundColour: '#ecefea',
        flyoutBackgroundColour: '#1d211f',
        flyoutForegroundColour: '#ecefea',
        flyoutOpacity: 1,
        scrollbarColour: '#53615b',
        insertionMarkerColour: '#c7fa54',
        insertionMarkerOpacity: 0.3,
        cursorColour: '#c7fa54',
      },
    });

    const nextWorkspace = Blockly.inject(host.current, {
      theme,
      toolbox: {
        kind: 'flyoutToolbox',
        contents: REQUIRED_BLOCKS.map((type) => ({ kind: 'block', type })),
      },
      grid: { spacing: 20, length: 3, colour: '#252a28', snap: true },
      trashcan: true,
      zoom: { controls: false, wheel: false, startScale: 0.92, maxScale: 1.1, minScale: 0.8 },
      move: { scrollbars: { horizontal: true, vertical: true }, drag: true, wheel: false },
    });
    workspace.current = nextWorkspace;
    const resize = () => Blockly.svgResize(nextWorkspace);
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      nextWorkspace.dispose();
    };
  }, []);

  function validatePlan() {
    const activeWorkspace = workspace.current;
    if (!activeWorkspace) return;
    const types = getOrderedBlockTypes(activeWorkspace);
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

  return (
    <section className="plan-stage" aria-labelledby="plan-title">
      <div className="plan-heading">
        <p className="eyebrow">{context.label} · Python foundations</p>
        <h1 id="plan-title">Plan the {context.project}</h1>
        <p>Put the thinking in order before you write Python.</p>
      </div>
      <div className="plan-layout">
        <div className="blockly-host" ref={host} aria-label="Pseudocode block workspace" />
        <aside className="concept-note">
          <span className="note-mark">✦</span>
          <p>{context.fact}</p>
        </aside>
      </div>
      <div className={`plan-message ${isValid ? 'plan-message--success' : ''}`} role="status">
        {message}
      </div>
      <div className="stage-actions">
        <button className="text-button" onClick={() => workspace.current?.clear()} type="button">Clear plan</button>
        {isValid ? (
          <button className="primary-button" onClick={onValid} type="button">Write the first block <span>→</span></button>
        ) : (
          <button className="primary-button" onClick={validatePlan} type="button">Check plan <span>→</span></button>
        )}
      </div>
    </section>
  );
}
