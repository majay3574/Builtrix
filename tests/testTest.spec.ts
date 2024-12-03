import { test } from "@playwright/test";
import { PlaywrightIndexedDB } from "playwright-indexeddb";

test("example test", async ({ page }) => {
    // Initialize IndexedDB
    const db = new PlaywrightIndexedDB(page, {
        dbName: "myDatabase",
        storeName: "myStore",
        version: 1, 
    });

    
    await db.putItem({ id: 1, name: "Test Item" }, 1);
    const item = await db.getItem(1);
    const allItems = await db.getAllItems();
    console.log(item);
    await db.deleteItem(1);
    await db.clear();
});