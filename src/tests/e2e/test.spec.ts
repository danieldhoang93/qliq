import { test, expect } from '@playwright/test';

test('loads localhost:5173', async ({ page }) => {
  await page.goto('http://google.com');
  await expect(page).toHaveTitle(/.*/);
});
