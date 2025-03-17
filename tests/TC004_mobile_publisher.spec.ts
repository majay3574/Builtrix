import { test } from "../customFixtures/salesForceFixture"

test(` Mobile Publisher testCase`, async ({ SalesforceLogin, SalesforceHome, SalesforceMobilePublisher }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Mobile publisher multiple page' },
    );

    await SalesforceLogin.salesforceLogin("ADMINLOGIN");
    await SalesforceLogin.verifyHomeLabel();
    await SalesforceHome.clickMobilePublisher();
    await SalesforceMobilePublisher.clickProduct();
    await SalesforceMobilePublisher.clickAgentforce();
    await SalesforceMobilePublisher.hoverPricing();
})