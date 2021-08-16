import React from 'react';
import Faker from 'faker';

const GoldSponsorCard = ({id, image}) => {
  return (
    <div key={id} style={{maxHeight: '180px'}}>
      <img
        className="sponsor-card"
        src={image}
        alt="sponsor card"
      ></img>
    </div>
  );
};

export default GoldSponsorCard;
