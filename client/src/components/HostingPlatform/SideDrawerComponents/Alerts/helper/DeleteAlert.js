import React from "react";
import socket from "./../../../service/socket";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DeleteAlert = ({ open, handleClose, id }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const params = useParams();
  const eventId = params.eventId;

  const { userDetails } = useSelector((state) => state.user);
  const userId = userDetails._id;

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Delete this Alert"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This alert won't be visible to anyone after this. Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <button
            className="btn btn-outline-dark btn-outline-text me-3"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-outline-text btn-primary"
            onClick={() => {
              socket.emit("deleteAlert", {
                alertId: id,
                userId: userId,
                eventId: eventId,
              });
              handleClose();
            }}
          >
            Proceed
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteAlert;
