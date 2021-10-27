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
  

  const renderSessionList = (sessions, socket) => {
    return sessions.map((session) => {
      const duration = new Date(session.endTime) - new Date(session.startTime);
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
          hosts={session.host}
          runningStatus={session.runningStatus}
        />
      );
    });
  };

  return <div className="session-card-list">{renderSessionList(sessions, socket)}</div>;
};

export default SessionDetailCardsList;
