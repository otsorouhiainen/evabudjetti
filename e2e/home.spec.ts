import { expect, test } from '@playwright/test';

test('shows landing page with title', async ({ page }) => {
	// Navigate to root
	await page.goto('/');
	await page.goto('/landing');

	await expect(page.getByText('EVA Personal Budget')).toBeVisible();
});
