import React from "react";
import "./../Styles/root.scss";

import SessionDetailCard from "./SessionDetailCard";

const SessionDetailCardsList = ({
  sessions,
  socket,
  id,
  role,
  eventId,
  communityId,
}) => {
  console.log(sessions);

  const renderSessionList = (sessions, socket) => {
    return sessions.map((session) => {
      const duration = new Date(session.endTime) - new Date(session.startTime);
      console.log(duration);
      return (
        <SessionDetailCard
        socket={socket}
          key={session.id}
          id={session.id}
          name={session.name}
          description={session.description}
          speakers={session.speaker}
          duration={duration}
          startTime={session.startTime}
        />
      );
    });
  };

  return <div className="session-card-list">{renderSessionList(sessions, socket)}</div>;
};

export default SessionDetailCardsList;
