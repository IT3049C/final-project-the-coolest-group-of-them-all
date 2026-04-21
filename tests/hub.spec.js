import { test, expect } from '@playwright/test';

test('hub navigates to lobby pages', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Wait for hub to fully load
  await page.waitForLoadState('networkidle');

  // Click Tic Tac Toe using TEXT (reliable)
  await page.getByText('Tic-Tac-Toe').click();

  await expect(page).toHaveURL(/tic-tac-toe/);

  await page.goBack();

  // Click RPS
  await page.getByText('Rock Paper Scissors').click();

  await expect(page).toHaveURL(/rps/);

  await page.goBack();

  // Click Wordle
  await page.getByText('Wordle').click();

  await expect(page).toHaveURL(/wordle/);
});