import React from 'react';
import VerticalTabs from "./UserAccountVerticalTabs";
const UserAccountHomeMainBody = () => {
    
    return (
        <div className="user-account-main-body-home-content">
                <div className="user-account-main-body-home-content-left ps-2" style={{overflow: "auto", height: "85vh"}}>
                    <div className="user-account-main-body-headline pb-4 ps-4" >
                    Your Upcoming Events
                    </div>
                    <VerticalTabs  />
                </div>
                
                </div>
    );
}

export default UserAccountHomeMainBody;