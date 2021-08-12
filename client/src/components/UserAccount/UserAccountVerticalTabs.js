/* eslint-disable array-callback-return */
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import EventCard from "../EventCard";
import YouHaveNoEventComing from "./YouHaveNoEventsComing";
import dateFormat from "dateformat";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { errorTrackerForRegisteredEvents, fetchUserRegisteredEvents } from "../../actions";
import Loader from "../Loader";
// import history from "../../history";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    minHeight: "100vh",
    width: "100%",
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function VerticalTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { events, isLoading, error } = useSelector((state) => state.event);
  const userLoading = useSelector((state) => state.user.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userLoading) {
      dispatch(fetchUserRegisteredEvents());
    }
  }, [userLoading, dispatch]);

  if (isLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ height: "80vh", width: "100%" }}
      >
        <Loader />
      </div>
    );
  } else if (error) {
    dispatch(errorTrackerForRegisteredEvents());
    alert(error);
    return;
  }

  console.log(events);

  let registeredInEvents = events.filter(
    (event) => new Date(event.endDate) > Date.now()
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const renderThisMonthRegisteredEvents = () => {
    if (registeredInEvents.length !== 0) {
      return registeredInEvents.map((event) => {
        var date = new Date(event.startDate);
        console.log(date);
        var newDate = new Date(date.setMonth(date.getMonth() + 1));
        console.log(newDate);
        if (new Date(event.endDate) <= newDate) {
          const now = new Date(event.startDate);
          const formatedDate = dateFormat(now, "mmm dS, h:MM TT");
          // console.log(x);

          const end = new Date(event.endDate);
          const formatedEndDate = dateFormat(end, "mmm dS, h:MM TT");

          return (
            <EventCard
              image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
              date={formatedDate}
              key={event.id}
              eventName={event.eventName}
              minPrice={event.minTicketPrice}
              maxPrice={event.maxTicketPrice}
              id={event.id}
              showBtn={true}
              communityId={event.createdBy}
              endDate={formatedEndDate}
            rating={(event.communityRating * 1 ).toFixed(1)}
            />
          );
        }
      });
    } else {
      return (
        <YouHaveNoEventComing msgText="You have no event coming this month" />
      );
    }
  };

  const renderThisWeekRegisteredEvents = () => {
    if (registeredInEvents.length !== 0) {
      return registeredInEvents.map((event) => {
        console.log(event.startDate);
        var date = new Date(event.startDate);
        console.log(date);
        date.setDate(date.getDate() + 7);
        console.log(date);

        if (new Date(event.endDate) <= date) {
          const now = new Date(event.startDate);
          const formatedDate = dateFormat(now, "mmm dS, h:MM TT");

          const end = new Date(event.endDate);
          const formatedEndDate = dateFormat(end, "mmm dS, h:MM TT");
          
          return (
            <EventCard
              image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
              date={formatedDate}
              key={event.id}
              eventName={event.eventName}
              minPrice={event.minTicketPrice}
              maxPrice={event.maxTicketPrice}
              id={event.id}
              showBtn={true}
              communityId={event.createdBy}
              endDate={formatedEndDate}
            rating={(event.communityRating * 1 ).toFixed(1)}
            />
          );
        }
      });
    } else {
      return <YouHaveNoEventComing msgText="You have no event coming at all" />;
    }
  };

  const renderAllRegisteredEvents = () => {
    if (registeredInEvents.length !== 0) {
      return registeredInEvents.map((event) => {
        const now = new Date(event.startDate);
        const end = new Date(event.endDate);
        const formatedDate = dateFormat(now, "mmm dS, h:MM TT");
        const formatedEndDate = dateFormat(end,"mmm dS, h:MM TT" );

        return (
          <EventCard
            image={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
            date={formatedDate}
            key={event.id}
            eventName={event.eventName}
            minPrice={event.minTicketPrice}
            maxPrice={event.maxTicketPrice}
            id={event.id}
            showBtn={true}
            communityId={event.createdBy}
            endDate={formatedEndDate}
            rating={(event.communityRating * 1 ).toFixed(1)}
          />
        );
      });
    } else {
      return <YouHaveNoEventComing msgText="You have no event coming at all" />;
    }
  };

  

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        <Tab label="All" {...a11yProps(0)} />
        <Tab label="This Week" {...a11yProps(1)} />
        <Tab label="This Month" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="user-account-home-event-card-grid px-2 py-2">
          {renderAllRegisteredEvents()}
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className="user-account-home-event-card-grid px-2 py-2">
          {renderThisWeekRegisteredEvents()}
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <div className="user-account-home-event-card-grid px-2 py-2">
          {renderThisMonthRegisteredEvents()}
        </div>
      </TabPanel>
    </div>
  );
}
