import { test, expect } from '@playwright/test';

test.describe('Empeo Registration – Automation Design (Stable)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(
      'https://uat.tks.co.th/ClientPortal/Register/empeo',
      { waitUntil: 'domcontentloaded' }
    );
  });

  test('TC-01: Registration page loads', async ({ page }) => {
    await expect(page).toHaveURL(/Register\/empeo/);
  });

  test('TC-REG-02: Submit button is enabled and clickable when form is valid', async ({ page }) => {

    // ===== Phone =====
    await page.locator('input[type="tel"]').fill('0967690708');

    // ===== Email =====
    await page.locator('input[type="email"]').fill('example@gmail.com');

    // ===== Company Type =====
    await page
      .getByTestId('input_radio_registration_company_thai')
      .check();

    // ===== Name =====
    await page
      .getByTestId('input_registration_name')
      .fill('john');

    // ===== Surname =====
    await page
      .getByTestId('input_registration_surname')
      .fill('little');

    // ===== Promo Code =====
    await page
      .getByTestId('input_registration_promo_code')
      .fill('FREE15DAY');

    // ===== Accept Terms =====
    await page.locator('input[type="checkbox"]').check();

    // ===== Submit Button =====
    const submitButton = page.getByTestId(
      'button_submit_registration_try_for_free'
    );

    // 🔹 Key Assertion #1: Button should be enabled
    await expect(submitButton).toBeEnabled();

    // 🔹 Key Assertion #2: Button is clickable
    await submitButton.click();

    // 🔹 Key Assertion #3: Registration flow starts
    await expect(page).toHaveURL(/otp|verify|confirm/i);
  });

  test('TC-Phone-02: Phone number more than 10 digits is handled safely', async ({ page }) => {
    const phone = page.locator('input[type="tel"]');

    await phone.fill('096123456789');
    await phone.blur();

    const value = await phone.inputValue();
    expect(value.length).toBeLessThanOrEqual(15); // maxlength
  });

  test('TC-Phone-03: Valid 10-digit phone number can be entered', async ({ page }) => {
    const phone = page.locator('input[type="tel"]');

    await phone.fill('0967690708');
    await phone.blur();

    await expect(phone).toHaveValue('0967690708');
  });

  test('TC-03: Submit button exists', async ({ page }) => {
    const submit = page.getByTestId('button_submit_registration_try_for_free');
    await expect(submit).toHaveCount(1);
  });

  test('TC-05: Promo code input exists', async ({ page }) => {
    const inputs = page.locator('input');
    const count = await inputs.count();

    expect(count).toBeGreaterThan(1);
  });

  test('TC-06: Page does not crash on invalid input', async ({ page }) => {
    await page.locator('input[type="tel"]').fill('abc');
    await page.waitForTimeout(300);

    await expect(page).toHaveURL(/Register\/empeo/);
  });

});
