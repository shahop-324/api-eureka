import React, { useEffect } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
import CustomPagination from "./HelperComponent/Pagination";
import Select from "react-select";
import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";


import RecordingsListFields from "./HelperComponent/RecordingsListFields";
import RecordingsDetailsCard from "./HelperComponent/RecordingsDetailsCard";

import { useParams } from "react-router-dom";

const options = [
  { value: "All", label: "All Events" },
  { value: "Eureka Road to Enterprise", label: "Eureka Road to Enterprise" },
  { value: "Startup conference", label: "Startup conference" },
  { value: "Design Meetup", label: "Design Meetup" },
];

const timelineOptions = [
  { value: "Today", label: "Today" },
  { value: "This Week", label: "This Week" },
  { value: "This Month", label: "This Month" },
  { value: "This Year", label: "This Year" },
  { value: "Lifetime", label: "Lifetime" },
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

const Recordings = () => {
  const classes = useStyles();
  

  const params = useParams();
  const communityId = params.communityId;

  console.log(communityId);

  useEffect(() => {
    // dispatch(fetchRegistrationsOfParticularCommunity(communityId));
  }, []);

  

  return (
    <>
      <div>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">All Recordings</div>
          <div className="sec-heading-action-button d-flex flex-row">
            <div
              className={`${classes.search}`}
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
            <div className="ms-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="top"
                options={options}
                defaultValue={options[0]}
              />
            </div>

            <div className="ms-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="top"
                options={timelineOptions}
                defaultValue={timelineOptions[4]}
              />
            </div>

            {/* <button className="btn btn-primary btn-outline-text">
                  Create New event
                </button> */}
          </div>
        </div>
        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          {/* <EventListFields /> */}
          {/* <RegistrationsListFields /> */}
          <RecordingsListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          <RecordingsDetailsCard />
          <RecordingsDetailsCard />
          <RecordingsDetailsCard />
          <RecordingsDetailsCard />
          <RecordingsDetailsCard />
          <RecordingsDetailsCard />
          <RecordingsDetailsCard />
          
        </div>
        {/* Here I have to use pagination */}
        <CustomPagination />
      </div>
    </>
  );
};

export default Recordings;
