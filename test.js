import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import * as cheerio from "cheerio";

// 🌌 量子隐形模式启动
puppeteer.use(StealthPlugin());

class PuppeteerNuclearStrike {
  constructor() {
    this.browser = null;
    this.page = null;
    this.config = {
      launchOptions: {
        headless: false, // "new", // 新型无头模式
        executablePath: '/usr/bin/google-chrome',
        args: [
          "--no-sandbox",
          "--disable-web-security",
          "--disable-features=IsolateOrigins,site-per-process",
        ],
        ignoreHTTPSErrors: true, // 突破SSL护盾
      },
      stealthConfig: {
        availableEvasions: [
          "chrome.app",
          "chrome.csi",
          "chrome.loadTimes",
          "chrome.runtime",
          "iframe.contentWindow",
          "media.codecs",
          "navigator.hardwareConcurrency",
          "navigator.languages",
          "navigator.permissions",
          "navigator.plugins",
          "navigator.webdriver",
          "sourceurl",
          "webgl",
          "window.outerdimensions",
        ],
      },
    };
  }

  async initBrowser() {
    try {
      console.log("🚀 启动量子隐形浏览器...");
      this.browser = await puppeteer.launch(this.config.launchOptions);
      this.page = await this.browser.newPage();

      // 🕶️ 伪装成人类战士
      await this.page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
      );
      await this.page.setExtraHTTPHeaders({
        "accept-language": "zh-CN,zh;q=0.9",
        "sec-ch-ua":
          '"Google Chrome";v="125", "Chromium";v="125", "Not=A?Brand";v="99"',
      });

      // ⚡ 激活反检测系统
      await this.page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, "webdriver", { get: () => false });
      });

      console.log("🕶️ 浏览器启动完成，反检测系统激活...");
    } catch (error) {
      console.error("💥 初始化浏览器失败：", error.message);
      throw error;
    }
  }

  async nuclearStrike(targetUrl) {
    try {
      console.log(`🎯 精确制导打击目标: ${targetUrl}`);
      await this.initBrowser();

      // 🎯 精确制导打击
      await this.page.goto(targetUrl, {
        waitUntil: "networkidle2",
        timeout: 15000,
      });

      // 🔍 量子扫描DOM
      const pageContent = await this.page.evaluate(() => {
        return {
          html: document.documentElement.outerHTML,
          cookies: document.cookie,
          headers: {
            referer: document.referrer,
            origin: location.origin,
          },
        };
      });

      console.log("🧠 页面内容已获取，开始解析数据...");

      // 🧠 智能解析数据...
      const result = this.parseQuantumData(pageContent);
      console.log("✅ 数据解析完成:", JSON.stringify(result, null, 2));

      return result;
    } catch (error) {
      console.error(`💥 核弹偏离轨道: ${error.message}`);
      throw error;
    } finally {
      // 🧹 清理战场
      await this.browser?.close();
      console.log("🧹 浏览器已关闭，战场清理完成...");
    }
  }

  parseQuantumData(data) {
    const $ = cheerio.load(data.html); // 使用获取的HTML进行解析
    const result = [];

    console.log("🔍 开始解析视频项...");

    $(".col-xs-6.col-sm-6.col-md-4.col-lg-3.list-col").each((i, el) => {
      const title = $(el).find(".video-title").text().trim();
      const views = $(el).find(".text-white").first().text().trim(); // 获取观看次数
      const imgSrc = $(el).find("img").attr("data-original"); // 获取图片的 data-original
      const category = $(el).find(".label-category").text().trim(); // 获取分类标签
      const albumLink = $(el).find("a").attr("href"); // 获取专辑链接
      const tags = [];
      const likes = $(el).find(".label-loveicon span").text().trim(); // 获取喜欢次数

      $(el).find(".tags .tag").each((i, tag) => {
        tags.push($(tag).text().trim());
      });

      const author = $(el).find(".title-truncate a:not(.tag)").text().trim();

      result.push({
        title,
        views,
        imgSrc,
        category,
        albumLink,
        tags,
        likes,
        author
      });
    });

    return {
      success: result.length > 0,
      data: result,
      timestamp: Date.now(),
    };
  }
}

// 使用方式：
const striker = new PuppeteerNuclearStrike();
await striker.nuclearStrike("https://18comic.vip/search/photos?search_query=%E8%A7%A6%E7%94%B5");
