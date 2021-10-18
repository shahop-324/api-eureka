import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import {
  renderGalleryView,
  renderMainStream,
  renderMiniStreams,
  renderProminentStream,
  renderScreenShareStream,
} from "../Stage/renderViewFxns";

import {
  GalleryView,
  GridView,
  SpotlightView,
  GridViewMini,
} from "../../../SessionStage/Elements";

const StreamBody = ({
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
  peopleOnThisTable,
}) => {
  return (
    <>
      <div>
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
                          volumeIndicators,
                          peopleOnThisTable
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
                          peopleOnThisTable
                        )}
                      <GridViewMini>
                        {/* <VideoStreamContainer /> */}
                        {miniStreams &&
                          renderMiniStreams(
                            miniStreams,
                            audioStreamStat,
                            videoStreamStat,
                            volumeIndicators,
                            peopleOnThisTable
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
                          peopleOnThisTable
                        )}
                    </SpotlightView>
                  );
                case "screenShare":
                  return (
                    <GridView>
                      {screenStream &&
                        renderScreenShareStream(
                          screenStream,
                          peopleOnThisTable
                        )}
                      <GridViewMini>
                        {allStreams &&
                          renderMiniStreams(
                            allStreams,
                            audioStreamStat,
                            videoStreamStat,
                            volumeIndicators,
                            peopleOnThisTable
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
          <></>
        )}
      </div>
    </>
  );
};

export default StreamBody;
