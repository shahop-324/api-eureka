import React from "react";
import { Link } from "react-router-dom";
import AvatarMenu from "../AvatarMenu";

class UserAccountNav extends React.Component {
  render() {
    return (
      <div
        className="row "
        style={{ marginLeft: "auto", marginRight: "auto", minWidth: "1256px", overflow: "visible" }}
      >
        <div className="custom-nav-bar d-flex flex-row align-items-center justify-content-between px-3 py-2">
          <a
            href="https://www.evenz.in/home"
            className="navbar-brand"
            style={{ textDecoration: "none", color: "#538BF7" }}
          >
            Evenz
          </a>

          <div class="d-flex flex-row align-items-center" x>
            <Link
              to={`/search-events`}
              type="button"
              className="btn btn-outline-primary btn-outline-text"
            >
              Explore Events
            </Link>

            <button
              type="button"
              className="btn btn-primary btn-outline-text ms-3"
            >
              Get Help
            </button>
            <div>
              <AvatarMenu />
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

export default UserAccountNav;
