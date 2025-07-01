import { test } from "../customFixtures/salesForceFixture";
import { FakerData } from "../helpers/testDataGen/fakerUtils";
import { readCSVSync } from '../helpers/dataUtils/csvUtil';
import { updateJSONFile } from "../helpers/dataUtils/jsonDataHandler";
import { accountData } from "../data/account.interface";
import fs from 'fs';


let testData: any[] = [];
try {
  if (fs.existsSync('data/accounts.csv')) {
    testData = readCSVSync('data/accounts.csv');
  } else {
    console.error("CSV file not found!");
  }
} catch (error) {
  console.error("Error reading CSV data:", error);
}
for (let index = 0; index < testData.length; index++) {
  const row = testData[index];
  test(`Salesforce Account Creation for ${row.Industry}`, async ({ SalesforceLogin, SalesforceHome, SalesforceAccount }) => {
    const { Rating, Type, Industry, Ownership, BillingStreet, BillingCity, PostalCode, BillingState, BillingCountry } = row;
    const acctName = FakerData.getRandomTitle();

    updateJSONFile<accountData>("../../data/accountdata.json", { TC002: acctName });

    test.info().annotations.push(
      { type: 'Author', description: 'Ajay Michael' },
      { type: 'TestCase', description: `Account Creation - Row ${index + 1}` },
      { type: 'Test Description', description: "Creating Valid account for budget calculation" }
    );

    await SalesforceLogin.salesforceLogin("ADMINLOGIN");
    await SalesforceHome.appLauncher();
    await SalesforceHome.viewAll();
    await SalesforceHome.searchApp("Accounts");
    await SalesforceHome.app("Accounts");
    await SalesforceAccount.newButton();
    await SalesforceAccount.accountName(acctName);
    await SalesforceAccount.accountNumber(FakerData.getMobileNumber());
    await SalesforceAccount.ratingDropdown(Rating);
    await SalesforceAccount.accountType(Type);
    await SalesforceAccount.industry(Industry);
    await SalesforceAccount.ownerShip(Ownership);
    await SalesforceAccount.billingStreet(BillingStreet);
    await SalesforceAccount.billingCity(BillingCity);
    await SalesforceAccount.postalCode(PostalCode);
    await SalesforceAccount.billingState(BillingState);
    await SalesforceAccount.billingCountry(BillingCountry);
    await SalesforceAccount.saveButton();
    await SalesforceAccount.verifiAccountName(acctName);
  });
}
