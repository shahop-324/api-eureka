/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import AvatarMenu from "../AvatarMenu";
import "./Styles/Compatibility.scss";

import { useDispatch, useSelector } from "react-redux";
import CustomizedStepper from "./CustomizedStepper";
import { errorTrackerForFetchEvent, errorTrackerForgetRTMToken, fetchEvent, getRTMToken } from "../../actions";
import { useParams } from "react-router-dom";

const CompatibilityTest = () => {
  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const params = useParams();

  console.log(params);
  const eventId = params.eventId;

  useEffect(() => {
    dispatch(fetchEvent(eventId));

    dispatch(getRTMToken(eventId));
  }, []);

  const { isLoading, error } = useSelector((state) => state.event);

  const { isLoadingRTM, errorRTM } = useSelector((state) => state.RTM);

  if (isLoading || isLoadingRTM) {
    return (
      <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    );
  }
  if (error) {
    alert(error);
    dispatch(errorTrackerForFetchEvent());
    return;
  }
  if(errorRTM) {
    alert(error);
    dispatch(errorTrackerForgetRTMToken());
    return;
  }
  const image = user.userDetails.image;

  let imgURL;

  if (image.startsWith("https://lh3.googleusercontent.com")) {
    imgURL = image;
  } else {
    imgURL = `https://evenz-img-234.s3.ap-south-1.amazonaws.com/${image}`;
  }

  return (
    <>
      <div className="full-page-body">
        <div className="simple-nav d-flex flex-row align-items-center justify-content-between px-5 py-2">
          <div className="navbar-brand">Evenz</div>
          <AvatarMenu />
        </div>

        <div className="compatibility-test-section d-flex flex-row align-items-start pt-5">
          <CustomizedStepper />
        </div>
      </div>
    </>
  );
};

export default CompatibilityTest;
