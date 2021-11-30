import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { TwitterPicker } from "react-color";

import { Divider } from "@material-ui/core";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import { withStyles } from "@material-ui/core/styles";

import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import { editSession, getVibes } from "./../../../actions";
import α from "color-alpha";

const RoyalSwitch = withStyles({
  switchBase: {
    color: (props) => (props && props.color ? α(props.color, 0.85) : "#538BF7"),
    "&$checked": {
      color: (props) =>
        props && props.color ? α(props.color, 1.2) : "#3474f3",
    },
    "&$checked + $track": {
      backgroundColor: (props) =>
        props && props.color ? α(props.color, 0.56) : "#145DF0",
    },
  },
  checked: {},
  track: {},
})(Switch);

const CustomHorizontalTabWarpper = styled.div`
  width: 500px;
  height: auto;
  border-radius: 10px;
  background-color: ${(props) =>
    props && props.color ? α(props.color, 0.5) : "#345b63"};

  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

const CustomTabButton = styled.div`
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  color: #fff;
  align-self: center;

  text-align: center;
  padding: 6px 12px;
  background-color: ${(props) =>
    props.active && props.active ? α(props.color, 1) : α(props.color, 0.5)};
  border-radius: 10px;
  border: 1px solid transparent;

  &:hover {
    border: 1px solid #fff;
    background-color: transparent;
    cursor: pointer;
  }
`;

const FormLabelUI = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
  font-family: "Ubuntu";
  color: #152d35;

  margin-bottom: 6px;
`;

const VibesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 16px;
  align-items: center;
  width: 500px;
`;

const VibeCard = styled.div`
  font-size: 0.7rem;
  font-weight: 500;
  color: #686868;
  font-family: "Ubuntu";
  text-align: center;
  border-radius: 8px;
  border: ${(props) =>
    props && props.selected
      ? `2px solid ${props.color}`
      : "2px solid transparent"};

  img {
    border: 2px solid transparent;
    /* padding: 5px; */
    height: 80px;
    border-radius: 8px;

    object-fit: cover;
    margin-bottom: 5px;

    &:hover {
      border: ${(props) =>
        props && props.color
          ? `2px solid ${props.color}`
          : `2px solid #152d35`};
    }
  }

  &:hover {
    font-weight: 500;
    color: ${(props) => (props && props.color ? props.color : "#152d35")};
    cursor: pointer;
  }
`;

const NoVibeCard = styled.div`
  font-size: 0.7rem;
  font-weight: 500;
  color: #535353;
  font-family: "Ubuntu";
  text-align: center;

  border: ${(props) =>
    props && props.selected
      ? `2px solid ${props.color}`
      : "2px solid transparent"};

  height: 100%;
  width: 100%;
  background-color: #dddddd;
  border-radius: 8px;

  &:hover {
    border: ${(props) =>
      props && props.color ? `2px solid ${props.color}` : `2px solid #152d35`};
    font-weight: 500;
    color: ${(props) => (props && props.color ? props.color : "#152d35")};
    cursor: pointer;
  }
