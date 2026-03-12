// ============================================
// 工具函数
// ============================================

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 节流函数
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 求锁机制
class Lock {
    constructor() {
        this.locks = new Map();
    }

    acquire(key) {
        if (this.locks.has(key)) {
            return false;
        }
        this.locks.set(key, true);
        return true;
    }

    release(key) {
        this.locks.delete(key);
    }

    isLocked(key) {
        return this.locks.has(key);
    }
}

// 全局锁实例
const lock = new Lock();

// ============================================
// API 配置
// ============================================
const API_CONFIG = {
    baseUrl: 'http://localhost:3000',
    endpoint: '/api/chat'
};

// ============================================
// 调用后端API生成解读
// ============================================
async function callVolcanoAPI(prompt, retries = 3, delay = 1000) {
    console.log('正在调用后端API...');
    console.log('API地址:', API_CONFIG.baseUrl + API_CONFIG.endpoint);

    try {
        const response = await fetch(API_CONFIG.baseUrl + API_CONFIG.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'system',
                        content: '你是一位经验丰富的塔罗牌解读师，擅长结合具体问题给出人性化、有洞察力的解读。你的解读应该温暖、具体、有建设性，避免过于抽象或令人困惑的表达。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 800
            })
        });

        console.log('API响应状态:', response.status);

        if (response.status === 429) {
            // 处理429错误（请求过于频繁）
            if (retries > 0) {
                console.warn(`API请求过于频繁，${retries}秒后重试...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return callVolcanoAPI(prompt, retries - 1, delay * 2);
            } else {
                throw new Error('API请求过于频繁，请稍后再试');
            }
        }

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API错误详情:', errorText);
            throw new Error(`API调用失败: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'API返回错误');
        }

        console.log('API调用成功，收到回复');
        console.log('回复内容预览:', data.choices[0].message.content.substring(0, 100) + '...');
        return data.choices[0].message.content;
    } catch (error) {
        console.error('API调用失败:', error);

        if (error.message.includes('429')) {
            alert('API请求过于频繁，请稍后再试\n\n将使用备用解读。');
        } else {
            alert('API调用失败:\n' + error.message + '\n\n将使用备用解读。');
        }
        return null;
    }
}

// ============================================
// 生成单张牌的AI解读
// ============================================
async function generateAICardReading(card, question) {
    console.log('开始生成AI解读...');

    const prompt = `作为塔罗牌解读师，请为以下牌面提供详细的人性化解读：

抽牌者的问题："${question}"
抽到的牌：${card.name}
牌面含义：${card.meaning}

请提供：
1. 针对这个问题的个性化解读（200字左右）
2. 综合总结和建议（150字左右）

要求：
- 解读要具体、温暖、有洞察力
- 结合抽牌者的实际问题给出建议
- 避免过于抽象或令人困惑的表达
- 语气要友好、支持性
- 给出具体的行动建议

格式：
【个性化解读】
（内容）

【综合总结】
（内容）`;

    try {
        const response = await callVolcanoAPI(prompt);

        if (response) {
            console.log('AI解读成功');
            const parts = response.split('【综合总结】');
            if (parts.length >= 2) {
                const personalizedPart = parts[0].replace('【个性化解读】', '').trim();
                const summaryPart = parts[1].trim();
                return {
                    personalized: personalizedPart,
                    summary: summaryPart,
                    source: 'ai'
                };
            }
        }
    } catch (error) {
        console.error('AI解读生成失败:', error);
    }

    // 使用备用解读
    console.log('使用备用解读');
    return {
        personalized: generatePersonalizedReading(card, question),
        summary: generateCardSummary(card, question),
        source: 'backup'
    };
}

// ============================================
// 生成牌阵的AI解读
// ============================================
async function generateAISpreadReading(cards, positions, question) {
    const cardsInfo = cards.map((card, index) => {
        return `${index + 1}. ${getPositionName(positions[index])}: ${card.name}（${card.meaning}）`;
    }).join('\n');

    const prompt = `作为塔罗牌解读师，请为以下牌阵提供详细的人性化解读：

抽牌者的问题："${question}"

牌阵信息：
${cardsInfo}

请为每张牌提供：
1. 该位置的具体解读（100字左右）
2. 针对问题的个性化建议

最后提供：
3. 牌阵的整体综合总结（200字左右）

要求：
- 解读要具体、温暖、有洞察力
- 结合抽牌者的实际问题给出建议
- 避免过于抽象或令人困惑的表达
- 语气要友好、支持性
- 给出具体的行动建议

格式：
【各牌解读】
位置1 - 牌名：解读内容
位置2 - 牌名：解读内容
...

【综合总结】
（内容）`;

    const response = await callVolcanoAPI(prompt);

    if (response) {
        return response;
    }

    return generateSpreadSummary(cards, question);
}

// ============================================
// 生成单张牌的解读（备用）
// ============================================
function generateCardReading(card, question) {
    return {
        personalized: generatePersonalizedReading(card, question),
        summary: generateCardSummary(card, question)
    };
}

// ============================================
// 生成牌阵的解读（备用）
// ============================================
function generateSpreadReading(cards, positions, question) {
    return generateSpreadSummary(cards, question);
}

