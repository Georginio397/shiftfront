let parallaxDisabled = false;

export function setScenePaused(paused) {
  const body = document.body;
  parallaxDisabled = paused;
  body.classList.toggle("scene-paused", paused);

  document.querySelectorAll("video").forEach(v => {
    const isPersistent = v.dataset.persistent === "true";
    const isUnloadable = v.dataset.unloadable === "true";

    if (paused) {
      v.pause();
      v.currentTime = 0;

      // ❄️ DOAR background cinematic se unload-ează
      if (isUnloadable) {
        v.dataset.src = v.src;
        v.removeAttribute("src");
        v.load();
      }

    } else {
      // 🔁 RESTORE DOAR cele unload-ate
      if (isUnloadable && v.dataset.src) {
        v.src = v.dataset.src;
        v.load();
      }

      // ⚠️ NU forțăm play() – autoplay va porni singur
      // pentru că src NU a fost șters la persistent
    }
  });
}

export function isParallaxDisabled() {
  return parallaxDisabled;
}
