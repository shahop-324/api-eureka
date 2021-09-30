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
import { Link } from "react-router-dom";

import Loader from "../../Loader";
import NoContentFound from "../../NoContent";
import NoSessionsPNG from "./../../../assets/images/confident.png";
import { useSnackbar } from "notistack";

import styled from "styled-components";
import NetworkingListFields from "./GridComponents/Agenda/Networking/ListFields";
import NetworkingDetailCard from "./GridComponents/Agenda/Networking/DetailsCard";
import AddNewNetworking from "./FormComponents/EditSessionForms/AddNewNetworking";
import ExhibitDetailCard from "./GridComponents/Agenda/Exhibit/DetailsCard";
import ExhibitListFields from "./GridComponents/Agenda/Exhibit/ListFields";
import AddExhibitInteraction from "./FormComponents/EditSessionForms/AddExhibitInteraction";
import StreamInBluemeetListFields from "./GridComponents/Agenda/StreamInBluemeet/ListFields";
import StreamInBluemeetDetailCard from "./GridComponents/Agenda/StreamInBluemeet/DetailsCard";
import AddStreamInBluemeet from "./FormComponents/EditSessionForms/AddStreamInBluemeet";
import AddNewBreak from "./FormComponents/EditSessionForms/AddNewBreak";
import BreakListFields from "./GridComponents/Agenda/Break/ListFields";
import BreakDetailCard from "./GridComponents/Agenda/Break/DetailsCard";

const SectionHeading = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  color: #212121;
  font-family: "Ubuntu";
`;

const SwitchTab = styled.div`
  font-weight: 500;
  font-size: 0.95rem;
  font-family: "Ubuntu";
  color: ${(props) => (props && props.active ? "#272727" : "#575757")};
  padding-bottom: 5px;
  border-bottom: ${(props) =>
    props && props.active ? "3px solid #538BF7" : "3px solid transparent"};
  width: fit-content;

  &:hover {
    color: #272727;
    cursor: pointer;
  }
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
  const [activeTab, setActiveTab] = React.useState("sessions");

  const [openNetworking, setOpenNetworking] = React.useState(false);
  const [openExhibitInteraction, setOpenExhibitInteraction] =
    React.useState(false);
  const [openStreamInBluemeet, setOpenStreamInBluemeet] = React.useState(false);
  const [openBreak, setOpenBreak] = React.useState(false);

  const handleCloseNetworking = () => {
    setOpenNetworking(false);
  };

  const handleCloseExhibit = () => {
    setOpenExhibitInteraction(false);
  };

  const handleCloseStreamInBluemeet = () => {
    setOpenStreamInBluemeet(false);
  };

  const handleCloseBreak = () => {
    setOpenBreak(false);
  };

  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;

  const communityId = params.communityId;

  // const communityId = params.communityId;
  // useEffect(() => {
  //   dispatch(fetchParticularEventOfCommunity(communityId));
  // }, []);

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

            {(() => {
              switch (activeTab) {
                case "sessions":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text"
                      onClick={handleNewSession}
                    >
                      Add New Session
                    </button>
                  );

                case "networking":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text"
                      onClick={() => {
                        setOpenNetworking(true);
                      }}
                    >
                      Add Networking
                    </button>
                  );
                case "exhibit":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text"
                      onClick={() => {
                        setOpenExhibitInteraction(true);
                      }}
                    >
                      Add Exhibit Round
                    </button>
                  );
                case "streaminbluemeet":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text"
                      onClick={() => {
                        setOpenStreamInBluemeet(true);
                      }}
                    >
                      Add Stream In Bluemeet
                    </button>
                  );
                case "break":
                  return (
                    <button
                      className="btn btn-primary btn-outline-text"
                      onClick={() => {
                        setOpenBreak(true)
                      }}
                    >
                      Add Break
                    </button>
                  );
                default:
                  break;
              }
            })()}
          </div>
        </div>

        <div
          className="d-flex flex-row align-items-center mb-4 mx-4"
          style={{ borderBottom: "1px solid #D1D1D1" }}
        >
          <SwitchTab
            active={activeTab === "sessions" ? true : false}
            className=" me-5"
            onClick={() => {
              setActiveTab("sessions");
            }}
          >
            Sessions
          </SwitchTab>
          <SwitchTab
            active={activeTab === "networking" ? true : false}
            className=" me-5"
            onClick={() => {
              setActiveTab("networking");
            }}
          >
            Networking
          </SwitchTab>
          <SwitchTab
            active={activeTab === "exhibit" ? true : false}
            className=" me-5"
            onClick={() => {
              setActiveTab("exhibit");
            }}
          >
            Exhibit Interaction
          </SwitchTab>
          <SwitchTab
            className=" me-5"
            active={activeTab === "streaminbluemeet" ? true : false}
            onClick={() => {
              setActiveTab("streaminbluemeet");
            }}
          >
            Stream in Bluemeet
          </SwitchTab>
          <SwitchTab
            className=" me-5"
            active={activeTab === "break" ? true : false}
            onClick={() => {
              setActiveTab("break");
            }}
          >
            Break
          </SwitchTab>
        </div>

        <div className="session-content-grid px-3 mb-4">
          <div className="basic-form-left-white px-4 py-4">
            {(() => {
              switch (activeTab) {
                case "sessions":
                  return (
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
                  );

                case "networking":
                  return (
                    <>
                      <NetworkingListFields />

                      <NetworkingDetailCard />
                    </>
                  );

                case "exhibit":
                  return (
                    <>
                      <ExhibitListFields />

                      <ExhibitDetailCard />
                    </>
                  );

                case "streaminbluemeet":
                  return (
                    <>
                      <StreamInBluemeetListFields />

                      <StreamInBluemeetDetailCard />
                    </>
                  );
                case "break":
                  return (
                    <>
                      <BreakListFields />

                      <BreakDetailCard />
                    </>
                  );
                default:
                  break;
              }
            })()}
          </div>
        </div>
      </div>
      <AddNewSession open={open} handleClose={handleClose} />
      <AddNewNetworking
        open={openNetworking}
        handleClose={handleCloseNetworking}
      />
      <AddExhibitInteraction
        open={openExhibitInteraction}
        handleClose={handleCloseExhibit}
      />
      <AddStreamInBluemeet
        open={openStreamInBluemeet}
        handleClose={handleCloseStreamInBluemeet}
      />
      <AddNewBreak open={openBreak} handleClose={handleCloseBreak} />
    </>
  );
};

export default Sessions;
