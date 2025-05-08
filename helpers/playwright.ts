
import { Page, test, expect, BrowserContext, Locator } from "@playwright/test";
import * as path from 'path';
import fs from 'fs';




export abstract class PlaywrightWrapper {

    page: Page;
    readonly context: BrowserContext;
    private static newPage: Page | null = null;
    protected testInfo?: { title: string };

    constructor(page: Page, context: BrowserContext,) {
        this.page = page;
        this.context = context;
    }

    protected getNewPage(): Page {
        if (!PlaywrightWrapper.newPage) {
            throw new Error('New tab is not initialized. Did you forget to call childTab()?');
        }
        return PlaywrightWrapper.newPage;
    }

    /**
   * Loads the specified URL in the browser.
   * 
   * @param {string} url - The URL to navigate to.
   */
    public async loadApp(url: string) {
        try {
            await this.page.goto(url); // Increased timeout for 60 seconds
            //console.log(`Successfully loaded the URL: ${url}`);
        } catch (error) {
            console.log(`Error loading the page at ${url}:`);
            throw new Error(`Failed to load the page at ${url}`);
        }
    }

    /**
   * Types into the specified textbox after clearing any existing text.
   * 
   * @param {string} locator - The locator for the textbox element.
   * @param {string} name - The name of the textbox element.
   * @param {string} data - The data to be typed into the textbox.
   */
    protected async type(locator: string, name: string, data: string, description?: string) {
        await test.step(`Textbox ${name} filled with data: ${data}`, async () => {
            await this.page.waitForSelector(locator, { state: 'visible' });
            await this.page.locator(locator).clear();
            await this.page.locator(locator).fill(data);
        }
        )
    }


    /**
     * Types into the specified textbox, clears existing text, and presses <ENTER>.
     * @param {string} locator - The locator for the textbox element.
     * @param {string} name - The name of the textbox element.
     * @param {string} data - The data to be typed into the textbox.
     */
    protected async fillAndEnter(locator: string, name: string, data: string) {
        await test.step(`Textbox ${name} filled with data: ${data}`, async () => {

            await this.page.locator(locator).clear();
            await this.page.fill(locator, data, { force: true })
            await this.page.focus(locator)
            await this.page.keyboard.press("Enter");

        });
    }

    /**
    * Types the specified data into a textbox using keyboard input, after clearing existing text.
    * @param {string} locator - The locator for the textbox element.
    * @param {string} data - The data to be typed into the textbox.
  */
    protected async keyboardType(locator: string, data: string) {
        await test.step(`Textbox filled with data: ${data}`, async () => {
            await this.page.locator(locator).clear();
            await this.page.focus(locator);
            await this.page.keyboard.type(data, { delay: 100 });
        });
    }

    /**
    * Types the specified data into a textbox and presses <Enter> after clearing the existing text.
    * @param {string} locator - The locator for the textbox element.
    * @param {string} name - The name of the textbox element.
    * @param {string} data - The data to be typed into the textbox.
    */
    protected async typeAndEnter(locator: string, name: string, data: string) {
        await test.step(`Textbox ${name} filled with data: ${data}`, async () => {
            await this.page.locator(locator).clear();
            await this.page.keyboard.type(data, { delay: 400 });
            await this.page.keyboard.press("Enter");
        });
    }

    /**
     * Clicks on the specified textbox element.
     * @param {string} locator - The locator for the element.
     * @param {string} name - The name of the element.
     * @param {string} type - The type of the element
     */

    protected async click(locator: string, name: string, type: string, description?: string) {
        await test.step(`The ${name} ${type} clicked`, async () => {
            await this.page.waitForSelector(locator, { state: 'visible' });
            await this.page.locator(locator).click();

        });
    }

    protected async forceClick(locator: string, name: string, type: string) {
        await test.step(`The ${name} ${type} clicked`, async () => {

            await this.page.waitForSelector(locator, { state: 'visible' });
            await this.page.locator(locator).click({ force: true });
        });
    }

    async storeState(path: string): Promise<void> {
        try {
            await this.context.storageState({ path });
            console.log(`Storage state saved to: ${path}`);
        } catch (error) {
            console.error(`Failed to save storage state to: ${path}`, error);
        }
    }



