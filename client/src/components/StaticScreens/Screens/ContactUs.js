import React from "react";
import Footer from "../../Footer";
import StaticTopNav from "../Helper/StaticTopNav";

import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import LocationOnIcon from "@material-ui/icons/LocationOn";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";

import "./../Styles/ContactUs.scss";

const ContactUs = () => {
  return (
    <>
      <div
        className="container-fluid p-0"
        style={{ backgroundColor: "#474747",  width: "100vw" }}
      >
        <StaticTopNav />

        <div className="contact-us-container">
          <div className="container">
            <div className="contact-form-and-info-container">
              <div className="contact-us-info-container px-5 py-4 d-flex flex-column justify-content-evenly">
                <div className="contact-info-heading">
                  Contact Information
                </div>
                <div className="contact-info-description">
                  Fill up the form and our team will get back to you within 24
                  Hrs.
                </div>
                <div className="">
                  <div className="contact-item-icon-and-details-row d-flex flex-row align-items-center mb-5">
                    <PhoneIcon className="me-4" />
                    <div className="contact-item-detail">+91 9770668454</div>
                  </div>
                  <div className="contact-item-icon-and-details-row d-flex flex-row align-items-center mb-5">
                    <EmailIcon className="me-4" />
                    <a
                      href="mailto:john@example.com"
                      style={{ textDecoration: "none" }}
                    >
                      {" "}
                      <div className="contact-item-detail contact-email">
                        contact@evenz.in
                      </div>{" "}
                    </a>
                  </div>
                  <div className="contact-item-icon-and-details-row d-flex flex-row align-items-center">
                    <LocationOnIcon className="me-4" />
                    <div className="contact-item-detail">
                      EE 738 DEEN DAYAL NAGAR, <br /> GWALIOR 474020, India
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-evenly align-items-center">
                  <LinkedInIcon className="linkedin-icon" />
                  <TwitterIcon className="twitter-icon" />
                  <FacebookIcon className="facebook-icon" />
                  <Instagram className="instagram-icon" />
                </div>
              </div>
              <div className="contact-us-form-container px-5 py-5 ">
              <form className=" justify-content-center d-flex flex-column justify-content-center px-4 py-4 my-5">
                <div className="input-col-2-in-1 mb-4">
                  <div class="mb-3">
                    <label
                      for="firstName"
                      class="form-label form-label-customized"
                    >
                      First Name
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="firstName"
                      placeholder="John"
                    />
                  </div>

                  <div class="mb-3">
                    <label
                      for="lastName"
                      class="form-label form-label-customized"
                    >
                      Last Name
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="lastName"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="input-col-2-in-1 mb-4">
                  <div class="mb-3">
                    <label
                      for="contactNumber"
                      class="form-label form-label-customized"
                    >
                      Contact No.
                    </label>
                    <input
                      type="tel"
                      class="form-control"
                      id="contactNumber"
                      placeholder="+91 9770668454"
                    />
                  </div>

                  <div class="mb-3">
                    <label
                      for="contactEmail"
                      class="form-label form-label-customized"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="contactEmail"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div class="mb-3">
                  <label for="message" class="form-label form-label-customized">
                    Your Message
                  </label>
                  <textarea
                    class="form-control"
                    id="message"
                    rows="5"
                  ></textarea>
                </div>

                <div style={{textAlign: "end"}}>
                    <button type="submit" className="btn btn-primary btn-outline-text">Submit</button>
                </div>


                </form>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;
