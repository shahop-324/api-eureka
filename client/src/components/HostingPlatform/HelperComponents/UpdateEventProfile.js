/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "./../Styles/UpdateEventProfile.scss";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ArrowBackIosRoundedIcon from "@material-ui/icons/ArrowBackIosRounded";
import Faker from "faker";
import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import { connect, useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";
import Select from "react-select";
import ScheduleOneToOneCallForm from "../SideDrawerComponents/Chat/Sub/ScheduleOneToOneCallForm";
import Ripple from "../../ActiveStatusRipple";

import LinkedInIcon from "@material-ui/icons/LinkedIn";
import TwitterIcon from "@material-ui/icons/Twitter";
import FacebookIcon from "@material-ui/icons/Facebook";
import Instagram from "@material-ui/icons/Instagram";
import { Divider } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import LanguageIcon from '@material-ui/icons/Language';

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Chip from "@material-ui/core/Chip";

const options = [
  { value: "Technology", label: "Technology" },
  { value: "Education", label: "Education" },
  { value: "Lifestyle", label: "Lifestyle" },
  { value: "Professional Development", label: "Professional Development" },
  { value: "Arts and crafts", label: "Arts and crafts" },
  {
    value: "Business & Enterpreneurship",
    label: "Business & Enterpreneurship",
  },
  { value: "Job Search", label: "Job Search" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Health", label: "Health" },
  { value: "Crypto", label: "Crypto" },
  { value: "Web Security", label: "Web Security" },
];

// const useStyles = makeStyles((theme) => ({

// }));

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
const renderTextArea = ({
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
      <textarea
        rows="3"
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    width: "100%",
    display: "flex",
    minHeight: "76.5vh",
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: "auto",
  },
  paper: {
    // background: "blue",
    // color: "blue"
  },
}));

const RoyalBlueSwitch = withStyles({
  switchBase: {
    color: "#538BF7",
    "&$checked": {
      color: "#3474F3",
    },
    "&$checked + $track": {
      backgroundColor: "#145DF0",
    },
  },
  checked: {},
  track: {},
})(Switch);