`;

const SessionTheme = () => {
  const dispatch = useDispatch();

  const { sessionDetails } = useSelector((state) => state.session);

  const [background, setBackground] = useState(sessionDetails.theme);

  const { eventDetails } = useSelector((state) => state.event);

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };

  useEffect(() => {
    setBackground(sessionDetails.theme);
  }, [sessionDetails]);

  return (
    <>
      <div className="mb-4">
        <FormLabelUI>Color</FormLabelUI>
        <div
          className="theme-color-preview mb-3"
          style={{ backgroundColor: background }}
        ></div>
        <TwitterPicker
          color={background}
          onChangeComplete={handleChangeComplete}
        />
        <div className="d-flex flex-row align-items-center justify-content-end mt-3">
          <button
            onClick={() => {
              dispatch(editSession({ theme: "#152d35" }, sessionDetails._id));
            }}
            className="btn btn-outline-text btn-outline-dark me-3"
          >
            Reset
          </button>
          <button
            style={{
              backgroundColor: eventDetails.color,
              border: `1px solid ${eventDetails.color}`,
            }}
            onClick={() => {
              dispatch(editSession({ theme: background }, sessionDetails._id));
            }}
            className="btn btn-outline-text btn-dark"
          >
            Apply
          </button>
        </div>
      </div>
    </>
  );
};

const SessionWidgets = () => {
  const dispatch = useDispatch();

  const { sessionDetails } = useSelector((state) => state.session);

  const { eventDetails } = useSelector((state) => state.event);

  const [liveChat, setLiveChat] = useState(
    sessionDetails ? sessionDetails.liveChat : false
  );

  const [peopleInSession, setPeopleInSession] = useState(
    sessionDetails ? sessionDetails.peopleInSession : false
  );

  const [raiseHand, setRaiseHand] = useState(
    sessionDetails ? sessionDetails.raiseHand : false
  );

  const [qna, setqna] = useState(sessionDetails ? sessionDetails.qna : false);

  const [polls, setPolls] = useState(
    sessionDetails ? sessionDetails.polls : false
  );

  const [videos, setVideos] = useState(
    sessionDetails ? sessionDetails.videos : false
  );

  const [attendeeCount, setAttendeeCount] = useState(
    sessionDetails ? sessionDetails.attendeeCount : false
  );

  const [emojiReactions, setEmojiReactions] = useState(
    sessionDetails ? sessionDetails.emojiReactions : false
  );

  const formValues = {
    liveChat,
    peopleInSession,
    raiseHand,
    qna,
    polls,
    videos,
    attendeeCount,
    emojiReactions,
  };

  return (
    <>
      <div>
        <div className="d-flex flex-column mb-4">
          <div className="setting-tab-sub-text">
            Here you can hide areas that you don't want in your session.
          </div>
        </div>

        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">Live chat</div>
          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={liveChat}
                    onChange={(e) => {
                      setLiveChat(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.liveChat = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="liveChat"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">People in session</div>
          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={peopleInSession}
                    onChange={(e) => {
                      setPeopleInSession(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.peopleInSession = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="peopleInSession"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>

        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">Raise hand</div>
          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={raiseHand}
                    onChange={(e) => {
                      setRaiseHand(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.raiseHand = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="raiseHand"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">Q & A</div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={qna}
                    onChange={(e) => {
                      setqna(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.qna = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="qna"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">Polls</div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={polls}
                    onChange={(e) => {
                      setPolls(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.polls = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="polls"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">Videos</div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={videos}
                    onChange={(e) => {
                      setVideos(e.target.checked);
                      let newFormValues = { ...formValues };
                      newFormValues.videos = e.target.checked;
                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="videos"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">Attendee count</div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={attendeeCount}
                    onChange={(e) => {
                      setAttendeeCount(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.attendeeCount = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="attendeeCount"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
        <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
          <div className="hosting-platform-widget-name">
            Emoji reactions on stage
          </div>

          <div>
            <FormGroup row>
              <FormControlLabel
                control={
                  <RoyalSwitch
                    color={eventDetails.color}
                    checked={emojiReactions}
                    onChange={(e) => {
                      setEmojiReactions(e.target.checked);

                      let newFormValues = { ...formValues };
                      newFormValues.emojiReactions = e.target.checked;

                      dispatch(editSession(newFormValues, sessionDetails._id));
                    }}
                    name="emojiReaction"
                  />
                }
              />
            </FormGroup>
          </div>
        </div>
        <div className="my-3">
          <Divider />
        </div>
      </div>
    </>
  );
};

const VibeComponent = ({ vibe }) => {
  const dispatch = useDispatch();

  const { sessionDetails } = useSelector((state) => state.session);
  const { eventDetails } = useSelector((state) => state.event);

  return (
    <>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === vibe.key ? true : false}
        onClick={() => {
          dispatch(editSession({ vibe: vibe.key }, sessionDetails._id));
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${vibe.key}`}
          alt={vibe.name}
        />
        <div>{vibe.name}</div>
      </VibeCard>
    </>
  );
};

const renderVibesList = (vibes) => {
  return vibes.map((vibe) => {
    return <VibeComponent vibe={vibe} />;
  });
};

