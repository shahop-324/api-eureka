import React from "react";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Ripple from "./../../ActiveStatusRipple";
import "./../../../assets/Sass/Coupon.scss";

import EditCoupon from "../FormComponents/EditCoupon";
import DeleteCoupon from "../FormComponents/DeleteCoupon";
import { useDispatch } from "react-redux";
import { fetchCoupon } from "../../../actions";

const CouponCard = ({
  id,
  url,
  percentage,
  onEvent,
  validTillDate,
  discountCode,
  status,
}) => {
  const [open, setOpen] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const dispatch = useDispatch();

  const handleEditCoupon = () => {
    setOpen(true);
    dispatch(fetchCoupon(id));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteCoupon = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <div className="coupon-card-wrapper">
      <div className="mb-3" style={{ position: "relative", height: "40%" }}>
        <img src={url} alt="event-poster"></img>
        <div
          className="d-flex flex-column"
          style={{ position: "absolute", top: "0", right: "4.5%" }}
        >
          <div
            className="fit-content"
            onClick={() => {
              // dispatch(fetchCoupon(id));
              handleEditCoupon();
            }}
          >
            <IconButton aria-label="delete" color="primary">
              <EditRoundedIcon style={{ fill: "#538BF7" }} />
            </IconButton>
          </div>

          <div className="fit-content" onClick={handleDeleteCoupon}>
            <IconButton aria-label="delete" color="secondary">
              <DeleteIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div
        className="coupon-card-other-info px-4 py-3 d-flex flex-column align-items-center"
        style={{ height: "60%" }}
      >
        <div className="coupon-discount-percent mb-3">{percentage}% Off</div>
        <div className="discount-on mb-3">On {onEvent}</div>
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-outline-secondary disabled-text"
            style={{ minWidth: "210px" }}
            disabled
          >
            30 JUN, TUE
          </button>
        </div>
        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary disabled-text"
            style={{ minWidth: "210px" }}
            disabled
          >
            {discountCode}
          </button>
        </div>
        <div
          className="d-flex flex-row align-items-center event-field-label field-label-value"
          style={{ color: "#75BF72" }}
        >
          <Ripple /> Active{" "}
        </div>
      </div>

      <EditCoupon open={open} handleClose={handleClose} id={id} />

      <DeleteCoupon
        openDeleteDialog={openDeleteDialog}
        handleCloseDeleteDialog={handleCloseDeleteDialog}
        id={id}
      />
    </div>
  );
};

export default CouponCard;
