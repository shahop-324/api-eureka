import React from 'react';
import Faker from 'faker';

const BoothCard = ({name,description,id}) => {
  return (
    <div key={id} className="booth-card px-3 py-3">
      <img
        src={Faker.image.image()}
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
