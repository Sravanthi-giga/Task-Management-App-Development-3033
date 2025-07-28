import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiFilter, FiChevronDown } = FiIcons;

const FilterBar = ({ filter, onFilterChange, sortBy, onSortChange }) => {
  const filterOptions = [
    { value: 'all', label: 'All Tasks', count: '' },
    { value: 'pending', label: 'Pending', count: '' },
    { value: 'completed', label: 'Completed', count: '' },
    { value: 'overdue', label: 'Overdue', count: '' }
  ];

  const sortOptions = [
    { value: 'created', label: 'Date Created' },
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'title', label: 'Title' }
  ];

  return (
    <motion.div
      className="bg-white rounded-lg border border-gray-200 p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        {/* Filter Tabs */}
        <div className="flex items-center space-x-1">
          <SafeIcon icon={FiFilter} className="text-gray-400 mr-2" />
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => onFilterChange(option.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                filter === option.value
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.label}
            </motion.button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                Sort by {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SafeIcon icon={FiChevronDown} className="text-gray-400 text-sm" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;