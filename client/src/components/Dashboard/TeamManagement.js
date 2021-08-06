import React from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import Divider from "@material-ui/core/Divider";
// import CustomPagination from "./HelperComponent/Pagination";
import InputBase from "@material-ui/core/InputBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import TeamMembersListFields from "./HelperComponent/TeamMembersListFields";
import TeamMembersDetailsCard from "./HelperComponent/TeamMembersDetailsCard";
import HowManyMembersCanBeAddedMsg from "./HelperComponent/HowManyMembersCanbeAddedMsg";

import { IconButton } from "@material-ui/core";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

import { Field } from "redux-form";
import Select from "react-select";

import { useDispatch } from "react-redux";


import { reduxForm } from "redux-form";
import { createNewInvitation } from "../../actions";

const options = [
  { value: "MP000", label: "Assign all permissons" },
  { value: "MP001", label: "Add another member" },
  { value: "MP002", label: "View Transactions" },
  { value: "MP003", label: "Create Payout Link" },
  { value: "MP004", label: "Add Speakers" },
  { value: "MP005", label: "Add Booths" },
  { value: "MP006", label: "Add Sessions" },
  { value: "MP007", label: "Add New Ticket" },
  { value: "MP008", label: "View attendees details" },
  { value: "MP009", label: "Setup RTMP & Live Streaming" },
  { value: "MP0010", label: "View analytics data" },
  { value: "MP0011", label: "Export analytics data" },
  { value: "MP0012", label: "Customize and send attendee emails" },
  { value: "MP0013", label: "Customize and send booth emails" },
  { value: "MP0014", label: "Customize and send speaker emails" },
  { value: "MP0015", label: "change networking settings" },
  { value: "MP0016", label: "Setup Integrations" },
  { value: "MP0017", label: "add sponsors" },
  { value: "MP0018", label: "Publish events" },
  { value: "MP0019", label: "Create new event" },
  { value: "MP0020", label: "Change Billing Plan" },
  { value: "MP0021", label: "Reply to users queries" },
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

const renderError = ({ error, touched }) => {
  if (touched && error) {
    return (
      <div className="ui error message">
        <div className="header">{error}</div>
      </div>
    );
  }
};

const renderInput = ({
  input,
  meta,
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {renderError(meta)}
    </div>
  );
};

const renderEventPreferences = ({
  input,
  meta: { touched, error, warning },
  name,
}) => (
  <div>
    <div>
      <Select
        isMulti
        styles={styles}
        className="basic-multi-select"
        classNamePrefix="select"
        name={name}
        options={options}
        value={input.value}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
      />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);
const showResults = (formValues) => {
  
  // await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};


const TeamManagement = (props) => {
  const dispatch = useDispatch();
  const { handleSubmit, pristine, submitting } = props;

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const classes = useStyles();

  const handleAddNewMember = () => {
    setOpenDrawer(true);
  };

  const onSubmit = (formValues) => {
    console.log(formValues);
    const ModifiedformValues = {};
  
    ModifiedformValues.email = formValues.email;
  
    ModifiedformValues.permissions = formValues.permissions.map((object) => {
      return object.value;
    })
  
    dispatch(createNewInvitation(ModifiedformValues));
    showResults(ModifiedformValues);
  };

  return (
    <>
      <div style={{minWidth: "1138px"}}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Members (4)</div>
          <div className="sec-heading-action-button d-flex flex-row">
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
              />
            </div>
            <button
              className="btn btn-primary btn-outline-text ms-3"
              onClick={handleAddNewMember}
            >
              Add New Member
            </button>
          </div>
        </div>
        <div className="event-management-content-grid px-3 mx-3 mb-4 py-4">
          <TeamMembersListFields />
          <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
            <Divider />
          </div>
          <TeamMembersDetailsCard />
          <TeamMembersDetailsCard />
          <TeamMembersDetailsCard />
          <TeamMembersDetailsCard />
          <HowManyMembersCanBeAddedMsg />
        </div>

        {/* <CustomPagination /> */}
      </div>
      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDrawer}>
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Add New Member</div>
              <div
                onClick={() => {
                  setOpenDrawer(false);
                }}
              >
                <IconButton aria-label="close-drawer">
                  <CancelOutlinedIcon
                    style={{ fontSize: "26", color: "#4D4D4D" }}
                  />
                </IconButton>
              </div>
            </div>
            <div className="my-3">
              <hr />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
              <div className="side-drawer-more-details-content-section">
                <div className="row edit-profile-form-row mb-3">
                  <div class="form-group">
                    <label
                      for="communityHeadline"
                      class="form-label form-label-customized"
                    >
                      E-mail
                    </label>
                    <Field
                      name="email"
                      type="email"
                      classes="form-control"
                      component={renderInput}
                      ariadescribedby="emailHelp"
                      placeholder="johndoe@gmail.com"
                      label="Email"
                    />
                  </div>
                </div>

                <div className="row edit-profile-form-row mb-3">
                  <label
                    for="communityHeadline"
                    class="form-label form-label-customized"
                  >
                    Set Permissions
                  </label>
                  <Field
                    name="permissions"
                    component={renderEventPreferences}
                    // label="Event Preferences"
                  />
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%" }}
                  disabled={pristine || submitting}
                >
                  Add New Member
                </button>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

export default reduxForm({
  form: "addNewMemberForm",
})(TeamManagement);
