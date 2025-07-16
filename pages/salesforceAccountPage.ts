import { Page, BrowserContext, expect } from "@playwright/test";
import { selectors } from "./selectors";
import { PlaywrightWrapper } from "../core/PlaywrightWrapper";


export class SalesforceAccountPage extends PlaywrightWrapper {

    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }
    public async newButton() {
        await this.validateElementVisibility(selectors.newBtn, "New Button");
        await this.click(selectors.newBtn, "New", "Button");
        
    }

    public async accountName(value: string) {
        await this.type(selectors.accounts.accountNameInput, "Account Name", value)
    }

    public async ratingDropdown(data: string) {
        await this.click(selectors.accounts.ratingDDBtn, "Rating", "Button");
        await this.click(selectors.accounts.dropdownValueSelector(data), data, "Button");
    }

    public async accountNumber(data: string) {
        await this.type(selectors.accounts.accountNumberInput, "Account Number", data);
    }

    public async accountType(data: string) {
        await this.click(selectors.accounts.accountTypeDDBtn, "Type", "Button");
        await this.click(selectors.accounts.dropdownValueSelector(data), data, "Button");
    }

    public async industry(data: string) {
        await this.click(selectors.accounts.industryDDBtn, "Industry", "Button");
        await this.click(selectors.accounts.dropdownValueSelector(data), data, "Button");
    }

    public async ownerShip(data: string) {
        await this.click(selectors.accounts.ownershipDDBtn, "Ownership", "Button");
        await this.click(selectors.accounts.dropdownValueSelector(data), data, "Button");
    }

    public async billingStreet(data: string) {
        await this.type(selectors.accounts.billingStreetInput, "Billing Street", data);
    }

    public async billingCity(value: string) {
        await this.type(selectors.accounts.billingCityInput, "Billing City", value);
    }

    public async postalCode(value: string) {
        await this.type(selectors.accounts.postalCodeInput, "postalCode", value);
    }

    public async billingState(value: string) {
        await this.type(selectors.accounts.billingStateInput, "Billing State", value);
    }

    public async billingCountry(value: string) {
        await this.type(selectors.accounts.billingCountryInput, "Billing Country", value);
    }

    public async saveButton() {
        await this.click(selectors.saveBtn, "Save", "Button")
    }

    public async verifiAccountName(value: string) {
        await this.spinnerDisappear()
        await this.validateElementVisibility(selectors.accounts.verificationText, "Account Name")
        const accountName = await this.getInnerText(selectors.accounts.verificationText)
        expect(accountName).toContain(value)

    }
    
    public async searchAccount(accountName: string) {
        await this.interactWithElement('PLACEHOLDER', selectors.accounts.Searchthis, 'fill', accountName);
        await this.keyboardAction(`[placeholder="${selectors.accounts.Searchthis}"]`, 'Enter', "Input", "Search This");
    }

    public async closeTAB() {
        await this.click(selectors.accounts.closeTab, "Close TAB", "Button")
    }
}