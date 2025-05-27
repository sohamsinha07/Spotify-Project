import React from 'react';
import '../styles/Home.css'; // Let's assume you'll add CSS for styling.

const Home = () => {
  return (
    <div className="home-container">
      <h1>Suggested Users</h1>
      <div className="horizontal-scroll">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="gray-square"></div>
        ))}
      </div>

      <h1>Top Discussions</h1>

        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="vertical-rectangle"></div>
        ))}
    </div>
  );
};

export default Home;
