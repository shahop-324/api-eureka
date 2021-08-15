import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import "./../../../index.css";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import { makeStyles } from "@material-ui/core/styles";
import "react-phone-input-2/lib/style.css";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { editUser, resetUserError } from "../../../actions";

import { useState } from "react";
import { reduxForm, Field } from "redux-form";

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

const renderPhoneInput = ({
  input,
  meta: { touched, error, warning },
  label,
  type,
}) => (
  <div>
    <div>
      <PhoneInput
        inputStyle={{
          paddingLeft: "50px",
        }}
        inputProps={{
          enableSearch: true,
        }}
        country={"us"}
        {...input}
        type={type}
      />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

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

let EditProfileForm = (props) => {

  const { handleSubmit, pristine, reset, submitting } = props;

  const { error } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  
  const { userDetails } = useSelector((state) => state.user);
  let imgKey;
  if (userDetails) {
    imgKey = userDetails.image;
  }

  let imgUrl;
  if (imgKey && !imgKey.startsWith("https://lh3.googleusercontent.com")) {
    imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
  }
  else {
    imgUrl = imgKey;
  }
  const [file, setFile] = useState(null);
  const [fileToPreview, setFileToPreview] = useState(imgUrl);

  const [editProfileClicked, setEditProfileClicked] = useState(false);

  useEffect(() => {
    dispatch(resetUserError());
    setEditProfileClicked(false);
  }, [dispatch, error]);

 
  const classes = useStyles();
  
  const onSubmit = (formValues) => {
    setEditProfileClicked(true);
    console.log(formValues);

    const ModifiedFormValues = {};

    ModifiedFormValues.firstName = formValues.firstName;
    ModifiedFormValues.lastName = formValues.lastName;
    ModifiedFormValues.headline = formValues.headline;
    ModifiedFormValues.phoneNumber = formValues.phoneNumber;
    ModifiedFormValues.email = formValues.email;

    const groupedSocialHandles = {
      facebook: formValues.facebook,
      twitter: formValues.twitter,
      linkedin: formValues.linkedin,
    };

    ModifiedFormValues.socialMediaHandles = groupedSocialHandles;

    const modifiedInterests = [];

    if (formValues.interests) {
      for (let element of formValues.interests) {
        modifiedInterests.push(element.value);
      }
    }

    ModifiedFormValues.interests = modifiedInterests;

    console.log(ModifiedFormValues);
    console.log(file);
    dispatch(editUser(ModifiedFormValues, file));
  };

  const onFileChange = (event) => {
    console.log(event.target.files[0]);
    setFile(event.target.files[0]);
    setFileToPreview(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <>
      <div className="user-account-edit-profile px-2 py-2">
        <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
          <div className="row edit-profile-form-row d-flex align-items-center justify-content-center mb-4">
            <div className="p-0 d-flex flex-row justify-content-center">
              <Avatar
                variant="rounded"
                alt={"Travis Howard"}
                src={fileToPreview}
                className={classes.large}
              />
            </div>
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
          <div
            className="row edit-profile-form-row mb-3"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: "24px",
            }}
          >
            <div class="form-group">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
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

            <div class="form-group">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
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
            <div class="form-group">
              <label
                for="communityHeadline"
                class="form-label form-label-customized"
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

          <div
            className="row edit-profile-form-row mb-3"
            style={{ width: "100%" }}
          >
            <label
              for="communityHeadline"
              class="form-label form-label-customized"
            >
              contact Number
            </label>
            <Field
              name="phoneNumber"
              component={renderPhoneInput}
              type="number"
            />
          </div>
          <div className="row edit-profile-form-row mb-3">
            <label
              for="communityHeadline"
              class="form-label form-label-customized"
            >
              Event Preferences
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
              class="form-label form-label-customized"
            >
              LinkedIn
            </label>
            <div class="form-group">
              <Field
                name="linkedin"
                type="text"
                classes="form-control"
                component={renderInput}
                ariadescribedby="emailHelp"
                placeholder="www.linkedIn.com/in/JohnDoe/ or JohnDoe"
                label="Linkedin"
              />
            </div>
          </div>

          <div className="row edit-profile-form-row mb-3">
            <label
              for="communityHeadline"
              class="form-label form-label-customized"
            >
              Facebook
            </label>
            <div class="form-group">
              <Field
                name="facebook"
                type="text"
                classes="form-control"
                component={renderInput}
                ariadescribedby="emailHelp"
                placeholder="www.facebook.com/in/JohnDoe/ or JohnDoe"
                label="Facebook"
              />
            </div>
          </div>

          <div className="row edit-profile-form-row mb-3">
            <label
              for="communityHeadline"
              class="form-label form-label-customized"
            >
              Twitter
            </label>
            <div class="form-group">
              <Field
                name="twitter"
                type="text"
                classes="form-control"
                component={renderInput}
                ariadescribedby="emailHelp"
                placeholder="www.twitter.com/in/JohnDoe/ or JohnDoe"
                label="Twitter"
              />
            </div>
          </div>

          <div className="row edit-profile-form-row mb-5">
            <label
              for="communityHeadline"
              class="form-label form-label-customized"
            >
              Website
            </label>
            <div class="form-group">
              <Field
                name="website"
                type="text"
                classes="form-control"
                component={renderInput}
                ariadescribedby="emailHelp"
                placeholder="www.myDomain.com"
                label="Website"
              />
            </div>
          </div>

          <div className="row edit-profile-form-row mb-3 d-flex flex-row justify-content-end">
            <button
              type="submit"
              disabled={editProfileClicked && !error}
              // disabled={pristine}
              className="col-3 btn btn-primary btn-outline-text me-3"
              style={{ textAlign: "center" }}
            >
              Save Changes
            </button>
            <button
              type="button"
              disabled={pristine || submitting}
              onClick={reset}
              className="col-3 btn btn-outline-primary btn-outline-text me-3"
              style={{ textAlign: "center" }}
            >
              Discard Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

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
    form: "editProfile",

    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(EditProfileForm)
);
