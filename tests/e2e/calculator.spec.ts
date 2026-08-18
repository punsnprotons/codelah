import { expect, test } from '@playwright/test';

async function reachKeyboardPlanner(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Sports' }).click();
  await page.getByRole('button', { name: /Continue/ }).click();
  await page.getByRole('radio', { name: /Text/ }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await page.getByRole('button', { name: /Plan the program/ }).click();
  await page.getByRole('button', { name: 'Use keyboard planner' }).click();
}

async function reachFirstModule(page: import('@playwright/test').Page) {
  await reachKeyboardPlanner(page);
  for (const name of ['Get first score', 'Get second score', 'Choose an operation', 'Check for division by zero', 'Show result or helpful error']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  await page.getByRole('button', { name: /Check plan/ }).click();
  await page.getByRole('button', { name: /Write the first block/ }).click();
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
  await expect(page.getByRole('button', { name: /Continue/ })).toBeEnabled();

  await page.getByRole('button', { name: /Continue/ }).click();
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
  await page.getByRole('radio', { name: /A number/ }).click();
  await page.getByRole('button', { name: 'Check answer' }).click();
  await expect(page.getByRole('status')).toContainText('Think about what a keyboard sends');
  await expect(page.getByRole('button', { name: /Plan the program/ })).toHaveCount(0);
});

test('rejects an out-of-order keyboard plan with a recovery prompt', async ({ page }) => {
  await reachKeyboardPlanner(page);
  await page.getByRole('button', { name: 'Show result or helpful error' }).click();
  await expect(page.getByRole('status')).toContainText('what is the next thing the program needs');
  await expect(page.getByRole('button', { name: /Write the first block/ })).toHaveCount(0);
});

test('activates the alternate planner with the keyboard', async ({ page }) => {
  await reachKeyboardPlanner(page);
  const firstStep = page.getByRole('button', { name: 'Get first score', exact: true });
  await firstStep.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('list')).toContainText('Get first score');
  await expect(firstStep).toBeDisabled();
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
