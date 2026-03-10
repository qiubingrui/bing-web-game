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
// 1. 单牌个性化解读 → AI
function generatePersonalizedReading(card, question) {
    const questionType = analyzeQuestionType(question);
    const cardName = card.name;
    const resultDiv = document.getElementById('ai-result');
    resultDiv.textContent = "🔮 正在感应塔罗牌...";

    const prompt = `你是温柔治愈塔罗师，抽到【${cardName}】，问题类型：${questionType}，问题：${question}，50字内温柔解读。`;

    fetch("https://ark.cn-beijing.volces.com/api/v3/responses", {
        method: "POST",
        headers: {
            "Authorization": "Bearer sk-c7f28817-ffed-4e07-bda7-e787a14340ca",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "doubao-seed-1-8-251228",
            "input": [{ role: "user", content: [{ type: "input_text", text: prompt }] }]
        })
    })
    .then(res => res.json())
    .then(data => {
        resultDiv.textContent = data.output?.text || "✨ 这张牌在温柔守护你。";
    })
    .catch(() => {
        resultDiv.textContent = `✨ ${cardName}：你正被宇宙温柔爱着。`;
    });
}

// 2. 牌面总结 → AI
function generateCardSummary(card, question) {
    const resultDiv = document.getElementById('card-summary');
    resultDiv.textContent = "🔮 正在总结牌面...";

    const prompt = `塔罗牌【${card.name}】，问题：${question}，30字内简洁核心总结。`;

    fetch("https://ark.cn-beijing.volces.com/api/v3/responses", {
        method: "POST",
        headers: {
            "Authorization": "Bearer sk-c7f28817-ffed-4e07-bda7-e787a14340ca",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "doubao-seed-1-8-251228",
            "input": [{ role: "user", content: [{ type: "input_text", text: prompt }] }]
        })
    })
    .then(res => res.json())
    .then(data => {
        resultDiv.textContent = data.output?.text || "✨ 牌面能量非常温柔。";
    })
    .catch(() => {
        resultDiv.textContent = "✨ 这是一张充满好运的牌。";
    });
}

// 3. 牌阵总结 → AI
function generateSpreadSummary(cards, question) {
    const resultDiv = document.getElementById('spread-meanings');
    resultDiv.textContent = "🔮 正在解读牌阵...";
    const cardNames = cards.map(c => c.name).join('、');

    const prompt = `牌阵：${cardNames}，问题：${question}，50字内温柔整体总结。`;

    fetch("https://ark.cn-beijing.volces.com/api/v3/responses", {
        method: "POST",
        headers: {
            "Authorization": "Bearer sk-c7f28817-ffed-4e07-bda7-e787a14340ca",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "doubao-seed-1-8-251228",
            "input": [{ role: "user", content: [{ type: "input_text", text: prompt }] }]
        })
    })
    .then(res => res.json())
    .then(data => {
        resultDiv.textContent = data.output?.text || "✨ 牌阵整体非常顺利。";
    })
    .catch(() => {
        resultDiv.textContent = "✨ 你正被温柔守护着。";
    });
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
    elements.drawCardBtn.addEventListener('click', () => {
        const question = elements.question.value || '我的未来会怎样？';

        // 禁用按钮
        elements.drawCardBtn.disabled = true;
        elements.drawCardBtn.style.opacity = '0.6';

        // 开始倒计时
        startCountdown(5, () => {
            const card = drawRandomCard();

            // 播放洗牌音效
            playSound('shuffle');

            // 重置卡片状态
            elements.singleCard.classList.remove('flipped', 'draw-animation', 'glow');

            // 触发抽牌动画
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

                        // 更新解释
                        elements.cardName.textContent = card.name;
                        elements.cardMeaning.textContent = card.meaning;
                        elements.personalizedReading.innerHTML = `
                            <p>${generatePersonalizedReading(card, question)}</p>
                            <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(212, 175, 55, 0.3);">
                                <h4 style="color: #d4af37; margin-bottom: 10px;">综合总结</h4>
                                <p>${generateCardSummary(card, question)}</p>
                            </div>
                        `;

                        // 添加发光效果
                        elements.singleCard.classList.add('glow');

                        // 启用按钮
                        elements.drawCardBtn.disabled = false;
                        elements.drawCardBtn.style.opacity = '1';
                    }, 500);
                }, 1000);
            }, 100);
        });
    });
}

// 牌阵抽牌功能
function setupSpreadDraw() {
    elements.drawSpreadBtn.addEventListener('click', () => {
        const question = elements.spreadQuestion.value || '我应该如何面对当前的挑战？';
        const activeSpread = document.querySelector('.spread-container.active');
        const spreadCards = activeSpread.querySelectorAll('.spread-card');

        // 禁用按钮
        elements.drawSpreadBtn.disabled = true;
        elements.drawSpreadBtn.style.opacity = '0.6';

        // 开始倒计时
        startCountdown(5, () => {
            // 播放洗牌音效
            playSound('shuffle');

            // 重置牌阵状态
            spreadCards.forEach(card => {
                card.classList.remove('draw-animation', 'glow');
            });

            // 清空解释
            elements.spreadMeanings.innerHTML = '';

            // 存储抽出的牌
            const drawnCards = [];

            // 为每个位置抽牌
            spreadCards.forEach((card, index) => {
                setTimeout(() => {
                    const drawnCard = drawRandomCard();
                    drawnCards.push(drawnCard);
                    const position = card.dataset.position;

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

                        // 更新解释
                        const meaningItem = document.createElement('div');
                        meaningItem.className = 'spread-meaning-item';
                        meaningItem.innerHTML = `
                            <h4>${getPositionName(position)}: ${drawnCard.name}</h4>
                            <p>${drawnCard.meaning}</p>
                            <p style="font-style: italic; margin-top: 5px;">${generatePersonalizedReading(drawnCard, question)}</p>
                        `;
                        elements.spreadMeanings.appendChild(meaningItem);

                        // 当所有牌都处理完毕后，添加总结
                        if (index === spreadCards.length - 1) {
                            setTimeout(() => {
                                const summaryItem = document.createElement('div');
                                summaryItem.className = 'spread-meaning-item';
                                summaryItem.style.backgroundColor = 'rgba(100, 50, 150, 0.2)';
                                summaryItem.innerHTML = `
                                    <h4 style="color: #d4af37;">综合总结</h4>
                                    <p>${generateSpreadSummary(drawnCards, question)}</p>
                                `;
                                elements.spreadMeanings.appendChild(summaryItem);

                                // 启用按钮
                                elements.drawSpreadBtn.disabled = false;
                                elements.drawSpreadBtn.style.opacity = '1';
                            }, 1000);
                        }
                    }, 500);
                }, index * 300);
            });
        });
    });
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

