import React from "react";
import { useSelector } from "react-redux";

import { SwipeableDrawer } from "@material-ui/core";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { IconButton } from "@material-ui/core";
import PayoutHistoryListFields from "./../HelperComponent/PayoutComponents/PayoutHistoryListFields";
import PayoutHistoryDetailsCard from "./../HelperComponent/PayoutComponents/PayoutHistoryDetailsCard";
import NoContentFound from "../../NoContent";
import NoPayoutHistory from "./../../../assets/images/no-transaction.svg";

const renderPayoutsList = (payouts) => {
  return payouts.map((payout) => {
    return (
      <PayoutHistoryDetailsCard
      //   Requested at processed at amount status Payout Id paypal email
      />
    );
  });
};

const ShowHistory = ({ open, handleClose }) => {
  const { payouts } = useSelector((state) => state.community);

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer anchor="right" open={open}>
          <div
            className="registration-more-details-right-drawer px-4 py-4"
            style={{ width: "1050px" }}
          >
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Your payout History</div>
              <div
                onClick={() => {
                  handleClose();
                }}
              >
                <IconButton aria-label="close-drawer">
                  <CancelOutlinedIcon
                    style={{ fontSize: "26", color: "#4D4D4D" }}
                  />
                </IconButton>
              </div>
            </div>
            <div className="my-3">
              <hr />
            </div>
            <PayoutHistoryListFields />

            <div className="my-3">
              <hr />
            </div>

            {typeof payouts !== "undefined" && payouts.length > 0 ? (
              renderPayoutsList(payouts)
            ) : (
              <div
                style={{ height: "73vh", width: "100%" }}
                className="d-flex flex-row align-items-center justify-content-center"
              >
                <NoContentFound
                  msgText={"No payout history was found."}
                  img={NoPayoutHistory}
                />
              </div>
            )}
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default ShowHistory;
