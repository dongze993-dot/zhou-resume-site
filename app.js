const tracks = {
  all: {
    label: "综合能力",
    description: "跨岗位呈现：规则拆解、履约理解、工程表达与 AI 工作流迭代。",
  },
  management: {
    label: "管培 / 项目运营",
    description: "优先展示目标拆解、质量把控、任务推进、复盘意识与结构化表达。",
  },
  supply: {
    label: "采购 / 供应链",
    description: "优先展示订单履约、交付节点、基础业务数据、工程逻辑与流程协同意识。",
  },
  trade: {
    label: "外贸 / 跨境支持",
    description: "优先展示贸易现场、出货准备、订单履约、英文基础与跨境业务支持潜力。",
  },
  operations: {
    label: "业务 / 电商运营",
    description: "优先展示商品销量汇总、利润讨论、履约流程、沟通质量与业务规则意识。",
  },
  engineering: {
    label: "工科技术",
    description: "优先展示建模、数据分析、规范出图、技术报告与项目资料表达能力。",
  },
  ai: {
    label: "AI 应用",
    description: "优先展示工作流规则设计、AI 输出质检、问题反馈、看板需求与人工确认机制。",
  },
};

const allTrackButtons = [...document.querySelectorAll(".track-button")];
const directionButtons = [...document.querySelectorAll("[data-set-track]")];
const focusReadout = document.querySelector("#focus-readout");
const capabilityCards = [...document.querySelectorAll(".capability-card")];
const evidenceItems = [...document.querySelectorAll(".evidence-item")];

function hasTrack(element, track) {
  if (track === "all") return true;
  return (element.dataset.tracks || "").split(",").includes(track);
}

