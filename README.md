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

```
import JMComic from "jmcomic-nodejs"

(async () => {
    const result = await JMComic.search(1023983)
    console.log(result);
})();
```

### 获取漫画详情

获取漫画详情信息，包括封面、标题、作者、简介等。
```
import JMComic from "jmcomic-nodejs"

(async () => {
    const result = await JMComic.Introduction(1023983)
    console.log(result)
})();
```

### 获取漫画内容

获取漫画内容
```
import JMComic from "jmcomic-nodejs"

(async () => {
    const result = await JMComic.Introduction(1023983)
    console.log(result);
})();
```

### 获取漫画图片

获取漫画图片
```
import JMComic from "jmcomic-nodejs"

(async () => {
    const result = await JMComic.fetchAndProcessPhoto(1023983)
    console.log(result);
})();
```

## 示例代码
```
import JMComic from "jmcomic-nodejs"; // 修改导入方式

(async () => {
    // 搜索漫画
    const searchResult = await JMComic.search("基尼奇")
    console.log("搜索结果:", searchResult);

    // 获取漫画详情
    const detailResult = await JMComic.detail(1023983)
    console.log("详情结果:", detailResult);

    // 获取漫画内容
    const introductionResult = await JMComic.Introduction(1023983)
    console.log("内容结果:", introductionResult);

    // 获取漫画图片
    const photoResult = await JMComic.fetchAndProcessPhoto({
        id: 1023983,
        page: "00001"
    });
    console.log("图片结果:", photoResult);
})();
```

## 注意事项

仅供学习参考，请勿用于非法用途。