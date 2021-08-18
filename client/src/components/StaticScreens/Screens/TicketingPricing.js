/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Footer from "../../Footer";

import "./../Styles/pricing.scss";
import TopNav from "../Helper/TopNav";
import { useDispatch, useSelector } from "react-redux";
import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { useTheme } from "@material-ui/core/styles";
import PreFooter from "../../PreFooter";
import { Link } from "react-router-dom";

const TicketingPricing = () => {
  const referral = useSelector((state) => state.user.referredUserId);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");

  const [price, setPrice] = useState("");

  const [total, setTotal] = useState("");

  const { isSignedIn } = useSelector((state) => state.auth);

  const calculateTotal = () => {
    setTotal(amount * 1 * (price * 1) * 0.99);
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div className="header-section-home header-section">
          {/* Here Goes Top Nav */}

          <TopNav />

          <div className="pricing-section  py-4">
            <div
              className="pricing-heading-primary mt-5 mb-4"
              style={{ color: "#FFFFFF" }}
            >
              $0 <span style={{ color: "#538BF7" }}>is all you need</span>
            </div>
            <div className="pricing-heading-secondary mb-4">
              Yes you heard it right
            </div>
          </div>
          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            data-aos-easing="ease-in-sine"
            className="ticketing-plan-features-card mb-5 p-5"
          >
            <div className="ticketing-pricing-sec-heading mb-5">
              What would you get
            </div>

            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                SEO optimized ticketing page
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Attendee Query Resolution
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Payment processing
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Unlimited Coupons
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Basic and Advanced Analytics
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Unlimited Events & Ticketing
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Minimal 1% ticketing charge on any ticket
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Payment processing within 24hrs
              </div>
            </div>
            <div
              className="d-flex flex-row align-items-center mb-4"
              style={{ marginLeft: "0", marginRight: "0" }}
            >
              <CheckCircleRoundedIcon
                style={{ fill: "#538BF7" }}
                className="me-4"
              />
              <div
                className="card__list-description"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "500",
                  fontSize: "0.95rem",
                }}
              >
                Complete Access to upcoming features*
              </div>
            </div>

            <div className="d-flex flex-row justify-content-center align-items-center mt-5">
              <Link
                to="/signup"
                className="btn btn-primary btn-outline-text px-5 py-3 start-selling-ticket-Link"
                style={{
                  borderRadius: "40px",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                Start selling today
              </Link>
            </div>

            {/* 
            <div>Attendee Query Resolution</div>
<div>Query Resolution</div> */}
          </div>

          <div className="main-heading-calculate-profits mb-5 pt-5">
            Know your profit
          </div>

          <div
            data-aos="zoom-in"
            data-aos-delay="100"
            data-aos-easing="ease-in-sine"
            className="profit-calculator-card mb-5 p-4"
          >
            <div>
              <div className="form-label form-label-customized">
                Amount of sales
              </div>
              <input
                value={amount}
                type="number"
                onChange={(e) => setAmount(e.target.value * 1)}
                className="form-control"
              ></input>
            </div>
            <div>
              <div className="form-label form-label-customized">
                Ticket Price (in USD)
              </div>
              <input
                value={price}
                type="number"
                onChange={(e) => setPrice(e.target.value * 1)}
                className="form-control"
              ></input>
            </div>
            <div>
              <div className="form-label form-label-customized">
                Your Total Sale (in USD)
              </div>
              <input
                value={total}
                type="number"
                className="form-control"
              ></input>
            </div>
            <button
              onClick={calculateTotal}
              className="btn btn-dark btn-outline-text px-5 py-3 start-selling-ticket-button"
              style={{
                height: "fit-content",
                maxHeight: "70px",
                borderRadius: "40px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Calculate
            </button>
          </div>

          <div className="FAQs-section px-4 mt-5 pt-5">
            <h2 className="mb-4">F.A.Q.</h2>
            <details>
              <summary>Question 1</summary>
              <p>
                Just use a <code>details</code> and <code>summary</code> tags
                with a little CSS, no more JS. You can use any text or emoji as
                caret.
              </p>{" "}
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Tempora in nihil, deleniti saepe optio corrupti dolorum
                perferendis hic iure, maiores quae vitae provident minus, ipsum,
                aut tempore facilis doloremque rem.
              </p>
            </details>
            <details>
              <summary>Question 2</summary>
              <p>
                Ipsa veritatis inventore reprehenderit dolorem, officiis.
                Quaerat doloribus voluptatibus impedit repellat quae
                perspiciatis nesciunt, recusandae facilis unde fugit et eaque
                rem voluptatum perferendis libero veniam rerum aliquam eos
                minima voluptate.
              </p>
            </details>
            <details>
              <summary>Question 3</summary>
              <p>
                Quisquam, necessitatibus quo dolore sequi suscipit magni,
                voluptatum debitis, accusantium dolorum officia beatae rerum
                similique optio saepe vel dicta facere modi, voluptatem culpa
                expedita quaerat eum reprehenderit dolores. Assumenda,
                doloremque!
              </p>
            </details>
            <details>
              <summary>Question 4</summary>
              <p>
                Dolorum quaerat facilis magnam commodi molestiae atque similique
                hic enim pariatur nulla magni amet iusto soluta nemo alias odit
                recusandae repudiandae dignissimos, fugit asperiores quia eius
                necessitatibus iure. Possimus, illum.
              </p>
            </details>
            <details>
              <summary>Question 5</summary>
              <p>
                Consequuntur voluptate consequatur sed adipisci libero
                temporibus atque itaque voluptas eos, rerum vero qui. Adipisci
                illum, molestias commodi unde necessitatibus ea, quod explicabo,
                deleniti voluptatem aliquam reprehenderit, nobis maiores. Saepe?
              </p>
            </details>
          </div>
        </div>
        <PreFooter />
        {/* Pre Footer Here */}
        <Footer />
        {/* Footer */}
      </div>
    </>
  );
};

export default TicketingPricing;
