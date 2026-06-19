document.querySelectorAll("[data-copy]").forEach((button) => {
  button.setAttribute("aria-live", "polite");
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copy);
    if (!target) return;

    const label = button.textContent;
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      button.textContent = "Copiato";
      window.setTimeout(() => { button.textContent = label; }, 1600);
    } catch {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target);
      selection.removeAllRanges();
      selection.addRange(range);
      target.focus();
      button.textContent = "Testo selezionato";
      window.setTimeout(() => { button.textContent = label; }, 1600);
    }
  });
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => link.closest("details")?.removeAttribute("open"));
});

document.querySelectorAll(".mobile-nav").forEach((menu) => {
  menu.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !menu.open) return;
    menu.removeAttribute("open");
    menu.querySelector("summary")?.focus();
  });
});
