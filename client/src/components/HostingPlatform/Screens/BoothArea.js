import React, { useState } from "react";
import "./../Styles/booth.scss";
import LanguageRoundedIcon from "@material-ui/icons/LanguageRounded";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import ClassIcon from "@material-ui/icons/Class";
import LiveTvIcon from "@material-ui/icons/LiveTv";
import ExpandMoreRoundedIcon from "@material-ui/icons/ExpandMoreRounded";
import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import Rooms from "./Rooms";
import Faker from "faker";
import BoothLiveStream from "./BoothLiveStream";
import styled  from "styled-components";

const ThemedBackgroundButtonOutlined = styled.div`
background-color: transparent;
text-decoration: none !important;
border: 1px solid #152d35 !important;
color: #152d35;

outline: none !important;

&:hover {
  background-color: #152d35;
  color: #ffffff;
  cursor: pointer;

}
`
const ThemedBackgroundButtonFilled = styled.div`




outline: none !important;

background-color: #152d35;
border: 1px solid #152d35 !important;
  color: #ffffff;
 

&:hover {
  background-color: transparent;
  color: #152d35;

  background-color: transparent;
text-decoration: none !important;

  cursor: pointer;

}
`



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
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

// <LobbyAgenda socket={socket} />

const BoothArea = () => {
  const [openLiveStream, setOpenLiveStream] = useState(false);

  const [openAssets, setOpenAssets] = useState(false);

  const handleOpenLiveStream = () => {
    setOpenLiveStream(true);
  };

  const handleCloseLiveStream = () => {
    setOpenLiveStream(false);
  };

  const handleOpenAssets = () => {
    setOpenAssets(true);
  };

  const handleCloseAssets = () => {
    setOpenAssets(false);
  };

  const classes = useStyles();

  return (
    <>
      <div
        style={{ maxWidth: "1360px", margin: "0 auto" }}
        className="py-4 px-5"
      >
        <div className="d-flex flex-row align-items-center justify-content-between mb-4">
          <div className="d-flex flex-row align-items-center">
            <div
              style={{
                backgroundColor: "#94949436",
                width: "fit-content",
                borderRadius: "5px",
              }}
              className="px-2 py-1"
            >
              <ArrowBackIosRoundedIcon style={{ fontSize: "20px" }} />
            </div>
            <div
              className="ms-3"
              style={{ color: "#212121", fontWeight: "500" }}
            >
              Back
            </div>
          </div>

          <div>
            <ThemedBackgroundButtonOutlined
              onClick={() => {
                handleOpenAssets();
              }}
              className="btn btn-outline-primary btn-outline-text me-3"
            >
              Assets
            </ThemedBackgroundButtonOutlined>
            <ThemedBackgroundButtonOutlined
              onClick={() => {
                handleOpenLiveStream();
              }}
              className="btn btn-outline-primary btn-outline-text"
            >
              Watch Live
            </ThemedBackgroundButtonOutlined>
          </div>
        </div>

        <div className="mb-4">
          <img
            src="https://www.threatstack.com/wp-content/uploads/2017/06/docker-cloud-twitter-card.png"
            alt="booth banner"
            style={{
              // position: "absolute",
              width: "100%",
              maxHeight: "400px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>

        <div
          className="mb-4"
          style={{
            display: "grid",
            gridTemplateColumns: "4fr 1.5fr",
            alignItems: "center",
          }}
        >
          <div
            style={{ height: "100px" }}
            className="d-flex flex-row align-items-center"
          >
            <Avatar
              src={
                "https://e7.pngegg.com/pngimages/291/969/png-clipart-docker-software-deployment-intermodal-container-minio-web-server-docker-nodejs-alpine-linux.png"
              }
              style={{ height: "5rem", width: "5rem" }}
              variant="rounded"
            />
            <div className="ms-3">
              <div
                style={{
                  color: "#3C3A3A",
                  fontWeight: "500",
                  fontFamily: "Ubuntu",
                  fontSize: "1.1rem",
                }}
                className="mb-3"
              >
                Docker Cooperation
              </div>

              <div className="booth-tagline">
                Empowering App Development for developers.
              </div>
            </div>
          </div>
          <div style={{ height: "100px" }}>
            <div className="d-flex flex-row align-items-center justify-content-end mb-3">
              <div className="button-custom-bg p-2 ms-3">
                <LanguageRoundedIcon style={{ fontSize: "24px" }} />
              </div>
              <div className="button-custom-bg p-2 ms-3">
                <LinkedInIcon style={{ fontSize: "24px" }} />
              </div>
              <div className="button-custom-bg p-2 ms-3">
                <TwitterIcon style={{ fontSize: "24px" }} />
              </div>
              <div className="button-custom-bg p-2 ms-3">
                <FacebookIcon style={{ fontSize: "24px" }} />
              </div>
            </div>

            <div className="d-flex flex-row align-items-center justify-content-end mb-3">
              <ThemedBackgroundButtonFilled className="btn btn-primary btn-outline-text">
                Mark as interested
              </ThemedBackgroundButtonFilled>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <div className="booth-about-heading mb-3">About</div>

          <div className="d-flex flex-row align-items-center mb-3">
            <div
              className="me-3 px-3 py-2 user-registration-status-chip"
              style={{ width: "fit-content" }}
            >
              Sass
            </div>
            <div
              className="me-3 px-3 py-2 user-registration-status-chip"
              style={{ width: "fit-content" }}
            >
              Internet
            </div>
            <div
              className="me-3 px-3 py-2 user-registration-status-chip"
              style={{ width: "fit-content" }}
            >
              Communication
            </div>
          </div>

          <div className="booth-description">
            Docker is a set of platform as a service products that use OS-level
            virtualisation to deliver software in packages called containers.
            Containers are isolated from one another and bundle their own
            software, libraries and configuration files; they can communicate
            with each other through well-defined channels.
          </div>
        </div>

        <div
          className="row d-flex flex-row"
          style={{ alignItems: "center", marginBottom: "6%" }}
        >
          <div className="col-5">
            <hr />
          </div>

          <div className="col-2 connect-with-us-booth-card d-flex flex-row align-items-center justify-content-between">
            <ExpandMoreRoundedIcon />

            <span className="join-us-here-booth">Join us here</span>
            <Avatar
              alt="Remy Sharp"
              src={Faker.image.avatar()}
              className={classes.small}
            />
          </div>
          <div className="col-5">
            <hr />
          </div>
        </div>

        <Rooms />
      </div>


<BoothLiveStream open={openLiveStream} handleClose={handleCloseLiveStream} />

    </>
  );
};

export default BoothArea;
