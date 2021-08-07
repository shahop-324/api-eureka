import React from "react";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { deleteCoupon } from "../../../actions";

const DeleteCoupon = (props) => {
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
          {"Delete this Coupon."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to delete this coupon. By doing so, this coupon code
            won't be accepted as valid if someone tries to register via this
            code.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteCoupon(props.id));
              props.handleCloseDeleteDialog();
            }}
            style={{ color: "#538BF7" }}
            autoFocus
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCoupon;
