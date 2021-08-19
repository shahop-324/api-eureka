import React from "react";
import { Link } from "react-router-dom";
import AvatarMenu from "../AvatarMenu";
import ErrorBoundriesAvatarMenu from "../ErrorBoundries/ErrorBoundriesAvatarMenu";

class UserAccountNav extends React.Component {
  render() {
    return (
      <div
        className="row "
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          minWidth: "1256px",
          overflow: "visible",
        }}
      >
        <div className="custom-nav-bar d-flex flex-row align-items-center justify-content-between px-3 py-2">
          <a
            href="https://www.evenz.in/home"
            className="navbar-brand"
            style={{ textDecoration: "none", color: "#538BF7" }}
          >
            Evenz
          </a>

          <div class="d-flex flex-row align-items-center">
            <Link
              to={`/search-events`}
             
              className="btn btn-outline-primary btn-outline-text"
            >
              Explore Events
            </Link>

            {/* <button
            
              className="btn btn-primary btn-outline-text ms-3"
            >
              <Link
                to="/contact-us"
                style={{ textDecoration: "none", color: "#ffffff" }}
              >
                Get Help
              </Link>
            </button> */}


            <div className="ms-3">
              <ErrorBoundriesAvatarMenu>
                <AvatarMenu />
              </ErrorBoundriesAvatarMenu>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserAccountNav;
