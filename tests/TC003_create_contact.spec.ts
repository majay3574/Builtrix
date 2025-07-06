import { test } from "../customFixtures/salesForceFixture"
import { FakerData } from "../helpers/testDataGen/fakerUtils"

let firstName = FakerData.getFirstName()
//test.use({ storageState: "logins/salesforceLogin.json" })
test(` creating Contact`, async ({SalesforceLogin,SalesforceHome, SalesforceLead }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Creating Lead' },
    );

    await SalesforceLogin.salesforceLogin("ADMINLOGIN");
    await SalesforceHome.appLauncher();
    await SalesforceHome.viewAll();
    await SalesforceHome.searchApp("Leads");
    await SalesforceHome.app("Leads");
    await SalesforceLead.newButton();
    await SalesforceLead.salutation("Mr.");
    await SalesforceLead.firstName(firstName);
    await SalesforceLead.lastName(FakerData.getLastName());
    await SalesforceLead.Company(FakerData.randomCityName());
    await SalesforceLead.saveButton();
    await SalesforceLead.verifyTheLeadAccount(firstName);

})