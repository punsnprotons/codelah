# Accessibility acceptance checklist

## Scope

This is the remaining M1 manual acceptance check. Run it on the approved pilot browser/device before declaring M1 complete.

## Keyboard-only journey

1. Start on the interest screen without using a pointer.
2. Select one interest, continue, answer the diagnostic, and open the keyboard planner using only Tab, Enter, and Space.
3. Build the complete plan, run each code module, assemble the program, answer the transfer check, and reset.
4. Confirm every focus indicator is visible, focus is never obscured, disabled controls cannot be activated, and the order follows the visual lesson flow.

## Screen-reader journey

1. With VoiceOver (macOS/iOS), NVDA (Windows), or an approved equivalent, traverse the same journey.
2. Confirm each screen announces one clear heading, interest cards announce selection, answer choices announce checked state, plan controls announce their names and disabled state, and success/error messages are announced once.
3. Confirm the code editor has an understandable label and does not expose hidden line-number decoration as editable content.
4. Record browser, operating system, assistive technology, version, tester, date, result, and any issue with a reproduction path.

## Exit criteria

- No blocker prevents a learner from completing the canonical keyboard path.
- No critical or high-severity screen-reader ambiguity remains.
- Any non-blocking issue has an owner and a scheduled remediation decision.

## Evidence record — complete on the pilot device

Run the local release build with `bun run build && bun run preview -- --host 127.0.0.1 --port 5173`, then record one row per journey. Do not mark a row as passed from source review or automated tests alone.

| Date | Tester | Browser + version | OS + version | Assistive technology + version | Journey | Result | Issue / reproduction path |
| --- | --- | --- | --- | --- | --- | --- | --- |
| _YYYY-MM-DD_ | _name_ | _e.g. Safari 18_ | _e.g. macOS 15_ | _e.g. VoiceOver, built in_ | Keyboard-only | _pass / fail_ | _required if fail_ |
| _YYYY-MM-DD_ | _name_ | _e.g. Safari 18_ | _e.g. macOS 15_ | _e.g. VoiceOver, built in_ | Screen-reader | _pass / fail_ | _required if fail_ |

For a failure, include the screen, exact control or announcement, expected behavior, observed behavior, and the shortest repeatable route. A pass requires completing the entire journey through reset.

## Evidence log

### 2026-08-18 — semantic preflight (not a screen-reader substitute)

- The local release preview exposes one `main` landmark, a clear screen heading, native interest buttons, selected-state semantics (`aria-pressed`), and native answer-radio semantics (`role="radio"` with `aria-checked`). The code editor has the explicit label `Python code for the current module`; decorative line numbers are hidden from assistive technology.
- Chromium regression also checks those named/selected controls, keyboard-plan activation with Enter, live status feedback for malformed code, and recovery from timeout states.
- The required macOS VoiceOver run could not be executed in this workspace because macOS Computer Use permission is not granted. No VoiceOver speech, rotor, or focus-order result is claimed here.

**Remaining acceptance action:** a tester with VoiceOver/NVDA access must complete the two manual journeys above on an approved pilot browser/device and fill in the required environment and result details before M1 can exit.
