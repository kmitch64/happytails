

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlus } from '@fortawesome/free-solid-svg-icons';

import './PetCarousel.css';



export default function PetCarousel({ petId, images, petName }: PetCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="no-images">
        <FontAwesomeIcon icon={faPlus} size="3x" color="#ccc" />
        <p>No photos added yet</p>
      </div>
    );
  }

  return (
    <div className="pet-carousel">
      <div className="carousel-container">
        {/* Previous button */}
        <button
          className="carousel-nav-button prev"
          onClick={() => setActiveIndex(prev => (prev > 0 ? prev - 1 : images.length - 1))}
          disabled={images.length <= 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        {/* Image slides */}
        <div className="carousel-slides">
          {images.map((image, index) => (
            <div
              key={index}
              className={`carousel-slide ${index === activeIndex ? 'active' : ''}`}
            >
              <img
                src={image.data}
                alt={`${petName} - Photo ${index + 1}`}
                className="pet-photo"
              />
            </div>
          ))}
        </div>

        {/* Next button */}
        <button
          className="carousel-nav-button next"
          onClick={() => setActiveIndex(prev => (prev < images.length - 1 ? prev + 1 : 0))}
          disabled={images.length <= 1}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>

      {/* Navigation dots */}
      {images.length > 1 && (
        <div className="carousel-nav">
          {images.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

