import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import YouHaveNoEventComing from "./YouHaveNoEventsComing";
import { errorTrackerForMadeJustForYou, madeJustForYou } from "../../actions";
import dateFormat from "dateformat";
import Loader from "../Loader";
import EventCard from "./../EventCard";

import { DashboardSectionHeading } from "./Elements";

const UserAccountEventsMainBody = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(madeJustForYou());
  }, [dispatch]);
  const { events, isLoading, error } = useSelector((state) => state.event);
  // console.log(events);

  if (error) {
    return dispatch(errorTrackerForMadeJustForYou());
  }

  const renderSuggestedEventsList = (events) => {
    if (!events) return;
    if (events.length !== 0) {
      return events.map((event) => {
        const now = new Date(event.startDate);
        const formatedDate = dateFormat(now, "mmm dS, h:MM TT");

        const end = new Date(event.endDate);
        const formatedEndDate = dateFormat(end, "mmm dS, h:MM TT");

        const startTime = dateFormat(event.startTime, "mmm dS, h:MM TT");
        const endTime = dateFormat(event.endTime, "mmm dS, h:MM TT");

        return (
          <EventCard
            image={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${event.image}`}
            date={formatedDate}
            id={event.id}
            eventName={event.eventName}
            minPrice={event.minTicketPrice}
            maxPrice={event.maxTicketPrice}
            endDate={formatedEndDate}
            startTime={startTime}
            endTime={endTime}
            rating={(event.communityRating * 1).toFixed(1)}
            communityId={event.createdBy}
          />
        );
      });
    }
  };

  return (
    <div
      className="user-account-main-body-home-content"
      style={{ height: "100%" }}
    >
      <div
        className="user-account-main-body-home-content-left ps-2"
        style={{ overflow: "auto", height: "100%" }}
      >
        <DashboardSectionHeading className="pb-4 ps-4">
          Exclusive events for you
        </DashboardSectionHeading>
        <div style={{ height: "100%" }}>
          {typeof events !== "undefined" && events.length > 0 ? (
            <div className="user-account-events-event-card-grid px-2 py-2">
              {isLoading ? (
                <div
                  className="d-flex flex-row align-items-center justify-content-center"
                  style={{ height: "100%", width: "80vw" }}
                >
                  <Loader />
                </div>
              ) : (
                renderSuggestedEventsList(events)
              )}
            </div>
          ) : (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "100%" }}
            >
              <YouHaveNoEventComing
                msgText="Looks like there are no great matches for you"
                style={{ maxWidth: "400px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccountEventsMainBody;
