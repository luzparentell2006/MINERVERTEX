import React, { useState, useEffect } from 'react';
import '../styles/Carrusel.css';

function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1639762681033-6461502107c6?w=800&q=80',
      title: 'Inversión Segura'
    },
    {
      url: 'https://images.unsplash.com/photo-1631050487644-ca8a78fb4fa0?w=800&q=80',
      title: 'Ganancias Diarias'
    },
    {
      url: 'https://images.unsplash.com/photo-1535320903710-d993d3ecfc51?w=800&q=80',
      title: 'Comunidad Global'
    },
    {
      url: 'https://images.unsplash.com/photo-1608550423149-33a16b23c788?w=800&q=80',
      title: 'Tecnología Blockchain'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const previousSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="carrusel-section">
      <div className="carrusel-container">
        <div className="carrusel-slide">
          <img 
            src={images[currentIndex].url} 
            alt={images[currentIndex].title}
          />
          <div className="slide-overlay">
            <h3>{images[currentIndex].title}</h3>
          </div>
        </div>

        <button className="carrusel-btn prev" onClick={previousSlide}>
          ❮
        </button>
        <button className="carrusel-btn next" onClick={nextSlide}>
          ❯
        </button>

        <div className="carrusel-dots">
          {images.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageCarousel;
