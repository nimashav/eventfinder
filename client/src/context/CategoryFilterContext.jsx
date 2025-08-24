import React, { createContext, useContext, useState } from 'react';

const CategoryFilterContext = createContext();

export const useCategoryFilter = () => {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error('useCategoryFilter must be used within a CategoryFilterProvider');
  }
  return context;
};

export const CategoryFilterProvider = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearFilter = () => {
    setSelectedCategory('All');
  };

  // Map display names to database category values
  const getCategoryFilter = (category) => {
    const categoryMap = {
      'All': null, // null means show all categories
      'Music': 'music',
      'Art & Culture': 'art-culture',
      'Tech & Innovation': 'tech-innovation',
      'Sports': 'sports',
      'Food & Drink': 'food-drink',
      'Business': 'business',
      'Education': 'education',
      'Health': 'health'
    };
    return categoryMap[category] || null;
  };

  const value = {
    selectedCategory,
    handleCategoryChange,
    clearFilter,
    getCategoryFilter
  };

  return (
    <CategoryFilterContext.Provider value={value}>
      {children}
    </CategoryFilterContext.Provider>
  );
};
