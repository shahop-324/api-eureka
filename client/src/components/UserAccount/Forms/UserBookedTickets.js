import React from 'react';
import EventCard from "../../EventCard";

const UserBookedTickets = () => {
    return (
        <>
        <div className="user-profile-booked-ticket-section">
          <div className="mb-4">
            <h3 className="booked-ticket-sub-heading mb-3">
              Ongoing Events (2)
            </h3>
            <div>
              <div className="user-account-booked-event-card-grid  py-2">
                <EventCard />
                <EventCard />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h3 className="booked-ticket-sub-heading mb-3">
              Upcoming Events (1)
            </h3>
            <div>
              <div className="user-account-booked-event-card-grid  py-2">
                <EventCard />
              </div>
            </div>
          </div>
          <div className="mb-4">
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
          </div>
        </div>
        </>
    );
}

export default UserBookedTickets;