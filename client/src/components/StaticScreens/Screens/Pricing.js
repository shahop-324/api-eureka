import React, { useState } from "react";
import Footer from "../../Footer";

import "./../Styles/pricing.scss";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import TopNav from "../Helper/TopNav";
import { useSelector } from "react-redux";
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
import dateFormat from 'dateformat';

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
  price: "49",
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
  price: "99",
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

const expirationDate = dateFormat(Date.now() + 30*24*60*60*1000);

const RoyalBlueRadio = withStyles({
  root: {
    color: "#538BF7",
    "&$checked": {
      color: "#3372F0",
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);

const Pricing = () => {
  const { communities } = useSelector((state) => state.community);

  const userToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.user.userDetails);
  const userDetails = useSelector((state) => state.user.userDetails);

  const [selectedCommunity, setSelectedCommunity] = useState(
    communities && communities[0]
  );

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const [selectedPlan, setSelectedPlan] = useState("");

  const displayRazorpay = async () => {
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    console.log(selectedCommunity);
    console.log(user);

    let order = await fetch(
      "https://www.evenz.co.in/api-eureka/eureka/v1/razorpay/createCommunityPlanOrder",
      {
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
      }
    );

    order = await order.json();
    console.log(order);

    const options = {
      key: "rzp_live_bDVAURs4oXxSGi",
      amount: order.data.amount,
      currency: "INR",
      name: "Evenz",
      description: `This is a community plan purchase for communityId ${selectedCommunity._id} which is made by user ${userDetails._id}.`,
      image:
        "https://static01.nyt.com/images/2014/08/10/magazine/10wmt/10wmt-superJumbo-v4.jpg",
      order_id: order.data.id,
      handler: function (response) {
        alert("Congratulations, Your plan purchase was successful!");
      },
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        email: userDetails.email,
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
      const image = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${community.image}`;

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
              <div class="card__container grid" style={{ maxWidth: "1600px" }}>
                {/* <!--==================== CARD 1 ====================--> */}
                <article
                  class="card__content grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>0
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div>

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/free-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">Free plan</span>
                    <h1 class="card__header-title mb-4">Basic</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">1 organiser</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">100 registrations</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">4 hours event length</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Ticketing and payment processing
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">1 Event Per Month</p>
                    </li>
                  </ul>

                  <button
                    onClick={() => {
                      isSignedIn
                        ? handleOpenCommunityList(basicPlan)
                        : history.push("/login/buy-plan/?intent=buyPlan");
                    }}
                    class="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>

                {/* <!--==================== CARD 1 ====================--> */}
                <article
                  class="card__content grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>49
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div>

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/free-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">
                      FOR INDIVIDUALS
                    </span>
                    <h1 class="card__header-title mb-4">Starter</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Everything in basic and
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">2 organisers</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">300 registrations</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        24 hours event length
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Unlimited Coupons</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Access to Queries & Reviews
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Basic Analytics</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">3 Events per month</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
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
                    class="card__button btn btn-outline-primary btn-outline-text"
                    style={{ backgroundColor: "#ffffff" }}
                  >
                    Start my journey
                  </button>
                </article>

                {/* <!--==================== CARD 2 ====================--> */}
                <article
                  class="card__content pricing-card-2 grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>99
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div>

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/pro-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">Most popular</span>
                    <h1 class="card__header-title mb-4">Professional</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Everything in starter and
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">4 organisers</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">1200 Registrations</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        72 hours event length
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Stage Customisation</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        RTMP & Custom streaming
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Full Access to networking and booths
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Marketing tools</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Access to integrations
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Real Time analytics</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Custom registration form
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
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
                    class="card__button btn btn-primary btn-outline-text"
                  >
                    Choose this plan
                  </button>
                </article>

                {/* <!--==================== CARD 3 ====================--> */}
                <article
                  class="card__content grid px-5"
                  data-aos="zoom-in"
                  data-aos-delay="100"
                  data-aos-easing="ease-in-sine"
                >
                  {/* <div class="card__pricing">
                    <div class="card__pricing-number">
                      <span class="card__pricing-symbol">$</span>29
                    </div>
                    <span class="card__pricing-month">/month</span>
                  </div> */}

                  <header class="card__header">
                    <div class="card__header-circle grid">
                      <img
                        src="https://fadzrinmadu.github.io/hosted-assets/responsive-pricing-card-using-html-and-css/enterprise-coin.png"
                        alt=""
                        class="card__header-img"
                      />
                    </div>

                    <span class="card__header-subtitle mb-3">For agencies</span>
                    <h1 class="card__header-title mb-4">Enterprise</h1>
                  </header>

                  <ul class="card__list grid">
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Everything in Professional and
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Unlimited events</p>
                    </li>

                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        upto 1,00,000 registrations
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        SEO optimised Landing page
                      </p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">24 * 7 Support</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">Onboarding session</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">99.99% Uptime SLA</p>
                    </li>
                    <li class="card__list-item">
                      <CheckRoundedIcon
                        style={{ fill: "#538BF7", marginRight: "1rem" }}
                      />
                      <p class="card__list-description">
                        Unlock all features from evenz
                      </p>
                    </li>
                  </ul>

                  <button class="card__button btn btn-primary btn-outline-text">
                    Talk to us
                  </button>
                </article>
              </div>
            </div>
          </div>

          <div className="FAQs-section px-4">
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
            <div className="select-community-heading">
              Select Your community
            </div>
            {communities ? (
              renderCommunitiesList(communities)
            ) : (
              <>
                <div className="you-have-no-event-coming-card d-flex flex-column justify-content-between align-items-center px-3 py-5">
                  <img src={Bored} alt="Bored" className="mb-4" />
                  <div className="you-have-no-event-coming-text mb-4">
                    You have not created or joined any community yet.
                  </div>

                  <Link
                    to={"/user/home"}
                    className="btn btn-text-customised btn-color-customised btn-primary btn-outline-text"
                  >
                    Create New Community
                  </Link>
                </div>
              </>
            )}

            <div className="d-flex flex-row align-items-center justify-content-center mt-2">
              <button
                onClick={() => {
                  setOpenDrawer(true);
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
        <SwipeableDrawer anchor="right" open={openDrawer}>
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
                
                { selectedPlan && renderOrderSummaryList(selectedPlan)}
                
                
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
                  By continuing, you agree to follow Evenz <Link to="/terms-of-service">Terms & Conditions</Link> 
                  for communities.
                </div>{" "}
              </div>

              <div style={{ width: "100%" }}>
                <button
                  onClick={() => {
                    selectedPlan.name !== "Basic" ? displayRazorpay() : alert("Successfully switched to free plan.");
                    setOpenDrawer(false);
                  }}
                  type="button"
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
    </>
  );
};

export default Pricing;
