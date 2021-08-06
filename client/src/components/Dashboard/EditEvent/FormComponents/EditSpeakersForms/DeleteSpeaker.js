import React from "react";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch } from "react-redux";
import { deleteSpeaker } from "../../../../../actions";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DeleteSpeaker = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.openDeleteDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Remove this Speaker."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            By doing so, this speaker won't be able to join this event using
            invite link that was previously sent. Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleCloseDeleteSpeaker}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteSpeaker(props.id));
              props.handleCloseDeleteSpeaker();
              setState({ open: true, vertical: "top", horizontal: "center" });
            }}
            style={{ color: "#538BF7" }}
            autoFocus
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity="success">
            Speaker removed successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default DeleteSpeaker;
