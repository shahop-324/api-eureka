import React from 'react';
import FloatingAvatars from '../HelperComponents/NetworkingFloatingAvatars';

const Networking = () => {
  return (
    <>
      <div className="sessions-and-networking-body-heading mb-5">
        Choose type of Networking
      </div>

      <FloatingAvatars />

      <div className="d-flex flex-row justify-content-center networking-options-btn">
        <div className="btn-filled-h px-5 py-3 ">Speed Networking</div>
        <div className="btn-filled-h px-5 py-3 ms-4">
          Group Based Networking
        </div>
      </div>
    </>
  );
};

export default Networking;
