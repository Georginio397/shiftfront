let parallaxDisabled = false;

export function setScenePaused(paused) {
  parallaxDisabled = paused;
  document.body.classList.toggle("scene-paused", paused);

  document.querySelectorAll("video").forEach(v => {
    const persistent = v.dataset.persistent === "true";
    const unloadable = v.dataset.unloadable === "true";

    if (paused) {
      v.pause();

      // ❄️ DOAR background cinematic
      if (unloadable) {
        v.dataset.src = v.src;
        v.removeAttribute("src");
        v.load();
      }
    } else {
      // 🔁 RESTORE doar ce a fost unload-at
      if (unloadable && v.dataset.src) {
        v.src = v.dataset.src;
        v.load();
      }

      // ⚠️ NU chemăm play() manual
      // autoplay va merge doar unde src NU a fost scos
    }
  });
}

export function isParallaxDisabled() {
  return parallaxDisabled;
}
