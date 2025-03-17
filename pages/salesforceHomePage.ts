import { BrowserContext, Page } from "@playwright/test";
import { selectors } from "./selectors";
import { PlaywrightWrapper } from "../helpers/playwright";

export class SalesforceHomePage extends PlaywrightWrapper {
    constructor(page: Page, context: BrowserContext) {
        super(page, context);
    }

    public async appLauncher() {
        await this.validateElementVisibility(selectors.applauncherIcon, "App Launcher");
        await this.click(selectors.applauncherIcon, "App Launcher", "Button");
    }

    public async viewAll() {
        await this.waitSelector(selectors.viewAllBtn);
        await this.page.locator(selectors.viewAllBtn).highlight();
        await this.click(selectors.viewAllBtn, "View All", "Button");

    }

    public async searchApp(value: string) {
        await this.type(selectors.appItemSearchField, "Search Field", value)
    }

    public async app(data: string) {
        await this.click(selectors.appOrItem(data), data, "Button")

    }

    public async clickMobilePublisher() {
        await this.childTab("//button[text()='Learn More']");
    }


}
