import { ComicSearcher } from "./modules/search";
import { setupLogger } from "./core/log";
import { browserCommander } from "./core/puppeteer";

(async () => {
    setupLogger();
    await browserCommander.initBrowser();
    logger.info("🚀 浏览器初始化完成");
    const result = await ComicSearcher.search("触電");
    logger.info("搜索结果:", result);
})();
