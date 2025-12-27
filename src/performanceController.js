// performanceController.js
let parallaxDisabled = false;

export function setScenePaused(paused) {
  const body = document.body;

  if (paused) {
    body.classList.add("scene-paused");
    parallaxDisabled = true;

    document.querySelectorAll("video").forEach(v => {
      if (v.dataset.persistent === "true") return;

      try {
        v.pause();
        v.removeAttribute("src");
        v.load();
      } catch {}
    });

  } else {
    body.classList.remove("scene-paused");
    parallaxDisabled = false;

    document.querySelectorAll("video[data-src]").forEach(v => {
      // 🔥 RESTORE SRC
      v.src = v.dataset.src;

      // 🔥 RESET vizual complet
      v.style.opacity = "1";
      v.style.display = "";
      v.style.transform = "translate(0px, 0px)";
      v.currentTime = 0;

      v.load();
      v.play().catch(() => {});
    });
  }
}

export function isParallaxDisabled() {
  return parallaxDisabled;
}
