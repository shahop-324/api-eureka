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
import { useDispatch, useSelector } from "react-redux";
import { deleteSession, errorTrackerForDeleteSession } from "../../../../../actions";
import Loader from "../../../../Loader";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const DeleteSession = (props) => {
  const dispatch = useDispatch();

  const {error, isLoading} = useSelector((state) => state.session);

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


  if(isLoading) {
    return (<div className="d-flex flex-row align-items-center justify-content-center" style={{width: "100%", height: "80vh"}}> <Loader /> </div>);
  }

  if(error) {
    dispatch(errorTrackerForDeleteSession());
    alert(error);
    return;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.openDeleteDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Remove this session."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to Remove this session. By doing so, no one will be
            able to access or restore this session in any way. Are you sure ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteSession(props.id));
              props.handleCloseDeleteDialog();
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
            Session deleted successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default DeleteSession;
