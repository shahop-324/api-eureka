import React from 'react';

const StaticTopNav = () => {
    return (
            <> 
            <div
            className="row nav-section"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <nav class="navbar navbar-expand-xxl navbar-light">
              <div class="container">
                {/* // TODO LINK EVENZ LOGO EVERYWHERE TO HOME PAGE */}
                <span class="navbar-brand nav-brand-name-home"><a style={{ color: "#FFFFFF", textDecoration: "none" }} href="/home">
                  Evenz
                </a> </span>

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
                <div
                  class="collapse navbar-collapse"
                  id="navbarSupportedContent"
                >
                  <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4">Features</div>
                    </li>
                    {/* <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4">Use Cases</div>
                    </li> */}
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4"><a style={{ color: "#FFFFFF", textDecoration: "none" }} href="/search-events">
                  Explore Events
                </a></div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4">Pricing</div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <a
                        href="/signin"
                        type="button"
                        className="btn btn-light btn-outline-text ms-3"
                      >
                        Login
                      </a>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      {/* <AvatarMenu /> */}
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
            
            
            </>
    );
}

export default StaticTopNav;