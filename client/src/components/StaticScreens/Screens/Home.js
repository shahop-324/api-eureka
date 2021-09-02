/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";

import "./../Styles/StaticScreenNav.scss";
import { fetchReferralCode } from "../../../actions";
import HomeHero from "./../../../assets/images/HomeHero.png";
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

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";

import { Link } from "react-router-dom";
import Footer from "../../Footer";

import { useDispatch } from "react-redux";

import AOS from "aos";
import "aos/dist/aos.css";
import TopNav from "../Helper/TopNav";
import RequestDemo from "../FormComponents/RequestDemo";

var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 1000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">' + this.txt + "</span>";

  var that = this;
  var delta = 100 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function () {
    that.tick();
  }, delta);
};

window.onload = function () {
  var elements = document.getElementsByClassName("typewrite");
  for (var i = 0; i < elements.length; i++) {
    var toRotate = elements[i].getAttribute("data-type");
    var period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #ffffff}";
  document.body.appendChild(css);
};

const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    AOS.init({
      duration: 1100,
    });
    AOS.refresh();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    if (params.ref) {
      dispatch(fetchReferralCode(params.ref));
    }
  }, []);

  const [openDemoForm, setOpenDemoForm] = React.useState(false);

  // handleCloseRequestDemo, openDemoForm,

  const handleCloseRequestDemo = () => {
    setOpenDemoForm(false);
  };

  return (
    <>
      <div className="container-fluid p-0" id="home-page">
        <div className="header-section-home header-section">
          {/* Here goes Top Nav */}
          <TopNav />
          <div className="header-content-section container d-flex">
            <div className="grid-of-2 my-4" style={{ width: "100%" }}>
              <div className="grid-1-of-2">
                <div className="header-main-heading-and-action-btn">
                  <div className="hero-heading mb-5">
                    One stop solution <br /> for all{" "}
                    <div
                      class="typewrite"
                      data-period="1000"
                      data-type='[ "Virtual Events", "Webinars", "Conferences", "Trade shows", "Meetups", "Workshops" ]'
                      style={{ color: "#ffffff", display: "inline-block" }}
                    >
                      {/* Virtual Events */}
                    </div>
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
                  src={HomeHero}
                  alt="home-hero"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
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
            Making Your event more <br />
            engaging and effortless
          </div>
          <div className="centered-heading-secondary mb-5">
            From exploration, management, hosting to post analysis and resource
            distribution, <br /> we do all this for you, so you can rest
            peacefully.
          </div>

          <div
            className="application-workflow-row py-5"
            id="application-workflow"
          >
            <div className="workflow-container">
              <div className="workflow-group-container-1 mb-3">
                <img
                  src={WorkflowStep1}
                  alt="workflow step 1"
                  data-aos="zoom-in"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
              <div className="workflow-step-explanation">
                Create and Manage <br /> Next Gen Events
              </div>
            </div>
            <div className="workflow-container">
              <div className="workflow-group-container-2 mb-3">
                <img
                  src={WorkflowStep2}
                  alt="workflow step 2"
                  className="zoom-in"
                  data-aos="zoom-in"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
              <div className="workflow-step-explanation">
                Invite attendees, Sponsors <br /> And speakers
              </div>
            </div>
            <div className="workflow-container">
              <div className="workflow-group-container-3 mb-3">
                <img
                  src={WorkflowStep3}
                  alt="workflow step 3"
                  className="zoom-in"
                  // data-aos="zoom-in"
                  data-aos="zoom-in"
                  style={{ maxWidth: "100%", maxHeight: "100%" }}
                />
              </div>
              <div className="workflow-step-explanation">
                And then, No frills. <br /> Just a good time.
              </div>
            </div>
          </div>
        </div>

        <div className="home-section-3 p-4 " id="home-section-3">
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div
                  className="section-heading-primary mb-4"
                  style={{ color: "#222222" }}
                >
                  An amazing{" "}
                  <div
                    class="typewrite"
                    data-period="1000"
                    data-type='[ "Virtual Events", "Webinars", "Conferences", "Trade shows", "Meetups", "Workshops" ]'
                    style={{ color: "#538BF7", display: "inline-block" }}
                  ></div>{" "}
                  <br />
                  event begins with us.
                </div>

                <div
                  className="home-text-description my-5"
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                  style={{ color: "#4D4D4D" }}
                >
                  Evenz is designed to smoothly create, manage and Host
                  memorable and most interactive event, no matter whatever Scale
                  it is.
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
                  src={AmazingEvent}
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

        <div className="home-section-4 p-4">
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
                  src={FirstEvent}
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
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  Your First Event is just <br />
                  few clicks away.
                </div>

                <div
                  className="home-text-description my-5"
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  It’s that simple. With Evenz you can setup your virtual event
                  with just one click and start getting registrations as soon as
                  you publish your event.
                </div>

                <div className="plan-features-offered-list">
                  <div
                    className="d-flex flex-row align-items-center mb-2"
                    // data-aos="slide-up"
                    // data-aos-easing="ease-in-sine"
                    // data-aos-duration="500"
                    // data-aos-delay="100"
                  >
                    <div className="me-3">
                      <CheckRoundedIcon
                        style={{ fontSize: "22", fill: "#212121" }}
                      />
                    </div>
                    <div className="home-feature-text">
                      SEO-optimized event registration pages{" "}
                    </div>
                  </div>
                  <div
                    className="d-flex flex-row align-items-center mb-2"
                    // data-aos="slide-up"
                    // data-aos-easing="ease-in-sine"
                    // data-aos-duration="500"
                    // data-aos-delay="100"
                  >
                    <div className="me-3">
                      <CheckRoundedIcon
                        style={{ fontSize: "22", fill: "#212121" }}
                      />
                    </div>
                    <div className="home-feature-text">
                      Ticketing and payment processing{" "}
                    </div>
                  </div>
                  <div
                    className="d-flex flex-row align-items-center mb-2"
                    // data-aos="slide-up"
                    // data-aos-easing="ease-in-sine"
                    // data-aos-duration="500"
                    // data-aos-delay="100"
                  >
                    <div className="me-3">
                      <CheckRoundedIcon
                        style={{ fontSize: "22", fill: "#212121" }}
                      />
                    </div>
                    <div className="home-feature-text">
                      Event Analytics Dashboard
                    </div>
                  </div>
                  <div
                    className="d-flex flex-row align-items-center mb-2"
                    // data-aos="slide-up"
                    // data-aos-easing="ease-in-sine"
                    // data-aos-duration="500"
                    // data-aos-delay="100"
                  >
                    <div className="me-3">
                      <CheckRoundedIcon
                        style={{ fontSize: "22", fill: "#212121" }}
                      />
                    </div>
                    <div className="home-feature-text">Unlimited Events</div>
                  </div>
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
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                  style={{ color: "#000000" }}
                >
                  Rooms for open discussions
                </div>

                <div
                  className="home-text-description my-5"
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                  style={{ color: "#4D4D4D" }}
                >
                  Everyone in your event can join a room and start discussing
                  what they always wanted to. These are fully customisable and
                  you have power to control them as you wish to.
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
                  src={RoomsFeatures}
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
                  src={ConnectionThatLasts}
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
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  Meet, greet and make <br />
                  connections that lasts.
                </div>

                <div
                  className="home-text-description my-5"
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  Speed networking and group based networking provides
                  opportunity to interact with others in event one-on-one and
                  discuss maybe projects or get insights on what you are working
                  on.
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
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  Engage your audience.
                </div>

                <div
                  className="home-text-description my-5"
                  style={{ color: "#ffffff" }}
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  We have especially designed and developed various features to
                  boost engagement in your virtual events using live Q &As,
                  Polls and one-to-one connections.
                </div>

                <div className="action-btn-home py-3">
                  <button
                    onClick={() => {
                      setOpenDemoForm(true);
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
                  src={PollsChatsAndQnA}
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

        {/* <div className="home-section-9">
          <div className="container py-5 mt-3">
            <div className="centered-heading-primary">Why Evenz ?</div>
            

            <div
              class="comparision"
              data-aos="slide-up"
              data-aos-easing="ease-in-sine"
              data-aos-duration="500"
              data-aos-delay="100"
            >
              <div class="prod one">
                <div>
                  <label>Evenz</label>
                </div>
                <div class="features">
                  <h4>Affordable</h4>
                  <ul>
                    <li>1% Ticketing Fees</li>
                    <li>Complete Management Suite</li>
                    <li>Unlimited events</li>
                  </ul>
                </div>
              </div>
              <div class="prod two">
                <div>
                  <label>Other Platforms</label>
                </div>
                <div class="features">
                  <h4>Too Costly</h4>
                  <ul>
                    <li>4% or higher Fees</li>
                    <li>No or minimal Management</li>
                    <li>Limited events</li>
                  </ul>
                </div>
              </div>
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
        </div> */}

        <div className="home-section-8 p-4">
          <div className="pt-5">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div
                  className="section-heading-primary pb-2"
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                  style={{ color: "#000000" }}
                >
                  Endless Use Cases
                </div>

                <div
                  className="home-text-description my-5"
                  // data-aos="slide-up"
                  // data-aos-easing="ease-in-sine"
                  // data-aos-duration="500"
                  // data-aos-delay="100"
                >
                  You can host almost any event you can think of, using Evenz.
                  Here are some of them:
                </div>

                <div className="mb-5">
                  <div className="plan-features-offered-list">
                    <div
                      className="d-flex flex-row align-items-center mb-2"
                      // data-aos="slide-up"
                      // data-aos-easing="ease-in-sine"
                      // data-aos-duration="500"
                      // data-aos-delay="100"
                    >
                      <div className="me-3">
                        <CheckRoundedIcon
                          style={{ fontSize: "22", fill: "#212121" }}
                        />
                      </div>
                      <div className="home-feature-text">
                        SEO-optimized event registration pages{" "}
                      </div>
                    </div>
                    <div
                      className="d-flex flex-row align-items-center mb-2"
                      // data-aos="slide-up"
                      // data-aos-easing="ease-in-sine"
                      // data-aos-duration="500"
                      // data-aos-delay="100"
                    >
                      <div className="me-3">
                        <CheckRoundedIcon
                          style={{ fontSize: "22", fill: "#212121" }}
                        />
                      </div>
                      <div className="home-feature-text">
                        Ticketing and payment processing{" "}
                      </div>
                    </div>
                    <div
                      className="d-flex flex-row align-items-center mb-2"
                      // data-aos="slide-up"
                      // data-aos-easing="ease-in-sine"
                      // data-aos-duration="500"
                      // data-aos-delay="100"
                    >
                      <div className="me-3">
                        <CheckRoundedIcon
                          style={{ fontSize: "22", fill: "#212121" }}
                        />
                      </div>
                      <div className="home-feature-text">
                        Event Analytics Dashboard
                      </div>
                    </div>
                    <div
                      className="d-flex flex-row align-items-center mb-2"
                      // data-aos="slide-up"
                      // data-aos-easing="ease-in-sine"
                      // data-aos-duration="500"
                      // data-aos-delay="100"
                    >
                      <div className="me-3">
                        <CheckRoundedIcon
                          style={{ fontSize: "22", fill: "#212121" }}
                        />
                      </div>
                      <div className="home-feature-text">Unlimited Events</div>
                    </div>
                  </div>
                </div>

                <div className="action-btn-home py-3">
                  <button
                    onClick={() => {
                      setOpenDemoForm(true);
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

      {/* Request Demo form here */}

      
        <RequestDemo
          handleCloseRequestDemo={handleCloseRequestDemo}
          openDemoForm={openDemoForm}
        />
      
    </>
  );
};

export default Home;
