/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import "./../Styles/StaticScreenNav.scss";

import EditEventHero from "./../../../assets/images/editEventHero@2x.png";
import EditTicketsHero from "./../../../assets/images/ticketsHero@2x.png";
import RegistrationsHero from "./../../../assets/images/registrationsHero@2x.png";
import ReviewsHero from "./../../../assets/images/reviews@2x.png";
import CouponsHero from "./../../../assets/images/Coupons@2x.png";
import TradeShow from "./../../../assets/images/tradeShow.png";


import WorkflowStep1 from "./../../../assets/images/WorkflowStep1.png";
import WorkflowStep2 from "./../../../assets/images/WorkflowStep2.png";
import WorkflowStep3 from "./../../../assets/images/WorkflowStep3.png";
import AmazingEvent from "./../../../assets/images/AmazingEvent.png";
import FirstEvent from "./../../../assets/images/section-4-home.png";
import RoomsFeatures from "./../../../assets/images/section-5-home.png";
import ConnectionThatLasts from "./../../../assets/images/section-6-home.png";
import PollsChatsAndQnA from "./../../../assets/images/section-7-home.png";
import EndlessUseCases from "./../../../assets/images/section-8-home.png";
import BoostYourEvents from "./../../../assets/images/section-9-home.png";

import MenuIcon from "@material-ui/icons/Menu";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";

import CancelIcon from "@material-ui/icons/Cancel";

import { Link } from "react-router-dom";
import Footer from "../../Footer";
import Select from "react-select";

// import { Divider } from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PhoneInput from "react-phone-input-2";
import { IconButton } from "@material-ui/core";

import { Field } from "redux-form";
import { reduxForm } from "redux-form";
import { useDispatch, useSelector } from "react-redux";
import { createDemoRequest, errorTrackerForCreateDemo } from "../../../actions";

import AOS from "aos";
import "aos/dist/aos.css";

import { Dropdown, Menu } from "semantic-ui-react";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BuildIcon from "@material-ui/icons/Build";
import AirplayIcon from "@material-ui/icons/Airplay";
import AssessmentIcon from "@material-ui/icons/Assessment";
import CallMergeIcon from "@material-ui/icons/CallMerge";
import TopNav from "../Helper/TopNav";
import Timer from "../../Timer";

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



const EventManagementHome = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1100,
    });
    AOS.refresh();
  }, []);

  const { error, isLoading } = useSelector((state) => state.demo);

  const [hambergerOpen, setHambergerOpen] = useState(false);

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const { handleSubmit, pristine, submitting } = props;

  const openHamberger = () => {
    setHambergerOpen(true);
  };

  const closeHamberger = () => {
    setHambergerOpen(false);
  };

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

    // window.location.href="http://localhost:3001/home";
    // dispatch(editUser(ModifiedFormValues, file));
    showResults(ModifiedFormValues);
  };

  // if(isLoading) {
  //   return (<div className="d-flex flex-row align-items-center justify-content-center" style={{height: "100vh", width: "100vw"}}><Loader /> </div>);
  // }

  if (error) {
    alert(error);
    dispatch(errorTrackerForCreateDemo());
    return;
  }

  return (
    <>
    <Timer />
      <div className="container-fluid p-0" id="home-page">
        <div className="header-section-home header-section">
          {/* Here Goes Top Nav */}

          <TopNav />

          <div className="header-content-section d-flex">
            <div className="grid-of-2 my-4" style={{ width: "100%" }}>
              <div
                className="grid-1-of-2 pe-5 me-5"
                style={{ maxWidth: "560px", justifySelf: "end" }}
              >
                <div className="header-main-heading-and-action-btn">
                  <div
                    className="hero-heading mb-5"
                    style={{ lineHeight: "4rem" }}
                  >
                    Build to help you seamlessly manage all your events.
                  </div>

                  <div className="landing-action-btn-row d-flex flex-row align-items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setOpenDrawer(true);
                      }}
                      className="btn btn-light btn-outline-text px-3 py-2 me-3"
                    >
                      Request Demo
                    </button>
                    <Link
                      to="/signup"
                      type="button"
                      className="btn btn-dark btn-outline-text px-3 py-2"
                    >
                      Get started
                    </Link>
                  </div>
                </div>
              </div>
              <div className="grid-2-of-2 d-flex flex-row justify-content-center">
                <img
                  className="section-hero-img"
                  data-aos="zoom-in"
                  src={EditEventHero}
                  alt="home-hero"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="home-section-2 px-5 py-5"
          id="home-section-2"
          style={{ height: "auto" }}
        >
          <div className="centered-heading-primary mb-5">
            Tools Catered with your <br />
            needs in mind
          </div>
          <div className="centered-heading-secondary mb-5">
            From inviting speakers, sponsors, booths, attendees, managing teams,
            ticketing to getting feedback
            <br /> and sharing recordings post event, we do it all for you. So,
            you don’t have to. peacefully.
          </div>

          <img
            // src={EditTicketsHero}
            src={AmazingEvent}
            alt="amazing event"
            className="zoom-in"
            data-aos="zoom-in"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
        </div>

        <div className="home-section-3 px-5 py-5" id="home-section-3">
          <div
            className="grid-of-2"
            style={{ height: "auto", alignItems: "center" }}
          >
            <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
              <div className="section-heading-primary mb-4" style={{color: "#000000"}}>
              Invite Speakers, attendees 
              <br/>
