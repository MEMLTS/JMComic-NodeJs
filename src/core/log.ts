type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "critical"
  | "success"
  | "http";

// 🌌 消息类型
type LogMessage = unknown[];

// 🌈 赛博朋克色系 ANSI 代码
const ANSI_COLORS = {
  reset: "\x1b[0m",
  debug: "\x1b[38;5;135m", // 量子紫
  info: "\x1b[38;5;45m", // 数据蓝
  warn: "\x1b[38;5;227m", // 警告黄
  error: "\x1b[38;5;196m", // 错误红
  critical: "\x1b[48;5;196m\x1b[37m", // 危机红底白字
  success: "\x1b[38;5;46m", // 成功绿
  http: "\x1b[38;5;51m", // 网络青
};

interface LoggerConfig {
  level?: LogLevel;
  colorize?: boolean;
}

class QuantumLogger {
  private config = {
    level: "debug" as LogLevel,
    colorize: true,
  };

  // ⚙️ 时间
  private getCSTTime() {
    const now = new Date(Date.now() + 8 * 3600 * 1000);
    return now.toISOString().substring(0, 19).replace("T", " ");
  }

  // 🔍 日志等级
  private shouldLog(level: LogLevel) {
    const levelOrder: LogLevel[] = [
      "debug",
      "info",
      "warn",
      "error",
      "critical",
      "success",
      "http",
    ];
    return levelOrder.indexOf(level) >= levelOrder.indexOf(this.config.level);
  }

  // 🎭 格式化工厂
  private format(level: LogLevel, messageParts: LogMessage) {
    const { colorize } = this.config;
    const color = colorize ? ANSI_COLORS[level] : "";
    const timeTag = `[${this.getCSTTime()}]`;
    const levelTag = `[${level.toUpperCase()}]`;

    // 🪄 魔法字符串解析
    const [firstArg, ...restArgs] = messageParts;
    const baseMessage = typeof firstArg === "string" ? firstArg : "%o";

    return {
      coloredPrefix: `${timeTag} ${color}${levelTag}${
        colorize ? ANSI_COLORS.reset : ""
      }`,
      message: [baseMessage, ...restArgs],
    };
  }

  // 💣 宇宙级日志发射器
  private emit(level: LogLevel, symbol: string, messageParts: LogMessage) {
    if (!this.shouldLog(level)) return;

    const { coloredPrefix, message } = this.format(level, messageParts);
    const consoleMethod = {
      debug: console.debug,
      info: console.info,
      warn: console.warn,
      error: console.error,
      critical: console.error,
      success: console.log,
      http: console.log,
    }[level];

    consoleMethod(
      `${coloredPrefix} [JM] ${symbol}`,
      ...message,
      this.config.colorize ? "" : ANSI_COLORS.reset
    );
  }

  // 🌌 公开接口
  debug = (...args: LogMessage) => this.emit("debug", "🌀", args);
  info = (...args: LogMessage) => this.emit("info", "", args);
  warn = (...args: LogMessage) => this.emit("warn", "⚠️", args);
  error = (...args: LogMessage) => this.emit("error", "💥", args);
  critical = (...args: LogMessage) => this.emit("critical", "🚨", args);
  success = (...args: LogMessage) => this.emit("success", "✅", args);
  http = (...args: LogMessage) => this.emit("http", "🌐", args);

  // 🔧 配置引擎
  setup(config: LoggerConfig) {
    Object.assign(this.config, config);
  }
}

// 🌐 量子纠缠态全局实例
const logger = new QuantumLogger();

// 🚀 启动装置
export function setupLogger(config: LoggerConfig= { level: 'debug', colorize: true }): void {
  logger.setup(config);
}

// 🌍 次元突破声明
declare global {
  var logger: QuantumLogger;
}

globalThis.logger = logger;
