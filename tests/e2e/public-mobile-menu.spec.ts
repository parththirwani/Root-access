import { expect, test } from '@playwright/test';

for (const theme of ['dark', 'light']) {
for (const width of [320, 375, 768]) {
  test(`compact menu stays above content and dismisses at ${width}px in ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 667 });
    await page.addInitScript((theme) => localStorage.setItem('site-theme', theme), theme);
    await page.goto('/');
    const trigger = page.getByRole('button', { name: 'Open menu', exact: true });
    const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
    await trigger.click();
    await expect(nav).toBeVisible();
    const box = await nav.boundingBox();
    expect(box!.width).toBeLessThanOrEqual(264);
    expect(box!.height).toBeLessThan(350);
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    const linksReceiveClicks = await nav.locator('a:visible').evaluateAll((links) => links.every((link) => {
      const rect = link.getBoundingClientRect();
      return link.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
    }));
    expect(linksReceiveClicks).toBe(true);
    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(trigger).toBeFocused();
    await trigger.click();
    await page.mouse.click(10, 110);
    await expect(nav).toBeHidden();
    await trigger.click();
    await nav.getByRole('link', { name: 'Writing', exact: true }).click();
    await expect(page).toHaveURL(/\/writing$/);
    await expect(nav).toBeHidden();
  });
}

}

test('desktop navigation remains visible without the mobile trigger', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Open menu', exact: true })).toBeHidden();
  await expect(page.getByRole('navigation', { name: 'Main navigation', exact: true })).toBeVisible();
});
