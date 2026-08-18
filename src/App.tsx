import { useEffect, useMemo, useState } from 'react';
import { PlanWorkspace } from './PlanWorkspace';
import { usePythonRunner } from './usePythonRunner';

type Screen = 'interests' | 'diagnostic' | 'plan' | 'module' | 'assembly' | 'transfer';

const interests = [
  { id: 'sports', label: 'Sports' }, { id: 'stem', label: 'STEM & Engineering' },
  { id: 'arts', label: 'Arts & Media' }, { id: 'games', label: 'Games & Storytelling' },
  { id: 'business', label: 'Business' }, { id: 'public', label: 'Society & Public Service' },
];

const lessonContexts: Record<string, { label: string; project: string; fact: string }> = {
  sports: { label: 'Sports context', project: 'match calculator', fact: 'Sports dashboards convert incoming score data before calculating results.' },
  stem: { label: 'STEM context', project: 'measurement calculator', fact: 'Engineering tools validate measurements before using them in a calculation.' },
  arts: { label: 'Arts context', project: 'production calculator', fact: 'Creative tools turn typed settings into reliable values before rendering.' },
  games: { label: 'Games context', project: 'game-score calculator', fact: 'Game systems check player inputs before updating a score.' },
  business: { label: 'Business context', project: 'revenue calculator', fact: 'Business dashboards validate source values before showing a total.' },
  public: { label: 'Public service context', project: 'incident calculator', fact: 'Public-service software needs clear validation so a bad value cannot silently produce a bad result.' },
};

type ModuleSpec = { title: string; planStep: string; hint: string; why: string; starter: string; inputs: string[]; assertion: string; failureMessage: string };
const modules: ModuleSpec[] = [
  { title: 'Turn text into a number', planStep: 'Convert the first score to a number', hint: 'Your program receives text. Convert it before calculating.', why: 'This makes the first value safe to use in math.', starter: 'first_score = float(input("Enter the first score: "))', inputs: ['4'], assertion: 'first_score == 4', failureMessage: 'Store the converted input in first_score. The test input is 4.' },
  { title: 'Collect the second value', planStep: 'Get the second score as a number', hint: 'Use the same conversion pattern for the second value.', why: 'A calculator needs two numeric values before it can compare or combine them.', starter: 'second_score = float(input("Enter the second score: "))', inputs: ['4', '3'], assertion: 'second_score == 3', failureMessage: 'Store the converted second input in second_score. The test input is 3.' },
  { title: 'Ask what to calculate', planStep: 'Choose an operation', hint: 'Keep the operation as text so you can compare it to +, -, *, and /.', why: 'The operation tells your program which calculation to use.', starter: 'operation = input("Choose an operation (+, -, *, /): ")', inputs: ['4', '3', '*'], assertion: 'operation == "*"', failureMessage: 'Save the operation input in operation. The test input is *.' },
  { title: 'Protect division by zero', planStep: 'Check the denominator before division', hint: 'Write an if statement that only runs when the operation is / and the second score is 0.', why: 'A helpful message keeps a bad calculation from becoming a crash.', starter: 'if operation == "/" and second_score == 0:\n    message = "Error: You cannot divide by zero!"', inputs: ['4', '0', '/'], assertion: 'message == "Error: You cannot divide by zero!"', failureMessage: 'When division and zero happen together, set message to the helpful error text.' },
  { title: 'Calculate the result', planStep: 'Calculate from the chosen operation', hint: 'Use if / elif branches. Start with the multiplication case used by the test.', why: 'Branches let one program handle several valid choices clearly.', starter: 'if operation == "+":\n    result = first_score + second_score\nelif operation == "-":\n    result = first_score - second_score\nelif operation == "*":\n    result = first_score * second_score\nelif operation == "/":\n    result = first_score / second_score\nelse:\n    result = None', inputs: ['4', '3', '*'], assertion: 'result == 12', failureMessage: 'For the * test, result should become first_score * second_score. Keep the other branches too.' },
];

