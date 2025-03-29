目录结构说明
1. src/ 目录
    core/：核心逻辑模块，包括下载器、解析器和工具函数。
        downloader.ts：负责漫画下载的核心逻辑。
        parser.ts：负责解析 JMComic 页面，提取漫画和章节信息。
        utils.ts：通用工具函数，如 URL 处理、文件操作等。
    models/：数据模型，定义漫画和章节的数据结构。
        comic.ts：漫画数据模型。
        chapter.ts：章节数据模型。
    services/：服务层，负责与外部系统的交互。
        api.ts：封装 JMComic 的 API 请求。
        storage.ts：负责本地存储，如保存下载的漫画文件。
    cli/：命令行工具模块。
        index.ts：CLI 入口，解析命令行参数并执行命令。
        commands/：具体命令的实现，如下载、搜索等。
        config/：配置文件模块。
        default.ts：默认配置值。
        config.ts：配置加载逻辑，支持从环境变量或配置文件读取配置。
    types/：类型定义模块。
        index.d.ts：全局类型定义。
        jmcomic.d.ts：JMComic 相关的类型定义。
        index.ts：项目入口文件，初始化并启动项目。
2.  tests/ 目录
        unit/：单元测试，测试核心模块的功能。
        downloader.test.ts：测试下载器逻辑。
        parser.test.ts：测试解析器逻辑。
    integration/：集成测试，测试模块之间的交互。
        api.test.ts：测试 API 请求服务。
        cli.test.ts：测试命令行工具。
3. dist/ 目录
    编译后的 JavaScript 文件输出目录。
4. scripts/ 目录
    build.ts：构建脚本，用于编译 TypeScript 代码。
    start.ts：启动脚本，用于运行项目。
5. 配置文件
    .eslintrc.js：ESLint 配置文件，定义代码规范。
    .eslint.config.mjs：Prettier 配置文件，定义代码格式化规则。
    tsconfig.json：TypeScript 配置文件，定义编译选项。
6. 项目文档
    README.md：项目说明文档，包括安装、使用和贡献指南。