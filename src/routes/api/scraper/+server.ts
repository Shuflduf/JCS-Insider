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
    // const latestPostUrl = await getLatestPostUrl();
    const latestPostUrl = "https://joanecardinalschubert.cbe.ab.ca/news/50218c72-8b11-41bf-8871-61d54f6d01d5"
    await page.goto(latestPostUrl, {
        waitUntil: "networkidle2",
    });

    await page.waitForSelector("#cravens-menu", { timeout: 5000 })
    const result = await page.evaluate(() => {
        const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday"];
        const menu = document.querySelector("#cravens-menu") as HTMLDivElement;
        let nextSibling = menu.nextElementSibling as HTMLDivElement;
        let siblings: HTMLDivElement[] = [];
        let tree: any = {};
        let currentWeekday: string = ""
        while (nextSibling && nextSibling.tagName !== "DIV") {
            WEEKDAYS.forEach(weekday => {
                if (nextSibling.innerText.startsWith(weekday)) {
                    currentWeekday = weekday
                    currentWeekday.trim()
                    tree[currentWeekday] = [];
                    // tree[weekday] = nextSibling.innerText;
                }
            });
            tree[currentWeekday]
            siblings.push(nextSibling as HTMLDivElement);
            nextSibling = nextSibling.nextElementSibling as HTMLDivElement;
        }



        return tree
        // return siblings.map((sibling) => {
        //     return sibling.innerText;
        // })
    });

    console.log(result);

    // const frames = await page.frames();

    // console.log(frames);
    // const eoriw = await frames[1].evaluate(() => {
    //     const menu = document.querySelector("#cravens-menu");
    //     return menu;
    // })
    // console.log(eoriw)


    await browser.close();

    return new Response({})
};

async function getLatestPostUrl(): Promise<string> {

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

    await browser.close();

    console.log(articles[0]);
    return articles[0] ?? ""

}