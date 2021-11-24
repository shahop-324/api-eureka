/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import socket from "./../HostingPlatform/service/socket";
import { Avatar } from "@material-ui/core";
import PersonProfile from "./../HostingPlatform/PersonProfile";
import { Dropdown } from "semantic-ui-react";
import {
  fetchEventVideos,
  showSnackbar,
  setVenueRightDrawerSelectedTab,
  setChatSelectedTab,
  setPersonalChatConfig,
  setOpenVenueRightDrawer,
} from "./../../actions";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded"; // Resume
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import FormatListBulletedRoundedIcon from "@mui/icons-material/FormatListBulletedRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Popover from "@mui/material/Popover";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import Typography from "@mui/material/Typography";

import StopCircleRoundedIcon from "@mui/icons-material/StopCircleRounded"; // Stop video

import {
  SessionLinkNav,
  SessionVideoContainer,
  SessionSideDrawer,
  SessionSideIconBtnNav,
  ViewCompleteProfileBtn,
  UserRoleTag,
  PersonName,
  PeopleListWidget,
  LinkTab,
  Divider,
  TabButton,
  BtnOutlined,
} from "./Elements";

import { makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import MainChatComponent from "../HostingPlatform/StageSideBar/Chat/MainChatComponent";
import MainQnAComponent from "../HostingPlatform/StageSideBar/QnA/MainQnAComponent";
import MainPollComponent from "../HostingPlatform/StageSideBar/Poll/MainPollComponent";

const DropdownIcon = ({ switchView, view }) => (
  <Dropdown
    icon={
      view === "list" ? (
        <FormatListBulletedRoundedIcon style={{ fontSize: "18px" }} />
      ) : (
        <GridViewRoundedIcon style={{ fontSize: "18px" }} />
      )
    }
    button
    className="icon"
  >
    <Dropdown.Menu style={{ right: "0", left: "auto" }}>
      <Dropdown.Item
        icon={
          <FormatListBulletedRoundedIcon
            style={{ fontSize: "18px" }}
            className="me-2"
          />
        }
        text="List"
        onClick={() => {
          switchView("list");
        }}
      />
      <Dropdown.Item
        icon={
          <GridViewRoundedIcon style={{ fontSize: "18px" }} className="me-2" />
        }
        text="Grid"
        onClick={() => {
          switchView("grid");
        }}
      />
    </Dropdown.Menu>
  </Dropdown>
);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  medium: {
    width: theme.spacing(5),
    height: theme.spacing(5),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const PopOverBox = styled.div`
  height: auto;
  width: 280px;
  border-radius: 15px;
  background-color: #ffffff;
`;

const ChatPopup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 3px;
  height: 56px;
  width: 56px;
  background-color: #ffffff;
  z-index: 10000;

  &:hover {
    cursor: pointer;
  }

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PeopleGridComponent = ({ person }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [openProfile, setOpenProfile] = useState(false);

  const handleCloseProfile = () => {
    setOpenProfile(false);
  }

  return (
    <>
      <div>
        {open && (
          <ChatPopup
            onClick={() => {
              // dispatch(setVenueRightDrawerSelectedTab("feed"));
              // dispatch(setChatSelectedTab("private"));
              // dispatch(setPersonalChatConfig(person._id));
              // dispatch(setOpenVenueRightDrawer(true));
              setOpenProfile(true);
            }}
            aria-owns={open ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            <PersonRoundedIcon />
          </ChatPopup>
        )}

        <Avatar
          aria-owns={open ? "mouse-over-popover" : undefined}
          aria-haspopup="true"
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`}
          alt={`${person.firstName} ${person.lastName}`}
          variant="rounded"
          className={classes.large}
        />
      </div>

      {/*  */}
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: "none",
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <PopOverBox className="px-3 py-2">
          <div className="d-flex flex-row align-items-top mb-3">
            <Avatar
              className={classes.medium}
              variant="rounded"
              src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`}
            />
            <div className="ms-3">
              <PersonName className="mb-2">{`${person.firstName} ${person.lastName}`}</PersonName>
              <PersonName
                style={{ color: "#6D6D6D" }}
              >{`${person.designation} ${person.organisation}`}</PersonName>
            </div>
          </div>
        </PopOverBox>
      </Popover>
      <PersonProfile
      hideBtns={true}
          open={openProfile}
          userId={person._id}
          handleClose={handleCloseProfile}
          userImage={person.image}
          userName={`${person.firstName} ${person.lastName}`}
          userOrganisation={person.organisation}
          userDesignation={person.designation}
        />
    </>
  );
};

const PeopleListComponent = ({ person }) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <>
        <PeopleListWidget className="mb-3">
          <div className="d-flex flex-row mb-4 justify-content-between">
            <div className="d-flex flex-row">
              <Avatar
                src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`}
                alt={person.firstName}
                variant="rounded"
                className="me-3"
              />
              <div>
                <PersonName>
                  {`${person.firstName} ${person.lastName}`}
                </PersonName>
                {person.designation && person.organisation ? (
                  <PersonName>
                    {`${person.designation}, ${person.organisation}`}
                  </PersonName>
                ) : (
                  <></>
                )}
              </div>
            </div>
            {/* <UserRoleTag>Host</UserRoleTag> */}
          </div>
          <ViewCompleteProfileBtn
            onClick={() => {
              // open person profile
              setOpen(true);
            }}
          >
            View complete profile
          </ViewCompleteProfileBtn>
        </PeopleListWidget>
        <PersonProfile
         hideBtns={true}
          open={open}
          userId={person._id}
          handleClose={handleClose}
          userImage={person.image}
          userName={`${person.firstName} ${person.lastName}`}
          userOrganisation={person.organisation}
          userDesignation={person.designation}
        />
      </>
    </>
  );
};

const VideoListComponent = ({ video, eventId, sessionId, sessionDetails }) => {
  const dispatch = useDispatch();

  return (
    <>
      <SessionVideoContainer className="mb-3">
        <video
          src={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${video.key}`}
          style={{
            borderRadius: "5px",
            height: "150px",
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          className="mb-3"
          alt="video cover"
        ></video>

        {sessionDetails.video ===
        `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${video.key}` ? (
          <BtnOutlined
            style={{ color: "#D63D3D", border: "1px solid #D63D3D" }}
            onClick={() => {
              socket.emit(
                "stopVideo",
                {
                  sessionId: sessionId,
                },
                (error) => {
                  alert(error);
                }
              );
            }}
          >
            <StopCircleRoundedIcon
              className="me-2"
              style={{ fontSize: "20px", color: "#D63D3D" }}
            />
            Stop playing
          </BtnOutlined>
        ) : (
          <BtnOutlined
            onClick={() => {
              if (sessionDetails.video) {
                // Show snackbar to stop previous video
                dispatch(
                  showSnackbar("info", "Please stop previous video to play.")
                );
              } else {
                socket.emit(
                  "playVideo",
                  {
                    url: `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${video.key}`,
                    sessionId: sessionId,
                  },
                  (error) => {
                    alert(error);
                  }
                );
              }
            }}
          >
            <PlayArrowRoundedIcon
              className="me-2"
              style={{ fontSize: "20px" }}
            />
            Play on stage
          </BtnOutlined>
        )}
      </SessionVideoContainer>
    </>
  );
};

const renderPeopleGrid = (people, classes) => {
  return people.map((person) => {
    return <PeopleGridComponent person={person} />;
  });
};

const renderPeopleList = (people) => {
  return people.map((person) => {
    return <PeopleListComponent person={person} />;
  });
};

const renderVideos = (videos, eventId, sessionId, sessionDetails) => {
  return videos.map((video) => {
    return (
      <VideoListComponent
        video={video}
        eventId={eventId}
        sessionId={sessionId}
        sessionDetails={sessionDetails}
      />
    );
  });
};

const renderRaisedHands = (people, eventId, sessionId) => {
  return people.map((person) => {
    return (
      <PeopleListWidget className="mb-3">
        <div className="d-flex flex-row mb-4 justify-content-between">
          <div className="d-flex flex-row">
            <Avatar
              src={
                person.image
                  ? person.image.startsWith("https://")
                    ? person.image
                    : `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${person.image}`
                  : ""
              }
              alt={person.name}
              variant="rounded"
              className="me-3"
            />
            <div>
              <PersonName>{person.name}</PersonName>
              {person.designation && person.organisation ? (
                <PersonName>{`${person.designation}, ${person.organisation}`}</PersonName>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        {person.isOnStage ? (
          <ViewCompleteProfileBtn
            onClick={() => {
              socket.emit(
                "removeFromStage",
                {
                  userId: person.userId,
                  eventId: eventId,
                  sessionId: sessionId,
                },
                (error) => {
                  alert(error);
                }
              );
            }}
            style={{ backgroundColor: "#152d35", color: "#ffffff" }}
          >
            Put off stage
          </ViewCompleteProfileBtn>
        ) : (
          <div className="d-flex flex-row align-items-center">
            <ViewCompleteProfileBtn
              style={{ width: "48%" }}
              onClick={() => {
                socket.emit(
                  "putOnStage",
                  {
                    userId: person.userId,
                    eventId: eventId,
                    sessionId: sessionId,
                  },
                  (error) => {
                    alert(error);
                  }
                );
              }}
            >
              Put on stage
            </ViewCompleteProfileBtn>

            <ViewCompleteProfileBtn
              style={{ width: "48%" }}
              onClick={() => {
                socket.emit(
                  "rejectMicRequest",
                  {
                    userId: person.userId,
                    eventId: eventId,
                    sessionId: sessionId,
                  },
                  (error) => {
                    alert(error);
                  }
                );
              }}
            >
              Reject
            </ViewCompleteProfileBtn>
          </div>
        )}
      </PeopleListWidget>
    );
  });
};

const StageSideDrawerComponent = ({ runningStatus }) => {
  const params = useParams();
  const dispatch = useDispatch();
  const eventId = params.eventId;
  const { sessionDetails } = useSelector((state) => state.session);

  const { videos } = useSelector((state) => state.eventVideos);

  useEffect(() => {
    dispatch(fetchEventVideos(eventId));
  }, []);

  const sessionId = params.sessionId;

  // Filter out unique raised hands with personal and media tracks information

  let uniqueIds = [];
  let uniqueRaisedHands = [];

  for (let element of sessionDetails.raisedHands) {
    if (element.userId) {
      for (let item of sessionDetails.onStagePeople) {
        if (item.user.toString() === element.userId.toString()) {
          if (!uniqueIds.includes(element.userId)) {
            uniqueRaisedHands.push({
              userId: element.userId,
              name: element.userName,
              image: element.userImage,
              designation: element.userOrganisation,
              organisation: element.userDesignation,
              camera: item.camera,
              microphone: item.microphone,
              screen: item.screen,
              isOnStage: element.isOnStage,
            });

            uniqueIds.push(element.userId);
          }
        } else {
          if (!uniqueIds.includes(element.userId)) {
            uniqueRaisedHands.push({
              userId: element.userId,
              name: element.userName,
              image: element.userImage,
              designation: element.userOrganisation,
              organisation: element.userDesignation,
              camera: false,
              microphone: false,
              screen: false,
              isOnStage: element.isOnStage,
            });

            uniqueIds.push(element.userId);
          }
        }
      }
    }
  }

  // We need to know the current running state and if this user is a host or not in all of this side drawer component

  let sessionHasEnded = false;

  let currentUserIsAHost = false;
  let currentUserIsASpeaker = false;

  const [activeLinkTab, setActiveLinkTab] = useState("chat");

  const [activeTab, setActiveTab] = useState("activity");

  const [view, setView] = useState("grid");

  const switchView = (view) => {
    setView(view);
  };

  const { role, sessionRole } = useSelector((state) => state.eventAccessToken);

  if (
    sessionRole === "host" &&
    role !== "speaker" &&
    role !== "attendee" &&
    role !== "exhibitor"
  ) {
    currentUserIsAHost = true;
  }

  if (sessionRole === "host" && role === "speaker") {
    currentUserIsASpeaker = true;
  }

  if (runningStatus === "Ended") {
    sessionHasEnded = true;
  }

  const classes = useStyles();

  let gridColumns = "1fr 1fr";

  const { userDetails } = useSelector((state) => state.user);

  const userId = userDetails._id;

  let hostIds = sessionDetails.host.map((el) => el._id);

  if (
    (sessionRole === "host" && hostIds.includes(userId)) ||
    (sessionRole === "host" && role === "speaker")
  ) {
    gridColumns = "1fr 1fr 1fr 1fr";
  }

  if (runningStatus === "Ended") {
    gridColumns = "1fr 1fr";
  }

  return (
    <>
      <SessionSideDrawer>
        <SessionSideIconBtnNav
          style={{
            gridTemplateColumns: gridColumns,
          }}
        >
          <TabButton
            className=""
            style={{ paddingTop: "10px", paddingBottom: "10px" }}
            active={activeTab === "activity" ? true : false}
            onClick={() => {
              setActiveTab("activity");
            }}
          >
            Activity
          </TabButton>
          <TabButton
            active={activeTab === "people" ? true : false}
            onClick={() => {
              setActiveTab("people");
            }}
          >
            People
          </TabButton>
          {((sessionRole === "host" && hostIds.includes(userId)) ||
            (sessionRole === "host" && role === "speaker")) &&
          !sessionHasEnded ? (
            <>
              {" "}
              <TabButton
                active={activeTab === "raisedHands" ? true : false}
                onClick={() => {
                  setActiveTab("raisedHands");
                }}
              >
                Raised hands
              </TabButton>
              <TabButton
                active={activeTab === "videos" ? true : false}
                onClick={() => {
                  setActiveTab("videos");
                }}
              >
                Videos
              </TabButton>{" "}
            </>
          ) : (
            <></>
          )}
        </SessionSideIconBtnNav>

        {/* <MainChatComponent /> */}

        <div>
          <Divider />
        </div>

        {(() => {
          switch (activeTab) {
            case "activity":
              return (
                <>
                  <div>
                    <SessionLinkNav>
                      <LinkTab
                        onClick={() => {
                          setActiveLinkTab("chat");
                        }}
                        active={activeLinkTab === "chat" ? true : false}
                      >
                        Chat
                      </LinkTab>
                      <LinkTab
                        onClick={() => {
                          setActiveLinkTab("q&a");
                        }}
                        active={activeLinkTab === "q&a" ? true : false}
                      >
                        Q&A
                      </LinkTab>
                      <LinkTab
                        onClick={() => {
                          setActiveLinkTab("poll");
                        }}
                        active={activeLinkTab === "poll" ? true : false}
                      >
                        Poll
                      </LinkTab>
                    </SessionLinkNav>

                    {(() => {
                      switch (activeLinkTab) {
                        case "chat":
                          return (
                            <div className="d-flex flex-column align-items-center justify-content-between">
                              <MainChatComponent
                                currentUserIsAHost={currentUserIsAHost}
                                runningStatus={runningStatus}
                              />
                            </div>
                          );
                        case "q&a":
                          return (
                            <div
                              className="d-flex flex-column"
                              style={{ height: "100%" }}
                            >
                              <div
                                style={{ height: "69vh" }}
                                className="py-3 px-3"
                              >
                                <MainQnAComponent
                                  currentUserIsAHost={currentUserIsAHost}
                                  runningStatus={runningStatus}
                                />
                              </div>
                            </div>
                          );
                        case "poll":
                          return (
                            <div
                              className="d-flex flex-column"
                              style={{ height: "100%" }}
                            >
                              <div
                                style={{ height: "69vh" }}
                                className="py-3 px-3"
                              >
                                <MainPollComponent
                                  currentUserIsAHost={currentUserIsAHost}
                                  currentUserIsASpeaker={currentUserIsASpeaker}
                                  runningStatus={runningStatus}
                                />
                              </div>
                            </div>
                          );

                        default:
                          break;
                      }
                    })()}
                  </div>
                </>
              );

            case "people":
              return (
                <div>
                  <div className=" pt-2 px-2">
                    <div className="search-box-and-view-switch-container d-flex flex-row justify-content-between mb-3">
                      <div
                        className="ui icon input me-3"
                        style={{ width: "100%" }}
                      >
                        <input
                          type="text"
                          placeholder="Search people..."
                          className="form-control"
                        />
                        <SearchRoundedIcon
                          style={{
                            position: "absolute",
                            right: "10px",
                            top: "10px",
                            color: "#757575",
                          }}
                        />
                      </div>

                      <DropdownIcon switchView={switchView} view={view} />
                    </div>

                    {(() => {
                      switch (view) {
                        case "grid":
                          return (
                            <div className="people-list-grid">
                              {renderPeopleGrid(sessionDetails.people, classes)}
                            </div>
                          );
                        case "list":
                          return (
                            <div>{renderPeopleList(sessionDetails.people)}</div>
                          );

                        default:
                          return (
                            <div>You are viewing people in this event.</div>
                          );
                      }
                    })()}
                  </div>
                </div>
              );
            case "raisedHands":
              return (
                <div style={{ height: "73vh", overflow: "auto" }}>
                  {renderRaisedHands(uniqueRaisedHands, eventId, sessionId)}
                </div>
              );
            case "videos":
              return (
                <div style={{ height: "73vh", overflow: "auto" }}>
                  {renderVideos(videos, eventId, sessionId, sessionDetails)}
                </div>
              );

            default:
              break;
          }
        })()}
      </SessionSideDrawer>
    </>
  );
};

export default StageSideDrawerComponent;
