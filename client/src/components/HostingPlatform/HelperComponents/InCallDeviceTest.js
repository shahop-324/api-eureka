/* eslint-disable no-unused-vars */
import React from "react";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DeviceTest from "./DeviceTest";
import { IconButton } from "@material-ui/core";
import HighlightOffRoundedIcon from '@material-ui/icons/HighlightOffRounded';
import { makeStyles } from "@material-ui/core";

const InCallDeviceTest = (props) => {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const useStyles = makeStyles(() => ({
    paper: { minWidth: "998px" },
  }));

  const classes = useStyles();

  return (
    <>
      <Dialog
      classes={{ paper: classes.paper}}
      style={{height: "auto"}}
        // fullScreen={fullScreen}
        open={true}
        // open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
          <div  style={{height: "auto"}} className="create-new-coupon-form ">
              <div>
                  <IconButton >
<HighlightOffRoundedIcon />


                  </IconButton>
              </div>
          <DeviceTest />
          </div>
          
      </Dialog>
    </>
  );
};

export default InCallDeviceTest;