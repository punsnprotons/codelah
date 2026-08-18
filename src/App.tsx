import { useEffect, useMemo, useState } from 'react';
import { PlanWorkspace } from './PlanWorkspace';
import { usePythonRunner } from './usePythonRunner';

type Screen = 'interests' | 'personalizing' | 'diagnostic' | 'plan' | 'module' | 'assembly' | 'transfer';

const interests = [
  { id: 'sports', label: 'Sports' }, { id: 'music', label: 'Music' },
  { id: 'science', label: 'Science' }, { id: 'arts', label: 'Arts' },
  { id: 'games', label: 'Games' }, { id: 'technology', label: 'Technology' },
  { id: 'film', label: 'Film' }, { id: 'fashion', label: 'Fashion' },
];

const lessonContexts: Record<string, { label: string; project: string; fact: string }> = {
  sports: { label: 'Sports context', project: 'match calculator', fact: 'Sports dashboards convert incoming score data before calculating results.' },
  music: { label: 'Music context', project: 'setlist calculator', fact: 'Music apps turn typed durations and counts into reliable setlists.' },
  science: { label: 'Science context', project: 'measurement calculator', fact: 'Science tools validate measurements before using them in a calculation.' },
  arts: { label: 'Arts context', project: 'palette calculator', fact: 'Creative tools turn typed settings into reliable values before rendering.' },
  games: { label: 'Games context', project: 'game-score calculator', fact: 'Game systems check player inputs before updating a score.' },
  technology: { label: 'Technology context', project: 'device calculator', fact: 'Technology tools validate values before they make a calculation.' },
  film: { label: 'Film context', project: 'scene calculator', fact: 'Film tools calculate timings from the settings a creator enters.' },
  fashion: { label: 'Fashion context', project: 'size calculator', fact: 'Fashion tools check measurements before suggesting a size.' },
};

type InspirationCard = { alt: string; image: string; title: string; copy: string };

const sportsInspiration: InspirationCard[] = [
  { image: '/images/inspiration/sports-computer-vision.png', alt: 'A footballer training beside a computer-vision monitor that maps their movement.', title: 'See movement, frame by frame', copy: 'Computer vision turns training video into movement data athletes can learn from.' },
  { image: '/images/inspiration/sports-data-software.png', alt: 'A coach and athlete reviewing a code editor and performance dashboard on a laptop.', title: 'Turn training into insight', copy: 'Sports software turns sessions into patterns that teams can understand and act on.' },
  { image: '/images/inspiration/sports-wearable-code.png', alt: 'An athlete fitting a wearable sensor beside a tablet with a code-and-data interface.', title: 'Wearable code, real feedback', copy: 'Sensors collect signals; code turns them into feedback that helps people train safely.' },
];

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
  const active = { interests: 0, personalizing: 1, diagnostic: 1, plan: 2, module: 3, assembly: 4, transfer: 5 }[screen];
  return <div className="progress" aria-label={`Step ${active + 1} of 6`}>{Array.from({ length: 6 }).map((_, index) => <span className={index <= active ? 'progress__segment progress__segment--active' : 'progress__segment'} key={index} />)}</div>;
}

