import React from 'react';
import Faker from 'faker';

const PlatinumSponsorCard = ({id}) => {
  return (
    <div key={id} style={{maxHeight: '180px'}}>
      <img
        className="sponsor-card"
        src={Faker.image.abstract()}
        alt="sponsor card"
      ></img>
    </div>
  );
};

export default PlatinumSponsorCard;