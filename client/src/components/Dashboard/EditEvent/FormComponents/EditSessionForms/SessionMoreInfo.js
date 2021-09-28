import React, { useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import IconButton from "@material-ui/core/IconButton";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import styled from "styled-components";

import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Faker from "faker";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import WhoCanJoinSession from "./WhoCanJoinSession";

const SessionMoreInfoPaper = styled.div`
  width: 480px;
  background-color: #ffffff;
`;

const SessionName = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  font-family: "Ubuntu";
  color: #212121;
`;

const TextSmall = styled.div`
  font-size: 0.78rem;
  font-weight: 400;
  font-family: "Ubuntu";
  color: #212121;
`;

const SubHeading = styled.div`
  font-size: 0.78rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
`;

const SessionMoreInfo = (props) => {

    const [openControl, setOpenControl] = useState(false);

    const handleCloseControl = () => {
        setOpenControl(false);
    }

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
          anchor="right"
          open={props.open}
          onOpen={() => {
            console.log("Side nav was opended");
          }}
          onClose={() => {
            console.log("Side nav was closed");
          }}
        >
          <SessionMoreInfoPaper className="px-4 py-3">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">Session Info</div>
              <div
                className="overlay-form-close-button"
                onClick={props.handleClose}
              >
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-between">
              <div>
                <SessionName className="mb-1">Welcome session</SessionName>

                <TextSmall>Saturday 26 Feb, 2022 5:56 PM IST</TextSmall>
              </div>

              <button
                className="btn btn-outline-primary btn-outline-text"
                style={{ maxWidth: "100px", justifySelf: "end" }}
              >
                {" "}
                <EditRoundedIcon
                  className="me-2"
                  style={{ fontSize: "18px" }}
                />{" "}
                edit
              </button>
            </div>

            <hr />

            <SubHeading className="mb-3">Host</SubHeading>

            <Chip
              avatar={<Avatar alt="Natacha" src={Faker.image.avatar()} />}
              label={Faker.name.findName()}
              variant="outlined"
              className="me-3 mb-3"
            />
            <Chip
              avatar={<Avatar alt="Natacha" src={Faker.image.avatar()} />}
              label={Faker.name.findName()}
              variant="outlined"
              className="me-3 mb-3"
            />
            <Chip
              avatar={<Avatar alt="Natacha" src={Faker.image.avatar()} />}
              label={Faker.name.findName()}
              variant="outlined"
              className="me-3 mb-3"
            />

            <hr />

            <div className="d-flex flex-row align-items-center justify-content-between">
              <div>
                <SubHeading className="mb-3">
                  People who can attend this session
                </SubHeading>
                <TextSmall style={{ fontSize: "0.7rem" }}>
                  By default everyone in event can join this session
                </TextSmall>
              </div>
              <button
              onClick={() => {
                  setOpenControl(true);
              }}
                className="btn btn-outline-primary btn-outline-text"
                style={{ maxWidth: "100px", justifySelf: "end" }}
              >
                {" "}
                control
              </button>
            </div>
          </SessionMoreInfoPaper>
        </SwipeableDrawer>
      </React.Fragment>
      <WhoCanJoinSession open={openControl} handleClose={handleCloseControl} />
    </>
  );
};

export default SessionMoreInfo;
