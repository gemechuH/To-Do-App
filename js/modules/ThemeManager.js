class ThemeManager {
  constructor() {
    this.themeToggleBtn = document.getElementById("theme-toggle");
    this.moonIcon = this.themeToggleBtn.querySelector(".fa-moon");
  }

  init() {
    this.loadTheme();
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
  }

  toggleTheme() {
    const isDark = document.body.getAttribute("data-theme") === "dark";
    document.body.setAttribute("data-theme", isDark ? "light" : "dark");
    this.moonIcon.classList.toggle("fa-sun");
    this.moonIcon.classList.toggle("fa-moon");
    localStorage.setItem("theme", isDark ? "light" : "dark");
  }

  loadTheme() {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", savedTheme);

    if (savedTheme === "dark") {
      this.moonIcon.classList.remove("fa-moon");
      this.moonIcon.classList.add("fa-sun");
    }
  }
}

export default ThemeManager;
