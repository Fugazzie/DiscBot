import DiscordJS, { Intents, Message } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const client = new DiscordJS.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log("The Bot is ready");
});

client.on("messageCreate", (message) => {
  if (message.content.substring(0, 10) === "!translate") {
    let sourceString = message.content.slice(10);

    const puppeteer = require("puppeteer");

    async function translateText(url: string) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      await page.goto(url);

      await page.waitForTimeout(2000);

      await page.waitForTimeout(5000);
      await page.waitForSelector(
        "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb.EjH7wc > div.AxqVh > div.OPPzxe > c-wiz.P6w8m > div.tm8pq"
      );

      const [val1] = await page.$x(
        '//*[@id="yDmH0d"]/c-wiz/div/div[2]/c-wiz/div[2]/c-wiz/div[1]/div[2]/div[3]/c-wiz[2]/div[7]/div/div[1]/span[1]/span/span'
      );
      const txtval1 = await val1.getProperty("textContent");
      const rawtxtval1 = await txtval1.jsonValue();
      let resp = String("Your translation is: " + rawtxtval1);
      browser.close();

      message.reply({
        content: resp,
      });
    }

    translateText(
      "https://translate.google.com/?sl=auto&tl=en&text=" +
        sourceString +
        "&op=translate"
    );
  }
  if (message.content.substring(0, 7) === "!random") {
    let num = parseInt(message.content.slice(7));
    let rand = Math.floor(Math.random() * num) + 1;
    var response = "Your random number between 1 and " + num + " is: " + rand;

    message.reply({
      content: response,
    });
  }
  if (message.content.substring(0, 5) === "!food") {
    let postcode = message.content.slice(5);

    const puppeteer = require("puppeteer");

    async function scrapeProduct(url: string) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);

      const [el1] = await page.$x("//div/div/a/div/div[2]/div[1]/span");
      const txt1 = await el1.getProperty("textContent");
      const rawTxt1 = await txt1.jsonValue();

      const [el1Ad] = await page.$x("//div/div/a/div/div[2]/div[3]");
      const txt1Ad = await el1Ad.getProperty("textContent");
      const rawTxt1Ad = await txt1Ad.jsonValue();

      const [el1Rt] = await page.$x(
        "//div/div/a/div/div[2]/div[2]/span[1]/span[1]"
      );
      const txt1Rt = await el1Rt.getProperty("textContent");
      const rawTxt1Rt = await txt1Rt.jsonValue();

      const [el2] = await page.$x("//div[2]/div/a/div/div[2]/div[1]/span");
      const txt2 = await el2.getProperty("textContent");
      const rawTxt2 = await txt2.jsonValue();

      const [el2Ad] = await page.$x("//div[2]/div/a/div/div[2]/div[3]");
      const txt2Ad = await el2Ad.getProperty("textContent");
      const rawTxt2Ad = await txt2Ad.jsonValue();

      const [el2Rt] = await page.$x(
        "//div[2]/div/a/div/div[2]/div[2]/span[1]/span[1]"
      );
      const txt2Rt = await el2Rt.getProperty("textContent");
      const rawTxt2Rt = await txt2Rt.jsonValue();

      let nam1 = rawTxt1.toString();
      let add1 = rawTxt1Ad.toString();
      let rat1 = rawTxt1Rt.toString();

      let nam2 = rawTxt2.toString();
      let add2 = rawTxt2Ad.toString();
      let rat2 = rawTxt2Rt.toString();
      let resp = String(
        "Restaurant One: " +
          nam1 +
          ". Address: " +
          add1 +
          ". Rating: " +
          rat1 +
          ". \n Restaurant Two: " +
          nam2 +
          ". Address: " +
          add2 +
          ". Rating: " +
          rat2
      );
      browser.close();

      message.reply({
        content: resp,
      });
    }

    scrapeProduct("https://www.google.com/search?q=takeaways+near+" + postcode);
  }
  if (message.content.substring(0, 5) === "!wiki") {
    let wikiSearch = message.content.slice(5);

    const puppeteer = require("puppeteer");

    async function scrapeProduct(url: string) {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(url);
      const [el] = await page.$x('//*[@id="mw-content-text"]/div[1]/p[2]');
      const txt = await el.getProperty("textContent");
      const rawTxt = await txt.jsonValue();

      let resp = rawTxt.replaceAll(/\[(.+?)\]/g, "");

      browser.close();

      message.reply({
        content: resp,
      });
    }
    wikiSearch = wikiSearch.split(".").join("x");

    scrapeProduct("https://en.wikipedia.org/wiki/" + wikiSearch);
  }
  if (message.content.substring(0, 6) === "!table") {
    const puppeteer = require("puppeteer");
    const {
      MessageEmbed,
      MessageAttachment,
      interaction,
    } = require("discord.js");
    async function table() {
      const browser = await puppeteer.launch({
        // args: [
        //     '--window-size=1920,1080',
        // ]
      });
      const page = await browser.newPage();
      const url = "https://www.premierleague.com/tables";
      await page.goto(url);
      await page.screenshot({
        path: "table.jpg",
        clip: {
          x: 0,
          y: 275,
          width: 800,
          height: 1275,
        },
      });
      const attachment = new MessageAttachment("table.jpg");

      message.reply({ files: [attachment] });
      browser.close();
    }
    table();
  }
  if (message.content.substring(0, 5) === "!imdb") {
    let val = message.content.slice(5);
    const { discord, Message, MessageEmbed } = require("discord.js");
    const imdb = require("imdb-api");
    async function imdbSearch() {
      const imob = new imdb.Client({ apiKey: "8318ba9e" });

      let movie = await imob.get({ name: val });

      let embed = new MessageEmbed()
        .setTitle(movie.title)
        .setColor("#ff2050")
        .setThumbnail(movie.poster)
        .setDescription(movie.plot)
        .setFooter({
          text: `Ratings: ${movie.rating}`,
        })
        .addField("Country", movie.country, true)
        .addField("Languages", movie.languages, true)
        .addField("Type", movie.type, true);

      message.reply({ embeds: [embed] });
    }
    imdbSearch();
  }
  if (message.content.length >= 400) {
    let pastebinText = message.content;
    const puppeteer = require("puppeteer");

    async function tldr() {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      // await page.goto("https://pastebin.com/login");
      // await page.click('body > div.wrap > div.header > div > div > div.header__right > div > a.btn-sign.sign-in');
      // await page.waitForNavigation();
      //=======================================
      // couldn't get the login to work because puppeteer keeps getting timed out with cloudflare

      await page.goto("https://pastebin.com/");
      await page.click(
        "#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.sc-ifAKCX.ljEJIv"
      ); //privacy agreement
      await page.type("#postform-text", pastebinText);

      //selects the expiration of paste to 10 minutes
      await page.click("#select2-postform-expiration-container");
      await page.click(
        "#select2-postform-expiration-results > li:nth-child(3)"
      );

      //select the exposure as unlisted
      await page.click("#select2-postform-status-container");
      await page.click("#select2-postform-status-results > li:nth-child(2)");

      //submit the paste
      await page.click(
        "#w0 > div.post-form__bottom > div.post-form__left > div.form-group.form-btn-container > button"
      );
      await page.waitForNavigation();

      //retrieve the new url
      const newUrl = await page.url();
      // console.log(newUrl); //for testing

      //close the puppet session
      await browser.close();
      await message.channel.send(
        "tl;dr your message was too long! \r\nClick here to read the full message: " +
          newUrl
      );
    }

    tldr();
    message.delete();

    //print length of message
    // console.log(pastebinText.length); //for testing
  }
});

client.login(process.env.TOKEN);
