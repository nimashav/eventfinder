import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';
import { useCategoryFilter } from '../../context/CategoryFilterContext';

const Categories = () => {
  const { selectedCategory, handleCategoryChange } = useCategoryFilter();

  const categories = [
    { id: 1, name: 'All', icon: '🎭' },
    { id: 2, name: 'Music', icon: '🎵' },
    { id: 3, name: 'Art & Culture', icon: '🎨' },
    { id: 4, name: 'Tech & Innovation', icon: '💻' },
    { id: 5, name: 'Sports', icon: '⚽' },
    { id: 6, name: 'Food & Drink', icon: '🍷' },
    { id: 7, name: 'Education', icon: '📖' },
    { id: 8, name: 'Health', icon: '🧑‍⚕️' },
  ];

  const handleCategoryClick = (categoryName) => {
    handleCategoryChange(categoryName);
  };

  return (
    <section className="categories section">
      <div className="container">
        <div className="section-header">
          <h2>Explore by Category</h2>
          <p>Find events tailored to your interests</p>
        </div>

        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.name)}
              className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
            >
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
