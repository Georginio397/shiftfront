let parallaxPaused = false;
let performanceMode = false;

/**
 * 🔥 PERFORMANCE MODE (manual toggle)
 */
export function setPerformanceMode(enabled) {
  performanceMode = enabled;
  localStorage.setItem("performance_mode", enabled ? "1" : "0");

  document.body.classList.toggle("performance-mode", enabled);

  document.querySelectorAll("video").forEach(v => {
    const persistent = v.dataset.persistent === "true";
    const unloadable = v.dataset.unloadable === "true";

    if (enabled) {
      // ⛔ oprim TOT ce nu e persistent
      if (!persistent) {
        try {
          v.pause();
          if (unloadable) {
            v.dataset.src = v.src;
            v.removeAttribute("src");
            v.load();
          }
        } catch {}
      }
    } else {
      // 🔁 restore video unloadate
      if (unloadable && v.dataset.src) {
        v.src = v.dataset.src;
        delete v.dataset.src;
        v.load();
      }

      if (persistent) {
        v.play().catch(() => {});
      }
    }
  });
}

export function isPerformanceMode() {
  return performanceMode;
}

/**
 * 🔁 AUTO INIT
 */
export function initPerformanceMode() {
  performanceMode = localStorage.getItem("performance_mode") === "1";
  if (performanceMode) {
    document.body.classList.add("performance-mode");
  }
}

/**
 * 🎮 SCENE PAUSE (modal / game)
 */
export function setScenePaused({ pause, unloadBackground }) {
  parallaxPaused = pause;
  document.body.classList.toggle("scene-paused", pause);

  document.querySelectorAll("video").forEach(v => {
    const persistent = v.dataset.persistent === "true";
    const unloadable = v.dataset.unloadable === "true";

    if (pause) {
      v.pause();

      // ❄️ unload DOAR la game/modal
      if (unloadBackground && unloadable) {
        v.dataset.src = v.src;
        v.removeAttribute("src");
        v.load();
      }

    } else {
      // ❗ dacă performance mode e ON → nu restaurăm nimic
      if (performanceMode) return;

      // 🔁 restore background
      if (unloadable && v.dataset.src) {
        v.src = v.dataset.src;
        delete v.dataset.src;
        v.load();
      }

      // ▶️ restart UI videos
      if (persistent) {
        v.play().catch(() => {});
      }
    }
  });
}

export function isParallaxDisabled() {
  return parallaxPaused || performanceMode;
}
