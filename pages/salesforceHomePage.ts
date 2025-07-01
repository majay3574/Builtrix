import { BrowserContext, Page } from "@playwright/test";
import { selectors } from "./selectors";
import { PlaywrightWrapper } from "../helpers/playwrightUtils/playwright";


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

    public async setupGear() {
        await this.click(selectors.setupGear, "Setup Gear", "Button");
    }

    public async setupLink() {
        await this.setupGear();
        await this.waitSelector(selectors.setupLink);
        await this.click(selectors.setupLink, "Setup Link", "Link");
    }



    public async app(data: string) {
        await this.click(selectors.appOrItem(data), data, "Button")

    }

    public async clickMobilePublisher() {
        if (await this.page.locator(selectors.learnMoreBtn).isVisible()) {
            await this.childTab(selectors.learnMoreBtn);
        } else {
            await this.setupGear();
            await this.childTab(selectors.setupLink);
            await this.switchToChildPage(1);
            await this.validateElementVisibility(selectors.learnMoreBtn, "Learn More Button");
            await this.childTab(selectors.learnMoreBtn);
        }
    }


}
