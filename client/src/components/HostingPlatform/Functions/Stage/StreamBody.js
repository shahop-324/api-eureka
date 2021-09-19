/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState} from "react";
import LastPageRoundedIcon from "@material-ui/icons/LastPageRounded";
import FirstPageRoundedIcon from "@material-ui/icons/FirstPageRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Tools from "./../../../SessionStage/Tools";
import styled from "styled-components";

import {
  renderGalleryView,
  renderLocalStream,
  renderMainStream,
  renderMiniStreams,
  renderProminentStream,
  renderScreenShareStream,
} from "./renderViewFxns";

import {
  GalleryView,
  GridView,
  SpotlightView,
  GridViewMini,
} from "../../../SessionStage/Elements";

const StageToolsIconBtn = styled.div`
  padding: 6px;
  border-radius: 10px;

  position: absolute;
  top: 50%;
  left: 0px;
  z-index: 1;

  color: #ececec;
  background-color: transparent;
  border: 1px solid #152d35;

  &:hover {
    color: #152d35;
    background-color: #ffffff;
    border: 1px solid #152d35;
    cursor: pointer;
  }
`;

const StreamBody = ({
  handleOpenSideDrawer,
  sideDrawerOpen,
  col,
  row,
  allStreams,
  screenStream,
  prominentStream,
  mainStream,
  miniStreams,
  view,
  audioStreamStat,
  videoStreamStat,
  volumeIndicators,
  peopleInThisSession,
}) => {

  const [showTools, setShowTools] = useState(false);

  const handleCloseTools = () => {
    setShowTools(false);
  }

  return (
    <>
      <div>
        <a
          onClick={handleOpenSideDrawer}
          // data-tip={
          //   sideDrawerOpen
          //     ? "Close session activity"
          //     : "Open session activity"
          // }
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

        <StageToolsIconBtn onClick={() => {
          setShowTools(true);
        }}>
          <DashboardRoundedIcon style={{ fontSize: "19px" }} />
        </StageToolsIconBtn>

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
                        volumeIndicators,
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
                        volumeIndicators,
                        peopleInThisSession
                      )}
                    <GridViewMini>
                      {/* <VideoStreamContainer /> */}
                      {miniStreams &&
                        renderMiniStreams(
                          miniStreams,
                          audioStreamStat,
                          videoStreamStat,
                          volumeIndicators,
                          peopleInThisSession
                        )}
                      {/* Render mini views here */}
                    </GridViewMini>
                  </GridView>
                );

              case "spotlight":
                return (
                  <SpotlightView>
                    {prominentStream &&
                      renderProminentStream(
                        prominentStream,
                        audioStreamStat,
                        videoStreamStat,
                        volumeIndicators,
                        peopleInThisSession
                      )}
                  </SpotlightView>
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
                          volumeIndicators,
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
      </div>

      <Tools open={showTools} handleClose={handleCloseTools} />
    </>
  );
};

export default StreamBody;
