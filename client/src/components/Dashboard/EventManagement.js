import React from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
import CustomPagination from "./HelperComponent/Pagination";
import EventListFields from "./HelperComponent/EventListFields";
import EventDetailCard from "./HelperComponent/EventDetailsCard";
import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import CreateNewEventForm from "./FormComponents/CreateNewEventForm";
import { fetchEventsOfParticularCommunity } from "../../actions";
import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../Loader";
import NoContentFound from "../NoContent";
import NoEvent from "./../../assets/images/noEvent.png";
import history from "./../../history";

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

const EventManagement = () => {
  const params = useParams();

  const userId = params.userId;
  const communityId = params.id;

  const options = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "15", label: "15" },
    { value: "20", label: "20" },
  ];

  const urlSearchParams = new URLSearchParams(window.location.search);

  const query = Object.fromEntries(urlSearchParams.entries());
  const totalResults = useSelector((state) => state.event.length);
  const limitOfPage = query.limit;
  const pageNumber = query.page;
  const numberOfPages = Math.ceil(((totalResults * 1) / limitOfPage) * 1);

  const [term, setTerm] = React.useState("");

  const [limit, setLimit] = React.useState(limitOfPage);
  const [page, setPage] = React.useState(pageNumber);

  const handlePageChange = (page) => {
    setPage(page);
  };
  const handleLimitChange = (value) => {
    setLimit(value.value);
  };

  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(term);

    const timeoutId = setTimeout(() => {
      dispatch(fetchEventsOfParticularCommunity(term, page, limit));
    }, 500);
    console.log(limit);
    history.push(
      `/user/${userId}/community/event-management/${communityId}/?limit=${limit}&page=${page}`
    );

    return () => {
      clearTimeout(timeoutId);
    };
  }, [dispatch, term, limit, page]);

  const classes = useStyles();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { events, isLoading, error } = useSelector((state) => state.event);

  const communityEvents = events;

  const renderCommunityEventsList = (communityEvents) => {
    return communityEvents
      .slice(0)
      .reverse()
      .map((communityEvent) => {
        const {
          id,
          eventName,
          shortDescription,
          visibility,
          publishedStatus,
          views,
          registrationsRecieved,
          status,
        } = communityEvent;
        console.log(id);
        let imgUrl = " #";
        const imgKey = communityEvent.image;
        if (imgKey) {
          imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
        }
        return (
          <EventDetailCard
            key={id}
            imgUrl={imgUrl}
            shortDescription={shortDescription}
            publishedStatus={publishedStatus}
            views={views}
            registrations={registrationsRecieved}
            status={status}
            visibility={visibility}
            eventName={eventName}
            communityId={communityId}
            id={id}
          />
        );
      });
  };

  if (error) {
    throw new Error(error);
  }

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">All Events</div>
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
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary btn-outline-text"
              onClick={handleClickOpen}
            >
              Create New event
            </button>
          </div>
        </div>
        <div
          className="event-management-content-grid px-3 mx-3 mb-4 py-4"
          // key={open}
        >
          <EventListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>

          {isLoading ? (
            <div
              className="d-flex flex-row align-items-center justify-content-center"
              style={{ height: "60vh" }}
            >
              <Loader />
            </div>
          ) : typeof communityEvents !== "undefined" &&
            communityEvents.length > 0 ? (
            renderCommunityEventsList(communityEvents)
          ) : (
            <NoContentFound
              msgText="You have not created any event yet"
              img={NoEvent}
            />
          )}
        </div>
        {/* Here I have to use pagination */}
        <CustomPagination
          numOfPages={numberOfPages}
          limit={limit}
          currentPage={page}
          totalResults={totalResults}
          handleLimitChange={handleLimitChange}
          handlePageChange={handlePageChange}
          options={options}
        />
      </div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        // onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <CreateNewEventForm
          showInlineButton="false"
          handleClose={handleClose}
        />
      </Dialog>
    </>
  );
};

export default EventManagement;
