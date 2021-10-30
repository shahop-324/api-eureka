/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Footer from "../../Footer";

import "./../Styles/pricing.scss";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import TopNav from "../Helper/TopNav";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import SelectCommunityList from "../Helper/SelectCommunityList";
import {
  Avatar,
  Dialog,
  IconButton,
  Radio,
  SwipeableDrawer,
  withStyles,
} from "@material-ui/core";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Bored from "./../../../assets/images/Bored.png";
import { Link } from "react-router-dom";
import dateFormat from "dateformat";
import { Field, reduxForm } from "redux-form";
import {
  createDemoRequest,
  errorTrackerForCreateDemo,
  switchToFreePlan,
} from "../../../actions";
import Select from "react-select";

import PhoneInput from "react-phone-input-2";
import PreFooter from "../../PreFooter";
import CreateNewCommunityMsgCard from "../../UserAccount/CreateNewCommunityMsgCard";
import FemaleMascot from "./../../../assets/images/femaleMascot.png";
import { useSnackbar } from "notistack";
import RequestDemo from "../FormComponents/RequestDemo";

const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1/"
  : "https://api.bluemeet.in/api-eureka/eureka/v1/";

const basicPlan = {
  name: "Basic",
  price: "0",
  details: [
    "1 organiser",
    "100 registrations",
    "4 hours event length",
    "Ticketing and payment processing",
    "1 Event Per Month",
  ],
};
const starterPlan = {
  name: "Starter",
  price: "19",
  details: [
    "2 organiser",
    "300 registrations",
    "24 hours event length",
    "Ticketing and payment processing",
    "3 Event Per Month",
    "Unlimited Coupons",
    "Access to queries & Reviews",
    "Basic Analytics",
    "Sharable event recordings",
  ],
};
const professionalPlan = {
  name: "Professional",
  price: "39",
  details: [
    "5 organiser",
    "1200 registrations",
    "72 hours event length",
    "Ticketing and payment processing",
    "SEO Optimized Landing page",
    "5 Event Per Month",
    "Unlimited Coupons",
    "Access to queries & Reviews",
    "Basic Analytics",
    "Sharable event recordings",
    "Stage Customisation",
    "RTMP & Custom streaming",
    "Full access to networking & booths",
    "Marketing tools",
    "Access to integrations",
    "Real Time Analytics",
    "Custom registration form",
    "Sponsors and shoutouts",
    "email customisation",
  ],
};

const options = [
  { value: "RGe_0001", label: "Asia" },
  { value: "RGe_0002", label: "Africa" },
  { value: "RGe_0003", label: "North America" },
  { value: "RGe_0004", label: "South America" },
  { value: "RGe_0005", label: "Europe" },
  { value: "RGe_0006", label: "Australia" },
  { value: "RGe_0007", label: "Antarctica" },
];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
};

const expirationDate = dateFormat(Date.now() + 30 * 24 * 60 * 60 * 1000);

const RoyalBlueRadio = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3372F0",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const renderInput = ({
  input,
  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {warning}
            </div>
          )))}
    </div>
  );
};

const renderPhoneInput = ({
  input,
  meta: { touched, error, warning },
  label,
  type,
}) => (
  <div>
    <div>
      <PhoneInput
        inputStyle={{
          paddingLeft: "50px",
        }}
        inputProps={{
          enableSearch: true,
        }}
        country={"us"}
        // value={state.phone}
        //   onChange={phone => setState({ phone })}
        {...input}
        type={type}
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {warning}
            </div>
          )))}
    </div>
  </div>
);

const renderEventPreferences = ({
  input,
  meta: { touched, error, warning },
  name,
}) => (
  <div>
    <div>
      <Select
        styles={styles}
        className="basic-multi-select"
        classNamePrefix="select"
        name={name}
        options={options}
        value={input.value}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {warning}
            </div>
          )))}
    </div>
  </div>
);

