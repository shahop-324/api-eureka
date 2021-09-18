import React from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import Faker from "faker";

import PauseRoundedIcon from "@material-ui/icons/PauseRounded"; // Pause
import StopRoundedIcon from "@material-ui/icons/StopRounded"; // Stop

import PeopleOutlineRoundedIcon from "@material-ui/icons/PeopleOutlineRounded"; // Watching group

import HomeRoundedIcon from "@material-ui/icons/HomeRounded"; // Live Stage
import AlbumRoundedIcon from "@material-ui/icons/AlbumRounded"; // Recording

import {
  BtnFilled,
  BrandLogo,
  ChipModified,
  SessionName,
  PeopleWatching,
  ExpandIcon,
  Button,
  BtnOutlined,
  StageNav,
} from "./Elements";
import { useSelector } from "react-redux";

const StageNavComponent = () => {
  const { userDetails } = useSelector((state) => state.user);

  const img = userDetails.image
    ? userDetails.image.startsWith("https://")
      ? userDetails.image
      : `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${userDetails.image}`
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
          <ChipModified>Live</ChipModified>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center">
          <BtnOutlined className="me-3">
            <PauseRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
            Take break
          </BtnOutlined>
          <BtnFilled className="me-3">
            <HomeRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
            Live stage
          </BtnFilled>
          <BtnOutlined>
            <StopRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
            End session
          </BtnOutlined>
        </div>

        <div className="d-flex flex-row align-items-center justify-content-end">
          <BtnOutlined className="me-3">
            <AlbumRoundedIcon className="me-2" style={{ fontSize: "20px" }} />
            Recording
          </BtnOutlined>

          <PeopleWatching className="me-3">
            <PeopleOutlineRoundedIcon className="me-2" />
            2,340 watching
          </PeopleWatching>
          <Avatar
            src={img}
            alt={userDetails.firstName}
            variant="rounded"
          />
        </div>
      </StageNav>
    </>
  );
};

export default StageNavComponent;
