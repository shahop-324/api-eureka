/* eslint-disable no-unused-vars */
import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import "./../index.css";
import "./../assets/css/style.css";
import "./../assets/css/UserAccountStyle.css";
import "./../assets/css/CardStyle.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  errorTrackerForEditUser,
  navigationIndex,
  signOut,
} from "../actions/index";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import history from "../history";
import { Dialog, IconButton, useMediaQuery } from "@material-ui/core";
import { useTheme } from "@material-ui/core";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
const { REACT_APP_MY_ENV } = process.env;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const AvatarMenu = () => {
  const referralCode = useSelector((state) => state.auth.referralCode);

  const [openReferral, setOpenReferral] = React.useState(false);

  const userDetails = useSelector((state) => state.user);

  let signupUsingReferral = 0;
  let upgrades = 0;
  let credit = 0;

  if (userDetails) {
    signupUsingReferral = userDetails.signupUsingReferral
      ? userDetails.signupUsingReferral
      : 0;
    upgrades = userDetails.upgrades ? userDetails.upgrades : 0;
    credit = userDetails.credit ? userDetails.credit : 0;
  }

  const dispatch = useDispatch();

  const handleClickOpenReferral = () => {
    setOpenReferral(true);
  };

  const handleCloseReferral = () => {
    setOpenReferral(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [maxWidth, setMaxWidth] = React.useState("lg");

  const user = useSelector((state) => state.user);
  const isLoading = user.isLoading;
  const error = user.error;

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  const onClickLoggedOut = async () => {
    const allKeys = Object.keys(localStorage);

    allKeys.forEach((value) => {
      localStorage.removeItem(value);
    });

    dispatch(signOut());
  };

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  if (isLoading) {
    return (
      <div className="spinner-border" role="status">
      </div>
    );
  }
  if (error) {
    return dispatch(errorTrackerForEditUser());
  }

  let image;
  let userName;

  if (user.userDetails) {
    image = user.userDetails.image;
    userName = user.userDetails.firstName;
  }

  let imgURL;

  if (image) {
    if (image.startsWith("https://")) {
      imgURL = image;
    } else {
      imgURL = `https://bluemeet-inc.s3.us-west-1.amazonaws.com/${image}`;
    }
  }

  const referralLink = REACT_APP_MY_ENV
    ? `http://localhost:3001/?ref=${referralCode}`
    : `https://www.bluemeet.in/?ref=${referralCode}`;

  return (
    <div className={`${classes.root}`}>
      <div>
        <Button
          style={{ padding: "0" }}
          ref={anchorRef}
          disableRipple={true}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="false"
          onClick={handleToggle}
          disableElevation={true}
        >
          <div
            className="avatar-menu-h-wrapper d-flex flex-row align-items-center ps-3 py-2"
            style={{ borderRadius: "35px" }}
          >
            <Avatar alt={userName} src={imgURL} />
            <ExpandMoreIcon className="mx-3" />
          </div>
        </Button>

        <Popper
          style={{
            zIndex: 10000,
            textAlign: "center",
            marginTop: "20px",
          }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    style={{ alignItems: "center", justifyItems: "center" }}
                    autoFocusItem={open}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                  >
                    <div className="avatar-menu-group-heading px-3 pb-3 mt-2">
                      Account
                    </div>
                    <MenuItem
                      onClick={(event) => {
                        dispatch(navigationIndex(0));
                        history.push("/user/home");
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Home
                      </div>
                    </MenuItem>
                    <MenuItem
                      onClick={(event) => {
                        dispatch(navigationIndex(3));
                        history.push("/user/profile");
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Profile
                      </div>
                    </MenuItem>

                    <MenuItem
                      onClick={(event) => {
                        history.push("/search-events");
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Explore Events
                      </div>
                    </MenuItem>

                    <MenuItem
                      onClick={(event) => {
                        handleClickOpenReferral();
                        handleClose(event);
                      }}
                    >
                      <div className="avatar-menu-account-section-btns mb-2">
                        Referrals & Credit
                      </div>
                    </MenuItem>

                    <hr className="px-2" />
                    <button
                      onClick={onClickLoggedOut}
                      className="btn btn-outline-primary btn-outline-text"
                    >
                      Sign Out
                    </button>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>

        <Dialog
          maxWidth={maxWidth}
          fullScreen={fullScreen}
          open={openReferral}
          // onClose={props.closeHandler}
          aria-labelledby="responsive-dialog-title"
        >
          <div className="user-referral-container p-4">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 3fr 1fr",
                alignItems: "center",
              }}
              className="px-4"
            >
              <div></div>
              <div
                style={{ textAlign: "center", fontSize: "1.1rem" }}
                className="btn-outline-text"
              >
                Referral & Credits
              </div>
              <div style={{ justifySelf: "end" }}>
                <IconButton
                  onClick={handleCloseReferral}
                  style={{ width: "fit-content" }}
                  aria-label="delete"
                >
                  <HighlightOffRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div className="refer-and-earn-banner px-3 py-2 mt-3">
              Refer your network to Bluemeet — give $5, get $5.
            </div>
            <div className="referral-3-cards-row my-5">
              <div className="referral-display-card p-4 d-flex flex-column align-item-center justify-content-center">
                <div className="mb-2" style={{ fontFamily: "Ubuntu" }}>
                  Credits
                </div>
                <div className="bold-big-number">${credit}</div>
              </div>
              <div className="referral-display-card p-4 d-flex flex-column align-item-center justify-content-center">
                <div className="mb-2" style={{ fontFamily: "Ubuntu" }}>
                  Signup
                </div>
                <div className="bold-big-number d-flex flex-column align-item-center justify-content-center">
                  {signupUsingReferral}
                </div>
              </div>
              <div className="referral-display-card p-4 d-flex flex-column align-item-center justify-content-center">
                <div className="mb-2" style={{ fontFamily: "Ubuntu" }}>
                  Upgrades
                </div>
                <div className="bold-big-number">{upgrades}</div>
              </div>
            </div>

            <div
              className="referral-link-and-copy-to-clipboard"
              style={{ textAlign: "center" }}
            >
              <div className="ui action input" style={{ minWidth: "400px" }}>
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  placeholder="Search..."
                />
                <button
                  className="ui icon button"
                  onClick={() => {
                    navigator.clipboard.writeText(referralLink);
                    alert("copied to clipboard!");
                  }}
                >
                  <i className="copy outline icon"></i>
                </button>
              </div>
            </div>

            <div
              className="social-media-share-your-link mt-5"
              style={{ textAlign: "center" }}
            >
              <div className="btn-outline-text">Share your link</div>
              <div
                className=" d-flex flex-row align-items-center justify-content-center"
                style={{ width: "100%" }}
              >
                <div className="shareon-icon p-3 ">
                  <a
                    href="https://web.whatsapp.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton
                      style={{ height: "fit-content", width: "fit-content" }}
                    >
                      <WhatsAppIcon
                        style={{ fontSize: "24", fill: "#0C881D" }}
                      />
                    </IconButton>
                  </a>
                </div>
                <div className="shareon-icon p-3 ">
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <FacebookIcon
                        style={{ fontSize: "24", fill: "#1760A8" }}
                      />
                    </IconButton>
                  </a>
                </div>
                <div className="shareon-icon p-3 ">
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <LinkedInIcon
                        style={{ fontSize: "24", fill: "#2565A5" }}
                      />
                    </IconButton>
                  </a>
                </div>
                <div className="shareon-icon p-3 ">
                  <a
                    href="https://www.twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <TwitterIcon
                        style={{ fontSize: "24", fill: "#539FF7" }}
                      />
                    </IconButton>
                  </a>
                </div>

                <div className="shareon-icon p-3 ">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <Instagram style={{ fontSize: "24", fill: "#841E8D" }} />
                    </IconButton>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default AvatarMenu;