const assembledCalculator = `first_score = float(input("Enter the first score: "))
second_score = float(input("Enter the second score: "))
operation = input("Choose an operation (+, -, *, /): ")

if operation == "/" and second_score == 0:
    print("Error: You cannot divide by zero!")
elif operation == "+":
    print(f"Result: {first_score} + {second_score} = {first_score + second_score}")
elif operation == "-":
    print(f"Result: {first_score} - {second_score} = {first_score - second_score}")
elif operation == "*":
    print(f"Result: {first_score} * {second_score} = {first_score * second_score}")
elif operation == "/":
    print(f"Result: {first_score} / {second_score} = {first_score / second_score}")
else:
    print("Error: Choose +, -, *, or /.")`;

function Progress({ screen }: { screen: Screen }) {
  const active = { interests: 0, diagnostic: 1, plan: 2, module: 3, assembly: 4, transfer: 5 }[screen];
  return <div className="progress" aria-label={`Step ${active + 1} of 6`}>{Array.from({ length: 6 }).map((_, index) => <span className={index <= active ? 'progress__segment progress__segment--active' : 'progress__segment'} key={index} />)}</div>;
}

function InterestIcon({ interest }: { interest: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.8 };
  if (interest === 'sports') return <svg aria-hidden="true" viewBox="0 0 24 24"><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="m7.2 9.3 4.8-2.1 4.8 2.1v5.4L12 17l-4.8-2.3Z" /><path {...common} d="M12 7.2v4.3m4.8-2.2-3.7 2.2m-5.9-2.2 3.7 2.2m-3.7 5.4 3.7-2.2m5.9 2.2-3.7-2.2" /></svg>;
  if (interest === 'stem') return <svg aria-hidden="true" viewBox="0 0 24 24"><rect {...common} x="6" y="6" width="12" height="12" rx="2" /><path {...common} d="M9 2v4m3-4v4m3-4v4M9 18v4m3-4v4m3-4v4M2 9h4m-4 3h4m-4 3h4m12-6h4m-4 3h4m-4 3h4" /></svg>;
  if (interest === 'arts') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M15.5 4.5v10.2a3.1 3.1 0 1 1-1.8-2.8V7l6-1.5v8.2a3.1 3.1 0 1 1-1.8-2.8V4Z" /></svg>;
  if (interest === 'games') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M7.3 9h9.4a3 3 0 0 1 2.9 2.2l1 3.8a2.5 2.5 0 0 1-4 2.5l-2.1-1.6h-5l-2.1 1.6a2.5 2.5 0 0 1-4-2.5l1-3.8A3 3 0 0 1 7.3 9Z" /><path {...common} d="M8 12v3m-1.5-1.5h3M16 12.5h.01M18 14h.01" /></svg>;
  if (interest === 'business') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M5 17 10 12l3.2 3.2L20 8.4" /><path {...common} d="M14.5 8.4H20V14" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M12 20s7-3.3 7-9V5.5L12 3 5 5.5V11c0 5.7 7 9 7 9Z" /><path {...common} d="m8.8 11.5 2.1 2.1 4.3-4.4" /></svg>;
}

function InterestScreen({ onContinue }: { onContinue: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length === 3 ? current : [...current, id]);
  return <main className="light-screen onboarding-screen"><button aria-label="Go back" className="journey-back" onClick={() => window.history.back()} type="button"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="m14.5 5.5-6.5 6.5 6.5 6.5" /></svg><span>Back</span></button><Progress screen="interests" /><section className="onboarding-content" aria-labelledby="interest-title"><p className="onboarding-kicker">Choose your context</p><h1 id="interest-title">What are you curious about?</h1><p className="screen-copy">For adult learners (18+). Pick up to three topics to shape your first project.</p><div className="interest-grid">{interests.map((interest) => { const isSelected = selected.includes(interest.id); return <button aria-pressed={isSelected} className={`interest-card ${isSelected ? 'interest-card--selected' : ''}`} key={interest.id} onClick={() => toggle(interest.id)} type="button"><span className="interest-card__glyph"><InterestIcon interest={interest.id} /></span><span className="interest-card__label">{interest.label}</span><span aria-hidden="true" className="interest-card__check">✓</span></button>; })}</div></section><button className="primary-button onboarding-button" disabled={!selected.length} onClick={() => onContinue(selected)} type="button">Continue <span aria-hidden="true">→</span></button></main>;
}

