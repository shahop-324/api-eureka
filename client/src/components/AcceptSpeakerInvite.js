import React from "react";
import "./../index.css";
import Faker from "faker";
import AvatarMenu from "./AvatarMenu";


const AcceptSpeakerInvite = () => {
//   const classes = useStyles();
  return (
    <>
      <div className="row topnav-container px-3">
        <div className="col-6 left">
          <div
            className="brand-logo-text navbar-brand"
            style={{ fontFamily: "Inter" }}
          >
            Evenz
          </div>
        </div>
        <div className="col-6 right">
          <div className="me-4">
            <AvatarMenu />
          </div>
        </div>
      </div>

      <div
        className="d-flex flex-row justify-content-center align-items-center"
        style={{
          width: "100%",
          height: "93vh",
          borderTop: "2px solid #BCD2FF",
        }}
      >
        <div className="community-invitation-card p-5">
          <div
            className="d-flex flex-row justify-content-center mb-5"
            style={{ padding: "0" }}
          >
            <img
              className="event-landing-poster"
              // src={`https://evenz-img-234.s3.ap-south-1.amazonaws.com/${event.image}`}
              src={Faker.image.abstract()}
              alt="event-landing-hero"
            />
          </div>
         
          <div className="hosted-by-community-grid mb-4 d-flex flex-row align-items-center">
                  <img
                    src={Faker.image.avatar()}
                    className="hosted-by-community-logo"
                    alt="community logo"
                  />
                  <div className="hosted-by-community-name-sec">
                    <div
                      className="hosted-by-headline mb-1"
                      style={{ fontWeight: "600" }}
                    >
                      Hosted By
                    </div>
                    <div className="hosted-by-community-name mb-2">
                      {/* {event.createdBy.name} */}
                      Community Name

                    </div>
                  </div>
                </div>
         
          <div
            className="d-flex flex-row justify-content-center btn-outline-text mb-4"
            style={{ padding: "0", fontSize: "1.25rem" }}
          >
            Event Name
          </div>
          <div
            className="d-flex flex-row justify-content-center btn-outline-text"
            style={{ padding: "0", color: "#757575" }}
          >
            You have been invited as a speaker in this event.
          </div>
          <div
            className="d-flex flex-row justify-content-center btn-outline-text mt-4"
            style={{ padding: "0", color: "#757575" }}
          >
            <button className="btn btn-primary btn-outline-text me-4">
              Accept Invitation
            </button>
            <button className="btn btn-outline-primary btn-outline-text">
              Reject
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcceptSpeakerInvite;
