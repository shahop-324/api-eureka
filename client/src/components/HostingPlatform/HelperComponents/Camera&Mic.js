import React, { useState } from "react";
import { Dialog } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DeviceTest from "./DeviceTest";
import Test from "./Test";
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const CameraAndMic = ({ open, handleClose }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [state, setState] = useState("switch devices");

  const handleStateChange = (newState) => {
    setState(newState);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        maxWidth={"998px"}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
          <div onClick={() => {
              handleClose();
          }} className="d-flex flex-row align-items-center justify-content-end">
              <CancelRoundedIcon />
          </div>
        <div className="px-5 py-4">
          {(() => {
            switch (state) {
              case "switch devices":
                return (
                  <DeviceTest
                    handleBack={handleClose}
                    handleStateChange={handleStateChange}
                    state={state}
                  />
                );
              case "speaker test":
                return (
                  <Test handleStateChange={handleStateChange} state={state} />
                );
              default:
                break;
            }
          })()}
        </div>
      </Dialog>
    </>
  );
};

export default CameraAndMic;