    /**
    * Retrieves the inner text of the specified element.
    * 
    * @param {string} locator - The locator for the element.
    * @returns {Promise<string>} - The inner text of the element.
    */
    protected async getInnerText(locator: string): Promise<string> {
        return await this.page.locator(locator).innerText();
    }

    /**
    * Retrieves the text content of the specified element.
    * 
    * @param {string} locator - The locator for the element.
    * @returns {Promise<string | null | any>} - The text content of the element, or null if none is found.
    */
    protected async getTextContent(locator: string): Promise<string | null | any> {
        return await this.page.locator(locator).textContent();
    }

    /**
    * Retrieves the input value of the specified element (e.g., from an input field).
    * 
    * @param {string} locator - The locator for the input element.
    * @returns {Promise<string>} - The current value of the input element.
    */
    protected async getText(locator: string): Promise<string> {
        return await this.page.locator(locator).inputValue();
    }

    /**
    * Retrieves the title of the current page after it has fully loaded.
    * 
    * @returns {Promise<string>} - The title of the page.
    */
    protected async getTitle(): Promise<string> {
        await this.page.waitForLoadState('load');
        return await this.page.title();
    }

    /**
    * Waits for a specific element to be attached to the DOM.
    * 
    * @param {string} locator - The locator for the element to wait for.
    * @param {string} name - A descriptive name for the element (not used in this function but could be useful for logging).
    */
    protected async waitSelector(locator: string, name?: string | "Element") {
        await test.step(`Waiting for ${name} Visible`, async () => {
            await this.page.waitForSelector(locator, { timeout: 30000, state: "attached" });
        })
    }

    /**
    * Fetches the value of a specified attribute from an element.
    * 
    * @param {string} locator - The locator for the element.
    * @param {string} attName - The name of the attribute to retrieve.
    * @returns {Promise<string | null>} - The value of the attribute, or null if the attribute does not exist.
    */
    protected async fetchattribute(locator: string, attName: string) {
        const eleValue = await this.page.$(locator)
        return eleValue?.evaluate(node => node.getAttribute(attName))
    }

    /**
    * Retrieves the number of open browser windows (pages) in the current context.
    *  
    * @returns {Promise<number>} - The number of open browser windows.
    */
    protected async multipleWindowsCount(): Promise<number> {
        const windowslength = this.page.context().pages().length;
        return windowslength;
    }

    /**
    * Focuses on a new window that opens after clicking an element and retrieves its title.
    * 
     * @param {string} locator - The locator for the element to click that opens the new window.
     * @returns {Promise<any>} - The title of the newly opened window.
     */
    protected async focusWindow(locator: string): Promise<any> {
        const newPage = this.context.waitForEvent('page');
        await this.page.locator(locator).click()
        const newWindow = await newPage;
        await newWindow.waitForLoadState('load')
        return await newWindow.title();
    }

    /**
     * Switches to a new window that opens after clicking an element and brings it to the front.
     * 
     * @param {string} windowTitle - The title of the window to switch to.
     * @param {string} locator - The locator for the element to click that opens the new window.
     * @returns {Promise<Page | null>} - The new window with the specified title, or null if not found.
     */
    protected async switchToWindow(windowTitle: any, locator: string): Promise<Page | null> {
        const [newPage] = await Promise.all([
            this.context.waitForEvent('page'),
            this.page.locator(locator).click()
        ]);
        const pages = newPage.context().pages();
        for (const page of pages) {
            if (await page.title() === windowTitle) {
                await page.bringToFront();
                return page;
            }
        }
        console.log(`No page found with title: ${windowTitle}`);
        return null;
    }

    protected async acceptAlert(Data?: string) {
        this.page.on("dialog", async (dialog) => {
            dialog.message()
            await dialog.accept(Data);
            console.log('Dialog Message:', dialog.message());
        });
    }

    protected async clickinFrame(frameLocator: string, locator: string, name: string, type: string, index?: number) {
        await test.step(`The ${type} ${name} clicked`, async () => {
            const frameEle = this.page.frameLocator(frameLocator)
            const elementCount = await frameEle.locator(locator).count();
            if (elementCount > 0) {
                await this.page.frameLocator(frameLocator).locator(locator).nth(index).click({ force: true });
            } else {
                await this.page.locator(locator).click();
            }
        })
    }