const showResults = (formValues) => {
  // await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};

const Pricing = (props) => {
  const { signInSucceded } = useSelector((state) => state.auth);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const referral = useSelector((state) => state.user.referredUserId);
  const dispatch = useDispatch();

  const { handleSubmit, pristine, submitting } = props;

  const { communities } = useSelector((state) => state.community);

  const userToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.userDetails);
  const userDetails = useSelector((state) => state.user.userDetails);

  const [selectedCommunity, setSelectedCommunity] = useState(
    communities && communities[0]
  );

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const [openDemoForm, setOpenDemoForm] = React.useState(false);

  // handleCloseRequestDemo, openDemoForm,

  const handleCloseRequestDemo = () => {
    setOpenDemoForm(false);
  };

  const [selectedPlan, setSelectedPlan] = useState("");

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.firstName = formValues.firstName;
    ModifiedFormValues.lastName = formValues.lastName;
    ModifiedFormValues.email = formValues.email;
    ModifiedFormValues.companyName = formValues.companyName;
    ModifiedFormValues.phoneNumber = formValues.phoneNumber;
    ModifiedFormValues.jobTitle = formValues.jobTitle;
    ModifiedFormValues.isAnEventAgency = formValues.eventAgency;
    ModifiedFormValues.region = formValues.region.label;

    dispatch(createDemoRequest(ModifiedFormValues));
    showResults(ModifiedFormValues);
  };

  const displayRazorpay = async (referral) => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    console.log(selectedCommunity);
    console.log(user);

    let order = await fetch(`${BaseURL}razorpay/createCommunityPlanOrder`, {
      method: "POST",
      body: JSON.stringify({
        planName: selectedPlan.name,
        planDetails: selectedPlan,
        communityId: selectedCommunity,
        transaction_type: "community_plan",
        userId: user._id,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    });

    order = await order.json();
    console.log(order);

    const options = {
      key: "rzp_live_bDVAURs4oXxSGi",
      amount: order.data.amount,
      currency: "USD",
      name: "Bluemeet",
      description: `This is a community plan purchase for communityId ${selectedCommunity} which is made by user ${userDetails._id}.`,
      image:
        "https://bluemeet-inc.s3.us-west-1.amazonaws.com/company-logo.png",

      order_id: order.data.id,
      handler: function (response) {
        alert("Congratulations, Your plan purchase was successful!");
      },
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
      },
      notes: {
        // We can add some notes here
        transaction_type: "community_plan",
        communityId: selectedCommunity,
        userId: userDetails._id,
        planName: selectedPlan.name,
        referral: referral, // PASS REFERRAL CODE HERE (IF ANY)
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

  const handleChange = (event) => {
    setSelectedCommunity(event.target.value);
    console.log(event.target.value);
  };

  const renderCommunitiesList = (communities) => {
    return communities.map((community) => {
      const name = community.name;
      const image = `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${community.image}`;
// https://bluemeet-inc.s3.us-west-1.amazonaws.com/company-logo.png
      return (
        <div
          className="ticket-card mb-2 px-3 py-4"
          style={{ gridTemplateColumns: "0.6fr 0.8fr 4fr " }}
        >
          <div className="d-flex flex-row align-items-center">
            <RoyalBlueRadio
              color="primary"
              style={{ fill: "#538BF7", maxHeight: "fit-content" }}
              checked={selectedCommunity === community._id}
              onChange={handleChange}
              value={community._id}
              name="radio-button-demo"
              inputProps={{ "aria-label": "A" }}
            />
          </div>
          <Avatar src={image} alt={name} variant="rounded" />
          <div className="d-flex flex-row align-items-center">
            <div className="ticket-name mb-1">{name}</div>
          </div>
        </div>
      );
    });
  };

  const renderOrderSummaryList = (selectedPlan) => {
    return selectedPlan.details.map((detail) => {
      return (
        <>
          <div className="d-flex flex-row align-items-center mb-2">
            <div className="me-3">
              <CheckRoundedIcon style={{ fontSize: "18" }} />
            </div>
            <div className="plan-feature-text">{detail}</div>
          </div>
        </>
      );
    });
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [openCommunityList, setOpenCommunityList] = React.useState(false);

  const handleCloseCommunityList = () => {
    setOpenCommunityList(false);
  };

  const handleOpenCommunityList = (selectedPlanDetails) => {
    setSelectedPlan(selectedPlanDetails);
    setOpenCommunityList(true);
    return (
      <SelectCommunityList
        open={openCommunityList}
        handleClose={handleCloseCommunityList}
      />
    );
  };

  console.log(selectedCommunity);

  const { isSignedIn } = useSelector((state) => state.auth);

  return (
    <>
      <div className="container-fluid p-0">
        <div className="header-section-home header-section">
          {/* Here Goes Top Nav */}

          <TopNav />

          <div className="pricing-section  py-4">
            <div className="pricing-heading-primary mt-5 mb-4">
              Built For <span style={{ color: "#ffffff" }}>Everyone</span>
            </div>
            <div className="pricing-heading-secondary mb-4">
              Choose a plan that works for you
            </div>

            <div className="pricing-cards-grid-wrapper py-5">
              <div className="card__container grid" style={{ maxWidth: "1600px" }}>
                {/* <!--==================== CARD 1 ====================--> */}
                <article
                  className="card__content grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  <div className="card__pricing">
                    <div className="card__pricing-number">
                      <span className="card__pricing-symbol">$</span>0
                    </div>
                    <span className="card__pricing-month">/month</span>
                  </div>

                  <header className="card__header">
                    <div className="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/free-coin.png"
                        alt=""
                        className="card__header-img"
                      />
                    </div>

                    <span className="card__header-subtitle mb-3">Free plan</span>
                    <h1 className="card__header-title mb-4">Basic</h1>
                  </header>

                  <ul className="card__list grid">
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">1 organiser</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">100 registrations</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">4 hours event length</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Ticketing and payment processing
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">1 Event Per Month</p>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      isSignedIn
                        ? handleOpenCommunityList(basicPlan)
                        : history.push("/login/buy-plan/?intent=buyPlan");
                    }}
                    className="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>

                {/* <!--==================== CARD 1 ====================--> */}
                <article
                  className="card__content grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  <div className="card__pricing">
                    <div className="card__pricing-number">
                      <span className="card__pricing-symbol">$</span>19
                    </div>
                    <span className="card__pricing-month">/month</span>
                  </div>

                  <header className="card__header">
                    <div className="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/free-coin.png"
                        alt=""
                        className="card__header-img"
                      />
                    </div>

                    <span className="card__header-subtitle mb-3">
                      FOR INDIVIDUALS
                    </span>
                    <h1 className="card__header-title mb-4">Starter</h1>
                  </header>

                  <ul className="card__list grid">
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Everything in basic and
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">2 organisers</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">300 registrations</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        24 hours event length
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Unlimited Coupons</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Access to Queries & Reviews
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Basic Analytics</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">3 Events per month</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Sharable Event Recordings
                      </p>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      isSignedIn
                        ? handleOpenCommunityList(starterPlan)
                        : history.push("/login/buy-plan/?intent=buyPlan");
                    }}
                    className="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>

                {/* <!--==================== CARD 2 ====================--> */}
                <article
                  className="card__content pricing-card-2 grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  <div className="card__pricing">
                    <div className="card__pricing-number">
                      <span className="card__pricing-symbol">$</span>39
                    </div>
                    <span className="card__pricing-month">/month</span>
                  </div>

                  <header className="card__header">
                    <div className="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/pro-coin.png"
                        alt=""
                        className="card__header-img"
                      />
                    </div>

                    <span className="card__header-subtitle mb-3">Most popular</span>
                    <h1 className="card__header-title mb-4">Professional</h1>
                  </header>

                  <ul className="card__list grid">
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Everything in starter and
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">4 organisers</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">1200 Registrations</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        72 hours event length
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Stage Customisation</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        RTMP & Custom streaming
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Full Access to networking and booths
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Marketing tools</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Access to integrations
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Real Time analytics</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Custom registration form
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Sponsors and shoutouts
                      </p>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      isSignedIn
                        ? handleOpenCommunityList(professionalPlan)
                        : history.push("/login/buy-plan/?intent=buyPlan");
                    }}
                    className="card__button btn btn-primary btn-outline-text"
                  >
                    Choose this plan
                  </button>
                </article>

                {/* <!--==================== CARD 3 ====================--> */}
                <article
                  className="card__content grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  {/* <div className="card__pricing">
                    <div className="card__pricing-number">
                      <span className="card__pricing-symbol">$</span>29
                    </div>
                    <span className="card__pricing-month">/month</span>
                  </div> */}

                  <header className="card__header">
                    <div className="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/enterprise-coin.png"
                        alt=""
                        className="card__header-img"
                      />
                    </div>

                    <span className="card__header-subtitle mb-3">For agencies</span>
                    <h1 className="card__header-title mb-4">Enterprise</h1>
                  </header>

                  <ul className="card__list grid">
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Everything in Professional and
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Unlimited events</p>
                    </li>

                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        upto 1,00,000 registrations
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        SEO optimised Landing page
                      </p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">24 * 7 Support</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">Onboarding session</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">99.99% Uptime SLA</p>
                    </li>
                    <li className="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p className="card__list-description">
                        Unlock all features from Bluemeet
                      </p>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      setOpenDemoForm(true);
                    }}
                    className="card__button btn btn-primary btn-outline-text"
                  >
                    Talk to us
                  </button>
                </article>
              </div>
            </div>
          </div>

          <div className="FAQs-section px-4">
            <h2 className="mb-4 main-heading-calculate-profits">F.A.Q.</h2>
            <details>
              <summary>
                Is there any special pricing for non profit organisation?
              </summary>
              <p>
                Yes, we have special offers for NGOs and Not for profit
                organisations. For More details please contact contact us at
                <a href="mailto:support@bluemeet.in"> support@bluemeet.in</a>
              </p>{" "}
              {/*  */}
            </details>
            <details>
              <summary>
                How many tickets, coupons and landing pages can I create ?
              </summary>
              <p>
                There is no limit on how many tickets, coupons and landing pages
                you can create as of now. And this service is always going to be
                offered at zero cost.
              </p>
            </details>
            <details>
              <summary>
                What all is needed to get started with posting and selling
                tickets on bluemeet platform ?
              </summary>
              <p>
                All you need is a free bluemeet account and you can start posting
                and selling your tickets to the whole world in few clicks.
              </p>
            </details>
            <details>
              <summary>
                How much service charge bluemeet takes on each booking and is this
                same for any type of tickets ?
              </summary>
              <p>
                We have a simple pricing model which chrages only 1% on each
                booking along with tax price as applicable. Yes, we charge only
                1% on any ticket type you create and sell.
              </p>
            </details>
            <details>
              <summary>
                How can I recieve my payouts and what payment methods do you
                accept ?
              </summary>
              <p>
                You can recieve your payouts simply by adding a payout request
                from your bluemeet community dashboard. You will be able track
                status of payment and payment is generally processed within 6-18
                hrs of posting request. We recieve domestic and international
                payments using Debit cards, credit cards, UPI, Digital Wallets
                and many more.
              </p>
            </details>
            <details>
              <summary>I still have some queries ?</summary>
              <p>
                Please reach out to us at{" "}
                <a href="mailto:support@bluemeet.in"> support@bluemeet.in</a>
              </p>
            </details>
          </div>
        </div>
        <PreFooter />
        {/* Pre Footer Here */}
        <Footer />
        {/* Footer */}
      </div>

      <Dialog
        fullScreen={fullScreen}
        open={openCommunityList}
        aria-labelledby="responsive-dialog-title"
      >
        <div style={{ height: "100%" }} className="d-flex flex-column">
          <div
            className="select-community-list px-3 py-4 d-flex flex-column justify-content-center"
            style={{ minWidth: "480px" }}
          >
            <div
              className="select-community-heading"
              style={{ fontSize: "0.9rem" }}
            >
              {typeof communities !== "undefined" && communities.length > 0
                ? "Select Your community"
                : "Oops, you don't have any communities"}
            </div>
            {typeof communities !== "undefined" && communities.length > 0 ? (
              renderCommunitiesList(communities)
            ) : (
              <CreateNewCommunityMsgCard
                msgText="Let's create your first community."
                img={FemaleMascot}
              />
            )}

            <div className="d-flex flex-row align-items-center justify-content-center mt-2">
              <button
                onClick={() => {
                  typeof communities !== "undefined" && communities.length > 0
                    ? setOpenDrawer(true)
                    : history.push("/user/home/");
                  handleCloseCommunityList();
                }}
                className="btn btn-primary btn-outline-text me-2"
                style={{ width: "100%" }}
              >
                Proceed
              </button>
              <button
                onClick={() => {
                  handleCloseCommunityList();
                }}
                className="btn btn-outline-primary btn-outline-text me-2"
                style={{ width: "100%" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDrawer} onOpen={() => {
          console.log("Side nav was opended")
        }}
        onClose={() => {
          console.log("Side nav was closed")
        }}>
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
                  {selectedPlan && selectedPlan.name}
                </div>
              </div>

              <div className="side-drawer-content-row mb-4">
                <div className="content-heading btn-outline-text">Price</div>
                <div className="side-drawer-main-content-text ms-5 ps-5">
                  {selectedPlan && selectedPlan.price} USD /
                  <div className="plan-tax-text">month + applicable Tax</div>
                </div>
              </div>

              <div className="my-3">
                <hr />
              </div>

              <div className="plan-features-offered-list">
                {selectedPlan && renderOrderSummaryList(selectedPlan)}
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
                end on {expirationDate}. <br />{" "}
                <div className="my-1">
                  By continuing, you agree to follow Bluemeet{" "}
                  <Link to="/terms-of-service">Terms & Conditions</Link>
                  for communities.
                </div>{" "}
              </div>

              <div style={{ width: "100%" }}>
                <button
                  onClick={() => {
                    selectedPlan.name !== "Basic"
                      ? displayRazorpay()
                      : dispatch(switchToFreePlan(selectedCommunity));
                    setOpenDrawer(false);
                  }}
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

      {/* Request Demo form goes here */}

      <RequestDemo
        handleCloseRequestDemo={handleCloseRequestDemo}
        openDemoForm={openDemoForm}
      />
    </>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.firstName) {
    errors.firstName = "Required";
  }
  if (!formValues.lastName) {
    errors.lastName = "Required";
  }
  if (!formValues.email) {
    errors.email = "Email is required";
  }
  if (
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
  ) {
    errors.email = "Invalid email address";
  }
  if (!formValues.phoneNumber) {
    errors.phoneNumber = "Contact no. is required";
  }
  if (!formValues.companyName) {
    errors.companyName = "Associated company or organisation is required";
  }
  if (!formValues.jobTitle) {
    errors.jobTitle = "Job title is required";
  }
  if (!formValues.region) {
    errors.region = "Region is required";
  }
  if (!formValues.eventAgency) {
    errors.eventAgency = "Required";
  }

  return errors;
};

export default reduxForm({
  form: "requestDemoForm",
  validate,
})(Pricing);
