# ADR 0003: Constrain AI to typed teaching moves

**Status:** Accepted

## Context

AI can make explanations relevant and responsive, but a generic code chatbot can leak answers, create unsupported facts, and replace tutor judgment.

## Decision

The deterministic lesson engine remains the source of truth. The model receives only minimal typed learning state and returns schema-validated teaching moves. Groq is the first evaluation candidate behind a provider-neutral broker; authored hints are the mandatory fallback.

## Consequences

- Model/provider changes do not alter mastery rules or lesson packages.
- A model outage cannot block lesson completion.
- Prompt/schema/provider changes require evaluation against answer-leak and misconception cases.
- Raw learner context and model bodies are not retained in application logs.
