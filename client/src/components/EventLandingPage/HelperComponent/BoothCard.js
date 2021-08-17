import React from 'react';

const BoothCard = ({name,description,id, image}) => {
  return (
    <div key={id} className="booth-card px-3 py-3">
      <img
        src={image}
        className="booth-card-image mb-3"
        alt="booth-poster"
      />
      <div className="booth-name mb-3">{name}</div>
      <div className="booth-short-description mb-3">
      {description}
      </div>
    </div>
  );
};

export default BoothCard;
