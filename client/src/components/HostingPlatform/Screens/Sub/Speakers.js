import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { makeStyles } from "@material-ui/core/styles";
import Faker from "faker";
import PersonProfile from "../../PersonProfile";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import NoContent from "./../../NoContent";
import NoSpeaker from "./../../../../assets/images/NoSpeaker.svg";
import { fetchEventSpeakers } from "./../../../../actions";

const useStyles = makeStyles((theme) => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const EventSpeakersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 24px;
`;

const SpeakerCardBody = styled.div`
  background-color: #2a2a2a;
  border-radius: 10px;
  height: auto;
  min-height: 300px;

  &:hover {
    cursor: pointer;
  }
`;

const SpeakerImg = styled.img`
  height: 200px;
  width: 100%;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  object-fit: cover;
`;

const SpeakerName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #ffffff;
  font-size: 0.93rem;
`;

const SpeakerDesignationOrg = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #ffffff;
  font-size: 0.78rem;
`;

const SpeakerCardComponent = ({
  name,
  image,
  organisation,
  designation,
  person,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const { userDetails } = useSelector((state) => state.user);
  let isMe = false;

  if (person._id.toString() === userDetails._id.toString()) {
    isMe = true;
  }

  return (
    <>
      <SpeakerCardBody className="">
        <Avatar
          alt={name}
          src={image}
          variant={"rounded"}
          style={{ height: "210px", width: "100%" }}
        />
        <div className="p-3">
          <SpeakerName className="mb-3">
            {name} {" "} {isMe && <span>(You)</span>}{" "}
          </SpeakerName>
          <div className="d-flex flex-row align-items-center justify-content-between">
            <div>
              <SpeakerDesignationOrg className="mb-2">
                {designation}
              </SpeakerDesignationOrg>
              <SpeakerDesignationOrg>{organisation}</SpeakerDesignationOrg>
            </div>

            <button
              className="btn btn-light btn-outline-text"
              onClick={() => {
                setOpen(true);
              }}
            >
              View profile
            </button>
          </div>
        </div>
      </SpeakerCardBody>

      <PersonProfile open={open} handleClose={handleClose} person={person} />
    </>
  );
};

const renderSpeakers = (speakers) => {
  return speakers.map((speaker) => {
    return (
      <SpeakerCardComponent
        person={speaker}
        name={speaker.firstName + " " + speaker.lastName}
        image={
          speaker.image
            ? speaker.image.startsWith("https://")
              ? speaker.image
              : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${speaker.image}`
            : ""
        }
        organisation={speaker.organisation}
        designation={speaker.designation}
      />
    );
  });
};

const Speakers = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { eventDetails } = useSelector((state) => state.event);
  const { speakers } = useSelector((state) => state.speaker);
  const eventId = params.eventId;

  // Fetch all speakers of this event
  useEffect(() => {
    dispatch(fetchEventSpeakers(eventId));
  }, []);

  return (
    <>
      {typeof speakers !== "undefined" && speakers.length > 0 ? (
        <EventSpeakersGrid> {renderSpeakers(speakers)} </EventSpeakersGrid>
      ) : (
        <div
          style={{ width: "100%" }}
          className="d-flex flex-row align-items-center justify-content-center mt-4"
        >
          <NoContent
            Msg={"There are no speakers in this event yet."}
            Image={NoSpeaker}
          />
        </div>
      )}
    </>
  );
};

export default Speakers;
