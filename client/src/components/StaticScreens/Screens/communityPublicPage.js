import { Avatar, CssBaseline, IconButton } from "@material-ui/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import history from "../../../history";
import AvatarMenu from "../../AvatarMenu";
import "./../Styles/CommunityPublicPage.scss";
import Faker from "faker";
import { makeStyles } from "@material-ui/core/styles";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import LanguageIcon from "@material-ui/icons/Language";
import ConfirmationNumberIcon from "@material-ui/icons/ConfirmationNumber";
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

  let fullLocation = `https://www.evenz.in/${location.pathname}${location.search}`;
  let url = new URL(fullLocation);
  let search_params = url.searchParams;

  const onChangeSearchEvents = (e) => {
    setText(e.target.value);
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
    // setFullLocation(new_url);
    const len = new_url.split("?")[0].length;

    const result = new_url.substring(len);

    // props.fetchEvents(event.target.value);
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
          <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
              <Link
                to="/home"
                class="navbar-brand"
                style={{ color: "#538BF7", textDecoration: "none" }}
              >
                Evenz
              </Link>
              <button
                class="navbar-toggler"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <form
                  onSubmit={onSubmitTextSearch}
                  class="d-flex special"
                  style={{ marginLeft: "2%", alignSelf: "center" }}
                >
                  <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search events"
                    aria-label="Search"
                    value={text}
                    onChange={onChangeSearchEvents}
                  />
                  <button class="btn btn-outline-primary" type="submit">
                    <i className="fa fa-search"></i>
                  </button>
                </form>
                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                  {isSignedIn ? (
                    <div className="me-5 py-2 d-flex flex-row align-items-center justify-content-center">
                      <AvatarMenu />
                    </div>
                  ) : (
                    <div className="d-flex flex-row align-items-center justify-content-center">
                      {" "}
                      <li class="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signin"
                          class="btn btn-outline-primary btn-outline-text me-3"
                        >
                          Login
                        </Link>
                      </li>
                      <li class="nav-item" style={{ alignSelf: "center" }}>
                        <Link
                          to="/signup"
                          class="btn btn-primary btn-outline-text"
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
        <div className="container max-width-container-public-page mt-5" style={{height: "auto"}}>
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

          <hr className="my-3" />

          <div className="community-public-page-grid-view my-4">
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
