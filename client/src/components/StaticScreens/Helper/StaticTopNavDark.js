import React from 'react';
import './../../../index.css';

const StaticTopNavDark = () => {
    return (
            <> 
            <div
            className="row nav-section"
            style={{ marginLeft: "auto", marginRight: "auto" }}
          >
            <nav class="navbar navbar-expand-xxl ">
              <div class="container">
                {/* // TODO LINK EVENZ LOGO EVERYWHERE TO HOME PAGE */}
                <span class="navbar-brand nav-brand-name-home brand-dark" style={{color: "#1B1B1B"}}>Evenz</span>

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
                      <div className="nav-link-btn me-4" style={{color: "#212121"}}>Features</div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4" style={{color: "#212121"}}>Use Cases</div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4" style={{color: "#212121"}}>Explore Events</div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <div className="nav-link-btn me-4" style={{color: "#212121"}}>Pricing</div>
                    </li>
                    <li class="nav-item" style={{ alignSelf: "center" }}>
                      <a
                        href="/signin"
                        type="button"
                        className="btn btn-dark btn-outline-text ms-3"
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

export default StaticTopNavDark;