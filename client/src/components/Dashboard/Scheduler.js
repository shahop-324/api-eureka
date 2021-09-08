/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Registrations.scss";
// import CustomPagination from "./HelperComponent/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import { alpha } from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import ReactTooltip from "react-tooltip";
import CenteredTabs from "../UserAccount/UserAccountCenteredTabBar";
import SchedulerTabs from "./HelperComponent/SchedulerTabs";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Scheduler = () => {
  const classes = useStyles();

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">
            <span> Scheduler </span>
            <a
              data-tip="Manage all your email campaigns and notification schedule here."
              className="ms-3"
            >
              <InfoOutlinedIcon style={{ fill: "#6E6E6E", fontSize: "22px" }} />
            </a>

            <ReactTooltip place="bottom" type="dark" effect="float" />
          </div>
          <div className="sec-heading-action-button d-flex flex-row">
            {/* <div
              className={`${classes.search} me-3`}
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div> */}
            {/* <div className="me-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="bottom"
                options={options}
                defaultValue={options[0]}
              />
            </div> */}
            {/* <button className="btn btn-outline-primary btn-outline-text">
              Suggest Integration
            </button> */}
          </div>
        </div>
        <div className="px-4 py-4">
        {/* <CenteredTabs
                //   activeIndex={currentIndex}
                //   handleChange={handleChange}
                /> */}
                <SchedulerTabs />
          {/* <Eventbrite />
          <Mailchimp />
          <Intercom />
          <Hubspot />
          <Salesforce />
          <Slack />
          <Twitter />
          <Marketo />
          <Miro />
          <Figma />
          <Typeform /> */}
        </div>
      </div>
    </>
  );
};

export default Scheduler;