function InterestIcon({ interest }: { interest: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, strokeWidth: 1.8 };
  if (interest === 'sports') return <svg aria-hidden="true" viewBox="0 0 24 24"><circle {...common} cx="12" cy="12" r="8" /><path {...common} d="M5.2 8.1c3.4.1 6.5 1.4 8.5 3.9 1.6 2 2.5 4.3 2.7 6.7M18.8 7.1c-2.8 1-4.6 2.9-5.3 5.5-.8 3-2.8 4.7-5.7 5.2M12 4v16" /></svg>;
  if (interest === 'music') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M15.5 4.5v10.2a3.1 3.1 0 1 1-1.8-2.8V7l5.2-1.3v8a3.1 3.1 0 1 1-1.8-2.8V4Z" /></svg>;
  if (interest === 'science') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M9 3h3l1.1 5.4-4.2 1.1L7.6 4.1 9 3Z" /><path {...common} d="m9.1 10.6 4.1-1.1 1 3.8a4.4 4.4 0 0 1-7.7 4.1" /><path {...common} d="M5 20h14M8.2 17.2 6 20M16 6.5l1.2 1.2M16.8 3.5v1.8" /><circle {...common} cx="8.7" cy="14.3" r="1.2" /></svg>;
  if (interest === 'arts') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="m15.7 3.5 4.8 4.8-4.3 4.3-4.8-4.8 4.3-4.3Z" /><path {...common} d="m11.4 7.8 4.8 4.8-3.4 3.4a4 4 0 0 1-2.8 1.2H6.5l.6-3.5a4 4 0 0 1 1.1-2.3l3.2-3.6Z" /><path {...common} d="M6.5 17.2c.9-1 2.1-1.4 3.5-1.2" /></svg>;
  if (interest === 'games') return <svg aria-hidden="true" viewBox="0 0 24 24"><rect {...common} x="4" y="6" width="16" height="11" rx="2" /><path {...common} d="M8 21h8M12 17v4M8 10v3m-1.5-1.5h3" /><circle {...common} cx="16" cy="10.5" r=".7" /><circle {...common} cx="17.8" cy="12.5" r=".7" /></svg>;
  if (interest === 'technology') return <svg aria-hidden="true" viewBox="0 0 24 24"><rect {...common} x="6" y="6" width="12" height="12" rx="2" /><path {...common} d="M9 2v4m3-4v4m3-4v4M9 18v4m3-4v4m3-4v4M2 9h4m-4 3h4m-4 3h4m12-6h4m-4 3h4m-4 3h4" /></svg>;
  if (interest === 'film') return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M4 9h16v10H4zM4 9l2-4h4l2 4 2-4h4l2 4" /><path {...common} d="M4 13h16M9 16h6" /></svg>;
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path {...common} d="M12 4a3 3 0 0 0-3 3v1L4.5 13.5 3 17h18l-1.5-3.5L15 8V7a3 3 0 0 0-3-3Z" /><path {...common} d="M5 17h14" /></svg>;
}

function CodeLahMascot() {
  return <svg aria-hidden="true" className="codelah-mascot" viewBox="0 0 120 120"><ellipse className="codelah-mascot__shadow" cx="60" cy="103" rx="30" ry="6" /><g className="codelah-mascot__body"><path d="M23 57c0-22 16-38 37-38s37 16 37 38c0 23-15 42-37 42S23 80 23 57Z" fill="#4cd964" /><path d="M73 23c15 5 24 18 24 34 0 23-15 42-37 42-6 0-12-2-17-5 22 0 40-18 40-40 0-12-4-23-10-31Z" fill="#c8f545" /><path d="M35 57c0-9 7-16 16-16h18c9 0 16 7 16 16v10c0 9-7 16-16 16H51c-9 0-16-7-16-16V57Z" fill="#fff" /><circle cx="53" cy="61" r="4" fill="#172019" /><circle cx="69" cy="61" r="4" fill="#172019" /><path d="M52 72c5 5 11 5 16 0" fill="none" stroke="#172019" strokeLinecap="round" strokeWidth="3" /><path d="m20 69-9 8m89-8 9 8" fill="none" stroke="#4cd964" strokeLinecap="round" strokeWidth="7" /></g></svg>;
}

function playInterestSelectionSound() {
  if (!window.AudioContext) return;
  const context = new window.AudioContext();
  const playTone = (frequency: number, start: number) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.055, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.17);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.18);
  };
  const now = context.currentTime;
  playTone(660, now);
  playTone(880, now + 0.09);
  window.setTimeout(() => { void context.close(); }, 400);
}