    protected async verifyEleinFrame(frameLocator: string, locator: string, name: string) {
        await test.step(`Verifying the ${name} is present in the frame`, async () => {
            try {
                await this.page.waitForSelector(frameLocator, { state: 'attached', timeout: 5000 });
            } catch (error) {
                return;
            }
            const frameEle = this.page.frameLocator(frameLocator)
            const elementCount = await frameEle.locator(locator).count();
            if (elementCount > 0) {
                try {
                    const frameVisible = await frameEle.locator('body').isVisible({ timeout: 5000 });
                    expect(frameVisible).toBeTruthy();
                    console.log("Frame element is visible");

                } catch (error) {
                    console.error(error)
                }
            }
        });
    }

    protected async verifyAndClickEleinFrame(frameLocator: string, locator: string, name: string) {
        await test.step(`The ${name} is verified`, async () => {
            const frameEle = this.page.frameLocator(frameLocator)
            const elementCount = await frameEle.locator(locator).count();
            if (elementCount > 0) {
                try {
                    expect(frameEle).toBeTruthy()
                    await this.wait('minWait')
                    const ele = frameEle.locator(locator);
                    await expect(ele).toBeVisible()
                    this.wait('minWait')
                    await ele.hover();
                    await ele.click();
                    console.log(`Ele visible`);
                } catch (error) {
                    console.log("Frame not found" + error)
                }
            }
        })
    }


    protected async typeinFrame(flocator: string, locator: string, name: string, data: string) {
        await test.step(`Textbox ${name} filled with data: ${data}`, async () => {
            const frameLocator = this.page.frameLocator(flocator);
            const elementCount = await frameLocator.locator(locator).count();
            if (elementCount > 0) {
                await this.page.frameLocator(flocator).locator(locator).clear();
                await this.page.frameLocator(flocator).locator(locator).fill(data);
                await this.page.keyboard.press("Enter");
            } else {
                await this.page.locator(locator).clear();
                await this.page.locator(locator).fill(data);
                await this.page.keyboard.press("Enter");
            }
        });
    }

    protected async mouseHoverandClick(hoverLocator: string, clickLocator: string, Menu: string, name: string) {
        await test.step(`The ${Menu} ${name} clicked`, async () => {
            await this.page.hover(hoverLocator);
            await this.page.click(clickLocator);

        })
    }

    protected async selectDropdown(selector: string, options: { value?: string; index?: number; label?: string }) {
        await test.step(`Selecting from dropdown using ${JSON.stringify(options)}`, async () => {
            const dropdown = await this.page.locator(selector);

            if (options.value) {
                await dropdown.selectOption({ value: options.value });
                console.log(`Selected by value: ${options.value}`);
            } else if (options.index !== undefined) {
                await dropdown.selectOption({ index: options.index });
                console.log(`Selected by index: ${options.index}`);
            } else if (options.label) {
                await dropdown.selectOption({ label: options.label });
                console.log(`Selected by label: ${options.label}`);
            } else {
                throw new Error('No valid option provided. Please specify value, index, or label.');
            }
        });
    }

    protected async mouseHover(hoverLocator: string, Menu: string) {
        await test.step(`The pointer hovers over the ${Menu} element.  `, async () => {
            await this.page.waitForSelector(hoverLocator, { state: 'visible' });
            await this.page.hover(hoverLocator);
        })
    }

    protected async draganddrop(sourceLocator: string, targetLocator: string) {
        await test.step(`The sourceElement dragged  to targetElement Succesfully`, async () => {
            const sourceElement = this.page.locator(sourceLocator);
            const targetElement = this.page.locator(targetLocator);
            await sourceElement.dragTo(targetElement);
        })
    }

    protected async keyboardAction(locator: string, keyAction: string, Menu: string, name: string) {
        await test.step(`The ${Menu} ${name} Entered`, async () => {
            await this.page.focus(locator)
            await this.page.keyboard.press(keyAction)
        })
    }

    protected async doubleClick(locator: string, name: string) {
        await test.step(`The ${name} clicked`, async () => {
            await this.page.locator(locator).click({ force: true })
            await this.page.locator(locator).click({ force: true })
        })
    }