const SessionVibes = () => {
  const params = useParams();
  const eventId = params.eventId;

  const dispatch = useDispatch();

  const { sessionDetails } = useSelector((state) => state.session);

  const { eventDetails } = useSelector((state) => state.event);

  useEffect(() => {
    dispatch(getVibes(eventId));
  }, []);

  const { vibes } = useSelector((state) => state.vibe);

  return (
    <VibesGrid>
      <NoVibeCard
        color={eventDetails.color}
        selected={!sessionDetails.vibe ? true : false}
        onClick={() => {
          dispatch(editSession({ vibe: "" }, sessionDetails._id));
        }}
        className="d-flex flex-row align-items-center justify-content-center"
      >
        <span>No vibe</span>
      </NoVibeCard>
      {renderVibesList(vibes)}
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/winter.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/winter.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/winter.jpeg`}
          alt={"Winter"}
        />
        <div>Winter</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/ice.jpeg" ? true : false}
        onClick={() => {
          dispatch(editSession({ vibe: "Vibes/ice.jpeg" }, sessionDetails._id));
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/ice.jpeg`}
          alt={"Winter"}
        />
        <div>Ice</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/sunrise.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/sunrise.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/sunrise.jpeg`}
          alt={"Winter"}
        />
        <div>Sunrise</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/sunset.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/sunset.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/sunset.jpeg`}
          alt={"Winter"}
        />
        <div>Sunset</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={
          sessionDetails.vibe === "Vibes/Darkchristmas.jpeg" ? true : false
        }
        onClick={() => {
          dispatch(
            editSession(
              { vibe: "Vibes/Darkchristmas.jpeg" },
              sessionDetails._id
            )
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/Darkchristmas.jpeg`}
          alt={"Winter"}
        />
        <div>Dark Christmas</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/christmas.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/christmas.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/christmas.jpeg`}
          alt={"Winter"}
        />
        <div>Christmas</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/Mountains.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/Mountains.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/Mountains.jpeg`}
          alt={"Winter"}
        />
        <div>Mountains</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/Festival.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/Festival.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/Festival.jpeg`}
          alt={"Winter"}
        />
        <div>Festival</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/new_year.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/new_year.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/new_year.jpeg`}
          alt={"Winter"}
        />
        <div>New year</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/desert.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/desert.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/desert.jpeg`}
          alt={"Winter"}
        />
        <div>Desert</div>
      </VibeCard>

      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/ocean.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/ocean.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/ocean.jpeg`}
          alt={"Winter"}
        />
        <div>Ocean</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/winter.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/winter.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/winter.jpeg`}
          alt={"Winter"}
        />
        <div>Winter</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/rocks.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/rocks.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/rocks.jpeg`}
          alt={"Winter"}
        />
        <div>Rocks</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/beach.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/beach.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/beach.jpeg`}
          alt={"Winter"}
        />
        <div>Beach</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/startup.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/startup.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/startup.jpeg`}
          alt={"Startup"}
        />
        <div>Startup</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={
          sessionDetails.vibe === "Vibes/Technology_Image.jpg" ? true : false
        }
        onClick={() => {
          dispatch(
            editSession(
              { vibe: "Vibes/Technology_Image.jpg" },
              sessionDetails._id
            )
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/Technology_Image.jpg`}
          alt={"Tech"}
        />
        <div>Technology</div>
      </VibeCard>
      <VibeCard
        color={eventDetails.color}
        selected={sessionDetails.vibe === "Vibes/finance.jpeg" ? true : false}
        onClick={() => {
          dispatch(
            editSession({ vibe: "Vibes/finance.jpeg" }, sessionDetails._id)
          );
        }}
      >
        <img
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/Vibes/finance.jpeg`}
          alt={"Finance"}
        />
        <div>Finance</div>
      </VibeCard>
    </VibesGrid>
  );
};

const SessionCustomisation = () => {
  const [selectedTab, setSelectedTab] = useState("color");

  const [checked, setChecked] = React.useState(false);

  const { eventDetails } = useSelector((state) => state.event);

  const handleChangeToggle = () => {
    setChecked(!checked);
  };

  return (
    <>
      <CustomHorizontalTabWarpper
        color={eventDetails.color}
        className="px-3 mb-4"
      >
        <CustomTabButton
          color={eventDetails.color}
          active={selectedTab === "color" ? true : false}
          onClick={() => {
            setSelectedTab("color");
          }}
        >
          Color
        </CustomTabButton>
        <CustomTabButton
          color={eventDetails.color}
          active={selectedTab === "vibes" ? true : false}
          onClick={() => {
            setSelectedTab("vibes");
          }}
        >
          Vibes
        </CustomTabButton>
        <CustomTabButton
          color={eventDetails.color}
          active={selectedTab === "widget" ? true : false}
          onClick={() => {
            setSelectedTab("widget");
          }}
        >
          Widget
        </CustomTabButton>
      </CustomHorizontalTabWarpper>

      {(() => {
        switch (selectedTab) {
          case "color":
            return (
              // Here we need session theme component
              <SessionTheme />
            );

          case "widget":
            return (
              // Here we need widget component
              <SessionWidgets />
            );

          case "vibes":
            return (
              // Here we need vibes component
              <SessionVibes />
            );

          default:
            return <div>This is session customisation</div>;
        }
      })()}
    </>
  );
};

export default SessionCustomisation;
