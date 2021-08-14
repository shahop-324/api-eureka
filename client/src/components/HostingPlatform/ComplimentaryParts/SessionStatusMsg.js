import React from 'react';
import './../Styles/complimentary.scss';
import NotYetStarted from './../../../assets/images/NotYetStarted.png';


const SessionStatusMsg = () => {
    return (
        <>

<div className="no-content-msg-card d-flex flex-column align-items-center justify-content-around">

    {/* Illustration */}
    <img  src={NotYetStarted} alt="card-message"  className="mb-3 no-content-illustration-img"/>

    {/* Message */}
    <div className="no-content-card-msg">This session has not yet started</div>

    {/* Action Button */}

</div>

        </>
    );
}

export default SessionStatusMsg;