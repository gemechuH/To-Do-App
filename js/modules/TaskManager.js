class TaskManager {
  constructor() {
    this.tasks = [];
    this.listeners = [];
  }

  init() {
    // Initialize any required setup
  }

  addTask(taskData) {
    const task = {
      id: Date.now().toString(),
      title: taskData.title,
      category: taskData.category,
      priority: taskData.priority,
      deadline: taskData.deadline,
      completed: false,
      createdAt: new Date().toISOString(),
      order: this.tasks.length,
    };

    this.tasks.push(task);
    this.saveTasks();
    this.notifyListeners();
    return task;
  }

  editTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveTasks();
    this.notifyListeners();
    return this.tasks[taskIndex];
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    this.saveTasks();
    this.notifyListeners();
    return true;
  }

  toggleTaskComplete(taskId) {
    const task = this.tasks.find((task) => task.id === taskId);
    if (!task) return null;

    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date().toISOString() : null;

    this.saveTasks();
    this.notifyListeners();
    return task;
  }

  reorderTasks(taskId, newOrder) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);
    this.tasks.splice(newOrder, 0, task);

    // Update order property for all tasks
    this.tasks.forEach((task, index) => {
      task.order = index;
    });

    this.saveTasks();
    this.notifyListeners();
    return true;
  }

  getTasks() {
    return this.tasks;
  }

  getTaskById(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }

  filterTasks(filters) {
    return this.tasks.filter((task) => {
      if (
        filters.category &&
        filters.category !== "all" &&
        task.category !== filters.category
      )
        return false;
      if (
        filters.priority &&
        filters.priority !== "all" &&
        task.priority !== filters.priority
      )
        return false;
      if (
        filters.completed !== undefined &&
        task.completed !== filters.completed
      )
        return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return task.title.toLowerCase().includes(searchLower);
      }
      return true;
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter((listener) => listener !== callback);
  }

  notifyListeners() {
    this.listeners.forEach((callback) => callback(this.tasks));
  }

  loadTasks() {
    try {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        this.tasks = JSON.parse(savedTasks);
        this.notifyListeners();
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  saveTasks() {
    try {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }
}

export default TaskManager;