// 塔罗牌数据
const tarotCards = {
    // 大阿卡那
    majorArcana: [
        {
            name: "愚人",
            meaning: "新的开始，冒险，自由，无忧无虑，自发性",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Fool%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "魔术师",
            meaning: "创造力，技能，意志力，自信，操纵",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Magician%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "女祭司",
            meaning: "直觉，潜意识，神秘，内在知识，平静",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20High%20Priestess%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "皇后",
            meaning: "丰饶，母性，关系，艺术，富足",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Empress%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "皇帝",
            meaning: "权威，结构，控制，领导力，稳定",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Emperor%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "教皇",
            meaning: "传统，信仰，指导，教育，精神导师",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Hierophant%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "恋人",
            meaning: "爱情，关系，选择，和谐， unions",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Lovers%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "战车",
            meaning: "胜利，控制，意志，成功，决心",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Chariot%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "力量",
            meaning: "勇气，力量，耐心，控制， compassion",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Strength%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "隐士",
            meaning: "孤独，内省，智慧，自我发现，指导",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Hermit%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "命运之轮",
            meaning: "命运，转变，循环，机会，运气",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Wheel%20of%20Fortune%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "正义",
            meaning: "公平，正义，平衡，法律，责任",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Justice%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "倒吊人",
            meaning: "牺牲，暂停，视角，耐心， surrender",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Hanged%20Man%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "死神",
            meaning: "结束，转变，重生，变化， transition",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Death%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "节制",
            meaning: "平衡，和谐， moderation，适应，融合",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Temperance%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "恶魔",
            meaning: "诱惑，欲望，束缚，唯物主义， addiction",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Devil%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "高塔",
            meaning: "突然变化，危机，崩溃，启示， liberation",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Tower%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "星星",
            meaning: "希望，灵感，信仰，精神， renewal",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Star%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "月亮",
            meaning: "直觉，潜意识，恐惧，幻觉， mystery",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Moon%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "太阳",
            meaning: "成功，喜悦，活力，真相， positivity",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20Sun%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "审判",
            meaning: "觉醒，评估，重生， forgiveness， judgment",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=Judgment%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        },
        {
            name: "世界",
            meaning: "完成，圆满，成功，旅行， wholeness",
            image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=The%20World%20tarot%20card%20mystical%20classical%20style&image_size=square_hd"
        }
    ],
    // 小阿卡那 - 权杖
    wands: [
        { name: "权杖Ace", meaning: "新的开始，创造力，冒险，热情" },
        { name: "权杖2", meaning: "平衡，决定，计划，合作" },
        { name: "权杖3", meaning: "远见，计划，团队，扩张" },
        { name: "权杖4", meaning: "稳定，家庭，庆祝，和谐" },
        { name: "权杖5", meaning: "冲突，竞争，挑战，分歧" },
        { name: "权杖6", meaning: "胜利，成功，认可，自信" },
        { name: "权杖7", meaning: "坚持，防御，勇气，挑战" },
        { name: "权杖8", meaning: "快速行动，进展，旅行，消息" },
        { name: "权杖9", meaning: "警惕，防御，准备， resilience" },
        { name: "权杖10", meaning: "负担，责任，压力，完成" },
        { name: "权杖侍从", meaning: "好奇心，探索，学习，消息" },
        { name: "权杖骑士", meaning: "行动，冒险，热情，冲动" },
        { name: "权杖皇后", meaning: "创造力，热情，独立，自信" },
        { name: "权杖国王", meaning: "领导力，权威，创造力，行动" }
    ],
    // 小阿卡那 - 圣杯
    cups: [
        { name: "圣杯Ace", meaning: "新的感情，爱，直觉，情感" },
        { name: "圣杯2", meaning: "关系，合作，和谐，爱情" },
        { name: "圣杯3", meaning: "友谊，庆祝，社交，团体" },
        { name: "圣杯4", meaning: "不满，冷漠，选择， contemplation" },
        { name: "圣杯5", meaning: "损失，悲伤，失望，遗憾" },
        { name: "圣杯6", meaning: "回忆，礼物，善良，过去" },
        { name: "圣杯7", meaning: "幻想，选择，欲望，白日梦" },
        { name: "圣杯8", meaning: "离开，放弃，寻找， transition" },
        { name: "圣杯9", meaning: "满足，幸福，情感丰富，舒适" },
        { name: "圣杯10", meaning: "家庭，和谐，幸福，满足" },
        { name: "圣杯侍从", meaning: "情感，直觉，创造力，敏感" },
        { name: "圣杯骑士", meaning: "浪漫，感情，敏感，想象力" },
        { name: "圣杯皇后", meaning: "情感，直觉，同情心，创造力" },
        { name: "圣杯国王", meaning: "情感稳定，直觉，领导力， compassion" }
    ],
    // 小阿卡那 - 宝剑
    swords: [
        { name: "宝剑Ace", meaning: "新的思想，真相，突破， clarity" },
        { name: "宝剑2", meaning: "平衡，选择，犹豫， peace" },
        { name: "宝剑3", meaning: "悲伤，心碎，痛苦， conflict" },
        { name: "宝剑4", meaning: "休息，恢复，冥想， withdrawal" },
        { name: "宝剑5", meaning: "冲突，胜利，损失，竞争" },
        { name: "宝剑6", meaning: "和平，恢复，旅行， transition" },
        { name: "宝剑7", meaning: "策略，欺骗，秘密， cunning" },
        { name: "宝剑8", meaning: "限制，监禁，恐惧， restriction" },
        { name: "宝剑9", meaning: "焦虑，恐惧，失眠， worry" },
        { name: "宝剑10", meaning: "结束，痛苦，损失， transformation" },
        { name: "宝剑侍从", meaning: "思想，沟通，学习，消息" },
        { name: "宝剑骑士", meaning: "行动，速度，思维， communication" },
        { name: "宝剑皇后", meaning: "智慧，洞察力，独立， clarity" },
        { name: "宝剑国王", meaning: "权威，逻辑，智慧， leadership" }
    ],
    // 小阿卡那 - 星币
    pentacles: [
        { name: "星币Ace", meaning: "新的机会，财富，物质， abundance" },
        { name: "星币2", meaning: "平衡，选择，适应， juggling" },
        { name: "星币3", meaning: "合作，团队，技能， craftsmanship" },
        { name: "星币4", meaning: "稳定，安全，占有， conservation" },
        { name: "星币5", meaning: "贫困，困难，损失， struggle" },
        { name: "星币6", meaning: "给予，分享，慈善， balance" },
        { name: "星币7", meaning: "耐心，投资，等待， growth" },
        { name: "星币8", meaning: "勤奋，专注，技能， craftsmanship" },
        { name: "星币9", meaning: "成功，富足，独立， self-sufficiency" },
        { name: "星币10", meaning: "财富，家庭，遗产， security" },
        { name: "星币侍从", meaning: "学习，技能，潜力， growth" },
        { name: "星币骑士", meaning: "勤奋，务实，稳定， responsibility" },
        { name: "星币皇后", meaning: "富足，母性，务实， nurturing" },
        { name: "星币国王", meaning: "成功，权威，务实， leadership" }
    ]
};

