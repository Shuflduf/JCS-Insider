import fs from 'fs';
import puppeteer from "puppeteer";
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
    // Start a Puppeteer session with:
    // - a visible browser (`headless: false` - easier to debug because you'll see the browser in action)
    // - no default viewport (`defaultViewport: null` - website page will in full width and height)
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto("https://joanecardinalschubert.cbe.ab.ca/news-centre", {
        waitUntil: "networkidle2",
    });

    await page.click('input.checkbox-tag[name="weekly update"]');
    await page.waitForNetworkIdle()

    const articles = await page.evaluate(() => {
        const allArticles = document.querySelectorAll('.news-article');

        return Array.from(allArticles).map((page) => {
            return page.querySelector("a")?.href;
        });

    });
    console.log(articles[0])

    await page.goto(articles[0], {
        waitUntil: "networkidle2"
    })

    await page.waitForSelector("#cravens-menu", { timeout: 5000 })

    const frames = await page.frames();
    const targetFrame = frames.find(frame => frame !== page.mainFrame());

    if (!targetFrame) {
        throw new Error('Could not find iframe');
    }

    const content = await targetFrame.evaluate(() => {
        const editor = document.querySelector("#cravens-menu");
        return editor ? editor.innerHTML : null;
    });
    console.log(content?.innerHTML)

    const res = await page.evaluate(() => {
        const foodMenu = document.querySelector("#cravens-menu")
        return foodMenu
    })
    console.log(res?.className)


    // Close the browser
    await browser.close();

    return new Response({})
};

