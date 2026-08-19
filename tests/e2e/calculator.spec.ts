import { expect, test } from '@playwright/test';

async function tabTo(page: import('@playwright/test').Page, target: import('@playwright/test').Locator) {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (await target.evaluate((element) => document.activeElement === element)) return;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Could not reach ${await target.getAttribute('aria-label') ?? await target.textContent()} with Tab.`);
}

async function activateWithKeyboard(page: import('@playwright/test').Page, target: import('@playwright/test').Locator) {
  await expect(target).toBeEnabled({ timeout: 12_000 });
  await tabTo(page, target);
  await page.keyboard.press('Enter');
}

async function continueFromPersonalization(page: import('@playwright/test').Page) {
  await expect(page.getByRole('heading', { name: /best .*code/i })).toBeVisible({ timeout: 6_000 });
  const continueButton = page.getByRole('button', { name: 'Continue', exact: true });
  await expect(continueButton).toBeEnabled({ timeout: 6_000 });
  await continueButton.click();
  await expect(page.getByRole('heading', { name: 'Here’s what you’ll learn.' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Before we build, a quick check.' })).toBeVisible();
  await page.getByRole('button', { name: 'Start quiz' }).click();
}

async function completeFoundationQuiz(page: import('@playwright/test').Page) {
  const answers = ['Text', 'Convert text to numbers', 'Show a helpful error'];
  for (let index = 0; index < answers.length; index += 1) {
    await page.getByRole('radio', { name: answers[index] }).click();
    await page.getByRole('button', { name: 'Check answer' }).click();
    await expect(page.getByRole('status')).toContainText('Exactly.');
    if (index < answers.length - 1) await expect(page.getByText(`Question ${index + 2} of 3`)).toBeVisible({ timeout: 3_000 });
  }
  await expect(page.getByRole('heading', { name: 'You’re ready to plan it out.' })).toBeVisible();
  await page.getByRole('button', { name: 'Start planning' }).click();
}

async function reachKeyboardPlanner(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await continueFromPersonalization(page);
  await completeFoundationQuiz(page);
  await page.getByRole('button', { name: 'Use keyboard planner' }).focus();
  await page.keyboard.press('Enter');
}

async function reachBlockPlanner(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await continueFromPersonalization(page);
  await completeFoundationQuiz(page);
}

async function reachFirstModule(page: import('@playwright/test').Page) {
  await reachKeyboardPlanner(page);
  for (const name of ['Get first score', 'Get second score', 'Choose an operation', 'Check for division by zero', 'Show result or helpful error']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  await page.getByRole('button', { name: 'Submit plan' }).click();
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('heading', { name: /Turn “Get first score” into Python/i })).toBeVisible();
  await expect(page.getByRole('list', { name: 'Pseudocode plan' })).toContainText('Get first score');
  await expect(page.getByRole('button', { name: /Check this block/ })).toBeEnabled();
}

test('exposes selected interests and diagnostic choices as named native controls', async ({ page }) => {
  await page.goto('/');
  const sports = page.getByRole('button', { name: 'Sports' });
  await sports.focus();
  await expect(sports).toBeFocused();
  await expect(sports).toHaveAttribute('aria-pressed', 'false');
  await sports.click();
  await expect(sports).toHaveAttribute('aria-pressed', 'true');
  const science = page.getByRole('button', { name: 'Science' });
  await science.click();
  await expect(sports).toHaveAttribute('aria-pressed', 'false');
  await expect(science).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /Continue/ })).toBeEnabled();

  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page.getByText('Finding the code behind science.')).toBeVisible();
  await expect(page.getByRole('heading', { name: /best scientist you can be/i })).toBeVisible({ timeout: 6_000 });
  await page.getByRole('button', { name: 'Go back' }).click();
  await expect(page.getByRole('heading', { name: 'What are you curious about?' })).toBeVisible();
  await page.getByRole('button', { name: 'Science' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await expect(page.getByRole('heading', { name: /best scientist you can be/i })).toBeVisible({ timeout: 6_000 });
  await page.getByRole('button', { name: 'Explore Turn training into insight' }).click();
  await expect(page.getByRole('heading', { name: 'Turn training into insight' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore Wearable code, real feedback' }).click();
  await expect(page.getByRole('heading', { name: 'Wearable code, real feedback' })).toBeVisible();
  await page.getByRole('button', { name: 'Explore Turn training into insight' }).click();
  await expect(page.getByRole('heading', { name: 'Turn training into insight' })).toBeVisible();
  await continueFromPersonalization(page);
  const textAnswer = page.getByRole('radio', { name: 'Text' });
  await expect(page.getByRole('radiogroup', { name: 'Concept check answers' })).toBeVisible();
  await expect(textAnswer).toHaveAttribute('aria-checked', 'false');
  await textAnswer.click();
  await expect(textAnswer).toHaveAttribute('aria-checked', 'true');
});

test('gives a corrective diagnostic hint without exposing the answer', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await continueFromPersonalization(page);
  await page.getByRole('radio', { name: /A number/ }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('status')).toContainText('Think about what a keyboard sends');
  await expect(page.getByRole('button', { name: /Plan the program/ })).toHaveCount(0);
});

test('celebrates three correct answers before introducing pseudocode', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await continueFromPersonalization(page);

  await page.getByRole('radio', { name: 'Text' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.locator('.confetti-burst span')).toHaveCount(14);
  await expect(page.getByText('Question 2 of 3')).toBeVisible({ timeout: 3_000 });

  await page.getByRole('radio', { name: 'Convert text to numbers' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByText('Question 3 of 3')).toBeVisible({ timeout: 3_000 });

  await page.getByRole('radio', { name: 'Show a helpful error' }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('heading', { name: 'You’re ready to plan it out.' })).toBeVisible({ timeout: 3_000 });
  await expect(page.getByRole('list', { name: 'Pseudocode preview' })).toContainText('Get the two scores');
});

test('rejects an out-of-order keyboard plan with a recovery prompt', async ({ page }) => {
  await reachKeyboardPlanner(page);
  await page.getByRole('button', { name: 'Show result or helpful error' }).click();
  await expect(page.getByRole('status')).toContainText('what is the next thing the program needs');
  await expect(page.getByRole('button', { name: 'Continue', exact: true })).toHaveCount(0);
});

test('activates the alternate planner with the keyboard', async ({ page }) => {
  await reachKeyboardPlanner(page);
  const firstStep = page.getByRole('button', { name: 'Get first score', exact: true });
  await firstStep.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('list')).toContainText('Get first score');
  await expect(firstStep).toBeDisabled();
});

test('keeps the pseudocode palette open after placing a block', async ({ page }) => {
  await reachBlockPlanner(page);
  await expect(page.getByRole('button', { name: 'Submit plan' })).toBeInViewport();
  const source = page.locator('.blocklyFlyout .blocklyText').filter({ hasText: 'Get first score' }).first();
  await expect(source).toBeVisible();
  const sourceBox = await source.boundingBox();
  if (!sourceBox) throw new Error('The first pseudocode block could not be positioned for dragging.');

  await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(1_450, 690, { steps: 16 });
  await page.mouse.up();

  await expect(page.locator('.blocklyWorkspace .blocklyText').filter({ hasText: 'Get first score' })).toHaveCount(2);
  await expect(source).toBeVisible();
});

test('completes the canonical lesson using Tab and Enter only', async ({ page }) => {
  await page.goto('/');
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Sports' }));
  await activateWithKeyboard(page, page.getByRole('button', { name: /Continue/ }));
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Continue', exact: true }));
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Continue', exact: true }));
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Start quiz' }));
  for (const [index, answer] of ['Text', 'Convert text to numbers', 'Show a helpful error'].entries()) {
    await activateWithKeyboard(page, page.getByRole('radio', { name: answer }));
    await activateWithKeyboard(page, page.getByRole('button', { name: 'Check answer' }));
    await expect(page.getByRole('status')).toContainText('Exactly.');
    if (index < 2) await expect(page.getByText(`Question ${index + 2} of 3`)).toBeVisible({ timeout: 3_000 });
  }
  await expect(page.getByRole('heading', { name: 'You’re ready to plan it out.' })).toBeVisible({ timeout: 3_000 });
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Start planning' }));
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Use keyboard planner' }));

  for (const name of ['Get first score', 'Get second score', 'Choose an operation', 'Check for division by zero', 'Show result or helpful error']) {
    await activateWithKeyboard(page, page.getByRole('button', { name, exact: true }));
  }
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Submit plan' }));
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Continue', exact: true }));

  for (let index = 0; index < 5; index += 1) {
    await activateWithKeyboard(page, page.getByRole('button', { name: /Check this block/ }));
    const continueButton = page.getByRole('button', { name: index === 4 ? /Assemble the program/ : /Write the next block/ });
    await expect(continueButton).toBeVisible();
    await activateWithKeyboard(page, continueButton);
  }

  await activateWithKeyboard(page, page.getByRole('button', { name: /Run the complete program/ }));
  await expect(page.getByRole('status')).toContainText('Result: 4.0 * 3.0 = 12.0');
  await activateWithKeyboard(page, page.getByRole('button', { name: /One quick transfer check/ }));
  await activateWithKeyboard(page, page.getByRole('radio', { name: /Check that parts is not zero/ }));
  await activateWithKeyboard(page, page.getByRole('button', { name: 'Check answer' }));
  await expect(page.getByRole('status')).toContainText('The same safety rule transfers');
  await activateWithKeyboard(page, page.getByRole('button', { name: /Lesson complete/ }));
  await expect(page.getByRole('heading', { name: 'What are you curious about?' })).toBeVisible();
});

test('keeps a learner in the module after malformed Python', async ({ page }) => {
  await reachFirstModule(page);
  const editor = page.getByRole('textbox', { name: 'Python code for the current module' });
  await expect(editor).toHaveAccessibleName('Python code for the current module');
  await expect(page.locator('.line-number')).toHaveAttribute('aria-hidden', 'true');
  await editor.fill('first_score = float(');
  await page.getByRole('button', { name: /Check this block/ }).click();
  await expect(page.getByRole('status')).toContainText(/Python found an issue/);
  await expect(page.getByRole('button', { name: /Write the next block/ })).toHaveCount(0);
});

test('terminates a runaway block and restores a usable runner', async ({ page }) => {
  await reachFirstModule(page);
  await page.getByRole('textbox', { name: /Python code for the current module/ }).fill('while True:\n    pass');
  await page.getByRole('button', { name: /Check this block/ }).click();
  await expect(page.getByText('That took too long. The runner was reset safely.')).toBeVisible({ timeout: 8_000 });
  await expect(page.getByRole('button', { name: /Check this block/ })).toBeEnabled({ timeout: 12_000 });
});

test('completes the deterministic calculator journey and resets safely', async ({ page }) => {
  await reachFirstModule(page);

  for (let index = 0; index < 5; index += 1) {
    const check = page.getByRole('button', { name: /Check this block/ });
    await expect(check).toBeEnabled();
    await check.click();
    if (index < 4) {
      const next = page.getByRole('button', { name: /Write the next block/ });
      await expect(next).toBeVisible();
      await next.click();
    } else {
      const assemble = page.getByRole('button', { name: /Assemble the program/ });
      await expect(assemble).toBeVisible();
      await assemble.click();
    }
  }

  const run = page.getByRole('button', { name: /Run the complete program/ });
  await expect(run).toBeEnabled();
  await run.click();
  await expect(page.getByRole('status')).toContainText('Result: 4.0 * 3.0 = 12.0');
  await page.getByRole('button', { name: /One quick transfer check/ }).click();
  await page.getByRole('radio', { name: /Check that parts is not zero/ }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('status')).toContainText('The same safety rule transfers');
  await page.getByRole('button', { name: /Lesson complete/ }).click();
  await expect(page.getByRole('heading', { name: 'What are you curious about?' })).toBeVisible();
});
