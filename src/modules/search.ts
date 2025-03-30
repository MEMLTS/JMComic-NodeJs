import { browserCommander } from "../core/puppeteer.js";
import * as cheerio from "cheerio";

export class ComicSearcher {
  static async search(keyword: string) {
    const encodedKeyword = encodeURIComponent(keyword);
    const targetUrl = `https://18comic.vip/search/photos?search_query=${encodedKeyword}`;

    try {
      const { html } = await browserCommander.navigateToUrl(targetUrl);
      return this.parseSearchResults(html);
    } catch (error) {
      console.error(`💥 搜索失败：${error instanceof Error ? error.message : '未知错误'}`);
      throw error;
    }
  }

  private static parseSearchResults(html: string) {
    const $ = cheerio.load(html);
    const results: Array<Record<string, string>> = [];

    $(".col-xs-6.col-sm-6.col-md-4.col-lg-3.list-col").each((i, el) => {
      const title = $(el).find(".video-title").text().trim();
      const views = $(el).find(".text-white").first().text().trim();
      const imgSrc = $(el).find("img").attr("data-original") || '';
      const category = $(el).find(".label-category").text().trim();

      results.push({
        title,
        views,
        imgSrc,
        category,
        platform: "18comic"
      });
    });

    return {
      success: results.length > 0,
      count: results.length,
      data: results
    };
  }
}

(async () => {
  await browserCommander.initBrowser();

  const result = await ComicSearcher.search("触電");
  console.log("搜索结果:", result);
})();