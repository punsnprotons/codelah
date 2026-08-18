# Product roadmap

## North-star outcome

A novice finishes a relevant first coding task independently and can explain the logic behind it—not merely copy a passing solution.

## Milestones

| Milestone | Outcome | Scope | Exit decision |
| --- | --- | --- | --- |
| M0: Design baseline | Team can build without re-deciding product/system fundamentals | documentation, lesson schema, ADRs, pilot assumptions | approve implementation scope |
| M1: Deterministic learning kernel | Calculator works locally end-to-end with no model dependency | onboarding, diagnostic, Blockly plan, modules, Pyodide tests, assembled run | functional acceptance; manual screen-reader review deferred |
| M2: Public AWS preview foundation | Zero-data core product is safely reachable by adult preview users | IaC, static edge controls, cost gate, rollback evidence | deploy only after owner review |
| M3: Constrained AI tutor | Learners receive bounded, relevant help without answer leakage | tutor broker, provider adapter, authored fallback, evaluation suite | answer-leak and quality gates pass |
| M4: Live pilot | Measure learning and tutor outcomes against current notebook workflow | one cohort, observed sessions, feedback, support path | scale, iterate, pause, or retire |
| M5: Expansion decision | Choose whether to add new lessons, accounts, or tutor tools | evidence-led prioritisation | roadmap approval |

## Current milestone state — 2026-08-18

**M1 functional acceptance is complete; M2 static delivery and the first reviewed application artefact are deployed.** The deployed CloudFront URL passed HTTP, private-origin, and browser onboarding/diagnostic smoke checks. The local calculator flow has also been exercised through interest selection, diagnostic, keyboard-plan alternative, five independently checked Python modules, assembly, transfer check, and reset.

| M1 area | Evidence | Status |
| --- | --- | --- |
| Calculator behavior | `bun run test:lesson` verifies addition, subtraction, multiplication, division, zero division, and invalid-operation output against the exact assembled source. | passed locally |
| Build integrity | `bun run build` passes. | passed locally |
| Browser regression | `bun run test:e2e` passes eight Chromium cases: named/selected onboarding and diagnostic controls, full Tab-and-Enter lesson/reset, plan recovery, keyboard planner activation, labelled code editor/live error feedback, timeout/reset, and full lesson/reset. | passed locally |
| Keyboard-plan alternative | Native-button planner provides a non-drag path; browser regression completes the full alternate path with Tab and Enter only. Local semantic preflight confirms native controls and state semantics. | passed locally |
| Offline support decision | **Deferred from M1.** No observed pilot requirement justifies cache complexity yet; the Chromium cache experiment was rejected after its offline regression failed. Revisit only with pilot device/network evidence. | documented deferral |
| Timeout and malformed-code recovery | Browser regression verifies malformed code remains locked and a runaway Worker terminates then recovers. | passed locally |
| Accessibility code review | Native buttons, labels, visible focus, reduced-motion rule, touch interaction, and alternate planner reviewed; inert back control removed. Local semantic and keyboard regressions passed. VoiceOver/NVDA review is deliberately deferred; it is required before an institutional education release or any release that collects learner data. | deferred — does not block zero-data public preview planning |

### Next step

Complete the **M2 operational acceptance**:

1. Select the CloudFront Free plan in the console if eligible; otherwise record the approved fallback cost path.
2. Rehearse rollback to a prior reviewed artefact and measure the detection window.
3. Complete a live full-lesson browser smoke, including Worker timeout/reset and absence of learner-data network calls.

## M1 acceptance criteria

- Offline support is deliberately deferred pending pilot device/network evidence; it is not an M1 exit criterion.
- Diagnostic, pseudocode, module, assembly, and transfer states are complete.
- Every requirement has deterministic tests.
- Keyboard-only learner path passes.
- No model/API key is needed to complete the lesson.
- Reset works without corrupting state.
- Manual VoiceOver/NVDA validation is deferred until before an institutional education release or any release that collects learner data.

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
| Browser-memory-only lessons prevent continuity and product measurement. | Accept this preview limitation; do not add sessions, analytics, or tutor tools until their data/consent model exists. |
| The first lesson might be too narrow. | It is intentionally narrow: prove the learning kernel before building a curriculum platform. |
