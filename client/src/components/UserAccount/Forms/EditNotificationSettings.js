import React from 'react';
import {Field, reduxForm} from 'redux-form';

import {withStyles} from '@material-ui/core/styles';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {useDispatch} from 'react-redux';
import {editUser} from '../../../actions';
import {connect} from 'react-redux';
const RoyalBlueCheckBox = withStyles({
  root: {
    color: '#538BF7',
    '&$checked': {
      color: '#3877F3',
    },
  },
  checked: {},
})((props) => <Checkbox color="default" {...props} />);

const RenderCustomCheckboxLabels = ({input, label, value}) => {
  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <RoyalBlueCheckBox
            // checked={state.checkedB}

            // name="checkedB"
            {...input}
          />
        }
        label={label}
      />
    </FormGroup>
  );
  // return (
  //   <CustomCheckboxLabels
  //     {...input}
  //     label={label}
  //     // onChange={(event) => {
  //     //   if (event.target.checked) input.onChange(value);
  //     // }}
  //     // onBlur={() => input.onBlur()}
  //     value={value}
  //     onChange={(e) => {
  //       console.log(e.target.checked);
  //     }}
  //   />
  // );
};

const EditNotificationSettings = (props) => {
  const {handleSubmit, pristine, submitting} = props;

  // const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const showResults = (formValues) => {
 
    window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
  };
  const dispatch = useDispatch();
  const onSubmit = (formValues) => {
    console.log(formValues);
    showResults(formValues);
    dispatch(editUser(formValues));
  };

  return (
    <>
      <div className="user-account-edit-profile px-2 py-2">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* <Field
            name="notificationsForRegisteredEvents"
            component={RenderCustomCheckboxLabels}
            label="Receive Email Notifications for registered events."
            value="Receive Email Notifications for registered events."
            
          />

          <Field
            name="notificationsForEventRemainders"
            component={RenderCustomCheckboxLabels}
            label="Receive Email Notifications for event reminders."
            value="Receive Email Notifications for event reminders."
           
          />
          <Field
            name="notificationsBasedOnMyPreference"
            component={RenderCustomCheckboxLabels}
            label="Receive Suggested List of events based on my preference."
            value="Receive Suggested List of events based on my preference."
            
          /> */}

          <Field
            name="notificationsForRegisteredEvents"
            component={RenderCustomCheckboxLabels}
            label="Receive Email Notifications for registered events."
            value="Receive Email Notifications for registered events."
          />

          <Field
            name="notificationsForEventRemainders"
            component={RenderCustomCheckboxLabels}
            label="Receive Email Notifications for event reminders."
            value="Receive Email Notifications for event reminders."
          />

          <Field
            name="notificationsBasedOnMyPreference"
            component={RenderCustomCheckboxLabels}
            label="Receive Suggested List of events based on my preference."
            value="Receive Suggested List of events based on my preference."
          />

          <div className="row edit-profile-form-row my-3 d-flex flex-row justify-content-end">
            {/* <button
              type="button"
              className="col-3 btn btn-outline-primary outline-btn-text me-3"
              style={{ textAlign: "center" }}
              disabled={pristine || submitting}
              onClick={reset}
            >
              Discard changes
            </button> */}
            <button
              type="submit"
              disabled={submitting || pristine}
              className="col-3 btn btn-primary"
              style={{textAlign: 'center', backgroundColor: '#538BF7'}}
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
const mapStateToProps = (state, props) => ({
  initialValues: {
    notificationsForRegisteredEvents:
       state.user.userDetails.notificationsForRegisteredEvents,
    notificationsForEventRemainders:
       state.user.userDetails.notificationsForEventRemainders,
    notificationsBasedOnMyPreference:
       state.user.userDetails.notificationsBasedOnMyPreference,
  },
});

export default connect(mapStateToProps)(
  reduxForm({
    form: 'notificationsSettings',
    enableReinitialize: true,
    destroyOnUnmount: false,

  })(EditNotificationSettings)
);

// export default reduxForm({
//   form: "notificationsSettings",
// })(EditNotificationSettings);
