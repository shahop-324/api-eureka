/* eslint-disable jsx-a11y/anchor-is-valid */
import react from "react";
import LastPageRoundedIcon from "@material-ui/icons/LastPageRounded";
import FirstPageRoundedIcon from "@material-ui/icons/FirstPageRounded";

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
    </>
  );
};

export default StreamBody;
