import { test, expect } from '@playwright/test';

test('TTT allows valid move', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.locator('a[href*="tic-tac-toe"]').click();
  await page.getByText(/solo/i).click();
  await page.getByRole('button', { name: /continue/i }).click();

  const cells = page.locator('.cell');

  await cells.nth(0).click();

  await expect(cells.nth(0)).toContainText('X');
});

test('TTT prevents overwriting a move', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.locator('a[href*="tic-tac-toe"]').click();
  await page.getByText(/solo/i).click();
  await page.getByRole('button', { name: /continue/i }).click();

  const cell = page.locator('.cell').nth(0);

  await cell.click();
  await cell.click();

  await expect(cell).toContainText('X');
});

test('TTT game reaches a valid end state', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.getByText(/tic/i).click();
  await page.getByText(/solo/i).click();
  await page.getByRole('button', { name: /continue/i }).click();

  const cells = page.locator('.cell');

  // Play a few moves (doesn't matter what exactly)
  await cells.nth(0).click();
  await cells.nth(1).click();
  await cells.nth(2).click();
  await cells.nth(3).click();
  await cells.nth(4).click();

  // ✅ Check for ANY valid game result
  await expect(page.locator('h3')).toContainText(/win|draw/i);
});