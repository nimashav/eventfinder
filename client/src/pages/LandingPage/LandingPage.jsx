import React from 'react';
import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import Categories from '../../components/Categories/Categories.jsx';
import RecommendedEvents from '../../components/RecommendedEvents/RecommendedEvents.jsx';
import CallToAction from '../../components/CallToAction/CallToAction.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './LandingPage.css';
import FeaturedEvents from '../../components/FeaturedEvents/FeaturedEvents.jsx';
import { CategoryFilterProvider } from '../../context/CategoryFilterContext.jsx';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <CategoryFilterProvider>
        <FeaturedEvents />
        <Categories />
        <RecommendedEvents />
      </CategoryFilterProvider>
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
