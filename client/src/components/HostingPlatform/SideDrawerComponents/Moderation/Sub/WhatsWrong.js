import React from "react";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

const WhatsWrong = ({ open, handleClose, name, reason }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            This message has been marked as <b> {reason} </b> by <b> {name} </b>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-outline-text btn-primary"
            onClick={handleClose}
          >
            Okay
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WhatsWrong;