    protected async verification(locator: string, expectedTextSubstring: string) {
        const element = this.page.locator(locator).nth(0);
        const text = await element.innerText();
        console.log(text);
        const lowerCaseText = text.toLowerCase();
        const lowerCaseExpected = expectedTextSubstring.toLowerCase();
        expect(lowerCaseText).toContain(lowerCaseExpected);
    }


    protected async waitForElementHidden(locator: string, type: string) {
        try {
            await this.wait('minWait')
            await this.page.waitForSelector(locator, { state: 'hidden', timeout: 20000 });
            console.log(`Element with XPath "${type}" is hidden as expected.`);
        } catch (error) {
            console.error(`Element with XPath "${type}" is still visible.`);
        }
    }


    protected async validateElementVisibility(locator: any, elementName: string) {
        try {
            const element = this.page.locator(locator);
            await this.page.waitForSelector(locator, { state: 'attached', timeout: 30000, strict: true });
            if (await element.isVisible()) {
                console.log(`${elementName} is visible as expected.`);
            } else {
                console.error(`${elementName} is not visible.`);
            }
        } catch (error) {
            console.error(`Error validating visibility of ${elementName}: ${error}`);
        }
    }


    protected async uploadMultipleContent(fileName1: string, fileName2: string, locator: any) {
        const inputElementHandle = this.page.locator(locator)
        if (inputElementHandle) {
            await inputElementHandle.setInputFiles([path.resolve(__dirname, fileName1),
            path.resolve(__dirname, fileName2)])
        } else {
            console.error('Input element not found');
        }
    }

    protected async samplefile(locator: string, Path: string,) {
        const filePath = path.resolve(__dirname, Path);
        const inputElementHandle = this.page.locator(locator);
        const binaryFormat = fs.readFileSync(filePath, { encoding: 'binary' });
        if (inputElementHandle) {
            await inputElementHandle.setInputFiles(binaryFormat);
        } else {
            console.error('Input element not found');
        }
        await this.wait('maxWait');
    }

    protected async uploadFile(locator: string, Path: string,) {
        const filePath = path.resolve(__dirname, Path);
        const inputElementHandle = this.page.locator(locator);
        if (inputElementHandle) {
            await inputElementHandle.setInputFiles(filePath);
        } else {
            console.error('Input element not found');
        }
        await this.wait('maxWait');
    }

    /**
    * Waits for a specified duration based on the wait type provided.
    * 
    * @param {'minWait' | 'mediumWait' | 'maxWait'} waitType - The type of wait duration ('minWait', 'mediumWait', or 'maxWait').
    */
    async wait(waitType: 'minWait' | 'mediumWait' | 'maxWait') {
        try {
            switch (waitType) {
                case 'minWait':
                    await this.page.waitForTimeout(3000);
                    break;
                case 'mediumWait':
                    await this.page.waitForTimeout(5000);
                    break;
                case 'maxWait':
                    await this.page.waitForTimeout(10000);
                    break;
                default:
                    console.log("Invalid wait type provided.");
                    throw new Error(`Invalid wait type: ${waitType}`);
            }
        } catch (error) {
            console.error("Error during wait:", error);
        }
    }


    async spinnerDisappear(): Promise<void> {
        await this.wait('minWait');
        const spinner = this.page.locator("//div[@class='slds-spinner_container slds-grid']");
        await expect(spinner).toHaveCount(0);
        console.log("expected element is disabled");
    }

    protected async typeText(locator: string, name: string, data: Promise<string | null>) {
        const resolvedData = await data;
        await test.step(`Textbox ${name} filled with data: ${resolvedData}`, async () => {
            if (resolvedData !== null) {
                await this.page.locator(locator).fill(resolvedData);
            } else {
                throw new Error(`Cannot fill textbox ${name} with null data`);
            }
        });
    }

    protected async isCheckboxClicked(locator: string, name: string) {
        await test.step(`Checkbox ${name} is selected`, async () => {
            await this.page.focus(locator);
            await this.page.check(locator, { force: true });
            let value = await this.page.isChecked(locator);
            if (value == false) {
                console.log("The CheckBox is not Clicked");
            }

        })
    }

