import sharp from "sharp";

interface ImageProcessorConfig {
  input: Buffer | string | ArrayBuffer; // 输入可以是Buffer或Base64编码
  slices: number;         // 切割片数
  parentWidth?: number;    // 父容器宽度
  quality?: number;       // 输出质量 (1-100)
  outputFormatBase64?: boolean; // 是否返回Base64编码（false则返回Buffer数据流）
}

/**
 * 图片处理
 * @param {ImageProcessorConfig} config - 配置参数
 * @returns {Promise<Buffer | string>} - 返回处理后的数据流（默认是Buffer，若outputFormatBase64为true，则返回Base64）
 */
export async function imageProcessor(config: ImageProcessorConfig): Promise<Buffer | string> {
  try {
    // 如果传入的是Base64编码字符串，将其解码为Buffer
    const inputBuffer = typeof config.input === "string" ? Buffer.from(config.input, 'base64') : config.input;
    const image = sharp(inputBuffer);
    const metadata = await image.metadata();

    const parentWidth = !config.parentWidth ? metadata.height! : config.parentWidth;

    const processParams = {
      naturalWidth: metadata.width!,
      naturalHeight: metadata.height!,
      displayWidth: Math.min(metadata.width!, parentWidth),
      slices: config.slices,
      quality: config.quality ?? 100, // 默认质量100
    };

    const outputBuffer = await processImage({
      image,
      ...processParams,
    });

    // 如果需要返回Base64编码，转换为Base64字符串并返回
    if (config.outputFormatBase64) {
      return outputBuffer.toString("base64");
    }

    // 默认返回Buffer数据流
    return outputBuffer;
  } catch (err) {
    //logger.error("❌ 处理失败:", err);
    throw new Error(`图片处理失败: ${err}`);
  }
}

/** 核心处理逻辑 */
async function processImage(params: { image: sharp.Sharp } & { naturalWidth: number; naturalHeight: number; displayWidth: number; slices: number; quality: number }): Promise<Buffer> {
  const { image, naturalWidth, naturalHeight, displayWidth, slices, quality } = params;

  const sliceBaseHeight = Math.floor(naturalHeight / slices);
  const remainder = naturalHeight % slices;

  // 生成切片描述数组
  const slicesData = Array.from({ length: slices }, (_, i) => {
    const isLastSlice = i === slices - 1;
    return {
      height: sliceBaseHeight + (isLastSlice ? remainder : 0),
      index: i,
    };
  });

  // 生成合成队列
  const composites: { input: Buffer; top: number; left: number }[] = [];
  let currentY = 0;

  for (const slice of slicesData) {
    const input = await image
      .clone()
      .extract({
        left: 0,
        top: currentY,
        width: naturalWidth,
        height: slice.height,
      })
      .toBuffer();

    composites.unshift({
      input,
      top: naturalHeight - currentY - slice.height, // 从底部开始计算位置
      left: 0,
    });

    currentY += slice.height;
  }

  // 合成处理并输出Buffer
  const outputBuffer = await sharp({
    create: {
      width: naturalWidth,
      height: naturalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .resize({
      width: Math.round(displayWidth),
      fit: "inside",
      position: "top",
    })
    .webp({ quality })
    .toBuffer();

  return outputBuffer;
}