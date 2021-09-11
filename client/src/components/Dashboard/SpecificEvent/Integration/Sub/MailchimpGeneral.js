import React, { useState } from "react";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import EditRoundedIcon from "@material-ui/icons/EditRounded";

import Select from "react-select";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { withStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { Field, reduxForm } from "redux-form";

let audienceList = [];

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

const renderReactSelect = ({
  input,
  styles,
  menuPlacement,
  options,
  defaultValue,
  meta: { touched, error, warning },
  name,
}) => {
  const className = `field ${error && touched ? "error" : ""}`;
  
    <div className={className}>
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
};

const styles = {
  control: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "#858585",
  }),
  menu: (base) => ({
    ...base,
    fontFamily: "Ubuntu",
    fontSize: "0.8rem",
    fontWeight: "500",
    color: "#757575",
  }),
};

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

const MailchimpGeneral = ({ handleSubmit, pristine, submitting }) => {
  const [checked, setChecked] = React.useState(false);
  
  const ChimpyAudienceList = useSelector((state) => state.community.mailChimpAudiences);

  audienceList = ChimpyAudienceList.map((list) => {
    return {
      value: list.id,
      label: list.name
    }
  })

  const handleChange = () => {
    setChecked(!checked);
  };

  const [editMode, setEditMode] = useState(false);

  const previousTag = "Confluence 2021";

  const [tag, setTag] = useState("Confluence 2021");

  const handleChangeTag = (e) => {
    setTag(e.target.value);
  };

  const resetTag = () => {
    setTag(previousTag);
  };

  const turnOnEditMode = () => {
    setEditMode(true);
  };

  const turnOffEditMode = () => {
    setEditMode(false);
  };

  const onSubmit = (formValues) => {
    console.log(formValues);
  };

  return (
    <>
      <div>


<form className="ui form error" onSubmit={handleSubmit(onSubmit)}>



        <div className="d-flex flex-column mb-5 overlay-form-input-row">
          <label
            for="communityName"
            class="form-label form-label-customized"
            style={{ color: "#212121" }}
          >
            Mailchimp audience
          </label>
          <small className="mb-3 form-small-text">
            Select audience list from your mailchimp account where you want to
            sync registrants, leads and interested people.
          </small>
          <div className="form-label form-label-customized">
            Registrants list
          </div>

          <Field
            name="registrantsList"
            classes="mb-3"
            placeholder="Registrants list"
            styles={styles}
            menuPlacement="bottom"
            options={audienceList}
            component={renderReactSelect}
            // onChange={(e) => console.log(e)}
          />
          <div className="form-label form-label-customized">Leads list</div>
          <Field
            name="leadsList"
            classes="mb-3"
            placeholder="Leads list"
            styles={styles}
            menuPlacement="bottom"
            component={renderReactSelect}
            options={audienceList}
          />
          <div className="form-label form-label-customized">
            Interested people list
          </div>
          <Field
            name="interestedPeopleList"
            placeholder="Interested people list"
            styles={styles}
            menuPlacement="bottom"
            options={audienceList}
            component={renderReactSelect}
          />
        </div>
        <div className="d-flex flex-column mb-5 overlay-form-input-row">
          <label for="communityName" class="form-label form-label-customized">
            Audience tag
          </label>
          <small className="mb-3 form-small-text">
            Tag will be added to all contact registering for this event or who
            are captured as leads or interested people.
          </small>

          <div class="form-group">
            <div className="editable-mail-group-name d-flex flex-row align-items-center justify-content-between px-3 py-2">
              <Field
                type="text"
                readOnly={!editMode}
                classes="mail-group-name-input me-3"
                style={{ width: "100%" }}
                onChange={(e) => {
                  handleChangeTag(e);
                }}
                value={tag}
                id="tag"
                aria-describedby="tag"
                placeholder="Enter tag"
                component={renderInput}
              />
              {!editMode ? (
                <EditRoundedIcon
                  onClick={() => {
                    turnOnEditMode();
                  }}
                  className="chat-msg-hover-icon"
                  style={{ position: "absolute", right: "10px" }}
                />
              ) : (
                <div className="d-flex flex-row align-items-center">
                  <CheckRoundedIcon
                    onClick={() => {
                      turnOffEditMode();
                    }}
                    style={{ fill: "#188627" }}
                    className="me-3"
                  />
                  <ClearRoundedIcon
                    onClick={() => {
                      resetTag();
                      turnOffEditMode();
                    }}
                    style={{ fill: "#A51320" }}
                    className=""
                  />
                </div>
              )}
            </div>
          </div>

          {/* <div className="tag">Confluenece 2021</div> */}
        </div>

        <div className="d-flex flex-column mb-4 overlay-form-input-row">
          <label for="communityName" class="form-label form-label-customized">
            Add direct access link
          </label>
          <small className="mb-3 form-small-text">
            Direct access link will be saved and shared with attendees in
            mailing list to join event at ease.
          </small>

          <div
            className="d-flex flex-row align-items-center"
            style={{ justifySelf: "end" }}
          >
            <React.Fragment>
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
              <div
                style={{
                  color: "#212121",
                  fontFamily: "Ubuntu",
                  fontWeight: "500",
                }}
              >
                {checked ? "Disable" : "Enable"}
              </div>
            </React.Fragment>
          </div>

          {/* <div className="tag">Confluenece 2021</div> */}
        </div>
        <div
          className="d-flex flex-row align-items-center justify-content-end mb-4"
          style={{ width: "100%" }}
        >
          <button type="submit" className="btn btn-primary btn-outline-text">Save</button>
        </div>
        <div>
          <div className="want-help-heading mb-3">Want help ?</div>
          <div className="integration-guide-btn px-4 py-2">
            Guid to Integrate Mailchimp with Evenz.
          </div>
        </div>


</form>


      </div>
    </>
  );
};



export default reduxForm({
  form: "mailchimpGeneralPreference",
  // validate,
})(MailchimpGeneral);
