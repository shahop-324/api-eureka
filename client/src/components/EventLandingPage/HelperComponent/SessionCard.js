import React from "react";
import { IconButton } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { Tooltip } from "@material-ui/core";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import dateFormat from "dateformat";
import AddToCalender from "./../HelperComponent/AddTocalender";

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
          <div className="session-date-time-venue-section">
            {dateFormat(startTime, "mmm dS, h:MM TT")} -{" "}
            {dateFormat(endTime, "mmm dS, h:MM TT")}
          </div>

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

        <div className="session-name mb-2">{sessionName}</div>
        <div className="session-description mb-2">{sessionDescription}</div>

        <div className="session-speakers-grid pt-3">
          {renderSpeakerAvatarList(speakerAvatarList)}
        </div>
      </div>
      <AddToCalender open={openCalender} handleClose={handleCloseCalender} />
    </>
  );
};

export default SessionCard;
