/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import "./../../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../../assets/Sass/EventManagement.scss";
import "./../../../../assets/Sass/SideNav.scss";
import "./../../../../assets/Sass/TopNav.scss";
import "./../../../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
import InputBase from "@material-ui/core/InputBase";
import { alpha, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { Button } from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import AffiliateListFields from "../Data/AffiliateListFields";
import CreateNewAffiliate from "../Helper/CreateNewAffiliate";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventAffiliates } from "../../../../actions";
import { useParams } from "react-router-dom";
import AffiliateDetailsCard from "../Data/AffiliateDetailsCard";
import NoContentFound from "../../../NoContent";

import NoRegistartions from "./../../../../assets/images/discussing.png";

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

const Affiliate = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;

  const [openAddAffiliateForm, setOpenAddAffiliateForm] = useState(false);

  const handleOpenAddAffiliateForm = () => {
    setOpenAddAffiliateForm(true);
  };

  const handleCloseAddAffiliateForm = () => {
    setOpenAddAffiliateForm(false);
  };

  useEffect(() => {
    dispatch(fetchEventAffiliates(eventId));
  }, []);

  const { affiliates } = useSelector((state) => state.affiliate);

  const renderAffiliatesList = (affiliates) => {
    return affiliates
      .slice(0)
      .reverse()
      .map((affiliate) => {
        return (
          <AffiliateDetailsCard
            id={affiliate._id}
            key={affiliate._id}
            fullName={`${affiliate.firstName} ${affiliate.lastName}`}
            email={affiliate.email}
            commisionValue={affiliate.commisionValue}
            totalAttempts={affiliate.totalAttempts}
            totalLeads={affiliate.totalLeads}
            totalConfirmedTickets={affiliate.totalConfirmedTickets}
            totalCommisionEarned={affiliate.totalCommisionEarned}
          />
        );
      });
  };

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
    var csv =
      "Event Name,User Name, Email,Contact,Ticket Type,Transaction Id, Date & Time of Registration \n";
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
          <div className="sec-heading-text">Affiliates</div>
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
            <button
              onClick={handleOpenAddAffiliateForm}
              className="btn btn-outline-primary btn-outline-text me-3"
            >
              Add New Affiliate
            </button>
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
          </div>
        </div>
        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          {/* <EventListFields /> */}
          <AffiliateListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          {/* Here goes Affiliate Detail card */}
          {typeof affiliates !== "undefined" && affiliates.length > 0 ? (
            renderAffiliatesList(affiliates)
          ) : (
            <NoContentFound
              msgText="You can add and manage affiliates for this event here."
              img={NoRegistartions}
            />
          )}
        </div>
      </div>
      <CreateNewAffiliate
        open={openAddAffiliateForm}
        handleClose={handleCloseAddAffiliateForm}
      />
    </>
  );
};

export default Affiliate;
