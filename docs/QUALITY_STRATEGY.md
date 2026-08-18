# Quality strategy

## Quality bar

CodeLah is complete only when learners can complete the expected flow safely, accessibly, and without model availability. A passing build alone is insufficient.

## Current verification evidence — 2026-08-18

- `bun run test:lesson` runs the exact assembled calculator source through addition, subtraction, multiplication, division, division by zero, and an invalid operator.
- `bun run build` passes.
- `bun run test:e2e` passes six Chromium cases: diagnostic recovery, out-of-order plan recovery, Enter-key planner activation, malformed Python, timeout/reset, and full lesson/reset.
- A local browser smoke completed the full learner journey using the native-button planner and confirmed reset.

These are local M1 evidence only. Manual keyboard-only/screen-reader review remains open. Offline support is not currently implemented; it needs a separately verified caching design before M1 can claim post-load offline use.

## Test layers

| Layer | Examples | Gate |
| --- | --- | --- |
| Unit | lesson-schema parsing, pseudocode AST validation, interest resolver, answer-leak detector | all required rules covered |
| Worker integration | input fixtures, output capture, syntax failure, timeout/reset | no unbounded Worker execution |
| API integration | session TTL, state transition rejection, idempotency, schema validation | no arbitrary state unlock |
| Browser E2E | full calculator journey, reset, fallback hints, keyboard flow | Chromium plus approved pilot browser matrix |
| Accessibility | keyboard drag/drop alternative, focus order, labels, contrast, reduced motion | manual and automated verification |
| Security | secret absence in client bundle/logs, CSP, CORS, request limits | review before pilot |
| AI evaluation | answer solicitation, misconception response, malformed output, provider failure | zero known answer leaks; deterministic fallback works |

## Pseudocode validator cases

- valid complete calculator plan;
- division branch missing guard;
- values collected but not converted;
- invalid operation has no recovery;
- result shown before valid operation;
- nested guard becomes disconnected;
- semantically equivalent approved ordering.

## Code runner cases

- addition, subtraction, multiplication, division;
- division by zero;
- invalid operation;
- float conversion;
- syntax error;
- runaway loop timeout;
- reset after timeout;
- output exceeds bounded capture size.

## AI evaluation rules

- Each case specifies permitted move type, forbidden phrases/code, and expected concept focus.
- A model response is treated as untrusted input.
- Run evaluations on every prompt, schema, provider, or model-version change.
- Store only evaluation IDs, outcome categories, and redacted/digested evidence—not raw learner prompts.

## Release gate

Before any pilot deployment:

1. Required checks pass on the exact immutable build artifact.
2. No high-severity dependency or secret finding remains unresolved.
3. S3/CloudFront/API configuration is independently checked.
4. WAF access restriction, metrics, alarms, rollback method, and model fallback are rehearsed in non-production.
5. The pilot owner approves access, support, data handling, and rollback criteria.
