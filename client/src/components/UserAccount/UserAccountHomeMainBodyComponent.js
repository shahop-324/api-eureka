import React from "react";
import { useSelector } from "react-redux";
import VerticalTabs from "./UserAccountVerticalTabs";
import styled from 'styled-components';



// import { useSnackbar } from "notistack";



const UserAccountHomeMainBody = () => {
    
//   const { enqueueSnackbar, closeSnackbar } = useSnackbar();

//   const { signInSucceded } = useSelector((state) => state.auth);

//   if (signInSucceded) {
//     enqueueSnackbar("Signed in successfully 🥳 !", {
//       variant: "success",
//     });
//   }

  return (

    <div className="user-account-main-body-home-content">
      
      <div
        className="user-account-main-body-home-content-left ps-2"
        style={{ overflow: "auto", height: "100%" }}
      >
        <div className="user-account-main-body-headline pb-4 ps-4">
          Your Upcoming Events
        </div>
        <VerticalTabs />
      </div>
    </div>
  );
};

export default UserAccountHomeMainBody;
