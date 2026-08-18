# CodeLah

CodeLah is a browser-first learning product that helps beginners progress from understanding a coding concept to pseudocode, real Python, and a working program. Lessons adapt their *context* to a learner's chosen interests while keeping the learning objective and correctness criteria fixed.

## Current status

The first local, anonymous learning slice is implemented. It contains the interest picker, a formative concept check, a Blockly pseudocode plan, and a safe in-browser Python runner for the first calculator module. No AWS resources, authentication, or production data exist.

The first vertical slice is a personalised Python calculator lesson:

```text
interest selection -> concept check -> pseudocode blocks
-> code one block at a time -> deterministic tests
```

Run it locally with `bun install` followed by `bun run dev`.

## Product principles

- Teach reasoning before syntax.
- Learners build real Python; the product never silently completes their work.
- Pseudocode, code execution, and mastery rules are deterministic.
- AI may personalise explanations and questions; it never determines correctness or supplies a complete solution.
- Interest context is explicit, editable, and optional.
- Start with anonymous sessions only. Sign-up, sign-in, tutor, and authoring surfaces are out of scope for the initial core product.

## Documentation

| Document | Purpose |
| --- | --- |
| [Product requirements](docs/PRODUCT_REQUIREMENTS.md) | Customer problem, MVP scope, requirements, and measures |
| [System architecture](docs/SYSTEM_ARCHITECTURE.md) | Runtime, AWS topology, data, security, and decisions |
| [Software design](docs/SOFTWARE_DESIGN.md) | Interfaces, state machine, lesson schema, and component contracts |
| [Roadmap](docs/ROADMAP.md) | Outcome-led milestones and decision gates |
| [Runbook](docs/RUNBOOK.md) | Build, release, incident, rollback, and operational procedures |
| [Security and privacy](docs/SECURITY_PRIVACY.md) | Threat model, data boundaries, and access controls |
| [Quality strategy](docs/QUALITY_STRATEGY.md) | Test, accessibility, and AI-evaluation requirements |
| [ADRs](docs/adr) | Durable architectural decisions |

## Deliberate non-goals for the first build

- No account system, social feed, leaderboard, payments, or public sharing.
- No full Scratch clone or visual-programming language.
- No server-side execution of untrusted learner Python.
- No unbounded chatbot or live-web research inside lessons.
- No AWS provisioning before the unresolved environment decisions in the runbook are approved.

## Inspiration and licensing boundary

Use the supplied Scratch/Blockly clone as behaviour inspiration only; its repository page does not display a licence. Build directly on the maintained Apache-2.0 licensed [Blockly](https://github.com/RaspberryPiFoundation/blockly) package. Do not adopt the AGPL-3.0 `scratch-gui` application.
