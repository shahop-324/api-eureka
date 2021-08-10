import React, { useState } from "react";
import "./StaticScreens/Styles/StaticScreenNav.scss";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";
import { useDispatch } from "react-redux";
import { signupForEmailNewsletter } from "../actions";

const Footer = (props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");

  return (
    <>
      <footer>
        <div className="container footer-container py-3">
          <div className="brand-logo-and-copyright px-3 py-3">
            <span class="navbar-brand nav-brand-name-home">Evenz</span>
            <div
              className="copy-right-symbol mb-4"
              style={{ color: "#ffffff", fontSize: "22px" }}
            >
              &copy; <span className="btn-outline-text pb-3">2021</span>
            </div>
            <div className="btn-outline-text" style={{ color: "#ffffff" }}>
              All Rights Reserved.
            </div>
          </div>
          <div className="use-cases px-3 py-4">
            <div className="footer-section-headline btn-outline-text mb-3">
              Use Cases
            </div>

            <div className="footer-section-link mb-2">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Virtual Events
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Conferences
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Trade shows
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Training workshops
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Product Launch
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Online cohorts
              </a>
            </div>
            <div className="footer-section-link">
              <a
                href="/use-cases"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Happy hours
              </a>
            </div>
          </div>
          <div className="company px-3 py-4">
            <div className="footer-section-headline btn-outline-text mb-3">
              Company
            </div>

            <div className="footer-section-link mb-2">
              <a
                href="/about-us"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                About us
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a href="/#" style={{ color: "#A8A8A8", textDecoration: "none" }}>
                Careers
              </a>
            </div>
            <div className="footer-section-link mb-2">
              <a
                href="/contact-us"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Contact Us
              </a>
            </div>
          </div>
          <div className="further-nformation px-3 py-4">
            <div className="footer-section-headline btn-outline-text mb-3">
              Further Information
            </div>

            <div className="footer-section-link mb-2">
              <a
                style={{ color: "#ADADAD", textDecoration: "none" }}
                href="/terms-of-service"
              >
                Terms & Conditions
              </a>
            </div>

            <div className="footer-section-link mb-2">
              <a
                href="/privacy-policy"
                style={{ color: "#A8A8A8", textDecoration: "none" }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
          <div className="follow-us px-3 py-4">
            <div className="footer-section-headline btn-outline-text mb-3">
              Follow us
            </div>

            <div className=" d-flex flex-row align-items-center">
              <div className="shareon-icon p-3 me-3">
                <FacebookIcon style={{ fontSize: "20", fill: "#1760A8" }} />
              </div>
              <div className="shareon-icon p-3 me-3">
                <LinkedInIcon style={{ fontSize: "20", fill: "#2565A5" }} />
              </div>
              <div className="shareon-icon p-3 me-3">
                <TwitterIcon style={{ fontSize: "20", fill: "#539FF7" }} />
              </div>

              <div className="shareon-icon p-3 me-3">
                <Instagram style={{ fontSize: "20", fill: "#841E8D" }} />
              </div>
            </div>

            <div className="footer-section-headline my-3 ">Newsletter</div>

            <div class="ui action input">
              <input
                type="text"
                value={email}
                placeholder="Your email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <button
                type="button"
                class="ui blue icon button"
                onClick={() => {
                  email && dispatch(signupForEmailNewsletter(email));
                }}
              >
                <i class="send icon"></i>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
