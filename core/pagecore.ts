// pageCore.ts
import { Page, BrowserContext } from "@playwright/test";
import { PlaywrightWrapper } from "./PlaywrightWrapper";

export abstract class PageCore extends PlaywrightWrapper {
  constructor(public page: Page, public context: BrowserContext) {
    super(page, context);
  }
}
