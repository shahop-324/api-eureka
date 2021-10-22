import React from "react";
import styled from "styled-components";
import { Avatar, Dialog, IconButton } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import {
  setOpenNetworkingTable,
  setNetworkingRoom,
  setMatchedWith,
} from "./../../../actions";
import socket from "./../service/socket";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import MainChatComponent from "./Sub/NetworkingChat/MainChatComponent";
import { useParams } from "react-router-dom";

const NetworkingTableBody = styled.div`
  min-height: 85vh;
  max-width: 1600px;
  background-color: #0c1a1f;
`;

const UpperSection = styled.div`
  height: 77vh;
  display: grid;
  grid-template-columns: 5fr 1.65fr;
  grid-gap: 20px;
`;

const LowerSection = styled.div`
  height: 10%;
  display: grid !important;
  grid-template-columns: 1fr 1fr 1fr !important;
  grid-gap: 24px !important;
  border-top: 1px solid #2c2c2c;
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 24px;
`;

const VideoElement = styled.div`
  border-radius: 15px;
  background-color: #757575;
  height: 100%;
  position: relative;
`;

const MiniVideoElement = styled.div`
  position: absolute;
  top: 25px;
  right: 25px;
  border-radius: 15px;
  background-color: #bdbdbd;
  height: 170px;
  width: 220px;
`;

const NetworkingScreen = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("xl");

  const { id } = useSelector((state) => state.eventAccessToken);
  const eventId = params.eventId;

  const { openNetworkingTable, matchedWith, networkingRoom } = useSelector(
    (state) => state.networking
  );

  return (
    <>
      <Dialog
        // fullScreen={fullScreen}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        open={openNetworkingTable}
        aria-labelledby="responsive-dialog-title"
        style={{
          width: "1333px",
          maxWidth: "1600px",
          minWidth: "1333px",
          height: "100vh",
          margin: "0 auto 0 auto",
        }}
      >
        <NetworkingTableBody>
          <UpperSection className="mx-4 py-3">
            <VideoGrid className="py-3 px-3">
              <VideoElement>
                <MiniVideoElement></MiniVideoElement>
              </VideoElement>
            </VideoGrid>
            <div className="py-3">
            <MainChatComponent />
            </div>
          </UpperSection>

          <LowerSection className="mx-4 py-3 mt-2">
            <button
              onClick={() => {
                // emit socket to leave this room
                socket.emit(
                  "leaveNetworking",
                  {
                    room: networkingRoom,
                    userId: id,
                    eventId: eventId,
                  },
                  (error) => {
                    if (error) {
                      alert(error);
                    }
                  }
                );
                dispatch(setOpenNetworkingTable(false));
                dispatch(setNetworkingRoom(null));
                dispatch(setMatchedWith(null));
              }}
              className="btn btn-outline-text btn-danger px-4"
              style={{ width: "max-content" }}
            >
              Leave
            </button>
            <div className="d-flex flex-row align-items-center justify-content-center">
              <IconButton>
                <VideocamRoundedIcon style={{ color: "#ffffff" }} />
              </IconButton>
              <IconButton className="mx-4">
                <MicRoundedIcon style={{ color: "#ffffff" }} />
              </IconButton>
              <IconButton>
                <SettingsIcon style={{ color: "#ffffff" }} />
              </IconButton>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-end">
              <button className="btn btn-outline-text btn-primary px-4">
                Connect
              </button>
              <button className="btn btn-outline-text btn-outline-primary px-4 ms-3">
                Share Business card
              </button>
            </div>
          </LowerSection>
        </NetworkingTableBody>
      </Dialog>
    </>
  );
};

export default NetworkingScreen;
