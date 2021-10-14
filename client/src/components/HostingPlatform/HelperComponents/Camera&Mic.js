import React, { useState } from "react";
import { Dialog, IconButton } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import styled from "styled-components";
import DeviceTest from "./DeviceTest";
import Test from "./Test";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import Select from "react-select";
import MicRounded from "@material-ui/icons/MicRounded";
import ProgressBar from "./VolumeIndicator";

import Checkbox from "@mui/material/Checkbox";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const CameraAndMic = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const styles = {
    control: (base) => ({
      ...base,
      fontFamily: "Ubuntu",
      fontWeight: "500",
      fontSize: "0.9rem",
      color: "#757575",
    }),
    menu: (base) => ({
      ...base,
      fontFamily: "Ubuntu",
      fontWeight: "500",
      fontSize: "0.9rem",
      color: "#757575",
    }),
  };

  const FormLabel = styled.label`
    font-family: "Ubuntu" !important;
    font-size: 0.82rem !important;
    font-weight: 500 !important;
    color: #727272 !important;
    margin-bottom: 5px;
  `;

  const Paper = styled.div`
    background-color: #ffffff;
    height: auto;
    width: 540px;
  `;

  const Heading = styled.div`
    font-weight: 500;
    font-family: "Ubuntu";
    color: #212121;
    font-size: 1.12rem;
  `;

  const SubHeading = styled.div`
    font-weight: 500;
    font-family: "Ubuntu";
    color: #666666;
    font-size: 0.95rem;
  `;

  const Permission = styled.span`
    font-weight: 500;
    font-family: "Ubuntu";
    color: #666666;
    font-size: 0.8rem;
  `;

  const VideoPreview = styled.div`
    margin: 10px 0;
    height: 110px;
    width: 200px;
    border-radius: 15px;
    background-color: #212121;
  `;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={"998px"}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <Paper className="p-4">
          <div className="d-flex flex-row align-items-center justify-content-between mb-4">
            <Heading>Camera & Mic settings</Heading>

            <IconButton onClick={handleClose}>
              <CancelRoundedIcon />
            </IconButton>
          </div>

          <div className="d-flex flex-row align-items-center mb-4">
            {/* <SettingsVoiceRoundedIcon /> */}
            <SubHeading className="">Audio</SubHeading>
          </div>

          <FormLabel for="microphone">Microphone</FormLabel>

          <Select
            className="mb-2"
            styles={styles}
            menuPlacement={"bottom"}
            name={"microphone"}
            options={[]}
          />

          <div
            className="align-items-center mb-2"
            style={{ display: "grid", gridTemplateColumns: "1.1fr 15fr" }}
          >
            <MicRounded style={{ fontSize: "18", fill: "#777777" }} />
            <ProgressBar bgcolor="#538BF7" completed={50} maxWidth={"380px"} />
          </div>

          <div className="mb-4">
            <Checkbox {...label} defaultChecked />

            <Permission>Turn off my mic when joining</Permission>
          </div>

          <div className="mb-4">
            <FormLabel for="microphone">Speaker</FormLabel>

            <Select
              className="mb-2"
              styles={styles}
              menuPlacement={"bottom"}
              name={"microphone"}
              options={[]}
            />
          </div>

          <hr className="my-3" />

          <div className="d-flex flex-row align-items-center mb-4">
            {/* <SettingsVoiceRoundedIcon /> */}
            <SubHeading className="">Video</SubHeading>
          </div>

          <div className="mb-4">
            <FormLabel for="microphone">Camera</FormLabel>

            <div className="d-flex flex-row align-items-center justify-content-end">
              <VideoPreview></VideoPreview>
            </div>

            <Select
              className="mb-2"
              styles={styles}
              menuPlacement={"bottom"}
              name={"microphone"}
              options={[]}
            />
          </div>

          <div className="mb-4">
            <Checkbox {...label} defaultChecked />

            <Permission>Turn off my video when joining</Permission>
          </div>

          <div className="d-flex flex-row align-items-center justify-content-end">
            <button className="btn btn-primary btn-outline-text">Save</button>
          </div>
        </Paper>
      </Dialog>
    </>
  );
};

export default CameraAndMic;
