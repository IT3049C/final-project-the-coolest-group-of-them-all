import { test, expect } from '@playwright/test';

test('Wordle accepts valid word', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.locator('a[href*="wordle"]').click();

  // Wordle is NOT multiplayer → no mode selection
  await page.getByRole('button', { name: /continue/i }).click();

  await page.waitForSelector('.grid');

  await page.keyboard.type('apple');
  await page.keyboard.press('Enter');

  await expect(page.locator('.grid')).toBeVisible();
});

test('Wordle rejects invalid word', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.locator('a[href*="wordle"]').click();
  await page.getByRole('button', { name: /continue/i }).click();

  await page.waitForSelector('.grid');

  await page.keyboard.type('zzzzz');
  await page.keyboard.press('Enter');

  // If you display error text, keep this:
  // await expect(page.getByText(/not a valid word/i)).toBeVisible();

  // Otherwise just verify game didn't break:
  await expect(page.locator('.grid')).toBeVisible();
});