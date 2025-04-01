import * as cheerio from "cheerio";
import { chaosRequest } from "@/utils/request";

export async function detail(id: string | number): Promise<AlbumData | null> {
    const url = `https://18comic-mhws.cc/album/${id}`;
    //logger.info(`🔍 正在查看漫画ID ${id} 简介`);

    try {
        const response = await chaosRequest({ url });
        if (response.body) {
            const html = response.body.toString();
            return parseDetailResults(html);
        } else {
            logger.error('请求返回的body为空');
            return null;
        }
    } catch (error) {
        //logger.error('请求失败:', error);
        throw new Error('请求失败', { cause: error });
        return null;
    }
}

interface AlbumData {
    albumId: number;
    title: string;
    coverImage: string;
    pages: number;
    jmNumber: string;
    likes: string;
    description: string;
    uploadDate: string;
    updateDate: string;
    uploader: string;
    works: string[];
    characters: string[];
    tags: string[];
    authors: string[];
    videoUrl?: string;
}

function parseDetailResults(html: string): AlbumData {
    const $ = cheerio.load(html);

    const albumId = Number($('#album_id').attr('value')) || 0;
    const title = $('.book-name').text().trim();

    const coverImage = `https://cdn-msp2.18comic.vip/media/albums/${albumId}.jpg`;

    const pages = Number($('.pagecount').text().match(/页数[:：]\s*(\d+)/)?.[1] || 0);
    const jmFullNumber = $('.train-number').text().match(/JM(\d+)/)?.[1] || '';
    const jmNumber = `JM${jmFullNumber}`;
    const likes = $('#albim_likes_' + $('[id^="albim_likes_"]').attr('id')?.split('_').pop())
        .text().trim().replace(/\D+$/, '');
    const unique = (arr: string[]) => [...new Set(arr)];
    const tagExtractor = (type: string) =>
        unique(
            $(`[data-type="${type}"] a`)
                .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
                .get()
        );
    const description = $('div:contains("叙述：")')
        .next('div.content')
        .text().trim().replace(/\s+/g, ' ');

    const uploaderText = $('div:contains("上传者：")').text().trim();
    const uploader = uploaderText.split('上传者：').pop()?.split(/\s/)[0] || '';
    const dates = $('.col-xs-12 p.p-t-5')
        .map((i, el) => $(el).text().replace(/(上架日期|更新日期) : /g, '').trim())
        .get();
    const videoSource = $('source[type="video/mp4"]').attr('src');

    return {
        albumId,
        title,
        coverImage,
        pages,
        jmNumber,
        likes,
        description,
        uploader,
        uploadDate: dates[0] || '',
        updateDate: dates[1] || '',
        works: tagExtractor('works'),
        characters: tagExtractor('actor'),
        tags: tagExtractor('tags'),
        authors: tagExtractor('author'),
        videoUrl: videoSource ? `https://18comic.vip${videoSource}` : undefined
    };
}