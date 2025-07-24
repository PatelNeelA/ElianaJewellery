import React from "react";
import Hero from "../Hero/Hero";
import Collection from "../collection/Collection";
import Trending from "../TrendingPieces/Trending";
import Engagement from "../Engagement/Engagement";
import Blogs from "../Blogs/Blogs";
import Contact from "../Contact/Contact";

const Home = () => {
  return (
    <div className="w-full">
      <Hero />
      <section className="container">
        <Collection />
      </section>
      <section className="container">
        <Trending />
      </section>
      <section className="container">
        <Engagement />
      </section>
      <section className="container">
        <Blogs />
      </section>
      <section className="container">
        <Contact />
      </section>
    </div>
  );
};

export default Home;
