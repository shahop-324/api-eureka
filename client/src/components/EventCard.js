import React from "react";

import { Link } from "react-router-dom";
import "./../assets/css/CardStyle.css";

import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, generateEventAccessToken } from "../actions";

const EventCard = ({
  image,
  date,
  id,
  eventName,
  minPrice,
  maxPrice,
  showBtn,
  communityId,
}) => {
  const dispatch = useDispatch();
  const eventId = id;
  const userDetails = useSelector((state) =>
    state.user.userDetails ? state.user.userDetails : null
  );

  console.log(showBtn);
  const displayJoinBtn = showBtn ? "block" : "none";
  return (
    <div className="event-card-main" data-aos="zoom-in"
    data-aos-delay="10"
    data-aos-duration="300"
    data-aos-easing="ease-in-sine">
      <div className="event-card-img-container">
        <Link
          onClick={() => dispatch(fetchEvent(id))}
          to={`/event-landing-page/${id}`}
        >
          <img src={image} className="poster-img" alt="event-poster" />
        </Link>
      </div>
      <div className="event-card-text-info d-flex flex-column justfy-content-between px-4 py-4">
        <div className="event-card-date-main mb-3">{date}</div>
        <div className="event-card-name-main mb-3">
          {" "}
          <Link
            onClick={() => dispatch(fetchEvent(id))}
            to={`/event-Landing-page/${id}`}
            style={{
              textDecoration: "none",
              color: "#212121",
              fontWeight: "600",
              fontFamily: "ubuntu",
              fontSize: "1.1rem",
            }}
          >
            {eventName}
          </Link>
        </div>
        <div className="event-card-price-main">
          $ {minPrice} - $ {maxPrice}
        </div>

        <div className="mt-4 mb-3" style={{ display: displayJoinBtn }}>
          <Divider />
        </div>
        <div className="d-flex flex-row justify-content-end align-items-center">
          <Link
            to={`/community/${communityId}/event/${eventId}/hosting-platform/lobby`}
          >
            <button
              type="button"
              onClick={() => {
                dispatch(
                  generateEventAccessToken(
                    userDetails.id,
                    userDetails.email,
                    "audience",
                    eventId,
                    communityId
                  )
                );
              }}
              className="btn btn-primary btn-outline-text me-3"
              style={{ display: displayJoinBtn }}
            >
              Join Event
            </button>
          </Link>

          {/* <button className="btn btn-outline-primary btn-outline-text" style={{display: displayJoinBtn}}>
            View Reciept
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
