import React from "react";
import { Link } from "react-router-dom";
import Bored from "./../../assets/images/Bored.png";

const YouHaveNoEventComing = (props) => {
  return (
    <div
      className="you-have-no-event-coming-card d-flex flex-column justify-content-between align-items-center px-3 py-5"
      style={{ maxWidth: "400px" }}
    >
      <img
        src={props.img ? props.img : Bored}
        alt="Bored"
        className="mb-4"
        style={{ maxHeight: "250px", maxWidth: "340px", borderRadius: "20px" }}
      />
      <div className="you-have-no-event-coming-text mb-4">{props.msgText}</div>

      {props.hideBtn ? (
        <></>
      ) : (
        <Link
          to={"/search-events"}
          className="btn btn-text-customised btn-color-customised btn-primary btn-outline-text"
        >
          Explore Events
        </Link>
      )}
    </div>
  );
};

export default YouHaveNoEventComing;
