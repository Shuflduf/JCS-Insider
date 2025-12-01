const NEWS_CENTRE_URL: &str = "https://joanecardinalschubert.cbe.ab.ca/news-centre";

fn main() {
    let page_html = reqwest::blocking::get(NEWS_CENTRE_URL)
        .unwrap()
        .text()
        .unwrap();
    let page_content = scraper::Html::parse_document(&page_html);
    println!("{page_content:?}");
}
