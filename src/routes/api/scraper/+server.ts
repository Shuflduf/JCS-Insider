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

    // Open a new page
    const page = await browser.newPage();

    // On this new page:
    // - open the "http://quotes.toscrape.com/" website
    // - wait until the dom content is loaded (HTML is ready)
    await page.goto("https://joanecardinalschubert.cbe.ab.ca/news-centre", {
        waitUntil: "networkidle2",
    });

    await page.waitForSelector('input.checkbox-tag[name="weekly update"]', {
        timeout: 5000
    });

    await page.click('input.checkbox-tag[name="weekly update"]');
    await page.waitForNetworkIdle()

    const firstArticle = await page.evaluate(() => {
        const articles = document.querySelectorAll('.news-article');

        return Array.from(articles).map((page) => {
            // Fetch the sub-elements from the previously fetched quote element
            // Get the displayed text and return it (`.innerText`)

            return page.querySelector("a")?.href;
        });

    });
    console.log(firstArticle)

    // Close the browser
    await browser.close();

    return new Response({})
};

