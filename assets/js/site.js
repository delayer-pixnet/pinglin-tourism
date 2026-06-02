(() => {
    // 共用常數：所有頁面的免責聲明與導覽項目都集中管理。
    const disclaimerText = "本網站僅為個人網頁程式開發練習用，非坪林區官方網站。";
    const navItems = [
        { key: "home", label: "首頁", href: "./index.html", type: "link" },
        { key: "game", label: "賞螢遊戲", href: "./game.html", type: "link" },
        { key: "quiz", label: "茶學問答", href: "./quiz.html", type: "link" },
        { key: "tea", label: "茶業文化", href: "./tea.html", type: "link" },
        { key: "cafes", label: "在地咖啡廳", href: "./cafes.html", type: "link" },
        { key: "tung-blossom", label: "油桐花賞景", href: "./tung-blossom.html", type: "link" },
        { key: "transport", label: "交通指南", href: "./transport.html", type: "link" }
    ];

    const pageKey = document.body.dataset.page || "";

    // 重新渲染橫幅內容，確保所有頁面顯示相同文案格式。
    const renderDisclaimerBanner = () => {
        const banner = document.querySelector("[data-disclaimer-banner]");

        if (!banner) {
            return;
        }

        banner.innerHTML = `
            <div class="notice-banner__inner">
                <span class="notice-banner__pill">Notice</span>
                <span>${disclaimerText}</span>
            </div>
        `;
    };

    // 依導覽項目型別產生連結或敬請期待標籤。
    const createNavItemMarkup = (item) => {
        if (item.type === "coming") {
            return `
                <li>
                    <span class="nav-pill" aria-disabled="true">
                        <span>${item.label}</span>
                        <span class="nav-pill__status">${item.status}</span>
                    </span>
                </li>
            `;
        }

        const activeClass = item.key === pageKey ? "is-active" : "";

        return `
            <li>
                <a class="nav-link ${activeClass}" href="${item.href}">${item.label}</a>
            </li>
        `;
    };

    // Header 由腳本建立，可避免每個 HTML 手動同步導覽列內容。
    const renderHeader = () => {
        const header = document.querySelector("[data-site-header]");

        if (!header) {
            return;
        }

        header.innerHTML = `
            <a class="brand" href="./index.html" aria-label="返回新北坪林區觀光首頁">
                <span class="brand__mark" aria-hidden="true">坪</span>
                <span>
                    <strong class="brand__name">新北坪林區觀光</strong>
                    <span class="brand__sub">茶鄉散策與季節旅行導覽</span>
                </span>
            </a>
            <nav class="site-nav" aria-label="主要導覽">
                <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav-list">
                    選單
                </button>
                <ul id="site-nav-list" class="nav-list">
                    ${navItems.map(createNavItemMarkup).join("")}
                </ul>
            </nav>
        `;

        const siteNav = header.querySelector(".site-nav");
        const navToggle = header.querySelector(".nav-toggle");

        if (!siteNav || !navToggle) {
            return;
        }

        // 行動版選單只切換單一 class，保持邏輯容易維護。
        navToggle.addEventListener("click", () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!expanded));
            siteNav.classList.toggle("is-open", !expanded);
        });
    };

    // Footer 補齊專案說明、頁尾導覽與免責聲明。
    const renderFooter = () => {
        const footer = document.querySelector("[data-site-footer]");

        if (!footer) {
            return;
        }

        footer.innerHTML = `
            <div class="footer-card">
                <div class="footer-card__top">
                    <div>
                        <p class="section-label">Explore Pinglin</p>
                        <h2>以茶鄉山水串起更完整的坪林散策</h2>
                    </div>
                    <p class="footer-card__meta">© <span data-year></span> Pinglin Tea Valley Guide</p>
                </div>
                <p>
                    目前已整合茶文化、老街、步道、交通、季節景點與互動遊戲，讓初訪者更快掌握坪林的旅行節奏。
                </p>
                <div class="footer-card__links">
                    <a href="./index.html">首頁</a>
                    <a href="./tea.html">茶業文化</a>
                    <a href="./cafes.html">在地咖啡廳</a>
                    <a href="./tung-blossom.html">油桐花賞景</a>
                    <a href="./transport.html">交通指南</a>
                    <a href="./game.html">賞螢遊戲</a>
                    <a href="./quiz.html">茶學問答</a>
                </div>
                <div class="footer-card__disclaimer">${disclaimerText}</div>
            </div>
        `;

        const yearTarget = footer.querySelector("[data-year]");

        if (yearTarget) {
            yearTarget.textContent = String(new Date().getFullYear());
        }
    };

    // 依捲動深度切換導覽列層次，提升頂部導覽的可讀性。
    const initHeaderScrollState = () => {
        const header = document.querySelector(".site-header");

        if (!header) {
            return;
        }

        const updateHeaderState = () => {
            header.classList.toggle("is-scrolled", window.scrollY > 16);
        };

        updateHeaderState();
        window.addEventListener("scroll", updateHeaderState, { passive: true });
    };

    // 使用 IntersectionObserver 做區塊浮現，避免高頻 scroll 監聽造成效能負擔。
    const initScrollReveal = () => {
        if (!("IntersectionObserver" in window)) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const candidates = Array.from(
            document.querySelectorAll(
                ".section, .photo-frame, .feature-card, .content-card, .attraction-card, .route-step, .guide-card, .cafe-card, .story-panel__card, .page-hero__rule-card"
            )
        );

        const targets = candidates.filter((element) => !element.classList.contains("reveal-on-load") && !element.classList.contains("is-visible"));

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        targets.forEach((element, index) => {
            element.setAttribute("data-reveal", "");
            element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;

            const top = element.getBoundingClientRect().top;

            if (top < window.innerHeight * 0.85) {
                element.classList.add("is-visible");
                return;
            }

            revealObserver.observe(element);
        });
    };

    // 首頁季節切換：讓 Hero 可在春茶、夏溪、夜螢之間切換主題語氣與視覺氛圍。
    const initHomeSeasonSwitch = () => {
        if (pageKey !== "home") {
            return;
        }

        const hero = document.querySelector(".hero[data-season]");
        const switchContainer = document.querySelector("[data-season-switch]");

        if (!hero || !switchContainer) {
            return;
        }

        const titleTarget = hero.querySelector("[data-season-title]");
        const leadTarget = hero.querySelector("[data-season-lead]");
        const noteTarget = switchContainer.querySelector("[data-season-note]");
        const chips = Array.from(switchContainer.querySelectorAll("[data-season-value]"));
        const themeMeta = document.querySelector('meta[name="theme-color"]');

        const seasonConfig = {
            spring: {
                title: "山城清芬，歲月靜好",
                lead:
                    "漫步於雲霧繚繞的綠意茶園，深吸一口屬於坪林的包種茶香。文山包種茶的製茶脈絡、坪林老街的溫潤街屋，以及北勢溪沿岸的慢活散步步調，共同交織出山城最靜好的時光。讓我們在春日出發，探尋茶香的發源地，重新尋回內心的平靜與從容。",
                note: "春季以茶園與製茶文化為主軸，適合安排茶業博物館與老街的茶香散策之旅。",
                themeColor: "#2f6748",
                particleColor: ["rgba(145, 184, 109, 0.68)", "rgba(90, 150, 110, 0.52)", "rgba(220, 235, 180, 0.58)"]
            },
            summer: {
                title: "沿溪納涼，慢步聽水",
                lead:
                    "炎炎夏日，最愜意的避暑方式莫過於將步調交給坪林的碧綠清溪。漫步於觀魚步道，聽北勢溪潺潺溪水在耳畔低語，吹著山谷間的徐徐涼風。午後坐進充滿文青氣息的在地茶咖啡廳，享受一杯包種茶歐蕾，讓身心浸潤在這一片令人屏息的翠綠之中。",
                note: "夏溪主題偏向親水與慢散步，最適合規劃觀魚步道、老街茶館與溪畔咖啡廳的涼爽避暑行程。",
                themeColor: "#4f8097",
                particleColor: ["rgba(95, 151, 170, 0.65)", "rgba(180, 220, 235, 0.55)", "rgba(255, 255, 255, 0.48)"]
            },
            firefly: {
                title: "夜色追光，感受生態",
                lead:
                    "當傍晚的微光沒入深谷，坪林的奇幻時刻才真正展開。每年四、五月間的夏夜，無數發光的綠色精靈在北勢溪畔優雅起舞，宛如地上的繁星，與靜謐的溪流交相輝映。這是一場大自然最唯美的生態樂章，等待您以安靜、溫柔的步伐前來探尋。",
                note: "夜螢主題著重黃昏到夜間的奇幻賞螢體驗，請攜帶紅色玻璃紙手電筒，並遵循不打擾棲地的原則。",
                themeColor: "#6c6b44",
                particleColor: ["rgba(247, 213, 141, 0.85)", "rgba(180, 225, 90, 0.72)", "rgba(255, 240, 180, 0.68)"]
            }
        };

        // 動態生成季節專屬粒子
        const renderParticles = (colors) => {
            let container = hero.querySelector(".season-particles-container");
            if (!container) {
                container = document.createElement("div");
                container.className = "season-particles-container";
                hero.appendChild(container);
            }
            container.innerHTML = ""; // 清空舊粒子

            const particleCount = 20;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement("div");
                particle.className = "season-particle";
                
                // 隨機屬性
                const size = Math.random() * 8 + 4; // 4px 到 12px
                const left = Math.random() * 100; // 0% 到 100%
                const delay = Math.random() * -8; // 負延遲使粒子立即分布
                const duration = Math.random() * 6 + 6; // 6s 到 12s
                const driftX = (Math.random() * 80) - 40; // -40px 到 40px
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${left}%`;
                particle.style.background = color;
                particle.style.setProperty("--drift-duration", `${duration}s`);
                particle.style.setProperty("--drift-x", `${driftX}px`);
                particle.style.setProperty("--max-opacity", color.match(/[\d\.]+(?=\))/)[0]);
                particle.style.animationDelay = `${delay}s`;
                
                if (themeMeta.getAttribute("content") === "#6c6b44") {
                    // 螢火蟲呼吸閃爍效果
                    particle.style.boxShadow = `0 0 12px ${color}`;
                }

                container.appendChild(particle);
            }
        };

        const applySeason = (seasonKey) => {
            const config = seasonConfig[seasonKey];

            if (!config) {
                return;
            }

            hero.dataset.season = seasonKey;

            if (titleTarget) {
                titleTarget.textContent = config.title;
            }

            if (leadTarget) {
                leadTarget.textContent = config.lead;
            }

            if (noteTarget) {
                noteTarget.textContent = config.note;
            }

            if (themeMeta) {
                themeMeta.setAttribute("content", config.themeColor);
            }

            chips.forEach((chip) => {
                const active = chip.getAttribute("data-season-value") === seasonKey;
                chip.classList.toggle("is-active", active);
                chip.setAttribute("aria-pressed", String(active));
            });

            // 渲染粒子
            renderParticles(config.particleColor);
        };

        chips.forEach((chip) => {
            chip.addEventListener("click", () => {
                const seasonKey = chip.getAttribute("data-season-value") || "spring";
                applySeason(seasonKey);
            });
        });

        applySeason(hero.dataset.season || "spring");
    };

    // 初始化所有共用區塊。
    renderDisclaimerBanner();
    renderHeader();
    renderFooter();
    initHeaderScrollState();
    initScrollReveal();
    initHomeSeasonSwitch();
})();