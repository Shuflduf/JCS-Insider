import fs from 'fs';
import puppeteer from "puppeteer";
import type { RequestHandler } from './$types';

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday"];

export interface ScrapedData {
    [weekday: string]: {
        [foodType: string]: string;
    };
}

export const GET: RequestHandler = async (event) => {
    // const latestPostUrl = await getLatestPostUrl();
    const latestPostUrl = "https://joanecardinalschubert.cbe.ab.ca/news/50218c72-8b11-41bf-8871-61d54f6d01d5"
    console.log("Found page: ", latestPostUrl)

    let result: string[] = await getBlogData(latestPostUrl)
    let tree: ScrapedData = parseData(result)

    console.log(tree)

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

    // console.log(articles[0]);
    return articles[0] ?? ""

}


async function getBlogData(url: string): Promise<string[]> {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
    });

    const page = await browser.newPage();
    await page.goto(url, {
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
    });

    browser.close();
    return result
}

function parseData(data: string[]): ScrapedData {
    let tree: ScrapedData = {};
    let currentWeekday: string = ""
    data.forEach(item => {
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
    return tree
}
