import React, { useEffect } from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import "./../../../assets/Sass/EditEvent/Basics.scss";
import "./../../../assets/Sass/EditEvent/About.scss";
import "./../../../index.css";

import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@material-ui/icons/Search";
import Select from "react-select";
import SponsorsListFields from "./SponsorListFields";
import SponsorDetailsCard from "./SponsorDetailsCard";
import AddNewSponsor from "./FormComponents/EditSponsorsForms/AddNewSponsor";
import { useDispatch, useSelector } from "react-redux";
import { fetchSponsors } from "../../../actions";
import { Link, useParams } from "react-router-dom";
import Loader from "../../Loader";
import NoContentFound from "../../NoContent";
import NoSponsor from "./../../../assets/images/working.png";

const options = [
  { value: "all", label: "All Sponsors" },
  { value: "Diamond", label: "Diamond" },
  { value: "Platinum", label: "Platinum" },
  { value: "Gold", label: "Gold" },
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

const Sponsors = () => {
  const [open, setOpen] = React.useState(false);
  const [term, setTerm] = React.useState("");
  const [sponsorStatus, setSponsorStatus] = React.useState("");

  const params = useParams();
  const dispatch = useDispatch();
  const id = params.id;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(fetchSponsors(id, term, sponsorStatus));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, term, sponsorStatus, id]);

  const handleNewSponsor = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { sponsors, isLoading, error } = useSelector((state) => {
    return state.sponsor;
  });

  const renderSponsorList = (sponsors) => {
    return sponsors
      .slice(0)
      .reverse()
      .map((sponsor) => {
        return (
          <SponsorDetailsCard
            url={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${sponsor.image}`}
            key={sponsor._id}
            id={sponsor._id}
            organisationName={sponsor.organisationName}
            website={sponsor.website}
            status={sponsor.status}
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
          <div className="sec-heading-text">All Sponsors</div>
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
                onChange={(value) => setSponsorStatus(value.value)}
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
              onClick={handleNewSponsor}
            >
              Add New Sponsor
            </button>
          </div>
        </div>
        <div className="session-content-grid px-3 mb-4">
          <div className="basic-form-left-white px-4 py-4">
            <SponsorsListFields />
            {isLoading ? (
              <div
                className="d-flex flex-row align-items-center justify-content-center"
                style={{ height: "65vh" }}
              >
                <Loader />
              </div>
            ) : (
              typeof sponsors !== "undefined" &&
            sponsors.length > 0 ?
              renderSponsorList(sponsors) : <NoContentFound msgText="This events sponsors will appear here." img={NoSponsor} />
            )}
          </div>
        </div>
      </div>
      <AddNewSponsor open={open} handleClose={handleClose} />
    </>
  );
};

export default Sponsors;
