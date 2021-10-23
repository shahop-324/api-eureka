/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import LastPageRoundedIcon from "@material-ui/icons/LastPageRounded";
import FirstPageRoundedIcon from "@material-ui/icons/FirstPageRounded";
import styled from "styled-components";
import VideoCall from "./../../../../assets/images/video-call.svg";
import Paused from "./../../../../assets/images/paused.svg";
import Ended from "./../../../../assets/images/ended.svg";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";

import {
  renderGalleryView,
  renderMainStream,
  renderMiniStreams,
  renderScreenShareStream,
} from "./renderViewFxns";

import {
  GalleryView,
  GridView,
  GridViewMini,
} from "../../../SessionStage/Elements";
import { useSelector } from "react-redux";

const NotYetStarted = styled.div`
  min-height: 80vh;
  height: 90%;
  padding: 8vh 3vw;
  border-radius: 10px;
  margin-left: 70px;
  margin-right: 70px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: #0f2027; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2c5364,
    #203a43,
    #0f2027
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

const ButtonStyled = styled.button`
  font-family: "Ubuntu" !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  font-size: 1.1rem !important;
  padding: 12px 20px !important;
  border-radius: 25px !important;
`;

const Text = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #ffffff;
  font-family: "Ubuntu";
  text-align: center;
`;

const StreamBody = ({
  handleOpenSideDrawer,
  sideDrawerOpen,
  col,
  row,
  allStreams,
  screenStream,
  mainStream,
  miniStreams,
  view,
  audioStreamStat,
  videoStreamStat,
  peopleInThisSession,
}) => {
  const { sessionDetails } = useSelector((state) => state.session);

  const status = sessionDetails.runningStatus;

  return (
    <>
      <div>
        <a
          onClick={handleOpenSideDrawer}
          className=""
          style={{
            padding: "8px",
            backgroundColor: "#DDDDDD",
            borderRadius: "5px",
            maxWidth: "fit-content",
            position: "absolute",
            top: "10px",
            right: "20px",
            zIndex: "1",
          }}
        >
          {sideDrawerOpen ? <LastPageRoundedIcon /> : <FirstPageRoundedIcon />}
        </a>

        {typeof allStreams !== "undefined" && allStreams.length > 0 ? (
          <div className="">
            {(() => {
              switch (view) {
                case "gallery":
                  return (
                    <GalleryView col={col} row={row}>
                      {allStreams &&
                        renderGalleryView(
                          allStreams,
                          audioStreamStat,
                          videoStreamStat,
                          peopleInThisSession
                        )}
                    </GalleryView>
                  );
                case "grid":
                  return (
                    <GridView>
                      {/* Render main stream here */}
                      {/* <VideoStreamContainer /> */}
                      {mainStream &&
                        renderMainStream(
                          mainStream,
                          audioStreamStat,
                          videoStreamStat,
                          peopleInThisSession
                        )}
                      <GridViewMini>
                        {/* <VideoStreamContainer /> */}
                        {miniStreams &&
                          renderMiniStreams(
                            miniStreams,
                            audioStreamStat,
                            videoStreamStat,
                            peopleInThisSession
                          )}
                        {/* Render mini views here */}
                      </GridViewMini>
                    </GridView>
                  );

                
                case "screenShare":
                  return (
                    <GridView>
                      {screenStream &&
                        renderScreenShareStream(
                          screenStream,
                          peopleInThisSession
                        )}
                      <GridViewMini>
                        {allStreams &&
                          renderMiniStreams(
                            allStreams,
                            audioStreamStat,
                            videoStreamStat,
                            peopleInThisSession
                          )}
                      </GridViewMini>
                    </GridView>
                  );

                default:
                  break;
              }
            })()}
          </div>
        ) : (
          <NotYetStarted>
            {(() => {
              switch (status) {
                case "Not Yet Started":
                  return (
                    <>
                      <img
                        src={VideoCall}
                        style={{ height: "300px" }}
                        className="mb-4"
                        alt={"No video"}
                      />
                      <Text>
                        Uh oh! Seems like this session is not yet started.
                      </Text>
                    </>
                  );

                case "Paused":
                  return (
                    <>
                      <img
                        src={Paused}
                        style={{ height: "300px" }}
                        className="mb-4"
                        alt={"No video"}
                      />
                      <Text>Looks like this session is paused for now.</Text>
                    </>
                  );

                case "Ended":
                  return (
                    <>
                      <img
                        src={Ended}
                        style={{ height: "300px" }}
                        className="mb-4"
                        alt={"No video"}
                      />
                      <Text className="mb-4">
                        Oops, this session has already ended. But we can still
                        watch together.
                      </Text>
                      <ButtonStyled className="btn btn-danger btn-outline-text">
                        {" "}
                        <PlayCircleRoundedIcon className="me-2" />{" "}
                        <span>Let's watch </span>
                      </ButtonStyled>
                    </>
                  );

                default:
                  break;
              }
            })()}
          </NotYetStarted>
        )}
      </div>
    </>
  );
};

export default StreamBody;
