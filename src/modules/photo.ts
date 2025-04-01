import { imageProcessor } from "@/utils/sharp";
import { getNum } from "@/utils/sign";
import { Buffer } from "buffer";
import fetch from "node-fetch";

interface PhotoFetchAndProcessParams {
    id: number;
    page: number | string;
}

/**
 * 获取并处理图片
 * @param {PhotoFetchAndProcessParams} params - 包含漫画ID和图片ID的参数
 * @returns {Promise<Buffer | string>} - 返回处理后的图片数据（Buffer或Base64字符串）
 */
export async function fetchAndProcessPhoto(
    params: PhotoFetchAndProcessParams
): Promise<Buffer | string> {
    const { id, page } = params;
    const url = `https://deno-53-72-yka0q4ctjhmv.deno.dev/https://cdn-msp3.18comic.vip/media/photos/${id}/${page}.webp`;
    //logger.info(`🔍 正在获取并处理漫画ID ${id} 图片ID ${page}`);

    try {
        const slices = getNum(id, page);
        const response = await fetch(url);

        const arrayBuffer = await response.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuffer);

        const processedImage = await imageProcessor({
            input: inputBuffer,
            slices
        });

        return processedImage;
    } catch (error) {
        //logger.error(`处理失败 [ID:${id}/P:${page}]`, error);
        throw new Error(`图片处理失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
}