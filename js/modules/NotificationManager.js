class NotificationManager {
  constructor() {
    this.hasPermission = false;
    this.checkInterval = 60000; // Check every minute
    this.intervalId = null;
  }

  init() {
    this.requestNotificationPermission();
    this.startPeriodicCheck();
  }

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  }

  startPeriodicCheck() {
    // Clear any existing interval
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    // Start new interval
    this.intervalId = setInterval(() => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      this.checkDueTasks(tasks);
    }, this.checkInterval);
  }

  checkDueTasks(tasks) {
    if (!this.hasPermission) return;

    const now = new Date();
    tasks.forEach((task) => {
      if (task.deadline && !task.completed) {
        const deadline = new Date(task.deadline);
        const timeDiff = deadline.getTime() - now.getTime();

        // Notify if task is due within 5 minutes or overdue
        if (timeDiff <= 300000 && timeDiff > -300000) {
          this.showNotification(task);
        }
      }
    });
  }

  showNotification(task) {
    if (!this.hasPermission) return;

    const deadline = new Date(task.deadline);
    const isOverdue = deadline < new Date();

    const notification = new Notification(
      isOverdue ? "⚠️ Task Overdue" : "⏰ Task Due Soon",
      {
        body: `${task.title}\n${isOverdue ? "Was due" : "Due"} at ${deadline.toLocaleTimeString()}`,
        icon: "/favicon.ico",
        tag: `task-${task.id}`, // Prevent duplicate notifications
        requireInteraction: true,
      }
    );

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  stopPeriodicCheck() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default NotificationManager;