// 合并所有牌
const allCards = [
    ...tarotCards.majorArcana,
    ...tarotCards.wands,
    ...tarotCards.cups,
    ...tarotCards.swords,
    ...tarotCards.pentacles
];

// DOM 元素
const elements = {
    // 模式切换
    singleCardBtn: document.getElementById('single-card-btn'),
    cardSpreadBtn: document.getElementById('card-spread-btn'),
    singleCardMode: document.getElementById('single-card-mode'),
    cardSpreadMode: document.getElementById('card-spread-mode'),

    // 单张抽牌
    drawCardBtn: document.getElementById('draw-card-btn'),
    singleCard: document.getElementById('single-card'),
    question: document.getElementById('question'),
    cardName: document.getElementById('card-name'),
    cardMeaning: document.getElementById('card-meaning'),
    personalizedReading: document.getElementById('personalized-reading'),

    // 牌阵模式
    spreadBtns: document.querySelectorAll('.spread-btn'),
    threeCardSpread: document.getElementById('three-card-spread'),
    celticCrossSpread: document.getElementById('celtic-cross-spread'),
    drawSpreadBtn: document.getElementById('draw-spread-btn'),
    spreadQuestion: document.getElementById('spread-question'),
    spreadMeanings: document.getElementById('spread-meanings')
};

// 模式切换
function setupModeSwitching() {
    elements.singleCardBtn.addEventListener('click', () => {
        elements.singleCardBtn.classList.add('active');
        elements.cardSpreadBtn.classList.remove('active');
        elements.singleCardMode.classList.add('active');
        elements.cardSpreadMode.classList.remove('active');
    });

    elements.cardSpreadBtn.addEventListener('click', () => {
        elements.cardSpreadBtn.classList.add('active');
        elements.singleCardBtn.classList.remove('active');
        elements.cardSpreadMode.classList.add('active');
        elements.singleCardMode.classList.remove('active');
    });
}

// 牌阵切换
function setupSpreadSwitching() {
    elements.spreadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.spreadBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const spreadType = btn.dataset.spread;
            if (spreadType === 'three-card') {
                elements.threeCardSpread.classList.add('active');
                elements.celticCrossSpread.classList.remove('active');
            } else if (spreadType === 'celtic-cross') {
                elements.celticCrossSpread.classList.add('active');
                elements.threeCardSpread.classList.remove('active');
            }
        });
    });
}

// 随机抽牌
function drawRandomCard() {
    const randomIndex = Math.floor(Math.random() * allCards.length);
    return allCards[randomIndex];
}

// 分析问题类型
function analyzeQuestionType(question) {
    const questionLower = question.toLowerCase();

    if (questionLower.includes('爱情') || questionLower.includes('感情') || questionLower.includes('恋爱') || questionLower.includes('关系')) {
        return 'love';
    } else if (questionLower.includes('工作') || questionLower.includes('事业') || questionLower.includes('职业') || questionLower.includes('职场')) {
        return 'career';
    } else if (questionLower.includes('财务') || questionLower.includes('金钱') || questionLower.includes('财富') || questionLower.includes('经济')) {
        return 'finance';
    } else if (questionLower.includes('健康') || questionLower.includes('身体') || questionLower.includes('心理')) {
        return 'health';
    } else if (questionLower.includes('未来') || questionLower.includes('前途') || questionLower.includes('发展')) {
        return 'future';
    } else if (questionLower.includes('家庭') || questionLower.includes('家人') || questionLower.includes('亲情')) {
        return 'family';
    } else if (questionLower.includes('朋友') || questionLower.includes('友谊') || questionLower.includes('社交')) {
        return 'friends';
    } else {
        return 'general';
    }
}

