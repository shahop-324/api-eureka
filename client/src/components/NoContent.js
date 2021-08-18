import React from "react";
// import Bored from "./../assets/images/Bored.png";

const NoContentFound = ({msgText, img}) => {
  return (
    <div className="you-have-no-event-coming-card d-flex flex-column justify-content-between align-items-center px-3 py-5" style={{ maxHeight: "400px"}}>
      <img src={img} alt="Bored" className="mb-4" style={{maxWidth: "250px", maxHeight: "250px"}}/>
      <div className="you-have-no-event-coming-text mb-4">{msgText}</div>
      
        {/* <Link to={"/search-events"} className="btn btn-text-customised btn-color-customised btn-primary btn-outline-text">
          Explore Events
        </Link> */}
    </div>
  );
};

export default NoContentFound;
