import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";
import Avatar from "@material-ui/core/Avatar";

import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import { useEffect } from "react";
import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { reduxForm, Field } from "redux-form";
import {
  editSpeaker,
  fetchParticularSpeakerOfEvent,
} from "../../../../../actions";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

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

const renderFileInput = ({
  input,
  meta,
  type,
  ariadescribedby,
  classes,
  onFileChange
}) => {
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div className={className}>
      <input
      onChange={(e) => {
        input.onChange(onFileChange(e))
      }}
      onBlur={input.onBlur()}
        type={type}
        {...input}
        aria-describedby={ariadescribedby}
        className={classes}
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

const renderReactSelect = ({
  input,
  meta: { touched, error, warning },
  styles,
  menuPlacement,
  options,
  defaultValue,

  firstName,
}) => (
  <div>
    <div>
      <Select
        isMulti
        defaultValue={defaultValue}
        styles={styles}
        menuPlacement={menuPlacement}
        firstName={firstName}
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
const EditSpeakerForm = (props) => {
  const { handleSubmit, pristine, submitting, valid, reset } = props;
const params =useParams();
const id =params.id

  const dispatch = useDispatch();

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const event=useSelector((state)=>{
    return state.event.events.find((event)=>{


     return event.id===id
    })


  })
const imgKey = event.image;
  //const imgKey = useSelector((state) => state.speaker.speakerDetails.image);
  let imgUrl = " #";
  if (imgKey) {
    imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
  }

  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  const handleClose = () => {
    setState({ vertical: "top", horizontal: "center", open: false });
  };

  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(imgUrl);

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

    showResults(ModifiedFormValues);
    setState({ vertical: "top", horizontal: "center", open: true });
    dispatch(editSpeaker(ModifiedFormValues, file, props.id));
    console.log(file);
  };

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        scroll="paper"
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            className="create-new-coupon-form px-4 py-4"
            style={{ minHeight: "100vh" }}
          >
            <div className="form-heading-and-close-button mb-4">
              <div></div>
              <div className="coupon-overlay-form-headline">Edit Speaker</div>
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
              {/* <Field
                name="imgUpload"
                type="file"
                accept="image/*"
                onFileChange={onFileChange}
                classes="form-control"
                component={renderFileInput}
              /> */}
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
                isMulti
                placeholder="Select sessions"
                styles={styles}
                menuPlacement="top"
                //options={SessionOptions}
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

            <div
              style={{ width: "100%" }}
              className="d-flex flex-row justify-content-end"
            >
              <button
                className="btn btn-outline-primary btn-outline-text me-3"
                type="button"
                disabled={pristine || submitting}
                onClick={reset}
              >
                Discard
              </button>

              <button
                type="submit"
                disabled={pristine || submitting}
                className="btn btn-primary btn-outline-text"
                onClick={() => {
                  props.handleClose();
                  setState({
                    open: true,
                    vertical: "top",
                    horizontal: "center",
                  });
                }}
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
            Speaker info updated successfully!
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    imgUrl:
      state.speaker.speakerDetails && state.speaker.speakerDetails.image
        ? `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${state.speaker.speakerDetails.image}`
        : " #",
    firstName:
      state.speaker.speakerDetails && state.speaker.speakerDetails.firstName
        ? state.speaker.speakerDetails.firstName
        : "",
    lastName:
      state.speaker.speakerDetails && state.speaker.speakerDetails.lastName
        ? state.speaker.speakerDetails.lastName
        : "",
    email:
      state.speaker.speakerDetails && state.speaker.speakerDetails.email
        ? state.speaker.speakerDetails.email
        : "",
    headline:
      state.speaker.speakerDetails && state.speaker.speakerDetails.headline
        ? state.speaker.speakerDetails.headline
        : "",
    organisation:
      state.speaker.speakerDetails && state.speaker.speakerDetails.organisation
        ? state.speaker.speakerDetails.organisation
        : "",
    sessions:
      state.speaker.speakerDetails &&
      state.speaker.speakerDetails.sessions !== 0 &&
      state.speaker.speakerDetails.sessions.map((element) => {
        return {
          value: element.id,
          label: element.name,
        };
      }),
  },
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "EditSpeakerDetails",
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditSpeakerForm)
);
