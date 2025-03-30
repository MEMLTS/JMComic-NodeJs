import puppeteer from "puppeteer-extra";
import { Browser, Page } from "puppeteer";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

export interface PageContent {
  html: string;
  cookies: string;
  viewport: { width: number; height: number };
}

class BrowserCommander {
  private static instance: BrowserCommander;
  private browser: Browser | null = null;
  private activePages = 0;
  private readonly MAX_TABS = 20;

  private constructor() {
    // 隐身模式初始化
    puppeteer.use(StealthPlugin());
  }

  // 单例访问器
  public static getInstance(): BrowserCommander {
    if (!BrowserCommander.instance) {
      BrowserCommander.instance = new BrowserCommander();
    }
    return BrowserCommander.instance;
  }

  // 🚀 启动浏览器
  public async initBrowser(): Promise<void> {
    if (this.browser) return;

    this.browser = await puppeteer.launch({
      headless: true,
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox"],
    });

    console.log("🦾 浏览器装甲已启动");

    // 断连自动重启
    this.browser.on("disconnected", async () => {
      console.log("⚠️ 浏览器连接中断，执行复活协议...");
      await this.restart();
    });
  }

  // 🌐 导航获取原始数据
  public async navigateToUrl(url: string): Promise<PageContent> {
    if (!this.browser) throw new Error("浏览器未初始化！先执行initBrowser()");

    if (this.activePages >= this.MAX_TABS) {
      console.log("💥 触发标签页熔断机制");
      await this.restart();
    }

    const page = await this.createPage();
    try {
      console.log(`🎯 导航至：${url}`);
      await page.goto(url, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      return {
        html: await page.content(),
        cookies: await page.cookies().then((c) => JSON.stringify(c)),
        viewport: page.viewport() || { width: 1920, height: 1080 },
      };
    } finally {
      await page.close();
      this.activePages--;
    }
  }

  // 🛠️ 创建新页面
  private async createPage(): Promise<Page> {
    if (!this.browser) throw new Error("浏览器未初始化");

    const page = await this.browser.newPage();
    this.activePages++;

    // 🕵️ 伪装人类指纹
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    );
    await page.setViewport({ width: 1920, height: 1080 });

    return page;
  }

  // 🔄 重启浏览器
  private async restart(): Promise<void> {
    if (!this.browser) return;

    console.log("🔄 执行浏览器重启协议...");
    await this.browser.close();
    this.browser = null;
    this.activePages = 0;
    await this.initBrowser();
  }
}

export const browserCommander = BrowserCommander.getInstance();
