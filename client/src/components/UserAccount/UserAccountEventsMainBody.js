import React, { useEffect } from "react";
import EventCard from "../EventCard";
import { useSelector, useDispatch } from "react-redux";
import YouHaveNoEventComing from "./YouHaveNoEventsComing";
import { errorTrackerForMadeJustForYou, madeJustForYou } from "../../actions";
import dateFormat from "dateformat";
import Loader from "../Loader";
const UserAccountEventsMainBody = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(madeJustForYou());
  }, [dispatch]);
  const { events, isLoading, error } = useSelector((state) => state.event);
  console.log(events);

  if (error) {
    dispatch(errorTrackerForMadeJustForYou());
    alert(error);
    return;
  }

  const renderSuggestedEventsList = (events) => {
    if (events.length !== 0) {
      return events.map((event) => {
        const now = new Date(event.startDate);
        const formatedDate = dateFormat(now, "mmm dS, h:MM TT");

        const end = new Date(event.endDate);
        const formatedEndDate = dateFormat(end, "mmm dS, h:MM TT");

        return (
          <EventCard
            image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
            date={formatedDate}
            id={event.id}
            eventName={event.eventName}
            minPrice={event.minTicketPrice}
            maxPrice={event.maxTicketPrice}
            endDate={formatedEndDate}
            rating={(event.communityRating * 1).toFixed(1)}
          />
        );
      });
    }
  };

  return (
    <div className="user-account-main-body-home-content">
      <div
        className="user-account-main-body-home-content-left ps-2"
        style={{ overflow: "auto", height: "85vh" }}
      >
        <div className="user-account-main-body-headline pb-4 ps-4">
          Made Just For You
        </div>
        <div
          style={{ height: "100%" }}
          // className="d-flex flex-row justify-content-center align-items-center"
        >
          {typeof events !== "undefined" && events.length > 0 ? (
            <div className="user-account-events-event-card-grid px-2 py-2">
              {isLoading ? (
                <div
                  className="d-flex flex-row align-items-center justify-content-center"
                  style={{ height: "80vh", width: "80vw" }}
                >
                  <Loader />
                </div>
              ) : (
                renderSuggestedEventsList(events)
              )}
            </div>
          ) : (
            <YouHaveNoEventComing msgText="Looks like there are no great matches for you" style={{maxWidth: "400px"}} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccountEventsMainBody;
