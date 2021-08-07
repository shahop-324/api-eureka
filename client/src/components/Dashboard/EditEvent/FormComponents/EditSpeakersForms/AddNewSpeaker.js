/* eslint-disable no-unused-vars */
import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { createSpeaker } from "../../../../../actions";

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
}));

const renderInput = ({
  input,
  meta: { touched, error, warning },
  meta,
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {" "}
              {warning}
            </div>
          )))}
    </div>
  );
};
const renderTextArea = ({
  input,

  meta: { touched, error, warning },
  type,
  ariadescribedby,
  classes,
  placeholder,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <textarea
        type={type}
        rows="2"
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
      />
      {touched &&
        ((error && (
          <div style={{ color: "red", fontWeight: "500" }} className="my-1">
            {error}
          </div>
        )) ||
          (warning && (
            <div
              className="my-1"
              style={{ color: "#8B780D", fontWeight: "500" }}
            >
              {" "}
              {warning}
            </div>
          )))}
    </div>
  );
};

const renderReactSelect = ({
  input,
  meta: { touched, error, warning },
  styles,
  menuPlacement,
  options,
  defaultValue,

  name,
}) => (
  <div>
    <div>
      <Select
        isMulti
        defaultValue={defaultValue}
        styles={styles}
        menuPlacement={menuPlacement}
        name={name}
        options={options}
        value={input.value}
        onChange={(value) => input.onChange(value)}
        onBlur={() => input.onBlur()}
      />
    </div>
  </div>
);
const AddNewSpeaker = (props) => {
  const { handleSubmit, pristine, submitting } = props;

  const params = useParams();
  const id = params.id;
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const sessions = useSelector((state) => state.session.sessions);

  const SessionOptions = sessions.map((session) => {
    return {
      label: session.name,
      value: session.id,
    };
  });

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(null);

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.firstName = formValues.firstName;
    ModifiedFormValues.lastName = formValues.lastName;
    ModifiedFormValues.headline = formValues.headline;
    ModifiedFormValues.phoneNumber = formValues.phoneNumber;
    ModifiedFormValues.email = formValues.email;
    ModifiedFormValues.organisation = formValues.organisation;

    const groupedSocialHandles = {
      facebook: formValues.facebook,
      twitter: formValues.twitter,
      linkedin: formValues.linkedin,
    };

    ModifiedFormValues.socialMediaHandles = groupedSocialHandles;

    const modifiedSessions = [];
    if (formValues.sessions) {
      for (let element of formValues.sessions) {
        modifiedSessions.push(element.value);
      }
    }
    ModifiedFormValues.sessions = modifiedSessions;

    console.log(ModifiedFormValues);

    dispatch(createSpeaker(ModifiedFormValues, file, id));

    showResults(ModifiedFormValues);
    props.handleClose();
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        scroll="paper"
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
          <div
            className="create-new-coupon-form px-4 py-4"
            style={{ minHeight: "100vh" }}
          >
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Add New Speaker
              </div>
              <div
                className="overlay-form-close-button"
                onClick={props.handleClose}
              >
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div className="p-0 d-flex flex-row justify-content-center">
              <Avatar
                children=""
                alt="Travis Howard"
                src={fileToPreview}
                className={classes.large}
              />
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
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

            <div class="mb-3 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  First Name
                </label>
                <Field
                  name="firstName"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="John"
                  component={renderInput}
                />
              </div>
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Last Name
                </label>
                <Field
                  name="lastName"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Doe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Organisation
              </label>
              <div class="form-group">
                <Field
                  name="organisation"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="CEO of App Brewery"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Headline
              </label>
              <div class="form-group">
                <Field
                  name="headline"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Hi there! I am here"
                  component={renderTextArea}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Email
              </label>
              <div class="form-group">
                <Field
                  name="email"
                  type="email"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="johndoe@gmail.com"
                  component={renderInput}
                />
              </div>
            </div>

            <div class="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Select Sessions
              </label>
              <Field
                name="sessions"
                placeholder="Select sessions"
                styles={styles}
                menuPlacement="top"
                options={SessionOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Linkedin
              </label>
              <div class="form-group">
                <Field
                  name="linkedin"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.linkedIn.com/in/JohnDoe/ or JohnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Facebook
              </label>
              <div class="form-group">
                <Field
                  name="facebook"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.facebook.com/in/JohnDoe/ or JohnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Twitter
              </label>
              <div class="form-group">
                <Field
                  name="twitter"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.twitter.com/in/JohnDoe/ or JohnDoe"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                for="communityName"
                class="form-label form-label-customized"
              >
                Website
              </label>
              <div class="form-group">
                <Field
                  name="website"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="www.myDomain.com"
                  component={renderInput}
                />
              </div>
            </div>

            <div style={{ width: "100%" }} className="pb-3">
              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{ width: "100%" }}
                // disabled={pristine || submitting}
              >
                Add New Speaker
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};

  if (!formValues.firstName) {
    errors.firstName = "Required";
  }

  if (!formValues.lastName) {
    errors.lastName = "Required";
  }

  if (!formValues.email) {
    errors.email = "email is required";
  }

  if (
    formValues.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formValues.email)
  ) {
    errors.email = "Invalid Email address";
  }

  if (!formValues.organisation) {
    errors.organisation = "Organisation is required";
  }
  if (!formValues.headline) {
    errors.headline = "Headline is required";
  }

  return errors;
};

export default reduxForm({
  form: "newSpeakerAddForm",
  validate,
})(AddNewSpeaker);
