import { browserCommander } from "../core/puppeteer";
import * as cheerio from "cheerio";

export class ComicSearcher {
  static async search(keyword: string) {
    const encodedKeyword = encodeURIComponent(keyword);
    const targetUrl = `https://18comic.vip/search/photos?search_query=${encodedKeyword}`;

    try {
      const { html } = await browserCommander.navigateToUrl(targetUrl);
      return this.parseSearchResults(html);
    } catch (error) {
      logger.error(
        `💥 搜索失败：${error instanceof Error ? error.message : "未知错误"}`
      );
      throw error;
    }
  }

  private static parseSearchResults(html: string) {
    const $ = cheerio.load(html);
    const results: Array<Record<string, any>> = [];
    const selector = ".col-xs-6.col-sm-6.col-md-4.col-lg-3.list-col";

    $(selector).each((index, element) => {
      const card = $(element);

      const extract = (selector: string, attr?: string) =>
        attr
          ? card.find(selector).attr(attr)?.trim() || ""
          : card.find(selector).text().trim();

      const tags: string[] = [];
      card.find(".tags .tag").each((i, tag) => {
        tags.push($(tag).text().trim());
      });

      const resultData = {
        title: extract(".video-title"),
        views: extract(".text-white:first"),
        imgSrc: extract("img", "data-original") || extract("img", "src"), // 备用src
        category: extract(".label-category"),
        albumLink: extract("a", "href"),
        tags,
        likes: extract(".label-loveicon span"),
        author: extract(".title-truncate a:not(.tag)"),
      };

      results.push(resultData);
    });

    return {
      success: results.length > 0,
      count: results.length,
      data: results,
    };
  }
}
