import * as cheerio from "cheerio";
import { chaosRequest } from "@/utils/request";

export async function Introduction(id: string | number) {
    const url = `https://18comic-mhws.cc/photo/${id}`;
    //logger.info(`🔍 正在查看漫画ID ${id} 内容`);

    try {
        const response = await chaosRequest({ url });
        if (response) {
            return parseAlbumContent(response);
        } else {
            //logger.error('请求返回的body为空');
            return null;
        }
    } catch (error) {
        //logger.error('请求失败:', error);
        throw new Error('请求失败', { cause: error });
    }
}
interface PageInfo {
    id: string;
    image: string;
}

function parseAlbumContent(html: string): { title: string; pages: PageInfo[] } {
    const $ = cheerio.load(html);

    return {
        title: $('.panel-heading > .pull-left').first().text().trim(),
        pages: $('div.center.scramble-page')
            .map((_, el) => {
                const $page = $(el);
                const $img = $page.find('img[data-original].lazy_img');

                return $img.length > 0 && !$page.is('[style*="opacity:0"]')
                    ? {
                        id: $page.attr('id')?.replace(/[^\w\.]/g, '') || '',
                        image: $img.attr('data-original')?.trim() || ''
                    }
                    : null;
            })
            .get()
            .filter((p): p is PageInfo => !!p?.image)
    };
}

