import { Avatar, CssBaseline, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import history from "../../../history";
import AvatarMenu from "../../AvatarMenu";
import "./../Styles/CommunityPublicPage.scss";
import Faker from "faker";
import { makeStyles } from "@material-ui/core/styles";
import StarOutlineRoundedIcon from "@material-ui/icons/StarOutlineRounded";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import FacebookIcon from "@material-ui/icons/Facebook";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LanguageIcon from "@material-ui/icons/Language";
import BluemeetLogoLight from "./../../../assets/images/Bluemeet_Logo_Light.svg";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import Footer from "../../Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

const CommunityPublicPage = () => {
  const classes = useStyles();

  const location = useLocation();

  const { isSignedIn } = useSelector((state) => state.auth);

  const [text, setText] = useState("");

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  let fullLocation = `https://www.bluemeet.in/${location.pathname}${location.search}`;
  let url = new URL(fullLocation);
  let search_params = url.searchParams;

  const onChangeSearchEvents = (e) => {
    setText(e.target.value);
  };

  const handleUpcomingEventsClick = () => {
    setSelectedTabIndex(0);
  };

  const handlePastEventsClick = () => {
    setSelectedTabIndex(1);
  };

  const handleReviewsClick = () => {
    setSelectedTabIndex(2);
  };

  const onSubmitTextSearch = (e) => {
    e.preventDefault();
    if (text === "") {
      search_params.delete("text");
    } else {
      search_params.set("text", text);
    }
    url.search = search_params.toString();
    let new_url = url.toString();
    const len = new_url.split("?")[0].length;

    const result = new_url.substring(len);
    if (result === "") {
      history.push("/search-events/");
    } else {
      history.push(result);
    }
  };

  return (
    <>
      <CssBaseline />
      <div>
        <div className="row nav-section">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link
                to="/home"
                className="navbar-brand"
                style={{ color: "#538BF7", textDecoration: "none" }}
              >
                <img
                  src={BluemeetLogoLight}
                  alt="Bluemeet Logo"
                  style={{ height: "50px" }}
                />
              </Link>
              <button
                className="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              ></button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <form
                  onSubmit={onSubmitTextSearch}
                  className="d-flex special"
                  style={{ marginLeft: "2%", alignSelf: "center" }}
                >
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search events"
                    aria-label="Search"
                    value={text}
                    onChange={onChangeSearchEvents}
                  />
                  <button className="btn btn-outline-primary" type="submit">
                    <SearchRoundedIcon style={{ fontSize: "20px" }} />
                  </button>
                </form>
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
        <img
          className="community-page-art"
          src="http://www.calendarp.com/wp-content/uploads/2019/02/YouTube-Channel-Art-CP-008.jpg"
          alt="community public page art"
        ></img>
        <div
          className="container max-width-container-public-page mt-5"
          style={{ height: "auto" }}
        >
          {/* // TODO Replace alt and src */}
          <Avatar
            alt="Travis Howard"
            src={Faker.image.avatar()}
            variant="rounded"
            className={classes.large}
          />
          <div className="d-flex flex-row align-items-center justify-content-between mt-4">
            <div className="public-page-name">{Faker.name.findName()}</div>
            <button className="btn btn-primary btn-outline-text">Follow</button>
          </div>
          <div className="community-total-registrations-and-events mt-3">
            324 events . 1389 registrations
          </div>
          <div className="d-flex flex-row align-items-center justify-content-between community-total-registrations-and-events mt-3">
            <div>Vlogging our life on the road</div>

            <div className="d-flex flex-row align-items-center justify-content-between">
              <IconButton>
                <LanguageIcon />
              </IconButton>
              <IconButton>
                <FacebookIcon />
              </IconButton>
              <IconButton>
                <LinkedInIcon />
              </IconButton>
              <IconButton>
                <MailOutlineIcon />
              </IconButton>
            </div>
          </div>

          {/* <hr className="my-3" /> */}

          <div
            className="d-flex flex-row align-items-center  my-5"
            style={{ borderBottom: "1px solid #212121" }}
          >
            <div
              onClick={handleUpcomingEventsClick}
              className={`px-4 ${
                selectedTabIndex === 0 ? "active-tab" : ""
              } tab`}
              style={{ fontWeight: "600" }}
            >
              Upcoming Events (3)
            </div>
            <div
              onClick={handlePastEventsClick}
              className={`mx-5 px-4 tab ${
                selectedTabIndex === 1 ? "active-tab" : ""
              }`}
            >
              Past Events (592)
            </div>
            <div
              onClick={handleReviewsClick}
              className={`px-4 tab ${
                selectedTabIndex === 2 ? "active-tab" : ""
              }`}
            >
              Reviews ( <StarOutlineRoundedIcon style={{ fontSize: "16px" }} />{" "}
              4.3)
            </div>
          </div>

          <div className="community-public-page-grid-view my-5">
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
            <div
              className="dummy-card"
              style={{ border: "1px solid green", height: "250px" }}
            ></div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CommunityPublicPage;