function setTrack(track, shouldScroll = false) {
  const configuration = tracks[track] || tracks.all;
  allTrackButtons.forEach((button) => {
    const active = button.dataset.track === track;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  directionButtons.forEach((button) => {
    const active = button.dataset.setTrack === track;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  focusReadout.querySelector("strong").textContent = configuration.label;
  focusReadout.querySelector("p").textContent = configuration.description;

  capabilityCards.forEach((card) => {
    const match = hasTrack(card, track);
    card.classList.toggle("is-muted", !match);
    card.classList.toggle("is-emphasis", match && track !== "all");
  });
  evidenceItems.forEach((item) => {
    const match = hasTrack(item, track);
    item.classList.toggle("is-muted", !match);
    item.classList.toggle("is-emphasis", match && track !== "all");
  });

  if (shouldScroll) {
    document.querySelector("#capabilities").scrollIntoView({
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      block: "start",
    });
  }
}

allTrackButtons.forEach((button) => {
  button.addEventListener("click", () => setTrack(button.dataset.track));
});

directionButtons.forEach((button) => {
  button.addEventListener("click", () => setTrack(button.dataset.setTrack, true));
});

document.querySelectorAll("[data-jump]").forEach((button) => {
  button.addEventListener("click", () => {
    const destination = document.getElementById(button.dataset.jump);
    if (!destination) return;
    destination.classList.add("is-emphasis");
    destination.scrollIntoView({
      behavior: reducedMotionQuery.matches ? "auto" : "smooth",
      block: "center",
    });
    window.setTimeout(() => destination.classList.remove("is-emphasis"), 1300);
  });
});

document.querySelector("[data-print]").addEventListener("click", () => window.print());

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const sceneSections = [...document.querySelectorAll("[data-scene]")];

function updateSceneFocus() {
  const viewportHeight = Math.max(window.innerHeight, 1);
  sceneSections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const leaveProgress = reducedMotionQuery.matches
      ? 0
      : Math.min(1, Math.max(0, -rect.top / Math.max(rect.height * 0.78, 1)));
    const isVisible = rect.bottom > 0 && rect.top < viewportHeight;
    section.style.setProperty("--scene-blur", `${Math.round(leaveProgress * 12)}px`);
    section.style.setProperty("--scene-scale", (1 + leaveProgress * 0.055).toFixed(3));
    section.style.setProperty("--scene-y", `${Math.round(-leaveProgress * 15)}px`);
    section.classList.toggle("is-scene-visible", isVisible);
  });
}

let sceneFrame = null;
function requestSceneFocusUpdate() {
  if (sceneFrame !== null) return;
  sceneFrame = window.requestAnimationFrame(() => {
    sceneFrame = null;
    updateSceneFocus();
  });
}

updateSceneFocus();
window.addEventListener("scroll", requestSceneFocusUpdate, { passive: true });
window.addEventListener("resize", requestSceneFocusUpdate);
reducedMotionQuery.addEventListener?.("change", requestSceneFocusUpdate);

const revealTargets = [...document.querySelectorAll("[data-reveal]")];

function revealAllTargets() {
  document.documentElement.classList.remove("motion-ready");
  revealTargets.forEach((target) => target.classList.add("is-revealed"));
}

function setupRevealMotion() {
  if (reducedMotionQuery.matches || !("IntersectionObserver" in window) || !revealTargets.length) {
    revealAllTargets();
    return;
  }

  document.documentElement.classList.add("motion-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
  );

  revealTargets.forEach((target) => observer.observe(target));
}

setupRevealMotion();
reducedMotionQuery.addEventListener?.("change", (event) => {
  if (event.matches) revealAllTargets();
});

const titleTargets = [
  ...document.querySelectorAll(
    ".hero h1, .focus-heading h2, .direction-heading h2, .evidence-heading h2, .skills-heading h2, .growth-heading h2, .contact-section h2",
  ),
];

titleTargets.forEach((title) => {
  title.classList.add("title-glow");
  title.addEventListener("pointerenter", () => title.classList.add("is-title-active"));
  title.addEventListener("pointerleave", () => title.classList.remove("is-title-active"));
});

const surfaceTargets = [
  ...document.querySelectorAll(
    ".hero-panel, .capability-card, .direction-card, .evidence-item, .skills-table-wrap, .growth-key, .growth-timeline li, .contact-section",
  ),
];

function bindPointerLight(target, kind = "surface") {
  let frame = null;
  let latestEvent = null;

  target.addEventListener("pointermove", (event) => {
    if (reducedMotionQuery.matches || event.pointerType === "touch") return;
    latestEvent = event;
    if (frame !== null) return;

    frame = window.requestAnimationFrame(() => {
      frame = null;
      if (!latestEvent) return;
      const rect = target.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (latestEvent.clientX - rect.left) / Math.max(rect.width, 1)));
      const y = Math.min(1, Math.max(0, (latestEvent.clientY - rect.top) / Math.max(rect.height, 1)));

      target.classList.add("is-pointer-active");
      if (kind === "scene") {
        target.style.setProperty("--scene-pointer-x", `${((x - 0.5) * 7).toFixed(2)}px`);
        target.style.setProperty("--scene-pointer-y", `${((y - 0.5) * 5).toFixed(2)}px`);
      } else {
        target.style.setProperty("--pointer-x", `${(x * 100).toFixed(1)}%`);
        target.style.setProperty("--pointer-y", `${(y * 100).toFixed(1)}%`);
      }
    });
  });

  target.addEventListener("pointerleave", () => {
    latestEvent = null;
    target.classList.remove("is-pointer-active");
    if (kind === "scene") {
      target.style.setProperty("--scene-pointer-x", "0px");
      target.style.setProperty("--scene-pointer-y", "0px");
    }
  });
}

if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotionQuery.matches) {
  surfaceTargets.forEach((target) => {
    target.classList.add("pointer-surface");
    bindPointerLight(target);
  });
  sceneSections.forEach((scene) => {
    scene.classList.add("pointer-scene");
    bindPointerLight(scene, "scene");
  });
}

setTrack("all");
