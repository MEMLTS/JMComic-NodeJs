import https, { Agent, RequestOptions } from 'https';
import { URL } from 'url';
import http, { IncomingHttpHeaders } from 'http';

export type ChaosRequestParams = {
  url: string;
  cookie?: string;
  data?: Record<string, unknown> | string;
  method?: 'GET' | 'POST' | 'PUT';
  headers?: Record<string, string>;
  timeout?: number;
  retry?: number;
};

// 🌌 更新混沌TLS引擎（伪装现代浏览器指纹）
const createChaosAgent = (): Agent => new Agent({
  ciphers: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-ECDSA-AES128-GCM-SHA256'
  ].join(':'),
  minVersion: 'TLSv1.3',
  maxVersion: 'TLSv1.3',
  ecdhCurve: 'X25519:prime256v1:secp384r1',
  honorCipherOrder: true,
  sessionIdContext: 'ChaosEngine'
});

const CHAOS_AGENT = createChaosAgent();

// 修改返回类型以适配Node.js标准
export async function chaosRequest(params: ChaosRequestParams): Promise<{
  ok: boolean;
  statusCode: number;
  headers: IncomingHttpHeaders;
  body: Buffer;
  retries: number;
}> {
  const {
    url,
    cookie = '',
    data = {},
    method = 'GET',
    headers = {},
    timeout = 15000,
    retry = 3
  } = params;

  const parsedUrl = new URL(url);
  let retryCount = 0;

  const makeRequest = async (): Promise<ReturnType<typeof chaosRequest>> => {
    const requestOptions: RequestOptions = {
      agent: CHAOS_AGENT,
      hostname: parsedUrl.hostname,
      path: `${parsedUrl.pathname}${parsedUrl.search}`,
      method,
      headers: {
        'User-Agent': getRandomUserAgent(), // 用户代理池
        'Accept-Language': 'en-US,en;q=0.9',
        'Cookie': cookie,
        'Accept-Encoding': 'gzip, deflate, br',
        ...headers
      },
      rejectUnauthorized: false, // 🛡️ 根据需求调整
      servername: parsedUrl.hostname // SNI扩展
    };

    // 📦 增强数据处理
    let postData: Buffer | null = null;
    if (['POST', 'PUT'].includes(method)) {
      postData = typeof data === 'string'
        ? Buffer.from(data)
        : Buffer.from(JSON.stringify(data));

      requestOptions.headers!['Content-Type'] = headers['Content-Type']
        || 'application/json';
      requestOptions.headers!['Content-Length'] = postData.length.toString();
    }

    return new Promise((resolve, reject) => {
      const req = https.request(requestOptions, (res) => {
        let chunks: Buffer[] = [];
        let length = 0;

        res.on('data', (chunk) => {
          chunks.push(chunk);
          length += chunk.length;
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks, length);
          const ok = res.statusCode! >= 200 && res.statusCode! < 300;

          // 🛡️ 增强防护检测
          const isBlocked = detectSecurityBlock(res, body);
          if (isBlocked) {
            return reject(handleSecurityError(res, body));
          }

          resolve({
            ok,
            statusCode: res.statusCode!,
            headers: res.headers,
            body,
            retries: retryCount
          });
        });
      });

      // ⏱️ 超时处理
      req.setTimeout(timeout, () => {
        req.destroy();
        reject(new Error(`请求超时 (${timeout}ms)`));
      });

      req.on('error', (err) => {
        logger.error('请求异常', {
          error: err.stack,
          url,
          attempt: retryCount + 1
        });
        reject(err);
      });

      postData && req.write(postData);
      req.end();
    });
  };

  while (retryCount < retry) {
    try {
      return await makeRequest();
    } catch (err) {
      retryCount++;
      if (retryCount >= retry) {
        throw new Error(`请求失败（重试 ${retry} 次）: ${err}`);
      }
      await new Promise(r => setTimeout(r, 1000 * retryCount));
    }
  }
  throw new Error('无法完成请求');
}

// 随机用户代理生成器
function getRandomUserAgent(): string {
  const agents = [
    // 最新Chrome用户代理列表
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
  ];
  return agents[Math.floor(Math.random() * agents.length)];
}

// 🛡️ 安全防护检测
function detectSecurityBlock(
  res: http.IncomingMessage,
  body: Buffer
): boolean {
  const headers = res.headers;
  const bodyStr = body.toString('utf8').substring(0, 1000);

  return (
    res.statusCode === 503 ||
    headers['server']?.includes('cloudflare') ||
    /cdn-cgi|cloudflare|challenge|security/.test(bodyStr)
  );
}

// 🚨 安全错误处理
function handleSecurityError(
  res: http.IncomingMessage,
  body: Buffer
): Error {
  const headers = res.headers;
  const cfRay = headers['cf-ray'] || '';
  const info = {
    status: res.statusCode,
    cfRay,
    server: headers['server'],
    bodySnippet: body.toString('utf8', 0, 500)
  };

  return new Error(
    `触发安全防护（CF-RAY: ${cfRay}）\n` +
    `建议措施：\n` +
    `1. 更新TLS指纹\n` +
    `2. 更换出口IP\n` +
    `3. 验证请求头参数\n` +
    `调试信息：${JSON.stringify(info, null, 2)}`
  );
}
