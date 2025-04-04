import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Slideshow.css"; 
import accenture from "../assets/Accemture.png";
import megatrends from "../assets/American MegaTrends.png";
import atosSyntel from "../assets/AtosSyntel.png";
import broadcom from "../assets/BroadCom.png";
import centizen from "../assets/Centizen.png";
import cognizant from "../assets/Cognizant.png";
import hcl from "../assets/HCL.png";
import hexaware from "../assets/Hexaware.png";
import ibm from "../assets/IBM.png";
import infosys from "../assets/Infosys.png";
import infoview from "../assets/InfoView.png";
import jilaba from "../assets/Jilaba.png";
//set-up
const images = [
  accenture,
  megatrends,
  atosSyntel,
  broadcom,
  centizen,
  cognizant,
  hcl,
  hexaware,
  ibm,
  infosys,
  infoview,
  jilaba
];

const Slideshow = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4, // Number of images visible at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Change image every 2 seconds
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2, // Show 2 images on smaller screens
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // Show 1 image on very small screens
        },
      },
    ],
  };

  return (
    <div className="slideshow-container">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index} className="slide">
            <img src={img} alt={`Recruiter ${index}`} className="slide-img" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Slideshow;