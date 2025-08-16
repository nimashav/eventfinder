import React from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const Categories = () => {
  const categories = [
    { id: 1, name: 'All', icon: '🎭' },
    { id: 2, name: 'Music', icon: '🎵' },
    { id: 3, name: 'Art & Culture', icon: '🎨' },
    { id: 4, name: 'Tech & Innovation', icon: '💻' },
    { id: 5, name: 'Sports', icon: '⚽' },
    { id: 6, name: 'Food & Drink', icon: '🍷' },
  ];

  return (
    <section className="categories section">
      <div className="container">
        <div className="section-header">
          <h2>Explore by Category</h2>
          <p>Find events tailored to your interests</p>
        </div>
        
        <div className="category-buttons">
          {categories.map(category => (
            <Link key={category.id} to={`/category/${category.name}`} className="category-button">
              <span className="category-icon">{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
