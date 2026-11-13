(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.dataset.motionBoot = "pending";
  setTimeout(() => delete document.documentElement.dataset.motionBoot, 2500);
})();
