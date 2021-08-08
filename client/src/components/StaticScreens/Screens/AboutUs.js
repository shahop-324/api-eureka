import React, { useEffect, useState } from "react";
import Footer from "../../Footer";

// import StaticTopNav from "../Helper/StaticTopNav";
import "../Styles/AboutUs.scss";
import MenuIcon from "@material-ui/icons/Menu";
import CancelIcon from "@material-ui/icons/Cancel";
import PreFooter from "../../PreFooter";
import { Link } from "react-router-dom";

var TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
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
  var delta = 200 - Math.random() * 100;

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
  css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
  document.body.appendChild(css);
};

window.onload();

const AboutUs = () => {
    const [hambergerOpen, setHambergerOpen] = useState(false);

    useEffect(() => {
      window.localStorage.clear();
    })
  
    const openHamberger = () => {
      setHambergerOpen(true);
    };
  
    const closeHamberger = () => {
      setHambergerOpen(false);
    };
  
  return (
    <>
      <div
        className="container-fluid p-0 pb-5"
        style={{ backgroundColor: "#272727", width: "100vw" }}
      >
        <div
            className="row nav-section"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <nav class="navbar navbar-expand-xxl navbar-light">
              <div class="container">
                {/* // TODO LINK EVENZ LOGO EVERYWHERE TO HOME PAGE */}
                <span class="navbar-brand nav-brand-name-home"><a href="https://www.evenz.in/home" style={{textDecoration: "none", color: "#ffffff"}}>Evenz</a></span>

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

        <div className=" mb-5 pb-5">
          <div className="container py-5 mt-3">
            <div
              className="centered-heading-primary mb-5"
              style={{ color: "#538BF7" }}
            >
              Our mission is to make <br />
              <div
                class="typewrite"
                data-period="2000"
                data-type='[ "Virtual Events", "Webinars", "Conferences", "Trade shows", "Meetups", "Workshops" ]'
                style={{ color: "#ffffff", display: "inline-block" }}
              ></div>{" "}
              <br /> more engaging and effortless
            </div>
          </div>

          <div class="wrap-op">
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
            <div class="c"></div>
          </div>

          <div className="d-flex flex-column align-items-center">
            <div
              className="mission-statement-container p-5"
              style={{ width: "700px" }}
            >
              <p className="mission-text mb-5" style={{fontFamily: "Ubuntu", fontWeight: "500", color: "#ffffff"}} >
                Evenz is designed and developed to cater to the ever growing
                event industry needs. From 100 people events to large
                conferences, trade shows, expos or training sessions, Evenz can
                help you and your community in delivering a delightful
                experience for your audience.
              </p>
              <p className="mission-text" style={{fontFamily: "Ubuntu", fontWeight: "500", color: "#ffffff"}}>
                This Platform is designed to help you in managing and hosting
                any type of event in just few clicks and provides various tools
                to get registrations and set marketing campaigns to drive
                audience.
              </p>
            </div>

          </div>
            {/* <div>
            <div className="home-section-2 px-5 py-5" style={{ height: "auto" }}>
          <div className="centered-heading-primary mb-5">
          <span style={{color: "#ffffff"}}>Not Just a Sass Company</span>  <br />
          <span style={{color: "#538BF7"}}> but a community of event enthusiasts worldwide</span>  
          </div>
          <div class="box">
  <div class="header"><i class="fa fa-paper-plane" aria-hidden="true"></i>
    <p class="hidden">Thanks!</p>
  </div>
  <div class="form">
  <input type="text" placeholder="Your Email" class="field"/>
  <input type="button" value="Subscribe" class="button"/>
  </div>
</div>

          
        </div>

            </div> */}
        </div>
      </div>
      <PreFooter />
      <Footer />
    </>
  );
};

export default AboutUs;
