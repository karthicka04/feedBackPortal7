import React, { useState } from "react";
import "./Home.css";

import necFront from "../assets/NEC-Front.jpg";
import detailsImage from "../assets/Details.png";
import Slideshow from "../components/Slideshow";
import groupImage from "../assets/group.png";
import placement2024 from "../assets/2024-2025.png";
import placement2023 from "../assets/3-4.png";
import placement2022 from "../assets/2022-2023.png";
import placement2021 from "../assets/2021-2022.png";
import placement2020 from "../assets/2020-2021.png";
import Form from "./Form";
const Home = () => {
  
   return (
    <div className="container">
        <header className="hero">
        <img src={necFront} alt="NEC College Front" className="hero-image" />
      </header><section className="feedback-section">
        <div className="feedback-container">
          <div className="feedback-text">
            <h3 className="feedback-heading">📢 Why is Feedback Important?</h3>
            <ul className="feedback-list">
              <li>✅ Helps future candidates prepare for interviews.</li>
              <li>✅ Provides insights into company hiring trends.</li>
              <li>✅ Encourages companies to improve their hiring process.</li>
              <li>✅ Creates a knowledge-sharing platform for job seekers.</li>
              <li>✅ Enables students to learn from real experiences.</li>
            </ul>
          </div>
          <div className="feedback-image">
            <img src={groupImage} alt="Group Feedback" />
          </div>
        </div>
      </section><section className="details-section">
        <img src={detailsImage} alt="Details" className="details-image" />
      </section>
      <section className="slideshow-section">
        <h3>Our Recruiters</h3>
        <Slideshow />
      </section>
      <section className="placement-section">
        <div className="placement-grid">
          <div className="row">
            <img src={placement2024} alt="Placement 2024-2025" className="placement-image" />
            <img src={placement2023} alt="Placement 2023-2024" className="placement-image" />
          </div>
          <div className="row">
            <img src={placement2022} alt="Placement 2022-2023" className="placement-image" />
            <img src={placement2021} alt="Placement 2021-2022" className="placement-image" />
          </div>
          <div className="row center-row">
            <img src={placement2020} alt="Placement 2020-2021" className="placement-image" />
          </div>
        </div>
      </section>
      <section className="features">
        <h3>Contact Us</h3>
        <div className="feature-list">
          <div className="feature">
            <h4>📄 Structured Feedback</h4>
            <p>No more searching through random messages. Everything is categorized.</p>
          </div>
          <div className="feature">
            <h4>🔍 Smart Filters</h4>
            <p>Search by company, role, location, and interview round.</p>
          </div>
          <div className="feature">
            <h4>📥 Upvotes & PDF Export</h4>
            <p>See the most useful feedback & download for offline access.</p>
          </div>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2025 Placement Feedback Portal. All rights reserved.</p>
      </footer>
   
    </div>
  );
};
export default Home;
