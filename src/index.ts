// 搜索
// import { search } from "./modules/search";
import { setupLogger } from "./core/log";

// 初始化日志
setupLogger();


// // 测试搜索功能
// (async () => {
//     const result = await search("触電");
//     logger.info("搜索结果:", result);
// })();

// import { detail } from "./modules/detail";

// logger.info("开始获取详情");
// (async () => {
//     const result = await detail(1023983);
//     logger.info("详情结果:", result);
// })();

// // 内容
// import { Introduction } from "./modules/Introduction";

// (async () => {
//     const result = await Introduction(1023983);
//     logger.info("内容结果:", result);
// })();