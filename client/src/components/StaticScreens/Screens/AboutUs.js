import React from "react";
import { Link } from "react-router-dom";
import Footer from "../../Footer";
import FloatingAvatars from "../Helper/FloatingAvatars";

import StaticTopNav from "../Helper/StaticTopNav";
import "../Styles/AboutUs.scss";

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
  return (
    <>
      <div
        className="container-fluid p-0 pb-5"
        style={{ backgroundColor: "#272727", width: "100vw" }}
      >
        <StaticTopNav />

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
              
              <p className="mission-text mb-5" >
                Evenz is designed and developed to cater to the ever growing
                event industry needs. From 100 people events to large
                conferences, trade shows, expos or training sessions, Evenz can
                help you and your community in delivering a delightful
                experience for your audience.
              </p>
              <p className="mission-text">
                This Platform is designed to help you in managing and hosting
                any type of event in just few clicks and provides various tools
                to get registrations and set marketing campaigns to drive
                audience.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
