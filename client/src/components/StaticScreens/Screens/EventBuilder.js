/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

import "./../Styles/StaticScreenNav.scss";

import BuildEventHero from "./../../../assets/images/buildEventFast@2x.png";
import EventLandingHero from "./../../../assets/images/eventLandingHero@2x.png";
import ScheduleHero from "./../../../assets/images/scheduleHero@2x.png";
import AdditionalEventSettingsHero from "./../../../assets/images/additionalEventSettings@2x.png";
import "./../../../index.css";
import BoostYourEvents from "./../../../assets/images/section-9-home.png";

import { Link } from "react-router-dom";
import Footer from "../../Footer";
import Select from "react-select";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import PhoneInput from "react-phone-input-2";
import { IconButton } from "@material-ui/core";

import { Field } from "redux-form";
import { reduxForm } from "redux-form";
import { useDispatch, useSelector } from "react-redux";
import { createDemoRequest, errorTrackerForCreateDemo } from "../../../actions";

import AOS from "aos";
import "aos/dist/aos.css";
import PreFooter from "../../PreFooter";
import TopNav from "../Helper/TopNav";
import RequestDemo from "../FormComponents/RequestDemo";

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

const EventBuilderHome = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1100,
    });
    AOS.refresh();
  }, []);

  const [openDemoForm, setOpenDemoForm] = React.useState(false);

  const handleCloseRequestDemo = () => {
    setOpenDemoForm(false);
  };

  return (
    <>
     <div id="openBeamer"></div>
      <div className="container-fluid p-0" id="home-page">
        <div className="header-section-home header-section">
          {/* Here Goes Top Nav */}

          <TopNav />

          <div className="header-content-section container d-flex">
            <div className="grid-of-2 my-4" style={{ width: "100%" }}>
              <div className="grid-1-of-2">
                <div className="header-main-heading-and-action-btn">
                  <div
                    className="hero-heading mb-4"
                    style={{ lineHeight: "4rem" }}
                  >
                    Build Your Events <br />
                    Efferotlessly
                  </div>

                  <div
                    className="hero-heading mb-5"
                    style={{
                      fontFamily: "Ubuntu",
                      fontSize: "1rem",
                      color: "#ffffff",
                      fontWeight: "500",
                      lineHeight: "2rem",
                      letterSpacing: "0.5px",
                      wordSpacing: "2px",
                    }}
                  >
                    You can build your event experience with <br /> just few
                    clicks using our event builder
                  </div>

                  <div className="landing-action-btn-row d-flex flex-row align-items-center">
                    <button
                      onClick={() => {
                        setOpenDemoForm(true);
                      }}
                      className="btn btn-light btn-outline-text px-3 py-2 me-3"
                    >
                      Request Demo
                    </button>
                    <Link
                      to="/signup"
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
                  src={BuildEventHero}
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
            Building your event <br />
            page is simple
          </div>
          <div className="centered-heading-secondary mb-5">
            You can create a beautiful onboarding experience for you event
            attendees by just adding minimal details
            <br /> and customising according to your brand.
          </div>

          <img
            // src={EditTicketsHero}
            src={EventLandingHero}
            alt="amazing event"
            className="zoom-in"
            data-aos="zoom-in"
            style={{ maxHeight: "100%", maxWidth: "100%" }}
          />
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
                  Create a schedule for <br /> your Event
                </div>

                <div
                  className="home-text-description my-5"
                  data-aos="slide-up"
                  data-aos-easing="ease-in-sine"
                  data-aos-duration="500"
                  data-aos-delay="100"
                  style={{ color: "#4D4D4D" }}
                >
                  You can start by adding sessions to your event and your
                  schedule is ready for your attendees to see and we will inform
                  your speakers, host and attendees when that session is about
                  to begin
                </div>

                <div className="action-btn-home py-3">
                  <button
                    onClick={() => {
                      setOpenDemoForm(true);
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
                  src={ScheduleHero}
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
                src={AdditionalEventSettingsHero}
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
                Add speakers, sponsors and
                <br />
                Booths to your event
              </div>

              <div
                className="home-text-description my-5"
                data-aos="slide-up"
                data-aos-easing="ease-in-sine"
                data-aos-duration="500"
                data-aos-delay="100"
              >
                We know its the key to constantly improve your events to drive
                more meaningful connections and build values that stays. So, you
                can hear to what your attendees have to say about your event
                using reviews feature built for your community.
              </div>

              <div className="action-btn-home  pt-5">
                <button
                  onClick={() => {
                    setOpenDemoForm(true);
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
        <PreFooter />
        <Footer />
        {/* Footer */}
      </div>

      {/* Request demo form goes here */}
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
})(EventBuilderHome);
