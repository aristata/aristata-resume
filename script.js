(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* year-less footer is fine; reading progress */
  const progress = $(".read-progress span");
  const onScrollProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${pct}%`;
  };
  window.addEventListener("scroll", onScrollProgress, { passive: true });
  onScrollProgress();

  /* mobile nav */
  const toggle = $(".nav-toggle");
  const nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* active section nav */
  const sections = $$("main section[id]");
  const navLinks = $$('.nav a[href^="#"]');
  const setActiveNav = () => {
    const y = window.scrollY + 96;
    let current = sections[0]?.id;
    for (const s of sections) {
      if (s.offsetTop <= y) current = s.id;
    }
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* typed role */
  const typed = $("#typed-role");
  const roles = [
    "Backend Developer",
    "Project Leader",
    "Domain-friendly Engineer",
    "Vibe Coder · AI Pair",
  ];
  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const typeTick = () => {
    if (!typed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (typed) typed.textContent = roles[0];
      return;
    }
    const word = roles[roleIdx];
    if (!deleting) {
      charIdx += 1;
      typed.textContent = word.slice(0, charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(typeTick, 1600);
        return;
      }
    } else {
      charIdx -= 1;
      typed.textContent = word.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeTick, deleting ? 28 : 55);
  };
  typeTick();

  /* values */
  const values = [
    {
      quote: "“이왕 만드는 거, 잘 만들고 싶습니다.”",
      body: "작은 예외 처리, 로그, 네이밍, 배포 전 체크리스트까지. 티 나지 않는 디테일이 서비스의 신뢰가 된다고 믿습니다. 시드 코드와 공통 모듈을 먼저 다듬어 온 이유도 여기에 있습니다.",
    },
    {
      quote: "“인정과 피드백이 사람을 움직입니다.”",
      body: "잘한 일은 분명히 말해 주고, 부족한 점은 공격이 아니라 개선 포인트로 나누고 싶습니다. 팀에서 에너지를 주고받는 쪽을 선호합니다.",
    },
    {
      quote: "“같은 말도 전달 방식에 따라 결과가 달라집니다.”",
      body: "기술 이슈를 비개발 이해관계자에게 설명할 때, 맥락·선택지·리스크 순으로 정리하려 합니다. PL을 하면서 이 감각이 더 중요해졌습니다.",
    },
    {
      quote: "“긍정면 먼저, 부정면은 반면교사로.”",
      body: "장애나 실패를 만나도 ‘누가 잘못했나’보다 ‘다음에 어떻게 막나’를 먼저 봅니다. 회고는 짧게, 개선은 코드와 프로세스로 남깁니다.",
    },
    {
      quote: "“소신과 타협의 균형을 믿습니다.”",
      body: "혼자 완벽한 설계보다, 팀이 움직일 수 있는 타협점을 찾는 편이 실무에 가깝다고 생각합니다. 그래도 품질의 하한선은 지키려 합니다.",
    },
  ];

  const panel = $("#value-panel");
  const cards = $$(".value-card");
  const renderValue = (idx) => {
    const v = values[idx];
    if (!panel || !v) return;
    panel.innerHTML = `<p class="value-quote">${v.quote}</p><p>${v.body}</p>`;
    panel.style.animation = "none";
    // reflow for animation restart
    void panel.offsetWidth;
    panel.style.animation = "";
    cards.forEach((card, i) => {
      const on = i === idx;
      card.classList.toggle("is-open", on);
      card.setAttribute("aria-expanded", String(on));
      card.querySelector(".value-hint").textContent = on ? "선택됨" : "열기";
    });
  };
  cards.forEach((card) => {
    card.addEventListener("click", () => renderValue(Number(card.dataset.value)));
  });
  renderValue(0);

  /* experience + strengths accordion */
  const setAccordion = (item, open, bodySel, btnSel) => {
    const body = item.querySelector(bodySel);
    const btn = item.querySelector(btnSel);
    if (!body || !btn) return;
    item.classList.toggle("is-open", open);
    body.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.innerHTML = open
      ? '접기 <span aria-hidden="true">+</span>'
      : '자세히 <span aria-hidden="true">+</span>';
  };

  const setExp = (item, open) => setAccordion(item, open, ".exp-body", ".exp-toggle");
  const setWork = (item, open) => setAccordion(item, open, ".work-detail", ".work-toggle");

  $$("[data-exp]").forEach((item) => {
    item.querySelector(".exp-toggle")?.addEventListener("click", () => {
      setExp(item, !item.classList.contains("is-open"));
    });
  });

  $$("[data-work]").forEach((item) => {
    item.querySelector(".work-toggle")?.addEventListener("click", () => {
      setWork(item, !item.classList.contains("is-open"));
    });
  });

  const expandExp = () => $$("[data-exp]").forEach((item) => setExp(item, true));
  const collapseExp = () => $$("[data-exp]").forEach((item) => setExp(item, false));
  const expandWork = () => $$("[data-work]").forEach((item) => setWork(item, true));
  const collapseWork = () => $$("[data-work]").forEach((item) => setWork(item, false));
  const expandAll = () => {
    expandExp();
    expandWork();
  };
  const collapseAll = () => {
    collapseExp();
    collapseWork();
  };

  $("#expand-all")?.addEventListener("click", expandExp);
  $("#collapse-all")?.addEventListener("click", collapseExp);
  $("#expand-work")?.addEventListener("click", expandWork);
  $("#collapse-work")?.addEventListener("click", collapseWork);

  /* stack filter */
  const filters = $$(".stack-filters button");
  const stackItems = $$("#stack-list li");
  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.filter;
      filters.forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });
      stackItems.forEach((li) => {
        const show = key === "all" || li.dataset.cat === key;
        li.classList.toggle("is-hidden", !show);
      });
    });
  });

  /* help modal */
  const modal = $("#help-modal");
  const openHelp = () => {
    if (!modal) return;
    modal.hidden = false;
    modal.querySelector(".modal-close")?.focus();
  };
  const closeHelp = () => {
    if (!modal) return;
    modal.hidden = true;
  };
  $$("[data-open-help]").forEach((el) => el.addEventListener("click", openHelp));
  $$("[data-close-help]").forEach((el) => el.addEventListener("click", closeHelp));

  /* terminal */
  const termBody = $("#term-body");
  const termInput = $("#term-input");
  const appendTerm = (html) => {
    if (!termBody) return;
    const cursorLine = termBody.querySelector(".term-cursor")?.parentElement;
    const block = document.createElement("div");
    block.innerHTML = html;
    if (cursorLine) termBody.insertBefore(block, cursorLine);
    else termBody.appendChild(block);
    termBody.scrollTop = termBody.scrollHeight;
  };

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    appendTerm(`<p><span class="term-prompt">$</span> ${raw.replace(/</g, "&lt;")}</p>`);
    if (!cmd || cmd === "help") {
      appendTerm(
        `<p class="term-out">commands: help · whoami · stack · vibe · experience · clear · github</p>`
      );
    } else if (cmd === "whoami") {
      appendTerm(
        `<p class="term-out">jang.seongmin — backend developer · pl · isfj · vibe coder</p>`
      );
    } else if (cmd === "stack") {
      document.querySelector("#stack")?.scrollIntoView({ behavior: "smooth" });
      appendTerm(`<p class="term-out">jumped to #stack</p>`);
    } else if (cmd === "vibe") {
      document.querySelector("#vibe")?.scrollIntoView({ behavior: "smooth" });
      appendTerm(`<p class="term-out">ggbh trainer · obsidian×mcp fitness — see #vibe</p>`);
    } else if (cmd === "experience" || cmd === "exp") {
      document.querySelector("#experience")?.scrollIntoView({ behavior: "smooth" });
      appendTerm(`<p class="term-out">jumped to #experience</p>`);
    } else if (cmd === "github") {
      appendTerm(`<p class="term-out">https://github.com/aristata</p>`);
      window.open("https://github.com/aristata", "_blank", "noopener");
    } else if (cmd === "clear") {
      termBody.innerHTML = `<p><span class="term-prompt">$</span> <span class="term-cursor" aria-hidden="true"></span></p>`;
    } else {
      appendTerm(`<p class="term-out">command not found: ${cmd} — try help</p>`);
    }
  };

  termInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      runCommand(termInput.value);
      termInput.value = "";
    }
  });

  /* keyboard shortcuts */
  const sectionMap = {
    "1": "#person",
    "2": "#vibe",
    "3": "#experience",
    "4": "#work",
    "5": "#stack",
  };

  window.addEventListener("keydown", (e) => {
    const tag = (e.target && e.target.tagName) || "";
    const typing = tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable;

    if (e.key === "?" && !typing) {
      e.preventDefault();
      if (modal?.hidden === false) closeHelp();
      else openHelp();
      return;
    }
    if (e.key === "Escape") {
      closeHelp();
      return;
    }
    if (typing) return;

    if (e.key === "/") {
      e.preventDefault();
      termInput?.focus();
      document.querySelector(".hero-terminal")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (sectionMap[e.key]) {
      document.querySelector(sectionMap[e.key])?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (e.key.toLowerCase() === "e") expandAll();
    if (e.key.toLowerCase() === "c") collapseAll();
  });
})();
