
import { SalesforceHomePage } from './salesforceHomePage';

export class SalesforceMobilePublisherPage extends SalesforceHomePage {

   
    public async clickConfirmButton(): Promise<any> {
        await this.clickwithnewInstance("//button[text()='Confirm']");
    }

    /* public async clickProduct(): Promise<any> {
        await this.newPage.waitForTimeout(3000)
        await this.newPage.locator("span:text-is('Products')").click();
    } */
}
