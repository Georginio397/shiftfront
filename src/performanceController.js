let parallaxDisabled = false;

export function setScenePaused(paused) {
  parallaxDisabled = paused;
  document.body.classList.toggle("scene-paused", paused);

  document.querySelectorAll("video").forEach(v => {
    const persistent = v.dataset.persistent === "true";
    const unloadable = v.dataset.unloadable === "true";

    if (paused) {
      v.pause();

      if (unloadable) {
        v.dataset.src = v.src;
        v.removeAttribute("src");
        v.load();
      }

    } else {
      // 🔁 RESTORE background cinematic
      if (unloadable && v.dataset.src) {
        v.src = v.dataset.src;
        v.load();
      }

      // 🔥 RESTART UI VIDEOS (TV-uri)
      if (persistent) {
        v.currentTime = 0;
        v.play().catch(() => {});
      }
    }
  });
}

export function isParallaxDisabled() {
  return parallaxDisabled;
}
