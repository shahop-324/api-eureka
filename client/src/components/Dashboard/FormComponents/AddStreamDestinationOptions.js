import React, { useState } from "react";
import styled from "styled-components";
import Dialog from "@material-ui/core/Dialog";
import { IconButton } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import RTMPDestination from "./StreamDestinations.js/RTMPDestination";

const Paper = styled.div`
  width: 450px;
  height: auto;
  background-color: #f5f7f8;
`;

const StreamDestinationButton = styled.div`
  background-color: ${(props) =>
    props && props.active ? "#DFEBF8" : "#ffffff"};

  font-weight: 500;
  font-family: "Ubuntu";
  color: #363636;
  font-size: 0.85rem;
  border-radius: 10px;
  padding: 20px;

  &:hover {
    cursor: pointer;
    background-color: #dfebf8;
  }
`;

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const AddStreamDestinationOptions = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openRTMP, setOpenRTMP] = useState(false);

  const handleCloseRTMP = () => {
    setOpenRTMP(false);
  };
  const handleOpenRTMP = () => {
    setOpenRTMP(true);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <div style={{ backgroundColor: "#f5f7f8" }}>
          <HeaderFooter className="form-heading-and-close-button mb-4 px-4 pt-3">
            <div></div>
            <div className="coupon-overlay-form-headline">
              Choose destination
            </div>
            <div className="overlay-form-close-button" onClick={handleClose}>
              <IconButton aria-label="delete">
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </HeaderFooter>

          <Paper className="p-4">
            <StreamDestinationButton
              className="mb-3"
              onClick={() => {
                handleClose();
                handleOpenRTMP();
                
              }}
            >
              <LanguageIcon style={{ color: "#4F5BC5" }} className="me-3" />
              <span>Custom RTMP</span>
            </StreamDestinationButton>
            <StreamDestinationButton className="mb-3">
              <FacebookIcon style={{ color: "#4267B2" }} className="me-3" />
              <span>Facebook Live</span>
            </StreamDestinationButton>
            <StreamDestinationButton className="mb-3">
              <YouTubeIcon style={{ color: "#FF0000" }} className="me-3" />
              <span>Youtube Live</span>
            </StreamDestinationButton>
            <StreamDestinationButton className="mb-3">
              <LinkedInIcon style={{ color: "#0e76a8" }} className="me-3" />
              <span>Linkedin Live</span>
            </StreamDestinationButton>
            <StreamDestinationButton className="mb-3">
              <TwitterIcon style={{ color: "#1DA1F2" }} className="me-3" />
              <span>Twitter Live</span>
            </StreamDestinationButton>
          </Paper>
        </div>
      </Dialog>

      <RTMPDestination open={openRTMP} handleClose={handleCloseRTMP} />
    </>
  );
};

export default AddStreamDestinationOptions;