And sponsors
              </div>

              <div className="home-text-description" data-aos="slide-up">
              You can invite your speakers, attendees and sponsors to join you as soon as you publish your event and manage everything with just a click.


              </div>

              

              <div className="action-btn-home mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDrawer(true);
                  }}
                  className="btn btn-dark btn-outline-text px-5 py-3 me-3"
                  style={{
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #4C4E52",
                    borderRadius: "15px",
                  }}
                >
                  Host a free event
                </button>
              </div>
            </div>
            <div
              className="grid-2-of-2 d-flex flex-row align-items-center"
              style={{ alignSelf: "center" }}
            >
              <img
                src={RegistrationsHero}
                alt="amazing event"
                className="zoom-in"
                data-aos="zoom-in"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="home-section-4 p-5">
          <div
            className="grid-of-2"
            style={{ height: "auto", alignItems: "center" }}
          >
            <div
              className="grid-1-of-2 d-flex flex-row align-items-center mb-3"
              style={{ alignSelf: "center" }}
            >
              <img
                src={ReviewsHero}
                alt="amazing event"
                data-aos="zoom-in"
                data-aos-easing="ease-in-sine"
                data-aos-delay="100"
                // className="zoom-in"
                // data-aos="slide-left"

                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
            <div className="grid-2-of-2 " style={{ alignSelf: "center" }}>
              <div
                className="section-heading-primary pb-2"
                style={{ color: "black" }}
                data-aos="slide-up"
                data-aos-easing="ease-in-sine"
                data-aos-duration="500"
                data-aos-delay="100"
              >
                Get Feedback from your  <br />
                attendees
              </div>

              <div
                className="home-text-description my-5"
                data-aos="slide-up"
                data-aos-easing="ease-in-sine"
                data-aos-duration="500"
                data-aos-delay="100"
              >
                We know its the key to constantly improve your events to drive more meaningful connections and build values that stays. 
