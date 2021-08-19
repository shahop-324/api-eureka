import React from "react";
import { Link } from "react-router-dom";
import Downloading from "./../../assets/images/Downloading.png";

const UserAccountRecordings = () => {
  return (
    <div className="user-account-main-body-home-content">
      <div className="user-account-main-body-home-content-left ps-2">
        <div className="user-account-main-body-headline pb-4 ps-4">
          Your Event Recordings
        </div>
        <div
          className="container px-2 py-2 d-flex flex-row align-items-center justify-content-center"
          style={{ height: "75vh" }}
        >
          <div
            className="you-have-no-event-coming-card d-flex flex-column justify-content-between align-items-center px-3 py-5"
            style={{ maxWidth: "60%" }}
          >
            <img
              src={Downloading}
              alt="Bored"
              className="mb-4"
              style={{ maxWidth: "300px" }}
            />
            <div className="you-have-no-event-coming-text mb-4">
              Your event recordings will show up here, when they are available.
            </div>
            
            <Link to={"/search-events"} className="btn btn-outline-text btn-color-customised btn-primary">
              Explore Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccountRecordings;
