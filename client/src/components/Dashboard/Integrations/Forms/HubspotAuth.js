import React from "react";
import HighlightOffRoundedIcon from "@material-ui/icons/HighlightOffRounded";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { IconButton } from "@material-ui/core";
import HubspotIntegrationPNG from "./../../../../assets/images/int-4.png";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { editCommunity } from "../../../../actions";
const renderInput = ({
  input,
  value,
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
        style={{ width: "100%" }}
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

const HubspotAuth = ({ openDrawer, handleCloseDrawer, handleSubmit }) => {
  const params = useParams();
  const communityId = params.id;

  const dispatch = useDispatch();
  const onSubmit = (formValues) => {
    console.log(formValues);
    dispatch(editCommunity(communityId, formValues));
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
        >
          <div className="integration-side-drawer-form px-4 py-4">
            <div>
              <IconButton>
                <HighlightOffRoundedIcon
                  onClick={() => {
                    handleCloseDrawer();
                  }}
                />
              </IconButton>
            </div>
            <div style={{ textAlign: "center" }} className="mb-4">
              <img
                style={{ maxHeight: "420px" }}
                src={HubspotIntegrationPNG}
                alt="integration illustration"
              />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div>


              

                <div className="mb-3">
                  <label
                    Forhtml="eventStartDate"
                    className="form-label form-label-customized"
                  >
                    Hubspot Api key
                  </label>

                  <Field
                    type="text"
                    classes="me-3 form-control"
                    name="hubspotApiKey"
                    id="hubspot-api-key"
                    ariadescribedby="emailGroupName"
                    placeholder="Hubspot API Key"
                    component={renderInput}
                  />
                </div>
                <div className="d-flex flex-row align-items-center justify-content-end mb-4">
                  <button
                    type="submit"
                    className="btn btn-outline-primary btn-outline-text"
                  >
                    Connect
                  </button>
                </div>


                <div>
                  <div className="want-help-heading mb-3">Want help ?</div>
                  <div className="integration-guide-btn px-4 py-2">
                    Guid to Integrate Hubspot with Evenz.
                  </div>
                </div>
              </div>
            </form>

            
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};
const validate = (formValues) => {
  const errors = {};

  if (!formValues.hubspotApiKey) {
    errors.hubspotApiKey = "Api key required";
  }

  return errors;
};

const mapStateToProps = (state) => ({
  initialValues: {
    hubspotApiKey:
      state.community.communityDetails &&
      state.community.communityDetails.hubspotApiKey
        ? state.community.communityDetails.hubspotApiKey
        : null,
  },
});

export default connect(mapStateToProps)(
  reduxForm({
    form: "hubSpotForm",
    validate,
    enableReinitialize: true,
    destroyOnUnmount: false,
  })(HubspotAuth)
);
