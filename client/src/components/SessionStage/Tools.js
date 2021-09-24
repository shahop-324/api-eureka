import React from "react";
import styled from "styled-components";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { Dialog } from "@material-ui/core";

import InsertLinkRoundedIcon from "@mui/icons-material/InsertLinkRounded";
import OndemandVideoRoundedIcon from "@mui/icons-material/OndemandVideoRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import SponsorShoutout from "./Icon/sponsor_shoutout.svg";
import Announcement from "./Icon/announcement.png";

const StageToolsContainer = styled.div`
  width: 360px;
  min-height: 400px;

  background: rgba(21, 45, 53, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.18);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-gap: 16px;
`;

const ToolButton = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #152d35;

  padding: 10px 12px;
  border-radius: 5px;
  border: 1px solid #152d35;

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    border: 1px solid #0c1c21;
    cursor: pointer;
    background-color: #fff;
  }
`;

const HeadlineWithCloseIcon = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  grid-gap: 16px;

  font-size: 0.9rem;
  font-weight: 500;
  font-family: "Ubuntu";
  color: #152d35;

  background: rgba(21, 45, 53, 0.25);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
`;

const ButtonOutlinedDark = styled.div`
  padding: 6px 10px;
  text-align: center;

  font-weight: 500;
  font-size: 0.8rem;
  color: #ffffff;
  font-family: "Ubuntu";

  color: #152d35;
  background-color: transparent;

  border: 1px solid #152d35;
  border-radius: 5px;

  &:hover {
    background-color: #152d35;

    color: #ffffff;

    cursor: pointer;
  }
`;

const Tools = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <HeadlineWithCloseIcon className="py-2 px-3">
          <div></div>
          <div style={{ textAlign: "center" }}>Tools</div>
          <div></div>
        </HeadlineWithCloseIcon>
        <StageToolsContainer className="p-4">
          <ToolButton>
            <InsertLinkRoundedIcon
              style={{ fontSize: "48px" }}
              className="mb-3"
            />
            <div>Insert Link</div>
          </ToolButton>
          <ToolButton>
            <img
              src={SponsorShoutout}
              style={{ height: "36px", width: "36px" }}
              alt={"sponsor shoutout"}
              className="mb-3"
            />
            <div>Sponsor shoutout</div>
          </ToolButton>
          <ToolButton>
            <OndemandVideoRoundedIcon
              style={{ fontSize: "48px" }}
              className="mb-3"
            />
            <div>Play video from url</div>
          </ToolButton>
          <ToolButton>
            <SecurityRoundedIcon
              style={{ fontSize: "48px" }}
              className="mb-3"
            />
            <div>Moderation</div>
          </ToolButton>
          <ToolButton
            style={{
              gridColumnStart: "1",
              gridColumnEnd: "3",
              gridRowStart: "3",
              gridRowEnd: "10",
            }}
          >
            <img
              src={Announcement}
              style={{ height: "36px", width: "36px" }}
              alt={"announcement"}
              className="mb-3"
            />
            <div>Announcement</div>
          </ToolButton>
        </StageToolsContainer>
        <div className="px-3 py-2" onClick={handleClose}>
          <ButtonOutlinedDark>Close</ButtonOutlinedDark>
        </div>
      </Dialog>
    </>
  );
};

export default Tools;
