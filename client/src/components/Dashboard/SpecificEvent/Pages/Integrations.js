import React from "react";
import "./../../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../../assets/Sass/EventManagement.scss";
import "./../../../../assets/Sass/SideNav.scss";
import "./../../../../assets/Sass/TopNav.scss";
import "./../../../../assets/Sass/DataGrid.scss";
import "./../../../../assets/Sass/Registrations.scss";
// import CustomPagination from "./HelperComponent/Pagination";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { alpha } from "@material-ui/core";
import Select from 'react-select';
import Eventbrite from "./../../Integrations/Eventbrite";
import Mailchimp from "./../Integration/Cards/Mailchimp";
import Intercom from "./../../Integrations/Intercomm";
import Hubspot from "./../../Integrations/Hubspot";
import Salesforce from "./../../Integrations/Salesforce";
import Slack from "./../../Integrations/Slack";
import Twitter from "./../../Integrations/Twitter";
import Marketo from "./../../Integrations/Marketo";
import Miro from "./../../Integrations/Miro";
import Figma from "./../../Integrations/Figma";
import Typeform from "./../../Integrations/Typeform";

const options = [
  { value: "All", label: "All Integrations" },
  { value: "Collaboration", label: "Collaboration" },
  { value: "Translation", label: "Translation" },
  { value: "Gamification", label: "Gamification" },
  { value: "Social Media", label: "Social Media" },
  { value: "CRM", label: "CRM" },
  { value: "Engagement", label: "Engagement" },
  { value: "Marketing", label: "Marketing" },
  { value: "Donations", label: "Donations" },
  { value: "Captions", label: "Captions" },
];

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Inter",
    fontWeight: "600",
    color: "#757575",
  }),
};

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

const Integrations = () => {
  
  const classes = useStyles();

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Integrations</div>
          <div className="sec-heading-action-button d-flex flex-row">
            <div
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
            </div>
            <div className="me-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="bottom"
                options={options}
                defaultValue={options[0]}
              />
            </div>
            <button className="btn btn-outline-primary btn-outline-text">Suggest Integration</button>
          </div>
        </div>
        <div className="px-4 py-4">
        {/* <Eventbrite /> */}
        <Mailchimp />
        {/* <Intercom />
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

export default Integrations;
