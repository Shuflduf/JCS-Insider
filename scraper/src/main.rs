use std::{collections::HashMap, error::Error};

use reqwest::{Client, Method, Request, Url, blocking::ClientBuilder};
use scraper::Selector;

const BASE_JCS_URL: &str = "https://joanecardinalschubert.cbe.ab.ca";

#[derive(Debug)]
struct Menu(HashMap<String, Vec<String>>);

fn main() -> Result<(), Box<dyn Error>> {
    // let latest_post_url = get_latest_post()?;
    let latest_post_url =
        "https://joanecardinalschubert.cbe.ab.ca/news/raven-post-december-12-2025-20251215180023";
    let week_menu = get_menu_from_url(&latest_post_url)?;

    println!("{week_menu:#?}");

    Ok(())
}

fn get_menu_from_url(url: &str) -> Result<Menu, Box<dyn Error>> {
    let request = reqwest::blocking::Request::new(Method::GET, Url::parse(url).unwrap());
    let page_html = reqwest::blocking::ClientBuilder::new()
        .user_agent("Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0")
        .build()
        .unwrap()
        .execute(request)
        .unwrap()
        .text()
        .unwrap();
    let page_content = scraper::Html::parse_document(&page_html);
    let craven_cafe_header = page_content
        .select(&Selector::parse("#Craven-Caf")?)
        .next()
        .unwrap();

    let mut menu = Menu(HashMap::new());
    for weekday in craven_cafe_header.next_siblings() {
        let mut child_iter = weekday.children();
        let weekday_name = if let Some(name) = child_iter.next() {
            let weekday_name = name
                .first_child()
                .unwrap()
                .first_child()
                .unwrap()
                .value()
                .as_text()
                .unwrap()
                .to_string();
            // if elem.as_element().unwrap().name

            for could_be_item in child_iter {
                let elem = could_be_item.value().as_element().unwrap();
                if elem.name() == "br" {
                    continue;
                }
                let item_name = &could_be_item
                    .first_child()
                    .unwrap()
                    .value()
                    .as_text()
                    .unwrap()
                    .to_string();
                if item_name.starts_with("\u{a0}") {
                    continue;
                };
                menu.0
                    .entry(weekday_name.clone())
                    .or_insert(vec![])
                    .push(item_name.clone());
            }
        } else {
            break;
        };
    }

    println!("{menu:?}");

    Ok(menu)
}

fn get_latest_post() -> Result<String, Box<dyn Error>> {
    let request = reqwest::blocking::Request::new(
        Method::GET,
        Url::parse(&format!("{BASE_JCS_URL}/news-centre")).unwrap(),
    );
    let page_html = reqwest::blocking::ClientBuilder::new()
        .user_agent("Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0")
        .build()
        .unwrap()
        .execute(request)
        .unwrap()
        .text()
        .unwrap();
    let page_content = scraper::Html::parse_document(&page_html);
    let raven_post_link = page_content
        .select(&Selector::parse(".news-post")?)
        .find(|post| post.attr("href").unwrap().contains("raven-post"))
        .unwrap()
        .attr("href");

    println!("{raven_post_link:?}");
    if let Some(post_url) = raven_post_link {
        return Ok(post_url.to_string());
    } else {
        return Err("Failed to find URL".into());
    }
}