const UpdateEventProfile = ({
  openDrawer,
  handleCloseDrawer,
  handleSubmit,
}) => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  const { userDetails } = useSelector((state) => state.user);
  let imgKey;
  if (userDetails) {
    imgKey = userDetails.image;
  }

  let imgUrl;

  if (imgKey) {
    if (imgKey && !imgKey.startsWith("https://")) {
      imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
    } else {
      imgUrl = imgKey;
    }
  }

  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(Faker.image.avatar());

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  const onSubmit = (formValues) => {
    console.log(formValues);
  };

  return (
    <>
      <React.Fragment key="right">
        <SwipeableDrawer
        onOpen={() => {
          console.log("Side nav was opended")
        }}
        onClose={() => {
          console.log("Side nav was closed")
        }}
          anchor="right"
          open={openDrawer}
          disableBackdropTransition={true}
          className={classes.paper}
        >
          <div className="update-event-profile p-4">
            <div className="d-flex flex-row align-items-center justify-content-between">
              <IconButton
                onClick={() => {
                  handleCloseDrawer();
                }}
              >
                <ArrowBackIosRoundedIcon className="icon-btn" />
              </IconButton>
            </div>

            <div className="profile-update-preview-grid">
              <div>
                <form
                  className="ui form error"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="row edit-profile-form-row d-flex align-items-center justify-content-center mb-4">
                    <div className="p-0 d-flex flex-row justify-content-center">
                      <Avatar
                        variant="rounded"
                        alt={userDetails.firstName}
                        src={fileToPreview}
                        className={classes.large}
                      />
                    </div>
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      Avatar
                    </label>
                    <input
                      name="imgUpload"
                      type="file"
                      accept="image/*"
                      onChange={onFileChange}
                      className="form-control"
                    />
                  </div>

                  <div
                    className="row edit-profile-form-row mb-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridGap: "16px",
                    }}
                  >
                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        First name
                      </label>

                      <Field
                        name="firstName"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="John"
                        label="First Name"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        Last name
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="Doe"
                        label="Last Name"
                      />
                    </div>
                  </div>

                  <div className="row edit-profile-form-row mb-3">
                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        Headline
                      </label>
                      <Field
                        name="headline"
                        type="text"
                        classes="form-control"
                        component={renderTextArea}
                        aria-describedby="emailHelp"
                        placeholder="Hi there! "
                        label="Headline"
                      />
                    </div>
                  </div>

                  <div
                    className="row edit-profile-form-row mb-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridGap: "16px",
                    }}
                  >
                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        City
                      </label>

                      <Field
                        name="city"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        // placeholder="John"
                        label="city"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        Country
                      </label>
                      <Field
                        name="country"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        // placeholder="Doe"
                        label="country"
                      />
                    </div>
                  </div>

                  <div
                    className="row edit-profile-form-row mb-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridGap: "16px",
                    }}
                  >
                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        Organisation
                      </label>

                      <Field
                        name="city"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        // placeholder="John"
                        label="organisation"
                      />
                    </div>

                    <div className="form-group">
                      <label
                        for="communityHeadline"
                        className="form-label ui-form-label"
                      >
                        Designation
                      </label>
                      <Field
                        name="designation"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        // placeholder="Doe"
                        label="designation"
                      />
                    </div>
                  </div>

                  <div className="row edit-profile-form-row mb-3">
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      Interests
                    </label>
                    <Field
                      name="interests"
                      component={renderEventPreferences}
                      label="Event Preferences"
                    />
                  </div>

                  <div className="row edit-profile-form-row mb-3">
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      Facebook
                    </label>
                    <div className="form-group">
                      <Field
                        name="facebook"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="www.facebook.com/JohnDoe"
                        label="facebook"
                      />
                    </div>
                  </div>
                  <div className="row edit-profile-form-row mb-3">
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      LinkedIn
                    </label>
                    <div className="form-group">
                      <Field
                        name="facebook"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="www.linkedin.com/in/JohnDoe"
                        label="linkedin"
                      />
                    </div>
                  </div>
                  <div className="row edit-profile-form-row mb-3">
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      Twitter
                    </label>
                    <div className="form-group">
                      <Field
                        name="twitter"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="www.twitter.com/JohnDoe"
                        label="twitter"
                      />
                    </div>
                  </div>
                  <div className="row edit-profile-form-row mb-3">
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      Instagram
                    </label>
                    <div className="form-group">
                      <Field
                        name="instagram"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="www.instagram.com/JohnDoe"
                        label="instagram"
                      />
                    </div>
                  </div>
                  <div className="row edit-profile-form-row mb-3">
                    <label
                      for="communityHeadline"
                      className="form-label ui-form-label"
                    >
                      Website
                    </label>
                    <div className="form-group">
                      <Field
                        name="website"
                        type="text"
                        classes="form-control"
                        component={renderInput}
                        ariadescribedby="emailHelp"
                        placeholder="www.myDomain.com/"
                        label="website"
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/*  */}
              <div className="vertical-divider"></div>

              {/*  */}
              <div>
                <div
                  className="people-profile-container"
                  style={{ maxWidth: "300" }}
                >
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <span
                      style={{
                        fontWeight: "600",
                        fontSize: "1.05rem",
                        color: "#212121",
                      }}
                    >
                      Profile
                    </span>
                    {/* <IconButton
              // onClick={() => {
              //   handleCloseDrawer();
              //   handleClose();
              // }}
            >
              <HighlightOffRoundedIcon />
            </IconButton> */}
                  </div>

                  <div>
                    <hr />
                  </div>

                  <div className="" style={{ width: "100%" }}>
                    <div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 5fr 1fr",
                          gridGap: "24px",
                        }}
                        className="mb-3"
                      >
                        <Avatar
                          alt={Faker.name.findName()}
                          src={Faker.image.avatar()}
                          className={`${classes.large} mb-3`}
                          variant="rounded"
                          // style={{ marginLeft: "auto", marginRight: "auto" }}
                        />
                        <div>
                          <div className="btn-outline-text mb-2">
                            {Faker.name.findName()}
                          </div>

                          <div
                            style={{
                              fontWeight: "500",
                              color: "#3B3B3B",
                              fontSize: "0.8rem",
                              // textAlign: "center",
                            }}
                            className="mb-2"
                          >
                            Product Manager, Evenz
                          </div>
                          <div
                            style={{
                              fontWeight: "500",
                              color: "#3B3B3B",
                              fontSize: "0.8rem",
                              // textAlign: "center",
                            }}
                            className="mb-3"
                          >
                            Mountain View California, USA
                          </div>

                          <div
                            className="d-flex flex-row align-items-center event-field-label field-label-value"
                            style={{
                              color: "#75BF72",
                              fontFamily: "Ubuntu",
                              fontSize: "0.8rem",
                            }}
                          >
                            <Ripple /> Active{" "}
                          </div>
                        </div>

                        {/* <div
                  style={{
                    backgroundColor: "#94949436",
                    width: "fit-content",
                    borderRadius: "5px",
                    alignSelf: "center",
                  }}
                  className="px-2 py-2"
                >
                  <ChatBubbleRoundedIcon className="chat-msg-hover-icon" />
                </div> */}
                        <div></div>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 5fr 1fr",
                          gridGap: "24px",
                        }}
                      >
                        <div></div>

                        <div className="ms-4">
                          <div
                            style={{
                              fontWeight: "500",
                              fontFamily: "Ubuntu",
                              color: "#212121",
                              fontSize: "0.95rem",
                            }}
                            className={"mb-3"}
                          >
                            Headline
                          </div>

                          <div
                            style={{
                              fontWeight: "400",
                              fontFamily: "Ubuntu",
                              color: "#4D4D4D",
                              fontSize: "0.9rem",
                            }}
                          >
                            Hi there! I am attending evenz event.
                          </div>
                        </div>
                        <div></div>
                        <div></div>
                        <div className="ms-4">
                          <div
                            style={{
                              fontWeight: "500",
                              fontFamily: "Ubuntu",
                              color: "#212121",
                              fontSize: "0.95rem",
                            }}
                            className={"mb-3"}
                          >
                            Interests
                          </div>

                          <div
                            style={{
                              fontWeight: "400",
                              fontFamily: "Ubuntu",
                              color: "#4D4D4D",
                              fontSize: "0.9rem",
                            }}
                          >
                            <Chip
                              label="Music"
                              variant="outlined"
                              className="me-2 mb-2"
                              style={{
                                color: "#538BF7",
                                border: "1px solid #538BF7",
                              }}
                            />
                            <Chip
                              label="Web Design"
                              variant="outlined"
                              className="me-2 mb-2"
                              style={{
                                color: "#538BF7",
                                border: "1px solid #538BF7",
                              }}
                            />
                            <Chip
                              label="Entreprenuership"
                              variant="outlined"
                              className="me-2 mb-2"
                              style={{
                                color: "#538BF7",
                                border: "1px solid #538BF7",
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center justify-content-center mb-3">
                        <div className="shareon-icon p-3 me-3">
                          <a
                            href="https://www.facebook.com/pages/?category=your_pages&ref=bookmarks"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div
                              style={{
                                backgroundColor: "#EBEBEBE8",
                                width: "fit-content",
                                borderRadius: "5px",
                                alignSelf: "center",
                              }}
                              className="px-2 py-2"
                            >
                              <FacebookIcon
                                style={{ fontSize: "21", fill: "#1760A8" }}
                              />

                              {/* <ChatBubbleRoundedIcon className="chat-msg-hover-icon" /> */}
                            </div>
                          </a>
                        </div>
                        <div className="shareon-icon p-3 me-3">
                          <a
                            href="https://www.linkedin.com/company/evenz-in"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div
                              style={{
                                backgroundColor: "#EBEBEBE8",
                                width: "fit-content",
                                borderRadius: "5px",
                                alignSelf: "center",
                              }}
                              className="px-2 py-2"
                            >
                              <LinkedInIcon
                                style={{ fontSize: "21", fill: "#2565A5" }}
                              />

                              {/* <ChatBubbleRoundedIcon className="chat-msg-hover-icon" /> */}
                            </div>
                          </a>
                        </div>

                        <div className="shareon-icon p-3 me-3">
                          <a
                            href="https://twitter.com/EvenzOfficial"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div
                              style={{
                                backgroundColor: "#EBEBEBE8",
                                width: "fit-content",
                                borderRadius: "5px",
                                alignSelf: "center",
                              }}
                              className="px-2 py-2"
                            >
                              <TwitterIcon
                                style={{ fontSize: "21", fill: "#539FF7" }}
                              />

                              {/* <ChatBubbleRoundedIcon className="chat-msg-hover-icon" /> */}
                            </div>
                          </a>
                        </div>

                        <div className="shareon-icon p-3 me-3">
                          <a
                            href="https://www.instagram.com/evenzofficial/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div
                              style={{
                                backgroundColor: "#EBEBEBE8",
                                width: "fit-content",
                                borderRadius: "5px",
                                alignSelf: "center",
                              }}
                              className="px-2 py-2"
                            >
                              <Instagram
                                style={{ fontSize: "21", fill: "#841E8D" }}
                              />

                              {/* <ChatBubbleRoundedIcon className="chat-msg-hover-icon" /> */}
                            </div>
                            
                          </a>
                        </div>

                        <div className="shareon-icon p-3 me-3">
                          <a
                            href="https://www.instagram.com/evenzofficial/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div
                              style={{
                                backgroundColor: "#EBEBEBE8",
                                width: "fit-content",
                                borderRadius: "5px",
                                alignSelf: "center",
                              }}
                              className="px-2 py-2"
                            >
                              <LanguageIcon
                                style={{ fontSize: "21", fill: "#538BF7" }}
                              />

                              {/* <ChatBubbleRoundedIcon className="chat-msg-hover-icon" /> */}
                            </div>
                            
                          </a>
                        </div>
                      </div>

                      {/* <div>
                <button className="btn btn-outline-primary btn-outline-text me-3">
                  Schedule a meet
                </button>
                <button className="btn btn-primary btn-outline-text">
                  Start conversation
                </button>
              </div> */}

                      {/* <div>
                  <div
                    className=""
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridGap: "20px",
                    }}
                  >
                    
                    <div className="mb-3">
                      <button
                        style={{ width: "100%" }}
                        className="btn btn-primary btn-outline-text"
                      >
                        Start instant meet
                      </button>
                    </div>

                    
                    <div className="mb-3">
                      <button
                        onClick={() => {
                          handleOpen();
                        }}
                        style={{ width: "100%" }}
                        className="btn btn-outline-primary btn-outline-text"
                      >
                        Schedule for later
                      </button>
                    </div>
                  </div>
                </div> */}

                      <ScheduleOneToOneCallForm
                        handleCloseDrawer={handleClose}
                        openDrawer={open}
                      />
                    </div>
                  </div>

                  <div>
                    <hr />
                  </div>

                  <div className="d-flex flex-column mb-4">
                    <div className="event-platform-side-drawer-heading">
                      Manage Permissions
                    </div>
                    <div className="setting-tab-sub-text">
                      Here you can choose to enable/disable private/group meet
                      and chats.
                    </div>
                  </div>

                  <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                    <div className="hosting-platform-widget-name">
                      Private chat
                    </div>

                    <div className="d-flex flex-column justify-content-center align-items-center">
                      {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">Disable</div> */}
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <RoyalBlueSwitch
                              checked={checked}
                              onChange={handleChange}
                              name="mailchimpSwitch"
                            />
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className="my-3">
                    <Divider />
                  </div>
                  <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                    <div className="hosting-platform-widget-name">
                      Private Meetings
                    </div>

                    <div>
                      {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">hide</div> */}
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <RoyalBlueSwitch
                              checked={checked}
                              onChange={handleChange}
                              name="mailchimpSwitch"
                            />
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                  <div className="my-3">
                    <Divider />
                  </div>
                  <div className="event-widget-show-hide d-flex flex-row align-items-center justify-content-between">
                    <div className="hosting-platform-widget-name">
                      Group Meetings
                    </div>

                    <div className="d-flex flex-column justify-content-center">
                      <FormGroup row>
                        <FormControlLabel
                          control={
                            <RoyalBlueSwitch
                              checked={checked}
                              onChange={handleChange}
                              name="mailchimpSwitch"
                            />
                          }
                        />
                      </FormGroup>
                      {/* <VisibilityOffIcon className="icon-btn" />
                    <div className="show-hide-text">hide</div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};

// export default UpdateEventProfile;

const mapStateToProps = (state) => ({
  // console.log(state.user.userDetails);
  initialValues: {
    imgUrl: state.user.userDetails.image
      ? `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${state.user.userDetails.image}`
      : " #",
    firstName: state.user.userDetails.firstName
      ? state.user.userDetails.firstName
      : "",
    lastName: state.user.userDetails.lastName
      ? state.user.userDetails.lastName
      : "",
    email: state.user.userDetails.email ? state.user.userDetails.email : "",

    interests: state.user.userDetails.interests
      ? state.user.userDetails.interests.map((interest) => {
          return { value: interest, label: interest };
        })
      : "",

    linkedin:
      state.user.userDetails.socialMediaHandles &&
      state.user.userDetails.socialMediaHandles.linkedin
        ? state.user.userDetails.socialMediaHandles.linkedin
        : "",
    facebook:
      state.user.userDetails.socialMediaHandles &&
      state.user.userDetails.socialMediaHandles.facebook
        ? state.user.userDetails.socialMediaHandles.facebook
        : "",
    twitter:
      state.user.userDetails.socialMediaHandles &&
      state.user.userDetails.socialMediaHandles.twitter
        ? state.user.userDetails.socialMediaHandles.twitter
        : "",
    website:
      state.user.userDetails.socialMediaHandles &&
      state.user.userDetails.socialMediaHandles.website
        ? state.user.userDetails.socialMediaHandles.website
        : "",
    phoneNumber: state.user.userDetails.phoneNumber
      ? state.user.userDetails.phoneNumber
      : "",

    headline: state.user.userDetails.headline
      ? state.user.userDetails.headline
      : "",
  },
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "updateEventProfile",

    // validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(UpdateEventProfile)
);
