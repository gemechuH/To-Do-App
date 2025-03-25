class UIManager {
  constructor(taskManager) {
    this.taskManager = taskManager;
    this.taskForm = document.getElementById("task-form");
    this.tasksList = document.getElementById("tasks-list");
    this.searchInput = document.getElementById("search-input");
    this.categoryFilter = document.getElementById("category-filter");
    this.priorityFilter = document.getElementById("priority-filter");

    this.currentFilters = {
      search: "",
      category: "all",
      priority: "all",
      completed: undefined,
    };
  }

  init() {
    this.setupEventListeners();
    this.taskManager.addListener(() => this.renderTasks());
  }

  setupEventListeners() {
    // Task form submission
    this.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleTaskSubmit();
    });

    // Search and filter inputs
    this.searchInput.addEventListener("input", () => {
      this.currentFilters.search = this.searchInput.value;
      this.renderTasks();
    });

    this.categoryFilter.addEventListener("change", () => {
      this.currentFilters.category = this.categoryFilter.value;
      this.renderTasks();
    });

    this.priorityFilter.addEventListener("change", () => {
      this.currentFilters.priority = this.priorityFilter.value;
      this.renderTasks();
    });
  }

  handleTaskSubmit() {
    const taskInput = document.getElementById("task-input");
    const categoryInput = document.getElementById("task-category");
    const priorityInput = document.getElementById("task-priority");
    const daysInput = document.getElementById("task-days");

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + parseInt(daysInput.value));

    const taskData = {
      title: taskInput.value.trim(),
      category: categoryInput.value,
      priority: priorityInput.value,
      startDate: startDate.toISOString(),
      deadline: endDate.toISOString(),
      daysToComplete: parseInt(daysInput.value),
    };

    this.taskManager.addTask(taskData);
    this.taskForm.reset();
  }

  renderTasks() {
    const filteredTasks = this.taskManager.filterTasks(this.currentFilters);
    this.tasksList.innerHTML = "";

    filteredTasks.forEach((task) => {
      const taskElement = this.createTaskElement(task);
      this.tasksList.appendChild(taskElement);
    });
  }

  createTaskElement(task) {
    const taskElement = document.createElement("div");
    const isExpired = new Date(task.deadline) < new Date();
    taskElement.className = `task-item priority-${task.priority}${isExpired ? " task-expired" : ""}`;
    taskElement.dataset.taskId = task.id;
    taskElement.draggable = true;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      this.taskManager.toggleTaskComplete(task.id);
    });

    const content = document.createElement("div");
    content.className = "task-content";

    const title = document.createElement("h3");
    title.className = "task-title";
    title.textContent = task.title;

    if (isExpired) {
      const expirationMsg = document.createElement("div");
      expirationMsg.className = "task-details";
      expirationMsg.textContent = "⚠️ Task has expired!";
      content.appendChild(expirationMsg);
    }
    if (task.completed) {
      title.style.textDecoration = "line-through";
    }

    const details = document.createElement("div");
    details.className = "task-details";
    const now = new Date();
    const deadline = new Date(task.deadline);
    const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

    details.innerHTML = `
            <span class="task-category">${task.category}</span> |
            <span class="task-priority">${task.priority}</span> |
            <span class="task-timeline">Started: ${new Date(task.startDate).toLocaleDateString()}</span> |
            <span class="task-deadline">Due: ${deadline.toLocaleDateString()}</span> |
            <span class="task-days-left">${daysLeft} days left</span>
        `;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.addEventListener("click", () => this.handleEditTask(task));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this task?")) {
        this.taskManager.deleteTask(task.id);
      }
    });

    content.appendChild(title);
    content.appendChild(details);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    taskElement.appendChild(checkbox);
    taskElement.appendChild(content);
    taskElement.appendChild(actions);

    return taskElement;
  }

  handleEditTask(task) {
    const newTitle = prompt("Edit task:", task.title);
    if (newTitle !== null && newTitle.trim() !== "") {
      this.taskManager.editTask(task.id, { title: newTitle.trim() });
    }
  }
}

export default UIManager;
