import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import FilterBar from './components/FilterBar';
import StatsPanel from './components/StatsPanel';
import { taskService } from './services/taskService';

function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = taskService.getTasks();
    setTasks(savedTasks);
  }, []);

  const handleCreateTask = (taskData) => {
    const newTask = taskService.createTask(taskData);
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  const handleUpdateTask = (taskData) => {
    const updatedTask = taskService.updateTask(editingTask.id, taskData);
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id ? updatedTask : task
    ));
    setEditingTask(null);
    setShowForm(false);
  };

  const handleDeleteTask = (taskId) => {
    taskService.deleteTask(taskId);
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleToggleComplete = (taskId) => {
    const updatedTask = taskService.toggleComplete(taskId);
    setTasks(prev => prev.map(task => 
      task.id === taskId ? updatedTask : task
    ));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const filteredTasks = taskService.filterTasks(tasks, filter, searchTerm, sortBy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        onAddTask={() => setShowForm(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            <FilterBar 
              filter={filter}
              onFilterChange={setFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <TaskForm 
                    onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                    onCancel={() => {
                      setShowForm(false);
                      setEditingTask(null);
                    }}
                    initialData={editingTask}
                    isEditing={!!editingTask}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <TaskList 
              tasks={filteredTasks}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <StatsPanel tasks={tasks} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;