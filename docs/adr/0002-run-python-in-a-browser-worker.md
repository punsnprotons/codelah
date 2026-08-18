# ADR 0002: Run beginner Python locally in a browser Worker

**Status:** Accepted for MVP

## Context

Learners need immediate execution feedback, but executing arbitrary code in the API runtime would expose cloud resources and add expensive sandboxing complexity.

## Decision

Use Pyodide in a dedicated browser Web Worker with fixed test fixtures, bounded output, and a termination/recreate timeout. Treat client results as learning feedback, not authoritative credentialing or grading.

## Consequences

- No learner code executes in Lambda/ECS or receives cloud credentials.
- Fast local feedback and simple offline-capable lesson flow.
- A later authoritative assessment feature needs a separately designed isolated runner.
- Browser compatibility and Worker-timeout behaviour become explicit quality gates.
