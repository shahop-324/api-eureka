import React from "react";
import { Link } from "react-router-dom";
import AvatarMenu from "../AvatarMenu";

class UserAccountNav extends React.Component {
  render() {
    return (
      <div
        className="row nav-section"
        style={{ marginLeft: "auto", marginRight: "auto" }}
      >
        <nav
          class="navbar navbar-expand-xxl navbar-light"
          style={{ backgroundColor: "#ffffff" }}
        >
          <div class="container-fluid">
            {/* // TODO LINK EVENZ LOGO EVERYWHERE TO HOME PAGE */}
              <span class="navbar-brand" style={{ color: "#538BF7" }}>Evenz</span>
            
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                <li class="nav-item" style={{ alignSelf: "center" }}>
                  <Link
                    to={`/search-events`}
                    type="button"
                    className="btn btn-outline-primary btn-outline-text"
                  >
                    Explore Events
                  </Link>
                </li>
                <li class="nav-item" style={{ alignSelf: "center" }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-outline-text ms-3"
                  >
                    Get Help
                  </button>
                </li>
                <li class="nav-item" style={{ alignSelf: "center" }}>
                  <AvatarMenu />
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default UserAccountNav;
