import React, { useState } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Registrations.scss";
// import CustomPagination from "./HelperComponent/Pagination";
import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import { alpha } from "@material-ui/core";
import Select from "react-select";

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IntegrationsSub from "./IntegrationSubComponents.js/IntegrationsSub";
import ApiKeysSub from "./IntegrationSubComponents.js/ApiKeysSub";
import GenerateApiKey from "./IntegrationSubComponents.js/Forms/GenerateApiKey";

import StreamDestination from "./IntegrationSubComponents.js/StreamDestinations/StreamDestination";

const options = [
  { value: "All", label: "All Integrations" },
  { value: "Collaboration", label: "Collaboration" },
  { value: "Translation", label: "Translation" },
  { value: "Gamification", label: "Gamification" },
  { value: "Social Media", label: "Social Media" },
  { value: "CRM", label: "CRM" },
  { value: "Engagement", label: "Engagement" },
  { value: "Marketing", label: "Marketing" },
  { value: "Donations", label: "Donations" },
  { value: "Captions", label: "Captions" },
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

const Integrations = () => {
  const [alignment, setAlignment] = React.useState("integrations");

  const [openGenerateApikey, setOpenGenerateApikey] = useState(false);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleCloseOpenGenerateApiKey = () => {
    setOpenGenerateApikey(false);
  };

  const classes = useStyles();

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          
          {(() => {
              switch (alignment) {
                case "integrations":
                  return (
                    <div className="sec-heading-text">Integrations</div>
                  );

                case "streamdestination":
                  return <div className="sec-heading-text">Stream destination</div>

                case "apikeys":
                  return <div className="sec-heading-text">Api keys</div>

                  case "webhooks":
                  return <div className="sec-heading-text">Webhooks</div>

                default:
                  break;
              }
            })()}
          <div className="sec-heading-action-button d-flex flex-row">
            <div
              className={`${classes.search} me-3`}
              style={{ backgroundColor: "#ffffff" }}
            >
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
              />
            </div>

            {(() => {
              switch (alignment) {
                case "integrations":
                  return (
                    <div className="me-3" style={{ minWidth: "250px" }}>
                      <Select
                        styles={styles}
                        menuPlacement="bottom"
                        options={options}
                        defaultValue={options[0]}
                      />
                    </div>
                  );

                // case "apikeys":
                //   return <button className="btn btn-primary btn-outline-text">
                //   Generate new Key
                // </button>

                default:
                  break;
              }
            })()}

            {(() => {
              switch (alignment) {
                case "integrations":
                  return (
                    <button className="btn btn-outline-primary btn-outline-text">
                      Suggest Integration
                    </button>
                  );

                case "apikeys":
                  return (
                    <button
                      onClick={() => {
                        setOpenGenerateApikey(true);
                      }}
                      className="btn btn-primary btn-outline-text"
                    >
                      Generate new Key
                    </button>
                  );

                default:
                  break;
              }
            })()}
          </div>
        </div>
        <div className="px-4 py-4">
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="integrations">Integrations</ToggleButton>
            <ToggleButton value="streamdestination">
              Stream destination
            </ToggleButton>
            <ToggleButton value="apikeys">API Keys</ToggleButton>
            <ToggleButton value="webhooks">Webhooks</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {(() => {
          switch (alignment) {
            case "integrations":
              return <IntegrationsSub />;

            case "streamdestination":
              return (<>
              
              <StreamDestination />

              </>
              );

            case "apikeys":
              return <ApiKeysSub />;

            case "webhooks":
              return (
                <div>
                  We will have webhooks configuration, management and testing
                  ui.
                </div>
              );

            default:
              break;
          }
        })()}
      </div>
      <GenerateApiKey
        openDrawer={openGenerateApikey}
        handleCloseDrawer={handleCloseOpenGenerateApiKey}
      />
    </>
  );
};

export default Integrations;
