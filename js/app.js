import TaskManager from "./modules/TaskManager.js";
import UIManager from "./modules/UIManager.js";
import ThemeManager from "./modules/ThemeManager.js";
import NotificationManager from "./modules/NotificationManager.js";
import DragDropManager from "./modules/DragDropManager.js";

class App {
  constructor() {
    this.taskManager = new TaskManager();
    this.uiManager = new UIManager(this.taskManager);
    this.themeManager = new ThemeManager();
    this.notificationManager = new NotificationManager();
    this.dragDropManager = new DragDropManager(
      this.taskManager,
      this.uiManager
    );

    this.init();
  }

  init() {
    // Initialize all managers
    this.taskManager.init();
    this.uiManager.init();
    this.themeManager.init();
    this.notificationManager.init();
    this.dragDropManager.init();

    // Load tasks from localStorage
    this.taskManager.loadTasks();

    // Initial UI render
    this.uiManager.renderTasks();

    // Check for due tasks on startup
    this.notificationManager.checkDueTasks(this.taskManager.getTasks());
  }
}

// Initialize the app when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