// 生成个性化解读
function generatePersonalizedReading(card, question) {
    const questionType = analyzeQuestionType(question);
    const meaning = card.meaning.toLowerCase();

    let readings = [];

    switch (questionType) {
        case 'love':
            readings = [
                `在感情方面，${card.name}牌提示你${meaning}。这意味着在你的爱情关系中，你可能需要更加关注${meaning}的方面，这将帮助你建立更健康、更和谐的关系。`,
                `关于你的感情问题，${card.name}牌象征着${meaning}。这可能表示你当前的感情状态需要${meaning}的元素，或者你即将在感情生活中经历${meaning}的变化。`,
                `当你思考感情问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在处理感情关系时，要保持${meaning}的态度，这样才能找到真正的幸福。`,
                `对于你的感情问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的态度，以${meaning}的方式面对感情中的挑战，从而获得更好的结果。`,
                `在感情的背景下，${card.name}牌代表着${meaning}。这可能是你当前感情状态的真实反映，也是你改善感情关系的关键所在。`
            ];
            break;
        case 'career':
            readings = [
                `在事业方面，${card.name}牌提示你${meaning}。这意味着在你的职业发展中，你可能需要更加注重${meaning}的能力，这将帮助你在职场中取得更大的成功。`,
                `关于你的工作问题，${card.name}牌象征着${meaning}。这可能表示你当前的工作状态需要${meaning}的元素，或者你即将在职业生涯中迎来${meaning}的机会。`,
                `当你思考工作问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在处理工作事务时，要保持${meaning}的态度，这样才能在职场中脱颖而出。`,
                `对于你的事业问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的工作方式，以${meaning}的态度面对职业挑战，从而获得更好的职业发展。`,
                `在职业发展的背景下，${card.name}牌代表着${meaning}。这可能是你当前职业状态的真实反映，也是你实现职业目标的关键所在。`
            ];
            break;
        case 'finance':
            readings = [
                `在财务方面，${card.name}牌提示你${meaning}。这意味着在你的财务管理中，你可能需要更加注重${meaning}的原则，这将帮助你实现财务稳定和增长。`,
                `关于你的金钱问题，${card.name}牌象征着${meaning}。这可能表示你当前的财务状况需要${meaning}的元素，或者你即将在财务方面迎来${meaning}的机会。`,
                `当你思考财务问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在处理金钱事务时，要保持${meaning}的态度，这样才能实现财务自由。`,
                `对于你的财务问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的消费习惯，以${meaning}的方式管理财务，从而获得更好的财务状况。`,
                `在财务状况的背景下，${card.name}牌代表着${meaning}。这可能是你当前财务状态的真实反映，也是你改善财务状况的关键所在。`
            ];
            break;
        case 'health':
            readings = [
                `在健康方面，${card.name}牌提示你${meaning}。这意味着在你的健康管理中，你可能需要更加注重${meaning}的生活方式，这将帮助你保持身体和心理的健康。`,
                `关于你的健康问题，${card.name}牌象征着${meaning}。这可能表示你当前的健康状况需要${meaning}的元素，或者你即将在健康方面迎来${meaning}的改善。`,
                `当你思考健康问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在日常生活中，要保持${meaning}的态度，这样才能维持良好的健康状态。`,
                `对于你的健康问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的生活习惯，以${meaning}的方式对待健康，从而获得更好的健康状况。`,
                `在健康状况的背景下，${card.name}牌代表着${meaning}。这可能是你当前健康状态的真实反映，也是你改善健康状况的关键所在。`
            ];
            break;
        case 'future':
            readings = [
                `在未来发展方面，${card.name}牌提示你${meaning}。这意味着在你的未来规划中，你可能需要更加注重${meaning}的方向，这将帮助你实现自己的人生目标。`,
                `关于你的未来问题，${card.name}牌象征着${meaning}。这可能表示你即将在未来经历${meaning}的变化，或者你需要以${meaning}的态度面对未来的挑战。`,
                `当你思考未来问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在规划未来时，要保持${meaning}的态度，这样才能创造美好的未来。`,
                `对于你的未来问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的人生规划，以${meaning}的方式面对未来，从而获得更好的未来发展。`,
                `在未来发展的背景下，${card.name}牌代表着${meaning}。这可能是你未来发展的重要指引，也是你实现人生目标的关键所在。`
            ];
            break;
        case 'family':
            readings = [
                `在家庭方面，${card.name}牌提示你${meaning}。这意味着在你的家庭关系中，你可能需要更加注重${meaning}的元素，这将帮助你建立更和谐、更幸福的家庭。`,
                `关于你的家庭问题，${card.name}牌象征着${meaning}。这可能表示你当前的家庭状况需要${meaning}的元素，或者你即将在家庭生活中经历${meaning}的变化。`,
                `当你思考家庭问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在处理家庭事务时，要保持${meaning}的态度，这样才能维护家庭的和谐。`,
                `对于你的家庭问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的家庭观念，以${meaning}的方式对待家人，从而获得更好的家庭关系。`,
                `在家庭生活的背景下，${card.name}牌代表着${meaning}。这可能是你当前家庭状态的真实反映，也是你改善家庭关系的关键所在。`
            ];
            break;
        case 'friends':
            readings = [
                `在友谊方面，${card.name}牌提示你${meaning}。这意味着在你的社交关系中，你可能需要更加注重${meaning}的品质，这将帮助你建立更真诚、更持久的友谊。`,
                `关于你的朋友问题，${card.name}牌象征着${meaning}。这可能表示你当前的社交状况需要${meaning}的元素，或者你即将在友谊方面经历${meaning}的变化。`,
                `当你思考朋友问题时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在处理社交关系时，要保持${meaning}的态度，这样才能获得真正的友谊。`,
                `对于你的朋友问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的社交方式，以${meaning}的态度对待朋友，从而获得更好的社交关系。`,
                `在友谊的背景下，${card.name}牌代表着${meaning}。这可能是你当前社交状态的真实反映，也是你改善友谊关系的关键所在。`
            ];
            break;
        default:
            readings = [
                `针对你的问题"${question}"，${card.name}牌提示你${meaning}。这意味着在你当前面临的情况中，你可能需要更加关注${meaning}的方面，这将帮助你找到解决问题的方法。`,
                `关于"${question}"，${card.name}牌象征着${meaning}，这可能是你当前需要关注的方向。这可能表示你需要以${meaning}的态度面对当前的挑战，从而获得更好的结果。`,
                `当你思考"${question}"时，${card.name}牌带来的信息是${meaning}。这可能是在提醒你，在处理当前问题时，要保持${meaning}的态度，这样才能找到正确的解决方案。`,
                `对于"${question}"这个问题，${card.name}牌建议你${meaning}。这意味着你可能需要调整自己的思路，以${meaning}的方式面对问题，从而获得更好的结果。`,
                `在"${question}"的背景下，${card.name}牌代表着${meaning}，这可能是你前进的关键。这可能是你当前状态的真实反映，也是你解决问题的重要指引。`
            ];
    }

    const randomIndex = Math.floor(Math.random() * readings.length);
    return readings[randomIndex];
}

