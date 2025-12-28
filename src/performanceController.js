let parallaxDisabled = false;

export function setScenePaused({ pause, unloadBackground }) {
  parallaxDisabled = pause;
  document.body.classList.toggle("scene-paused", pause);

  document.querySelectorAll("video").forEach(v => {
    const persistent = v.dataset.persistent === "true";
    const unloadable = v.dataset.unloadable === "true";

    if (pause) {
      v.pause();

      // ❄️ unload DOAR când e jocul
      if (unloadBackground && unloadable) {
        v.dataset.src = v.src;
        v.removeAttribute("src");
        v.load();
      }

    } else {
      // 🔁 restore background
      if (unloadable && v.dataset.src) {
        v.src = v.dataset.src;
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
  return parallaxDisabled;
}
