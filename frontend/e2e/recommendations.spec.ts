import { expect, test } from '@playwright/test'

test.setTimeout(120000)

test('submits the ad form and renders real recommendations', async ({ page }) => {
  await page.goto('/ad-submission')

  await page.getByPlaceholder('A fast-paced campaign showing an AI-powered car dashboard with cinematic transitions').fill(
    'An AI dashboard campaign for a polished tech launch with modern visuals and confident pacing.',
  )
  await page.getByRole('button', { name: '4 Upbeat' }).click()
  await page.getByRole('button', { name: 'Positive' }).click()
  await page.getByRole('button', { name: 'No Preference' }).click()
  await page.getByRole('button', { name: 'Start Ad Matching' }).click()

  await expect(page.getByText('Recommended Songs')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open on FMA' }).first()).toBeVisible({ timeout: 120000 })
  await expect(page.locator('text=score').first()).toBeVisible()
})
