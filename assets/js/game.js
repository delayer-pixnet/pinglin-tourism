(() => {
    const gameStage = document.getElementById("game-stage");

    if (!gameStage) {
        return;
    }

    const startButton = document.getElementById("start-game");
    const restartButton = document.getElementById("restart-game");
    const timeValue = document.getElementById("time-value");
    const scoreValue = document.getElementById("score-value");
    const catchValue = document.getElementById("catch-value");
    const message = document.getElementById("game-message");

    // 遊戲狀態集中放在同一個物件，方便後續增加難度或新規則。
    const gameState = {
        duration: 25,
        score: 0,
        catches: 0,
        timeLeft: 25,
        timerId: null,
        spawnId: null,
        isRunning: false,
        activeFireflies: new Map()
    };

    // 依最終分數區間顯示不同結語，讓遊戲結果更有回饋感。
    const resultMessages = [
        {
            minScore: 220,
            title: "✨ 極致螢光守護者 ✨",
            description: "您的專注與敏銳，就如同黑夜中躍動的流螢般耀眼！最適合您的坪林夜間行程是：傍晚 18:30 前往「水柳腳步道」高處遠眺山城點點燈火，隨後漫步至「觀魚步道」與螢火精靈共舞。請記得保持溫柔的腳步，享受這場由星空與綠螢共織的夢幻交響樂！"
        },
        {
            minScore: 120,
            title: "🌿 溪畔尋光旅人 🌿",
            description: "您的節奏掌握得恰到好處，與螢火蟲有著奇妙的默契！建議您在黃昏時分，先在「坪林親水吊橋」旁享受沁涼的山風，等夜幕完全低垂後，再沿著「北勢溪沿岸」安靜漫步，細細品味微光在草叢間起伏的悠閒，這將會是您最療癒的夏夜回憶。"
        },
        {
            minScore: 0,
            title: "👣 夜色初訪探索者 👣",
            description: "歡迎踏入這片寧靜的夜光森林！別心急，這正是學會放慢腳步的起點。建議您白天空出時間，先造訪「坪林茶業博物館」深入茶香底蘊，傍晚在老街品茶，讓身心徹底慢下來。當夜幕升起，再溫柔地走進溪畔，您將會更容易發現樹梢間的溫暖微光。"
        }
    ];

    // 每次狀態變化後同步更新畫面數值。
    const updateStats = () => {
        timeValue.textContent = String(gameState.timeLeft);
        scoreValue.textContent = String(gameState.score);
        catchValue.textContent = String(gameState.catches);
    };

    const setMessage = (text) => {
        message.textContent = text;
    };

    // 開始挑戰時觸發一次暖光脈衝，建立明確的遊戲轉場感。
    const pulseStage = () => {
        gameStage.classList.remove("is-starting");
        void gameStage.offsetWidth;
        gameStage.classList.add("is-starting");

        window.setTimeout(() => {
            gameStage.classList.remove("is-starting");
        }, 820);
    };

    // 清空遊戲舞台並一併移除尚未消失的螢火蟲與計時器。
    const clearStage = () => {
        gameState.activeFireflies.forEach(({ timeoutId, element }) => {
            window.clearTimeout(timeoutId);
            element.remove();
        });

        gameState.activeFireflies.clear();
        gameStage.innerHTML = "";
    };

    // 在舞台中央顯示提示或結果，避免空白區域缺乏引導。
    const renderStageHint = (title, description, className) => {
        const hint = document.createElement("div");
        hint.className = className;
        hint.innerHTML = `
            <div>
                <strong>${title}</strong>
                <p>${description}</p>
            </div>
        `;
        gameStage.append(hint);
    };

    const getStageBounds = () => {
        const { width, height } = gameStage.getBoundingClientRect();

        return {
            width: Math.max(width, 220),
            height: Math.max(height, 320)
        };
    };

    const removeFirefly = (id) => {
        const entry = gameState.activeFireflies.get(id);

        if (!entry) {
            return;
        }

        window.clearTimeout(entry.timeoutId);
        entry.element.remove();
        gameState.activeFireflies.delete(id);
    };

    const catchFirefly = (id) => {
        const entry = gameState.activeFireflies.get(id);

        if (!entry || !gameState.isRunning) {
            return;
        }

        gameState.score += 10;
        gameState.catches += 1;
        updateStats();
        setMessage("你成功收集了一隻螢火蟲，繼續保持節奏。");

        entry.element.classList.add("is-caught");

        window.setTimeout(() => {
            removeFirefly(id);
        }, 220);
    };

    // 生成可點擊的螢火蟲，位置會限制在舞台安全邊界內。
    const spawnFirefly = () => {
        if (!gameState.isRunning) {
            return;
        }

        const bounds = getStageBounds();
        const firefly = document.createElement("button");
        const id = `firefly-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const safePadding = 34;
        const left = safePadding + Math.random() * Math.max(bounds.width - safePadding * 2, 1);
        const top = safePadding + Math.random() * Math.max(bounds.height - safePadding * 2, 1);

        firefly.type = "button";
        firefly.className = "firefly";
        firefly.setAttribute("aria-label", "點擊收集螢火蟲");
        firefly.style.left = `${left}px`;
        firefly.style.top = `${top}px`;
        firefly.addEventListener("click", () => catchFirefly(id));

        gameStage.append(firefly);

        const timeoutId = window.setTimeout(() => {
            removeFirefly(id);
        }, 1250);

        gameState.activeFireflies.set(id, {
            element: firefly,
            timeoutId
        });
    };

    // 結束遊戲後停止所有排程，並顯示本次結果摘要與問答入口。
    const stopGame = () => {
        gameState.isRunning = false;
        window.clearInterval(gameState.timerId);
        window.clearInterval(gameState.spawnId);
        gameState.timerId = null;
        gameState.spawnId = null;

        const result = resultMessages.find((item) => gameState.score >= item.minScore) || resultMessages[resultMessages.length - 1];

        clearStage();

        // 建立含問答入口按鈕的結果畫面
        const resultDiv = document.createElement("div");
        resultDiv.className = "game-stage__result";
        resultDiv.innerHTML = `
            <div>
                <strong>${result.title}</strong>
                <p style="margin-bottom: 1.25rem;">${result.description} 本次得分 ${gameState.score} 分，共收集 ${gameState.catches} 隻。</p>
                <a href="./quiz.html" class="quiz-start-btn" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; color: #fff; font-weight: 700; background: linear-gradient(135deg, rgba(36, 83, 58, 0.95), rgba(95, 151, 170, 0.75)); padding: 0.85rem 1.6rem; border-radius: 999px; border: 1.5px solid rgba(247, 213, 141, 0.3); transition: all 260ms ease;">🍵 挑戰茶學問答 →</a>
            </div>
        `;

        gameStage.append(resultDiv);

        setMessage(`挑戰結束，你獲得 ${gameState.score} 分。試試挑戰茶學問答吧！`);
        startButton.disabled = true;
        restartButton.disabled = false;
    };

    const tick = () => {
        gameState.timeLeft -= 1;
        updateStats();

        if (gameState.timeLeft <= 0) {
            stopGame();
        }
    };

    // 開始挑戰時重設分數、時間與舞台狀態。
    const startGame = () => {
        clearStage();
        gameState.score = 0;
        gameState.catches = 0;
        gameState.timeLeft = gameState.duration;
        gameState.isRunning = true;
        updateStats();
        setMessage("夜色降臨，開始收集螢火蟲。");
        pulseStage();
        startButton.disabled = true;
        restartButton.disabled = false;

        gameState.timerId = window.setInterval(tick, 1000);
        gameState.spawnId = window.setInterval(spawnFirefly, 650);
        spawnFirefly();
    };

    // 重新開始按鈕會先回到待機狀態，再讓玩家重新啟動挑戰。
    const resetGame = () => {
        window.clearInterval(gameState.timerId);
        window.clearInterval(gameState.spawnId);
        gameState.timerId = null;
        gameState.spawnId = null;
        gameState.isRunning = false;
        gameState.score = 0;
        gameState.catches = 0;
        gameState.timeLeft = gameState.duration;
        updateStats();
        clearStage();
        renderStageHint("等待挑戰開始", "按下左側的開始挑戰，觀察夜色裡浮動的螢光。", "game-stage__hint");
        setMessage("按下開始挑戰，在坪林夜色裡收集螢火蟲。");
        startButton.disabled = false;
        restartButton.disabled = true;
    };

    startButton.addEventListener("click", startGame);
    restartButton.addEventListener("click", resetGame);

    resetGame();
})();