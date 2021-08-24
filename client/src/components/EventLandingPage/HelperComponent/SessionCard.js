import React from "react";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip } from "@material-ui/core";
var dateFormat = require("dateformat");

const SessionCard = ({
  startDate,
  startTime,
  endTime,
  sessionName,
  sessionDescription,
  speakerAvatarList,
  id,
}) => {
  const renderSpeakerAvatarList = (speakerAvatarList) => {
    console.log(speakerAvatarList);
    if (speakerAvatarList) {
      return speakerAvatarList.map((speaker) => {
        return (
          <Tooltip title={speaker.firstName} aria-label={speaker.firstName}>
            <Avatar
              variant="rounded"
              alt={speaker.firstName}
              src={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${speaker.image}`}
            />
          </Tooltip>
        );
      });
    }
    return <div />;
  };

  return (
    <div key={id} className="session-card mb-3 px-3 py-4">
      <div className="session-date-time-venue-section mb-3">
        
        {dateFormat(startTime, "mmm dS, h:MM TT")} - {dateFormat(endTime, "mmm dS, h:MM TT")}
      </div>
      <div className="session-name mb-2">{sessionName}</div>
      <div className="session-description mb-2">{sessionDescription}</div>

      <div className="session-speakers-grid pt-3">
        {renderSpeakerAvatarList(speakerAvatarList)}
      </div>
    </div>
  );
};

export default SessionCard;
