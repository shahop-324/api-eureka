import React from 'react';

const PlatinumSponsorCard = ({id, image}) => {
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

export default PlatinumSponsorCard;
