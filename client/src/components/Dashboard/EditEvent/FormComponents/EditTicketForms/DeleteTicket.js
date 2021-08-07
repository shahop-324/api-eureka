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
import { deleteTicket } from "../../../../../actions";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DeleteTicket = (props) => {
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const dispatch = useDispatch();
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
          {"Delete this ticket."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            By doing so, no one will be able to register using this ticket
            anymore. But previously registered users can still access this
            event. Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleCloseDeleteTicket}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteTicket(props.id));
              props.handleCloseDeleteTicket();
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
          <Alert onClose={handleClose} severity="info">
            Ticket deleted successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default DeleteTicket;