function DiagnosticScreen({ onContinue }: { onContinue: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null); const [checked, setChecked] = useState(false); const isCorrect = answer === 'Text';
  return <main className="dark-screen diagnostic-screen"><Progress screen="diagnostic" /><section className="diagnostic-content" aria-labelledby="diagnostic-title"><p className="eyebrow">Before we build, one quick check.</p><h1 id="diagnostic-title">What does <code>input()</code> give Python?</h1><div className="answer-grid" role="radiogroup" aria-label="Concept check answers">{['A number', 'Text', 'A calculation'].map((option) => <button aria-checked={answer === option} className={`answer-card ${answer === option ? 'answer-card--selected' : ''}`} key={option} onClick={() => { setAnswer(option); setChecked(false); }} role="radio" type="button"><span className="answer-card__visual">{option === 'Text' ? 'abc' : option === 'A number' ? '123' : '+ ÷'}</span><span>{option}</span></button>)}</div>{checked && <div className={`feedback ${isCorrect ? 'feedback--success' : ''}`} role="status">{isCorrect ? 'Exactly. Input begins as text; you decide when to turn it into a number.' : 'Think about what a keyboard sends before the program converts it.'}</div>}<aside className="explain-card"><span>⌁</span> Good data starts as text — then you decide how to use it.</aside></section>{checked && isCorrect ? <button className="primary-button bottom-button" onClick={onContinue} type="button">Plan the program <span>→</span></button> : <button className="primary-button bottom-button" disabled={!answer} onClick={() => setChecked(true)} type="button">Check answer</button>}</main>;
}

type ModuleScreenProps = { module: ModuleSpec; index: number; priorSource: string; context: { label: string; project: string; fact: string }; onContinue: (source: string) => void };
function ModuleScreen({ module, index, priorSource, context, onContinue }: ModuleScreenProps) {
  const [code, setCode] = useState(module.starter); const { state, run } = usePythonRunner();
  useEffect(() => setCode(module.starter), [module]);
  const source = `${priorSource}${priorSource ? '\n\n' : ''}${code}`; const lineCount = Math.max(1, code.split('\n').length); const complete = state.status === 'passed';
  return <main className="dark-screen module-screen"><Progress screen="module" /><section className="module-title"><p className="eyebrow">Block {index + 1} of {modules.length} · {context.label}</p><h1>{module.title}</h1></section><div className="module-layout"><aside className="module-brief"><div className="plan-chip"><span>✓</span><strong>{module.planStep}</strong><div><code>input</code><b>→</b><code>safe logic</code></div></div><p><span className="bulb">◉</span>{module.hint}</p></aside><label className="code-panel"><span className="sr-only">Python code for the current module</span><span aria-hidden="true" className="line-number">{Array.from({ length: lineCount }, (_, line) => line + 1).join('\n')}</span><textarea aria-label="Python code for the current module" autoComplete="off" name="python-code" spellCheck="false" value={code} onChange={(event) => setCode(event.target.value)} /></label><aside className="run-column"><div className="run-panel"><p className="panel-title">▶ Checked run</p><div className="terminal">Test inputs: <strong>{module.inputs.join(' · ')}</strong>{state.status === 'passed' && state.output.length > 0 && <><br />Output: <strong>{state.output.join(' ')}</strong></>}</div>{state.status === 'loading' && <p className="muted-status">Preparing Python…</p>}{state.status === 'running' && <p className="muted-status">Checking your block…</p>}{state.status === 'passed' && <p className="pass-status" role="status">✓ Block complete</p>}{state.status === 'failed' && <p className="error-status" role="status">{state.message}</p>}{state.status === 'timed_out' && <p className="error-status" role="status">That took too long. The runner was reset safely.</p>}</div><div className="why-card"><p className="panel-title">✦ Why this matters</p><p>{context.fact}</p></div></aside></div><div className="module-actions">{complete ? <button className="primary-button" onClick={() => onContinue(code)} type="button">{index === modules.length - 1 ? 'Assemble the program' : 'Write the next block'} <span>→</span></button> : <button className="primary-button" disabled={state.status === 'loading' || state.status === 'running'} onClick={() => run(source, module.inputs, module.assertion, module.failureMessage)} type="button">Check this block <span>▶</span></button>}</div></main>;
}

