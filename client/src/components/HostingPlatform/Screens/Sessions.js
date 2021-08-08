import React, { useEffect } from "react";
import "./../Styles/root.scss";
import "./../Styles/sessions.scss";

import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";

import { fade, makeStyles } from "@material-ui/core/styles";
import SessionDetailCardsList from "../HelperComponents/SessionDetailCardsList";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { errorTrackerForFetchSessionsForUser, fetchSessionsForUser } from "../../../actions";

import socket from './../service/socket';
import Loader from "../../Loader";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
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
    color: "#ffffff",
    backgroundColor: fade(theme.palette.common.white, 0.12),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
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

const Sessions = () => {
  const dispatch = useDispatch();

  const {error, isLoading} = useSelector((state) => state.session);

  const classes = useStyles();

  const role = useSelector((state) => state.eventAccessToken.role);
  const id = useSelector((state) => state.eventAccessToken.id);

  const sessions = useSelector((state) => state.session.sessions);

  const params = useParams();
  
  const eventId = params.eventId;
  const communityId = params.communityId;

  useEffect(() => {
    dispatch(fetchSessionsForUser(eventId));
  }, [dispatch, eventId]);


  if(isLoading) {
    return (<div className="d-flex flex-row align-items-center justify-content-center" style={{width: "100%", height: "80vh"}}> <Loader/> </div>);
  }

  if(error) {
    dispatch(errorTrackerForFetchSessionsForUser());
    alert(error);
    return;
  }


  
  return (
    <>
      <div className="sessions-heading-and-search-box-wrapper-grid d-flex flex-row mb-5">
        <div className="col-3"></div>
        <div className="sessions-and-networking-body-heading col-6">
          Select Session to enter
        </div>
        <div className="col-3">
          <div className={classes.search}>
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
        </div>
      </div>

      <SessionDetailCardsList
        sessions={sessions}
        socket={socket}
        id={id}
        role={role}
        eventId={eventId}
        communityId={communityId}
      />
    </>
  );
};

export default Sessions;