    protected async handleAxisCoordinateClick(x_axis: number, y_axis: number) {
        await test.step(`The X-axis at ${x_axis} and ${y_axis} at 234 were clicked successfully.`, async () => {
            await this.wait('minWait');
            await this.page.mouse.click(x_axis, y_axis, { delay: 300 });
            await this.wait('minWait');
        })

    }

    protected async radioButton(locator: string, name: string) {
        await test.step(`Checkbox ${name} is selected`, async () => {

            if (!await this.page.isChecked(locator)) {
                await this.page.focus(locator)
                await this.page.check(locator, { force: true });
            } else {
                console.log("The button is already checked")
            }
        })
    }

    protected async childTab(locator: string): Promise<void> {

        [PlaywrightWrapper.newPage] = await Promise.all([
            this.context.waitForEvent('page'),
            this.page.locator(locator).click()
        ]);

        this.page = (await this.context.pages())[this.context.pages().length - 1];
    }

    protected switchToParentPage(): void {
        const pages = this.context.pages();
        if (pages.length > 0) {
            this.page = pages[0];
            this.page.bringToFront();
        } else {
            throw new Error('Parent page is not available');
        }
    }

    protected switchToChildPage(index: number): void {
        const pages = this.context.pages();
        if (pages.length > index) {
            this.page = pages[index];
            this.page.bringToFront();
        } else {
            throw new Error('Page at the specified index is not available');
        }
    }
    getById(locator: string): Locator {
        return this.page.locator(`#${locator}`)
    }
    getByClass(locator: string): Locator {
        return this.page.locator(`[class='${locator}']`)
    }

    /**
 * Interacts with a web element based on the given attribute and action.
 *
 * @param {string} attribute - The type of locator to use ("LABEL", "PLACEHOLDER", "TEXT", "TITLE", "ALTTEXT", "ID", "CLASS").
 * @param {string} locator - The value of the locator to find the element.
 * @param {string} action - The action to perform on the element ("click" or "fill").
 * @param {string} [data] - The data to input if the action is "fill" (optional).
 * @throws {Error} Throws an error if an unsupported attribute or action is used.
 */
    protected async interactWithElement(
        attribute: "LABEL" | "PLACEHOLDER" | "TEXT" | "TITLE" | "ALTTEXT" | "ID" | "CLASS",
        locator: string,
        action: "click" | "fill",
        data: string = ""
    ): Promise<void> {
        if (!locator) {
            throw new Error("Locator must be provided.");
        }

        if (action === "fill" && !data) {
            throw new Error("Data must be provided for the 'fill' action.");
        }

        switch (attribute) {
            case "LABEL":
                if (action === "click") {
                    await this.page.getByLabel(locator).click();
                } else {
                    await this.page.getByLabel(locator).fill(data);
                }
                break;

            case "PLACEHOLDER":
                if (action === "click") {
                    await this.page.getByPlaceholder(locator).click();
                } else {
                    await this.page.getByPlaceholder(locator).fill(data);
                }
                break;

            case "TEXT":
                if (action === "click") {
                    await this.page.getByText(locator).click();
                } else {
                    throw new Error("The 'fill' action is not supported for 'TEXT' attributes.");
                }
                break;

            case "TITLE":
                if (action === "click") {
                    await this.page.getByTitle(locator).click();
                } else {
                    throw new Error("The 'fill' action is not supported for 'TITLE' attributes.");
                }
                break;

            case "ALTTEXT":
                if (action === "click") {
                    await this.page.getByAltText(locator).click();
                } else {
                    throw new Error("The 'fill' action is not supported for 'ALTTEXT' attributes.");
                }
                break;

            case "ID":
                const idSelector = `#${locator}`;
                if (action === "click") {
                    await this.page.locator(idSelector).click();
                } else {
                    await this.page.locator(idSelector).fill(data);
                }
                break;

            case "CLASS":
                const classSelector = `.${locator}`;
                if (action === "click") {
                    await this.page.locator(classSelector).click();
                } else {
                    await this.page.locator(classSelector).fill(data);
                }
                break;

            default:
                throw new Error(`Unsupported attribute: ${attribute}`);
        }
    }


}
