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
