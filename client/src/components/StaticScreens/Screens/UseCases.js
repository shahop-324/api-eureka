import React, { useEffect, useState } from "react";
import Footer from "../../Footer";

import ExploringUseCases from "./../../../assets/images/ExploreUseCases.png";
import Conference from "./../../../assets/images/conference.jpg";
import OnlineTraining from "./../../../assets/images/OnlineTraining.png";
import HappyHours from "./../../../assets/images/happyHours.jpg";
import TradeShow from "./../../../assets/images/tradeShow.png";
import TownHall from "./../../../assets/images/townHall.png";
import YogaTraining from "./../../../assets/images/YogaTraining.png";

import MenuIcon from "@material-ui/icons/Menu";

import CancelIcon from "@material-ui/icons/Cancel";
import PreFooter from "../../PreFooter";
import { Link } from "react-router-dom";

const UseCases = () => {
  const [hambergerOpen, setHambergerOpen] = useState(false);

  useEffect(() => {
    window.localStorage.clear();
  });

  const openHamberger = () => {
    setHambergerOpen(true);
  };

  const closeHamberger = () => {
    setHambergerOpen(false);
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div className="header-section-home header-section">
          <div
            className="row nav-section"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <nav class="navbar navbar-expand-xxl navbar-light">
              <div class="container">
                {/* // TODO LINK EVENZ LOGO EVERYWHERE TO HOME PAGE */}
                <span class="navbar-brand nav-brand-name-home">Evenz</span>

                <button
                  class="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  {hambergerOpen ? (
                    <CancelIcon
                      onClick={closeHamberger}
                      style={{ fill: "#ffffff" }}
                      className="navbar-toggler-icon"
                    />
                  ) : (
                    <MenuIcon
                      onClick={openHamberger}
                      style={{ fill: "#ffffff" }}
                      className="navbar-toggler-icon"
                    />
                  )}
                </button>
                <div
                  class="collapse navbar-collapse navbar-collapse-dark"
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    {/* <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn nav-link-btn-dark me-4">
                        Features
                      </div>
                    </li> */}
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div
                        className="nav-link-btn nav-link-btn-dark me-4"
                        style={{ fontWeight: "600" }}
                      >
                        <Link
                          to="/use-cases/"
                          style={{ textDecoration: "none", color: "#ffffff" }}
                        >
                          Use Cases
                        </Link>
                      </div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div
                        className="nav-link-btn nav-link-btn-dark me-4"
                        style={{ fontWeight: "600" }}
                      >
                        <Link
                          to="/search-events/"
                          style={{ textDecoration: "none", color: "#ffffff" }}
                        >
                          Explore Events
                        </Link>
                      </div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div
                        className="nav-link-btn nav-link-btn-dark me-4"
                        style={{ fontWeight: "600" }}
                      >
                        <Link to="/pricing/" style={{ textDecoration: "none", color: "#ffffff" }}>
                          Pricing
                        </Link>
                      </div>
                    </li>

                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <a
                        href="/signin"
                        type="button"
                        className=" btn btn-light btn-outline-text me-4"
                      >
                        Login
                      </a>
                    </li>

                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      {/* <AvatarMenu /> */}
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          <div className="pricing-section  py-4">
            <div className="pricing-heading-primary mt-5 mb-4">
              How people use <span color="#ffffff">Evenz</span>
            </div>
            <div className="pricing-heading-secondary mb-4 px-4">
              See how you and your community can get most out of Evenz.
            </div>
          <div
            className=" py-5"
            style={{
              maxWidth: "1416px",
              margin: "0 auto",
              textAlign: "center",
            }}
          >
            <img
              src={ExploringUseCases}
              alt="workflow step 1"
              style={{ maxWidth: "80%", maxHeight: "80%", margin: "0 auto" }}
            />
          </div>
          </div>


          <div className="home-section-3 px-5 py-5" style={{backgroundColor: "#ffffff"}}>
          <div
            className="grid-of-2"
            style={{ height: "auto", alignItems: "center" }}
          >
            <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
              <div className="section-heading-primary mb-4" style={{color: "#117380", fontWeight: "700"}}>
                Conferences
              </div>

              <div className="home-text-description my-4">
                Evenz is designed to smoothly create, manage and Host memorable
                and most interactive event, no matter whatever Scale it is.
              </div>

              <div className="action-btn-home pt-5">
                <button
                  type="button"
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    maxWidth: "200px",
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #538BF7",
                     borderRadius: "15px",
                  }}
                >
                  Sign up today
                </button>
              </div>
            </div>
            <div
              className="grid-2-of-2 d-flex flex-row align-items-center"
              style={{ alignSelf: "center" }}
            >
              <img
                src={Conference}
                alt="amazing event"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>


        <div className="home-section-5 p-4">
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
                <div
                className="grid-2-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  src={OnlineTraining}
                  alt="amazing event"
                  style={{
                    alignSelf: "center",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div className="section-heading-primary pb-2" style={{color: "#A313B6", fontWeight: "700"}}>
                  Online Workshops & Training sessions
                </div>

                <div className="home-text-description my-5">
                  Everyone in your event can join a room and start discussing
                  what they always wanted to. These are fully customisable and
                  you have power to control them as you wish to.
                </div>

                <div className="action-btn-home py-3">
                <button
                  type="button"
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    maxWidth: "200px",
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #538BF7",
                     borderRadius: "15px",
                  }}
                >
                  Sign up today
                </button>
                </div>
              </div>

              
            </div>
          </div>
        </div>



        <div className="home-section-3 px-5 py-5" style={{backgroundColor: "#ffffff"}}>
          <div
            className="grid-of-2"
            style={{ height: "auto", alignItems: "center" }}
          >
            <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
              <div className="section-heading-primary mb-4" style={{color: "#807813", fontWeight: "700"}}>
                Happy Hours
              </div>

              <div className="home-text-description">
                Evenz is designed to smoothly create, manage and Host memorable
                and most interactive event, no matter whatever Scale it is.
              </div>

              <div className="action-btn-home py-5">
              <button
                  type="button"
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    maxWidth: "200px",
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #538BF7",
                     borderRadius: "15px",
                  }}
                >
                  Sign up today
                </button>
              </div>
            </div>
            <div
              className="grid-2-of-2 d-flex flex-row align-items-center"
              style={{ alignSelf: "center" }}
            >
              <img
                src={HappyHours}
                alt="amazing event"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>


        <div className="home-section-5 p-4" style={{backgroundColor: "#ffffff"}}>
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
                <div
                className="grid-2-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  src={TownHall}
                  alt="amazing event"
                  style={{
                    alignSelf: "center",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div className="section-heading-primary pb-2" style={{color: "#487E51", fontWeight: "700"}}>
                  Town Halls
                </div>

                <div className="home-text-description my-5">
                  Everyone in your event can join a room and start discussing
                  what they always wanted to. These are fully customisable and
                  you have power to control them as you wish to.
                </div>

                <div className="action-btn-home py-3">
                <button
                  type="button"
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    maxWidth: "200px",
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #538BF7",
                     borderRadius: "15px",
                  }}
                >
                  Sign up today
                </button>
                </div>
              </div>

              
            </div>
          </div>
        </div>



        <div className="home-section-3 px-5 py-5" style={{backgroundColor: "#ffffff"}}>
          <div
            className="grid-of-2"
            style={{ height: "auto", alignItems: "center" }}
          >
            <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
              <div className="section-heading-primary mb-4" style={{color: "#DD4C32", fontWeight: "700"}}>
                Online Fitness Training
              </div>

              <div className="home-text-description">
                Evenz is designed to smoothly create, manage and Host memorable
                and most interactive event, no matter whatever Scale it is.
              </div>

              <div className="action-btn-home py-5">
              <button
                  type="button"
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    maxWidth: "200px",
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #538BF7",
                     borderRadius: "15px",
                  }}
                >
                  Sign up today
                </button>
              </div>
            </div>
            <div
              className="grid-2-of-2 d-flex flex-row align-items-center"
              style={{ alignSelf: "center" }}
            >
              <img
                src={YogaTraining}
                alt="amazing event"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>

        <div className="home-section-5 p-4" style={{backgroundColor: "#ffffff"}}>
          <div className="mt-3">
            <div
              className="grid-of-2"
              style={{ height: "auto", alignItems: "center" }}
            >
                <div
                className="grid-2-of-2 d-flex flex-row align-items-center"
                style={{ alignSelf: "center" }}
              >
                <img
                  src={TradeShow}
                  alt="amazing event"
                  style={{
                    alignSelf: "center",
                    maxHeight: "100%",
                    maxWidth: "100%",
                  }}
                />
              </div>
              <div className="grid-1-of-2 px-4" style={{ alignSelf: "center" }}>
                <div className="section-heading-primary pb-2" style={{color: "#094577", fontWeight: "700"}}>
                  Trade shows & Expos
                </div>

                <div className="home-text-description my-5">
                  Everyone in your event can join a room and start discussing
                  what they always wanted to. These are fully customisable and
                  you have power to control them as you wish to.
                </div>

                <div className="action-btn-home py-3">
                <button
                  type="button"
                  className="btn btn-primary btn-outline-text px-5 py-3 me-3"
                  style={{
                    maxWidth: "200px",
                    boxShadow:
                      "inset 0px 3px 19px #00000029, 0px 0px 10px #538BF7",
                     borderRadius: "15px",
                  }}
                >
                  Sign up today
                </button>
                </div>
              </div>

              
            </div>
          </div>
        </div>




        </div>
        {/* Pre Footer Here */}
        <PreFooter />
        <Footer />
        {/* Footer */}
      </div>
    </>
  );
};

export default UseCases;
