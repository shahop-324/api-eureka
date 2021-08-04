import React, { useState } from "react";

import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Select from "react-select";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import CancelRoundedIcon from "@material-ui/icons/CancelRounded";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { reduxForm, Field } from "redux-form";

import {
  createBooth,
  fetchParticularEventOfCommunity,
} from "../../../../../actions";


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

// const validate = (values) => {
//   const errors = {};

//   if (values.firstName && values.firstName.length > 15) {
//     errors.firstName = "Must be 15 characters or less";
//   }
//   if (values.lastName && values.lastName.length > 15) {
//     errors.lastName = "Must be 15 characters or less";
//   }
//   if (
//     values.email &&
//     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
//   ) {
//     errors.email = "Invalid email address";
//   }

//   return errors;
// };
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
  isMulti,
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
        
        defaultValue={defaultValue}
        styles={styles}
        menuPlacement={menuPlacement}
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

const CreateNewAlert = (props) => {
  const { handleSubmit, pristine, submitting } = props;

  const params = useParams();
  const id = params.id;
  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };
  //   // ! call API HERE
  //  const dispatch=useDispatch()
  //    useEffect(()=>{
  //     dispatch(getAllSessionsOfParticularEvent(id))

  //    },[]);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // const imgKey = useSelector((state) => state.auth.user.image);
  // let imgUrl = " #";
  // if (imgKey) {
  //   imgUrl = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${imgKey}`;
  // }
  const dispatch = useDispatch();

  const [file] = useState(null);
 

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  

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

    dispatch(createBooth(ModifiedFormValues, file, id));

    await sleep(1000);

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
              <div className="coupon-overlay-form-headline">Add New Alert</div>
              <div
                className="overlay-form-close-button"
                onClick={props.handleClose}
              >
                <IconButton aria-label="delete">
                  <CancelRoundedIcon />
                </IconButton>
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Your Message
              </label>
              <div class="form-group">
                <Field
                  name="description"
                  type="text"
                  classes="form-control"
                  ariadescribedby="emailHelp"
                  placeholder="Write your message here ..."
                  component={renderTextArea}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Where do you want audience to go ?
              </label>
              <div class="form-group">
                <Field
                  name="venueAreas"
                  
                  placeholder="venue areas"
                  styles={styles}
                  menuPlacement="top"
                  options={venueAreaOptions}
                  // defaultValue={eventOptions[0]}
                  component={renderReactSelect}
                />
              </div>
            </div>

            <div className="mb-3 overlay-form-input-row">
              <label
                Forhtml="eventStartDate"
                class="form-label form-label-customized"
              >
                Select session
              </label>
              <div class="form-group">
                <Field
                  name="session"
                  
                  placeholder="venue areas"
                  styles={styles}
                  menuPlacement="top"
                  options={sessionOptions}
                  // defaultValue={eventOptions[0]}
                  component={renderReactSelect}
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
                Create alert
              </button>
            </div>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default reduxForm({
  form: "createNewAlertForm",
})(CreateNewAlert);