So, you can hear to what your attendees have to say about your event using reviews feature built for your community.
              </div>

              

              <div className="action-btn-home  pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setOpenDrawer(true);
                  }}
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #4C4E52",
                    borderRadius: "15px",
                  }}
                >
                  Host a free event
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-5 p-4">
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div
                  className="section-heading-primary pb-2"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                  style={{ color: "#000000" }}
                >
                  Create coupons to boost your <br /> sale
                </div>

                <div
                  className="home-text-description my-5"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                  style={{ color: "#4D4D4D" }}
                >
                  Everyone in your event can join a room and start discussing
                  what they always wanted to. These are fully customisable and
                  you have power to control them as you wish to.
                </div>

                <div className="action-btn-home py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDrawer(true);
                    }}
                    className="btn btn-dark btn-outline-text px-5 py-3 me-3"
                    style={{
                      boxShadow:
                        "inset 0px 3px 19px #00000029, 0px 0px 10px #4C4E52",
                      borderRadius: "15px",
                    }}
                  >
                    Host a free event
                  </button>
                </div>
              </div>

              <div
                className="grid-2-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  src={CouponsHero}
                  alt="amazing event"
                  data-aos="zoom-in"
                  data-aos-easing="ease-in-sine"
                  data-aos-delay="100"
                  className="zoom-in"
                  style={{
                    alignSelf: "center",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-6 p-4">
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
              <div
                className="grid-1-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  
                  src={TradeShow}
                  alt="amazing event"
                  className="zoom-in"
                  data-aos="zoom-in"
                  data-aos-easing="ease-in-sine"
                  data-aos-delay="100"
                  style={{
                    alignSelf: "center",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <div className="grid-2-of-2 px-4" style={{ alignSelf: "center" }}>
                <div
                  className="section-heading-primary pb-2"
                  style={{ color: "#000000" }}
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                >
                  Invite booths to 
                  <br/>
                  boost engagement.
                </div>

                <div
                  className="home-text-description my-5"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                >
                  Speed networking and group based networking provides
                  opportunity to interact with others in event one-on-one and
                  discuss maybe projects or get insights on what you are working
                  on.
                </div>

                <div className="action-btn-home py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDrawer(true);
                    }}
                    className="btn btn-dark btn-outline-text px-5 py-3 me-3"
                    style={{
                      boxShadow:
                        "inset 0px 3px 19px #00000029, 0px 0px 10px #4C4E52",
                      borderRadius: "15px",
                    }}
                  >
                    Host a free event
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-7 p-4">
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
              <div
                className="grid-1-of-2 px-4"
                style={{ alignSelf: "center", color: "#ffffff" }}
              >
                <div
                  className="section-heading-primary pb-2"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                >
                  Create and manage <br />
                  ticket in minutes.
                </div>

                <div
                  className="home-text-description my-5"
                  style={{ color: "#ffffff" }}
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                >
                  We have especially designed and developed various features to
                  boost engagement in your virtual events using live Q &As,
                  Polls and one-to-one connections.
                </div>

                <div className="action-btn-home py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDrawer(true);
                    }}
                    className="btn btn-light btn-outline-text px-5 py-3 me-3"
                    style={{
                      boxShadow:
                        "inset 0px 3px 19px #525252, 0px 0px 10px #538BF7",
                      borderRadius: "15px",
                    }}
                  >
                    Host a free event
                  </button>
                </div>
              </div>
              <div
                className="grid-2-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  src={EditTicketsHero}
                  className="zoom-in"
                  data-aos="zoom-in"
                  data-aos-easing="ease-in-sine"
                  data-aos-delay="100"
                  alt="amazing event"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-8 p-4">
          <div className="pt-5">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div
                  className="section-heading-primary pb-2"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                  style={{ color: "#000000" }}
                >
                  No we didn't forgot about<br />  sponsors.
                </div>

                <div
                  className="home-text-description my-5"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                >
                  Invite sponsors and your attendees can check thier listings and sites in your event.
                  You can also give them shoutout as you wish.
                </div>

                <div className="action-btn-home py-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOpenDrawer(true);
                    }}
                    className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                    style={{
                      boxShadow:
                        "inset 0px 3px 19px #538bf7, 0px 0px 10px #505050",
                      borderRadius: "15px",
                    }}
                  >
                    Host a free event
                  </button>
                </div>
              </div>

              <div
                className="grid-2-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  src={EndlessUseCases}
                  className="slide-in"
                  data-aos="slide-left"
                  data-aos-easing="ease-in-sine"
                  data-aos-delay="100"
                  alt="amazing event"
                  style={{ maxHeight: "100%", maxWidth: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-9">
          <div className="container py-5 mt-3">
            <div className="centered-heading-primary">
              Let’s give a boost to <br /> Your virtual events
            </div>
            <div
              className="centered-heading-primary"
              style={{ marginLeft: "auto", marginRight: "auto" }}
            >
              <img
                src={BoostYourEvents}
                data-aos="zoom-in"
                data-aos-easing="ease-in-sine"
                data-aos-delay="100"
                alt="amazing event"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
            <div className="" style={{ textAlign: "center" }}>
              <a
                href="/signup"
                className="btn btn-primary btn-outline-text btn-attention-home px-5 py-3"
                style={{ borderRadius: "20px" }}
              >
                Get started for free
              </a>
            </div>
          </div>
        </div>
        <Footer />
        {/* Footer */}
      </div>

      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDrawer}>
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Let's Schedule a meet</div>
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
            <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
              <div className="side-drawer-more-details-content-section">
                <div
                  className="row edit-profile-form-row mb-3"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gridGap: "24px",
                  }}
                >
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      First name
                    </label>

                    <Field
                      name="firstName"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      label="First Name"
                    />
                  </div>

                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Last name
                    </label>
                    <Field
                      name="lastName"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      label="Last Name"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Work E-mail
                    </label>
                    <Field
                      name="email"
                      type="email"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      label="Email"
                    />
                  </div>
                </div>

                <div
                  className="row edit-profile-form-row mb-3"
                  style={{ width: "100%" }}
                >
                  <label
                    for="communityHeadline"
                    class="form-label form-label-customized"
                  >
                    contact Number
                  </label>
                  <Field
                    name="phoneNumber"
                    component={renderPhoneInput}
                    type="number"
                  />
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Company
                    </label>
                    <Field
                      name="companyName"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      aria-describedby="emailHelp"
                      label="Headline"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      Job Title
                    </label>
                    <Field
                      name="jobTitle"
                      type="text"
                      classes="form-control"
                      component={renderInput}
                      aria-describedby="emailHelp"
                      label="Headline"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <label
                    for="communityHeadline"
                    class="form-label form-label-customized"
                  >
                    Select Your Region
                  </label>
                  <Field
                    name="region"
                    component={renderEventPreferences}
                    label="Event Preferences"
                  />
                </div>
              </div>

              <div class="mb-4 overlay-form-input-row">
                <label
                  for="communityHeadline"
                  class="form-label form-label-customized"
                >
                  Are you an event agency ?
                </label>

                <div class="form-check mb-2">
                  <Field
                    name="eventAgency"
                    class="form-check-input"
                    type="radio"
                    // name="flexRadioDefault"
                    id="flexRadioDefault1"
                    value="true"
                    // component={renderInput}
                    component="input"
                  />
                  <label class="form-check-label" for="flexRadioDefault1">
                    Yes
                  </label>
                </div>
                <div class="form-check">
                  <Field
                    class="form-check-input"
                    type="radio"
                    name="eventAgency"
                    id="flexRadioDefault2"
                    // checked="true"
                    value="false"
                    // component={renderInput}
                    component="input"
                  />
                  <label class="form-check-label" for="flexRadioDefault2">
                    No
                  </label>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      // value={this.state.policySigned}
                      name="signinToMailList"
                      required
                      id="defaultCheck1"
                      checked
                      // onChange={this.onPrivacyPolicyChange}
                    />
                    <label
                      className="form-check-label btn-outline-text mb-3"
                      htmlFor="flexCheckChecked"
                      style={{ color: "grey", fontSize: "13px" }}
                    >
                      By registering, I agree to recieve product updates and
                      marketing communications from Evenz.
                    </label>
                  </div>
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <button
                  type="submit"
                  onClick={() => {
                    setOpenDrawer(false);
                  }}
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%" }}
                  disabled={pristine || submitting}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
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
})(EventManagementHome);
