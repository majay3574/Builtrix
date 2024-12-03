
import test, { chromium, expect } from "@playwright/test"
import { Tesseract } from "tesseract.ts";
test(`Testing Captcha`, async () => {

    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext();
    const page = await context.newPage();


    await page.goto('http://localhost:5500/Captcha/index.html');
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');

    const imageBuffer = await page.locator(`[name="captchaImage"]`).screenshot({ animations: 'disabled' });
    const result = await Tesseract.recognize(imageBuffer, 'eng');
    let extractedText = result.text.trim();
    console.log("Extracted Text is = " + extractedText);
    await page.locator(`[name="captcha"]`).fill(extractedText)
    expect(extractedText).toContain("Captcha");
    await page.waitForTimeout(10000)
    await page.close();

})
