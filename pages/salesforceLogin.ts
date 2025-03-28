import { BrowserContext, Page } from "@playwright/test";
import { PlaywrightWrapper } from "../helpers/playwright";
import { credentials } from "../constants/credentialData";
import { expect } from "playwright/test";
import { URLConstants } from "../constants/urlConstants";
import { selectors } from "./selectors";

export class SalesforceLoginPage extends PlaywrightWrapper {

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    // Function to log in to Salesforce based on user role
    public async salesforceLogin(role: string) {
        const { username, password } = credentials[role];

        await this.loadApp(URLConstants.adminURL) // Load the Salesforce admin URL
        const pageTitle = await this.page.title();
        if (pageTitle.startsWith("Login")) { // Check if the page is a login page
            await this.type(selectors.username, "Username", username); // Enter username
            await this.type(selectors.password, "password", password); // Enter password
            await this.interactWithElement('ID', selectors.loginBtn, 'click'); // Click login button
            await this.wait('mediumWait') // Wait for the page to load after login
            await this.validateElementVisibility(selectors.applauncherIcon, "App Launcher"); // Verify app launcher is visible
            await this.storeState("./logins/salesforce.json")
        } else {
            console.log("Login page is Skipped"); // Log message if login page is already bypassed
        }
    }

    // Function to verify if the home label is visible and contains correct text
    public async verifyHomeLabel() {
        await this.validateElementVisibility(selectors.homeLabel, "Home"); // Check visibility of home label
        let home = await this.getInnerText(selectors.homeLabel); // Get text of home label
        expect(home).toEqual("Home"); // Assert that the text is "Home"
    }
}