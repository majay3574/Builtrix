
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
            console.error('New tab is not initialized. Did you forget to call childTab()?');
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
            await this.page.goto(url);
        } catch (error) {
            console.error(`Failed to navigate to ${url}`, error);
            throw error;
        }
    }

    /**
   * Types into the specified textbox after clearing any existing text.
   * 
   * @param {string} locator - The locator for the textbox element.
   * @param {string} name - The name of the textbox element.
   * @param {string} data - The data to be typed into the textbox.
   */
    protected async type(locator: string, name: string, data: string) {
        await test.step(`Textbox ${name} filled with data: ${data}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 10000 });
                await this.page.locator(locator).clear();
                await this.page.locator(locator).fill(data);
            } catch (error) {
                console.error(`Failed to type in textbox '${name}' with locator '${locator}'. Error: ${(error)}`);
                throw error;
            }
        });
    }



    /**
     * Types into the specified textbox, clears existing text, and presses <ENTER>.
     * @param {string} locator - The locator for the textbox element.
     * @param {string} name - The name of the textbox element.
     * @param {string} data - The data to be typed into the textbox.
     */
    protected async fillAndEnter(locator: string, name: string, data: string) {
        await test.step(`Textbox ${name} filled with data: ${data}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                await this.page.locator(locator).clear();
                await this.page.fill(locator, data, { force: true });
                await this.page.focus(locator);
                await this.page.keyboard.press("Enter");
            } catch (error) {
                console.error(`❌ Error in fillAndEnter for "${name}" [${locator}]: ${(error)}`);
                throw error;
            }
        });
    }


    /**
    * Types the specified data into a textbox using keyboard input, after clearing existing text.
    * @param {string} locator - The locator for the textbox element.
    * @param {string} data - The data to be typed into the textbox.
  */
    protected async keyboardType(locator: string, data: string) {
        await test.step(`Textbox filled with data: ${data}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                await this.page.locator(locator).clear();
                await this.page.focus(locator);
                await this.page.keyboard.type(data, { delay: 100 });
            } catch (error) {
                console.error(`❌ Error in keyboardType for locator '${locator}' with data '${data}': ${(error)}`);
                throw error;
            }
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
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                await this.page.locator(locator).clear();
                await this.page.focus(locator);
                await this.page.keyboard.type(data, { delay: 400 });
                await this.page.keyboard.press("Enter");
            } catch (error) {
                console.error(`Error in typeAndEnter for "${name}" using locator "${locator}" with data "${data}": ${(error)}`);
                throw error;
            }
        });
    }


    /**
     * Clicks on the specified textbox element.
     * @param {string} locator - The locator for the element.
     * @param {string} name - The name of the element.
     * @param {string} type - The type of the element
     */

    protected async click(locator: string, name: string, type: string, description?: string) {
        await test.step(`The ${name} ${type} clicked${description ? ` - ${description}` : ''}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                await this.page.locator(locator).click();
            } catch (error) {
                console.error(
                    `Error in click action for "${name}" of type "${type}" with locator "${locator}"${description ? ` - ${description}` : ''}. ` +
                    `Details: ${(error)}`);
                throw error;
            }
        });
    }

    /**
    * Performs a forceful click on a web element, regardless of visibility or overlap.
    *
    * @param locator - The selector of the element to be clicked.
    * @param name - The name of the element (used in reporting).
    * @param type - The type of the element (e.g., button, link).
    */
    protected async forceClick(locator: string, name: string, type: string) {
        await test.step(`The ${name} ${type} clicked (force)`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                await this.page.locator(locator).click({ force: true });
            } catch (error) {
                console.error(
                    `Error in forceClick for "${name}" of type "${type}" using locator "${locator}". ` +
                    `Details: ${(error)}`
                );
                throw error;
            }
        });
    }

    /**
    * Stores the current browser context's storage state to the specified file path.
     * @param path - The file system path where the storage state JSON should be saved.
    */
    async storeState(path: string): Promise<void> {
        try {
            await this.context.storageState({ path });
            console.log(`Storage state saved to: ${path}`);
        } catch (error) {
            console.error(`Failed to save storage state to: ${path}`, error);
            throw error;
        }
    }

    /**
    * Retrieves the inner text of the specified element.
    * 
    * @param {string} locator - The locator for the element.
    * @returns {Promise<string>} - The inner text of the element.
    *  @throws Error if the element is not found or retrieval fails.
    */
    protected async getInnerText(locator: string): Promise<string> {
        return await test.step(`Get innerText for element: ${locator}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                const text = await this.page.locator(locator).innerText();
                return text;
            } catch (error) {
                console.error(`Failed to get innerText for locator '${locator}': ${(error)}`);
                throw error;
            }
        });
    }


    /**
   * Retrieves the text content of the specified element.
   * 
   * @param locator - The selector for the element.
   * @returns The text content of the element, or null if the element exists but has no content.
   * @throws Error if the element is not found or the retrieval fails.
   */
    protected async getTextContent(locator: string): Promise<string> {
        return await test.step(`Get textContent for element: ${locator}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                return await this.page.locator(locator).textContent() ?? "";
            } catch (error) {
                console.error(`Failed to get textContent for locator '${locator}': ${(error)}`);
                throw error;
            }
        });
    }


    /**
    * Retrieves the input value of the specified element (e.g., from an input field).
    * 
    * @param {string} locator - The locator for the input element.
    * @returns {Promise<string>} - The current value of the input element.
    */
    protected async getText(locator: string): Promise<string> {
        return await test.step(`Get inputValue for element: ${locator}`, async () => {
            try {
                await this.page.waitForSelector(locator, { state: 'visible', timeout: 5000 });
                return await this.page.locator(locator).inputValue();
            } catch (error) {
                console.error(`Failed to get textContent for locator '${locator}': ${(error)}`);
                throw error;
            }
        });

    }

    /**
   * Retrieves the title of the current page after it has fully loaded.
   * 
   * @returns The title of the page.
   * @throws Error if the title retrieval fails.
   */
    protected async getTitle(): Promise<string> {
        return await test.step(`Get page title`, async () => {
            try {
                await this.page.waitForLoadState('load', { timeout: 5000 });
                return await this.page.title();
            } catch (error) {
                console.error(`Failed to retrieve page title: ${(error)}`);
                throw error;
            }
        });
    }


    /**
 * Waits for a specific element to be attached to the DOM.
 *
 * @param locator - The selector of the element to wait for.
 * @param name - Descriptive name for logging/reporting.
 */
    protected async waitSelector(locator: string, name: string = "Element"): Promise<void> {
        await test.step(`Waiting for ${name} to be attached`, async () => {
            try {
                await this.page.waitForSelector(locator, { timeout: 30000, state: "attached" });
            } catch (error) {
                console.error(`Failed to wait for ${name} [${locator}]: ${(error)}`);
                throw error;
            }
        });
    }

    /**
     * Fetches the value of a specified attribute from an element.
     *
     * @param locator - The selector of the element.
     * @param attName - The attribute name to retrieve.
     * @returns The attribute value, or null if not found.
     */
    protected async fetchAttribute(locator: string, attName: string): Promise<string | null> {
        try {
            const ele = await this.page.$(locator);
            return await ele?.evaluate((node, name) => node.getAttribute(name), attName) ?? null;
        } catch (error) {
            console.error(`Failed to fetch attribute '${attName}' from '${locator}': ${(error)}`);
            throw error;
        }
    }

    /**
     * Retrieves the number of open browser windows (pages).
     *
     * @returns The number of pages in the current browser context.
     */
    protected async multipleWindowsCount(): Promise<number> {
        try {
            return this.page.context().pages().length;
        } catch (error) {
            console.error(`Failed to get the count of multiple windows: ${(error)}`);
            throw error;
        }
    }

    /**
     * Clicks an element and returns the title of the newly opened window.
     *
     * @param locator - The selector of the element to click.
     * @returns The title of the new window.
     */
    protected async focusWindow(locator: string): Promise<string> {
        try {
            const newPagePromise = this.context.waitForEvent('page');
            await this.page.locator(locator).click();
            const newPage = await newPagePromise;
            await newPage.waitForLoadState('load');
            return await newPage.title();
        } catch (error) {
            console.error(`Failed to focus on new window after clicking '${locator}': ${(error)}`);
            throw error;
        }
    }

    /**
     * Switches to a new window opened by clicking a locator and returns the page if title matches.
     *
     * @param windowTitle - The expected title of the new window.
     * @param locator - The element to click that opens the new window.
     * @returns The matching page or null if not found.
     */
    protected async switchToWindow(windowTitle: string, locator: string): Promise<Page | null> {
        try {
            const [newPage] = await Promise.all([
                this.context.waitForEvent('page'),
                this.page.locator(locator).click()
            ]);

            const pages = newPage.context().pages();
            for (const page of pages) {
                if ((await page.title()) === windowTitle) {
                    await page.bringToFront();
                    return page;
                }
            }

            console.warn(`No window found with title: ${windowTitle}`);
            return null;
        } catch (error) {
            console.error(`Failed to switch to window with title '${windowTitle}': ${(error)}`);
            throw error;
        }
    }

    /**
     * Handles and accepts an alert dialog with optional input.
     *
     * @param data - Optional input to pass to the alert dialog.
     */
    protected async acceptAlert(data?: string): Promise<void> {
        try {
            this.page.on("dialog", async (dialog) => {
                console.log('Dialog Message:', dialog.message());
                await dialog.accept(data);
            });
        } catch (error) {
            console.error(`Failed to accept alert: ${(error)}`);
            throw error;
        }
    }


    /**
 * Switches to a specified frame and clicks an element inside it.
 * If the element is not found inside the frame, it tries to click it in the main page.
 * 
 * @param frameLocator - Selector for the iframe.
 * @param locator - Selector of the element inside the frame.
 * @param name - Descriptive name of the element for logging.
 * @param type - Type of the element (e.g., Button, Link).
 * @param index - Optional index if multiple elements match the locator.
 */
    protected async clickinFrame(
        frameLocator: string,
        locator: string,
        name: string,
        type: string,
        index: number = 0
    ): Promise<void> {
        await test.step(`The ${type} ${name} clicked`, async () => {
            try {
                const frameElement = this.page.frameLocator(frameLocator);
                const elementCount = await frameElement.locator(locator).count();

                if (elementCount > 0) {
                    await frameElement.locator(locator).nth(index).click({ force: true });
                } else {
                    console.warn(`Element not found in frame, attempting in main page: ${locator}`);
                    await this.page.locator(locator).click({ force: true });
                }
            } catch (error) {
                console.error(
                    `Failed to click ${type} '${name}' in frame '${frameLocator}' using locator '${locator}': ${(error)}`
                );
                throw error;
            }
        });
    }


    /**
     * Verifies the presence of an element within a specified frame.
     * 
     * @param frameLocator - The locator for the frame.
     * @param locator - The locator for the element within the frame.
     * @param name - A descriptive name for the element.
     */
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

    /**
     * Verifies the presence of an element within a specified frame and clicks it if found.
     * 
     * @param frameLocator - The locator for the frame.
     * @param locator - The locator for the element within the frame.
     * @param name - A descriptive name for the element.
     */
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


    /**
     * Types data into a textbox within a specified frame, clearing any existing text first.
     * 
     * @param flocator - The locator for the frame.
     * @param locator - The locator for the textbox element within the frame.
     * @param name - A descriptive name for the textbox element.
     * @param data - The data to be typed into the textbox.
     */
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

    /**
     * Hovers over a specified element and clicks another element.
     * 
     * @param hoverLocator - The locator for the element to hover over.
     * @param clickLocator - The locator for the element to click.
     * @param Menu - The name of the menu.
     * @param name - The name of the element being clicked.
     */
    protected async mouseHoverandClick(hoverLocator: string, clickLocator: string, Menu: string, name: string) {
        await test.step(`The ${Menu} ${name} clicked`, async () => {
            await this.page.hover(hoverLocator);
            await this.page.click(clickLocator);

        })
    }

    /**
     * Selects an option from a dropdown using value, index, or label.
     * 
     * @param selector - The selector for the dropdown element.
     * @param options - An object containing the selection criteria (value, index, or label).
     */
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
                console.error('No valid option provided. Please specify value, index, or label.');
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
        console.log(`Expected Value :`, text);
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
            throw error;
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
            throw error;
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
                    console.error(`Invalid wait type: ${waitType}`);
            }
        } catch (error) {
            console.error("Error during wait:", error);
        }
    }


    public async spinnerDisappear(): Promise<void> {
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
                console.error(`Cannot fill textbox ${name} with null data`);
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
            console.error('Parent page is not available');
        }
    }

    protected async switchToChildPage(index: number): Promise<void> {
        const pages = this.context.pages();
        await this.page.waitForLoadState('load');
        if (pages.length > index) {
            this.page = pages[index];
            await this.page.bringToFront();
        } else {
            console.error('Page at the specified index is not available');
        }
    }


    protected getById(locator: string): Locator {
        return this.page.locator(`#${locator}`)
    }
    protected getByClass(locator: string): Locator {
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
            console.error("Locator must be provided.");
        }

        if (action === "fill" && !data) {
            console.error("Data must be provided for the 'fill' action.");
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
                    console.error("The 'fill' action is not supported for 'TEXT' attributes.");
                }
                break;

            case "TITLE":
                if (action === "click") {
                    await this.page.getByTitle(locator).click();
                } else {
                    console.error("The 'fill' action is not supported for 'TITLE' attributes.");
                }
                break;

            case "ALTTEXT":
                if (action === "click") {
                    await this.page.getByAltText(locator).click();
                } else {
                    console.error("The 'fill' action is not supported for 'ALTTEXT' attributes.");
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
                console.error(`Unsupported attribute: ${attribute}`);
        }
    }


}


