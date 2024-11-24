import { PlaywrightWrapper } from './helpers/playwright'; // Adjust the path accordingly
import { BrowserContext, Page, chromium } from '@playwright/test';

let wrapper: PlaywrightWrapper;
let context: BrowserContext;
let page: Page;

async function globalSetup(page, context) {
    const browser = await chromium.launch({ headless: false });
    context = await browser.newContext();
    page = await context.newPage();


 

    const eleAppLaunch = wrapper.page.locator('button .slds-icon-waffle');
    console.log(eleAppLaunch);
}

export default globalSetup;
