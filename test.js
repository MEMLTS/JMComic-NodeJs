import axios from 'axios';
import * as cheerio from 'cheerio';

const TARGET_URL = 'https://18comic.vip/search/photos?search_query=%E8%A7%A6%E7%94%B5';

const COMMON_HEADERS = {
  Authority: '18comic.vip',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Accept-Language': 'zh-CN,zh;q=0.9',
  'Cache-Control': 'no-cache',
  Cookie: 'ipcountry=SG; theme=light; AVS=pfg1spscpfcpe21o9m7fgnqgak; __cflb=02DiuDFSTg91mAHCXokVePBgH1pMSYFvSqfCDRQesJFFz; ipm5=0a2ec1a7b080f92394c0c9c4047fcb73; cover=1; login_reminder=1; shuntflag=1; rec_author=%E6%9D%BF%E5%A0%B4%E5%BA%83%E5%BF%97; cf_clearance=4JrPkbWBQ03Lt6OA8cclBrraqN.iaN0G92A66Vu_MQ4-1743233638-1.2.1.1-hAAjclN5SLYtB8nH1iZbYxUZYJC9ft8x8ATyIAhlB47h9diAoDCZ5g0fd.2EUJV9VXwGs5_9MvlB4rvO1bAvvWcDfa3axQIRGplHyqYivUZm39a9gKhGaM84V4OMxU0RMT8Wq.lv_WnDzl5n7.jRlpPaVPk6wMzg7WH83AM8Bea7JJni.kkgPUrFKpjBPhovoALz17Pi7TcbdSpNU9iYW7FnwO5j00VEpUNW.vcMoZpJvFWKQvMkrGxuzhcpIBM6TSetQN329O4SBTdAGQxZBHQaRwkWLH21O7lMawOXa5zTLkGjOB0NCNcuOMMAXQrrhxMMTrKe5UkOOVDCz1VZEybSJ4ZdqAuvmmItLp_cxno',
  Priority: 'u=0, i',
  Referer: 'https://18comic.vip/',
  'Sec-Ch-Ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"Linux"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
};

async function fetchComicData() {
  try {
    const response = await axios.get(TARGET_URL, {
      headers: COMMON_HEADERS,
      decompress: true
    });

    const $ = cheerio.load(response.data);
    const comics = [];

    $('div.well.p-b-15.p-l-5.p-r-5').each((index, element) => {
      const comic = {
        title: $(element).find('.video-title.title-truncate').text().trim(),
        link: $(element).find('a').attr('href'),
        imgSrc: $(element).find('img').attr('data-original'),
        likes: $(element).find('.label-loveicon span').text().trim(),
        timestamp: $(element).find('.timeago').attr('title')
      };
      comics.push(comic);
    });

    console.log('🎉 成功抓取漫画数据：', comics);
    return comics;
  } catch (error) {
    console.error('❌ 抓取失败：', error.response?.status || error.message);
    throw new Error(`请求失败：${error.message}`);
  }
}

fetchComicData()
  .then(() => console.log('✅ 任务完成'))
  .catch(() => console.log('⛔ 任务异常'));
