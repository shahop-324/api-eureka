import React, { useEffect } from "react";

import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Coupon.scss";

import CouponCard from "./HelperComponent/CouponCard";
import AddNewCoupon from "./FormComponents/AddNewCoupon";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons } from "../../actions";
import Loader from "../Loader";
import NoContentFound from "../NoContent";
import noCoupons from './../../assets/images/coupons.png';

const renderCouponList = (coupons, eventDetails) => {
  return coupons
    .slice(0)
    .reverse()
    .map((coupon) => {
      return (
        <CouponCard
          id={coupon._id}
          key={coupon._id}
          url={`https://bluemeet-inc.s3.us-west-1.amazonaws.com/${eventDetails.image}`}
          percentage={coupon.discountPercentage}
          
          validTillDate={coupon.validTillDate}
          discountCode={coupon.discountCode}
          status={coupon.status}
        />
      );
    });
};

const Coupons = () => {
  const dispatch = useDispatch();
  const { coupons, isLoading, error } = useSelector((state) => state.coupon);
  const {eventDetails} = useSelector((state) => state.event);

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleNewCoupon = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="coupon-management-content-grid px-3 mx-3 mb-4 py-4 d-flex flex-row justify-content-center align-items-center">
        <Loader />
      </div>
    );
  } 

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">All Coupons</div>
          <div className="sec-heading-action-button d-flex flex-row">
            <button
              className="btn btn-primary btn-outline-text"
              onClick={handleNewCoupon}
            >
              Create New Coupon
            </button>

            <AddNewCoupon open={open} handleClose={handleClose} />
          </div>
        </div>
        <div className="coupon-management-content-grid px-3 mx-3 mb-4 py-4">
          { (typeof coupons !== 'undefined' && coupons.length > 0) ?  renderCouponList(coupons, eventDetails) : <NoContentFound msgText="Your event coupons will appear here" img={noCoupons} />}
        </div>
      </div>
    </>
  );
};

export default Coupons;
