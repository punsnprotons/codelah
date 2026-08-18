import { useState } from 'react';
import { PlanWorkspace } from './PlanWorkspace';
import { usePythonRunner } from './usePythonRunner';

type Screen = 'interests' | 'diagnostic' | 'plan' | 'module' | 'complete';

const interests = [
  { id: 'sports', label: 'Sports', glyph: '◌' },
  { id: 'stem', label: 'STEM & Engineering', glyph: '◇' },
  { id: 'arts', label: 'Arts & Media', glyph: '⌁' },
  { id: 'games', label: 'Games & Storytelling', glyph: '◐' },
  { id: 'business', label: 'Business', glyph: '↗' },
  { id: 'public', label: 'Society & Public Service', glyph: '⊹' },
];

const starterCode = 'first_score = float(input("Enter the first score: "))';

function Progress({ screen }: { screen: Screen }) {
  const active = { interests: 0, diagnostic: 1, plan: 2, module: 3, complete: 4 }[screen];
  return (
    <div className="progress" aria-label={`Step ${active + 1} of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <span className={index <= active ? 'progress__segment progress__segment--active' : 'progress__segment'} key={index} />
      ))}
    </div>
  );
}

function InterestScreen({ onContinue }: { onContinue: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggleInterest(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length === 3) return current;
      return [...current, id];
    });
  }
  return (
    <main className="light-screen onboarding-screen">
      <Progress screen="interests" />
      <button className="back-button" type="button" aria-label="Go back">←</button>
      <section className="onboarding-content" aria-labelledby="interest-title">
        <p className="emblem" aria-hidden="true">⌘</p>
        <h1 id="interest-title">What are you curious about?</h1>
        <p className="screen-copy">Choose up to three. You can change this anytime.</p>
        <div className="interest-grid">
          {interests.map((interest) => {
            const isSelected = selected.includes(interest.id);
            return (
              <button
                aria-pressed={isSelected}
                className={`interest-card ${isSelected ? 'interest-card--selected' : ''}`}
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                type="button"
              >
                <span className="interest-card__glyph">{interest.glyph}</span>
                <span>{interest.label}</span>
              </button>
            );
          })}
        </div>
      </section>
      <button className="primary-button onboarding-button" disabled={selected.length === 0} onClick={() => onContinue(selected)} type="button">
        Continue <span>→</span>
      </button>
    </main>
  );
}

function DiagnosticScreen({ onContinue }: { onContinue: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const isCorrect = answer === 'Text';
  return (
    <main className="dark-screen diagnostic-screen">
      <Progress screen="diagnostic" />
      <section className="diagnostic-content" aria-labelledby="diagnostic-title">
        <p className="eyebrow">Before we build, one quick check.</p>
        <h1 id="diagnostic-title">What does <code>input()</code> give Python?</h1>
        <div className="answer-grid" role="radiogroup" aria-label="Concept check answers">
          {['A number', 'Text', 'A calculation'].map((option) => (
            <button
              aria-checked={answer === option}
              className={`answer-card ${answer === option ? 'answer-card--selected' : ''}`}
              key={option}
              onClick={() => { setAnswer(option); setChecked(false); }}
              role="radio"
              type="button"
            >
              <span className="answer-card__visual">{option === 'Text' ? 'abc' : option === 'A number' ? '123' : '+ ÷'}</span>
              <span>{option}</span>
            </button>
          ))}
        </div>
        {checked && (
          <div className={`feedback ${isCorrect ? 'feedback--success' : ''}`} role="status">
            {isCorrect ? 'Exactly. Input begins as text; you decide when to turn it into a number.' : 'Think about what a keyboard sends before the program converts it.'}
          </div>
        )}
        <aside className="explain-card"><span>⌁</span> Good data starts as text — then you decide how to use it.</aside>
      </section>
      {checked && isCorrect ? (
        <button className="primary-button bottom-button" onClick={onContinue} type="button">Plan the program <span>→</span></button>
      ) : (
        <button className="primary-button bottom-button" disabled={!answer} onClick={() => setChecked(true)} type="button">Check answer</button>
      )}
    </main>
  );
}

function ModuleScreen({ onContinue }: { onContinue: () => void }) {
  const [code, setCode] = useState(starterCode);
  const { state, run } = usePythonRunner();
  const moduleComplete = state.status === 'passed';
  return (
    <main className="dark-screen module-screen">
      <Progress screen="module" />
      <section className="module-title"><p className="eyebrow">Module 1 · Turn text into a number</p><h1>Write this one step in Python</h1></section>
      <div className="module-layout">
        <aside className="module-brief">
          <div className="plan-chip"><span>✓</span><strong>Convert the first score to a number</strong><div><code>"4"</code><b>→</b><code>4.0</code></div></div>
          <p><span className="bulb">◉</span>Your program receives text. Convert it before calculating.</p>
        </aside>
        <label className="code-panel">
          <span className="sr-only">Python code for the current module</span>
          <span className="line-number">1</span>
          <textarea spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} />
        </label>
        <aside className="run-column">
          <div className="run-panel">
            <p className="panel-title">▶ Live run</p>
            <div className="terminal">Enter the first score: <strong>4</strong></div>
            {state.status === 'loading' && <p className="muted-status">Preparing Python…</p>}
            {state.status === 'running' && <p className="muted-status">Running your block…</p>}
            {state.status === 'passed' && <p className="pass-status">✓ Module complete</p>}
            {state.status === 'failed' && <p className="error-status">{state.message}</p>}
            {state.status === 'timed_out' && <p className="error-status">That took too long. The runner was reset safely.</p>}
          </div>
          <div className="why-card"><p className="panel-title">✦ Why this matters</p><p>Sports dashboards convert incoming values before calculating results.</p></div>
        </aside>
      </div>
      <div className="module-actions">
        {moduleComplete ? (
          <button className="primary-button" onClick={onContinue} type="button">See the assembled program <span>→</span></button>
        ) : (
          <button className="primary-button" disabled={state.status === 'loading' || state.status === 'running'} onClick={() => run(code)} type="button">Run this block <span>▶</span></button>
        )}
      </div>
    </main>
  );
}

function CompleteScreen({ restart }: { restart: () => void }) {
  return (
    <main className="light-screen complete-screen">
      <Progress screen="complete" />
      <section className="complete-card">
        <p className="emblem" aria-hidden="true">✦</p>
        <p className="eyebrow">Your first program is taking shape</p>
        <h1>You planned the logic before you wrote the code.</h1>
        <p>Next, you would add the second score, choose an operation, and protect division by zero—one block at a time.</p>
        <pre>{`first_score = float(input("Enter the first score: "))\n# Next: collect, validate, calculate, show result`}</pre>
        <button className="primary-button" onClick={restart} type="button">Start again <span>↻</span></button>
      </section>
    </main>
  );
}

export function App() {
  const [screen, setScreen] = useState<Screen>('interests');
  const [, setDomains] = useState<string[]>([]);
  if (screen === 'interests') return <InterestScreen onContinue={(selected) => { setDomains(selected); setScreen('diagnostic'); }} />;
  if (screen === 'diagnostic') return <DiagnosticScreen onContinue={() => setScreen('plan')} />;
  if (screen === 'plan') return <main className="dark-screen plan-screen"><Progress screen="plan" /><PlanWorkspace onValid={() => setScreen('module')} /></main>;
  if (screen === 'module') return <ModuleScreen onContinue={() => setScreen('complete')} />;
  return <CompleteScreen restart={() => setScreen('interests')} />;
}
