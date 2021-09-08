import React from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import PieChartOutlinedIcon from "@material-ui/icons/PieChartOutlined";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import QuestionAnswerOutlinedIcon from "@material-ui/icons/QuestionAnswerOutlined";
import HowToRegOutlinedIcon from "@material-ui/icons/HowToRegOutlined";
import LocalOfferOutlinedIcon from "@material-ui/icons/LocalOfferOutlined";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import SettingsEthernetRoundedIcon from "@material-ui/icons/SettingsEthernetRounded";
import PaymentOutlinedIcon from "@material-ui/icons/PaymentOutlined";
import FeedbackOutlinedIcon from "@material-ui/icons/FeedbackOutlined";
import PeopleOutlinedIcon from "@material-ui/icons/PeopleOutlined";
import ScheduleRoundedIcon from '@material-ui/icons/ScheduleRounded';
import AttachMoneyRoundedIcon from "@material-ui/icons/AttachMoneyRounded";
import { useDispatch } from "react-redux";
import { createCommunityFeedback } from "./../../../actions";

import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SideNav = (props) => {
  const dispatch = useDispatch();
  const handleCloseDrawer = props.handleCloseDrawer;

  const [feedbackText, setFeedbackText] = React.useState(null);

  const [open, setOpen] = React.useState(false);

  const [state, setState] = React.useState({
    openSuccess: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, openSuccess } = state;

  const handleCloseSuccess = () => {
    setState({ vertical: "top", horizontal: "center", openSuccess: false });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <>
      <div className="side-nav-wrapper py-4">
        <div
          onClick={() => {
            props.handleOverviewClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "0" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "0" ? "btn-icon-active-d" : " ")
            }
          >
            <HomeOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "0" ? "btn-text-active-d" : " ")
            }
          >
            Dashboard
          </div>
        </div>

        <div className="sidenav-group-headline ps-4 pe-4 my-4">Management</div>

        <div
          onClick={() => {
            props.handleEventManagementClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "1" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "1" ? "btn-icon-active-d" : " ")
            }
          >
            <PieChartOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "1" ? "btn-text-active-d" : " ")
            }
          >
            Event Management
          </div>
        </div>

        <div
          onClick={() => {
            props.handleReviewsClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "2" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "2" ? "btn-icon-active-d" : " ")
            }
          >
            <RateReviewOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "2" ? "btn-text-active-d" : " ")
            }
          >
            Reviews
          </div>
        </div>

        <div
          onClick={() => {
            props.handleQueriesClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "3" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "3" ? "btn-icon-active-d" : " ")
            }
          >
            <QuestionAnswerOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "3" ? "btn-text-active-d" : " ")
            }
          >
            Queries
          </div>
        </div>

        <div
          onClick={() => {
            props.handleRegistrationsClick();

            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "4" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "4" ? "btn-icon-active-d" : " ")
            }
          >
            <HowToRegOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "4" ? "btn-text-active-d" : " ")
            }
          >
            Registrations
          </div>
        </div>

        <div
          onClick={() => {
            props.handleCouponsClick();

            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "5" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "5" ? "btn-icon-active-d" : " ")
            }
          >
            <LocalOfferOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "5" ? "btn-text-active-d" : " ")
            }
          >
            Coupons
          </div>
        </div>

        <div
          onClick={() => {
            props.handleRecordingsClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "6" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "6" ? "btn-icon-active-d" : " ")
            }
          >
            <VideocamOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "6" ? "btn-text-active-d" : " ")
            }
          >
            Recordings
          </div>
        </div>
        <div
          onClick={() => {
            props.handleIntegrationsClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "7" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "7" ? "btn-icon-active-d" : " ")
            }
          >
            <SettingsEthernetRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "7" ? "btn-text-active-d" : " ")
            }
          >
            Integrations
          </div>
        </div>
        <div
          onClick={() => {
            props.handleSchedulerClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "8" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "8" ? "btn-icon-active-d" : " ")
            }
          >
            <ScheduleRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "8" ? "btn-text-active-d" : " ")
            }
          >
            Scheduler
          </div>
        </div>

        <div className="sidenav-group-headline ps-4 pe-4 my-4">Others</div>

        <div
          onClick={() => {
            props.handleBillingClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "9" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "9" ? "btn-icon-active-d" : " ")
            }
          >
            <PaymentOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "9" ? "btn-text-active-d" : " ")
            }
          >
            Billing
          </div>
        </div>

        <div
          onClick={() => {
            props.handleTeamManagementClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "10" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "10" ? "btn-icon-active-d" : " ")
            }
          >
            <PeopleOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "10" ? "btn-text-active-d" : " ")
            }
          >
            Team Management
          </div>
        </div>

        {/* // ! We don't need to fall in administrative position managing payments for every community. */}

        {/* <div
          onClick={() => {
            props.handleRevenueManagementClick();
            handleCloseDrawer && handleCloseDrawer();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "11" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "11" ? "btn-icon-active-d" : " ")
            }
          >
            <AttachMoneyRoundedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "11" ? "btn-text-active-d" : " ")
            }
          >
            Payouts
          </div>
        </div> */}

        <div
          onClick={() => {
            handleClickOpen();
          }}
          className={
            `dashboard-side-nav-btn px-3 mb-2 d-flex flex-row align-items-center ` +
            (props.activeIndex === "12" ? "btn-active-d" : " ")
          }
        >
          <div
            className={
              "mx-3 sidenav-icon " +
              (props.activeIndex === "12" ? "btn-icon-active-d" : " ")
            }
          >
            <FeedbackOutlinedIcon style={{ fontSize: 26 }} />
          </div>
          <div
            className={
              `mx-3 button-text-dashboard-sidenav ` +
              (props.activeIndex === "12" ? "btn-text-active-d" : " ")
            }
          >
            Feedback
          </div>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            We would love to hear from you. Help us in making this product more
            useful by providing your valuable feedback.
          </DialogContentText>
          <TextField
            multiline="true"
            autoFocus
            margin="dense"
            id="name"
            label="Your feedback"
            type="email"
            fullWidth
            onChange={(e) => setFeedbackText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleClose();
              handleCloseDrawer && handleCloseDrawer();
            }}
            color="primary"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (feedbackText !== null) {
                dispatch(
                  createCommunityFeedback({ feedbackText: feedbackText })
                );
                setState({
                  vertical: "top",
                  horizontal: "center",
                  openSuccess: true,
                });
              }
              handleClose();
              handleCloseDrawer && handleCloseDrawer();
            }}
            color="primary"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openSuccess}
        onClose={handleCloseSuccess}
        autoHideDuration={4000}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          Thanks for providing your valuable feedback! We have recieved it.
        </Alert>
      </Snackbar>
    </>
  );
};

export default SideNav;
