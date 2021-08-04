import React from "react";
import "./../../../Styles/root.scss";

const PollComponent = () => {
  return (
    <>
      <div className="poll-element-wrapper p-3">
        <div className="poll-question mb-4">
          How did you get your previous job?
        </div>

        <div className="poll-option px-2 py-2 mb-3">On my own</div>
        <div className="poll-option px-2 py-2 mb-3">From a referral</div>
        <div className="poll-option px-2 py-2 mb-3">
          Through an ad on internet
        </div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="time-left-poll-text">Time Left</div>
          <div className="time-left-in-min">05:35 min</div>
        </div>
      </div>
    </>
  );
};

export default PollComponent;
