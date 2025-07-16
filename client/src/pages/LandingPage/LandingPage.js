import React from 'react';
import Header from '../../components/Header/Header';
import Hero from '../../components/Hero/Hero';
import FeaturedEvents from '../../components/FeaturedEvents/FeaturedEvents';
import Categories from '../../components/Categories/Categories';
import RecommendedEvents from '../../components/RecommendedEvents/RecommendedEvents';
import CallToAction from '../../components/CallToAction/CallToAction';
import Footer from '../../components/Footer/Footer';
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
