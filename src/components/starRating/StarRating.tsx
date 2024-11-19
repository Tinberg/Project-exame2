import React from "react";
import { FaStar } from "react-icons/fa";
import "./starRating.scss";

interface StarRatingProps {
  rating: number;
  onChange: (newRating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange }) => {
  const handleClick = (starIndex: number) => {
    if (rating === starIndex + 1) {
      onChange(0); 
    } else {
      onChange(starIndex + 1);
    }
  };

  return (
    <div className="star-rating-container d-flex align-items-center">


      <div className="d-flex">
        {[...Array(5)].map((_, index) => (
          <FaStar
            key={index}
            size={24}
            onClick={() => handleClick(index)}
            className={`star ${index < rating ? "star-active" : ""}`}
          />
        ))}
      </div>
            {/* Display rating feedback */}
            <div className="rating-feedback align-item-center ms-3">{`${rating}/5`}</div>
    </div>
  );
};

export default StarRating;
