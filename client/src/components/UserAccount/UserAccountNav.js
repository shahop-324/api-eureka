import React from "react";
import BluemeetLOGO from "./../../assets/Logo/Bluemeet_LOGO_official.svg";
import AvatarMenu from "../AvatarMenu";
import styled from "styled-components";
import ExploreRoundedIcon from "@mui/icons-material/ExploreRounded";

const BtnOutlinedWithIcon = styled.div`
  border: 1px solid #152d35;
  color: #152d35;
  padding: 8px 16px;
  border-radius: 10px;

  font-size: 0.8rem;
  font-family: "Ubuntu";
  font-weight: 500;

  &:hover {
    background-color: #152d35;
    color: #dcc7be;
    cursor: pointer;
  }
`;

const UserAccountNavPaper = styled.div`
  margin-left: auto;
  margin-right: auto;
  min-width: 1256px;
  overflow: visible;

  background-color: #FFFFFF !important;
`;

class UserAccountNav extends React.Component {
  render() {
    return (
      <UserAccountNavPaper className="row px-3 py-1">
        <div className="custom-nav-bar d-flex flex-row align-items-center justify-content-between px-3 py-2">
          {/* <a
            href="https://www.evenz.in/home"
            className="navbar-brand"
            style={{ textDecoration: "none", color: "#dcc7be" }}
          >
            Evenz
          </a> */}

          <img src={BluemeetLOGO} alt="bluemeet logo" style={{width: "120px"}}/>

          <div className="d-flex flex-row align-items-center">
            <BtnOutlinedWithIcon>
              <ExploreRoundedIcon className="me-3" />
              Explore Events
            </BtnOutlinedWithIcon>
            <div className="ms-3">
              <AvatarMenu />
            </div>
          </div>
        </div>
      </UserAccountNavPaper>
    );
  }
}

export default UserAccountNav;
