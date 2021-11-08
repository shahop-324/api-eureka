import React, { useEffect } from "react";
import styled from "styled-components";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
import Select from "react-select";
import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import RecordingsListFields from "./HelperComponent/RecordingsListFields";
import { useParams } from "react-router-dom";
import NoContentFound from "../NoContent";
import Downloading from "./../../assets/images/Downloading.png";

// Here we need to provide list of sessions for which recording is present
const sessionOptions = [{ value: "All", label: "All Sessions" }];

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
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
  useEffect(() => {}, []);

  let recordings = [];

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <SectionHeading className="">All Recordings</SectionHeading>
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
                menuPlacement="bottom"
                options={sessionOptions}
                defaultValue={sessionOptions[0]}
              />
            </div>
          </div>
        </div>
        {typeof recordings !== "undefined" && recordings.length > 0 ? (
          <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
            <RecordingsListFields />
            <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
              <Divider />
            </div>
          </div>
        ) : (
          <div
            className="d-flex flex-row align-items-center justify-content-center"
            style={{ height: "63vh", width: "100%" }}
          >
            {" "}
            <NoContentFound
              msgText="No recording found for any session of this event"
              img={Downloading}
            />{" "}
          </div>
        )}
      </div>
    </>
  );
};

export default Recordings;
