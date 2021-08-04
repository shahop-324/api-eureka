import React, { useEffect } from "react";

import "../../../../../assets/Sass/Dashboard_Overview.scss";
import "../../../../../assets/Sass/SideNav.scss";
import "../../../../../assets/Sass/TopNav.scss";
import "../../../../../assets/Sass/DataGrid.scss";
import "../../../../../assets/Sass/EditEvent/Basics.scss";
import "../../../../../assets/Sass/EditEvent/About.scss";
import "../../../../../index.css";
import "../../../../../assets/Sass/EditEvent/Networking.scss";

import Tooltip from "@material-ui/core/Tooltip";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Zoom from "@material-ui/core/Zoom";
import CustomizedSwitchForNetworking from "../../ToggleSwitch";

import { Field } from "redux-form";
import { reduxForm } from "redux-form";
import { connect, useDispatch, useSelector } from "react-redux";
import { editNetworking } from "../../../../../actions";
import { useParams } from "react-router-dom";
import Loader from "../../../../Loader";

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

const renderToggleSwitch = ({ input, meta }) => {
  const className = `field ${meta.error && meta.touched ? "error" : ""}`;
  return (
    <div className={className}>
      <CustomizedSwitchForNetworking input={input} value={input.value} />
      {renderError(meta)}
    </div>
  );
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
        style={{ maxWidth: "250px" }}
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

const NetworkingFormLeft = (props) => {
  const { handleSubmit, pristine, reset, submitting, valid } = props;

  const params = useParams();
  const id = params.id;

  const showResults = (formValues) => {
    // await sleep(500); // simulate server latency
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };

  const dispatch = useDispatch();

  const { networkingSettings, isLoading, error } = useSelector(
    (state) => state.networking
  );

  const onSubmit = (formValues) => {
    console.log(formValues);

    const ModifiedFormValues = {
      networkingSettings: {
        socialLounge: {},
        speedNetworking: {},
        customGroupBasedNetworking: {},
        privateMeetings: {
          enabled:
            networkingSettings && networkingSettings.privateMeetings
              ? networkingSettings.privateMeetings.enabled
              : false,
          maxNoOfParticipants:
            networkingSettings && networkingSettings.privateMeetings
              ? networkingSettings.privateMeetings.maxNoOfParticipants
              : 0,
          timeAllotedPerInteraction:
            networkingSettings && networkingSettings.privateMeetings
              ? networkingSettings.privateMeetings.timeAllotedPerInteraction
              : 0,
        },
      },
    };

    ModifiedFormValues.networkingSettings.socialLounge.enabled =
      formValues.enabledLounge;
    ModifiedFormValues.networkingSettings.socialLounge.numberOfTables =
      formValues.numberOfTablesAvailableLounge;
    ModifiedFormValues.networkingSettings.socialLounge.numberOfSeatsPerTable =
      formValues.numberOfSeatsPerTableLounge;

    ModifiedFormValues.networkingSettings.speedNetworking.enabled =
      formValues.enabledSpeedNetworking;
    ModifiedFormValues.networkingSettings.speedNetworking.timeAllotedPerInteraction =
      formValues.timeAllotedSpeedNetworking;

    ModifiedFormValues.networkingSettings.customGroupBasedNetworking.enabled =
      formValues.enabledGroupBasedNetworking;
    ModifiedFormValues.networkingSettings.customGroupBasedNetworking.timeAllotedPerInteraction =
      formValues.timeAllotedGroupBasedNetworking;

    dispatch(editNetworking(ModifiedFormValues, id));

    showResults(ModifiedFormValues);
  };

  if (error) {
    return <div>{error}</div>
  }

  return (
    <>
      {isLoading ? (
        <div
          className="d-flex flex-row align-items-center justify-content-center"
          style={{ height: "65vh" }}
        >
          <Loader />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="match-based-networking-form">
            <div className="social-lounge-heading d-flex flex-row align-items-center">
              <div className="chart-heading-registrations mb-3 ps-4 pe-3 pt-3">
                Social Lounge
              </div>
              <Tooltip
                title="This is the area where your participants can meet each other in a virtual table seat arrangement."
                TransitionComponent={Zoom}
              >
                <InfoOutlinedIcon style={{ fontSize: 17 }} />
              </Tooltip>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Enable for this Event
              </div>
              <Field name="enabledLounge" component={renderToggleSwitch} />
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Number of Tables Available
              </div>
              <Field
                name="numberOfTablesAvailableLounge"
                type="number"
                classes="form-control"
                component={renderInput}
              ></Field>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Number of Seats Per Table
              </div>
              <Field
                name="numberOfSeatsPerTableLounge"
                type="number"
                classes="form-control"
                component={renderInput}
              ></Field>
            </div>

            <div className="social-lounge-heading d-flex flex-row align-items-center">
              <div className="chart-heading-registrations mb-3 ps-4 pe-3 pt-3">
                Speed Networking
              </div>
              <Tooltip
                title="This is the area where your participants can interact using match making algorithm one-on-one."
                TransitionComponent={Zoom}
              >
                <InfoOutlinedIcon style={{ fontSize: 17 }} />
              </Tooltip>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Enable for this Event
              </div>
              <Field
                name="enabledSpeedNetworking"
                component={renderToggleSwitch}
              />
              {/* <CustomizedSwitchForNetworking /> */}
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Time Alloted per Interaction
              </div>
              <Field
                name="timeAllotedSpeedNetworking"
                type="number"
                classes="form-control"
                component={renderInput}
              ></Field>
            </div>

            <div className="social-lounge-heading d-flex flex-row align-items-center">
              <div className="chart-heading-registrations mb-3 ps-4 pe-3 pt-3">
                Custom Group Based Networking
              </div>
              <Tooltip
                title="This is the area where your participants can choose to interact with people belonging to particular group one-one e.g. incubators, startups and investors ."
                TransitionComponent={Zoom}
              >
                <InfoOutlinedIcon style={{ fontSize: 17 }} />
              </Tooltip>
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Enable for this Event
              </div>
              <Field
                name="enabledGroupBasedNetworking"
                component={renderToggleSwitch}
              />
              {/* <CustomizedSwitchForNetworking /> */}
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center ps-4 pe-3 my-4">
              <div
                className="form-label-customized"
                style={{ fontSize: "14px" }}
              >
                Time Alloted per Interaction
              </div>
              <Field
                name="timeAllotedGroupBasedNetworking"
                type="number"
                classes="form-control"
                component={renderInput}
              ></Field>
            </div>
            <div
              className="d-flex flex-row justify-content-end mt-3"
              style={{ width: "100%" }}
            >
              <button
                type="button"
                disabled={pristine || submitting}
                onClick={reset}
                className={`btn btn-outline-primary btn-outline-text me-3 `}
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={pristine || submitting}
                className={`btn btn-primary btn-outline-text `}
              >
                Save changes
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  initialValues: {
    enabledLounge:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.socialLounge &&
      state.networking.networkingSettings.socialLounge.enabled
        ? state.networking.networkingSettings.socialLounge.enabled
        : false,

    numberOfTablesAvailableLounge:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.socialLounge &&
      state.networking.networkingSettings.socialLounge.numberOfTables
        ? state.networking.networkingSettings.socialLounge.numberOfTables
        : 0,

    numberOfSeatsPerTableLounge:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.socialLounge &&
      state.networking.networkingSettings.socialLounge.numberOfSeatsPerTable
        ? state.networking.networkingSettings.socialLounge.numberOfSeatsPerTable
        : 0,

    enabledSpeedNetworking:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.speedNetworking &&
      state.networking.networkingSettings.speedNetworking.enabled
        ? state.networking.networkingSettings.speedNetworking.enabled
        : false,
    timeAllotedSpeedNetworking:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.speedNetworking &&
      state.networking.networkingSettings.speedNetworking
        .timeAllotedPerInteraction
        ? state.networking.networkingSettings.speedNetworking
            .timeAllotedPerInteraction
        : 0,
    enabledGroupBasedNetworking:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.customGroupBasedNetworking &&
      state.networking.networkingSettings.customGroupBasedNetworking.enabled
        ? state.networking.networkingSettings.customGroupBasedNetworking.enabled
        : false,
    timeAllotedGroupBasedNetworking:
      state.networking.networkingSettings &&
      state.networking.networkingSettings.customGroupBasedNetworking &&
      state.networking.networkingSettings.customGroupBasedNetworking
        .timeAllotedPerInteraction
        ? state.networking.networkingSettings.customGroupBasedNetworking
            .timeAllotedPerInteraction
        : 0,
  },
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "NetworkingFormLeftSide",
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(NetworkingFormLeft)
);
