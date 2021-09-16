import React, { useState } from "react";

import {
  StageBody,
  CollapseIcon,
  VideoStreamContainer,
  GalleryView,
} from "./../../../components/SessionStage/Elements";

import PhotoBooth from "../../Elements/PhotoBooth";
import StageNavComponent from "../../SessionStage/StageNavComponent";
import StageControlsComponent from "../../SessionStage/StageControlsComponent";
import StageSideDrawerComponent from "../../SessionStage/StageSideDrawer";

const SessionStage = () => {
  const [openPhotoBooth, setOpenPhotoBooth] = useState(false);

  const handleOpenPhotoBooth = () => {
    setOpenPhotoBooth(true);
  };

  const handleClosePhotoBooth = () => {
    setOpenPhotoBooth(false);
  };

  return (
    <>
      <div>
        {/* Stage Nav Goes here */}
        <StageNavComponent />

        <StageBody>
          <div>
            <CollapseIcon />

            <div className="">
              <GalleryView>
                <VideoStreamContainer />
                <VideoStreamContainer />
                <VideoStreamContainer />
                <VideoStreamContainer />
                <VideoStreamContainer />
              </GalleryView>
            </div>
          </div>

          {/* Stage side drawer component goes here */}

          <StageSideDrawerComponent />
        </StageBody>

        {/* Stage Controls components */}
        <StageControlsComponent handleOpenPhotoBooth={handleOpenPhotoBooth} />
      </div>

      <PhotoBooth open={openPhotoBooth} handleClose={handleClosePhotoBooth} />
    </>
  );
};

export default SessionStage;
