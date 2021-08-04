import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";

import { makeStyles } from "@material-ui/core/styles";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { reduxForm, Field } from "redux-form";

import { fetchParticularEventOfCommunity } from "../../../../../actions";
import { Divider } from "@material-ui/core";

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

const venueAreaOptions = [
  { value: "Session", label: "Session" },
  { value: "Speed Networking", label: "Speed Networking" },
  { value: "Social Lounge", label: "Social Lounge" },
  { value: "Booths", label: "Booths" },
];

const sessionOptions = [
  { value: "Session - 1", label: "Session - 1" },
  { value: "Session - 2", label: "Session - 2" },
  { value: "Session - 3", label: "Session - 3" },
  { value: "Session - 4", label: "Session - 4" },
];

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

const validate = (values) => {
  const errors = {};

  if (values.firstName && values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }
  if (values.lastName && values.lastName.length > 15) {
    errors.lastName = "Must be 15 characters or less";
  }
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }

  return errors;
};
// const warn = values => {
//   const warnings = {}
//   if (values.age < 19) {
//     warnings.age = 'Hmm, you seem a bit young...'
//   }
//   return warnings
// }
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

const CreateNewPoll = (props) => {
  const { handleSubmit, pristine, submitting, valid, reset } = props;

  const params = useParams();
  const id = params.id;
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();

  const onSubmit = async (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.tagline = formValues.tagline;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.emails = formValues.multiEmail;
    ModifiedFormValues.tags = formValues.multiTags;

    const groupedSocialHandles = {
      facebook: formValues.facebook,
      twitter: formValues.twitter,
      linkedIn: formValues.linkedIn,
      instagram: formValues.instagram,
      website: formValues.website,
    };

    ModifiedFormValues.socialMediaHandles = groupedSocialHandles;

    dispatch(fetchParticularEventOfCommunity(id));

    showResults(ModifiedFormValues);
    props.handleClose();
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className=" px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">Add New Poll</div>
              <div
                className="overlay-form-close-button"
                onClick={props.handleClose}
              >
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div class="mb-3 overlay-form-input-row ">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Question
                </label>
                <Field
                  name="name"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="e.g. How did you got first job?"
                  component={renderInput}
                />
              </div>
            </div>

            <div className="my-3">
              <Divider />
            </div>

            <label
              Forhtml="eventStartDate"
              class="form-label form-label-customized"
            >
              Answer
            </label>

            <div class="mb-3 overlay-form-input-row ">
              <div>
                <Field
                  name="option-1"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Option 1"
                  component={renderInput}
                />
              </div>
            </div>
            <div class="mb-3 overlay-form-input-row ">
              <div>
                <Field
                  name="option-2"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Option 2"
                  component={renderInput}
                />
              </div>
            </div>

            <button
              className="btn btn-outline-secondary btn-outline-text mb-3"
              style={{ width: "100%" }}
              disabled
            >
              Add more option
            </button>

            <div class="mb-3 overlay-form-input-row ">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Time Limit{" "}
                  <div
                    style={{
                      textTransform: "lowercase",
                      display: "inline-block",
                    }}
                  >
                    (in min)
                  </div>
                </label>
                <Field
                  name="time-left"
                  type="number"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="5"
                  component={renderInput}
                />
              </div>
            </div>

            <div style={{ width: "100%" }} className="pb-3">
              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{ width: "100%" }}
                disabled={pristine || submitting}
              >
                Create poll
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default reduxForm({
  form: "CreateNewPollForm",
})(CreateNewPoll);
