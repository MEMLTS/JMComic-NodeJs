// 日志
import { setupLogger } from "./core/log";

// 初始化日志
setupLogger();


// // 搜索
// import { search } from "./modules/search";
// (async () => {
//     const result = await search("基尼奇");
//     logger.info("搜索结果:", result);
// })();

// // 详情
// import { detail } from "./modules/detail";
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

// // 图片处理
// import fetch from "node-fetch";
// import { promises as fs } from "fs";
// import { imageProcessor } from "./utils/sharp"; // 假设你的 imageProcessor 函数在这个路径

// // 配置：获取图像和切片处理的参数
// const imageUrl = "https://cdn-msp3.18comic.vip/media/photos/1023983/00001.webp"; // 图片 URL
// const slices = 14; // 分片数
// const outputFilePath = "./out.webp"; // 输出文件路径

// async function fetchAndProcessImage(url: string, slices: number, outputPath: string) {
//   try {
//     // 1. 请求远程图像数据
//     const response = await fetch(url);
//     if (!response.ok) throw new Error("Failed to fetch image");

//     const inputBuffer = await response.buffer();

//     // 2. 使用 imageProcessor 处理图像（分片处理）
//     const outputBuffer = await imageProcessor({
//       input: inputBuffer, // 传入Buffer数据流
//       slices: slices,     // 分片数
//       parentWidth: 1280,  // 父容器宽度为1280px
//       quality: 100,        // 输出质量
//     });

//     // 3. 将处理后的图像保存为文件
//     await fs.writeFile(outputPath, outputBuffer);

//     logger.info(`处理完成，文件已保存至: ${outputPath}`);
//   } catch (error) {
//     logger.error("处理失败:", error);
//   }
// }

// // 执行任务：从远程请求图像，进行切割处理并保存
// fetchAndProcessImage(imageUrl, slices, outputFilePath);
