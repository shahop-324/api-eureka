import React from 'react';
import Schedule from "./../HelperComponent/Schedule";
import styled from 'styled-components';

const Paper = styled.div`

/* display: flex;
flex-direction: row;
align-items: center;
justify-content: center; */

`

const EventSchedule = () => {
    return (
        <>
<Paper className="m-4">

<Schedule />


</Paper>


        </>
    )
}

export default EventSchedule;