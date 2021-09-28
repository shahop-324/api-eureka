/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LanguageIcon from "@material-ui/icons/Language";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
import { makeStyles } from "@material-ui/core/styles";
import {
  captureUserInterestInEvent,
  createQuery,
  errorTrackerForFetchEvent,
  fetchEvent,
  getCommunityTawkLink,
} from "../../actions/index";

import SessionCard from "./HelperComponent/SessionCard";
import SpeakerCard from "./HelperComponent/SpeakerCard";
import DiamondSponsorCard from "./HelperComponent/DiamondSponsorCard";
import PlatinumSponsorCard from "./HelperComponent/PlatinumSponsorCard";
import GoldSponsorCard from "./HelperComponent/GoldSponsorCard";

import BoothCard from "./HelperComponent/BoothCard";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { stateToHTML } from "draft-js-export-html";
import { convertFromRaw } from "draft-js";
import { useEffect } from "react";
import dateFormat from "dateformat";
import { reduxForm } from "redux-form";
import TicketForm from "./FormComponent/TicketForm";
import AvatarMenu from "../AvatarMenu";
// import ArrowRightIcon from "@material-ui/icons/ArrowRight";
// import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";

import { withStyles } from "@material-ui/core/styles";
import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";

import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Footer from "../Footer";
import { Avatar, IconButton } from "@material-ui/core";
import StickyFooter from "./HelperComponent/StickyFooter";
import Loader from "../Loader";
import { useSnackbar } from "notistack";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const Accordion = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    backgroundColor: "#FFFFFF8A",
    borderRadius: "5px",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiAccordion);

const AccordionSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiAccordionSummary);

const AccordionDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiAccordionDetails);

