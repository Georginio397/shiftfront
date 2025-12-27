
let parallaxDisabled = false;

export function setScenePaused(paused) {
  const body = document.body;

  if (paused) {
    body.classList.add("scene-paused");
    parallaxDisabled = true;

    // PAUSE + UNLOAD toate video-urile non-interactive
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

    // RESTORE video-urile
    document.querySelectorAll("video[data-src]").forEach(v => {
      v.src = v.dataset.src;
      v.load();
      v.play().catch(() => {});
    });
  }
}

export function isParallaxDisabled() {
  return parallaxDisabled;
}
