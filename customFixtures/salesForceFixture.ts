import { test as baseTest } from '@playwright/test'
import { SalesforceHomePage } from '../pages/salesforceHomePage'
import { SalesforceLeadPage } from '../pages/salesforceLeadPage'
import { SalesforceAccountPage } from '../pages/salesforceAccountPage'
import { SalesforceLoginPage } from '../pages/salesforceLogin'
import { SalesforceMobilePublisherPage } from '../pages/salesforceMobilePublisher'
import fs from 'fs';
import path from 'path';

type salesForceFixture = {
    SalesforceHome: SalesforceHomePage
    SalesforceLead: SalesforceLeadPage
    SalesforceAccount: SalesforceAccountPage
    SalesforceLogin: SalesforceLoginPage
    SalesforceMobilePublisher: SalesforceMobilePublisherPage
}

export const test = baseTest.extend<salesForceFixture>({

    SalesforceLogin: async ({ page, context }, use) => {
        const salesforceLogin = new SalesforceLoginPage(page, context);
        await use(salesforceLogin);
    },

    SalesforceHome: async ({ page, context }, use) => {
        const SalesforceHome = new SalesforceHomePage(page, context);
        await use(SalesforceHome);
    },

    SalesforceLead: async ({ page, context }, use) => {
        const SalesforceLead = new SalesforceLeadPage(page, context);
        await use(SalesforceLead)
    },

    SalesforceAccount: async ({ page, context }, use) => {
        const SalesforceAccount = new SalesforceAccountPage(page, context);
        await use(SalesforceAccount)
    },
    SalesforceMobilePublisher: async ({ page, context }, use) => {
        const SalesforceMobilePublisher = new SalesforceMobilePublisherPage(page, context);
        await use(SalesforceMobilePublisher);
    },


})



/* test.afterEach(async ({ page }, testInfo) => {
    const timestamp = Date.now();
    const sanitizedTitle = testInfo.title.replace(/\s+/g, '_'); // Remove spaces

    // Create a directory for each test
    const testDir = path.join('screenshots', sanitizedTitle);
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
    }

    async function attachScreenshot(stepName: string) {
        const screenshotPath = path.join(testDir, `${stepName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true }); 

        await testInfo.attach(`Screenshot - ${stepName}`, { body: fs.readFileSync(screenshotPath), contentType: 'image/png' });
    }

    await attachScreenshot(`${sanitizedTitle}_${timestamp}`);
}); */

/* test.beforeAll(async ({ SalesforceLogin }) => {
    await SalesforceLogin.salesforceLogin("ADMINLOGIN")
});
 */
/* test.afterEach(async ({}, testInfo) => {
    jiraIssueKey = await logADefectInJira(testInfo);
});

test.afterAll(async ({}) => {
   const filePath= process.cwd()
   const resultFile=await glob(filePath+"/test-results",{absolute:true})
   console.log(resultFile)
    if (jiraIssueKey && resultFile.length> 0) {
        await updateJiraIssue(jiraIssueKey,resultFile[0]); // Replace with the actual folder path
    }
}); */