// 生成牌面总结
function generateCardSummary(card, question) {
    const questionType = analyzeQuestionType(question);
    const meaning = card.meaning.toLowerCase();

    let summaries = [];

    switch (questionType) {
        case 'love':
            summaries = [
                `综合来看，${card.name}牌在你关于感情的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前感情生活中需要关注和发展的方向。通过培养这些特质，你可以建立更健康、更和谐的感情关系。`,
                `从${card.name}牌的含义来看，对于你的感情问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决感情困扰的方法，或者为你的感情生活带来新的转机。`,
                `${card.name}牌为你的感情问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前感情状态的真实反映，也是你改善感情关系的重要指引。`,
                `当面对感情问题时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的感情挑战，迎来新的感情机遇，或者加深你与伴侣之间的连接。`,
                `综合${card.name}牌的含义，对于你的感情问题，你需要保持${meaning}的态度，这将引导你走向更加积极和充实的感情生活，帮助你找到真正的爱情和幸福。`
            ];
            break;
        case 'career':
            summaries = [
                `综合来看，${card.name}牌在你关于事业的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前职业发展中需要关注和培养的能力。通过发展这些能力，你可以在职场中取得更大的成功。`,
                `从${card.name}牌的含义来看，对于你的工作问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决职业困扰的方法，或者为你的职业生涯带来新的机会。`,
                `${card.name}牌为你的事业问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前职业状态的真实反映，也是你实现职业目标的重要指引。`,
                `当面对职业挑战时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的工作困难，迎来新的职业机遇，或者在职场中获得更多的认可和成就。`,
                `综合${card.name}牌的含义，对于你的事业问题，你需要保持${meaning}的态度，这将引导你走向更加成功和充实的职业生涯，帮助你实现自己的职业理想。`
            ];
            break;
        case 'finance':
            summaries = [
                `综合来看，${card.name}牌在你关于财务的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前财务管理中需要关注和实践的原则。通过遵循这些原则，你可以实现财务的稳定和增长。`,
                `从${card.name}牌的含义来看，对于你的金钱问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决财务困扰的方法，或者为你的财务状况带来新的改善。`,
                `${card.name}牌为你的财务问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前财务状态的真实反映，也是你实现财务目标的重要指引。`,
                `当面对财务挑战时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的财务困难，迎来新的财务机遇，或者实现财务的自由和独立。`,
                `综合${card.name}牌的含义，对于你的财务问题，你需要保持${meaning}的态度，这将引导你走向更加稳定和充实的财务状况，帮助你实现经济上的安全感。`
            ];
            break;
        case 'health':
            summaries = [
                `综合来看，${card.name}牌在你关于健康的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前健康管理中需要关注和实践的生活方式。通过采纳这些生活方式，你可以保持身体和心理的健康。`,
                `从${card.name}牌的含义来看，对于你的健康问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决健康困扰的方法，或者为你的健康状况带来新的改善。`,
                `${card.name}牌为你的健康问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前健康状态的真实反映，也是你维护健康的重要指引。`,
                `当面对健康挑战时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的健康困难，迎来新的健康机遇，或者恢复身体和心理的平衡。`,
                `综合${card.name}牌的含义，对于你的健康问题，你需要保持${meaning}的态度，这将引导你走向更加健康和充实的生活，帮助你实现身体和心理的和谐。`
            ];
            break;
        case 'future':
            summaries = [
                `综合来看，${card.name}牌在你关于未来的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前未来规划中需要关注和发展的方向。通过朝着这些方向努力，你可以实现自己的人生目标。`,
                `从${card.name}牌的含义来看，对于你的未来问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到规划未来的方法，或者为你的未来发展带来新的机遇。`,
                `${card.name}牌为你的未来问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前状态的真实反映，也是你未来发展的重要指引。`,
                `当面对未来的不确定性时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的迷茫期，迎来新的未来机遇，或者找到自己人生的方向。`,
                `综合${card.name}牌的含义，对于你的未来问题，你需要保持${meaning}的态度，这将引导你走向更加光明和充实的未来，帮助你实现自己的人生理想。`
            ];
            break;
        case 'family':
            summaries = [
                `综合来看，${card.name}牌在你关于家庭的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前家庭关系中需要关注和培养的元素。通过培养这些元素，你可以建立更和谐、更幸福的家庭。`,
                `从${card.name}牌的含义来看，对于你的家庭问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决家庭困扰的方法，或者为你的家庭生活带来新的改善。`,
                `${card.name}牌为你的家庭问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前家庭状态的真实反映，也是你改善家庭关系的重要指引。`,
                `当面对家庭挑战时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的家庭困难，迎来新的家庭机遇，或者加深你与家人之间的感情。`,
                `综合${card.name}牌的含义，对于你的家庭问题，你需要保持${meaning}的态度，这将引导你走向更加和谐和充实的家庭生活，帮助你建立幸福的家庭环境。`
            ];
            break;
        case 'friends':
            summaries = [
                `综合来看，${card.name}牌在你关于友谊的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前社交关系中需要关注和培养的品质。通过培养这些品质，你可以建立更真诚、更持久的友谊。`,
                `从${card.name}牌的含义来看，对于你的朋友问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决社交困扰的方法，或者为你的友谊关系带来新的改善。`,
                `${card.name}牌为你的朋友问题提供了一个独特的视角。它象征着${meaning}，这可能是你当前社交状态的真实反映，也是你改善友谊关系的重要指引。`,
                `当面对社交挑战时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的社交困难，迎来新的友谊机遇，或者加深你与朋友之间的感情。`,
                `综合${card.name}牌的含义，对于你的朋友问题，你需要保持${meaning}的态度，这将引导你走向更加丰富和充实的社交生活，帮助你建立真正的友谊。`
            ];
            break;
        default:
            summaries = [
                `综合来看，${card.name}牌在你关于"${question}"的问题中扮演着重要角色。它代表的${meaning}特质，可能是你当前需要关注和发展的方向。通过培养这些特质，你可以找到解决问题的方法。`,
                `从${card.name}牌的含义来看，对于"${question}"这个问题，你可能需要更多地关注${meaning}方面的因素，这将帮助你找到解决当前困扰的方法，或者为你的现状带来新的改善。`,
                `${card.name}牌为你的问题"${question}"提供了一个独特的视角。它象征着${meaning}，这可能是你当前状态的真实反映，也是你前进的重要指引。`,
                `当面对"${question}"这个问题时，${card.name}牌提示你要重视${meaning}的力量，这将帮助你度过当前的挑战，迎来新的机遇，或者找到解决问题的关键。`,
                `综合${card.name}牌的含义，对于"${question}"这个问题，你需要保持${meaning}的态度，这将引导你走向更加积极和充实的状态，帮助你实现自己的目标。`
            ];
    }

    const randomIndex = Math.floor(Math.random() * summaries.length);
    return summaries[randomIndex];
}

