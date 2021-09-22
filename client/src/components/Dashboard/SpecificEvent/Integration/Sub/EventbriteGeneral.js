import React, { useEffect, useState } from "react";

import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import { reduxForm } from "redux-form";
import {
  createEventbriteWebhookForEventRegistrations,
  getEventbriteEventsByOrganisation,
  getEventbriteOrganisations,
} from "../../../../../actions";
import { useParams } from "react-router";
let audienceList = [];
let organisationsList = [];
let eventsList = [];

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
        isMulti={isMulti}
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

const EventbriteGeneral = ({
  handleSubmit,
  pristine,
  submitting,
  eventbritePrivateToken,
}) => {
  const dispatch = useDispatch();

  const params = useParams();

  const eventId = params.eventId;

  const [selectedOrganisation, setSelectedOrganisation] = useState(
    organisationsList[0]
  );

  const [selectedEvent, setSelectedEvent] = useState(eventsList[0]);

  const { organisations, events, isLoading, error } = useSelector(
    (state) => state.eventbrite
  );

  useEffect(() => {
    dispatch(getEventbriteOrganisations(eventbritePrivateToken));
  }, []);

  const onSubmit = (formValues) => {
    console.log(formValues);
  };

  //   if (isLoading) {
  //     return (
  //       <div
  //         className="d-flex flex-row align-items-center justify-content-center"
  //         style={{ width: "100%", height: "80vh" }}
  //       >
  //         {" "}
  //         <Loader />{" "}
  //       </div>
  //     );
  //   }

  //   if (error) {
  //     dispatch(errorTrackerForFetchMailChimpAudiences());
  //     alert(error);
  //     return;
  //   }

  organisationsList = organisations.map((organisation) => {
    return {
      value: organisation.id,
      label: organisation.name,
    };
  });

  eventsList = events.map((event) => {
    return {
      value: event.id,
      label: event.name.text,
    };
  });

  return (
    <>
      <div>
        <form className="ui form error" onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex flex-column mb-5 overlay-form-input-row">
            <div className="mb-4">
              <label
                for="communityName"
                class="form-label form-label-customized"
                style={{ color: "#212121" }}
              >
                Eventbrite organisation
              </label>
              <small
                className="mb-3 form-small-text"
                style={{ display: "block" }}
              >
                Select your eventbrite organisation from which you are selling
                tickets for this event
              </small>

              <Select
                name="organisationsList"
                className="mb-5"
                placeholder="Organisation"
                styles={styles}
                menuPlacement="bottom"
                options={organisationsList}
                defaultValue={organisationsList[0]}
                onChange={(org) => {
                  dispatch(
                    getEventbriteEventsByOrganisation(
                      eventbritePrivateToken,
                      org.value
                    )
                  );
                  setSelectedOrganisation(org);
                }}
              />
            </div>
            <div>
              <label
                className="mt-4"
                for="communityName"
                class="form-label form-label-customized"
                style={{ color: "#212121" }}
              >
                Eventbrite event
              </label>
              <small
                className="mb-3 form-small-text"
                style={{ display: "block" }}
              >
                Select your event corresponding to this event from your
                eventbrite organisation
              </small>

              <Select
                name="eventsList"
                className="mb-3"
                placeholder="Event"
                styles={styles}
                menuPlacement="bottom"
                options={eventsList}
                onChange={(event) => {
                  setSelectedEvent(event);
                }}
              />
            </div>
          </div>
          <div
            className="d-flex flex-row align-items-center justify-content-end mb-4"
            style={{ width: "100%" }}
          >
            <button
              onClick={() => {
                if (
                  !eventbritePrivateToken ||
                  !selectedOrganisation ||
                  !selectedEvent ||
                  !eventId
                )
                  return;
                dispatch(
                  createEventbriteWebhookForEventRegistrations(
                    eventbritePrivateToken,
                    selectedOrganisation.value,
                    selectedEvent.value,
                    eventId
                  )
                );
              }}
              type="submit"
              className="btn btn-primary btn-outline-text"
            >
              Save
            </button>
          </div>
          <div>
            <div className="want-help-heading mb-3">Want help ?</div>
            <div className="integration-guide-btn px-4 py-2">
              Guid to Integrate Eventbrite with Evenz.
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default reduxForm({
  form: "eventbriteGeneralPreference",
  // validate,
})(EventbriteGeneral);
