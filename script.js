const menuBtn = document.getElementById("menuBtn");
const mobileNav = document.getElementById("mobileNav");

if (menuBtn && mobileNav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!isOpen));
    mobileNav.hidden = isOpen;
  });
}

// Dropdown menu behavior (hover handled in CSS).
// This adds tap/click support on devices that don't have hover.
const dropdownItems = Array.from(document.querySelectorAll(".nav__item--dropdown"));

function closeAllDropdowns() {
  dropdownItems.forEach((it) => {
    it.classList.remove("is-open");
    const trigger = it.querySelector(".nav__link");
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  });
}

dropdownItems.forEach((item) => {
  const trigger = item.querySelector(".nav__link");
  if (!trigger) return;

  trigger.addEventListener("click", (e) => {
    const needsClickToggle = window.matchMedia("(hover: none)").matches;
    if (!needsClickToggle) return; // on desktop, let the link behave normally

    e.preventDefault();

    const willOpen = !item.classList.contains("is-open");
    closeAllDropdowns();
    if (willOpen) {
      item.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav__item--dropdown")) closeAllDropdowns();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllDropdowns();
});


// ===================== HERO PARALLAX (index.html) =====================
// Subtle "scroll effect" by moving the hero background slower than page scroll.
(() => {
  const hero = document.querySelector(".hero");
  const bg = hero ? hero.querySelector(".hero__bg") : null;
  if (!hero || !bg) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let ticking = false;

  const clamp01 = (n) => Math.min(1, Math.max(0, n));

  function render() {
    ticking = false;

    if (reduceMotion.matches) {
      bg.style.transform = "";
      hero.style.removeProperty("--heroShade");
      return;
    }

    const rect = hero.getBoundingClientRect();
    const vh = window.innerHeight || 1;

    // progress: 0..1 while hero scrolls past viewport
    const progress = (vh - rect.top) / (vh + rect.height);
    const p = clamp01(progress);

    // More obvious movement (you can tune this number)
    const translateY = (p - 0.5) * 140; // -70px .. 70px
    const scale = 1.10 - p * 0.06;      // 1.10 .. 1.04
    bg.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;

    // Slightly adjust overlay darkness as you scroll
    const shade = 0.58 + p * 0.12;
    hero.style.setProperty("--heroShade", shade.toFixed(3));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(render);
  }

  render();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", onScroll);
})();
