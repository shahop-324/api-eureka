import React from "react";
import styled from 'styled-components';
import { IconButton } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip } from "@material-ui/core";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import dateFormat from "dateformat";
import AddToCalender from "./../HelperComponent/AddTocalender";

const SessionTimeline = styled.div`
font-weight: 500;
  font-size: 0.9rem;
  color: #212121;
`;

const SessionName = styled.div`
font-weight: 500;
  font-size: 1rem;
  color: #212121;`;

const SessionBrief = styled.div`
font-weight: 400;
  font-size: 0.85rem;
  color: #212121;

`;

const SessionCard = ({
  startDate,
  startTime,
  endTime,
  sessionName,
  sessionDescription,
  speakerAvatarList,
  id,
}) => {
  const [openCalender, setOpenCalender] = React.useState(false);

  const handleCloseCalender = () => {
    setOpenCalender(false);
  };

  const renderSpeakerAvatarList = (speakerAvatarList) => {
    console.log(speakerAvatarList);
    if (speakerAvatarList) {
      return speakerAvatarList.map((speaker) => {
        return (
          <Tooltip title={speaker.firstName} aria-label={speaker.firstName}>
            <Avatar
              variant="rounded"
              alt={speaker.firstName}
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${speaker.image}`}
            />
          </Tooltip>
        );
      });
    }
    return <div />;
  };

  return (
    <>
      <div key={id} className="session-card mb-3 px-3 py-4">
        <div className="d-flex flex-row align-items-center justify-content-between mb-3">
          <SessionTimeline className="session-date-time-venue-section">
            {dateFormat(startTime, "mmm dS, h:MM TT")} -{" "}
            {dateFormat(endTime, "mmm dS, h:MM TT")}
          </SessionTimeline>

          <div
            onClick={() => {
              setOpenCalender(true);
            }}
          >
            <IconButton>
              <EventRoundedIcon />
            </IconButton>
          </div>
        </div>

        <SessionName className="session-name mb-2">{sessionName}</SessionName>
        <SessionBrief className="session-description mb-2">{sessionDescription}</SessionBrief>

        <div className="session-speakers-grid pt-3">
          {renderSpeakerAvatarList(speakerAvatarList)}
        </div>
      </div>
      <AddToCalender open={openCalender} handleClose={handleCloseCalender} />
    </>
  );
};

export default SessionCard;
