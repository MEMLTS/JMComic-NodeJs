// 搜索
import { ComicSearcher } from "./modules/search";
import { setupLogger } from "./core/log";
import { browserCommander } from "./core/puppeteer";

// 初始化日志
setupLogger();

// 初始化浏览器
try {
    await browserCommander.initBrowser();
    logger.info("🚀 浏览器初始化完成");
} catch (error) {
    logger.error("浏览器初始化失败", error);
}


// 测试搜索功能
(async () => {
    const result = await ComicSearcher.search("触電");
    logger.info("搜索结果:", result);
})();
