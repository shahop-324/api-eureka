import React from "react";

import "./../../../../assets/Sass/Billing.scss";
import { Divider } from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import { useSelector } from "react-redux";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { Avatar, Drawer, IconButton } from "@material-ui/core";
import dateFormat from "dateformat";

const ProPlanCard = () => {

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const communityToken = useSelector((state) => state.communityAuth.token);

    const displayRazorpay = async () => {

    
        const res = await loadRazorpay();
    
        if (!res) {
          alert("Razorpay SDK failed to load. Are you online?");
          return;
        }
    
        let order = await fetch(
          "http://localhost:3000/eureka/v1/razorpay/createCommunityPlanOrder",
          {
            method: "POST",
            body: JSON.stringify({
              selectedPlanId: "PLAN_EVENZ_001Pro",
            //   ticketId: selectedTicket,
            //   communityId: event.createdBy._id,
            //   userId: user._id,
            //   couponId:
            //     couponToBeApplied && couponToBeApplied[0]
            //       ? couponToBeApplied[0].id
            //       : null,
            }),
    
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${communityToken}`,
            },
          }
        );
    
        order = await order.json();
        console.log(order);
    
        const options = {
          key: "rzp_test_pHbL8wg7ApJttl",
        //   amount: 500000,
          amount: order.data.amount,
          currency: "INR",
          name: "Evenz",
          description: `This is a event ticket booking for buying a plan.`,
          image:
            "https://static01.nyt.com/images/2014/08/10/magazine/10wmt/10wmt-superJumbo-v4.jpg",
          order_id: order.data.id,
          handler: function (response) {
            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature);
            alert(
              "Your registration was successful! Check your ticket in Email or Booked Tickets of user profile section."
            );
            // setRegistrationSuccess({ verticalRegistrationSuccess: "top", horizontalRegistrationSuccess: "center", openRegistrationSuccess: true });
          },
          prefill: {
            // name: `${userDetails.firstName} ${userDetails.lastName}`,
            // email: userDetails.email,
          },
          notes: {
            // We can add some notes here
          },
          theme: {
            color: "#538BF7",
          },
        };
        var paymentObject = new window.Razorpay(options);
    
        paymentObject.open();
        paymentObject.on("payment.failed", function (response) {
          alert(response.error.code);
          alert(response.error.description);
          alert(response.error.source);
          alert(response.error.step);
          alert(response.error.reason);
          alert(response.error.metadata.order_id);
          alert(response.error.metadata.payment_id);
        });
      };
    
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => {
            resolve(true);
          };
          script.onerror = () => {
            resolve(false);
          };
          document.body.appendChild(script);
        });
    
    };
  return (
    <>
      <div className="pricing-plan-card p-4">
              <div className="pricing-plan-name mb-3">Pro</div>
              <div className="d-flex flex-row align-items-center">
                <div className="original-plan-price-value me-3">$699</div>
                <div className="original-plan--reduced-price-value me-1">
                  $599 /
                </div>
                <div className="plan-tax-text">month + applicable Tax</div>
              </div>
              <div className="my-4">
                <Divider />
              </div>
              <div className="plan-features-offered-list">
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">2 organizer included</div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    12000 registrations included per year
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Full access to Evenz Event Platform
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">72 hours of streaming</div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Livestream and custom RTMP{" "}
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Email customisation and branding
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">Live polls and Q&A </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    SEO-optimized event registration pages{" "}
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Ticketing and payment processing{" "}
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Event Analytics Dashboard
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">Unlimited Events</div>
                </div>
              </div>

              <button
              onClick={() => {
                setOpenDrawer(true);
                // displayRazorpay()
              }}
                className="btn btn-outline-primary btn-outline-text mt-3"
                style={{ width: "100%" }}
              >
                Upgrade
              </button>
            </div>







            <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDrawer}>
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Review Plan Details</div>
              <div
                onClick={() => {
                  setOpenDrawer(false);
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
            <div className="side-drawer-more-details-content-section">
              <div className="side-drawer-content-row mb-4">
                <div className="content-heading btn-outline-text">
                  Plan Name
                </div>
                <div className="side-drawer-main-content-text ms-5 ps-5">
                  Pro
                </div>
              </div>

              <div className="side-drawer-content-row mb-4">
                <div className="content-heading btn-outline-text">Price</div>
                <div className="side-drawer-main-content-text ms-5 ps-5">
                  599 USD /
                  <div className="plan-tax-text">month + applicable Tax</div>
                </div>
              </div>

              <div className="my-3">
                <hr />
              </div>

              <div className="plan-features-offered-list">
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">8 organizer included</div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    45000 registrations included per month
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Full access to Evenz Event Platform
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">320 hours of streaming</div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Livestream and custom RTMP{" "}
                  </div>
                </div>

                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    SEO-optimized event registration pages{" "}
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Ticketing and payment processing{" "}
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">
                    Event Analytics Dashboard
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-2">
                  <div className="me-3">
                    <CheckRoundedIcon style={{ fontSize: "18" }} />
                  </div>
                  <div className="plan-feature-text">Unlimited Events</div>
                </div>
              </div>

              <div
                className="mt-4"
                style={{
                  fontSize: "11px",
                  fontWeight: "500",
                  fontFamily: "Inter",
                }}
              >
                Your plan will start immediately after this checkout and will
                end on 23 Aug 2021. <br />{" "}
                <div className="my-1">
                  By continuing, you agree to follow evenz terms & conditions
                  for communities.
                </div>{" "}
              </div>

              <div style={{ width: "100%" }}>
                <button
                onClick={()=> {
                     displayRazorpay();
                     setOpenDrawer(false);
                }}
                  type="button"
                  className="btn btn-primary btn-outline-text mt-4"
                  style={{ width: "100%" }}
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default ProPlanCard;
