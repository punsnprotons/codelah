# Product roadmap

## North-star outcome

A novice finishes a relevant first coding task independently and can explain the logic behind it—not merely copy a passing solution.

## Milestones

| Milestone | Outcome | Scope | Exit decision |
| --- | --- | --- | --- |
| M0: Design baseline | Team can build without re-deciding product/system fundamentals | documentation, lesson schema, ADRs, pilot assumptions | approve implementation scope |
| M1: Deterministic learning kernel | Calculator works locally end-to-end with no model dependency | onboarding, diagnostic, Blockly plan, modules, Pyodide tests, assembled run | internal acceptance and accessibility pass |
| M2: Private AWS pilot foundation | Core product is safely reachable by approved pilot devices | IaC, edge controls, anonymous sessions, metrics, secrets, rollback evidence | deploy only after environment approvals |
| M3: Constrained AI tutor | Learners receive bounded, relevant help without answer leakage | tutor broker, provider adapter, authored fallback, evaluation suite | answer-leak and quality gates pass |
| M4: Live pilot | Measure learning and tutor outcomes against current notebook workflow | one cohort, observed sessions, feedback, support path | scale, iterate, pause, or retire |
| M5: Expansion decision | Choose whether to add new lessons, accounts, or tutor tools | evidence-led prioritisation | roadmap approval |

## M1 acceptance criteria

- Calculator lesson works offline after assets load.
- Diagnostic, pseudocode, module, assembly, and transfer states are complete.
- Every requirement has deterministic tests.
- Keyboard-only learner path passes.
- No model/API key is needed to complete the lesson.
- Reset works without corrupting state.

## M3 model gate

Create a representative evaluation set before enabling the model for learners:

- misconception cases for every calculator concept;
- attempts to solicit the final solution;
- ambiguous or off-topic requests;
- interest-context requests;
- provider timeout, malformed JSON, and refusal cases.

Scale only when the model reliably returns permitted teaching moves, has zero known full-answer disclosures in the evaluation suite, and the authored fallback succeeds when the model is unavailable.

## Pilot measures

Baseline measurements are currently unknown. During M4 measure:

- canonical task completion;
- time to first independent successful run;
- tutor interventions per completed task;
- transfer/explanation quality;
- learner relevance and confidence rating;
- AI fallback and answer-leak incidents;
- accessibility and device failures.

## Explicit deferrals

- accounts, class rosters, tutor dashboard, authoring system, public sharing, streaks, payments, and multi-language support;
- arbitrary project generation;
- server-side submission grading;
- broad domain expansion before the calculator pilot proves the core learning loop.

## 10th-man review

| Challenge | Response |
| --- | --- |
| Blocks can become a game of ordering cards. | Validate semantic understanding, ask a transfer question, and provide an advanced route after diagnostics. |
| Personalisation could be superficial. | Preserve one learning objective/test suite and measure relevance separately from mastery. |
| AI could leak answers. | Keep progression deterministic; constrain model output and retain authored fallback. |
| Anonymous sessions prevent tutoring continuity. | Accept this MVP limitation; do not expose tutor tools until an identity/consent model exists. |
| The first lesson might be too narrow. | It is intentionally narrow: prove the learning kernel before building a curriculum platform. |
