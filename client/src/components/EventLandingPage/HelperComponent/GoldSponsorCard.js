import React from 'react';


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
