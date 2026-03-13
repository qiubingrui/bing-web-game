// 简单的Node.js后端服务器，用于转发火山方舟API请求
// 这样可以避免前端直接调用API时的CORS问题

const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

// API配置（这里配置API密钥，前端代码中不需要包含密钥）
const API_CONFIG = {
    apiKey: 'c7f28817-ffed-4e07-bda7-e787a14340ca',
    model: 'ep-20260311201631-ddm95',
    baseUrl: 'ark.cn-beijing.volces.com'
};

const app = express();

// 配置CORS
const corsOptions = {
    origin: 'https://qiubingrui.github.io',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// 测试端点
app.get('/api/test', (req, res) => {
    console.log('收到测试请求');
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
    res.json(testResponse);
});

// API代理端点
app.post('/api/chat', async (req, res) => {
    try {
        const requestData = req.body;
        const apiRequestData = JSON.stringify({
            model: API_CONFIG.model,
            messages: requestData.messages || [],
            temperature: requestData.temperature || 0.7,
            max_tokens: requestData.max_tokens || 800
        });
        console.log('转发请求到火山方舟API...');
        const apiResponse = await new Promise((resolve, reject) => {
            const apiReq = https.request({
                hostname: API_CONFIG.baseUrl,
                path: '/api/v3/chat/completions',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + API_CONFIG.apiKey,
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
        console.log('API响应状态:', apiResponse.statusCode);
        if (apiResponse.statusCode === 429) {
            console.warn('429错误: API请求过于频繁');
            console.warn('错误详情:', apiResponse.data);
        }
        res.status(apiResponse.statusCode).json(JSON.parse(apiResponse.data));
    } catch (error) {
        console.error('API请求处理错误:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
});

// 塔罗牌接口
app.get('/api/tarot', (req, res) => {
    res.json({ card: '愚者' });
});

// 静态文件服务
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('=================================');
    console.log('塔罗牌游戏服务器已启动！');
    console.log('=================================');
    console.log('访问地址: http://localhost:' + PORT);
    console.log('');
    console.log('使用说明:');
    console.log('1. 确保已配置API密钥和模型ID');
    console.log('2. 在浏览器中打开上述地址');
    console.log('3. 开始体验AI塔罗牌解读！');
    console.log('=================================');
    console.log('');
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