const EventLandingPage = (props) => {
  const params = useParams();

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const { isLoading, error } = useSelector((state) => state.event);

  const isTakwLinkLoading = useSelector((state) => state.tawk.isLoading);

  const tawkLink = useSelector((state) => state.tawk.directChatLink);

  const communityId = params.communityId;

  const id = params.id;
  console.log(id);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCommunityTawkLink(communityId));
    dispatch(fetchEvent(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (isSignedIn) {
      // TODO dispatch(captureInterest())
      dispatch(captureUserInterestInEvent(id));
      console.log("Here we will capture interest");
    }
  }, []);

  const classes = useStyles();

  const [selectedSection, setSelectedSection] = useState(0);

  const [expanded, setExpanded] = React.useState("panel1");

  const [queryText, setQueryText] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [state, setState] = React.useState({
    openSuccess: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, openSuccess } = state;

  const handleCloseSuccess = () => {
    setState({ vertical: "top", horizontal: "center", openSuccess: false });
  };

  const handleSecNav = (i) => {
    setSelectedSection(i);
    console.log(i);
  };

  const convertFromJSONToHTML = (text) => {
    return stateToHTML(convertFromRaw(JSON.parse(text)));
  };

  const { userDetails } = useSelector((state) => state.user);
  let event = useSelector((state) => state.event.eventDetails);

  if (isLoading || isTakwLinkLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ height: "100vh", width: "100vw" }}
      >
        <Loader />{" "}
      </div>
    ); // TODO
  }
  if (error) {
    return dispatch(errorTrackerForFetchEvent());
  }

  const chatBot = (tawkLink) => {
    var Tawk_API = Tawk_API || {},
      Tawk_LoadStart = new Date();
    (function () {
      var s1 = document.createElement("script"),
        s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      s1.src = `https://embed.tawk.to/${tawkLink}`;
      s1.charset = "UTF-8";
      s1.setAttribute("crossorigin", "*");
      s0.parentNode.insertBefore(s1, s0);
    })();
  };

  console.log(event);

  const handleQueryText = (event) => {
    setQueryText(event.target.value);
  };

  const handleAskQuery = () => {
    const formValues = {};
    formValues.createdBy = userDetails.id;
    formValues.userName = `${userDetails.firstName} ${userDetails.lastName}`;
    formValues.userImg = userDetails.image;
    formValues.createdForEventId = id;
    formValues.questionText = queryText;

    console.log(formValues);

    dispatch(createQuery(formValues));

    setState({ openSuccess: true, vertical: "top", horizontal: "center" });
  };

  let col = 2;
  let secNavCol = "1fr 1fr 1fr 1fr 1fr";
  let sessionIsPresent = false; // Session will always be there!
  let speakerIsPresent = false;
  let sponsorIsPresent = false;
  let boothsIsPresent = false;

  let diamondIsPresent = false;
  let platinumIsPresent = false;
  let goldIsPresent = false;

  console.log(event.speaker);

  event.session && event.session[0] && (sessionIsPresent = true);
  event.speaker && event.speaker[0] && (speakerIsPresent = true);
  event.sponsors && event.sponsors[0] && (sponsorIsPresent = true);
  event.booths && event.booths[0] && (boothsIsPresent = true);

  if (speakerIsPresent) {
    col = col + 1;
  }
  if (sponsorIsPresent) {
    col = col + 1;
  }
  if (boothsIsPresent) {
    col = col + 1;
  }

  switch (col) {
    case 2:
      secNavCol = "1fr 1fr";
      break;
    case 3:
      secNavCol = "1fr 1fr 1fr";
      break;
    case 4:
      secNavCol = "1fr 1fr 1fr 1fr";
      break;
    case 5:
      secNavCol = "1fr 1fr 1fr 1fr 1fr";
      break;
    default:
      secNavCol = "1fr 1fr 1fr 1fr 1fr";
  }

  const renderSessionList = () => {
    return event.session.map((session) => {
      // let startDate = new Date(session.startDate);
      // startDate = dateFormat("mmmm dS");
      // let startTime = new Date(session.startTime);
      // startTime = dateFormat("h:MM TT");
      // let endTime = new Date(session.startTime);
      // endTime = dateFormat("h:MM TT");
      console.log(session.speaker);
      return (
        <SessionCard
          // startDate={startDate}
          startTime={session.startTime}
          endTime={session.endTime}
          sessionName={session.name}
          sessionDescription={session.description}
          speakerAvatarList={session.speaker}
          id={session.id}
        />
      );
    });
  };

  const renderSpeakerList = () => {
    return event.speaker.map((speaker) => {
      console.log(speaker.socialMediaHandles);
      return (
        <SpeakerCard
          firstName={speaker.firstName}
          lastName={speaker.lastName}
          organisation={speaker.organisation}
          headline={speaker.headline}
          bio={`${speaker.designation} at ${speaker.organisation}`}
          speakerSocialHandles={speaker.socialMediaHandles}
          id={speaker.id}
          imgURL={`https://bluemeet.s3.us-west-1.amazonaws.com/${speaker.image}`}
        />
      );
    });
  };

  diamondIsPresent = true;
  platinumIsPresent = true;
  goldIsPresent = true;

  const renderDiamondSponsorCard = () => {
    return event.sponsors.map((sponsor) => {
      console.log(sponsor);
      if (sponsor.status === "Diamond") {
        diamondIsPresent = true;

        return (
          <DiamondSponsorCard
            id={sponsor.id}
            image={`https://bluemeet.s3.us-west-1.amazonaws.com/${sponsor.image}`}
          />
        );
      } else {
        diamondIsPresent = false;
        return <></>;
      }
    });
  };
  const renderPlatinumSponsorCard = () => {
    return event.sponsors.map((sponsor) => {
      if (sponsor.status === "Platinum") {
        platinumIsPresent = true;
        return (
          <PlatinumSponsorCard
            id={sponsor.id}
            image={`https://bluemeet.s3.us-west-1.amazonaws.com/${sponsor.image}`}
          />
        );
      } else {
        platinumIsPresent = false;
        return <></>;
      }
    });
  };
  const renderGoldSponsorCard = () => {
    return event.sponsors.map((sponsor) => {
      if (sponsor.status === "Gold") {
        goldIsPresent = true;
        return (
          <GoldSponsorCard
            id={sponsor.id}
            image={`https://bluemeet.s3.us-west-1.amazonaws.com/${sponsor.image}`}
          />
        );
      } else {
        goldIsPresent = false;
        return <></>;
      }
    });
  };

  const renderBoothCardList = () => {
    return event.booths.map((booth) => {
      console.log(booth);
      return (
        <BoothCard
          name={booth.name}
          image={`https://bluemeet.s3.us-west-1.amazonaws.com/${booth.image}`}
          description={booth.description}
          id={booth.id}
        />
      );
    });
  };

  let startMonth;
  let startYear;
  let startDate;
  let endDate;
  let startDateTime;

  const formatDate = () => {
    const { startTime, endTime } = event;

    console.log(startTime, endTime);

    startMonth = new Date(startTime);
    startMonth = dateFormat(startMonth, "mmmm");
    startYear = new Date(startTime);
    startYear = dateFormat(startYear, "yyyy");

    startDate = new Date(startTime);
    startDate = dateFormat(startDate, "d");
    endDate = new Date(endTime);
    endDate = dateFormat(endDate, "d");

    startDateTime = dateFormat(startTime, "ddd, mmm dS, yyyy, h:MM:ss TT");
    console.log(startDateTime);

    console.log(event);
  };

  return (
    <>
      {tawkLink && chatBot(tawkLink)}
      {formatDate()}
      <CssBaseline />
      <div
        className="conatiner-fluid page"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="row nav-section">
          <nav
            className="navbar navbar-expand-lg navbar-light bg-light"
            style={{ backgroundColor: "#ffffff" }}
          >
            <div className="container-fluid">
              <Link
                to="/home"
                className="navbar-brand"
                style={{ color: "#538BF7", textDecoration: "none" }}
              >
                Evenz
              </Link>
              <button
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                  {isSignedIn ? (
                    <div className="me-5 py-2 d-flex flex-row align-items-center justify-content-center">
                      <AvatarMenu />
                    </div>
                  ) : (
                    <div className="d-flex flex-row align-items-center justify-content-center">
                      {" "}
                      <li className="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signin"
                          className="btn btn-outline-primary btn-outline-text me-3"
                        >
                          Login
                        </Link>
                      </li>
                      <li className="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signup"
                          className="btn btn-primary btn-outline-text"
                        >
                          Get Started
                        </Link>
                      </li>{" "}
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div style={{ margin: "0.5% 0" }} className="mb-5">
          <Divider />
        </div>
        <div
          className="event-landing-main-section max-width"
          style={{
            height: "auto",
            paddingTop: "3%",
          }}
        >
          <div
            className="container-fluid event-landing-grid mb-5"
            style={{ height: "100%" }}
          >
            <div className="share-on">
              <div className="shareon-card d-flex flex-column align-items-center">
                <div
                  className="shareon-icon text mb-3"
                  style={{ fontFamily: "Inter", fontWeight: "500" }}
                >
                  Share on
                </div>
                <a
                  href={`https://www.linkedin.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="shareon-icon mb-3">
                    <IconButton>
                      {" "}
                      <LinkedInIcon style={{ fill: "#2565A5" }} />{" "}
                    </IconButton>
                  </div>
                </a>

                <a
                  href={`https://www.twitter.com/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="shareon-icon mb-3">
                    <IconButton>
                      <TwitterIcon style={{ fill: "#539FF7" }} />
                    </IconButton>
                  </div>
                </a>

                <a
                  href={`https://www.facebook.com`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="shareon-icon mb-3">
                    <IconButton>
                      <FacebookIcon style={{ fill: "#1760A8" }} />
                    </IconButton>
                  </div>
                </a>
                <a
                  href={`https://web.whatsapp.com/`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div className="shareon-icon mb-3">
                    <IconButton>
                      <WhatsAppIcon style={{ fill: "#378D1E" }} />
                    </IconButton>
                  </div>
                </a>
              </div>
            </div>
            <div className="event-landing-main-content">
              <img
                className="event-landing-poster mb-5"
                src={`https://bluemeet.s3.us-west-1.amazonaws.com/${event.image}`}
                alt="event-landing-hero"
              />
              <div className="event-start-end-date mb-4">
                Starts at {startDateTime}
              </div>

              <div className="event-name-date-hosting-community-container mb-4 px-4">
                <div className="event-name mb-3" style={{ fontSize: "1.3rem" }}>
                  {event.eventName}
                </div>

                <div className="hosted-by-community-grid mb-4 d-flex flex-row align-items-center">
                  <Avatar
                    src={`https://bluemeet.s3.us-west-1.amazonaws.com/${
                      event.createdBy.image ? event.createdBy.image : "#"
                    }`}
                    className="hosted-by-community-logo"
                    alt={event.createdBy.name}
                    variant="rounded"
                  />
                  <div className="hosted-by-community-name-sec">
                    <div
                      className="hosted-by-headline mb-1"
                      style={{ fontWeight: "600" }}
                    >
                      Hosted By
                    </div>
                    <div className="hosted-by-community-name mb-2">
                      {event.createdBy.name}
                    </div>
                  </div>
                </div>

                <div className="hosted-by-social-grid mb-3">
                  <IconButton>
                    <LanguageIcon style={{ fill: "#4D4D4D" }} />
                  </IconButton>
                  <IconButton>
                    <LinkedInIcon style={{ fill: "#4D4D4D" }} />
                  </IconButton>
                  <IconButton>
                    <MailOutlineIcon style={{ fill: "#4D4D4D" }} />
                  </IconButton>
                </div>
              </div>

              <div
                className="event-landing-secondary-nav mb-3"
                style={{
                  position: "sticky",
                  top: "2rem",
                  gridTemplateColumns: secNavCol,
                }}
              >
                <a
                  onClick={() => {
                    handleSecNav(0);
                  }}
                  href="#overview-section"
                  style={{ textDecoration: "none", fontWeight: "600" }}
                >
                  <div
                    className={`event-landing-secondary-nav-item  ${
                      selectedSection === 0
                        ? "active-secondary-nav-item py-1"
                        : ""
                    }`}
                    style={{ fontFamily: "Inter", fontWeight: "500" }}
                  >
                    Overview
                  </div>
                </a>
                <a
                  onClick={() => {
                    handleSecNav(1);
                  }}
                  href="#schedule-section"
                  style={{ textDecoration: "none", fontWeight: "600" }}
                >
                  <div
                    className={`event-landing-secondary-nav-item  ${
                      selectedSection === 1
                        ? "active-secondary-nav-item py-1"
                        : ""
                    }`}
                    style={{ fontFamily: "Inter", fontWeight: "500" }}
                  >
                    Schedule
                  </div>
                </a>
                {speakerIsPresent ? (
                  <a
                    onClick={() => {
                      handleSecNav(2);
                    }}
                    href="#speakers-section"
                    style={{ textDecoration: "none", fontWeight: "600" }}
                  >
                    <div
                      className={`event-landing-secondary-nav-item  ${
                        selectedSection === 2
                          ? "active-secondary-nav-item py-1"
                          : ""
                      }`}
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                    >
                      Speakers
                    </div>
                  </a>
                ) : (
                  <></>
                )}
                {sponsorIsPresent ? (
                  <a
                    onClick={() => {
                      handleSecNav(3);
                    }}
                    href="#sponsors-section"
                    style={{ textDecoration: "none", fontWeight: "600" }}
                  >
                    <div
                      className={`event-landing-secondary-nav-item  ${
                        selectedSection === 3
                          ? "active-secondary-nav-item py-1"
                          : ""
                      }`}
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                    >
                      Sponsors
                    </div>
                  </a>
                ) : (
                  <></>
                )}
                {boothsIsPresent ? (
                  <a
                    onClick={() => {
                      handleSecNav(4);
                    }}
                    href="#booths-section"
                    style={{ textDecoration: "none", fontWeight: "600" }}
                  >
                    <div
                      className={`event-landing-secondary-nav-item  ${
                        selectedSection === 4
                          ? "active-secondary-nav-item py-1"
                          : ""
                      }`}
                      style={{ fontFamily: "Inter", fontWeight: "500" }}
                    >
                      Booths
                    </div>
                  </a>
                ) : (
                  <></>
                )}
              </div>

              {console.log(event.editingComment)}

              {event.editingComment ? (
                <div
                  id="overview-section"
                  className="overview-content mb-5 mt-3 pt-4"
                  dangerouslySetInnerHTML={{
                    __html: convertFromJSONToHTML(event.editingComment),
                  }}
                ></div>
              ) : (
                <></>
              )}

              <hr className="my-5" />

              {sessionIsPresent ? (
                <>
                  <div
                    className="schedule-section mb-5 mt-3 pt-4"
                    id="schedule-section"
                  >
                    <div className="event-landing-page-section-headline mb-5">
                      <div className="section-headline">Schedule</div>
                    </div>

                    <div className="session-card-row ">
                      {renderSessionList()}
                    </div>
                  </div>
                  <hr className="my-5" />
                </>
              ) : (
                <div></div>
              )}

              {speakerIsPresent ? (
                <>
                  <div
                    className="speakers-section mb-3 mt-3 pt-4"
                    id="speakers-section"
                  >
                    <div className="event-landing-page-section-headline mb-5">
                      <div className="section-headline">Speakers</div>
                    </div>
                    <div className="speakers-card-grid">
                      {renderSpeakerList()}
                    </div>
                  </div>

                  <hr className="my-5" />
                </>
              ) : (
                <div></div>
              )}

              {sponsorIsPresent ? (
                <div
                  className="sponsor-section mb-3 mt-3 pt-4"
                  id="sponsors-section"
                >
                  <div className="event-landing-page-section-headline mb-5">
                    <div className="section-headline">Sponsors</div>
                  </div>

                  {diamondIsPresent ? (
                    <div className="diamond-sponsors mb-3">
                      <div className="diamond-sponsor-headline mb-4">
                        <hr style={{ color: "#538BF7" }} />
                        <div
                          style={{
                            justifySelf: "center",
                            alignSelf: "center",
                            font: "normal normal normal 1rem/1.5rem Helvetica",
                            letterSpacing: "0.38px",
                            color: "#414141",
                          }}
                        >
                          Diamond
                        </div>
                        <hr style={{ color: "#538BF7" }} />
                      </div>

                      <div className="diamond-sponsor-card-grid">
                        {renderDiamondSponsorCard()}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {platinumIsPresent ? (
                    <div className="platinum-sponsors mb-3">
                      <div className="platinum-sponsor-headline mb-4">
                        <hr style={{ color: "#E6B822" }} />
                        <div
                          style={{
                            justifySelf: "center",
                            alignSelf: "center",
                            font: "normal normal normal 1rem/1.5rem Helvetica",
                            letterSpacing: "0.38px",
                            color: "#414141",
                          }}
                        >
                          Platinum
                        </div>
                        <hr style={{ color: "#E6B822" }} />
                      </div>

                      <div className="platinum-sponsor-card-grid">
                        {renderPlatinumSponsorCard()}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {goldIsPresent ? (
                    <div className="gold-sponsors mb-3">
                      <div className="gold-sponsor-headline mb-4">
                        <hr style={{ color: "#94952D" }} />
                        <div
                          style={{
                            justifySelf: "center",
                            alignSelf: "center",
                            font: "normal normal normal 1rem/1.5rem Helvetica",
                            letterSpacing: "0.38px",
                            color: "#414141",
                          }}
                        >
                          Gold
                        </div>
                        <hr style={{ color: "#DADD26" }} />
                      </div>

                      <div className="gold-sponsor-card-grid">
                        {renderGoldSponsorCard()}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              ) : (
                <div></div>
              )}

              {boothsIsPresent ? (
                <div
                  className="booth-section mb-3 mt-3 pt-4 ps-0 ms-0"
                  id="booths-section"
                >
                  <div className="event-landing-page-section-headline mb-5">
                    <div
                      className="section-headline"
                      style={{ fontSize: "1.8rem" }}
                    >
                      Booths
                    </div>
                  </div>
                  <div className="booth-section-card-grid">
                    {renderBoothCardList()}
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>
            <div className="event-landing-other-info">
              <div className="event-info-card-1">
                <div
                  className="event-info-card-1-primary px-4 py-2"
                  style={{ zIndex: "10000" }}
                >
                  <div className="month-main mb-3">{startMonth}</div>
                  <div className="date-duration-main mb-3">
                    {startDate} - {endDate}
                  </div>
                  <div className="year-main">{startYear}</div>
                </div>
                <div className="event-info-card-1-secondary px-4">
                  <div className="event-name mb-2">{event.eventName}</div>
                  <div className="event-short-description">
                    {event.shortDescription}
                  </div>
                </div>
              </div>
              <div className="event-info-card-2 px-4 py-4 mb-5">
                <div className="hosted-by-community-grid  mb-4">
                  <Avatar
                    src={`https://bluemeet.s3.us-west-1.amazonaws.com/${event.createdBy.image}`}
                    // className="hosted-by-community-logo"
                    style={{ height: "4rem", width: "4rem" }}
                    alt={event.createdBy.name}
                    variant="rounded"
                  />
                  <div className="hosted-by-community-name-sec">
                    <div
                      className="hosted-by-headline mb-1"
                      style={{ fontWeight: "600" }}
                    >
                      Hosted By
                    </div>
                    <div className="hosted-by-community-name mb-2">
                      {event.createdBy.name}
                    </div>
                  </div>
                </div>
                <div className="hosted-by-social-grid mb-3">
                  {/* <IconButton>
                    <LanguageIcon style={{ fill: "#4D4D4D" }} />
                  </IconButton>
                  <IconButton>
                    <LinkedInIcon style={{ fill: "#4D4D4D" }} />
                  </IconButton> */}
                  {console.log(event.createdBy.email)}
                  <a href={`mailto:${event.createdBy.email}`}>
                    {" "}
                    <IconButton>
                      <MailOutlineIcon style={{ fill: "#4D4D4D" }} />
                    </IconButton>
                  </a>
                </div>
              </div>

              <div className="event-ticket-section px-4 py-4 mb-5">
                <div className="event-ticket-section-headline mb-4">
                  <ConfirmationNumberIcon style={{ fill: "#818181" }} />
                  <div className="ticket-headline-text">Tickets</div>
                  <div className="ticket-price-range">
                    {/* From <b>$17.00</b> to <b>$95.00</b> */}
                  </div>
                </div>
                {/* This is ticket form */}
                <TicketForm
                  eventId={id}
                  tickets={event.tickets}
                  coupon={event.coupon}
                />
              </div>

              
            </div>
          </div>
        </div>
        <div className="footer-container-event-landing-page">
          <Footer />
        </div>
        {/*  */}
        <StickyFooter
          eventId={id}
          tickets={event.tickets}
          coupon={event.coupon}
        />
      </div>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSuccess}
        onClose={handleCloseSuccess}
        autoHideDuration={4000}
      >
        <Alert onClose={handleCloseSuccess} severity="info">
          Query submitted successfully! You will recieve answer in your user
          profile section.
        </Alert>
      </Snackbar>
    </>
  );
};

export default reduxForm({
  form: "eventLandingPageTicketForm",
  distroyOnUnmount: false,
})(EventLandingPage);
