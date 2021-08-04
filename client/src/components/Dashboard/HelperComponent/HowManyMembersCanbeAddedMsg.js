import React from 'react';
import './../../../assets/Sass/TeamManagement.scss';

const HowManyMembersCanBeAddedMsg = () => {
    return (
        <div className="num-of-members-that-can-be-added-msg py-3">
            You can still add 1 more team member. To invite more members, you can upgrade your current plan <a href="#"><b>here</b></a>.
        </div>
    );
}

export default HowManyMembersCanBeAddedMsg;