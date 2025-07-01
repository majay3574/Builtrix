import { test } from "../customFixtures/salesForceFixture"
import { JsonReader } from "../helpers/dataUtils/jsonReader";



//test.use({ storageState: "logins/salesforceLogin.json" })
test(`create_newOpportunity_for_exist_account `, async ({ SalesforceLogin, SalesforceHome, SalesforceAccount, SalesforceMobilePublisher }) => {
    test.info().annotations.push(
        { type: 'Author', description: 'Ajay Michael' },
        { type: 'TestCase', description: 'Creating Lead' },
    );

    let jsonData = JsonReader.readJson("../../data/accountdata.json");
    await SalesforceLogin.salesforceLogin("ADMINLOGIN");
    //await SalesforceLogin.verifyHomeLabel();
    await SalesforceHome.appLauncher();
    await SalesforceHome.viewAll();
    await SalesforceHome.searchApp("Accounts");
    await SalesforceHome.app("Accounts");
    await SalesforceAccount.searchAccount(jsonData.TC001)
})