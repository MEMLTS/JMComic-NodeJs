import https, { Agent, RequestOptions } from 'https';
import { URL } from 'url';

export type ChaosRequestParams = {
  url: string;
  cookie?: string;
  data?: Record<string, unknown>;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
};

// 🌌 混沌TLS引擎
const createChaosAgent = (): Agent => new Agent({
  ciphers: [
    'TLS_AES_128_GCM_SHA256',
    'TLS_CHACHA20_POLY1305_SHA256',
    'ECDHE-ECDSA-AES128-GCM-SHA256'
  ].join(':'),
  minVersion: 'TLSv1.3',
  maxVersion: 'TLSv1.3',
  ecdhCurve: 'X25519',
  honorCipherOrder: true
});

const CHAOS_AGENT = createChaosAgent();

export async function chaosRequest(params: ChaosRequestParams): Promise<string> {
  const { url, cookie = '', data = {}, method = 'GET', headers = {} } = params;
  const parsedUrl = new URL(url);

  const requestOptions: RequestOptions = {
    agent: CHAOS_AGENT,
    hostname: parsedUrl.hostname,
    path: `${parsedUrl.pathname}${parsedUrl.search}`,
    method,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': cookie,
      ...headers
    },
    rejectUnauthorized: false // 🛡️ 禁用SSL验证
  };

  // 📦 POST数据处理
  let postData: string | null = null;
  if (method === 'POST') {
    postData = JSON.stringify(data);
    requestOptions.headers!['Content-Type'] = 'application/json';
    requestOptions.headers!['Content-Length'] = Buffer.byteLength(postData).toString();
  }

  return new Promise((resolve, reject) => {
    const req = https.request(requestOptions, (res) => {
      let responseBody = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode === 503 && /cloudflare/i.test(responseBody)) {
          reject('🚨 触发Cloudflare防护！建议：1.更新TLS指纹 2.更换IP');
        } else {
          resolve(responseBody);
        }
      });
    });

    req.on('error', (err) => {
      console.error('🔥 詳細錯誤分析:', {
        stack: err.stack
      });
      reject(`🌪️ 請求異常: ${err.message}`);
    })
    postData && req.write(postData);
    req.end();
  });
}