function AssemblyScreen({ onContinue }: { onContinue: () => void }) {
  const { state, run } = usePythonRunner(); const didRun = state.status === 'passed';
  return <main className="light-screen complete-screen"><Progress screen="assembly" /><section className="complete-card"><p className="emblem" aria-hidden="true">✦</p><p className="eyebrow">Your connected program</p><h1>You built each decision, then connected the whole calculation.</h1><p>Run the sample match: 4, 3, then *.</p><pre>{assembledCalculator}</pre>{didRun && <div className="assembly-output" role="status"><strong>Result</strong><span>{state.output.join('\n') || 'Program ran successfully.'}</span></div>}{state.status === 'failed' && <p className="error-status" role="status">{state.message}</p>}{state.status === 'timed_out' && <p className="error-status" role="status">The final run timed out and was reset safely.</p>}<div className="assembly-actions">{didRun ? <button className="primary-button" onClick={onContinue} type="button">One quick transfer check <span>→</span></button> : <button className="primary-button" disabled={state.status === 'loading' || state.status === 'running'} onClick={() => run(assembledCalculator, ['4', '3', '*'])} type="button">Run the complete program <span>▶</span></button>}</div></section></main>;
}

function TransferScreen({ restart }: { restart: () => void }) {
  const [answer, setAnswer] = useState<string | null>(null); const [checked, setChecked] = useState(false); const correct = answer === 'Check that parts is not zero before dividing.';
  const options = ['Check that parts is not zero before dividing.', 'Convert the total into text before dividing.', 'Always divide by 1 when parts is zero.'];
  return <main className="dark-screen diagnostic-screen"><Progress screen="transfer" /><section className="diagnostic-content" aria-labelledby="transfer-title"><p className="eyebrow">Transfer check</p><h1 id="transfer-title">A recipe app divides a total amount by the number of parts. What must it do first?</h1><div className="answer-grid transfer-grid" role="radiogroup" aria-label="Transfer check answers">{options.map((option) => <button aria-checked={answer === option} className={`answer-card transfer-card ${answer === option ? 'answer-card--selected' : ''}`} key={option} onClick={() => { setAnswer(option); setChecked(false); }} role="radio" type="button"><span>{option}</span></button>)}</div>{checked && <div className={`feedback ${correct ? 'feedback--success' : ''}`} role="status">{correct ? 'Exactly. The same safety rule transfers to a different kind of program.' : 'Think about which value is the denominator in a division.'}</div>}</section>{checked && correct ? <button className="primary-button bottom-button" onClick={restart} type="button">Lesson complete <span>✓</span></button> : <button className="primary-button bottom-button" disabled={!answer} onClick={() => setChecked(true)} type="button">Check answer</button>}</main>;
}

export function App() {
  const [screen, setScreen] = useState<Screen>('interests'); const [domains, setDomains] = useState<string[]>([]); const [moduleIndex, setModuleIndex] = useState(0); const [completedSources, setCompletedSources] = useState<string[]>([]);
  const context = lessonContexts[domains[0] ?? 'sports']; const priorSource = useMemo(() => completedSources.join('\n\n'), [completedSources]);
  const restart = () => { setDomains([]); setModuleIndex(0); setCompletedSources([]); setScreen('interests'); };
  if (screen === 'interests') return <InterestScreen onContinue={(selected) => { setDomains(selected); setScreen('diagnostic'); }} />;
  if (screen === 'diagnostic') return <DiagnosticScreen onContinue={() => setScreen('plan')} />;
  if (screen === 'plan') return <main className="dark-screen plan-screen"><Progress screen="plan" /><PlanWorkspace context={context} onValid={() => setScreen('module')} /></main>;
  if (screen === 'module') return <ModuleScreen context={context} index={moduleIndex} key={moduleIndex} module={modules[moduleIndex]} onContinue={(source) => { setCompletedSources((current) => [...current, source]); if (moduleIndex === modules.length - 1) setScreen('assembly'); else setModuleIndex((current) => current + 1); }} priorSource={priorSource} />;
  if (screen === 'assembly') return <AssemblyScreen onContinue={() => setScreen('transfer')} />;
  return <TransferScreen restart={restart} />;
}
