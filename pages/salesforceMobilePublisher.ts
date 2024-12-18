
import { PlaywrightWrapper } from '../helpers/playwright';
import { SalesforceHomePage } from './salesforceHomePage';

export class SalesforceMobilePublisherPage extends SalesforceHomePage {


    public async clickConfirmButton(): Promise<any> {
        this.switchToChildPage(1);
        await this.click("//button[text()='Confirm']", "", "");
    }

    public async clickProduct(): Promise<any> {
        await this.click("span:text-is('Products')", "", "");
        this.switchToParentPage();
        this.wait('minWait');
    }

}
