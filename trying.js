import puppeteer from "puppeteer";
import { Client, Database } from "node-appwrite";
import dateFormat from "dateformat";
const now = new Date();
const datesss = dateFormat(now, "yyyy-mm-dd");

// Init SDK
let client = new Client();
let database = new Database(client);

client
  .setEndpoint("http://localhost:6969/v1") // Your Appwrite Endpoint
  .setProject("62626701c37ffb568013") // Your project ID
  .setKey(
    "96e2b80f08f397d66a3945271bdc3a7f9b4d32e02c134f01bc51654ff1f527a1640f388de1d0a5c306f7aef99522d84fd07891eb7c1cb72f1044a409a37fb629d457ea02cc4f9c09428e3b1ca191439538839bdf17d41f75ed6fc156ef8743c915ef1dc16b7a714169b446179f1695c97064f2985d1ce37f55c67e298eda7168"
  ); // Your secret API key

export async function Start() {
  console.log("start");
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page1 = await browser.newPage();
  const page2 = await browser.newPage();
  page1.setDefaultNavigationTimeout(0);

  // add different websites here
  await page1.goto("https://www.news18.com/");

  page2.setDefaultNavigationTimeout(0);
  await page2.goto("https://www.indiatoday.in/");

  const URL = await page1.evaluate(() => {
    const image = document.querySelectorAll(
      "#__next > div.jsx-368370242.home_wrapper > div:nth-child(1) > div > div.jsx-368370242.left_row > div.jsx-3107391233.top_story > div.jsx-3107391233.top_story_left > div > figure > a:nth-child(1) > img"
    );
    const url = Array.from(image).map((x) => x.src);

    return url;
  });

  const headline = await page1.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "#__next > div.jsx-368370242.home_wrapper > div:nth-child(1) > div > div.jsx-368370242.left_row > div.jsx-3107391233.top_story > div.jsx-3107391233.top_story_left > div > figure > a.jsx-3107391233.head_story_title > figcaption > h1"
      )
    ).map((x) => x.textContent);
  });

  const URL2 = await page2.evaluate(() => {
    const image = document.querySelectorAll(
      "#block-itg-widget-home-page-feature > div > div.featured-post.featured-post-first > a > img"
    );
    const url = Array.from(image).map((x) => x.src);

    return url;
  });

  const headline2 = await page2.evaluate(() => {
    return Array.from(
      document.querySelectorAll(
        "#block-itg-widget-home-page-feature > div > div.featured-post.featured-post-first > h2 > a"
      ) // selector which you wanna scrape the text
    ).map((x) => x.title);
  });

  // Custom naming
  const collId = datesss;

  // creating database for appwrite
  // checking if there is a collection with the same name as now
  // if not, create a new collection
  database.listCollections().then((res) => {
    const list = res.collections.map((x) => x.$id);
    console.log(list);
    const length = list.length;
    if (list[length - 1] === collId) {
      console.log("collection exists");
      (async () => {
        await database
          .createDocument(collId, "unique()", {
            webN: `News18`,
            topic: `${headline[0]}`,
            src: `${URL[0]}`,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });

        await database
          .createDocument(collId, "unique()", {
            webN: `IndiaToday`,
            topic: `${headline2[0]}`,
            src: `${URL2[0]}`,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      })();
    } else {
      console.log("collection does not exist");
      (async () => {
        await database.createCollection(
          collId,
          `${now.toDateString()}`,
          "document",
          ["role:all"],
          ["role:all"]
        );
        database.createStringAttribute(collId, "webN", 225, false);
        database.createStringAttribute(collId, "topic", 225, false);
        database.createStringAttribute(collId, "src", 225, false);
      })();
    }
  });

  await browser.close();
}
