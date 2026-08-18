# ADR 0001: Use Blockly directly for pseudocode construction

**Status:** Accepted

## Context

The product needs a tactile, constrained block experience before learners write Python. The supplied Scratch/Blockly clone demonstrates a relevant interaction but is not a suitable dependency or code source without a stated licence.

## Decision

Use the maintained Apache-2.0 Blockly library directly. Define a small custom vocabulary for each lesson and convert its workspace to a lesson-specific AST. Use Blockly only for pseudocode planning, not as a general-purpose Scratch environment.

## Consequences

- Reuse mature drag/drop, connection, keyboard, serialisation, and generator primitives.
- Keep CodeLah's product UI and lesson semantics independent of Scratch.
- Implement semantic validation ourselves; visual connection alone does not prove learning intent.
- Avoid AGPL dependencies and unauthorised source copying.

## References

- [Blockly repository](https://github.com/RaspberryPiFoundation/blockly)
- [Custom block documentation](https://developers.google.com/blockly/guides/create-custom-blocks/blockly-developer-tools)
