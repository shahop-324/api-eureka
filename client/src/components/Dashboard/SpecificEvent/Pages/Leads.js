/* eslint-disable array-callback-return */
import React from "react";
import "./../../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../../assets/Sass/EventManagement.scss";
import "./../../../../assets/Sass/SideNav.scss";
import "./../../../../assets/Sass/TopNav.scss";
import "./../../../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
import CustomPagination from "../../HelperComponent/Pagination";
import Select from "react-select";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import RegistrationsListFields from "../../HelperComponent/RegistrationsListFields";
import RegistrationDetailsCard from "../../HelperComponent/RegistrationDetailsCard";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import AffiliateListFields from "../Data/AffiliateListFields";
import InterestedPeopleListFields from "../Data/InterestedPeopleListFields";
import LeadsListFields from "../Data/LeadsListFields";

const options = [
  { value: "All Tickets", label: "All Tickets" },
  { value: "Early Bird", label: "Early Bird" },
  { value: "All Access Pass", label: "All Access Pass" },
  { value: "VIP Ticket", label: "VIP Ticket" },
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

const Leads = () => {
  const classes = useStyles();
  
  const processRegistrationData = (eventRegistrations) => {
    const processedArray = [];
  
    eventRegistrations.map((communityRegistration) => {
      const array = Object.entries(communityRegistration);
  
      const filtered = array.filter(
        ([key, value]) =>
          key === "userName" ||
          key === "userEmail" ||
          key === "ticketType" ||
          key === "eventName" ||
          key === "userName" ||
          key === "created_by_contact" ||
          key === "razorpayPayId" ||
          key === "createdAt"
      );
  
      const asObject = Object.fromEntries(filtered);
  
      processedArray.push(asObject);
    });
  
    const finalArray = processedArray.map((obj) => Object.values(obj));
  
    return finalArray;
  };
  
  const CreateAndDownloadCSV = (data) => {
      
    var csv = "Event Name,User Name, Email,Contact,Ticket Type,Transaction Id, Date & Time of Registration \n";
    data.forEach(function (row) {
      csv += row.join(",");
      csv += "\n";
    });
  
    console.log(csv);
    var hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = "registrations.csv";
    hiddenElement.click();
  };

  return (
    <>
      <div>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Leads</div>
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
              />
            </div>
            
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<GetAppIcon />}
              style={{ backgroundColor: "#538BF7" }}
              onClick={() => {
                CreateAndDownloadCSV(processRegistrationData());
                console.log(processRegistrationData());
              }}
            >
              Export
            </Button>
            {/* <button className="btn btn-primary btn-outline-text">
                  Create New event
                </button> */}
          </div>
        </div>
        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          {/* <EventListFields /> */}
          <LeadsListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          {/* <RegistrationDetailsCard />
          <RegistrationDetailsCard />
          <RegistrationDetailsCard />
          <RegistrationDetailsCard />
          <RegistrationDetailsCard />
          <RegistrationDetailsCard />
          <RegistrationDetailsCard />
          <RegistrationDetailsCard /> */}
        </div>
        {/* Here I have to use pagination */}
        {/* <CustomPagination /> */}
      </div>
    </>
  );
};

export default Leads;