import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Dialog from "@material-ui/core/Dialog";

import List from "@material-ui/core/List";
import "./../../../assets/css/style.css";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { createQuery } from "../../../actions";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

import MuiAccordion from "@material-ui/core/Accordion";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import MuiAccordionDetails from "@material-ui/core/AccordionDetails";
import TicketForm from "../FormComponent/TicketForm";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StickyFooter = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const [expanded, setExpanded] = React.useState("panel1");

  const [queryText, setQueryText] = React.useState("");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const params = useParams();
  const id = params.id;
  console.log(id);

  const { userDetails } = useSelector((state) => state.user);

  let event = useSelector((state) => {
    return state.event.events.find((event) => {
      return event.id === id;
    });
  });

  const isSignedIn = useSelector((state) => state.auth.isSignedIn);

  const handleQueryText = (event) => {
    setQueryText(event.target.value);
  };

  const handleAskQuery = () => {
    const formValues = {};
    formValues.createdBy = userDetails.id;
    formValues.userName = `${userDetails.firstName} ${userDetails.lastName}`;
    formValues.userImg = userDetails.image;
    formValues.createdForEventId = id;
    formValues.questionText = queryText;

    console.log(formValues);

    dispatch(createQuery(formValues));

    // setState({ openSuccess: true, vertical: "top", horizontal: "center" });
  };

  const [openFAQ, setOpenFAQ] = useState(false);
  const [openTickets, setOpenTickets] = useState(false);

  const handleOpenFAQs = () => {
    setOpenFAQ(true);
  };
  const handleCloseFAQs = () => {
    setOpenFAQ(false);
  };
  const handleOpenTickets = () => {
    setOpenTickets(true);
  };
  const handleCloseTickets = () => {
    setOpenTickets(false);
  };

  return (
    <>
      <div
        className={`sticky-landing-page-buttons-container p-4 d-flex flex-row justify-content-end sticky-footer`}
        style={{ borderBottom: "1px solid #212121" }}
      >
        <div
          className="share-and-ticket-btn-container"
          style={{ maxWidth: "520px", width: "100%" }}
        >
          <button
            className="btn btn-outline-primary btn-outline-text FAQs"
            style={{ width: "100%", maxWidth: "250px", fontSize: "1rem" }}
            onClick={handleOpenFAQs}
          >
            FAQs & Share
          </button>
          <button
            className="btn btn-primary btn-outline-text buy-tickets"
            style={{ width: "100%", maxWidth: "250px", fontSize: "1rem" }}
            onClick={handleOpenTickets}
          >
            Buy Ticket
          </button>
        </div>
      </div>

      <Dialog
        fullScreen
        open={openFAQ}
        onClose={handleCloseFAQs}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar style={{ backgroundColor: "#538BF7" }}>
            <Typography variant="h6" className={classes.title}>
              FAQs
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseFAQs}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <List>
          <div
            className="got-a-coupon-code mb-3 px-4 pt-3"
            style={{ fontWeight: "500", fontFamily: "Inter" }}
          >
            Some question you might have?
          </div>
          <div className={`${classes.root} d-flex flex-column px-4`}>
            <MuiAccordion
              square
              expanded={expanded === "panel1"}
              onChange={handleChange("panel1")}
            >
              <MuiAccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
              >
                <Typography>
                  Can I get to interact with other attendees in this event?
                </Typography>
              </MuiAccordionSummary>
              <MuiAccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </MuiAccordionDetails>
            </MuiAccordion>
            <MuiAccordion
              square
              expanded={expanded === "panel2"}
              onChange={handleChange("panel2")}
            >
              <MuiAccordionSummary
                aria-controls="panel2d-content"
                id="panel2d-header"
              >
                <Typography>
                  Can I get session replays if i miss any session?
                </Typography>
              </MuiAccordionSummary>
              <MuiAccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </MuiAccordionDetails>
            </MuiAccordion>
            <MuiAccordion
              square
              expanded={expanded === "panel3"}
              onChange={handleChange("panel3")}
            >
              <MuiAccordionSummary
                aria-controls="panel3d-content"
                id="panel3d-header"
              >
                <Typography>
                  Will I get to participate in booths in this event?
                </Typography>
              </MuiAccordionSummary>
              <MuiAccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
              </MuiAccordionDetails>
            </MuiAccordion>
          </div>

          <div className="mb-4 px-4">
            <div
              className="got-a-coupon-code mb-3 mt-3"
              style={{ fontWeight: "500", fontFamily: "Inter" }}
            >
              Still have any queries before making call?
            </div>
            <form
              // className="form-inline my-2 my-lg-0 d-flex flex-row mb-5 px-5"
              style={{ width: "100%" }}
            >
              <div
                className="d-flex flex-column align-items-center justify-content-center"
                style={{ width: "100%" }}
              >
                <div className="d-flex flex-row mb-3" style={{ width: "82%" }}>
                  <input
                    className="form-control mr-sm-2"
                    type="search"
                    value={queryText}
                    placeholder="Your question"
                    aria-label="Search"
                    onChange={handleQueryText}
                  />
                  <button
                    disabled={!isSignedIn}
                    className="btn btn-outline-primary my-2 my-sm-0 btn-outline-text"
                    onClick={handleAskQuery}
                  >
                    Ask
                  </button>
                </div>
                <div>
                  <Link to={`/signin/${id}/?intent=eventRegistration`}>
                    {" "}
                    {isSignedIn ? (
                      <div></div>
                    ) : (
                      <span style={{ color: "#11A1FD" }}>
                        Login to ask query for this event.
                      </span>
                    )}
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </List>
      </Dialog>

      <Dialog
        fullScreen
        open={openTickets}
        onClose={handleCloseTickets}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar style={{ backgroundColor: "#538BF7" }}>
            <Typography variant="h6" className={classes.title}>
              Tickets
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseTickets}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <div className="p-4">
          <TicketForm
            eventId={id}
            tickets={event.tickets}
            coupon={event.coupon}
          />
        </div>
      </Dialog>
    </>
  );
};

export default StickyFooter;
