(() => {
    // 答題容器 DOM
    const quizArea = document.getElementById("quiz-area");

    if (!quizArea) {
        return;
    }

    // 狀態管理
    const quizState = {
        questions: [],
        currentIndex: 0,
        correctCount: 0,
        score: 0,
        totalQuestions: 5,
        answered: false
    };

    // 坪林茶與生態知識庫（共 18 題，均符合台灣繁體中文排版及空格規範）
    const teaQuizBank = [
        {
            category: "製茶工序",
            question: "文山包種茶的製程中，「浪菁」（攪拌）的主要目的是什麼？",
            options: ["讓茶葉乾燥脫水", "促進茶葉邊緣細胞氧化產生香氣", "去除茶葉上的灰塵", "讓茶葉捲成球狀"],
            correct: 1,
            explanation: "浪菁（攪拌）是包種茶製程的關鍵步驟。透過輕柔翻動茶葉，使葉緣細胞受損並接觸空氣，促進氧化反應，進而產生包種茶獨特的花香與清雅風味。"
        },
        {
            category: "製茶工序",
            question: "包種茶製程中的「殺菁」是利用什麼方式來停止茶葉氧化？",
            options: ["日曬", "高溫加熱", "冷凍", "浸泡冷水"],
            correct: 1,
            explanation: "殺菁是利用高溫（約 200 到 300 °C 的炒鍋或蒸氣）快速破壞茶葉中的氧化酵素活性，讓發酵在適當程度停止，固定茶葉的色、香、味。"
        },
        {
            category: "製茶工序",
            question: "包種茶的製茶流程中，以下哪個步驟排在最前面？",
            options: ["揉捻", "萎凋", "殺菁", "乾燥"],
            correct: 1,
            explanation: "包種茶的基本製程順序為：採摘 → 萎凋（日光萎凋與室內萎凋）→ 浪菁（攪拌）→ 殺菁 → 揉捻 → 乾燥。萎凋是製茶的第一道加工步驟。"
        },
        {
            category: "製茶工序",
            question: "製茶過程中「揉捻」的主要目的是什麼？",
            options: ["讓茶葉產生香氣", "破壞茶葉組織使茶汁附著葉表便於沖泡", "降低茶葉水分", "讓茶葉變成綠色"],
            correct: 1,
            explanation: "揉捻是透過物理壓力破壞茶葉細胞組織，使茶汁滲出並附著於葉面，沖泡時茶湯的滋味與香氣才能更容易釋放。同時也塑造茶葉的外觀形狀。"
        },
        {
            category: "茶葉知識",
            question: "文山包種茶屬於哪一種茶類？",
            options: ["不發酵茶（綠茶）", "輕發酵茶（部分氧化茶）", "全發酵茶（紅茶）", "後發酵茶（普洱茶）"],
            correct: 1,
            explanation: "文山包種茶屬於輕發酵的部分氧化茶（烏龍茶系），發酵程度約 8% 到 12%，是所有烏龍茶中發酵程度最輕的，因此保留了清雅的花香與鮮爽口感。"
        },
        {
            category: "茶葉知識",
            question: "文山包種茶最顯著的香氣特色是什麼？",
            options: ["焦糖香", "天然花香（如桂花、蘭花香）", "煙燻味", "果酸味"],
            correct: 1,
            explanation: "文山包種茶以「香氣」著稱，具有天然的桂花香、蘭花香或梔子花香，被譽為「北包種、南凍頂」中最重香氣的茶種。香氣清揚是其最大特色。"
        },
        {
            category: "茶葉知識",
            question: "「包種茶」名稱的由來與什麼有關？",
            options: ["茶葉的包裝方式", "茶樹的品種名稱", "產地的地名", "製茶師傅的姓名"],
            correct: 0,
            explanation: "「包種」名稱源自清代的包裝方式：茶農將製好的茶葉用方形毛邊紙包成四方包，每包 4 兩，並在紙面印上茶名，稱為「包種」。這種以紙包茶的傳統包裝方式，便成了茶名的由來。"
        },
        {
            category: "茶葉知識",
            question: "坪林地區除了文山包種茶外，近年也積極推廣哪一種特色茶？",
            options: ["碧螺春", "蜜香紅茶", "鐵觀音", "龍井茶"],
            correct: 1,
            explanation: "坪林近年積極推廣蜜香紅茶，利用小綠葉蟬叮咬茶葉後產生的天然蜜香，製成具有獨特果蜜風味的紅茶。這種茶不使用農藥才能讓小綠葉蟬自然叮咬，也兼顧了生態友善。"
        },
        {
            category: "坪林地理",
            question: "坪林區位於哪一條溪流的上游流域，也是大臺北地區重要的水源保護區？",
            options: ["基隆河", "新店溪（北勢溪）", "淡水河", "景美溪"],
            correct: 1,
            explanation: "坪林區位於北勢溪上游，北勢溪是翡翠水庫的主要水源，匯入新店溪後成為大臺北地區數百萬人的飲用水來源。因此坪林全區被劃為水源特定區，環境保護格外嚴格。"
        },
        {
            category: "坪林地理",
            question: "坪林茶業博物館的建築風格是以什麼傳統樣式設計的？",
            options: ["日式木造建築", "閩南式四合院", "巴洛克式洋樓", "客家圍屋"],
            correct: 1,
            explanation: "坪林茶業博物館以閩南式四合院為建築主體，融合傳統東方美學與現代展覽空間。館舍座落於北勢溪畔綠意中，典雅的閩南紅磚與灰瓦屋頂與山林環境和諧呼應。"
        },
        {
            category: "坪林地理",
            question: "從臺北市區前往坪林，主要經由哪條高速公路最為便捷？",
            options: ["國道一號（中山高速公路）", "國道三號（福爾摩沙高速公路）", "國道五號（北宜高速公路）", "國道二號"],
            correct: 2,
            explanation: "國道五號（北宜高速公路）設有坪林交流道，是臺北前往坪林最便捷的路線。經雪山隧道方向行駛，於坪林交流道下即可抵達。車程約 30 到 40 分鐘。"
        },
        {
            category: "坪林生態",
            question: "坪林北勢溪的護魚政策主要保護的溪流魚種包括以下哪一種？",
            options: ["鮭魚", "苦花（臺灣鯝魚）", "鯉魚", "吳郭魚"],
            correct: 1,
            explanation: "坪林北勢溪護魚政策主要保護原生溪流魚種，其中最具代表性的是苦花（臺灣鯝魚），又稱「水中螢火蟲」，因其銀色鱗片在水中閃爍而得名。護魚有成後，溪中苦花群游的景象成為坪林的生態名片。"
        },
        {
            category: "坪林生態",
            question: "坪林地區賞螢火蟲的最佳時期大約在每年什麼時候？",
            options: ["1 月至 2 月", "4 月中旬至 5 月中旬", "8 月至 9 月", "11 月至 12 月"],
            correct: 1,
            explanation: "坪林地區的螢火蟲（以黑翅螢為主）在每年 4 月中旬至 5 月中旬數量最多、最易觀察。此時氣溫回暖且濕度適宜，是螢火蟲繁殖的高峰期。"
        },
        {
            category: "坪林生態",
            question: "坪林之所以能維持良好的螢火蟲棲地，最主要的原因是什麼？",
            options: ["大量人工放養螢火蟲", "水源保護區嚴格限制開發、減少光害與農藥汙染", "引進外來螢火蟲品種", "全區禁止居民種茶"],
            correct: 1,
            explanation: "坪林作為翡翠水庫水源保護區，嚴格限制開發與汙染排放，加上當地茶農逐步轉向有機或友善耕作，減少了農藥與光害，為螢火蟲提供了乾淨、低干擾的自然棲地。"
        },
        {
            category: "坪林文化",
            question: "坪林老街的信仰中心「保坪宮」主要奉祀的神明是？",
            options: ["媽祖", "玄天上帝（帝爺公）", "關聖帝君", "土地公"],
            correct: 1,
            explanation: "保坪宮主祀玄天上帝（俗稱帝爺公），是坪林地區最重要的信仰中心。廟宇創建於清嘉慶年間，歷史悠久，至今仍是老街居民的精神寄託與節慶活動的核心場所。"
        },
        {
            category: "坪林文化",
            question: "坪林每年舉辦的大型茶產業活動，通常以什麼名稱為人所知？",
            options: ["坪林春茶嘉年華", "坪林包種茶節", "北臺灣茶業博覽會", "文山茶王大賽"],
            correct: 1,
            explanation: "坪林包種茶節是當地每年最重要的茶產業推廣活動，通常在春茶採製季節舉辦，結合製茶比賽、品茗體驗、茶園導覽與在地美食市集，吸引大量愛茶人士前來。"
        },
        {
            category: "茶葉知識",
            question: "「一心二葉」是製作優質包種茶的標準採摘方式，「一心二葉」指的是什麼？",
            options: ["一個茶園採兩次", "一個頂芽加上鄰近兩片嫩葉", "一種茶樹搭配兩種肥料", "一天只在兩個時段採茶"],
            correct: 1,
            explanation: "「一心二葉」是指採摘茶樹枝梢最頂端的一個未展開嫩芽（心芽）與緊鄰的兩片已展開嫩葉。這是製作高品質包種茶的標準採摘方式，嫩芽含有豐富的茶胺酸，決定了茶湯的甘甜。"
        },
        {
            category: "坪林地理",
            question: "金瓜寮魚蕨步道之所以得名，與沿途哪一類植物特別豐富有關？",
            options: ["櫻花", "蕨類植物", "油桐樹", "竹林"],
            correct: 1,
            explanation: "金瓜寮魚蕨步道因沿途蕨類植物種類極為豐富多樣而得名。步道位於溪谷中，濕度高、光線適宜，提供了蕨類生長的理想環境，沿途可見筆筒樹、腎蕨、鳥巢蕨等多種蕨類。"
        }
    ];

    // Fisher-Yates 洗牌演算法
    const shuffleArray = (array) => {
        const shuffled = [...array];

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled;
    };

    // 渲染當前問題
    const renderQuestion = () => {
        quizState.answered = false;
        const q = quizState.questions[quizState.currentIndex];
        const progress = (quizState.currentIndex / quizState.totalQuestions) * 100;

        quizArea.innerHTML = `
            <div class="quiz-header-row">
                <span class="quiz-progress-info">第 ${quizState.currentIndex + 1} / ${quizState.totalQuestions} 題</span>
                <div class="quiz-bar-container" aria-hidden="true">
                    <div class="quiz-bar-fill" style="width: ${progress}%"></div>
                </div>
                <div class="quiz-score-badge">得分：${quizState.score}</div>
            </div>

            <div class="quiz-meta-badge">${q.category}</div>
            <h2 class="quiz-question-text">${q.question}</h2>

            <div class="quiz-options-list" id="opt-container"></div>
            <div id="explain-container"></div>
            <div class="quiz-action-bar" id="action-container"></div>
        `;

        const optContainer = document.getElementById("opt-container");

        q.options.forEach((optText, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quiz-opt-btn";
            btn.textContent = optText;
            btn.addEventListener("click", () => handleSelectAnswer(index, btn));
            optContainer.appendChild(btn);
        });
    };

    // 處理選項點擊
    const handleSelectAnswer = (selectedIndex, selectedBtn) => {
        if (quizState.answered) {
            return;
        }

        quizState.answered = true;
        const q = quizState.questions[quizState.currentIndex];
        const isCorrect = selectedIndex === q.correct;

        if (isCorrect) {
            quizState.correctCount += 1;
            quizState.score += 20;
            // 更新計分徽章
            document.querySelector(".quiz-score-badge").textContent = `得分：${quizState.score}`;
        }

        // 標記所有按鈕狀態
        const buttons = Array.from(document.querySelectorAll(".quiz-opt-btn"));
        buttons.forEach((btn, index) => {
            btn.disabled = true;

            if (index === q.correct) {
                btn.classList.add("is-correct-ans");
            } else if (index === selectedIndex && !isCorrect) {
                btn.classList.add("is-wrong-ans");
            }
        });

        // 顯示解析
        const explainContainer = document.getElementById("explain-container");
        const explainCard = document.createElement("div");
        explainCard.className = `quiz-explain-card ${isCorrect ? "correct-feedback" : "wrong-feedback"}`;
        explainCard.innerHTML = `
            <strong>${isCorrect ? "✓ 答對了！非常優秀" : "✗ 答錯了！別氣餒"}</strong>
            <p style="margin:0;">${q.explanation}</p>
        `;
        explainContainer.appendChild(explainCard);

        // 新增下一步按鈕
        const actionContainer = document.getElementById("action-container");
        const isLast = quizState.currentIndex === quizState.totalQuestions - 1;
        const nextBtn = document.createElement("button");
        nextBtn.type = "button";
        nextBtn.className = "quiz-next-action-btn";
        nextBtn.textContent = isLast ? "查看挑戰結果" : "進入下一題 →";
        nextBtn.addEventListener("click", () => {
            if (isLast) {
                renderResult();
            } else {
                quizState.currentIndex += 1;
                renderQuestion();
            }
        });
        actionContainer.appendChild(nextBtn);
    };

    // 渲染最終結果與精美推薦
    const renderResult = () => {
        // 更新進度條至 100%
        document.querySelector(".quiz-bar-fill").style.width = "100%";

        let gradeTitle = "";
        let gradeDesc = "";
        let recTitle = "";
        let recDesc = "";

        if (quizState.correctCount === 5) {
            gradeTitle = "🏆 極緻茶鄉大師 🏆";
            gradeDesc = "您的專注與知識涵養令人驚嘆！您對坪林的茶葉工藝、地理水文與生態環境有著極為深度的理解，是真正的大師！";
            recTitle = "🎯 專屬於您的「深度大師級」坪林探索建議";
            recDesc = "推薦您立刻前往「坪林茶業博物館」參觀最前沿的當代特展，隨後漫步至老街的在地有機茶行，與製茶師圍坐品飲頭春包種茶，並租輛單車前往「金瓜寮魚蕨步道」探尋蕨類奇境，來場兼具學術美感與自然芬多精的高端之旅！";
        } else if (quizState.correctCount >= 3) {
            gradeTitle = "🌿 茶鄉慢活旅人 🌿";
            gradeDesc = "非常棒！您對坪林已經有了相當不錯的認識，能精確掌握包種茶與在地環境的和諧關係。";
            recTitle = "👣 專屬於您的「慢旅行人」坪林散策建議";
            recDesc = "建議您規劃一趟經典的一日茶鄉慢旅行：中午在「坪林老街」享用特色茶便當與豆腐冰淇淋，午後在「觀魚步道」聽潺潺溪水、觀看銀亮苦花魚群游，最後挑選一家「溪畔景觀咖啡廳」，點杯香醇的包種茶歐蕾，享受慢步調的時光。";
        } else {
            gradeTitle = "🍵 茶鄉探索新朋友 🍵";
            gradeDesc = "歡迎加入茶鄉的探索行列！坪林是一座擁有無盡寶藏的優雅山城，這正是您開啟奇妙旅程的最佳起點。";
            recTitle = "📍 專屬於您的「初訪探索」入門旅行建議";
            recDesc = "建議您的第一站首選「坪林茶業博物館」，在閩南式四合院中透過多媒體互動，用五感輕鬆認識文山包種茶的由來；隨後跨過「坪林親水吊橋」感受清涼山風，在老街喝杯在地茶師為您沖泡的溫潤茶湯，親身感受坪林的人情溫度。";
        }

        quizArea.innerHTML = `
            <div class="quiz-result-view">
                <p class="quiz-progress-info" style="margin-bottom:0.5rem;">問答挑戰完成</p>
                <div class="quiz-grade-score">${quizState.score} 分</div>
                <div class="quiz-result-tag">${gradeTitle}</div>
                
                <p class="quiz-result-intro">
                    在本次茶學與生態知識問答中，您一共答對了 <strong>${quizState.correctCount}</strong> 題（共 ${quizState.totalQuestions} 題）。${gradeDesc}
                </p>

                <div class="quiz-result-recommendation">
                    <strong>${recTitle}</strong>
                    <p>${recDesc}</p>
                </div>

                <div class="quiz-result-actions">
                    <button type="button" class="button button--primary" id="btn-restart-quiz">
                        🍵 重新挑戰
                    </button>
                    <a href="./index.html" class="button button--secondary" style="text-decoration:none; display:inline-flex; align-items:center; justify-content:center;">
                        返回首頁
                    </a>
                </div>
            </div>
        `;

        document.getElementById("btn-restart-quiz").addEventListener("click", initQuiz);
    };

    // 初始化挑戰
    const initQuiz = () => {
        const shuffled = shuffleArray(teaQuizBank);
        quizState.questions = shuffled.slice(0, quizState.totalQuestions);
        quizState.currentIndex = 0;
        quizState.correctCount = 0;
        quizState.score = 0;
        quizState.answered = false;

        renderQuestion();
    };

    // 啟動問答
    initQuiz();
})();
