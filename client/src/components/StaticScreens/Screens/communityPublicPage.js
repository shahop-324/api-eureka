import { Avatar, CssBaseline, IconButton } from "@material-ui/core";
import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import TwitterIcon from "@mui/icons-material/Twitter";

import ReplyRoundedIcon from "@mui/icons-material/ReplyRounded";

import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useParams } from "react-router-dom";

import CommunityProfileTab from "./../../Dashboard/SubComponents/CommunityProfileTab";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";

import UploadCommunityCover from "./../Helper/UploadCommunityCover";

import {
  fetchCommunityProfile,
  fetchCommunityEvents,
  fetchCommunityReviews,
} from "./../../../actions";

import {
  Dialog,
  SwipeableDrawer,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import Footer from "../../Footer";


import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import TelegramIcon from "@mui/icons-material/Telegram";
import RedditIcon from "@mui/icons-material/Reddit";

import MenuItem from "@material-ui/core/MenuItem";

import { styled as MUIStyled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";

const SpeakersHeading = styled.div`
  font-weight: 500;
  font-family: "Ubuntu";
  color: #212121;
  font-size: 0.8rem;
`;

const RatingPaper = styled.div`
  background-color: #152d35 !important;
`;

const StyledMenu = MUIStyled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const HeaderFooter = styled.div`
  background-color: #ebf4f6;
`;

const FormHeading = styled.div`
  font-size: 1.2rem;
  font-family: "Ubuntu";
  font-weight: 600;
  color: #212121;
`;

const StyledIconButton = styled.div`
  border-radius: 10px;
  border: 1px solid #ffffff;
  background-color: #212121;
  color: #ffffff;
  padding: 12px;

  &:hover {
    border: 1px solid #212121;
    background-color: #ffffff;
    color: #212121;
    cursor: pointer;
  }
`;

const MenuText = styled.span`
  font-weight: 500;
  font-size: 0.87rem;
  color: #212121;
`;

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

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dispatch = useDispatch();

  const params = useParams();

  const communityId = params.communityId;

  useEffect(() => {
    dispatch(fetchCommunityProfile(communityId));
    dispatch(fetchCommunityEvents(communityId));
    dispatch(fetchCommunityReviews(communityId));
  }, []);

  const location = useLocation();

  const [openSettings, setOpenSettings] = React.useState(false);

  const handleClickOpenSettings = () => {
    setOpenSettings(true);
  };

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

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const [openUploadCover, setOpenUploadCover] = React.useState(false);

  const handleCloseUploadCover = () => {
    setOpenUploadCover(false);
  };

  // Check if I am following this community

  return (
    <>
      <CssBaseline />
      <div>
        <div className="row nav-section">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a href="/">
                <img
                  src={BluemeetLogoLight}
                  alt="Bluemeet Logo"
                  style={{ height: "50px" }}
                />
              </a>

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
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row align-items-center">
                  <div
                    onClick={handleClickOpenSettings}
                    className={`${classes.root} mx-2`}
                  >
                    <IconButton style={{ height: "fit-content" }}>
                      <EditRoundedIcon
                        style={{ color: "#212121", fontSize: "22px" }}
                      />
                    </IconButton>
                  </div>
                  {isSignedIn ? (
                    <div className="py-2 d-flex flex-row align-items-center justify-content-center">
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
        <div>
          <StyledIconButton
            onClick={() => {
              setOpenUploadCover(true);
            }}
            style={{
              height: "fit-content",
              position: "absolute",
              bottom: "12px",
              right: "12px",
              zIndex: "100",
            }}
          >
            <EditRoundedIcon style={{ fontSize: "22px" }} />
          </StyledIconButton>

          <img
            className="community-page-art"
            src="http://www.calendarp.com/wp-content/uploads/2019/02/YouTube-Channel-Art-CP-008.jpg"
            alt="community public page art"
          ></img>
        </div>
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
            <div className="d-flex flex-row align-items-center justify-content-between">
            <button
              className="btn btn-outline-text btn-outline-primary d-flex flex-row align-items-center"
              id="demo-customized-button"
              aria-controls="demo-customized-menu"
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              variant="outlined"
              disableElevation
              onClick={handleClickMore}
             
            >
              {" "}
              <ReplyRoundedIcon style={{ fontSize: "20px" }} />{" "}
              <span className="ms-2">Share</span>
            </button>
            <button className="btn btn-primary btn-outline-text ms-3">Follow</button>
            </div>
            
            <StyledMenu
          id="demo-customized-menu"
          MenuListProps={{
            "aria-labelledby": "demo-customized-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem className="mb-1" onClick={handleClose} disableRipple>
            <FacebookIcon style={{ color: "#4267B2" }} />
            <MenuText>Facebook</MenuText>
          </MenuItem>

          <MenuItem className="mb-1" onClick={handleClose} disableRipple>
            <TwitterIcon style={{ color: "#1DA1F2" }} />
            <MenuText>Twitter</MenuText>
          </MenuItem>
          <MenuItem className="mb-1" onClick={handleClose} disableRipple>
            <LinkedInIcon style={{ color: "#0e76a8" }} />
            <MenuText>Linkedin</MenuText>
          </MenuItem>
          <MenuItem className="mb-1" onClick={handleClose} disableRipple>
            <WhatsAppIcon style={{ color: "#075E54" }} />
            <MenuText>WhatsApp</MenuText>
          </MenuItem>
          <MenuItem className="mb-1" onClick={handleClose} disableRipple>
            <TelegramIcon style={{ color: "#0088cc" }} />
            <MenuText>Telegram</MenuText>
          </MenuItem>
          <MenuItem className="mb-1" onClick={handleClose} disableRipple>
            <RedditIcon style={{ color: "#FF5700" }} />
            <MenuText>Reddit</MenuText>
          </MenuItem>
        </StyledMenu>
           
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
                <TwitterIcon />
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

      <Dialog
        maxWidth={maxWidth}
        fullScreen={fullScreen}
        open={openSettings}
        aria-labelledby="responsive-dialog-title"
      >
        <HeaderFooter className="px-4 pt-3 ">
          <div
            className="form-heading-and-close-button"
            style={{ width: "100%" }}
          >
            <div></div>
            <FormHeading style={{ fontFamily: "Ubuntu", textAlign: "center" }}>
              Edit community profile
            </FormHeading>
            <div className="overlay-form-close-button">
              <IconButton
                type="button"
                aria-label="delete"
                onClick={() => {
                  setOpenSettings(false);
                }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </div>
        </HeaderFooter>
        <CommunityProfileTab />
      </Dialog>

      <UploadCommunityCover
        open={openUploadCover}
        handleClose={handleCloseUploadCover}
      />
    </>
  );
};

export default CommunityPublicPage;