// 生成牌阵总结
function generateSpreadSummary(cards, question) {
    const summary = `综合来看，这些牌为你的问题"${question}"提供了全面的视角。从过去的影响到未来的可能，从意识层面到潜意识的因素，它们共同构成了一个完整的画面。记住，塔罗牌不是预言，而是引导你思考的工具，最终的选择和行动掌握在你自己手中。`;
    return summary;
}

// 创建倒计时元素
function createCountdownElement() {
    const countdown = document.createElement('div');
    countdown.id = 'countdown';
    countdown.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 5rem;
        font-weight: bold;
        color: #d4af37;
        text-shadow: 0 0 20px rgba(212, 175, 55, 0.8);
        z-index: 1000;
        background: rgba(26, 26, 46, 0.8);
        padding: 30px;
        border-radius: 10px;
        border: 2px solid #d4af37;
        box-shadow: 0 0 30px rgba(100, 50, 150, 0.5);
    `;
    return countdown;
}

// 执行倒计时
function startCountdown(seconds, onComplete) {
    const countdown = createCountdownElement();
    document.body.appendChild(countdown);

    let currentSecond = seconds;
    countdown.textContent = currentSecond;

    const interval = setInterval(() => {
        currentSecond--;
        if (currentSecond > 0) {
            countdown.textContent = currentSecond;
        } else {
            clearInterval(interval);
            document.body.removeChild(countdown);
            onComplete();
        }
    }, 1000);
}

// 单张抽牌功能
function setupSingleCardDraw() {
    // 使用节流函数，限制点击频率
    const throttledDraw = throttle(async () => {
        // 尝试获取锁
        if (!lock.acquire('draw-card')) {
            console.warn('抽牌操作已在进行中');
            return;
        }

        const question = elements.question.value || '我的未来会怎样？';

        // 禁用按钮
        elements.drawCardBtn.disabled = true;
        elements.drawCardBtn.style.opacity = '0.6';

        try {
            // 开始倒计时
            await new Promise(resolve => {
                startCountdown(5, resolve);
            });

            const card = drawRandomCard();

            // 播放洗牌音效
            playSound('shuffle');

            // 重置卡片状态
            elements.singleCard.classList.remove('flipped', 'draw-animation', 'glow');

            // 触发抽牌动画
            await new Promise(resolve => {
                setTimeout(() => {
                    // 播放抽牌音效
                    playSound('draw');
                    elements.singleCard.classList.add('draw-animation');

                    // 翻转卡片
                    setTimeout(() => {
                        // 播放翻牌音效
                        playSound('flip');
                        elements.singleCard.classList.add('flipped');

                        // 更新卡片内容
                        setTimeout(() => {
                            const cardFront = elements.singleCard.querySelector('.card-front');
                            cardFront.innerHTML = `
                                <h3>${card.name}</h3>
                                <img src="${card.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tarot%20card%20back%20mystical%20classical%20style&image_size=square_hd'}" alt="${card.name}" style="max-width: 80%; max-height: 60%; margin: 10px 0;">
                                <p>${card.meaning}</p>
                            `;

                            // 显示加载状态
                            elements.cardName.textContent = card.name;
                            elements.cardMeaning.textContent = card.meaning;
                            elements.personalizedReading.innerHTML = `
                                <p style="color: #b8a9c9; font-style: italic;">正在获取AI解读...</p>
                            `;

                            // 添加发光效果
                            elements.singleCard.classList.add('glow');

                            resolve();
                        }, 500);
                    }, 1000);
                }, 100);
            });

            // 调用AI生成解读
            try {
                const aiReading = await generateAICardReading(card, question);

                // 根据解读来源显示不同的提示
                const sourceInfo = aiReading.source === 'ai'
                    ? '<span style="color: #4CAF50; font-size: 0.9em;">（AI解读）</span>'
                    : '<span style="color: #FF9800; font-size: 0.9em;">（系统解读）</span>';

                elements.personalizedReading.innerHTML = `
                    <p>${aiReading.personalized}</p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(212, 175, 55, 0.3);">
                        <h4 style="color: #d4af37; margin-bottom: 10px;">综合总结 ${sourceInfo}</h4>
                        <p>${aiReading.summary}</p>
                    </div>
                    ${aiReading.source === 'backup' ? '<p style="margin-top: 10px; color: #b8a9c9; font-style: italic; font-size: 0.9em;">提示：由于API请求过于频繁，当前使用系统预设解读。建议稍后再试AI解读功能。</p>' : ''}
                `;
            } catch (error) {
                console.error('AI解读生成失败:', error);
                // 使用备用解读
                const backupReading = {
                    personalized: generatePersonalizedReading(card, question),
                    summary: generateCardSummary(card, question),
                    source: 'backup'
                };

                elements.personalizedReading.innerHTML = `
                    <p>${backupReading.personalized}</p>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(212, 175, 55, 0.3);">
                        <h4 style="color: #d4af37; margin-bottom: 10px;">综合总结 <span style="color: #FF9800; font-size: 0.9em;">（系统解读）</span></h4>
                        <p>${backupReading.summary}</p>
                    </div>
                    <p style="margin-top: 10px; color: #b8a9c9; font-style: italic; font-size: 0.9em;">提示：由于API请求过于频繁，当前使用系统预设解读。建议稍后再试AI解读功能。</p>
                `;
            }
        } catch (error) {
            console.error('抽牌过程出错:', error);
        } finally {
            // 释放锁
            lock.release('draw-card');
            // 启用按钮
            elements.drawCardBtn.disabled = false;
            elements.drawCardBtn.style.opacity = '1';
        }
    }, 3000); // 3秒内只能点击一次

    elements.drawCardBtn.addEventListener('click', throttledDraw);
}

// 牌阵抽牌功能
function setupSpreadDraw() {
    // 使用节流函数，限制点击频率
    const throttledDraw = throttle(async () => {
        // 尝试获取锁
        if (!lock.acquire('draw-spread')) {
            console.warn('牌阵抽牌操作已在进行中');
            return;
        }

        const question = elements.spreadQuestion.value || '我应该如何面对当前的挑战？';
        const activeSpread = document.querySelector('.spread-container.active');
        const spreadCards = activeSpread.querySelectorAll('.spread-card');

        // 禁用按钮
        elements.drawSpreadBtn.disabled = true;
        elements.drawSpreadBtn.style.opacity = '0.6';

        try {
            // 开始倒计时
            await new Promise(resolve => {
                startCountdown(5, resolve);
            });

            // 播放洗牌音效
            playSound('shuffle');

            // 重置牌阵状态
            spreadCards.forEach(card => {
                card.classList.remove('draw-animation', 'glow');
            });

            // 清空解释
            elements.spreadMeanings.innerHTML = '';

            // 存储抽出的牌和位置
            const drawnCards = [];
            const positions = [];

            // 为每个位置抽牌
            await new Promise(resolve => {
                let completed = 0;
                const total = spreadCards.length;

                spreadCards.forEach((card, index) => {
                    setTimeout(() => {
                        const drawnCard = drawRandomCard();
                        drawnCards.push(drawnCard);
                        const position = card.dataset.position;
                        positions.push(position);

                        // 播放抽牌音效
                        playSound('draw');
                        // 触发抽牌动画
                        card.classList.add('draw-animation');

                        // 更新卡片内容
                        setTimeout(() => {
                            // 播放翻牌音效
                            playSound('flip');
                            card.innerHTML = `
                                <div style="text-align: center;">
                                    <h4 style="margin-bottom: 5px;">${drawnCard.name}</h4>
                                    <img src="${drawnCard.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tarot%20card%20back%20mystical%20classical%20style&image_size=square_hd'}" alt="${drawnCard.name}" style="max-width: 80%; max-height: 60%; margin: 5px 0;">
                                </div>
                            `;

                            // 添加发光效果
                            card.classList.add('glow');

                            // 显示加载状态
                            const meaningItem = document.createElement('div');
                            meaningItem.className = 'spread-meaning-item';
                            meaningItem.innerHTML = `
                                <h4>${getPositionName(position)}: ${drawnCard.name}</h4>
                                <p style="color: #b8a9c9; font-style: italic;">正在获取AI解读...</p>
                            `;
                            elements.spreadMeanings.appendChild(meaningItem);

                            completed++;
                            if (completed === total) {
                                resolve();
                            }
                        }, 500);
                    }, index * 300);
                });
            });

            // 调用AI生成牌阵解读
            try {
                const aiReading = await generateAISpreadReading(drawnCards, positions, question);

                // 清空之前的加载状态
                elements.spreadMeanings.innerHTML = '';

                // 显示AI生成的完整解读
                const readingDiv = document.createElement('div');
                readingDiv.className = 'spread-meaning-item';
                readingDiv.style.backgroundColor = 'rgba(100, 50, 150, 0.1)';
                readingDiv.innerHTML = aiReading.replace(/\n/g, '<br>');
                elements.spreadMeanings.appendChild(readingDiv);
            } catch (error) {
                console.error('AI牌阵解读生成失败:', error);
                // 使用备用解读
                elements.spreadMeanings.innerHTML = '';
                drawnCards.forEach((drawnCard, i) => {
                    const meaningItem = document.createElement('div');
                    meaningItem.className = 'spread-meaning-item';
                    meaningItem.innerHTML = `
                        <h4>${getPositionName(positions[i])}: ${drawnCard.name}</h4>
                        <p>${drawnCard.meaning}</p>
                        <p style="font-style: italic; margin-top: 5px;">${generatePersonalizedReading(drawnCard, question)}</p>
                    `;
                    elements.spreadMeanings.appendChild(meaningItem);
                });

                const summaryItem = document.createElement('div');
                summaryItem.className = 'spread-meaning-item';
                summaryItem.style.backgroundColor = 'rgba(100, 50, 150, 0.2)';
                summaryItem.innerHTML = `
                    <h4 style="color: #d4af37;">综合总结</h4>
                    <p>${generateSpreadSummary(drawnCards, question)}</p>
                `;
                elements.spreadMeanings.appendChild(summaryItem);
            }
        } catch (error) {
            console.error('牌阵抽牌过程出错:', error);
        } finally {
            // 释放锁
            lock.release('draw-spread');
            // 启用按钮
            elements.drawSpreadBtn.disabled = false;
            elements.drawSpreadBtn.style.opacity = '1';
        }
    }, 5000); // 5秒内只能点击一次

    elements.drawSpreadBtn.addEventListener('click', throttledDraw);
}

// 获取牌阵位置名称
function getPositionName(position) {
    const positionNames = {
        past: '过去',
        present: '现在',
        future: '未来',
        challenge: '挑战',
        conscious: '意识',
        unconscious: '潜意识',
        self: '自我',
        environment: '环境',
        hopes: '希望',
        outcome: '结果'
    };
    return positionNames[position] || position;
}

// 音效功能
function playSound(soundType) {
    // 创建音频元素
    const audio = new Audio();

    // 根据音效类型设置不同的声音
    switch (soundType) {
        case 'draw':
            audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD';
            break;
        case 'flip':
            audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD';
            break;
        case 'shuffle':
            audio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAD';
            break;
        default:
            return;
    }

    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
}

// 初始化游戏
function initGame() {
    setupModeSwitching();
    setupSpreadSwitching();
    setupSingleCardDraw();
    setupSpreadDraw();

    // 添加背景粒子效果
    createParticles();
}

// 创建背景粒子效果
function createParticles() {
    const container = document.querySelector('.background-effect');

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 5 + 1}px;
            height: ${Math.random() * 5 + 1}px;
            background: rgba(212, 175, 55, ${Math.random() * 0.5 + 0.3});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', initGame);