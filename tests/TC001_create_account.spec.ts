import { test } from "../customFixtures/salesForceFixture";
import { FakerData } from "../helpers/testDataGen/fakerUtils";
import { readCSVSync } from "../helpers/dataUtils/csvUtil";
import { updateJSONFile } from "../helpers/dataUtils/jsonDataHandler";
import { accountData } from "../data/account.interface";
import path from "path";
import fs from "fs";

const csvPath = path.join(__dirname, "../data/accounts.csv");
let testData: any[] = [];

try {
  if (fs.existsSync(csvPath)) {
    testData = readCSVSync(csvPath);
  } else {
    console.error("❌ CSV file not found at:", csvPath);
  }
} catch (error) {
  console.error("❌ Error reading CSV data:", error);
}

test.describe("Salesforce Account Creation Tests", () => {
  testData.forEach((row, index) => {
    const testCaseId = `TC${(index + 1).toString().padStart(3, "0")}`;
    const testTitle = `Account Creation for Industry: ${row.Industry}`;

    test(testTitle, async ({ SalesforceLogin, SalesforceHome, SalesforceAccount }) => {
      const {
        Rating,
        Type,
        Industry,
        Ownership,
        BillingStreet,
        BillingCity,
        PostalCode,
        BillingState,
        BillingCountry,
      } = row;

      const acctName = FakerData.getRandomTitle();
      updateJSONFile<accountData>("../../data/accountdata.json", {
        [testCaseId]: acctName,
      });

      test.info().annotations.push(
        { type: "Author", description: "Ajay Michael" },
        { type: "TestCase", description: `${testCaseId}` },
        { type: "Test Description", description: "Creating valid account for budget calculation" }
      );
      await SalesforceLogin.salesforceLogin("ADMINLOGIN");
      await test.step("🔍 Navigate to Accounts App", async () => {
        await SalesforceHome.appLauncher();
        await SalesforceHome.viewAll();
        await SalesforceHome.searchApp("Accounts");
        await SalesforceHome.app("Accounts");
      });
      await test.step(" Fill and Create Account", async () => {
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
    });
  });
});
