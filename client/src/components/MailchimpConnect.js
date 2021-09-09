import React from "react";

const MailchimpConnect = () => {
  return (
    <>
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <img
          src={"https://www.drupal.org/files/project-images/MC_Logo.jpg"}
          alt="mailchimp connect"
          style={{ maxHeight: "320px", borderRadius: "10px" }}
        />
        <div className="d-flex flex-row align-items-center mt-4">
        <div class="spinner-border text-primary" role="status">
  <span class="sr-only">Loading...</span>
</div>
<div className="ms-3" style={{fontFamily: "Ubuntu", fontWeight: "500"}}>Connecting to mailchimp</div>
        </div>
        
      </div>
      
    </>
  );
};

export default MailchimpConnect;
