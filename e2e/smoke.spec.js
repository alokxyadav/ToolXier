import { test, expect } from '@playwright/test'
test('home loads, search filters tools', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('heading', { level: 1 })).toContainText('Everything Developers Need')
  await page.getByRole('searchbox').fill('jwt'); await expect(page.getByRole('link', { name: /JWT Decoder/ })).toBeVisible()
})
test('JSON Formatter runs and shows errors', async ({ page }) => {
  await page.goto('/tools/json-formatter'); await page.getByLabel('Input').fill('{"a":1}'); await page.getByRole('button', { name: 'Run' }).click()
  await expect(page.getByLabel('Output')).toHaveValue('{\n  "a": 1\n}')
  await page.getByLabel('Input').fill('{bad'); await page.getByRole('button', { name: 'Run' }).click(); await expect(page.getByRole('alert')).toBeVisible()
})
test('JWT page warns that decoding is not verification', async ({ page }) => {
  await page.goto('/tools/jwt-decoder'); await expect(page.getByRole('note')).toContainText('NOT proven authentic')
})
test('unknown URL returns a real 404', async ({ request }) => { expect((await request.get('/nope/missing')).status()).toBe(404) })
test('no horizontal overflow on key pages', async ({ page }) => {
  for (const path of ['/', '/tools/json-formatter', '/api-tester', '/image-tools', '/css-layout']) {
    await page.goto(path); expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true) }
})
test('prerendered page has unique title and canonical', async ({ request }) => {
  const html = await (await request.get('/tools/md5-generator')).text(); expect(html).toContain('MD5 Hash Generator Online'); expect(html).toContain('rel="canonical"')
})
