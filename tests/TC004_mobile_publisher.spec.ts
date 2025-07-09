import { test } from "../customFixtures/salesForceFixture"


//test.use({ storageState: "logins/salesforceLogin.json" })
test(`@Smoke Mobile Publisher testCase`, async ({ SalesforceLogin, SalesforceHome, SalesforceMobilePublisher }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Mobile publisher multiple page' },
    );

    await SalesforceLogin.salesforceLogin("ADMINLOGIN");
    await SalesforceHome.clickMobilePublisher();
    await SalesforceMobilePublisher.clickConfirmButton();
    await SalesforceMobilePublisher.clickProduct();
    await SalesforceMobilePublisher.clickAgentforce();
    
})