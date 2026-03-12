// 简单的Node.js后端服务器，用于转发火山方舟API请求
// 这样可以避免前端直接调用API时的CORS问题

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

// API配置（这里配置API密钥，前端代码中不需要包含密钥）
const API_CONFIG = {
    apiKey: 'c7f28817-ffed-4e07-bda7-e787a14340ca',  // 请在这里填入您的API密钥
    model: 'ep-20260311201631-ddm95',   // 请在这里填入您的模型ID（不是URL）
    baseUrl: 'ark.cn-beijing.volces.com'
};

// MIME类型映射
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer(async (req, res) => {
    // 设置CORS头，允许前端访问
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

    // API代理端点
    if (pathname === '/api/chat') {
        if (req.method !== 'POST') {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
        }

        try {
            // 读取请求体
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', async () => {
                try {
                    const requestData = JSON.parse(body);

                    // 构建火山方舟API请求
                    const apiRequestData = JSON.stringify({
                        model: API_CONFIG.model,
                        messages: requestData.messages || [],
                        temperature: requestData.temperature || 0.7,
                        max_tokens: requestData.max_tokens || 800
                    });

                    console.log('转发请求到火山方舟API...');

                    // 发送请求到火山方舟API
                    const apiResponse = await new Promise((resolve, reject) => {
                        const apiReq = https.request({
                            hostname: API_CONFIG.baseUrl,
                            path: '/api/v3/chat/completions',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${API_CONFIG.apiKey}`,
                                'Content-Length': Buffer.byteLength(apiRequestData)
                            }
                        }, (apiRes) => {
                            let data = '';
                            apiRes.on('data', chunk => {
                                data += chunk;
                            });
                            apiRes.on('end', () => {
                                resolve({
                                    statusCode: apiRes.statusCode,
                                    data: data
                                });
                            });
                        });

                        apiReq.on('error', (error) => {
                            reject(error);
                        });

                        apiReq.write(apiRequestData);
                        apiReq.end();
                    });

                    // 记录API响应
                    console.log('API响应状态:', apiResponse.statusCode);
                    if (apiResponse.statusCode === 429) {
                        console.warn('429错误: API请求过于频繁');
                        console.warn('错误详情:', apiResponse.data);
                    }

                    // 返回API响应
                    res.writeHead(apiResponse.statusCode, {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    });
                    res.end(apiResponse.data);

                } catch (error) {
                    console.error('API请求处理错误:', error);
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        error: 'Internal server error',
                        message: error.message
                    }));
                }
            });

        } catch (error) {
            console.error('请求处理错误:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Internal server error',
                message: error.message
            }));
        }
        return;
    }

    // 测试端点
    if (pathname === '/api/test') {
        console.log('收到测试请求');

        // 测试API配置
        const testResponse = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            config: {
                apiKey: API_CONFIG.apiKey ? '配置成功' : '未配置',
                model: API_CONFIG.model ? '配置成功' : '未配置',
                baseUrl: API_CONFIG.baseUrl
            },
            message: '服务器运行正常，API配置已检查'
        };

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify(testResponse));
        return;
    }

    // 静态文件服务
    let filePath = pathname === '/' ? '/tarot-game.html' : pathname;
    filePath = path.join(__dirname, filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // 文件不存在
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                // 服务器错误
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            // 成功返回文件
            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log('=================================');
    console.log('塔罗牌游戏服务器已启动！');
    console.log('=================================');
    console.log(`访问地址: http://localhost:${PORT}`);
    console.log('');
    console.log('使用说明:');
    console.log('1. 确保已配置API密钥和模型ID');
    console.log('2. 在浏览器中打开上述地址');
    console.log('3. 开始体验AI塔罗牌解读！');
    console.log('=================================');
    console.log('');

    // 检查API配置
    if (API_CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ 警告: API密钥未配置！');
        console.warn('请在server.js文件中设置您的API密钥。');
    } else {
        console.log('✓ API密钥已配置');
    }

    if (API_CONFIG.model === 'YOUR_MODEL_ID_HERE') {
        console.warn('⚠️ 警告: 模型ID未配置！');
        console.warn('请在server.js文件中设置您的模型ID。');
    } else {
        console.log('✓ 模型ID已配置');
    }
});