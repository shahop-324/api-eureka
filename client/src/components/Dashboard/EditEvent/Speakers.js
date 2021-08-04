import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import "./../../../assets/Sass/EditEvent/Basics.scss";
import "./../../../assets/Sass/EditEvent/About.scss";
import "./../../../index.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import SpeakersListFields from "./SpeakersListFields";
import SpeakersDetailsCard from "./SpeakersDetailsCard";

import Select from "react-select";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AddNewSpeaker from "./FormComponents/EditSpeakersForms/AddNewSpeaker";
import { useParams } from "react-router";
import { useEffect } from "react";
import { fetchSessions, fetchSpeakers } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../../Loader";

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
    backgroundColor: fade(theme.palette.common.white, 0.15),
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

const Speakers = () => {
  let options = [{ value: "all", label: "All Sessions" }];

  const sessions = useSelector((state) => state.session.sessions);

  if (sessions) {
    const sessionOptions = sessions.map((session) => {
      return { value: session._id, label: session.name };
    });

    options = options.concat(sessionOptions);

    console.log(sessionOptions);
  }

  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const [sessionId, setSessionId] = React.useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;
  const { isLoading, error, speakers } = useSelector((state) => {
    return state.speaker;
  });
  // const communityId = params.communityId;

  useEffect(() => {
    dispatch(fetchSessions(id));
  }, [dispatch, id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchSpeakers(id, term, sessionId));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, term, sessionId, id]);

  const handleNewSpeaker = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const renderSpeakersList = (speakers) => {
    if (speakers.length !== 0) {
      return speakers
        .slice(0)
        .reverse()
        .map((speaker) => {
          const { id, firstName, lastName, email, image, sessions, headline } =
            speaker;
          // console.log(id);
          let imgUrl = " #";
          const imgKey = image;
          if (imgKey) {
            imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
          }
          return (
            <SpeakersDetailsCard
              url={imgUrl}
              key={id}
              name={firstName + " " + lastName}
              email={email}
              sessions={sessions}
              id={id}
              headline={headline}
            />
          );
        });
    } else {
      return <></>;
    }
  };
  const classes = useStyles();

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">All Speakers</div>
          <div className="drop-selector d-flex flex-row justify-content-end">
            <div
              className={`${classes.search}`}
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                value={term}
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
            <div className="mx-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="top"
                options={options}
                defaultValue={options[0]}
                //  onChange={(value)=>console.log(value)}
                onChange={(value) => setSessionId(value.value)}
              />
            </div>
            <Link
              type="button"
              className="btn btn-outline-primary btn-outline-text me-3"
              to={`/event-landing-page/${id}`}
              target="_blank"
            >
              Preview Landing Page
            </Link>
            <button
              className="btn btn-primary btn-outline-text"
              onClick={handleNewSpeaker}
            >
              Add New Speaker
            </button>
          </div>
        </div>
        <div className="session-content-grid px-3 mb-4">
          <div className="basic-form-left-white px-4 py-4">
            <SpeakersListFields />
            {isLoading ? (
              <div
                className="d-flex flex-row align-items-center justify-content-center"
                style={{ height: "65vh" }}
              >
                <Loader />
              </div>
            ) : (
              renderSpeakersList(speakers)
            )}
          </div>
        </div>
      </div>
      <AddNewSpeaker open={open} handleClose={handleClose} />
    </>
  );
};

export default Speakers;