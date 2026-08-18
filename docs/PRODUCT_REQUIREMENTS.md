# Product requirements

## Decision record

| Field | Current decision |
| --- | --- |
| Decision | Build the first CodeLah learning kernel before any account, tutor-dashboard, or multi-course platform work. |
| Customer segment | Mixed-age beginner coders in tutor-led learning sessions. |
| Job to be done | “Help me understand how a program thinks, then build it myself in a context that feels relevant.” |
| Current workflow | Generic Colab notebook, written prompt, empty code cell, tutor intervention after a learner gets stuck. |
| Pain | Blank-page anxiety, weak evidence of conceptual understanding, and tutors lack precise context before helping. |
| Desired outcome | A learner can independently plan, implement, run, and explain a beginner Python program. |
| Constraints | Mixed ages; potential minors; no sign-in initially; private AWS pilot; code correctness must not depend on an LLM. |
| Unknowns | Institution policy, pilot cohort size, supported browsers, approved region, data classification, and pilot owner. |

## Problem and hypothesis

**Observed:** learners have diverse interests and ambitions, while current tasks are generic notebooks.

**Hypothesis:** if a beginner first proves foundational understanding, then assembles pseudocode and translates one step at a time into real Python, they will complete more work independently and explain their reasoning better than with an empty notebook.

**Counter-hypothesis:** the block stage becomes a memorisation puzzle or slows down learners who already understand the material.

**MVP response:** diagnostic answers choose the amount of scaffolding; the block stage is constrained to the lesson's concepts and is followed by a short explanation check.

## First lesson: calculator

### Canonical learning objective

The learner can collect two values, convert inputs to numbers, choose an operation with `if / elif / else`, display a result, reject invalid operations, and handle division by zero.

### Learning journey

1. Pick up to three optional interest tags.
2. Answer two or three short diagnostic questions.
3. Construct valid pseudocode from snap-together blocks.
4. Convert each unlocked pseudocode block into a small Python module.
5. Run deterministic tests after every module.
6. Receive an authored or constrained Socratic hint if blocked.
7. Review the assembled program, run scenarios, and answer one transfer question.

### Context policy

The same canonical requirements apply to all variants. The context can change task language, examples, imagery, and a reviewed “why this matters” card; it cannot alter the necessary Python concepts or passing tests.

Initial domains:

| Domain | Example tags |
| --- | --- |
| Sports | football, basketball, statistics |
| STEM & engineering | semiconductors, robotics, space |
| Arts & media | music, film, design |
| Games & storytelling | games, animation, fiction |
| Business & entrepreneurship | operations, retail, finance |
| Society & public service | safety, public service, community |

## MVP requirements

### Must have

- Anonymous, expiring learner session; no sign-in or sign-up.
- Interest selection and editable preference state.
- Diagnostic question engine and mastery rules.
- Blockly-based pseudocode workspace with lesson-specific valid blocks.
- One-active-module Python editor and browser-side runner.
- Deterministic requirement and test feedback.
- Three-level authored hint ladder and bounded AI tutor move.
- Calculator lesson with at least Sports, STEM & Engineering, and Arts & Media contexts.
- Privacy-safe learning event contract and operational observability.

### Must not have

- Open-ended “ask anything” AI chat.
- AI-generated answer code exposed to a learner.
- Server-side arbitrary-code execution.
- Public tutor or author dashboard without identity and permissions.
- Career claims or unreviewed domain facts.

## Success measures

No baseline exists yet. Establish it during the pilot rather than inventing targets.

| Question | Primary measurement | Counter-measure |
| --- | --- | --- |
| Is learning more independent? | completed canonical lesson; hints-before-human-help | time-to-completion |
| Is learning real? | transfer explanation and repeat task with changed values | passing tests without explanation |
| Is context useful? | learner relevance rating | distraction or reported infantilisation |
| Does it help tutors? | time to understand a help request | extra tutor workflow burden |
| Is AI safe? | answer-leak rate in held-out evaluations | harmful/incorrect or unsupported guidance |

## Analytics contract

Record only pseudonymous, privacy-safe events:

`session_started`, `interest_selected`, `diagnostic_answered`, `pseudocode_changed`, `pseudocode_validated`, `module_started`, `module_run`, `module_passed`, `hint_requested`, `tutor_move_shown`, `lesson_completed`, `transfer_answered`.

Do not include raw free-text answers, raw model prompts, user-entered program values, cookies, API keys, or full source code in analytics by default.

## Acceptance criteria for the calculator vertical slice

- A learner cannot unlock code modules until required pseudocode semantics validate.
- An invalid block order returns a specific question, not the answer.
- Python tests cover valid operations, zero division, and invalid operations.
- A learner can reset their anonymous lesson state.
- The application works with keyboard-only navigation, including pseudocode manipulation.
- Model failure does not prevent lesson completion; authored hints remain available.

## Evidence and references

- The user-provided learner/tutor workflow is the primary customer evidence.
- Blockly supports custom blocks and language generators: [Blockly custom blocks](https://developers.google.com/blockly/guides/create-custom-blocks/blockly-developer-tools).
- Interactive in-browser editors with live output are a proven interaction pattern, not proof of CodeLah's outcome: [Codecademy platform](https://www.codecademy.com/).
- Interest personalisation should be controllable by the learner: [Khanmigo Interests](https://blog.khanacademy.org/new-khanmigo-interests/).
