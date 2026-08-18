# Software design document

## Purpose

Define the software contracts for the first CodeLah vertical slice. This document is the implementation source of truth after product requirements; changes require a reviewed update to this document and relevant ADRs.

## Proposed repository layout

```text
apps/
  web/                    # React/Vite learner application
  api/                    # Lambda handlers and tutor broker
packages/
  lesson-schema/          # Zod schemas and generated types
  lesson-engine/          # State machine and deterministic validators
  pseudocode-blocks/      # Blockly block definitions and AST converter
  python-runner/          # Pyodide Worker protocol and test harness
  tutor-contract/         # Provider-neutral model request/response contracts
  shared/                 # IDs, errors, telemetry event definitions
content/
  lessons/calculator/v1/  # lesson JSON, tests, reviewed context cards
infra/                    # CDK stacks; introduced only after approval
docs/
```

The local prototype currently implements this as a single React/Vite application under `src/`, with Blockly and a dedicated Pyodide Worker. The proposed package layout remains the target for M2+ when durable session/API boundaries are introduced; it is not yet scaffolded.

## Domain model

```ts
type InterestDomain =
  | 'sports'
  | 'stem_engineering'
  | 'arts_media'
  | 'games_storytelling'
  | 'business'
  | 'society_public_service';

type LessonState =
  | 'diagnostic'
  | 'pseudocode'
  | 'module'
  | 'assembly'
  | 'transfer'
  | 'completed';

interface AnonymousSession {
  id: string;
  lessonVersion: string;
  selectedDomains: InterestDomain[];
  state: LessonState;
  expiresAt: string;
}
```

### Lesson package

```ts
interface LessonPackage {
  id: 'python-calculator';
  version: string;
  learningObjectives: string[];
  diagnostics: DiagnosticQuestion[];
  pseudocode: PseudocodeSpecification;
  modules: CodeModule[];
  contexts: Record<InterestDomain, ContextTemplate>;
  hints: HintLadder[];
  transferCheck: TransferQuestion;
}
```

Every lesson package must be schema-validated in CI, carry a semantic version, have a complete test suite, and contain source URLs for any non-obvious factual context card.

## State machine

```mermaid
stateDiagram-v2
  [*] --> diagnostic
  diagnostic --> pseudocode: threshold met or review complete
  diagnostic --> diagnostic: retry / micro-explanation
  pseudocode --> module: valid lesson AST
  pseudocode --> pseudocode: invalid semantic plan
  module --> module: current module fails
  module --> assembly: all required modules pass
  assembly --> transfer: assembled program run
  transfer --> completed: explanation captured
  transfer --> module: remediation required
  completed --> [*]
```

The server stores the permitted state transition. The browser may render a local optimistic state, but it cannot unlock a later state until the engine validates it.

## Pseudocode builder contract

### Allowed calculator block types

| Block | Category | Constraint |
| --- | --- | --- |
| `collect_input` | input | requires a target variable |
| `convert_to_float` | transform | must consume a collected variable |
| `select_operation` | input | must precede operation branches |
| `guard_zero_division` | validation | must guard the divide branch before calculate |
| `operation_branch` | branch | only approved operators |
| `show_error` | output | required for invalid operation and zero division |
| `show_result` | output | reachable only after valid calculation |

Blockly connection checks prevent invalid visual connections. The `PseudocodeValidator` converts the workspace into a compact AST and verifies semantic invariants. Do not compare raw Blockly XML or demand a single arbitrary block order.

Example validation result:

```ts
type PlanValidation =
  | { valid: true; completedRequirements: string[] }
  | {
      valid: false;
      issue: 'missing_zero_guard' | 'input_not_converted' | 'invalid_branch';
      activeConcept: string;
      allowedHintLevel: 1 | 2 | 3;
    };
```

## Python module runner

The `python-runner` package owns a dedicated Worker:

```text
main thread -> run(module source, fixed test fixture) -> Worker
Worker -> stdout, typed error, duration, test result -> main thread
```

Requirements:

- Provide deterministic fake `input()` values from lesson tests.
- Capture stdout/stderr as bounded strings.
- Terminate and recreate the Worker after the configured time budget.
- Refuse file/network integration and never include secrets in the Worker.
- Return a typed result, not a free-form exception blob.

```ts
type RunResult =
  | { status: 'passed'; testId: string; stdout: string; durationMs: number }
  | { status: 'failed'; testId: string; category: FailureCategory; durationMs: number }
  | { status: 'timed_out'; durationMs: number };
```

## API contract

All endpoints are same-origin under `/api`; cookies are Secure, HttpOnly, SameSite=Lax, and contain only an opaque signed session token.

| Endpoint | Responsibility | Response never contains |
| --- | --- | --- |
| `POST /sessions` | establish anonymous session | user identity or model key |
| `GET /lessons/:id` | serve approved lesson version | unpublished content |
| `PUT /progress` | persist validated progress delta | arbitrary state jump |
| `POST /plans/validate` | validate compact pseudocode AST | model answer |
| `POST /tutor-moves` | return bounded teaching move | full solution or provider response |
| `DELETE /sessions/current` | delete/reset anonymous progress | other learner data |

Requests and responses are validated with Zod on both client and server. Add an idempotency key to state-changing requests.

## Tutor broker

### Input

The broker accepts only typed, minimal state:

```ts
interface TutorRequest {
  lessonId: string;
  lessonVersion: string;
  conceptId: string;
  failureCategory: FailureCategory;
  allowedHintLevel: 1 | 2 | 3;
  interestDomain?: InterestDomain;
  priorHintCount: number;
}
```

Raw learner values, full browser history, cookies, and arbitrary free-text interests are excluded. Where code context is necessary, send a sanitised AST/module representation and typed test failure, not an unrestricted transcript.

### Output and guardrails

```ts
type TutorMove =
  | { type: 'socratic_hint'; message: string; conceptId: string }
  | { type: 'micro_explanation'; message: string; conceptId: string }
  | { type: 'encouragement'; message: string }
  | { type: 'escalate'; reason: string };
```

The provider response must conform to strict JSON schema, pass a code/answer-leak detector, meet a short length limit, and refer only to the active concept. Rejection or provider failure returns the matching authored hint.

## Interest personalisation

`InterestResolver` maps selected controlled tags to a domain. `ContextComposer` selects an approved template and fact card from the lesson package. A model may rephrase an approved explanation, but cannot introduce a new field-specific fact or alter code requirements.

## Telemetry contract

Events have stable names and a `lessonVersion`, `state`, `conceptId`, `moduleId`, and safe outcome category. Do not send raw code, user inputs, raw prompts, IP addresses, or cookies to product analytics.

## Error taxonomy

`syntax_error`, `input_conversion_missing`, `invalid_operation_missing`, `zero_division_guard_missing`, `incorrect_operation_logic`, `unexpected_output`, `worker_timeout`, `provider_unavailable`, `content_invalid`.

Every learner-visible error must map to a recovery action: retry, authored hint, AI tutor move, reset current module, or future tutor escalation.
