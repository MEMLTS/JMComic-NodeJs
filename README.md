# JMComic-NodeJs

NodeJS API for JMComic | 提供NodeJS API访问禁漫天堂

## 目录

- [安装](#安装)
- [使用方法](#使用方法)
- [功能模块](#功能模块)
  - [搜索漫画](#搜索漫画)
  - [获取漫画详情](#获取漫画详情)
  - [获取漫画内容](#获取漫画内容)
  - [获取漫画图片](#获取漫画图片)
- [示例代码](#示例代码)
- [注意事项](#注意事项)

---

## 安装

使用 npm 安装：

```bash
npm install jmcomic-nodejs
```

## 使用方法

在项目中引入后，即可调用相关功能模块。

## 功能模块

### 搜索漫画

提供关键词搜索功能，返回与关键词相关的漫画列表。

```javascript
import { search } from "jmcomic-nodejs";

(async () => {
    const result = await search("基尼奇");
    console.log("搜索结果:", result);
})();
```
参数：
- query: string - 搜索关键词。
返回值：
- 漫画列表

### 获取漫画详情

通过漫画 ID 获取详细信息，包括标题、封面、页数等。

```javascript
import { detail } from "jmcomic-nodejs";

(async () => {
    const result = await detail(1023983);
    console.log("详情结果:", result);
})();
```

参数：
- id: number | string - 漫画唯一标识符。
返回值：
- 漫画详细信息对象。

### 获取漫画内容

通过漫画 ID 获取漫画的内容介绍或其他相关信息。

```javascript
import { Introduction } from "jmcomic-nodejs";

(async () => {
    const result = await Introduction(1023983);
    console.log("内容结果:", result);
})();
```
参数：
- id: number | string - 漫画唯一标识符。
返回值：
- 漫画中的图片链接（未解密）

### 获取漫画图片

通过漫画 ID 和页码获取指定页面的图片链接或处理后的图片数据。
```javascript
import { fetchAndProcessPhoto } from "jmcomic-nodejs";

(async () => {
    const result = await fetchAndProcessPhoto({
        id: 1023983,
        page: "00001"
    });
    console.log("结果:", result);
})();
```
参数：
- id: number | string - 漫画唯一标识符。
- page: string - 漫画页码(如 "00001")

返回值：
- 处理后的图片数据。

## 示例代码
以下是一个完整的示例代码，展示如何使用本库的功能模块：

```javascript
import { search, detail, Introduction, fetchAndProcessPhoto } from "jmcomic-nodejs";

(async () => {
    // 搜索漫画
    const searchResult = await search("基尼奇");
    console.log("搜索结果:", searchResult);

    // 获取漫画详情
    const detailResult = await detail(1023983);
    console.log("详情结果:", detailResult);

    // 获取漫画内容
    const introductionResult = await Introduction(1023983);
    console.log("内容结果:", introductionResult);

    // 获取漫画图片
    const photoResult = await fetchAndProcessPhoto({
        id: 1023983,
        page: "00001"
    });
    console.log("图片结果:", photoResult);
})();
```

## 注意事项
- 合法性声明：本库仅用于学习和研究目的，请确保遵守相关法律法规及网站使用条款。
- 依赖环境：需要 Node.js 环境支持，建议使用 LTS 版本。
- 错误处理：在欢迎issue/pr。