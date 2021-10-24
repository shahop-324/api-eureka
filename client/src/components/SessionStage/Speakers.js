import React from "react";
import Faker from "faker";
import styled from "styled-components";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton, Avatar } from "@material-ui/core";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Chip from "@mui/material/Chip";
import VideocamRoundedIcon from "@material-ui/icons/VideocamRounded"; // Video Camera Icon
import MicNoneRoundedIcon from "@material-ui/icons/MicNoneRounded"; // Microphone Icon
import ScreenShareRoundedIcon from "@material-ui/icons/ScreenShareRounded"; // Screen Share Icon

const Paper = styled.div`
  position: relative;
  width: 460px;
  height: 100vh;
  background-color: #345b63;
  /* background: rgba(220,225,225,0.25); */
  box-shadow: 0 8px 32px 0 rgb(31 38 135 / 37%);
`;

const UpperLayer = styled.div`
  width: 500px;
  height: 100vh;
  position: absolute;
  background: rgba(220, 225, 225, 0.25);
  box-shadow: 0 8px 32px 0 rgb(31 38 135 / 37%);
`;

const PeopleListWidget = styled.div`
  width: 100%;
  height: auto;
  padding: 15px;

  background: #d1d7da09;
  /* box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37); */
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const PersonName = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  font-size: 0.76rem;
  color: #e6e6e6;
  display: block;
  text-transform: capitalize;
`;

const ScrollableList = styled.div`
  height: 91vh;
  overflow: auto;
`;

const Header = styled.div``;
const Heading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #ffffff;
  font-size: 1rem;
`;

const SpeakerComponent = () => {
  return (
    <>
      <PeopleListWidget className="mb-3">
        <div
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 1.5fr",
            gridGap: "20px",
            alignItems: "center",
          }}
        >
          <div className="d-flex flex-row">
            <Avatar
              src={Faker.image.avatar()}
              alt={Faker.name.findName()}
              variant="rounded"
              className="me-3"
            />
            <div>
              <PersonName>{Faker.name.findName()}</PersonName>
              <PersonName>{"Product manager, Bluemeet"}</PersonName>
            </div>
          </div>

          <div style={{ justifySelf: "end" }}>
            <Chip style={{fontWeight: "500"}} label="Not available" color="primary" />
          </div>
        </div>

        {/* <UserRoleTag>Host</UserRoleTag> */}

        <div className="d-flex flex-row align-items-center justify-content-center mb-3">
          <IconButton className="me-4">
            <VideocamRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
          <IconButton className="me-4">
            <MicNoneRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
          <IconButton className="me-4">
            <ScreenShareRoundedIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <button
            className="btn btn-outline-text btn-outline-light me-3"
            style={{ width: "48%" }}
          >
            Hide
          </button>
          <button
            className="btn btn-outline-text btn-outline-light me-3"
            style={{ width: "48%" }}
          >
            Send reminder
          </button>
        </div>
      </PeopleListWidget>
    </>
  );
};

const Speakers = ({ open, handleClose }) => {
  return (
    <>
      <React.Fragment key="left">
        <SwipeableDrawer
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
          anchor="left"
          open={open}
          disableBackdropTransition={true}
        >
          <Paper>
            <UpperLayer></UpperLayer>
            <Header className="d-flex flex-row align-items-center justify-content-between px-4 py-3">
              <Heading>Speakers</Heading>
              <IconButton
                onClick={() => {
                  handleClose();
                }}
              >
                <CancelRoundedIcon style={{ color: "#ffffff" }} />
              </IconButton>
            </Header>

            <ScrollableList className="px-4 py-3">
              {/* This will be a scrollable list */}
              <SpeakerComponent />
            </ScrollableList>
          </Paper>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default Speakers;
