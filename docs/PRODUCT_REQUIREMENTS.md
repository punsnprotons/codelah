# Product requirements

## Decision record

| Field | Current decision |
| --- | --- |
| Decision | Build the first CodeLah learning kernel before any account, tutor-dashboard, or multi-course platform work. |
| Customer segment | Adult (18+) beginner coders in tutor-led learning sessions and a zero-data public preview. |
| Job to be done | “Help me understand how a program thinks, then build it myself in a context that feels relevant.” |
| Current workflow | Generic Colab notebook, written prompt, empty code cell, tutor intervention after a learner gets stuck. |
| Pain | Blank-page anxiety, weak evidence of conceptual understanding, and tutors lack precise context before helping. |
| Desired outcome | A learner can independently plan, implement, run, and explain a beginner Python program. |
| Constraints | 18+ eligibility policy; no sign-in; no learner-data collection or persistence; public CloudFront preview with private AWS origin; code correctness must not depend on an LLM. |
| Unknowns | Institution policy, pilot cohort size, supported browsers, custom-domain timing, and future data-collection requirements. |

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

### Current local implementation status — 2026-08-18

Implemented locally: controlled interest tags, one formative diagnostic, Blockly drag plan, native-button planning alternative, five calculator modules, deterministic browser-side Python checks, assembled run, one transfer question, and reset.

Not yet implemented: expiring anonymous persistence, editable saved preferences, three-level authored hint ladder, constrained AI tutor move, analytics, operational observability, and server-validated state transitions. These remain requirements for the later pilot—not claims about the current local build.

Offline use is deliberately deferred from M1: the tutor-led pilot has no observed offline requirement, and no caching approach will ship until pilot device/network evidence justifies it and a browser regression passes.

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

- Browser-memory lesson state; no sign-in, sign-up, anonymous server session, or persistent browser storage.
- Interest selection and editable preference state.
- Diagnostic question engine and mastery rules.
- Blockly-based pseudocode workspace with lesson-specific valid blocks.
- One-active-module Python editor and browser-side runner.
- Deterministic requirement and test feedback.
- Three-level authored hint ladder; no external AI tutor in M2.
- Calculator lesson with at least Sports, STEM & Engineering, and Arts & Media contexts.
- Deterministic local learner flow with no application analytics or learner telemetry.

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
| Is learning more independent? | observed canonical lesson completion in a future consented pilot | time-to-completion |
| Is learning real? | transfer explanation and repeat task with changed values | passing tests without explanation |
| Is context useful? | future consented learner relevance rating | distraction or reported infantilisation |
| Does it help tutors? | time to understand a help request | extra tutor workflow burden |
| Is an AI tutor safe? | answer-leak rate in a future held-out evaluation | harmful/incorrect or unsupported guidance |

## Analytics boundary

M2 records no application analytics or learner events. The event names previously proposed for a future pilot are not an implementation authorization. Before any event collection, approve the purpose, learner notice/consent model, data classification, retention/deletion, access controls, and measurement plan; never include raw free text, code, program values, cookies, IP addresses, API keys, or full model prompts.

## Acceptance criteria for the calculator vertical slice

- A learner cannot unlock code modules until required pseudocode semantics validate.
- An invalid block order returns a specific question, not the answer.
- Python tests cover valid operations, zero division, and invalid operations.
- A learner can reset their in-memory lesson state.
- The application works with keyboard-only navigation, including pseudocode manipulation.
- The lesson completes without a model; authored hints remain available.

## Evidence and references

- The user-provided learner/tutor workflow is the primary customer evidence.
- Blockly supports custom blocks and language generators: [Blockly custom blocks](https://developers.google.com/blockly/guides/create-custom-blocks/blockly-developer-tools).
- Interactive in-browser editors with live output are a proven interaction pattern, not proof of CodeLah's outcome: [Codecademy platform](https://www.codecademy.com/).
- Interest personalisation should be controllable by the learner: [Khanmigo Interests](https://blog.khanacademy.org/new-khanmigo-interests/).
