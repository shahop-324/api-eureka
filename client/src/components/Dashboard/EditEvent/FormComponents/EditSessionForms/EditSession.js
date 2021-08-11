import React from "react";
import dateFormat from "dateformat";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";
import { useEffect } from "react";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { connect, useSelector } from "react-redux";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { reduxForm, Field } from "redux-form";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useDispatch } from "react-redux";
// import { useParams } from "react-router";
import {
  editSession,
  errorTrackerForEditSession,
  fetchParticularSessionOfEvent,
} from "../../../../../actions";
import Loader from "../../../../Loader";

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

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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

const EditSession = (props) => {
  const { handleSubmit, pristine, submitting, reset } = props;
  const { error, isLoading } = useSelector((state) => state.session);
  const dispatch = useDispatch();

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  useEffect(() => {
    dispatch(fetchParticularSessionOfEvent(props.id));
  }, [props.id, dispatch]);
  const speakers = useSelector((state) => state.speaker.speakers);

  const speakerOptions = speakers.map((speaker) => {
    return {
      label: speaker.firstName,
      value: speaker.id,
    };
  });

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const theme = useTheme();

  const onSubmit = (formValues) => {
    const categories = [];

    console.log(categories);
    console.log(formValues);

    const ModifiedFormValues = {};
    ModifiedFormValues.name = formValues.name;
    ModifiedFormValues.description = formValues.description;
    ModifiedFormValues.startDate = formValues.startDate;
    ModifiedFormValues.endDate = formValues.endDate;
    ModifiedFormValues.startTime = `${formValues.startDate}T${formValues.startTime}:00Z`;
    ModifiedFormValues.endTime = `${formValues.endDate}T${formValues.endTime}:00Z`;

    ModifiedFormValues.speaker = formValues.speaker.map((speaker) => {
      return speaker.value;
    });

    console.log(ModifiedFormValues);
    showResults(ModifiedFormValues);
    dispatch(editSession(ModifiedFormValues, props.id));
  };
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
    dispatch(errorTrackerForEditSession());
    alert(error);
    return;
  }
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={props.open}
        aria-labelledby="responsive-dialog-title"
      >
        <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
          <div className="create-new-coupon-form px-4 py-4">
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">
                Edit this Session
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
            <div class="mb-4 overlay-form-input-row">
              <label
                Forhtml="sessionName"
                class="form-label form-label-customized"
              >
                Session Name
              </label>
              <Field
                name="name"
                type="text"
                classes="form-control"
                id="sessionName"
                placeholder="Structuring Your Bussiness for success"
                ariadescribedby="name"
                component={renderInput}
              />
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label
                Forhtml="description"
                class="form-label form-label-customized"
              >
                Short Description
              </label>
              <Field
                name="description"
                type="textarea"
                classes="form-control"
                id="description1"
                // placeholder="Structuring Your Bussiness for success"
                component={renderTextArea}
              />
            </div>
            <div class="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventStartDate"
                  class="form-label form-label-customized"
                >
                  Start Date
                </label>
                <Field
                  name="startDate"
                  type="date"
                  classes="form-control"
                  id="eventStartDate"
                  component={renderInput}
                />
              </div>
              <div>
                <label
                  Forhtml="eventStartTime"
                  class="form-label form-label-customized"
                >
                  Start Time
                </label>
                <Field
                  name="startTime"
                  type="time"
                  classes="form-control"
                  id="eventStartTime"
                  component={renderInput}
                />
              </div>
            </div>
            <div class="mb-4 overlay-form-input-row form-row-2-in-1">
              <div>
                <label
                  Forhtml="eventEndDate"
                  class="form-label form-label-customized"
                >
                  End Date
                </label>
                <Field
                  name="endDate"
                  type="date"
                  classes="form-control"
                  id="eventEndDate"
                  component={renderInput}
                />
              </div>
              <div>
                <label
                  Forhtml="eventEndTime"
                  class="form-label form-label-customized"
                >
                  End Time
                </label>
                <Field
                  name="endTime"
                  type="time"
                  classes="form-control"
                  id="eventEndTime"
                  component={renderInput}
                />
              </div>
            </div>
            <div class="mb-4 overlay-form-input-row">
              <label for="speakers" class="form-label form-label-customized">
                Speakers
              </label>
              <Field
                name="speaker"
                styles={styles}
                menuPlacement="top"
                options={speakerOptions}
                // defaultValue={options[0]}
                id="speakers"
                component={renderReactSelect}
              />
            </div>

            <div
              style={{ width: "100%" }}
              className="d-flex flex-row justify-content-end"
            >
              <button
                className="btn btn-outline-primary btn-outline-text me-3"
                onClick={reset}
                disabled={pristine || submitting}
              >
                Discard
              </button>

              <button
                type="submit"
                className="btn btn-primary btn-outline-text"
                onClick={() => {
                  props.handleClose();
                  setState({
                    open: true,
                    vertical: "top",
                    horizontal: "center",
                  });
                }}
                // disabled={pristine || submitting}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </Dialog>
      <div>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleClose}
          key={vertical + horizontal}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity="success">
            Session updated successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};
const mapStateToProps = (state) => ({
  initialValues: {
    name:
      state.session.sessionDetails && state.session.sessionDetails.name
        ? state.session.sessionDetails.name
        : "",
    description:
      state.session.sessionDetails && state.session.sessionDetails.description
        ? state.session.sessionDetails.description
        : "",

    startDate:
      state.session.sessionDetails && state.session.sessionDetails.startDate
        ? dateFormat(
            new Date(state.session.sessionDetails.startDate),
            "yyyy-mm-dd"
          )
        : "",
    startTime:
      state.session.sessionDetails && state.session.sessionDetails.startTime
        ? dateFormat(new Date(state.session.sessionDetails.startTime), "HH:MM")
        : "",
    endDate:
      state.session.sessionDetails && state.session.sessionDetails.endDate
        ? dateFormat(
            new Date(state.session.sessionDetails.endDate),
            "yyyy-mm-dd"
          )
        : "",
    endTime:
      state.session.sessionDetails && state.session.sessionDetails.endTime
        ? dateFormat(new Date(state.session.sessionDetails.endTime), "HH:MM")
        : "",

    speaker:
      state.session.sessionDetails &&
      state.session.sessionDetails.speaker.length !== 0 &&
      state.session.sessionDetails.speaker.map((element) => {
        return {
          value: element.id,
          label: element.firstName,
        };
      }),
  },
});

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

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditSessionDetails",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditSession)
);
