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

let audienceList = [];

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

const MailchimpGeneral = () => {
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

  return (
    <>
      <div>
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
          <Select
            className="mb-3"
            name="mailchimpList"
            placeholder="Registrants list"
            styles={styles}
            menuPlacement="bottom"
            options={audienceList}
            onChange={(e) => console.log(e)}
          />
          <div className="form-label form-label-customized">Leads list</div>
          <Select
            className="mb-3"
            name="mailchimpList"
            placeholder="Leads list"
            styles={styles}
            menuPlacement="bottom"
            options={audienceList}
          />
          <div className="form-label form-label-customized">
            Interested people list
          </div>
          <Select
            name="mailchimpList"
            placeholder="Interested people list"
            styles={styles}
            menuPlacement="bottom"
            options={audienceList}
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
              <input
                type="text"
                readOnly={!editMode}
                className="mail-group-name-input me-3"
                style={{ width: "100%" }}
                onChange={(e) => {
                  handleChangeTag(e);
                }}
                value={tag}
                id="email-group-name"
                aria-describedby="emailGroupName"
                placeholder="Enter mail group name"
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
          <button className="btn btn-primary btn-outline-text">Save</button>
        </div>
        <div>
          <div className="want-help-heading mb-3">Want help ?</div>
          <div className="integration-guide-btn px-4 py-2">
            Guid to Integrate Mailchimp with Evenz.
          </div>
        </div>
      </div>
    </>
  );
};

export default MailchimpGeneral;