function InterestScreen({ onContinue }: { onContinue: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => {
    if (!selected.includes(id)) playInterestSelectionSound();
    setSelected([id]);
  };
  return <main className="light-screen onboarding-screen"><Progress screen="interests" /><section className="onboarding-content" aria-labelledby="interest-title"><div className="interest-heading"><CodeLahMascot /><h1 id="interest-title">What are you curious about?</h1></div><div className="interest-grid">{interests.map((interest) => { const isSelected = selected.includes(interest.id); return <button aria-pressed={isSelected} className={`interest-card interest-card--${interest.id} ${isSelected ? 'interest-card--selected' : ''}`} key={interest.id} onClick={() => toggle(interest.id)} type="button"><span className="interest-card__glyph"><InterestIcon interest={interest.id} /></span><span className="interest-card__label">{interest.label}</span><span aria-hidden="true" className="interest-card__check"><svg viewBox="0 0 24 24"><path d="m5.5 12.5 4.2 4.1 8.8-9" /></svg></span></button>; })}</div></section><div className="onboarding-actions"><button aria-label="Go back" className="journey-back" onClick={() => window.history.back()} type="button">Back</button><button className="primary-button onboarding-button" disabled={!selected.length} onClick={() => onContinue(selected)} type="button">Continue</button></div></main>;
}

function PersonalizingScreen({ context, onBack, onContinue }: { context: { label: string; project: string; fact: string }; onBack: () => void; onContinue: () => void }) {
  const topic = context.label.replace(' context', '');
  const role = ({ Sports: 'athlete', Music: 'music creator', Science: 'scientist', Arts: 'artist', Games: 'game creator', Technology: 'builder', Film: 'filmmaker', Fashion: 'designer' } as Record<string, string>)[topic] ?? 'creator';
  const [ready, setReady] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const inspiration = sportsInspiration;
  const currentInspiration = inspiration[slideIndex];
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!ready) return undefined;
    const carouselTimer = window.setInterval(() => setSlideIndex((current) => (current + 1) % inspiration.length), 5200);
    return () => window.clearInterval(carouselTimer);
  }, [ready, inspiration.length]);
  if (!ready) return <main className="light-screen personalizing-screen personalizing-loading-screen"><Progress screen="personalizing" /><section className="transition-loading" aria-live="polite"><CodeLahMascot /><span className="transition-loading__icon"><InterestIcon interest={topic.toLowerCase()} /></span><h1>Finding the code behind {topic.toLowerCase()}.</h1><p>Every field has a story that code can help you shape.</p><div aria-hidden="true" className="transition-loading__bar"><span /></div></section><div className="onboarding-actions"><button aria-label="Go back" className="journey-back" onClick={onBack} type="button">Back</button></div></main>;
  return <main className="light-screen personalizing-screen"><Progress screen="personalizing" /><section className="personalizing-panel" aria-live="polite"><CodeLahMascot /><h1>Let’s help you become the best {role} you can be—with code.</h1><p className="personalizing-copy">Here’s how code is already changing {topic.toLowerCase()}.</p><section aria-label={`${topic} inspiration`} className="inspiration-carousel"><article className="inspiration-carousel__card" key={currentInspiration.title}><img alt={currentInspiration.alt} className="inspiration-carousel__image" src={currentInspiration.image} /><div className="inspiration-carousel__copy"><p>Built with code</p><h2>{currentInspiration.title}</h2><span>{currentInspiration.copy}</span></div></article><div aria-label={`${slideIndex + 1} of ${inspiration.length}`} className="carousel-dots">{inspiration.map((item, index) => <button aria-label={`Show inspiration ${index + 1}: ${item.title}`} aria-pressed={index === slideIndex} className={index === slideIndex ? 'carousel-dots__dot carousel-dots__dot--active' : 'carousel-dots__dot'} key={item.title} onClick={() => setSlideIndex(index)} type="button" />)}</div></section></section><div className="onboarding-actions personalizing-actions"><button aria-label="Go back" className="journey-back" onClick={onBack} type="button">Back</button><button className="primary-button onboarding-button" onClick={onContinue} type="button">Continue</button></div></main>;
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
  if (screen === 'interests') return <InterestScreen onContinue={(selected) => { setDomains(selected); setScreen('personalizing'); }} />;
  if (screen === 'personalizing') return <PersonalizingScreen context={context} onBack={() => setScreen('interests')} onContinue={() => setScreen('diagnostic')} />;
  if (screen === 'diagnostic') return <DiagnosticScreen onContinue={() => setScreen('plan')} />;
  if (screen === 'plan') return <main className="dark-screen plan-screen"><Progress screen="plan" /><PlanWorkspace context={context} onValid={() => setScreen('module')} /></main>;
  if (screen === 'module') return <ModuleScreen context={context} index={moduleIndex} key={moduleIndex} module={modules[moduleIndex]} onContinue={(source) => { setCompletedSources((current) => [...current, source]); if (moduleIndex === modules.length - 1) setScreen('assembly'); else setModuleIndex((current) => current + 1); }} priorSource={priorSource} />;
  if (screen === 'assembly') return <AssemblyScreen onContinue={() => setScreen('transfer')} />;
  return <TransferScreen restart={restart} />;
}
