import React, { useEffect } from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import "./../../../assets/Sass/EditEvent/Basics.scss";
import "./../../../assets/Sass/EditEvent/About.scss";
import "./../../../index.css";

import Select from "react-select";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import BoothsListFields from "./BoothListFields";
import BoothDetailsCard from "./BoothDetailsCard";
import AddNewBooth from "./FormComponents/EditBoothsForms/AddNewBooth";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { errorTrackerForFetchBooths, fetchBooths } from "../../../actions";
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

const Booths = () => {
  let options = [{ value: "all", label: "All tags" }];

  const availableTags = useSelector(
    (state) => state.event.eventDetails.boothTags
  );

  if (availableTags) {
    const tagsOptions = availableTags.map((tag) => {
      return { value: tag, label: tag };
    });

    options = options.concat(tagsOptions);
    console.log(tagsOptions);
  }

  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const [tagText, setTagText] = React.useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchBooths(id, term, tagText));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, term, tagText, id]);

  const handleNewBooth = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { booths, isLoading, error } = useSelector((state) => {
    return state.booth;
  });

  const renderBoothList = (booths) => {
    return booths
      .slice(0)
      .reverse()
      .map((booth) => {
        return (
          <BoothDetailsCard
            url={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${booth.image}`}
            key={booth._id}
            id={booth._id}
            name={booth.name}
            tagline={booth.tagline}
            emails={booth.emails}
            boothTags={booth.tags}
          />
        );
      });
  };

  const classes = useStyles();

  if (error) {
    throw new Error(error);
  }

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">All Booths</div>
          <div className="drop-selector d-flex flex-row justify-content-end">
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
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
            <div className="mx-3" style={{ minWidth: "250px" }}>
              <Select
                styles={styles}
                menuPlacement="top"
                options={options}
                defaultValue={options[0]}
                onChange={(value) => setTagText(value.value)}
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
            <div onClick={handleNewBooth}>
              <button className="btn btn-primary btn-outline-text">
                Add New Booth
              </button>
            </div>
          </div>
        </div>
        <div className="session-content-grid px-3 mb-4">
          <div className="basic-form-left-white px-4 py-4">
            <BoothsListFields />
            {isLoading ? (
              <div
                className="d-flex flex-row align-items-center justify-content-center"
                style={{ height: "65vh" }}
              >
                <Loader />
              </div>
            ) : (
              renderBoothList(booths)
            )}
          </div>
        </div>
      </div>
      <AddNewBooth open={open} handleClose={handleClose} />
    </>
  );
};

export default Booths;
