import React from "react";
import Ripple from "./../../../ActiveStatusRipple";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

const CurrentPlanCard = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const handleDeleteCoupon = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <div className="current-plan-card px-4 py-3 mb-5">
        <div>
          <div className="btn-outline-text">Current plan</div>
          <div className="btn-outline-text my-4 current-plan-name">FREE</div>
          <div className="plan-limit-left-message mb-3">
            You have 100 registrations available and 2hrs of streaming left.
          </div>
          <div className="plan-card-upgrade-message">
            Wanna lift up your capabilities ? <a href="#">Upgrade to Basics</a>
          </div>
        </div>
        <div>
          <div className="d-flex flex-row justify-content-end mb-3">
            <div className="btn-outline-text current-plan-will-renew-at">
              Current plan will renew at:
            </div>
            <div className="plan-renewal-date ms-3">22/07/2021</div>
          </div>
          <div className="d-flex flex-row justify-content-end mb-3">
            <div className="btn-outline-text current-plan-will-renew-at me-3">
              Current status:
            </div>
            <div
              className="d-flex flex-row align-items-center event-field-label field-label-value"
              style={{ color: "#75BF72" }}
            >
              <Ripple /> Active{" "}
            </div>
          </div>

          <div className="d-flex flex-row justify-content-end">
            <button
              type="button"
              onClick={handleDeleteCoupon}
              className="btn btn-outline-primary btn-outline-text"
            >
              Cancel Membership
            </button>
          </div>
        </div>
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Cancel membership."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to terminate your current plan. By doing so, this plan
            will not renew automatically as it end. You can still enjoy all
            features in this plan until it expires.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // dispatch(deleteCoupon(id));
              handleCloseDeleteDialog();
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

export default CurrentPlanCard;
