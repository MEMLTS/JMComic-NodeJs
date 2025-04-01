import * as cheerio from "cheerio";
import { chaosRequest } from "../utils/request";

/**
 * 根据提供的关键词在网站上搜索漫画。
 * @param keyword - 用于搜索的关键词。
 * @returns 返回一个包含漫画搜索结果的对象。
 */
export async function search(keyword: string) {
  const encodedKeyword = encodeURIComponent(keyword);
  const url = `https://18comic-mhws.cc/search/photos?search_query=${encodedKeyword}`;
  logger.info(`🔍 正在搜索关键词: ${keyword}`);

  try {
    const html = await chaosRequest({ url });

    return parseSearchResults(html);
  } catch (error) {
    logger.error('请求失败:', error);
  }
}

/**
 * 解析搜索结果的 HTML 内容，并提取相关的漫画信息。
 * @param html - 搜索结果页面的 HTML 内容。
 * @returns 返回包含漫画信息的对象，包括标题、浏览量、图片链接、标签等。
 */
function parseSearchResults(html: string) {
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
      title: extract(".video-title"), // 漫画标题
      views: extract(".text-white:first"), // 浏览量
      imgSrc: extract("img", "data-original") || extract("img", "src"), // 图片链接（备用src）
      category: extract(".label-category"), // 分类
      albumLink: `https://18comic-mhws.cc${extract("a", "href")}`, // 专辑链接
      tags, // 标签
      likes: extract(".label-loveicon span"), // 点赞数
      author: extract(".title-truncate a:not(.tag)"), // 作者
    };

    results.push(resultData);
  });

  return {
    success: results.length > 0,
    count: results.length,
    data: results,
  };
}
