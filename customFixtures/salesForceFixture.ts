import { test as baseTest, TestInfo } from '@playwright/test'
import { SalesforceHomePage } from "../pages/salesforceHomePage"
import { SalesforceLeadPage } from '../pages/salesforceLeadPage'
import { SalesforceAccountPage } from '../pages/salesforceAccountPage'
import { SalesforceLoginPage } from '../pages/salesforceLogin'
import { SalesforceMobilePublisherPage } from '../pages/salesforceMobilePublisher'
import { extractAndAnalyzeWithGroq } from '../helpers/ai_errorHandler/errorHandler'

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

const failedTests: TestInfo[] = [];

test.afterEach(async ({ }, testInfo) => {
    if (['failed', 'timedOut', 'interrupted'].includes(testInfo.status)) {
        failedTests.push(testInfo);
    }
});

test.afterAll(async () => {
    for (const testInfo of failedTests) {
        await extractAndAnalyzeWithGroq(testInfo);
    }
});






