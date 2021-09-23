import React from "react";
import Faker from "faker";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

import "./../../../assets/Sass/TeamManagement.scss";
import "./../../../assets/Sass/DataGrid.scss";


import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";


import IconButton from "@material-ui/core/IconButton";
import EditRoundedIcon from "@material-ui/icons/EditRounded";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import { reduxForm } from "redux-form";
import Select from 'react-select';
import { Field } from "redux-form";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";

const options = [
  { value: "MP000", label: "Assign all permissons" },
  { value: "MP001", label: "Add another member" },
  { value: "MP002", label: "View Transactions" },
  { value: "MP003", label: "Create Payout Link" },
  { value: "MP004", label: "Add Speakers" },
  { value: "MP005", label: "Add Booths" },
  { value: "MP006", label: "Add Sessions" },
  { value: "MP007", label: "Add New Ticket" },
  { value: "MP008", label: "View attendees details" },
  { value: "MP009", label: "Setup RTMP & Live Streaming" },
  { value: "MP0010", label: "View analytics data" },
  { value: "MP0011", label: "Export analytics data" },
  { value: "MP0012", label: "Customize and send attendee emails" },
  { value: "MP0013", label: "Customize and send booth emails" },
  { value: "MP0014", label: "Customize and send speaker emails" },
  { value: "MP0015", label: "change networking settings" },
  { value: "MP0016", label: "Setup Integrations" },
  { value: "MP0017", label: "add sponsors" },
  { value: "MP0018", label: "Publish events" },
  { value: "MP0019", label: "Create new event" },
  { value: "MP0020", label: "Change Billing Plan" },
  { value: "MP0021", label: "Reply to users queries" },
];

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

const renderEventPreferences = ({
  input,
  meta: { touched, error, warning },
  name,
}) => (
  <div>
    <div>
      <Select
        isMulti
        styles={styles}
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
const showResults = (formValues) => {
  // await sleep(500); // simulate server latency
  window.alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};
const onSubmit = (formValues) => {
  console.log(formValues);

  // dispatch(editUser(ModifiedFormValues, file));
  showResults(formValues);
  alert(`You submitted:\n\n${JSON.stringify(formValues, null, 2)}`);
};

const TeamManagementDetailsCard = (props) => {

  const { handleSubmit, pristine,  submitting } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

  const [openDrawer, setOpenDrawer] = React.useState(false);


  const handleOpenDrawer = () => {
    setOpenDrawer(true);
  };

  //  const formatDateAndTime =(date)=>{
  //   var now = new Date();
  //   dateFormat(startDate, "mm/d/yyyy");
  //  }

  const handleDeleteSession = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };


  

  return (
    <>
      <div className="team-members-field-value-container">
        <div className="registrations-name-field">
          <div className="registrations-field-label mx-5 d-flex flex-row ">
            {/* attendee avatar and name */}
            <Avatar alt="Travis Howard" src={Faker.image.avatar()} />
            <div className="ms-3 px-2 registration-name-styled">
              {Faker.name.findName()}
            </div>
          </div>
        </div>
        <div className="registrations-email-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {Faker.internet.email()}
            {/* attendee email */}
          </div>
        </div>
        <div className="registrations-phone-field">
          <div className="registrations-field-label registrations-field-value-modified">
            {/* phone number */}
            <div className="ms-3 px-3 py-2 pending-status-text-chip">
              Pending
            </div>
          </div>
        </div>

        {/* <div className="registrations-invoice-field">
          <div className="registrations-field-label registrations-field-value-modified px-3">
            <button className="btn btn-outline-primary btn-outline-text" onClick={handleRemoveUser}>
              Remove
            </button>
            
          </div>
        </div> */}

        <div className="event-registrations-field">
          <div
            className="event-field-label registrations-field-label"
            style={{ width: "100%" }}
          >
            <div onClick={handleOpenDrawer}>
              <IconButton color="primary" aria-label="add to shopping cart">
                <EditRoundedIcon />
              </IconButton>
            </div>
            <div onClick={handleDeleteSession}>
              <IconButton color="secondary" aria-label="add to shopping cart">
                <DeleteRoundedIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-wrapper" style={{ margin: "1.2% 0" }}>
        <Divider />
      </div>

      <Dialog
        fullScreen={fullScreen}
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Remove this Member."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to remove John Doe from your community team. Are you
            sure you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseDeleteDialog}>
            Cancel
          </Button>
          <Button
            onClick={handleCloseDeleteDialog}
            style={{ color: "#538BF7" }}
            autoFocus
          >
            Proceed
          </Button>
        </DialogActions>
      </Dialog>



      <React.Fragment key="right">
        {/* <Button onClick={toggleDrawer(right, true)}>{right}</Button> */}
        <SwipeableDrawer anchor="right" open={openDrawer} onOpen={() => {
          console.log("Side nav was opended")
        }}
        onClose={() => {
          console.log("Side nav was closed")
        }}>
          <div className="registration-more-details-right-drawer px-4 py-4">
            <div className="side-drawer-heading-and-close-row d-flex flex-row align-items-center justify-content-between">
              <div className="side-drawer-heading">Edit member Permissions</div>
              <div
                onClick={() => {
                  setOpenDrawer(false);
                }}
              >
                <IconButton aria-label="close-drawer">
                  <CancelOutlinedIcon
                    style={{ fontSize: "26", color: "#4D4D4D" }}
                  />
                </IconButton>
              </div>
            </div>
            <div className="my-3">
              <hr />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="ui form error">
              <div className="side-drawer-more-details-content-section">
                <div className="row edit-profile-form-row mb-3">
                  <div className="form-group">
                    <label
                      for="communityHeadline"
                      className="form-label form-label-customized"
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

                <div className="row edit-profile-form-row mb-3">
                  <label
                    for="communityHeadline"
                    className="form-label form-label-customized"
                  >
                    Set Permissions
                  </label>
                  <Field
                    name="interests"
                    component={renderEventPreferences}
                    label="Event Preferences"
                  />
                </div>
              </div>
              <div style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-outline-text"
                  style={{ width: "100%" }}
                  disabled={pristine || submitting}
                >
                 Update permissions
                </button>
              </div>
            </form>
          </div>
        </SwipeableDrawer>
      </React.Fragment>
    </>
  );
};


export default reduxForm({
  form: "editTeamMemberPermissions",
})(TeamManagementDetailsCard);