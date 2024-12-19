import { test } from "../customFixtures/salesForceFixture"

test(` Mobile Publisher testCase`, async ({ SalesforceHome, SalesforceMobilePublisher }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Mobile publisher multiple page' },
    );

    await SalesforceHome.salesforceLogin("ADMINLOGIN");
    await SalesforceHome.verifyHomeLabel();
    await SalesforceHome.clickMobilePublisher();
    await SalesforceMobilePublisher.clickConfirmButton();
    await SalesforceMobilePublisher.clickProduct();
    await SalesforceMobilePublisher.clickAgentforce();
    await SalesforceMobilePublisher.hoverPricing();
})