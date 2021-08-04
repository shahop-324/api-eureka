import React, { useEffect } from "react";
import "./../../../assets/Sass/Dashboard_Overview.scss";
import "./../../../assets/Sass/SideNav.scss";
import "./../../../assets/Sass/TopNav.scss";
import "./../../../assets/Sass/DataGrid.scss";
import "./../../../assets/Sass/EditEvent/Basics.scss";
import "./../../../assets/Sass/EditEvent/About.scss";
import "./../../../index.css";
import "./../../../assets/Sass/EditEvent/Networking.scss";
import NetworkingFormLeft from "./FormComponents/EditNetworkingForms/NetworkingFormLeft";
import NetworkingFormRight from "./FormComponents/EditNetworkingForms/NetworkingFormRight";
import { useDispatch } from "react-redux";
import { fetchNetworking } from "../../../actions";
import { useParams } from "react-router-dom";

const Networking = () => {
  const params = useParams();
  const id = params.id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNetworking(id));
  }, []);

  return (
    <>
      <div>
        <div className="secondary-heading-row d-flex flex-row justify-content-between px-4 py-4">
          <div className="sec-heading-text">Networking</div>
          <div className="drop-selector d-flex flex-row justify-content-end">
            <button className="btn btn-outline-primary btn-outline-text">
              Preview Venue
            </button>
          </div>
        </div>
        <div className="networking-content-grid px-3 mb-4">
          <div className="networking-form-left networking-form px-4 py-4">
            <NetworkingFormLeft
            />
          </div>

          <div className="networking-form-right networking-form px-4 py-4">
            <NetworkingFormRight  />
          </div>
        </div>
      </div>
    </>
  );
};

export default Networking;
