//日志
import { setupLogger } from "../src/core/log";

// 初始化日志
setupLogger();


// // 搜索
// import { search } from "@/modules/search";
// (async () => {
//     const result = await search("基尼奇");
//     logger.info("搜索结果:", result);
// })();

// // 详情
// import { detail } from "@/modules/detail";
// (async () => {
//     const result = await detail(1023983);
//     logger.info("详情结果:", result);
// })();

// // 内容
// import { Introduction } from "@/modules/Introduction";
// (async () => {
//     const result = await Introduction(1023983);
//     logger.info("内容结果:", result);
// })();

// // 图片
// import { fetchAndProcessPhoto } from "../src/modules/photo";

// (async () => {
//     const result = await fetchAndProcessPhoto({
//         id: 1023983,
//         page: "00001"
//     });
//     logger.info("结果:", result);
// })();