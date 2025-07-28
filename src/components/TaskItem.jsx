import React from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiEdit2, FiTrash2, FiCalendar, FiFlag, FiTag, FiCheck } = FiIcons;

const TaskItem = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-gray-500';
    
    const date = new Date(dateString);
    if (isPast(date) && !isToday(date)) return 'text-red-500';
    if (isToday(date)) return 'text-orange-500';
    return 'text-gray-500';
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  const categoryColors = {
    personal: 'bg-blue-100 text-blue-800',
    work: 'bg-purple-100 text-purple-800',
    health: 'bg-green-100 text-green-800',
    education: 'bg-indigo-100 text-indigo-800',
    finance: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800'
  };

  return (
    <motion.div
      className={`bg-white rounded-lg border-2 p-4 transition-all duration-200 hover:shadow-md ${
        task.completed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 hover:border-primary-300'
      }`}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex items-start space-x-4">
        {/* Checkbox */}
        <motion.button
          onClick={() => onToggleComplete(task.id)}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-primary-500'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {task.completed && <SafeIcon icon={FiCheck} className="text-xs" />}
        </motion.button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium ${
                task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              
              {task.description && (
                <p className={`mt-1 text-sm ${
                  task.completed ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {task.description}
                </p>
              )}

              {/* Task Meta Information */}
              <div className="flex items-center space-x-4 mt-3">
                {/* Priority */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
                  <SafeIcon icon={FiFlag} className="mr-1 text-xs" />
                  {task.priority}
                </span>

                {/* Category */}
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryColors[task.category]}`}>
                  <SafeIcon icon={FiTag} className="mr-1 text-xs" />
                  {task.category}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <span className={`inline-flex items-center text-xs ${getDueDateColor(task.dueDate)}`}>
                    <SafeIcon icon={FiCalendar} className="mr-1 text-xs" />
                    {formatDueDate(task.dueDate)}
                  </span>
                )}
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.button
                onClick={() => onEdit(task)}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiEdit2} className="text-sm" />
              </motion.button>
              
              <motion.button
                onClick={() => onDelete(task.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <SafeIcon icon={FiTrash2} className="text-sm" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;