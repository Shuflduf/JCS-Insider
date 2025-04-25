import fs from 'fs';
import puppeteer from "puppeteer";
import type { RequestHandler } from './$types';

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday"];

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
    console.log("Found page: ", latestPostUrl)
    await page.goto(latestPostUrl, {
        waitUntil: "networkidle2",
    });

    await page.waitForSelector("#cravens-menu", { timeout: 5000 })
    const result = await page.evaluate(() => {
        const menu = document.querySelector("#cravens-menu") as HTMLDivElement;
        let nextSibling: HTMLDivElement = menu.nextElementSibling as HTMLDivElement;
        let data: string[] = []
        while (nextSibling && nextSibling.tagName !== "DIV") {

            let foodText = nextSibling.innerText;

            data.push(foodText)
            nextSibling = nextSibling.nextElementSibling as HTMLDivElement;
        }


        return data
        // return siblings.map((sibling) => {
        //     return sibling.innerText;
        // })
    });
    console.log(result)

    let tree: {
        [weekday: string]: {
            [foodType: string]: string;
        };
    } = {};
    let currentWeekday: string = ""
    result.forEach(item => {
        let isWeekday = false
        WEEKDAYS.forEach(weekday => {
            if (item.startsWith(weekday)) {
                console.log("Found weekday: ", weekday)
                item.trim()
                tree[weekday] = {};
                currentWeekday = weekday
                isWeekday = true
            }
        })
        if (!isWeekday) {
            if (currentWeekday) {
                let itemData = item.split(": ");
                console.log("Item data: ", itemData)
                if (itemData.length === 2) {
                    const [key, value] = itemData;
                    tree[currentWeekday][key.trim()] = value.trim();
                }
            }
        }
    });

    console.log(tree)

    await browser.close();

    return new Response(JSON.stringify(tree))
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