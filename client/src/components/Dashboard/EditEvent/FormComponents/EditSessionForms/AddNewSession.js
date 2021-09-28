/* eslint-disable no-unused-vars */
import React from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";
import Snackbar from "@material-ui/core/Snackbar";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { reduxForm, Field } from "redux-form";
import {
  createSession,
  errorTrackerForCreateSession,
} from "../../../../../actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import MuiAlert from "@material-ui/lab/Alert";
import Loader from "../../../../Loader";
import MultiTagInput from "../../../MultiTagInput";

import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontWeight: "500",
    color: "#757575",
  }),
};

const renderMultiTags = ({ input, meta: { touched, error, warning } }) => {
  const className = `field ${error && touched ? "error" : ""}`;
  return (
    <div className={className}>
      <MultiTagInput input={input} value={input.value} />
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
              {warning}
            </div>
          )))}
    </div>
  );
};

const renderInput = ({
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
      <input
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
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
        rows="2"
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
        placeholder={placeholder}
        required
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
              {warning}
            </div>
          )))}
    </div>
  );
};

const renderReactSelect = ({
  input,
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

const AddNewSession = (props) => {
  let speakerOptions = [];
  const { error, isLoading } = useSelector((state) => state.session);
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const { handleSubmit, pristine, submitting } = props;
  const dispatch = useDispatch();

  const speakers = useSelector((state) => state.speaker.speakers);

  if (speakers) {
    speakerOptions = speakers.map((speaker) => {
      return {
        label: speaker.firstName,
        value: speaker.id,
      };
    });
  }

  const params = useParams();
  const id = params.id;
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };
  const onSubmit = (formValues) => {
    console.log(formValues);
    const speakersArray = [];
    if (formValues.speaker !== undefined)
      for (let element of formValues.speaker) {
        speakersArray.push(element.value);
      }

    console.log(speakersArray);

    const ModifiedFormValues = {};
    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.startDate = formValues.startDate;
    ModifiedFormValues.endDate = formValues.endDate;
    ModifiedFormValues.startTime = `${formValues.startDate}T${formValues.startTime}:00Z`;
    ModifiedFormValues.endTime = `${formValues.endDate}T${formValues.endTime}:00Z`;
    ModifiedFormValues.speakers = speakersArray;

    // console.log(ModifiedFormValues);
    // showResults(ModifiedFormValues);
    dispatch(createSession(ModifiedFormValues, id));
    props.handleClose();
    setState({ open: true, vertical: "top", horizontal: "center" });
  };
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
    return (
      <div
        className="d-flex flex-row align-items-center justify-content-center"
        style={{ width: "100%", height: "80vh" }}
      >
        {" "}
        <Loader />{" "}
      </div>
    );
  }

  if (error) {
    dispatch(errorTrackerForCreateSession());
    alert(error);
    return;
  }

  return (
    <>
      

        <React.Fragment key="right">
        <SwipeableDrawer anchor="right" open={props.open} onOpen={() => {
          console.log("Side nav was opended")
        }}
        onClose={() => {
          console.log("Side nav was closed")
        }}>
        <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-coupon-form px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Add New Session
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
            <div className="mb-4 overlay-form-input-row">
              <label
                Forhtml="eventEndDate"
                className="form-label form-label-customized"
              >
                Session Name
              </label>
              <Field
                name="name"
                type="text"
                classes="form-control"
                id="exampleFormControlInput1"
                placeholder="Structuring Your Bussiness for success"
                component={renderInput}
              />
            </div>
            <div className="mb-4 overlay-form-input-row">
              <label
                Forhtml="eventEndDate"
                className="form-label form-label-customized"
              >
                Short Description
              </label>
              <Field
                name="description"
                type="textarea"
                classes="form-control"
                id="exampleFormControlInput1"
                placeholder="Structuring Your Bussiness for success"
                component={renderTextArea}
              />
            </div>
            <div className="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  Start Date
                </label>
                <Field
                  name="startDate"
                  type="date"
                  value="2021-07-21"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
              <div>
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  Start Time
                </label>
                <Field
                  name="startTime"
                  type="time"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  End Date
                </label>
                <Field
                  name="endDate"
                  type="date"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
              <div>
                <label
                  Forhtml="eventStartDate"
                  className="form-label form-label-customized"
                >
                  End Time
                </label>
                <Field
                  name="endTime"
                  type="time"
                  classes="form-control"
                  component={renderInput}
                />
              </div>
            </div>
            <div className="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
                Speakers
              </label>
              <Field
                name="speaker"
                placeholder="Select speakers"
                styles={styles}
                menuPlacement="top"
                options={speakerOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
            </div>
            <div className="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
                Host
              </label>
              <Field
                name="speaker"
                placeholder="Select host"
                styles={styles}
                menuPlacement="top"
                options={speakerOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
            </div>
            <div className="mb-4 overlay-form-input-row">
              <label
                for="communityName"
                className="form-label form-label-customized"
              >
               Co-host
              </label>
              <Field
                name="speaker"
                placeholder="Select co-host"
                styles={styles}
                menuPlacement="top"
                options={speakerOptions}
                // defaultValue={eventOptions[0]}
                component={renderReactSelect}
              />
            </div>
            
            <div className="mb-3 overlay-form-input-row">
              <label for="tags" className="form-label form-label-customized">
                Tags
              </label>
              <div className="form-group">
                <Field name="multiTags" component={renderMultiTags} />
              </div>
            </div>

            <div style={{ width: "100%" }}>
              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                style={{ width: "100%" }}
                // disabled={pristine || submitting}
              >
                Add New Session
              </button>
            </div>
          </div>
        </form>
        </SwipeableDrawer>
        </React.Fragment>
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity="success">
            New session added successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

const validate = (formValues) => {
  const errors = {};
  console.log(formValues.name);
  if (!formValues.name) {
    errors.name = "Session name is required";
  }
  if (!formValues.description) {
    errors.description = "Description is required";
  }
  if (!formValues.startDate) {
    errors.startDate = "Start date is required";
  }
  if (!formValues.startTime) {
    errors.startTime = "Start time is required";
  }
  if (!formValues.endDate) {
    errors.endDate = "End date is required";
  }
  if (!formValues.endTime) {
    errors.endTime = "End time is required";
  }

  return errors;
};

export default reduxForm({
  form: "newSessionForm",
  validate,
})(AddNewSession);
