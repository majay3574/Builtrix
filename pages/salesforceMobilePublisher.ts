import { selectors } from "./selectors";
import { PageCore } from '../core/pagecore';

export class SalesforceMobilePublisherPage extends PageCore {

    public async clickConfirmButton(): Promise<any> {
        if (await this.page.locator(selectors.confirmButton).isVisible()) {
            await this.switchToChildPage(1);
            await this.click(selectors.confirmButton, "Confirm", "Button");
        } else {
            await this.switchToChildPage(2);
            await this.click(selectors.confirmButton, "Confirm", "Button");
        }
    }

    public async clickProduct(): Promise<any> {
        await this.click(selectors.service.products, "Product", "Button");
        /*   this.switchToParentPage();
          this.wait('minWait'); */
    }

    public async clickAgentforce() {
        await this.click(selectors.service.agentForce, "Agentforce", "Link");
    }

    public async clickAgentPricing() {
        await this.click(selectors.service.agentPricing, "Agent Pricing", "Button");
    }
}
