import React from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Billing.scss";
import RazorPayPNG from "./../../assets/images/Razorpay_logo.svg";
import PayPalPNG from "./../../assets/images/paypal_logo.png";
import IndianFlagPNG from "./../../assets/images/Indian_flag.png";
import Zoom from "@material-ui/core/Zoom";
import { Divider, Tooltip } from "@material-ui/core";
// import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import { useDispatch, useSelector } from "react-redux";
import { editCommunity } from "../../actions";
import { useParams } from "react-router";

const ClientId =
  "AXmtL1lLDHZcErLRu07uJ8Ok5PzRANo5dBrkaTn5dGQ8UAiV9hAp3Ottmao0wUHzxiMkW8wA32FRIDLL";
const Secret =
  "EKJaRnyfLY7MPEr94GiEU8Ob2nRyVuFV3Zlr_RVSacBYNGI5RVcYJcGIwTQ4nCkDZQGHPuv-o1-fSlMc";

const RevenueManagement = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const communityId = params.id;

  const community = useSelector((state) => state.community.communityDetails);

  const urlSearchParams = new URLSearchParams(window.location.search);
  const urlparams = Object.fromEntries(urlSearchParams.entries());

  if (urlparams.merchantId === community.paypalTrackingId && urlparams) {
    console.log(urlparams);

    dispatch(editCommunity(communityId, { paypalOnboardingData: urlparams }));
  }

  const getPaypalAccessToken = async (base64EncodedString) => {
    try {
      let res = await fetch(
        "https://api-m.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Accept: "application/json",
            "Accept-Language": "en_US",
            Authorization: `Basic ${base64EncodedString}`,
          },
        }
      );

      res = await res.json();
      console.log(res);
      return res.access_token;
    } catch (error) {
      console.log(error);
    }
  };

  const generatePaypalSignupLink = async (access_token) => {
    try {
      let res = await fetch(
        "https://api-m.sandbox.paypal.com/v2/customer/partner-referrals",
        {
          method: "POST",

          body: JSON.stringify({
            partner_config_override: {
              return_url:
                "https://8bcbb9ff3833.ngrok.io/community/revenue-management/60f0a29ddc14c768cac1d4de",
            },
            tracking_id: community.paypalTrackingId,

            operations: [
              {
                operation: "API_INTEGRATION",
                api_integration_preference: {
                  rest_api_integration: {
                    integration_method: "PAYPAL",
                    integration_type: "THIRD_PARTY",
                    third_party_details: {
                      features: ["PAYMENT", "REFUND"],
                    },
                  },
                },
              },
            ],
            products: ["EXPRESS_CHECKOUT"],
            legal_consents: [
              {
                type: "SHARE_DATA_CONSENT",
                granted: true,
              },
            ],
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      res = await res.json();
      console.log(res);

      window.location.href = res.links[1].href;
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnectWithPaypal = async () => {
    dispatch(editCommunity(communityId, { paymentGateway: "Paypal" }));
    console.log(btoa(ClientId + ":" + Secret));

    const access_token = await getPaypalAccessToken(
      btoa(ClientId + ":" + Secret)
    );

    const signUpLink = generatePaypalSignupLink(access_token);

    console.log(signUpLink);
  };

  return (
    <>
      <div style={{minWidth: "1138px"}}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Manage Revenue Flow</div>
          <div className="sec-heading-action-button d-flex flex-row"></div>
        </div>
        <div className="event-management-content-grid px-4 mx-3 mb-4 py-4">
          <div className="btn-outline-text" style={{ color: "#626262" }}>
            Select your payment service provider (Caution: You cannot change
            your preference after this.)
          </div>

          <div
            className="pricing-cards-section pt-4"
            style={{ gridTemplateColumns: "1fr 1fr" }}
          >
            <div className="pricing-plan-card p-4">
              <div
                className="payment-service-provider-logo "
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.4fr 3fr 0.4fr",
                  alignItems: "center",
                }}
              >
                <div></div>
                <img
                  src={RazorPayPNG}
                  style={{ height: "40px", justifySelf: "center" }}
                  alt="razorpay-service-provider"
                ></img>

                <div className="Indian-flag">
                  <Tooltip
                    style={{ fontSize: "26px" }}
                    title="This payment service is available only for Indian customers."
                    TransitionComponent={Zoom}
                  >
                    <img
                      src={IndianFlagPNG}
                      style={{ height: "15px", justifySelf: "center" }}
                      alt="service-offered-for-indian-customers"
                    ></img>
                  </Tooltip>
                </div>
              </div>

              <div className="my-4">
                <Divider />
              </div>

              <div className="plan-features-offered-list d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex flex-row align-items-center mb-3">
                  <div className="me-3"></div>
                  <div className="plan-feature-text">
                    Withdraw money anytime using payout link
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-3">
                  <div className="me-3"></div>
                  <div className="plan-feature-text">
                    Payment Methods: Credit ,Debit Cards, Netbanking, UPI and
                    more.
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-3">
                  <div className="me-3"></div>
                  <div className="plan-feature-text">
                    Service fees as applicable
                  </div>
                </div>
              </div>
              <div
                className="my-4"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button className="btn btn-outline-primary btn-outline-text">
                  View Account Balance
                </button>
              </div>
              <div
                className="my-4"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button className="btn btn-outline-primary btn-outline-text">
                  Generate Payout Link
                </button>
              </div>
              <div
                className="my-4"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button className="btn btn-outline-primary btn-outline-text">
                  View transactions
                </button>
              </div>
              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "150px",
                }}
              >
                <button
                  className="btn btn-primary btn-outline-text"
                  style={{
                    backgroundColor: "#538BF7",
                    border: "none",
                    width: "80%",
                  }}
                >
                  Start using Razorpay
                </button>
              </div>
            </div>

            <div className="pricing-plan-card p-4">
              <div
                className="payment-service-provider-logo "
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.4fr 3fr 0.4fr",
                  alignItems: "center",
                }}
              >
                <div></div>
                <img
                  src={PayPalPNG}
                  style={{ height: "40px", justifySelf: "center" }}
                  alt="razorpay-service-provider"
                ></img>
                <div></div>
              </div>
              <div className="my-4">
                <Divider />
              </div>

              <div className="plan-features-offered-list d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex flex-row align-items-center mb-3">
                  <div className="me-3"></div>
                  <div className="plan-feature-text">Get Instant Payout</div>
                </div>
                <div className="d-flex flex-row align-items-center mb-3">
                  <div className="me-3"></div>
                  <div className="plan-feature-text">
                    Payment Methods: Credit and Debit Cards
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center mb-3">
                  <div className="me-3"></div>
                  <div className="plan-feature-text">
                    Service fees as applicable
                  </div>
                </div>
              </div>

              <div
                className="my-4"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button className="btn btn-outline-primary btn-outline-text">
                  View transactions
                </button>
              </div>

              <div
                className="my-4"
                style={{ width: "100%", textAlign: "center" }}
              >
                <button className="btn btn-outline-primary btn-outline-text">
                  Update Account Info
                </button>
              </div>

              <div
                className=""
                style={{
                  width: "100%",
                  textAlign: "center",
                  marginTop: "210px",
                }}
              >
                <button
                  type="button"
                  onClick={handleConnectWithPaypal}
                  className="btn btn-primary btn-outline-text"
                  style={{
                    backgroundColor: "#538BF7",
                    border: "none",
                    width: "80%",
                  }}
                >
                  Connect with Paypal
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Give a FAQ section here. */}
      </div>
    </>
  );
};

export default RevenueManagement;
