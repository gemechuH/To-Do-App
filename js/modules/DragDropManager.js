class DragDropManager {
  constructor(taskManager, uiManager) {
    this.taskManager = taskManager;
    this.uiManager = uiManager;
    this.draggedTask = null;
    this.placeholder = null;
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    const tasksList = document.getElementById("tasks-list");

    tasksList.addEventListener("dragstart", (e) => this.handleDragStart(e));
    tasksList.addEventListener("dragend", (e) => this.handleDragEnd(e));
    tasksList.addEventListener("dragover", (e) => this.handleDragOver(e));
    tasksList.addEventListener("drop", (e) => this.handleDrop(e));
  }

  handleDragStart(e) {
    const taskElement = e.target.closest(".task-item");
    if (!taskElement) return;

    this.draggedTask = taskElement;
    taskElement.classList.add("dragging");

    // Create ghost image
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskElement.dataset.taskId);

    // Add placeholder
    this.placeholder = document.createElement("div");
    this.placeholder.className = "task-item placeholder";
    this.placeholder.style.height = `${taskElement.offsetHeight}px`;
    taskElement.parentNode.insertBefore(this.placeholder, taskElement);
  }

  handleDragEnd(e) {
    if (!this.draggedTask) return;

    this.draggedTask.classList.remove("dragging");
    if (this.placeholder && this.placeholder.parentNode) {
      this.placeholder.parentNode.removeChild(this.placeholder);
    }

    this.draggedTask = null;
    this.placeholder = null;
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    const taskElement = e.target.closest(".task-item");
    if (!taskElement || taskElement === this.draggedTask || !this.placeholder)
      return;

    const tasksList = document.getElementById("tasks-list");
    const tasks = Array.from(tasksList.children);
    const draggedIndex = tasks.indexOf(this.draggedTask);
    const hoverIndex = tasks.indexOf(taskElement);

    if (draggedIndex < hoverIndex) {
      taskElement.parentNode.insertBefore(
        this.placeholder,
        taskElement.nextSibling
      );
    } else {
      taskElement.parentNode.insertBefore(this.placeholder, taskElement);
    }
  }

  handleDrop(e) {
    e.preventDefault();
    if (!this.draggedTask) return;

    const tasksList = document.getElementById("tasks-list");
    const tasks = Array.from(tasksList.children).filter(
      (el) => el !== this.placeholder
    );
    const newIndex = tasks.indexOf(this.placeholder);

    if (newIndex !== -1) {
      const taskId = this.draggedTask.dataset.taskId;
      this.taskManager.reorderTasks(taskId, newIndex);
    }

    this.handleDragEnd(e);
  }
}

export default DragDropManager;
