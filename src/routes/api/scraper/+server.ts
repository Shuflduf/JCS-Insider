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

    const html = await page.content()
    fs.writeFileSync("page.html", html)


    const res = await page.evaluate(() => {
        const foodMenu = document.querySelector("#cravens-menu")
        console.log(foodMenu)
    })
    console.log(res)


    // Close the browser
    //await browser.close();

    return new Response({})
};

