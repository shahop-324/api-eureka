import React from "react";
import { useParams } from "react-router-dom";
import socket from "./../HostingPlatform/service/socket";
import { useSelector } from "react-redux";
import styled from "styled-components";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Avatar, IconButton } from "@material-ui/core";
import { PeopleListWidget, PersonName } from "./Elements";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import StopScreenShareRoundedIcon from "@mui/icons-material/StopScreenShareRounded";

import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";

import Tooltip from "@mui/material/Tooltip";

const Header = styled.div``;
const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #152d35;
  font-size: 1rem;
`;

const renderPeople = (people, sessionId) => {
  return people.map((person) => {
    return (
      <PeopleListWidget
        className="mb-3"
        style={{ zIndex: "10000000000000000000000000000000000000000000000000" }}
      >
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
              alt={person.firstName}
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
        <div className="d-flex flex-row align-items-center justify-content-around px-4">
          {person.camera ? (
            <Tooltip title="Switch off camera ">
              <IconButton
                onClick={() => {
                  socket.emit(
                    "muteVideo",
                    { userId: person.userId, sessionId: sessionId },
                    (error) => {
                      alert(error);
                    }
                  );
                }}
              >
                <VideocamRoundedIcon style={{ color: "#05850F" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Camera is off">
              <IconButton>
                <VideocamOffRoundedIcon style={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          )}
          {person.microphone ? (
            <Tooltip title="Switch off microphone">
              <IconButton
                onClick={() => {
                  socket.emit(
                    "muteMic",
                    { userId: person.userId, sessionId: sessionId },
                    (error) => {
                      alert(error);
                    }
                  );
                }}
              >
                <MicRoundedIcon style={{ color: "#05850F" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Microphone is off">
              <IconButton>
                <MicOffRoundedIcon style={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          )}
          {person.screen ? (
            <Tooltip title="Switch off screen share">
              <IconButton
                onClick={() => {
                  socket.emit(
                    "muteScreenShare",
                    { userId: person.userId, sessionId: sessionId },
                    (error) => {
                      alert(error);
                    }
                  );
                }}
              >
                <ScreenShareRoundedIcon style={{ color: "#05850F" }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Screen share if off">
              <IconButton>
                <StopScreenShareRoundedIcon style={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </PeopleListWidget>
    );
  });
};

const ManageStage = ({ open, handleClose }) => {
  const { sessionDetails } = useSelector((state) => state.session);

  const params = useParams();
  const sessionId = params.sessionId;

  let uniquePeople = [];
  let unqiueIds = [];

  if (sessionDetails) {
    for (let element of sessionDetails.onStagePeople) {
      for (let item of sessionDetails.people) {
        console.log(element.user, item._id);
        console.log(element.user == item._id);
        if (element.user.toString() == item._id.toString()) {
          uniquePeople.push({
            userId: item._id,
            name: `${item.firstName} ${item.lastName}`,
            image: item.image,
            organisation: item.organisation,
            designation: item.designation,
            userRole: element.userRole,
            camera: element.camera,
            microphone: element.microphone,
            screen: element.screen,
          });
        }
        unqiueIds.push(item._id);
      }
    }
  }

  console.log(uniquePeople);

  return (
    <>
      <React.Fragment key="left">
        <SwipeableDrawer
          anchor="left"
          open={open}
          disableBackdropTransition={true}
        >
          <div style={{ width: "400px" }}>
            <Header className="d-flex flex-row align-items-center justify-content-between px-4 py-3">
              <Heading>Manage stage</Heading>
              <IconButton
                onClick={() => {
                  handleClose();
                }}
              >
                <CancelRoundedIcon style={{ color: "#152d35" }} />
              </IconButton>
            </Header>

            <div
              // style={{ height: "83vh", overflow: "auto" }}
              className="px-4 py-3"
            >
              {renderPeople(uniquePeople, sessionId)}
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default ManageStage;
