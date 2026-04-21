import { test, expect } from '@playwright/test';

test('RPS solo plays a round', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.locator('a[href*="rps"]').click();
  await page.getByText(/solo/i).click();
  await page.getByRole('button', { name: /continue/i }).click();

  await page.waitForSelector('.choice-button');

  await page.locator('.choice-button').first().click();

  await expect(page.locator('.result-text')).toBeVisible();
});

test('RPS prevents multiple rapid clicks', async ({ page }) => {
  await page.goto('http://localhost:5173');

  await page.locator('a[href*="rps"]').click();
  await page.getByText(/solo/i).click();
  await page.getByRole('button', { name: /continue/i }).click();

  const btn = page.locator('.choice-button').first();

  await btn.click();
  await btn.click();

  await expect(page.locator('.result-text')).toBeVisible();
});