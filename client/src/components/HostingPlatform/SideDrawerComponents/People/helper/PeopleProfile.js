import React from "react";
import { Avatar, Dialog, IconButton } from "@material-ui/core";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core/styles";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";

import "./../../../Styles/peopleProfile.scss";

import Faker from "faker";

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
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

const PeopleProfile = ({ open, handleClose }) => {
  const classes = useStyles();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        // onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <div className="people-profile-container p-3">
          <div className="d-flex flex-row align-items-center justify-content-between">
            <span
              style={{
                fontWeight: "600",
                fontSize: "1.05rem",
                color: "#212121",
              }}
            >
              Profile
            </span>
            <IconButton
              onClick={() => {
                handleClose();
              }}
            >
              <HighlightOffRoundedIcon />
            </IconButton>
          </div>

          <div>
            <hr />
          </div>

          <div className="" style={{ textAlign: "center", width: "100%" }}>
            <div style={{ marginLeft: "auto", marginRight: "auto" }}>
              <Avatar
                alt={Faker.name.findName()}
                src={Faker.image.avatar()}
                className={`${classes.large} mb-3`}
                variant="rounded"
                style={{ marginLeft: "auto", marginRight: "auto" }}
              />
              <div className="btn-outline-text mb-3">
                {Faker.name.findName()}
              </div>

              <div
                style={{
                  fontWeight: "500",
                  color: "#3B3B3B",
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
                className="mb-3"
              >
                Product Manager, Evenz
              </div>

              <div className="d-flex flex-row align-items-center justify-content-center mb-3">
                <div className="shareon-icon p-3 me-3">
                  <a
                    href="https://www.facebook.com/pages/?category=your_pages&ref=bookmarks"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <FacebookIcon
                        style={{ fontSize: "20", fill: "#1760A8" }}
                      />
                    </IconButton>
                  </a>
                </div>
                <div className="shareon-icon p-3 me-3">
                  <a
                    href="https://www.linkedin.com/company/evenz-in"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <LinkedInIcon
                        style={{ fontSize: "20", fill: "#2565A5" }}
                      />
                    </IconButton>
                  </a>
                </div>

                <div className="shareon-icon p-3 me-3">
                  <a
                    href="https://twitter.com/EvenzOfficial"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <TwitterIcon
                        style={{ fontSize: "20", fill: "#539FF7" }}
                      />
                    </IconButton>
                  </a>
                </div>

                <div className="shareon-icon p-3 me-3">
                  <a
                    href="https://www.instagram.com/evenzofficial/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <IconButton>
                      <Instagram style={{ fontSize: "20", fill: "#841E8D" }} />
                    </IconButton>
                  </a>
                </div>
              </div>

              <div>
                <button className="btn btn-outline-primary btn-outline-text me-3">
                  Schedule a meet
                </button>
                <button className="btn btn-primary btn-outline-text">
                  Start conversation
                </button>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default PeopleProfile;
