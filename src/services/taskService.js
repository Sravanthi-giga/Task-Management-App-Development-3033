class TaskService {
  constructor() {
    this.storageKey = 'taskflow_tasks';
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  getTasks() {
    try {
      const tasks = localStorage.getItem(this.storageKey);
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  saveTasks(tasks) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  }

  createTask(taskData) {
    const newTask = {
      id: this.generateId(),
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      category: taskData.category || 'personal',
      dueDate: taskData.dueDate || '',
      tags: taskData.tags || [],
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const tasks = this.getTasks();
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    
    return newTask;
  }

  updateTask(taskId, updates) {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveTasks(tasks);
      return tasks[taskIndex];
    }
    
    return null;
  }

  deleteTask(taskId) {
    const tasks = this.getTasks();
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    this.saveTasks(filteredTasks);
    return true;
  }

  toggleComplete(taskId) {
    const tasks = this.getTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      tasks[taskIndex].updatedAt = new Date().toISOString();
      this.saveTasks(tasks);
      return tasks[taskIndex];
    }
    
    return null;
  }

  filterTasks(tasks, filter, searchTerm, sortBy) {
    let filteredTasks = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term) ||
        task.category.toLowerCase().includes(term) ||
        (task.tags && task.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    // Apply status filter
    switch (filter) {
      case 'pending':
        filteredTasks = filteredTasks.filter(task => !task.completed);
        break;
      case 'completed':
        filteredTasks = filteredTasks.filter(task => task.completed);
        break;
      case 'overdue':
        filteredTasks = filteredTasks.filter(task => {
          if (!task.dueDate || task.completed) return false;
          return new Date(task.dueDate) < new Date();
        });
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply sorting
    filteredTasks.sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        
        case 'title':
          return a.title.localeCompare(b.title);
        
        case 'created':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filteredTasks;
  }
}

export const taskService = new TaskService();