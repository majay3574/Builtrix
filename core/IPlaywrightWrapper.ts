import { Page, BrowserContext, Locator } from "@playwright/test";

export const WaitTypes = ["minWait", "mediumWait", "maxWait"] as const;
export type WaitType = (typeof WaitTypes)[number];

export const ElementAttributes = [
  "LABEL",
  "PLACEHOLDER",
  "TEXT",
  "TITLE",
  "ALTTEXT",
  "ID",
  "CLASS",
] as const;
export type ElementAttribute = (typeof ElementAttributes)[number];

export const ElementActions = ["click", "fill"] as const;
export type ElementAction = (typeof ElementActions)[number];

export interface IPlaywrightWrapper {
  page: Page;
  readonly context: BrowserContext;

  loadApp(url: string): Promise<void>;
  storeState(path: string): Promise<void>;

  // Typing / Input actions
  type(locator: string, name: string, data: string): Promise<void>;
  fillAndEnter(locator: string, name: string, data: string): Promise<void>;
  keyboardType(locator: string, data: string): Promise<void>;
  typeAndEnter(locator: string, name: string, data: string): Promise<void>;
  typeText(
    locator: string,
    name: string,
    data: Promise<string | null>
  ): Promise<void>;

  // Clicks
  click(
    locator: string,
    name: string,
    type: string,
    description?: string
  ): Promise<void>;
  forceClick(locator: string, name: string, type: string): Promise<void>;
  doubleClick(locator: string, name: string): Promise<void>;
  mouseHoverandClick(
    hoverLocator: string,
    clickLocator: string,
    Menu: string,
    name: string
  ): Promise<void>;
  mouseHover(hoverLocator: string, Menu: string): Promise<void>;
  draganddrop(sourceLocator: string, targetLocator: string): Promise<void>;
  keyboardAction(
    locator: string,
    keyAction: string,
    Menu: string,
    name: string
  ): Promise<void>;

  // Getters
  getInnerText(locator: string): Promise<string>;
  getTextContent(locator: string): Promise<string>;
  getText(locator: string): Promise<string>;
  getTitle(): Promise<string>;
  fetchAttribute(locator: string, attName: string): Promise<string | null>;
  multipleWindowsCount(): Promise<number>;

  // Window / Tab handling
  childTab(locator: string): Promise<void>;
  switchToParentPage(): void;
  switchToChildPage(index: number): Promise<void>;
  getNewPage(): Page;
  focusWindow(locator: string): Promise<string>;
  switchToWindow(windowTitle: string, locator: string): Promise<Page | null>;

  // Frame handling
  clickinFrame(
    frameLocator: string,
    locator: string,
    name: string,
    type: string,
    index?: number
  ): Promise<void>;
  verifyEleinFrame(
    frameLocator: string,
    locator: string,
    name: string
  ): Promise<void>;
  verifyAndClickEleinFrame(
    frameLocator: string,
    locator: string,
    name: string
  ): Promise<void>;
  typeinFrame(
    flocator: string,
    locator: string,
    name: string,
    data: string
  ): Promise<void>;

  // Alerts
  acceptAlert(data?: string): Promise<void>;

  // Select / Dropdowns
  selectDropdown(
    selector: string,
    options: { value?: string; index?: number; label?: string }
  ): Promise<void>;

  // Validations
  verification(locator: string, expectedTextSubstring: string): Promise<void>;
  waitForElementHidden(locator: string, type: string): Promise<void>;
  validateElementVisibility(
    locator: string,
    elementName: string
  ): Promise<void>;

  // Uploads
  uploadMultipleContent(
    fileName1: string,
    fileName2: string,
    locator: string
  ): Promise<void>;
  samplefile(locator: string, Path: string): Promise<void>;
  uploadFile(locator: string, Path: string): Promise<void>;

  // Waits
  wait(waitType: WaitType): Promise<void>;

  // Checkbox / Radio
  isCheckboxClicked(locator: string, name: string): Promise<void>;
  radioButton(locator: string, name: string): Promise<void>;

  // Locator helpers
  getById(locator: string): Locator;
  getByClass(locator: string): Locator;

  // Smart interaction
  interactWithElement(
    attribute: ElementAttribute,
    locator: string,
    action: ElementAction,
    data?: string
  ): Promise<void>;
}
