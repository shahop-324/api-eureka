import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import "./../../../assets/Sass/EditEvent/Basics.scss";
import "./../../../assets/Sass/EditEvent/About.scss";
import "./../../../index.css";

import SessionListFields from "./SessionListFields";
import SessionDetailCard from "./SessionDetailsCard";

import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AddNewSession from "./FormComponents/EditSessionForms/AddNewSession";
import {
  errorTrackerForCreateSession,
  errorTrackerForFetchSessions,
  fetchSessions,
  fetchSpeakers,
} from "../../../actions";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";


import Loader from "../../Loader";
import NoContentFound from "../../NoContent";
import NoSessionsPNG from "./../../../assets/images/confident.png";
import { useSnackbar } from "notistack";

import styled from "styled-components";


const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

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

const Sessions = () => {


  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;


  useEffect(() => {
    dispatch(fetchSpeakers(id));
  }, [dispatch, id]);

  useEffect(() => {
    //dispatch(fetchSpeakers(id,term));
    const timeoutId = setTimeout(() => {
      dispatch(fetchSessions(id, term));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, term, id]);

  const handleNewSession = () => {
    setOpen(true);
  };
  const { sessions, isLoading, error } = useSelector((state) => {
    return state.session;
  });

  const handleClose = () => {
    setOpen(false);
  };
  const renderSessionsList = (sessions) => {
    return sessions
      .slice(0)
      .reverse()
      .map((session) => {
        const {
          id,
          name,
          startTime,
          endTime,
          startDate,
          endDate,
          description,
          speaker,
        } = session;

        return (
          <SessionDetailCard
            key={id}
            speaker={speaker}
            description={description}
            startTime={startTime}
            endTime={endTime}
            startDate={startDate}
            endDate={endDate}
            name={name}
            id={id}
          />
        );
      });
  };
  const classes = useStyles();

  if (error) {
    enqueueSnackbar(error, {
      variant: "error",
    });

    dispatch(errorTrackerForFetchSessions());
    return dispatch(errorTrackerForCreateSession());
    // throw new Error(error);
  }

  return (
    <>
      <div style={{ minWidth: "1138px" }}>

        
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4 mb-3">
          <SectionHeading className="">Agenda</SectionHeading>
          <div className="drop-selector d-flex flex-row justify-content-end">
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
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>

            <button
                      className="btn btn-primary btn-outline-text"
                      onClick={handleNewSession}
                    >
                      Add New Session
                    </button>

            
          </div>
        </div>

        

        <div className="session-content-grid px-3 mb-4">
          <div className="basic-form-left-white px-4 py-4">



          <>
                      <SessionListFields />
                      {isLoading ? (
                        <div
                          className="d-flex flex-row align-items-center justify-content-center"
                          style={{ height: "65vh" }}
                        >
                          <Loader />
                        </div>
                      ) : typeof sessions !== "undefined" &&
                        sessions.length > 0 ? (
                        renderSessionsList(sessions)
                      ) : (
                        <NoContentFound
                          msgText="This events sessions will appear here."
                          img={NoSessionsPNG}
                        />
                      )}
                    </>


          
          </div>
        </div>
      </div>
      <AddNewSession open={open} handleClose={handleClose} />
      
    </>
  );
};

export default Sessions;
