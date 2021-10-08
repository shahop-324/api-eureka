import React, { useState } from "react";
import "./../../assets/Sass/Dashboard_Overview.scss";
import "./../../assets/Sass/EventManagement.scss";
import "./../../assets/Sass/SideNav.scss";
import "./../../assets/Sass/TopNav.scss";
import "./../../assets/Sass/DataGrid.scss";
import "./../../assets/Sass/Registrations.scss";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import IntegrationsSub from "./IntegrationSubComponents.js/IntegrationsSub";
import ApiKeysSub from "./IntegrationSubComponents.js/ApiKeysSub";
import GenerateApiKey from "./IntegrationSubComponents.js/Forms/GenerateApiKey";
import StreamDestination from "./IntegrationSubComponents.js/StreamDestinations/StreamDestination";

const Integrations = () => {
  const [alignment, setAlignment] = React.useState("integrations");

  const [openGenerateApikey, setOpenGenerateApikey] = useState(false);

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const handleCloseOpenGenerateApiKey = () => {
    setOpenGenerateApikey(false);
  };

  return (
    <>
      <div style={{ minWidth: "1138px" }}>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 pt-4 pb-1">
          {(() => {
            switch (alignment) {
              case "integrations":
                return <div className="sec-heading-text">Integrations</div>;

              case "apikeys":
                return <div className="sec-heading-text">Api keys</div>;

              default:
                break;
            }
          })()}
          <div className="sec-heading-action-button d-flex flex-row">
            {(() => {
              switch (alignment) {
                case "integrations":
                  return <div className="d-flex flex-row align-items-center">
                    <button
                     
                      className="btn btn-outline-dark btn-outline-text me-3"
                    >
                      Build with Bluemeet
                    </button>
                    <button
                     
                      className="btn btn-dark btn-outline-text"
                    >
                      Request integration
                    </button>
                  </div> ;

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

            <ToggleButton value="apikeys">API Keys</ToggleButton>
          </ToggleButtonGroup>
        </div>

        {(() => {
          switch (alignment) {
            case "integrations":
              return <IntegrationsSub />;


            case "apikeys":
              return <ApiKeysSub />;

            

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
