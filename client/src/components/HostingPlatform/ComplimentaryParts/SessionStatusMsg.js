import React from 'react';
import './../Styles/complimentary.scss';
import NotYetStarted from './../../../assets/images/NotYetStarted.png';


const sessionStatusMsg = () => {
    return (
        <>

<div className="no-content-msg-card d-flex flex-column align-items-center justify-content-around">

    {/* Illustration */}
    <img  src={NotYetStarted} alt="card-message" />

    {/* Message */}

    {/* Action Button */}

</div>

        </>
    );
}