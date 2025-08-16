import React from 'react';
import Header from '../../components/Header/Header.jsx';
import Hero from '../../components/Hero/Hero.jsx';
import FeaturedEvents from '../../components/FeaturedEvents/FeaturedEvents.jsx';
import Categories from '../../components/Categories/Categories.jsx';
import RecommendedEvents from '../../components/RecommendedEvents/RecommendedEvents.jsx';
import CallToAction from '../../components/CallToAction/CallToAction.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Header />
      <Hero />
      <FeaturedEvents />
      <Categories />
      <RecommendedEvents />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;
