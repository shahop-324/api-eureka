import React from "react";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded"; // Pause
import StopRoundedIcon from "@material-ui/icons/StopRounded"; // Stop
import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded"; // Watching group
import HomeRoundedIcon from "@material-ui/icons/HomeRounded"; // Live Stage
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded"; // Live stream
import styled from "styled-components";
import Chip from "@mui/material/Chip";

import {
  BrandLogo,
  ChipModified,
  SessionName,
  PeopleWatching,
  StageNav,
} from "./Elements";
import { useSelector } from "react-redux";

const BtnFilled = styled.div`
  background-color: #345b63;
  padding: 5px 8px;

  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;
  color: #dcc7be;
  max-width: fit-content;

  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BtnOutlined = styled.div`
  padding: 5px 8px;
  background-color: transparent;
  border: 1px solid #345b63;

  color: #dcc7be;
  font-family: "Ubuntu";
  font-weight: 500;
  font-size: 0.8rem;
  border-radius: 3px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
    background-color: #1f545e;
    color: #ffffff;
  }
`;

const IconButton = styled.div`
  padding: 8px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;

  color: #152d35;

  &:hover {
    border: 1px solid #ffffff;
    background-color: transparent;
    color: #ffffff;
    cursor: pointer;
  }
`;

const IconButtonStatic = styled.div`
  padding: 8px;
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffffff;
`;

const StageNavComponent = () => {
  const { userDetails } = useSelector((state) => state.user);

  const { sessionRole, role } = useSelector((state) => state.eventAccessToken);

  const { sessionDetails } = useSelector((state) => state.session);

  const status = sessionDetails ? sessionDetails.runningStatus : "Not Yet Started";

  const img = userDetails.image
    ? userDetails.image.startsWith("https://")
      ? userDetails.image
      : `https://bluemeet.s3.us-west-1.amazonaws.com/${userDetails.image}`
    : "#";

  return (
    <>
      <StageNav className="px-3 py-1">
        <div className="d-flex flex-row align-items-center">
          <BrandLogo className="me-3" />
          <SessionName className="me-3">
            Annual Founder Q&A with community
          </SessionName>
          {/* <Chip label="Live" color="secondary" /> */}

          {(() => {
            switch (status) {
              case "Not Yet Started":
                return (
                  <Chip
                    label="Not yet started"
                    color="secondary"
                    style={{ fontWeight: "500" }}
                  />
                );

              case "Started":
                return <ChipModified>Live</ChipModified>;

              case "Resumed":
                return <ChipModified>Live</ChipModified>;

              case "Paused":
                return (
                  <Chip
                    label="Paused"
                    color="primary"
                    style={{ fontWeight: "500" }}
                  />
                );

              case "Ended":
                return (
                  <Chip
                    label="Ended"
                    color="warning"
                    style={{ fontWeight: "500" }}
                  />
                );

              default:
                break;
            }
          })()}
        </div>

        {sessionRole === "host" ? (
          <div className="d-flex flex-row align-items-center justify-content-center">
            {status === "Not Yet Started" ? (
              <BtnOutlined className="me-3">
                <PauseRoundedIcon
                  className="me-2"
                  style={{ fontSize: "20px" }}
                />
                Start session
              </BtnOutlined>
            ) : (
              <></>
            )}

            {status === "Paused" ? (
              <BtnOutlined className="me-3">
                <PauseRoundedIcon
                  className="me-2"
                  style={{ fontSize: "20px" }}
                />
                Resume
              </BtnOutlined>
            ) : (
              <></>
            )}

            {status === "Started" || status === "Resumed" ? (
              <BtnOutlined className="me-3">
                <PauseRoundedIcon
                  className="me-2"
                  style={{ fontSize: "20px" }}
                />
                Take break
              </BtnOutlined>
            ) : (
              <></>
            )}

            <BtnFilled className="me-3">
              <HomeRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
              Live stage
            </BtnFilled>

            {status === "Started" || status === "Resumed" ? (
              <BtnOutlined>
                <StopRoundedIcon
                  className="me-2"
                  style={{ fontSize: "20px" }}
                />
                End session
              </BtnOutlined>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div></div>
        )}

        <div className="d-flex flex-row align-items-center justify-content-end">
          <PeopleWatching>
            <PeopleOutlineRoundedIcon className="me-2" />
            2,340 watching
          </PeopleWatching>

          <IconButtonStatic className="ms-3">
            <RssFeedRoundedIcon style={{ color: "red" }} />
          </IconButtonStatic>
        </div>
      </StageNav>
    </>
  );
};

export default StageNavComponent;
