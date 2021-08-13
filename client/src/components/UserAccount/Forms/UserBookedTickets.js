/* eslint-disable no-unused-vars */
import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../../EventCard";
import YouHaveNoEventComing from "../YouHaveNoEventsComing";
import dateFormat from "dateformat";

const UserBookedTickets = () => {
  const { registeredInEvents, isLoading, error } = useSelector((state) => state.user.userDetails);

  const renderThisMonthRegisteredEvents = () => {
    if (registeredInEvents.length !== 0) {
      return registeredInEvents.map((event) => {
        // var date = new Date(event.startDate);
        // console.log(date);
        // var newDate = new Date(date.setMonth(date.getMonth() + 1));
        // console.log(newDate);

        const end = new Date(event.endDate);
        const formatedEndDate = dateFormat(end,  "mmm dS, h:MM TT");

        const now = new Date(event.startDate);
        const formatedDate = dateFormat(now, "mmm dS, h:MM TT");
        console.log(event.createdBy)

        return (
          <EventCard
            image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
            key={event.id}
            date={formatedDate}
            eventName={event.eventName}
            minPrice={event.minTicketPrice}
            maxPrice={event.maxTicketPrice}
            id={event.id}
            showBtn={true}
            communityId={event.createdBy._id}
            endDate={formatedEndDate}
            rating={(event.communityRating * 1 ).toFixed(1)}
          />
        );
      });
    } else {
      return (
        <YouHaveNoEventComing msgText="You have not yet registered in any event yet." />
      );
    }
  };

  return (
    <>
      <div className="user-profile-booked-ticket-section">
        <div className="mb-4">
          <h3 className="booked-ticket-sub-heading mb-3">
            Your Booked Events ({registeredInEvents.length})
          </h3>
          <div>
            <div className="user-account-booked-event-card-grid  py-2">
              {renderThisMonthRegisteredEvents()}
            </div>
          </div>
        </div>
        {/* <div className="mb-4">
            <h3 className="booked-ticket-sub-heading mb-3">
              Upcoming Events (1)
            </h3>
            <div>
              <div className="user-account-booked-event-card-grid  py-2">
                <EventCard />
              </div>
            </div>
          </div> */}
        {/* <div className="mb-4">
            <h3 className="booked-ticket-sub-heading mb-3">Past Events (5)</h3>
            <div>
              <div className="user-account-booked-event-card-grid  py-2">
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
                <EventCard />
              </div>
            </div>
          </div> */}
      </div>
    </>
  );
};

export default UserBookedTickets;
