import { SalesforceHomePage } from './salesforceHomePage';

export class SalesforceMobilePublisherPage extends SalesforceHomePage {


    public async clickConfirmButton(): Promise<any> {
        this.switchToChildPage(1);
        await this.click("//button[text()='Confirm']", "Confirm", "Button");
    }

    public async clickProduct(): Promise<any> {
        await this.click("span:text-is('Products')", "Product", "Button");
        /*   this.switchToParentPage();
          this.wait('minWait'); */

    }

    public async clickAgentforce() {
        await this.click("span:text-is('Agentforce)", "Agentforce", "Link");
    }

    public async hoverPricing() {
        await this.mouseHover("span:text-is('Pricing')", "Pricing");
        await this.click("span:text-is('Agentforce Pricing')", "Agent Pricing", "Button");

    }
}
