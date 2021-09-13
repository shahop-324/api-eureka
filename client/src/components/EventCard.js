import React from "react";

import { Link } from "react-router-dom";
import "./../assets/css/CardStyle.scss";

import { Divider } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvent, generateEventAccessToken } from "../actions";
import StarRateRoundedIcon from "@material-ui/icons/StarRateRounded";
import Fab from '@material-ui/core/Fab';
import FavoriteIcon from '@material-ui/icons/Favorite';

const EventCard = ({
  image,
  date,
  endDate,
  id,
  eventName,
  minPrice,
  maxPrice,
  showBtn,
  communityId,
  rating,
  startTime,
  endTime,
}) => {
  console.log(communityId);
  const dispatch = useDispatch();
  const eventId = id;
  const userDetails = useSelector((state) =>
    state.user.userDetails ? state.user.userDetails : null
  );

  console.log(showBtn);
  const displayJoinBtn = showBtn ? "block" : "none";
  return (
    <div className="event-card-main">
      <div className="event-card-img-container" style={{position: "relative"}}>
        <Link
          onClick={() => dispatch(fetchEvent(id))}
          to={`/event-landing-page/${id}`}
        >
          <img src={image} className="poster-img" alt="event-poster" />
        </Link>
        <div className="favourite-icon">
        <Fab aria-label="like" style={{position: "absolute", right: "10px", bottom: "-10px"}} size="small">
  <FavoriteIcon className="favourite-icon"/>
</Fab>
        </div>
        
      </div>
      <div className="event-card-text-info d-flex flex-column justfy-content-between px-4 py-4">
      <div className="event-card-name-main mb-3">
          {" "}
          <Link
            onClick={() => dispatch(fetchEvent(id))}
            to={`/event-Landing-page/${id}`}
            style={{
              textDecoration: "none",
              color: "#353535",
              fontWeight: "600",
              fontFamily: "ubuntu",
              fontSize: "1rem",
            }}
          >
            {eventName}
          </Link>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div
            className="event-card-date-main mb-3"
            style={{ fontWeight: "600", fontSize: "0.8rem", color: "#1b2653" }}
          >
            {startTime} <span style={{fontWeight: "600"}}>
              {/* to */}
              </span> 
              {/* <br/> {endTime} */}
          </div>
          <div
            className="rating-indicator d-flex flex-row align-items-center ps-1 pe-2 py-2"
            style={{ fontSize: "0.8rem" }}
          >
            <StarRateRoundedIcon
              style={{ fontSize: "1rem" }}
              className="me-1"
            />
            {rating}
          </div>
        </div>
        
        <div
          className="event-card-price-main"
          style={{ fontWeight: "600", fontSize: "0.9rem" }}
        >
          {console.log(minPrice)}
        {minPrice && `$ ${minPrice} - `} Upto ${maxPrice}
        </div>

        {/* <div className="mt-4 mb-3" style={{ display: displayJoinBtn }}>
          <Divider />
        </div> */}
        <div className="d-flex flex-row justify-content-end align-items-center">
          <Link
            to={`/compatibility-test/community/${communityId}/event/${eventId}/`}
          >
            {/* <button
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
            </button> */}
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
