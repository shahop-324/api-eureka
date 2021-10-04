import React from "react";
import eureka from "../apis/eureka";
import { authActions } from "../reducers/authSlice";
import { eventActions } from "../reducers/eventSlice";
import { navigationActions } from "../reducers/navigationSlice";
import { communityActions } from "../reducers/communitySlice";
import { ticketActions } from "../reducers/ticketSlice";
import { sessionActions } from "../reducers/sessionSlice";
import { speakerActions } from "../reducers/speakerSlice";
import { sponsorActions } from "../reducers/sponsorSlice";
import { boothActions } from "../reducers/boothSlice";
import { userActions } from "../reducers/userSlice";
import history from "../history";

import { googleAuthActions } from "../reducers/googleAuthSlice";
import { communityAuthActions } from "../reducers/communityAuthSlice";
import { networkingActions } from "../reducers/networkingSlice";
import { couponActions } from "../reducers/couponSlice";
import { queriesActions } from "../reducers/queriesSlice";
import { registrationActions } from "../reducers/registrationSlice";
import { eventAccessActions } from "../reducers/eventAccessSlice";
import { socketActions } from "../reducers/socketSlice";
import { roomsActions } from "../reducers/roomsSlice";
import { RTMActions } from "../reducers/RTMSlice";
import AgoraRTM from "agora-rtm-sdk";
import { eventChatActions } from "../reducers/eventChatSlice";
import { RTCActions } from "../reducers/RTCSlice";
import { demoActions } from "../reducers/demoSlice";
import { contactUsActions } from "../reducers/contactSlice";
import { affiliateActions } from "../reducers/affiliateSlice";
import { interestedPeopleActions } from "../reducers/interestedPeopleSlice";
import { sessionChatActions } from "../reducers/sessionChatSlice";

import { eventAlertActions } from "../reducers/eventAlertSlice";
import { eventPollActions } from "../reducers/eventPollSlice";
import { availableForNetworkingActions } from "../reducers/availableForNetworking";

import socket from "../components/HostingPlatform/service/socket";
import { paypalActions } from "../reducers/paypalSlice";
import { tawkActions } from "../reducers/tawkSlice";
import { eventbriteActions } from "../reducers/eventbriteSlice";
import { apiKeyActions } from "../reducers/apiKeySlice";
import { snackbarActions } from "../reducers/snackbarSlice";
import { roleActions } from "../reducers/roleSlice";

const AWS = require("aws-sdk");
const UUID = require("uuid/v1");

const s3 = new AWS.S3({
  signatureVersion: "v4",
  region: "us-west-1",
  accessKeyId: "AKIA476PXBEVI6FHBGWC",
  secretAccessKey: "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",
});

const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1/"
  : "https://api.bluemeet.in/api-eureka/eureka/v1/";

  export const closeSnackbar = () => async (dispatch, getState) => {
    dispatch(snackbarActions.closeSnackBar());
  };

  export const showSnackbar = (severity, message) => async(dispatch, getState) => {
   
    dispatch(
      snackbarActions.openSnackBar({
        message:
          message,
        severity: severity,
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);
  }



export const signInForSpeaker =
  (id, communityId, eventId) => async (dispatch) => {
    console.log(id);

    try {
      const res = await eureka.post(`/eureka/v1/speakers/signin/${id}`);
      console.log(res);

      dispatch(
        authActions.SignIn({
          token: res.data.token,
        })
      );
      history.push(
        `/compatibility-test/community/${communityId}/event/${eventId}/`
      );
    } catch (err) {
      dispatch(authActions.hasError(err.response.data.message));
      console.log(err);
    }
  };

export const signIn = (res, intent, eventId) => async (dispatch) => {
  try {
    dispatch(
      authActions.SignIn({
        token: res.token,
        referralCode: res.data.user.hasUsedAnyReferral
          ? null
          : res.data.user.referralCode,
      })
    );
    dispatch(
      userActions.CreateUser({
        user: res.data.user,
      })
    );

    setTimeout(function () {
      dispatch(authActions.disabledSignInSucceded());
    }, 4000);

    if (intent === "eventRegistration") {
      history.push(`/event-landing-page/${eventId}`);
    } else if (intent === "buyPlan") {
      history.push("/pricing");
      dispatch(fetchUserAllPersonalData());
    } else {
      history.push("/user/home");
    }
  } catch (err) {
    // dispatch(authActions.hasError(err.response.data.message));
    // console.log(err.response);
    console.log(err);
  }
};
export const errorTrackerForSignIn = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};

export const fetchReferralCode =
  (referredUserId) => async (dispatch, getState) => {
    dispatch(userActions.FetchReferralCode({ referredUserId }));
  };

export const signUp = (formValues, intent, eventId) => async (dispatch) => {
  try {
    const res = await eureka.post("/eureka/v1/users/signup", {
      ...formValues,
    });
    console.log(res.data.data.user);
    dispatch(
      authActions.SignIn({
        token: res.data.token,

        referralCode: res.data.data.user.referralCode,
      })
    );
    dispatch(
      userActions.CreateUser({
        user: res.data.data.user,
      })
    );

    if (intent === "eventRegistration") {
      history.push(`/event-landing-page/${eventId}`);
    } else if (intent === "buyPlan") {
      history.push("/pricing");
      dispatch(fetchUserAllPersonalData());
    } else {
      history.push("/user/home");
    }
  } catch (err) {
    dispatch(authActions.hasError(err.response.data.message));
    alert(err.response.data.message);
  }
};

export const errorTrackerForSignUp = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};
export const linkedinSignIn =
  (code, intent, eventId) => async (dispatch, getState) => {
    try {
      const res = await eureka.get(`/getUserCredentials/?code=${code}`);
      console.log(res.data);
      const result = res.data.userProfile;

      result.referralCode = getState().user.referralCode;
      socket.emit("linkedinSignIn", { result });
    } catch (err) {
      console.log(err);
    }
  };

export const newLinkedinLogin = (res, intent, eventId) => async (dispatch) => {
  console.log(res.data.user);
  dispatch(
    authActions.SignIn({
      token: res.token,
      isSignedInThroughLinkedin: true,

      referralCode: res.data.user.hasUsedAnyReferral
        ? null
        : res.data.user.referralCode,
    })
  );
  dispatch(
    userActions.CreateUser({
      user: res.data.user,
    })
  );

  setTimeout(function () {
    dispatch(authActions.disabledSignInSucceded());
  }, 4000);

  if (intent === "eventRegistration") {
    history.push(`/event-landing-page/${eventId}`);
  } else if (intent === "buyPlan") {
    history.push("/pricing");
    dispatch(fetchUserAllPersonalData());
  } else {
    history.push("/user/home");
  }
};

export const errorTrackerForLinkedinSignIn =
  () => async (dispatch, getState) => {
    dispatch(authActions.disabledError());
  };
export const googleSignIn = (res, intent, eventId) => async (dispatch) => {
  try {
    dispatch(
      authActions.SignIn({
        token: res.token,
        isSignedInThroughGoogle: true,

        referralCode: res.data.user.hasUsedAnyReferral
          ? null
          : res.data.user.referralCode,
      })
    );
    dispatch(
      userActions.CreateUser({
        user: res.data.user,
      })
    );

    setTimeout(function () {
      dispatch(authActions.disabledSignInSucceded());
    }, 4000);

    if (intent === "eventRegistration") {
      history.push(`/event-landing-page/${eventId}`);
    } else if (intent === "buyPlan") {
      history.push("/pricing");
      dispatch(fetchUserAllPersonalData());
    } else {
      history.push("/user/home");
    }
  } catch (err) {
    console.log(err);
  }
};

export const errorTrackerForGoogleSignIn = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};

export const signOut = () => async (dispatch, getState) => {
  socket.emit("logOut", { userId: getState().user.userDetails._id });
  window.localStorage.clear();

  window.gapi.load("client:auth2", () => {
    window.gapi.client
      .init({
        clientId:
          "438235916836-6oaj1fbnqqrcd9ba30348fbe2ebn6lt0.apps.googleusercontent.com",
        scope: "profile email",
      })
      .then(() => {
        window.gapi.auth2.getAuthInstance().signOut();
      });
  });

  dispatch(authActions.SignOut());
  dispatch(communityAuthActions.CommunitySignOut());

  setTimeout(function () {
    dispatch(authActions.disabledSignOutSucceded());
  }, 4000);

  history.push("/home");

  //TODO Home page
};

export const createCommunity =
  (formValues, file, userId) => async (dispatch, getState) => {
    console.log(formValues);

    try {
      if (file) {
        console.log(file);

        let uploadConfig = await fetch(
          `${BaseURL}upload/user/img`,

          {
            headers: {
              Authorization: `Bearer ${getState().auth.token}`,
            },
          }
        );

        uploadConfig = await uploadConfig.json();
        console.log(uploadConfig);

        const awsRes = await fetch(uploadConfig.url, {
          method: "PUT",

          body: file,

          headers: {
            "Content-Type": file.type,
          },
        });

        console.log(awsRes);

        const communityCreating = async () => {
          let res = await fetch(
            `${BaseURL}users/newCommunity`,

            {
              method: "POST",
              body: JSON.stringify({
                ...formValues,
                image: uploadConfig.key,
              }),

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getState().auth.token}`,
              },
            }
          );
          if (!res.ok) {
            if (!res.message) {
              throw new Error("creating community failed");
            } else {
              throw new Error(res.message);
            }
          }
          res = await res.json();
          return res;
        };
        // console.log(res);
        try {
          let res = await communityCreating();

          dispatch(
            communityAuthActions.CommunitySignIn({
              token: res.token,
            })
          );
          dispatch(
            communityActions.CreateCommunity({
              community: res.communityDoc,
            })
          );

          history.push(
            `/user/${userId}/community/getting-started/${res.communityDoc.id}`
          );
        } catch (e) {
          dispatch(communityActions.hasError(e.message));
        }
      } else {
        const communityCreating = async () => {
          let res = await fetch(`${BaseURL}users/newCommunity`, {
            method: "POST",
            body: JSON.stringify({
              ...formValues,
            }),

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().auth.token}`,
            },
          });

          if (!res.ok) {
            if (!res.message) {
              throw new Error("creating community failed");
            } else {
              throw new Error(res.message);
            }
          }

          res = await res.json();
          return res;
        };
        // console.log(res);
        try {
          let res = await communityCreating();

          dispatch(
            communityAuthActions.CommunitySignIn({
              token: res.token,
            })
          );
          dispatch(
            communityActions.CreateCommunity({
              community: res.communityDoc,
            })
          );

          history.push(
            `/user/${userId}/community/overview/${res.communityDoc.id}`
          );
        } catch (e) {
          dispatch(communityActions.hasError(e.message));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
export const errorTrackerForCreateCommunity =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };

export const communitySignIn = (id, userId) => async (dispatch, getState) => {
  dispatch(communityAuthActions.startLoading());

  const loginCommunity = async () => {
    let res = await fetch(
      `${BaseURL}users/${id}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    );

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Signing in the community failed");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };
  try {
    let res = await loginCommunity();
    console.log(res);

    dispatch(
      communityAuthActions.CommunitySignIn({
        token: res.token,
      })
    );

    window.location.href = `/user/${userId}/community/getting-started/${res.communityDoc.id}`;
  } catch (e) {
    dispatch(communityActions.hasError(e.message));
  }
};

export const errorTrackerForCommunitySignIn =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };

export const googleSignOut = () => async (dispatch, getState) => {
  dispatch(authActions.SignOut());
};

//events actions
export const fetchEvents = (query) => async (dispatch) => {
  console.log(query);
  dispatch(eventActions.startLoading());

  try {
    const res = await eureka.get(`/eureka/v1/exploreEvents${query}`);
    console.log(res.data);
    // console.log(res.data.data.events);
    dispatch(
      eventActions.FetchEvents({
        events: res.data,
      })
    );
  } catch (e) {
    console.log(e);
    dispatch(eventActions.hasError(e.message));
  }
};

export const errorTrackerForFetchEvents = () => async (dispatch, getState) => {
  dispatch(eventActions.disabledError());
};

export const fetchUserAllPersonalData = () => async (dispatch, getState) => {
  dispatch(communityActions.startCommunityLoading());
  const fetchData = async () => {
    let res = await fetch(
      `${BaseURL}users/personalData`,

      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    );

    console.log(res);
    if (!res.ok) {
      if (!res.message) {
        throw new Error("fetching user data failed");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };
  try {
    const res = await fetchData();
    console.log(res);
    dispatch(
      eventActions.FetchEvents({
        events: res.data.personalData.registeredInEvents,
      })
    );
    dispatch(
      communityActions.FetchCommunities({
        communities: res.data.personalData.communities,
      })
    );

    dispatch(
      userActions.CreateUser({
        user: res.data.personalData,
      })
    );
  } catch (e) {
    dispatch(eventActions.hasError(e.message));
  }
};
export const errorTrackerForPersonalData = () => async (dispatch, getState) => {
  dispatch(eventActions.disabledError());
};

export const fetchUserRegisteredEvents = () => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());
  const fetchData = async () => {
    let res = await fetch(
      `${BaseURL}users/registeredEvents`,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    );
    console.log(res);

    if (!res.ok) {
      if (!res.message) {
        throw new Error("fetching user registrations failed");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };

  try {
    const res = await fetchData();
    console.log(res);

    dispatch(
      eventActions.FetchEvents({
        events: res.data.registeredInEventsList.registeredInEvents,
      })
    );
  } catch (err) {
    dispatch(eventActions.hasError(err.message));
  }
};

export const errorTrackerForRegisteredEvents =
  () => async (dispatch, getState) => {
    dispatch(eventActions.disabledError());
  };

export const fetchMyFavouriteEvents = () => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());

  const fetchData = async () => {
    let res = await fetch(
      `${BaseURL}users/myFavouriteEvents`,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    );
    console.log(res);

    if (!res.ok) {
      if (!res.message) {
        throw new Error("fetching user favourite events failed");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };

  try {
    const res = await fetchData();
    console.log(res);

    dispatch(
      eventActions.FetchFavouriteEvents({
        events: res.data.favouriteEvents,
      })
    );
  } catch (error) {
    dispatch(eventActions.hasError(error.message));
  }
};

export const addToFavouriteEvents = (eventId) => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());

  const addTofavourites = async () => {
    let res = await fetch(
      `${BaseURL}users/addToFavouriteEvents/${eventId}`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    );
    console.log(res);

    if (!res.ok) {
      if (!res.message) {
        throw new Error("adding to user favourite events list failed");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };

  try {
    const res = await addTofavourites();
    console.log(res);

    dispatch(
      eventActions.AddToFavouriteEvents({
        event: res.data,
      })
    );
  } catch (error) {
    dispatch(eventActions.hasError(error.message));
  }
};

export const removeFromFavouriteEvents =
  (eventId) => async (dispatch, getState) => {
    dispatch(eventActions.startLoading());

    const removeFromFavourites = async () => {
      let res = await fetch(
        `${BaseURL}users/removeFromFavouriteEvents/${eventId}`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      console.log(res);

      if (!res.ok) {
        if (!res.message) {
          throw new Error("removing from favourite events list failed");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };

    try {
      const res = await removeFromFavourites();
      console.log(res);

      dispatch(
        eventActions.RemoveFromFavouriteEvents({
          event: res.data,
        })
      );
    } catch (error) {
      dispatch(eventActions.hasError(error.message));
    }
  };

export const fetchEvent = (id) => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());

  try {
    const res = await eureka.get(`eureka/v1/users/event/${id}`);
    console.log(res.data);
    dispatch(
      eventActions.FetchEvent({
        event: res.data.data.response,
      })
    );
  } catch (err) {
    dispatch(eventActions.hasError(err.message));
    console.log(err.response.data);
  }
};
export const errorTrackerForFetchEvent = () => async (dispatch, getState) => {
  dispatch(eventActions.disabledError());
};
export const fetchParticularEventOfCommunity =
  (id) => async (dispatch, getState) => {
    dispatch(eventActions.startLoading());
    try {
      const res = await fetch(
        `${BaseURL}community/events/${id}`,

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();

      console.log(result);

      dispatch(
        eventActions.FetchEvent({
          event: result.data.event,
        })
      );
    } catch (err) {
      dispatch(eventActions.hasError(err.message));
      console.log(err);
    }
  };

export const errorTrackerForFetchParticularEventOfCommunity =
  () => async (dispatch, getState) => {
    dispatch(eventActions.disabledError());
  };
export const fetchEventsOfParticularCommunity =
  (term, page, limit) => async (dispatch, getState) => {
    dispatch(eventActions.startLoading());

    const fetchEvents = async () => {
      let fullLocation = `${BaseURL}community/events`;
      let url = new URL(fullLocation);
      let search_params = url.searchParams;

      if (term) {
        search_params.set("text", term);
      }
      if (page) {
        search_params.set("page", page);
      }
      if (limit) {
        search_params.set("limit", limit);
      }

      url.search = search_params.toString();
      let new_url = url.toString();

      console.log(new_url);

      const communityEvents = await fetch(new_url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });
      if (!communityEvents.ok) {
        if (!communityEvents.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(communityEvents.message);
        }
      }
      const eventsResult = await communityEvents.json();
      console.log(eventsResult);

      return eventsResult;
    };

    try {
      const eventsResult = await fetchEvents();

      dispatch(
        eventActions.FetchEvents({
          events: eventsResult.events,

          length: eventsResult.length,
        })
      );
      // );
    } catch (err) {
      dispatch(eventActions.hasError(err.message));
    }
  };

export const errorTrackerForFetchEventsOfParticularCommunity =
  () => async (dispatch, getState) => {
    dispatch(eventActions.disabledError());
  };

export const createEvent = (formValues) => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());

  const creatingEvent = async () => {
    console.log(formValues);

    let res = await fetch(
      `${BaseURL}community/events/new`,

      {
        method: "POST",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      }
    );
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };

  try {
    const res = await creatingEvent();
    console.log(res);

    dispatch(
      eventActions.CreateEvent({
        event: res.data.event,
      })
    );

    dispatch(
      snackbarActions.openSnackBar({
        message: "New event created successfully!",
        severity: "success",
      })
    );

    setTimeout(function () {
      dispatch(snackbarActions.closeSnackBar());
    }, 4000);
  } catch (err) {
    console.log(err);
    dispatch(
      snackbarActions.openSnackBar({
        message: "Failed to created new event.",
        severity: "error",
      })
    );
    setTimeout(function () {
      dispatch(snackbarActions.closeSnackBar());
    }, 4000);
    dispatch(eventActions.hasError(err.message));
  }
};
export const errorTrackerForCreateEvent = () => async (dispatch, getState) => {
  dispatch(eventActions.disabledError());
};

export const editEvent = (formValues, id) => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());
  const editingEvent = async () => {
    console.log(id);
    console.log(formValues);

    let res = await fetch(
      `${BaseURL}events/${id}/update`,

      {
        method: "PATCH",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      }
    );
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    return res;
  };
  try {
    const res = await editingEvent();
    console.log(res);

    dispatch(
      eventActions.EditEvent({
        event: res.updatedEvent,
      })
    );

    dispatch(
      snackbarActions.openSnackBar({
        message: "Event updated successfully!",
        severity: "success",
      })
    );

    setTimeout(function () {
      dispatch(snackbarActions.closeSnackBar());
    }, 6000);
  } catch (err) {
    console.log(err);

    dispatch(eventActions.hasError(err.message));

    dispatch(
      snackbarActions.openSnackBar({
        message: "Failed to update event.",
        severity: "error",
      })
    );

    setTimeout(function () {
      dispatch(snackbarActions.closeSnackBar());
    }, 6000);
  }
};
export const errorTrackerForeditEvent = () => async (dispatch, getState) => {
  dispatch(eventActions.disabledError());
};

export const uploadEventImage = (file, id) => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());

  const key = `${id}/${UUID()}.jpeg`;

  s3.getSignedUrl(
    "putObject",
    {
      Bucket: "bluemeet",
      Key: key,
      ContentType: "image/jpeg",
    },
    async (err, presignedURL) => {
      const awsRes = await fetch(presignedURL, {
        method: "PUT",

        body: file,

        headers: {
          "Content-Type": file.type,
        },
      });

      console.log(awsRes);

      if (awsRes.status === 200) {
        try {
          // Save this image info in event document.
          const res = await fetch(
            `${BaseURL}events/${id}/updatePromoImage`,

            {
              method: "PATCH",
              body: JSON.stringify({
                image: key,
              }),

              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getState().communityAuth.token}`,
              },
            }
          );
          const result = await res.json();
          dispatch(
            eventActions.EditEvent({
              event: result.updatedEvent,
            })
          );

          dispatch(
            snackbarActions.openSnackBar({
              message: "Promo image updated!",
              severity: "success",
            })
          );

          setTimeout(function () {
            dispatch(snackbarActions.closeSnackBar());
          }, 6000);
        } catch (error) {
          eventActions.hasError(error.message);
          console.log(error);

          dispatch(
            snackbarActions.openSnackBar({
              message: "Failed to upload promo image.",
              severity: "error",
            })
          );
          setTimeout(function () {
            dispatch(snackbarActions.closeSnackBar());
          }, 4000);
        }
      }
    }
  );
};

export const errorTrackerForUploadEventImage =
  () => async (dispatch, getState) => {
    dispatch(eventActions.disabledError());
  };

export const editEventDescription =
  (formValues, id) => async (dispatch, getState) => {
    dispatch(eventActions.startLoading());
    const editingEvent = async () => {
      console.log(id);
      console.log(formValues);

      let res = await fetch(
        `${BaseURL}events/${id}/updateEventDescription`,

        {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      return res;
    };

    try {
      const res = await editingEvent();
      console.log(res);

      dispatch(
        eventActions.EditEvent({
          event: res.updatedEvent,
        })
      );
      alert("About details updated successfully!");
    } catch (err) {
      dispatch(eventActions.hasError(err.message));
    }
  };

export const errorTrackerForEditEventDiscription =
  () => async (dispatch, getState) => {
    dispatch(eventActions.disabledError());
  };

export const deleteEvent = () => (dispatch, getState) => {
  // not implemented yet
};

//speaker actions
export const createSpeaker =
  (formValues, file, id) => async (dispatch, getState) => {
    dispatch(speakerActions.startLoadingDetail());
    try {
      if (file) {
        const key = `${id}/${UUID()}.jpeg`;

        s3.getSignedUrl(
          "putObject",
          {
            Bucket: "bluemeet",
            Key: key,
            ContentType: "image/jpeg",
          },
          async (err, presignedURL) => {
            const awsRes = await fetch(presignedURL, {
              method: "PUT",

              body: file,

              headers: {
                "Content-Type": file.type,
              },
            });

            console.log(awsRes);

            if (awsRes.status === 200) {
              try {
                let res = await fetch(
                  `${BaseURL}events/${id}/addSpeaker`,

                  {
                    method: "POST",
                    body: JSON.stringify({
                      ...formValues,
                      image: key,
                    }),

                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${getState().communityAuth.token}`,
                    },
                  }
                );
                if (!res.ok) {
                  if (!res.message) {
                    throw new Error("Something went wrong");
                  } else {
                    throw new Error(res.message);
                  }
                }
                res = await res.json();
                console.log(res);

                dispatch(
                  speakerActions.CreateSpeaker({
                    speaker: res.data,
                  })
                );

                dispatch(
                  snackbarActions.openSnackBar({
                    message: "Speaker added successfully!",
                    severity: "success",
                  })
                );

                setTimeout(function () {
                  dispatch(snackbarActions.closeSnackBar());
                }, 6000);
              } catch (error) {
                console.log(error);

                dispatch(
                  snackbarActions.openSnackBar({
                    message: "Failed to add speaker. Please try again",
                    severity: "error",
                  })
                );
                setTimeout(function () {
                  dispatch(snackbarActions.closeSnackBar());
                }, 4000);
              }
            }
          }
        );
      } else {
        console.log(id);
        console.log(formValues);

        let res = await fetch(
          `${BaseURL}events/${id}/addSpeaker`,

          {
            method: "POST",
            body: JSON.stringify({
              ...formValues,
            }),

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().communityAuth.token}`,
            },
          }
        );
        console.log(res);
       
        res = await res.json();
        console.log(res);

        dispatch(
          speakerActions.CreateSpeaker({
            speaker: res.data,
          })
        );

        dispatch(
          snackbarActions.openSnackBar({
            message: "Speaker added successfully!",
            severity: "success",
          })
        );

        setTimeout(function () {
          dispatch(snackbarActions.closeSnackBar());
        }, 6000);
      }
    } catch (err) {
      dispatch(speakerActions.detailHasError(err.message));
      dispatch(
        snackbarActions.openSnackBar({
          message: "Failed to add speaker. Please try again",
          severity: "error",
        })
      );
      setTimeout(function () {
        dispatch(snackbarActions.closeSnackBar());
      }, 4000);
    }
  };
export const errorTrackerForCreateSpeaker =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledDetailError());
  };

export const fetchSpeakers =
  (id, term, sessionId) => async (dispatch, getState) => {
    dispatch(speakerActions.startLoading());

    const getSpeakers = async () => {
      let fullLocation = `${BaseURL}events/${id}/speakers`;
      let url = new URL(fullLocation);
      let search_params = url.searchParams;

      if (term) {
        search_params.set("text", term);
      }
      if (sessionId && sessionId !== "all") {
        search_params.set("sessionId", sessionId);
      }
      url.search = search_params.toString();
      let new_url = url.toString();

      console.log(new_url);

      let res = await fetch(new_url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      console.log(res);
      return res;
    };
    try {
      const res = await getSpeakers();
      dispatch(
        speakerActions.FetchSpeakers({
          speakers: res.data.speakers,
        })
      );
    } catch (err) {
      dispatch(speakerActions.hasError(err.message));
      console.log(err);
    }
  };
export const errorTrackerForFetchSpeakers =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledError());
  };

export const fetchParticularSpeakerOfEvent =
  (id) => async (dispatch, getState) => {
    dispatch(speakerActions.startLoadingDetail());

    const fetchingSpeaker = async () => {
      //console.log(id, "I am passing from particularEvent action");

      const res = await fetch(
        `${BaseURL}speakers/${id}`,

        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();
      return result;
    };
    try {
      const result = await fetchingSpeaker();

      console.log(result);

      dispatch(
        speakerActions.FetchSpeaker({
          speaker: result.data.speaker,
        })
      );
    } catch (err) {
      dispatch(speakerActions.detailHasError(err.message));
      console.log(err);
    }
  };

export const errorTrackerForFetchParticularSpeakerOfEvent =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledDetailError());
  };

export const fetchSpeaker = (id) => async (dispatch, getState) => {
  dispatch(speakerActions.startLoading());

  const fetchingSpeaker = async () => {
    //console.log(id, "I am passing from particularEvent action");

    const res = await fetch(
      `${BaseURL}speakers/${id}/getSpeaker`,

      {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      }
    );

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    const result = await res.json();

    return result;
  };
  try {
    const result = await fetchingSpeaker();
    console.log(result);

    dispatch(
      speakerActions.FetchSpeaker({
        speaker: result.data.speaker,
      })
    );
    dispatch(
      userActions.CreateUser({
        user: result.data.speaker,
      })
    );
  } catch (err) {
    console.log(err);

    dispatch(speakerActions.hasError(err.message));
  }
};

export const errorTrackerForFetchSpeaker = () => async (dispatch, getState) => {
  dispatch(speakerActions.disabledError());
};

export const editSpeaker =
  (formValues, file, id) => async (dispatch, getState) => {
    dispatch(speakerActions.startLoadingDetail());

    try {
      if (file) {
        console.log(formValues);

        console.log(file);

        let uploadConfig = await fetch(
          `${BaseURL}upload/user/img`,

          {
            headers: {
              Authorization: `Bearer ${getState().auth.token}`,
            },
          }
        );

        if (!uploadConfig.ok) {
          if (!uploadConfig.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(uploadConfig.message);
          }
        }

        uploadConfig = await uploadConfig.json();
        console.log(uploadConfig);

        const awsRes = await fetch(uploadConfig.url, {
          method: "PUT",

          body: file,

          headers: {
            "Content-Type": file.type,
          },
        });

        console.log(awsRes);

        let res = await fetch(
          `${BaseURL}speakers/${id}/update`,

          {
            method: "PATCH",
            body: JSON.stringify({
              ...formValues,
              image: uploadConfig.key,
            }),

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().communityAuth.token}`,
            },
          }
        );
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }

        res = await res.json();
        console.log(res);

        dispatch(
          speakerActions.EditSpeaker({
            speaker: res.data.updatedSpeaker,
          })
        );
      } else {
        console.log(id);
        console.log(formValues);

        let res = await fetch(
          `${BaseURL}speakers/${id}/update`,

          {
            method: "PATCH",
            body: JSON.stringify({
              ...formValues,
            }),

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().communityAuth.token}`,
            },
          }
        );

        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }

        res = await res.json();
        console.log(res);

        dispatch(
          speakerActions.EditSpeaker({
            speaker: res.data.updatedSpeaker,
          })
        );
      }
    } catch (err) {
      dispatch(speakerActions.detailHasError(err.message));
    }
  };
export const errorTrackerForEditSpeaker = () => async (dispatch, getState) => {
  dispatch(speakerActions.disabledDetailError());
};

export const deleteSpeaker = (id) => async (dispatch, getState) => {
  dispatch(speakerActions.startLoading());
  const deletingSpeaker = async () => {
    let res = await fetch(`${BaseURL}speakers/${id}/delete`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    return res;
  };

  try {
    const res = await deletingSpeaker();
    console.log(res);

    dispatch(
      speakerActions.DeleteSpeaker({
        id: res.id,
      })
    );
  } catch (err) {
    console.log(err);
    dispatch(speakerActions.hasError(err.message));
  }
};

export const errorTrackerForDeletingSpeaker =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledError());
  };
// booths  actions

export const createBooth =
  (formValues, file, id) => async (dispatch, getState) => {
    dispatch(boothActions.startLoading());

    try {
      if (file) {
        console.log(formValues);
        console.log(file);

        let uploadConfig = await fetch(`${BaseURL}upload/user/img`, {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        });

        if (!uploadConfig.ok) {
          if (!uploadConfig.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(uploadConfig.message);
          }
        }
        uploadConfig = await uploadConfig.json();
        console.log(uploadConfig);

        const awsRes = await fetch(uploadConfig.url, {
          method: "PUT",

          body: file,

          headers: {
            "Content-Type": file.type,
          },
        });
        // const amazoneFile = await awsRes.json();
        // console.log(amazoneFile);
        console.log(awsRes);

        let res = await fetch(
          `${BaseURL}booths/${id}/addBooth`,

          {
            method: "POST",
            body: JSON.stringify({
              ...formValues,
              image: uploadConfig.key,
            }),

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().communityAuth.token}`,
            },
          }
        );
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        res = await res.json();
        console.log(res);

        dispatch(
          boothActions.CreateBooth({
            booth: res.data,
          })
        );
      } else {
        let res = await fetch(
          `${BaseURL}booths/${id}/addBooth`,

          {
            method: "POST",
            body: JSON.stringify({
              ...formValues,
            }),

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getState().communityAuth.token}`,
            },
          }
        );
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        res = await res.json();
        console.log(res);

        dispatch(
          boothActions.CreateBooth({
            booth: res.data,
          })
        );
      }
    } catch (err) {
      dispatch(boothActions.hasError(err.message));
    }
  };
export const errorTrackerForCreateBooth = () => async (dispatch, getState) => {
  dispatch(boothActions.disabledError());
};

export const fetchBooths = (id, term, tag) => async (dispatch, getState) => {
  dispatch(boothActions.startLoading());
  const getBooths = async () => {
    console.log(id);

    let fullLocation = `${BaseURL}booths/${id}/getAllbooths`;
    let url = new URL(fullLocation);
    let search_params = url.searchParams;

    if (term) {
      search_params.set("text", term);
    }
    if (tag && tag !== "all") {
      search_params.set("tag", tag);
    }
    url.search = search_params.toString();
    let new_url = url.toString();

    console.log(new_url);

    let res = await fetch(new_url, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);
    return res;
  };

  try {
    const res = await getBooths();

    dispatch(
      boothActions.FetchBooths({
        booths: res.data,
      })
    );
  } catch (err) {
    dispatch(boothActions.hasError(err.message));
    console.log(err);
  }
};

export const errorTrackerForFetchBooths = () => async (dispatch, getState) => {
  dispatch(boothActions.disabledError());
};

export const fetchBooth = (id) => async (dispatch, getState) => {
  try {
    console.log(id);

    let res = await fetch(`${BaseURL}booths/${id}/getBoothDetails`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      boothActions.FetchBooth({
        booth: res.data,
      })
    );
  } catch (err) {
    dispatch(boothActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForFetchBooth = () => async (dispatch, getState) => {
  dispatch(boothActions.disabledError());
};

export const editBooth =
  (formValues, file, id) => async (dispatch, getState) => {
    try {
      if (file) {
        console.log(formValues);

        console.log(file);

        let uploadConfig = await fetch(`${BaseURL}upload/user/img`, {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        });

        if (!uploadConfig.ok) {
          if (!uploadConfig.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(uploadConfig.message);
          }
        }
        uploadConfig = await uploadConfig.json();
        console.log(uploadConfig);

        const awsRes = await fetch(uploadConfig.url, {
          method: "PUT",

          body: file,

          headers: {
            "Content-Type": file.type,
          },
        });
        // const amazoneFile = await awsRes.json();
        // console.log(amazoneFile);
        console.log(awsRes);

        let res = await fetch(`${BaseURL}booths/${id}/updateBooth`, {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
            image: uploadConfig.key,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        res = await res.json();
        console.log(res);

        dispatch(
          boothActions.EditBooth({
            booth: res.data,
          })
        );
      } else {
        console.log(id);
        console.log(formValues);

        let res = await fetch(`${BaseURL}booths/${id}/updateBooth`, {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });

        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }

        res = await res.json();
        console.log(res);

        dispatch(
          boothActions.EditBooth({
            booth: res.data,
          })
        );
      }
    } catch (err) {
      boothActions.hasError(err.message);
    }
  };
export const errorTrackerForEditBooth = () => async (dispatch, getState) => {
  dispatch(boothActions.disabledError());
};

export const deleteBooth = (id) => async (dispatch, getState) => {
  try {
    let res = await fetch(`${BaseURL}booths/${id}/deleteBooth`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);

    dispatch(
      boothActions.DeleteBooth({
        id: res.data,
      })
    );
  } catch (err) {
    dispatch(boothActions.hasError(err.message));
  }
};
export const errorTrackerForDeleteBooth = () => async (dispatch, getState) => {
  dispatch(boothActions.disabledError());
};

// sponsors actions

export const createSponsor =
  (formValues, file, id) => async (dispatch, getState) => {
    dispatch(sponsorActions.startLoading());
    try {
      if (file) {
        console.log(formValues);
        console.log(file);

        let uploadConfig = await fetch(
          `${BaseURL}upload/user/img`,

          {
            headers: {
              Authorization: `Bearer ${getState().auth.token}`,
            },
          }
        );

        if (!uploadConfig.ok) {
          if (!uploadConfig.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(uploadConfig.message);
          }
        }

        uploadConfig = await uploadConfig.json();
        console.log(uploadConfig);

        const awsRes = await fetch(uploadConfig.url, {
          method: "PUT",

          body: file,

          headers: {
            "Content-Type": file.type,
          },
        });
        // const amazoneFile = await awsRes.json();
        // console.log(amazoneFile);
        console.log(awsRes);

        let res = await fetch(`${BaseURL}community/sponsors/${id}`, {
          method: "POST",
          body: JSON.stringify({
            ...formValues,
            image: uploadConfig.key,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        res = await res.json();
        console.log(res);

        dispatch(
          sponsorActions.CreateSponsor({
            sponsor: res.data,
          })
        );
      } else {
        console.log(id);
        console.log(formValues);

        let res = await fetch(`${BaseURL}community/sponsors/${id}`, {
          method: "POST",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }

        res = await res.json();
        console.log(res);

        dispatch(
          sponsorActions.CreateSponsor({
            sponsor: res.data,
          })
        );
      }
    } catch (err) {
      console.log(err);
      dispatch(sponsorActions.hasError(err.message));
    }
  };

export const errorTrackerForCreateSponsor =
  () => async (dispatch, getState) => {
    dispatch(sponsorActions.disabledError());
  };

export const fetchSponsor = (id) => async (dispatch, getState) => {
  dispatch(sponsorActions.startLoadingDetail());
  try {
    console.log(id);

    let res = await fetch(`${BaseURL}sponsors/${id}/getOne`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);

    dispatch(
      sponsorActions.FetchSponsor({
        sponsor: res.data,
      })
    );
  } catch (err) {
    console.log(err);

    dispatch(sponsorActions.detailHasError(err.message));
  }
};

export const errorTrackerForFetchSponsor = () => async (dispatch, getState) => {
  dispatch(sponsorActions.disabledDetailError());
};

export const fetchSponsors =
  (id, term, sponsorStatus) => async (dispatch, getState) => {
    dispatch(sponsorActions.startLoading());

    const getSponsors = async () => {
      let fullLocation = `${BaseURL}sponsors/${id}`;

      let url = new URL(fullLocation);
      let search_params = url.searchParams;

      if (term) {
        search_params.set("text", term);
      }
      if (sponsorStatus && sponsorStatus !== "all") {
        search_params.set("sponsorStatus", sponsorStatus);
      }
      url.search = search_params.toString();
      let new_url = url.toString();

      console.log(new_url);
      let res = await fetch(new_url, {
        method: "GET",

        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      console.log(res);
      return res;
    };
    try {
      const res = await getSponsors();
      dispatch(
        sponsorActions.FetchSponsors({
          sponsors: res.data,
        })
      );
    } catch (err) {
      dispatch(sponsorActions.hasError(err.message));
      console.log(err.response.data);
    }
  };

export const errorTrackerForFetchSponsors =
  () => async (dispatch, getState) => {
    dispatch(sponsorActions.disabledError());
  };

export const editSponsor =
  (formValues, file, id) => async (dispatch, getState) => {
    dispatch(sponsorActions.startLoadingDetail());
    try {
      if (file) {
        console.log(formValues);

        console.log(file);

        let uploadConfig = await fetch(`${BaseURL}upload/user/img`, {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        });
        if (!uploadConfig.ok) {
          if (!uploadConfig.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(uploadConfig.message);
          }
        }

        uploadConfig = await uploadConfig.json();
        console.log(uploadConfig);

        const awsRes = await fetch(uploadConfig.url, {
          method: "PUT",

          body: file,

          headers: {
            "Content-Type": file.type,
          },
        });
        console.log(awsRes);

        let res = await fetch(`${BaseURL}sponsors/${id}/update`, {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
            image: uploadConfig.key,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        res = await res.json();
        console.log(res);

        dispatch(
          sponsorActions.EditSponsor({
            sponsor: res.data,
          })
        );
      } else {
        console.log(id);
        console.log(formValues);

        let res = await fetch(`${BaseURL}sponsors/${id}/update`, {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        res = await res.json();
        console.log(res);

        dispatch(
          sponsorActions.EditSponsor({
            sponsor: res.data,
          })
        );
      }
    } catch (err) {
      dispatch(sponsorActions.detailHasError(err.message));
    }
  };
export const errorTrackerForEditSponsor = () => async (dispatch, getState) => {
  dispatch(sponsorActions.disabledDetailError());
};

export const deleteSponsor = (id) => async (dispatch, getState) => {
  dispatch(sponsorActions.startLoading());
  try {
    let res = await fetch(`${BaseURL}sponsors/${id}/delete`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);

    dispatch(
      sponsorActions.DeleteSponsor({
        id: res.data,
      })
    );
  } catch (err) {
    console.log(err);
    dispatch(sponsorActions.hasError(err.message));
  }
};
export const errorTrackerForDeleteSponsor =
  () => async (dispatch, getState) => {
    dispatch(sponsorActions.disabledError());
  };

//tickets actions

export const createTicket = (formValues, id) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoading());
  try {
    console.log(id);
    console.log(formValues);

    let res = await fetch(`${BaseURL}community/${id}/addTicket`, {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      ticketActions.CreateTicket({
        ticket: res.data,
      })
    );
  } catch (err) {
    console.log(err);
    dispatch(ticketActions.hasError(err.message));
  }
};
export const errorTrackerForCreateTicket = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledError());
};

export const fetchTickets = (id, term) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoading());

  const getTickets = async () => {
    console.log(id);
    let fullLocation = `${BaseURL}events/${id}/tickets`;

    let url = new URL(fullLocation);
    let search_params = url.searchParams;

    if (term) {
      search_params.set("text", term);
    }

    url.search = search_params.toString();
    let new_url = url.toString();

    console.log(new_url);

    let res = await fetch(new_url, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);

    return res;
  };
  try {
    const res = await getTickets();
    dispatch(
      ticketActions.FetchTickets({
        tickets: res.data.tickets,
      })
    );
  } catch (err) {
    dispatch(ticketActions.hasError(err.message));
    console.log(err);
  }
};

export const errorTrackerForFetchTickets = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledError());
};

export const fetchTicket = (id) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoadingDetail());

  try {
    console.log(id);

    let res = await fetch(`${BaseURL}events/${id}/ticket`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      ticketActions.FetchTicket({
        ticket: res.data,
      })
    );
  } catch (err) {
    dispatch(ticketActions.detailHasError(err.message));
  }
};
export const errorTrackerForFetchTicket = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledDetailError());
};
export const editTicket = (formValues, id) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoadingDetail());
  try {
    console.log(id);
    console.log(formValues);

    let res = await fetch(`${BaseURL}events/${id}/updateTicket`, {
      method: "PATCH",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      ticketActions.EditTicket({
        ticket: res.data,
      })
    );
  } catch (err) {
    dispatch(ticketActions.detailHasError(err.message));
  }
};
export const errorTrackerForEditTicket = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledDetailError());
};

export const deleteTicket = (id) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoading());

  try {
    console.log(id);

    let res = await fetch(`${BaseURL}events/${id}/deleteTicket`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      ticketActions.DeleteTicket({
        id: res.data,
      })
    );
  } catch (err) {
    dispatch(ticketActions.hasError(err.message));
  }
};
export const errorTrackerForDeleteTicket = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledError());
};
//navigations actions

export const navigationIndex = (activeIndex) => (dispatch) => {
  dispatch(
    navigationActions.activeIndex({
      currentIndex: activeIndex,
    })
  );
};
export const navigationIndexForCommunityDash = (activeIndex) => (dispatch) => {
  dispatch(
    navigationActions.activeIndexForCommunityDash({
      currentIndex: activeIndex,
    })
  );
};
export const navigationIndexForEditEvent = (activeIndex) => (dispatch) => {
  dispatch(
    navigationActions.activeIndexForEditEvent({
      currentIndex: activeIndex,
    })
  );
};
export const navigationIndexForSpecificEvent = (activeIndex) => (dispatch) => {
  dispatch(
    navigationActions.activeIndexForSpecificEvent({
      currentIndex: activeIndex,
    })
  );
};
export const navigationIndexForHostingPlatform =
  (activeIndex) => (dispatch) => {
    dispatch(
      navigationActions.activeIndexForHostingPlatform({
        currentIndex: activeIndex,
      })
    );
  };

//alias routes
export const madeJustForYou = () => async (dispatch) => {
  dispatch(eventActions.startLoading());
  try {
    const res = await eureka.get("eureka/v1/exploreEvents/madeJustForYou");
    console.log(res.data, "This is made just for you");

    dispatch(
      eventActions.FetchEvents({
        events: res.data,
      })
    );
  } catch (err) {
    dispatch(eventActions.hasError(err.message));
  }
};

export const errorTrackerForMadeJustForYou =
  () => async (dispatch, getState) => {
    dispatch(eventActions.disabledError());
  };

//user actions

// export const createUser = (formValues, id) => async (dispatch, getState) => {
//   console.log(id);
//   console.log(formValues);

//   dispatch( speakerActions.startLoading());
//   try {
//     console.log(id);
//     console.log(formValues);
//     let res = await fetch(
//       `${BaseURL}events/${id}/addSpeaker`,
//       {
//         method: "POST",
//         body: JSON.stringify({
//           ...formValues,
//         }),

//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getState().auth.token}`,
//         },
//       }
//     );
//     if (!res.ok) {
//       if (!res.message) {
//         throw new Error("Something went wrong");
//       } else {
//         throw new Error(res.message);
//       }
//     }
//     res = await res.json();
//     console.log(res);

//     dispatch(
//       speakerActions.CreateSpeaker({
//         speaker: res.data,
//       })
//     );
//   } catch (err) {
//     dispatch( speakerActions.startLoading());
//   }
// };

// export const errorTrackerForCreateSpeaker = () => async (dispatch, getState) => {
//   dispatch(ticketActions.disabledError());
// };

export const fetchLobbyUsers = (users) => async (dispatch, getState) => {
  try {
    console.log(users);
    dispatch(
      userActions.FetchUsers({
        users: users,
      })
    );
  } catch (err) {
    console.log(err);
  }
};

export const fetchUsers = (id) => async (dispatch, getState) => {
  try {
    console.log(id);

    let res = await fetch(`${BaseURL}events/${id}/speakers`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      speakerActions.FetchSpeakers({
        speakers: res.data.speakers.speaker,
      })
    );
  } catch (err) {
    console.log(err);

    dispatch(speakerActions.hasError(err.message));
  }
};
export const errorTrackerForFetchSpeakers2 =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledError());
  };
export const fetchUser = (formValues) => async (dispatch, getState) => {
  dispatch(userActions.startLoading());

  try {
    const res = await fetch(`${BaseURL}users/Me`, {
      headers: {
        //  "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    const result = await res.json();
    console.log(result);
    // console.warn(xhr.responseText)
    console.log(result.data.userData);
    dispatch(
      userActions.FetchUser({
        user: result.data.userData,
      })
    );
  } catch (err) {
    console.log(err);

    dispatch(userActions.hasError(err.message));
  }
};
export const errorTrackerForFetchuser = () => async (dispatch, getState) => {
  dispatch(speakerActions.disabledError());
};

export const editUser = (formValues, file) => async (dispatch, getState) => {
  dispatch(userActions.startLoading());
  const editingUser = async () => {
    if (file) {
      console.log(formValues);

      console.log(file);

      let uploadConfig = await fetch(`${BaseURL}upload/user/img`, {
        headers: {
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });

      if (!uploadConfig.ok) {
        throw new Error("Editing user details failed!");
      }
      if (!uploadConfig.ok) {
        if (!uploadConfig.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(uploadConfig.message);
        }
      }

      uploadConfig = await uploadConfig.json();
      console.log(uploadConfig);

      const awsRes = await fetch(uploadConfig.url, {
        method: "PUT",

        body: file,

        headers: {
          "Content-Type": file.type,
        },
      });
      // const amazoneFile = await awsRes.json();
      // console.log(amazoneFile);
      console.log(awsRes);

      const res = await fetch(`${BaseURL}users/updateMe`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formValues,
          image: uploadConfig.key,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();

      return result;

      // console.log(result);
      // // console.warn(xhr.responseText)
      // console.log(result.data.userData);
      // dispatch(
      //   userActions.EditUser({
      //     user: result.data.userData,
      //   })
      // );
    } else {
      const res = await fetch(`${BaseURL}users/updateMe`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();
      return result;
    }
  };
  try {
    const result = await editingUser();
    console.log(result);
    // console.warn(xhr.responseText)
    console.log(result.data.userData);
    dispatch(
      userActions.EditUser({
        user: result.data.userData,
      })
    );
    setTimeout(function () {
      dispatch(userActions.disableSucceded());
    }, 4000);
  } catch (err) {
    dispatch(userActions.hasError(err.message));
    console.log(err);
  }
};

export const errorTrackerForEditUser = () => async (dispatch, getState) => {
  dispatch(userActions.disabledError());
};

export const editUserPassword = (formValues) => async (dispatch, getState) => {
  dispatch(userActions.startLoading());
  try {
    console.log(formValues);

    const res = await fetch(`${BaseURL}users/updatePassword`, {
      method: "PATCH",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    const result = await res.json();
    console.log(result);
    dispatch(
      userActions.EditUser({
        user: result.data.userData,
      })
    );
    dispatch(
      authActions.SignIn({
        token: result.token,
      })
    );
  } catch (err) {
    dispatch(userActions.hasError(err.message));
  }
};
export const errorTrackerForEditUserPassword =
  () => async (dispatch, getState) => {
    dispatch(userActions.disabledError());
  };
export const errorTrackerForEditUserPassword2 =
  () => async (dispatch, getState) => {
    dispatch(userActions.disabledError());
  };
export const deleteUser = () => (dispatch, getState) => {
  //not implemented yet
};

//community actions

export const fetchCommunity = (id) => async (dispatch, getState) => {
  dispatch(communityActions.startLoading());
  try {
    const res = await fetch(`${BaseURL}community/${id}/getCommunity`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    const result = await res.json();
    console.log(result);

    dispatch(
      communityActions.FetchCommunity({
        community: result.data.community,
      })
    );
  } catch (err) {
    dispatch(communityActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForFetchCommunity =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };

export const editCommunity = (id, formValues) => async (dispatch, getState) => {
  dispatch(communityActions.startLoading());
  try {
    const res = await fetch(`${BaseURL}community/${id}/updateCommunity`, {
      method: "PATCH",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    const result = await res.json();

    console.log(result);
    dispatch(
      communityActions.EditCommunity({
        community: result.community,
      })
    );
  } catch (err) {
    dispatch(communityActions.hasError(err.message));
  }
};

export const errorTrackerForEditCommunity =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };

export const deleteCommunity = (id) => async (dispatch, getState) => {
  dispatch(communityActions.startLoading());
  try {
    const res = await fetch(
      `${BaseURL}community/${id}`,

      {
        method: "GET",
      }
    );
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    const result = await res.json();

    console.log(result);
    dispatch(
      communityActions.FetchCommunity({
        community: result.community,
      })
    );
  } catch (err) {
    dispatch(communityActions.hasError(err.message));
  }
};
///session actions
export const errorTrackerForDeleteCommunity =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };
export const createSession = (formValues, id) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoading());
  try {
    console.log(id);
    console.log(formValues);

    let res = await fetch(`${BaseURL}events/${id}/addSession`, {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      sessionActions.CreateSession({
        session: res.data,
      })
    );

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "New session added successfully!",
        severity: "success",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);


  } catch (err) {
    console.log(err);

    dispatch(sessionActions.hasError(err.message));

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Adding session failed. Please try again later.",
        severity: "error",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);
   
  }
};
export const errorTrackerForCreateSession =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };
export const fetchSessions = (id, term) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoading());
  const getSessions = async () => {
    console.log(id);
    let fullLocation = `${BaseURL}events/${id}/sessions`;
    let url = new URL(fullLocation);
    let search_params = url.searchParams;

    if (term) {
      search_params.set("text", term);
    }

    url.search = search_params.toString();
    let new_url = url.toString();

    console.log(new_url);

    let res = await fetch(new_url, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);
    console.log(res.data.sessions);
    return res;
  };
  try {
    const res = await getSessions();
    dispatch(
      sessionActions.FetchSessions({
        sessions: res.data.sessions,
      })
    );
  } catch (err) {

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Fetching sessions failed. Please try again later.",
        severity: "error",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);

    dispatch(sessionActions.hasError(err.message));
    console.log(err);
  }
};

export const errorTrackerForFetchSessions =
  () => async (dispatch, getState) => {
    dispatch(sessionActions.disabledError());
  };

export const fetchSessionsForUser =
  (id, term) => async (dispatch, getState) => {
    dispatch(sessionActions.startLoading());
    try {
      console.log(id);
      let fullLocation = `${BaseURL}events/${id}/sessionsForUser`;
      let url = new URL(fullLocation);
      let search_params = url.searchParams;

      if (term) {
        search_params.set("text", term);
      }

      url.search = search_params.toString();
      let new_url = url.toString();

      console.log(new_url);

      let res = await fetch(new_url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      console.log(res);
      console.log(res.data.sessions);
      dispatch(
        sessionActions.FetchSessions({
          sessions: res.data.sessions,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(sessionActions.hasError(err.message));

      dispatch(
        snackbarActions.openSnackBar({
          message:
          "Fetching sessions failed. Please try again later.",
          severity: "error",
        })
      );
  
      setTimeout(function () {
        closeSnackbar();
      }, 6000);
    }
  };
export const errorTrackerForFetchSessionsForUser =
  () => async (dispatch, getState) => {
    dispatch(sessionActions.disabledError());
  };
export const fetchSession = (id) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoading());
  try {
    console.log(id);

    let res = await fetch(
      `${BaseURL}events/${id}/sessions`,

      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      }
    );
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      sessionActions.FetchSession({
        sessions: res.data.sessions.session,
      })
    );
  } catch (err) {
    console.log(err);
    dispatch(sessionActions.hasError(err.message));

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Fetching sessions failed. Please try again later.",
        severity: "error",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);
  }
};
export const errorTrackerForFetchSession = () => async (dispatch, getState) => {
  dispatch(sessionActions.disabledError());
};
export const fetchSessionForSessionStage =
  (id) => async (dispatch, getState) => {
    try {
      console.log(id);

      let res = await fetch(`${BaseURL}sessions/${id}/getOneSession`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });

      res = await res.json();
      console.log(res);
      console.log(res.data.session);

      dispatch(
        sessionActions.FetchSession({
          session: res.data.session,
        })
      );
    } catch (err) {


      dispatch(
        snackbarActions.openSnackBar({
          message:
          "Fetching sessions failed. Please try again later.",
          severity: "error",
        })
      );
  
      setTimeout(function () {
        closeSnackbar();
      }, 6000);
      dispatch(sessionActions.hasError(err.message));
    }
  };
export const errorTrackerForFetchSessionForSessionStage =
  () => async (dispatch, getState) => {
    dispatch(sessionActions.disabledError());
  };
export const fetchParticularSessionOfEvent =
  (id) => async (dispatch, getState) => {
    dispatch(sessionActions.startLoadingDetail());
    try {
      const existingSession = getState().session.sessions.find((session) => {
        return session.id === id;
      });

      console.log(existingSession);
      if (!existingSession) {
        //console.log(id, "I am passing from particularEvent action");

        const res = await fetch(
          `${BaseURL}sessions/${id}`,

          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getState().communityAuth.token}`,
            },
          }
        );

        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }

        const result = await res.json();

        console.log(result);

        dispatch(
          sessionActions.FetchSession({
            session: result.data.session,
          })
        );
      } else {
        dispatch(
          sessionActions.FetchSession({
            session: existingSession,
          })
        );
      }
    } catch (err) {

      dispatch(
        snackbarActions.openSnackBar({
          message:
          "Fetching session details failed please try again later!",
          severity: "error",
        })
      );
  
      setTimeout(function () {
        closeSnackbar();
      }, 6000);
    
      dispatch(sessionActions.detailHasError(err.message));
      console.log(err);
    }
  };

export const errorTrackerForFetchParticularSessionOfEvent =
  () => async (dispatch, getState) => {
    dispatch(sessionActions.disabledDetailError());
  };

export const editSession = (formValues, id) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoadingDetail());
  try {
    console.log(formValues);

    const res = await fetch(`${BaseURL}sessions/${id}/update`, {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    const result = await res.json();

    console.log(result, result.data);
    console.log(result.data);
    dispatch(
      sessionActions.EditSession({
        session: result.data.updatedSession,
      })
    );


    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Session updated successfully!",
        severity:"success",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);
    


   
  } catch (err) {
    dispatch(sessionActions.detailHasError(err.message));

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Failed to update session. Please try again later!",
        severity:"error",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);

  }
};
export const errorTrackerForEditSession = () => async (dispatch, getState) => {
  dispatch(sessionActions.disabledDetailError());
};
export const deleteSession = (id) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoading());

  try {
    console.log(id);

    let res = await fetch(`${BaseURL}sessions/${id}/delete`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      sessionActions.DeleteSession({
        id: res.data.id,
      })
    );

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Session removed successfully!",
        severity:"success",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);

  } catch (err) {
    dispatch(sessionActions.hasError(err.message));
    console.log(err);

    dispatch(
      snackbarActions.openSnackBar({
        message:
        "Deleting session failed. Please try again later.",
        severity:"error",
      })
    );

    setTimeout(function () {
      closeSnackbar();
    }, 6000);

  }
};
export const errorTrackerForDeleteSession =
  () => async (dispatch, getState) => {
    dispatch(sessionActions.disabledError());
  };
export const fetchNetworking = (id) => async (dispatch, getState) => {
  dispatch(networkingActions.startLoading());

  const getNetworkSettings = async () => {
    console.log(id);

    let res = await fetch(`${BaseURL}events/${id}/getNetworkSettings`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);

    return res;
  };
  try {
    const res = await getNetworkSettings();
    dispatch(
      networkingActions.FetchNetworking({
        settings: res.data.networkingSettings,
      })
    );
  } catch (err) {
    dispatch(networkingActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForFetchNetworking =
  () => async (dispatch, getState) => {
    dispatch(networkingActions.disabledError());
  };

export const editNetworking =
  (formValues, id) => async (dispatch, getState) => {
    dispatch(networkingActions.startLoading());
    try {
      console.log(id);

      let res = await fetch(`${BaseURL}events/${id}/updateNetworking`, {
        method: "PATCH",

        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res.data);

      dispatch(
        networkingActions.EditNetworking({
          settings: res.data.networkingSettings,
        })
      );
    } catch (err) {
      networkingActions.hasError(err.message);
      console.log(err);
    }
  };
export const errorTrackerForEditNetworking =
  () => async (dispatch, getState) => {
    dispatch(networkingActions.disabledError());
  };

export const createCoupon = (formValues) => async (dispatch, getState) => {
  dispatch(couponActions.startLoading());
  try {
    console.log(formValues);

    let res = await fetch(`${BaseURL}community/coupons/createNew`, {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      couponActions.CreateCoupon({
        coupon: res.data,
      })
    );
  } catch (err) {
    dispatch(couponActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForCreateCoupon = () => async (dispatch, getState) => {
  dispatch(couponActions.disabledError());
};

export const fetchCoupons = () => async (dispatch, getState) => {
  dispatch(couponActions.startLoading());

  const getCoupons = async () => {
    let res = await fetch(`${BaseURL}community/coupons`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res);
    return res;
  };
  try {
    const res = await getCoupons();
    dispatch(
      couponActions.FetchCoupons({
        coupons: res.data,
      })
    );
  } catch (err) {
    dispatch(couponActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForFetchCoupons = () => async (dispatch, getState) => {
  dispatch(couponActions.disabledError());
};

export const fetchCoupon = (id) => async (dispatch, getState) => {
  dispatch(couponActions.startLoadingDetail());

  try {
    console.log(id);

    let res = await fetch(`${BaseURL}community/${id}/getOneCoupon`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      couponActions.FetchCoupon({
        coupon: res.data,
      })
    );
  } catch (err) {
    dispatch(couponActions.detailHasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForFetchCoupon = () => async (dispatch, getState) => {
  dispatch(couponActions.disabledDetailError());
};

export const editCoupon = (formValues, id) => async (dispatch, getState) => {
  dispatch(couponActions.startLoadingDetail());
  try {
    let res = await fetch(`${BaseURL}community/${id}/updateCoupon`, {
      method: "PATCH",

      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res.data);

    dispatch(
      couponActions.EditCoupon({
        coupon: res.data,
      })
    );
  } catch (err) {
    dispatch(couponActions.detailHasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForEditCoupon = () => async (dispatch, getState) => {
  dispatch(couponActions.disabledDetailError());
};

export const deleteCoupon = (id) => async (dispatch, getState) => {
  dispatch(couponActions.startLoading());

  try {
    console.log(id);

    let res = await fetch(`${BaseURL}community/${id}/deleteCoupon`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      couponActions.DeleteCoupon({
        id: res.data.id,
      })
    );
  } catch (err) {
    dispatch(couponActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForDeleteCoupon = () => async (dispatch, getState) => {
  dispatch(couponActions.disabledError());
};

export const getStripeConnectLink =
  (userId, communityId) => async (dispatch, getState) => {
    console.log("I entered connect to stripe action");
    try {
      let res = await fetch(`${BaseURL}stripe/getConnectFlowLink`, {
        method: "POST",

        body: JSON.stringify({
          return_url: `https://6031-182-70-236-184.ngrok.io/check-stripe-status/user/${userId}/community/${communityId}/account/`,
          refresh_url: `https://6031-182-70-236-184.ngrok.io/not-onboarded-yet/user/${userId}/community/${communityId}/account/`,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });

      res = await res.json();
      console.log(res);
      window.location.href = res.links.url;
    } catch (err) {
      console.log(err);
    }
  };

export const getEventRegistrationCheckoutSession =
  (formValues) => async (dispatch, getState) => {
    console.log(formValues);
    try {
      const res = await fetch(`${BaseURL}stripe/createCheckoutSession`, {
        method: "POST",

        body: JSON.stringify(formValues),

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${getState().auth.token}`,
        },
      });

      const result = await res.json();
      console.log(result);

      window.location.href = result.session.url;
    } catch (error) {
      console.log(error);
    }
  };

export const createQuery = (formValues) => async (dispatch, getState) => {
  try {
    console.log(formValues);

    let res = await fetch(`${BaseURL}users/query/createNew`, {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });

    res = await res.json();
    console.log(res);

    // dispatch(
    //   couponActions.CreateCoupon({
    //     coupon: res.data,
    //   })
    // );
  } catch (err) {
    console.log(err);
  }
};

export const createCommunityFeedback =
  (formValues) => async (dispatch, getState) => {
    try {
      console.log(formValues);

      let res = await fetch(`${BaseURL}feedback/community`, {
        method: "POST",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });

      res = await res.json();
      console.log(res);

      // dispatch(
      //   couponActions.CreateCoupon({
      //     coupon: res.data,
      //   })
      // );
    } catch (err) {
      console.log(err);
    }
  };

export const fetchQueriesForCommunity =
  (term, event, answerStatus, userRegistrationStatus) =>
  async (dispatch, getState) => {
    dispatch(queriesActions.startLoading());

    console.log(term, event, answerStatus, userRegistrationStatus);
    const fetchQueries = async () => {
      let fullLocation = `${BaseURL}community/queries/getAll`;
      let url = new URL(fullLocation);
      let search_params = url.searchParams;

      if (term) {
        search_params.set("text", term);
      }
      if (event && event !== "all") {
        search_params.set("event", event);
      }
      if (answerStatus && answerStatus !== "all") {
        search_params.set("answerStatus", answerStatus);
      }
      if (userRegistrationStatus && userRegistrationStatus !== "all") {
        search_params.set("userRegistrationStatus", userRegistrationStatus);
      }

      url.search = search_params.toString();
      let new_url = url.toString();

      console.log(new_url);
      let res = await fetch(new_url, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };
    try {
      const res = await fetchQueries();
      console.log(res);

      dispatch(
        queriesActions.FetchQueries({
          queries: res.data,
        })
      );
    } catch (err) {
      dispatch(queriesActions.hasError(err.message));
      console.log(err.response.data);
    }
  };
export const errorTrackerForfetchQueriesForCommunity =
  () => async (dispatch, getState) => {
    dispatch(queriesActions.disabledError());
  };

export const answerQuery = (answerText, id) => async (dispatch, getState) => {
  dispatch(queriesActions.startLoading());

  try {
    let res = await fetch(`${BaseURL}community/queries/createAnswer`, {
      method: "PATCH",
      body: JSON.stringify({
        answerText: answerText,
        queryId: id,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      queriesActions.EditQuery({
        query: res.data,
      })
    );
  } catch (err) {
    console.log(err);

    dispatch(queriesActions.hasError(err.message));
  }
};
export const errorTrackerForAnswerQuery = () => async (dispatch, getState) => {
  dispatch(queriesActions.disabledError());
};

export const googleLinkClicked = () => async (dispatch, getState) => {
  dispatch(
    googleAuthActions.TrackerGoogleLogin({
      isClicked: true,
    })
  );
};

export const forgotPassword = (formValues) => async (dispatch, getState) => {
  try {
    let res = await fetch(`${BaseURL}users/forgotPassword`, {
      method: "POST",
      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });

    res = await res.json();
    console.log(res);

    // dispatch(
    //   queriesActions.EditQuery({
    //     query: res.data,
    //   })
    // );
  } catch (err) {
    console.log(err);
  }
};
export const resetPassword =
  (formValues, token) => async (dispatch, getState) => {
    dispatch(authActions.startLoading());
    dispatch(userActions.startLoading());

    try {
      let res = await fetch(`${BaseURL}users/resetPassword/${token}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        authActions.SignIn({
          token: res.token,

          isSignedIn: true,
        })
      );
      dispatch(
        userActions.CreateUser({
          user: res.data.user,
        })
      );
      window.location.href = REACT_APP_MY_ENV
        ? "http://localhost:3001/user/home"
        : "https://www.bluemeet.in/user/home";
    } catch (err) {
      console.log(err);
      dispatch(userActions.hasError(err.message));
      dispatch(authActions.hasError(err.message));
    }
  };
export const errorTrackerForResetPassword =
  () => async (dispatch, getState) => {
    dispatch(userActions.disabledError());
    dispatch(authActions.disabledError());
  };
export const fetchRegistrationsOfParticularCommunity =
  (communityId) => async (dispatch, getState) => {
    dispatch(registrationActions.startLoading());

    const fetchRegistration = async () => {
      console.log(communityId);

      let res = await fetch(`${BaseURL}registrations/community/getAll`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      console.log(res);

      return res;
    };
    try {
      const res = await fetchRegistration();
      dispatch(
        registrationActions.FetchRegistrations({
          registrations: res.data,
        })
      );
    } catch (err) {
      dispatch(registrationActions.hasError(err.message));
      console.log(err);
    }
  };
export const errorTrackerForfetchRegistrationsOfParticularCommunity =
  () => async (dispatch, getState) => {
    dispatch(registrationActions.disabledError());
  };

export const fetchRegistrationsOfParticularEvent =
  (eventId) => async (dispatch, getState) => {
    dispatch(registrationActions.startLoading());

    const fetchRegistration = async () => {
      console.log(eventId);

      let res = await fetch(
        `${BaseURL}registrations/event/${eventId}/getAllRegistration`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      console.log(res);

      return res;
    };
    try {
      const res = await fetchRegistration();
      dispatch(
        registrationActions.FetchRegistrations({
          registrations: res.data,
        })
      );
    } catch (err) {
      dispatch(registrationActions.hasError(err.message));
      console.log(err);
    }
  };
export const errorTrackerForFetchRegistrationsOfParticularEvent =
  () => async (dispatch, getState) => {
    dispatch(registrationActions.disabledError());
  };

export const fetchParticularRegistration =
  (id) => async (dispatch, getState) => {
    dispatch(registrationActions.startLoading());
    try {
      console.log(id);

      let res = await fetch(`${BaseURL}registrations/${id}/getOne`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        registrationActions.FetchRegistration({
          registration: res.data,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(registrationActions.hasError(err.message));
    }
  };
export const errorTrackerForFetchParticularRegistration =
  () => async (dispatch, getState) => {
    dispatch(registrationActions.disabledError());
  };

export const createNewInvitation =
  (formValues) => async (dispatch, getState) => {
    try {
      console.log(formValues);

      let res = await fetch(`${BaseURL}team-invites/create-new`, {
        method: "POST",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      });

      res = await res.json();
      console.log(res);

      dispatch(
        communityActions.SendTeamInvitation({
          invitation: res.newlyCreatedInvitation,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export const generateEventAccessToken =
  (id, email, role, eventId, communityId) => async (dispatch, getState) => {
    try {
      console.log(id, role, eventId);

      dispatch(
        eventAccessActions.CreateEventAccess({
          role: role,
          id: id,
          email: email,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export const setSessionRoleAndJoinSession =
  (sessionRole, sessionId, eventId, communityId) =>
  async (dispatch, getState) => {
    // dispatch(eventAccessActions.startLoading())
    try {
      console.log(sessionRole, sessionId);

      dispatch(
        eventAccessActions.setSessionRole({
          sessionRole: sessionRole,
        })
      );
    } catch (err) {
      console.log(err);
      // dispatch(eventAccessActions.hasError(err.message))
    }
  };

export const createSocket = (socket) => async (dispatch, getState) => {
  try {
    dispatch(
      socketActions.CreateSocket({
        socket: socket,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

// export const getCurrentUsers = (eventId) => async (dispatch, getState) => {
//   try{
//       console.log(eventId);

//       let res = await fetch(
//         `${BaseURL}getCurrentUsers/${eventId}`,
//         {
//           method: "GET",

//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getState().auth.token}`,
//           },
//         }
//       );

//       res = await res.json();
//       console.log(res);

//   }
//   catch(error) {
//     console.log(error);
//   }
// }

export const fetchChairArrangement =
  (roomChairs) => async (dispatch, getState) => {
    dispatch(roomsActions.HasChanged({}));

    dispatch(
      roomsActions.FetchRoomsChairs({
        chairs: roomChairs,
      })
    );
  };

export const fetchNumberOfPeopleOnTable =
  (numberOfPeopleOnTable) => async (dispatch, getState) => {
    dispatch(
      roomsActions.FetchNumOfPeopleOnTable({
        numberOfPeopleOnTable: numberOfPeopleOnTable,
      })
    );
  };

export const getRTMTokenForSpeaker =
  (eventId, speakerId) => async (dispatch, getState) => {
    dispatch(RTMActions.startLoading());

    const fetchingRTMToken = async () => {
      let res = await fetch(`${BaseURL}getRTMTokenForSpeaker`, {
        method: "POST",
        body: JSON.stringify({
          eventId: eventId,
          speakerId: speakerId,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };
    try {
      let res = await fetchingRTMToken();
      console.log(res);
      const appID = "6877e158655f4810968b19e65d0bbb23";

      const client = AgoraRTM.createInstance(appID);

      await client.login(
        {
          uid: speakerId,
          token: res.token,
        },
        () => {
          console.log("logged In Successfully");
        },
        () => {
          console.log("log in failed");
        }
      );
      dispatch(
        RTMActions.fetchRTMToken({
          token: res.token,
        })
      );
      dispatch(
        RTMActions.fetchRTMClient({
          RTMClient: client,
        })
      );
    } catch (err) {
      dispatch(RTMActions.hasError(err.message));
    }
  };
export const errorTrackerForGetRTMTokenForSpeaker =
  () => async (dispatch, getState) => {
    dispatch(RTMActions.disabledError());
  };

export const getRTMToken = (eventId) => async (dispatch, getState) => {
  dispatch(RTMActions.startLoading());

  const fetchingRTMToken = async () => {
    let res = await fetch(`${BaseURL}getRTMToken`, {
      method: "POST",
      body: JSON.stringify({
        eventId: eventId,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    return res;
  };
  try {
    let res = await fetchingRTMToken();
    console.log(res);
    const appID = "6877e158655f4810968b19e65d0bbb23";

    const client = AgoraRTM.createInstance(appID);

    await client.login(
      {
        uid: getState().user.userDetails._id,
        token: res.token,
      },
      () => {
        console.log("logged In Successfully");
      },
      () => {
        console.log("log in failed");
      }
    );
    dispatch(
      RTMActions.fetchRTMToken({
        token: res.token,
      })
    );
    dispatch(
      RTMActions.fetchRTMClient({
        RTMClient: client,
      })
    );
  } catch (err) {
    dispatch(RTMActions.hasError(err.message));
  }
};
export const errorTrackerForgetRTMToken = () => async (dispatch, getState) => {
  dispatch(RTMActions.disabledError());
};

export const channelJoinedTracker = () => async (dispatch, getState) => {
  dispatch(RTMActions.joinChannelTracker());
};

export const connectToRTMServer = (client) => async (dispatch, getState) => {
  dispatch(
    RTMActions.fetchRTMClient({
      RTMClient: client,
    })
  );
};

export const fetchEventChats = (chats) => async (dispatch, getState) => {
  dispatch(eventChatActions.startLoading());
  try {
    dispatch(
      eventChatActions.FetchEventChats({
        eventChats: chats,
      })
    );
  } catch (err) {
    dispatch(eventChatActions.hasError(err.message));
  }
};

export const fetchSessionChats = (chats) => async (dispatch, getState) => {
  dispatch(sessionChatActions.startLoading());
  try {
    dispatch(
      sessionChatActions.FetchSessionChats({
        sessionChats: chats,
      })
    );
  } catch (err) {
    dispatch(sessionChatActions.hasError(err.message));
  }
};

export const errorTrackerForfetchEventChats =
  () => async (dispatch, getState) => {
    dispatch(eventChatActions.disabledError());
  };

export const fetchPreviousEventChatMessages =
  (eventId) => async (dispatch, getState) => {
    dispatch(eventChatActions.startLoading());
    try {
      console.log(eventId);

      let res = await fetch(`${BaseURL}getPreviousEventMsg/${eventId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        eventChatActions.FetchEventChats({
          eventChats: res.data.chatMessages,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
export const errorTrackerForFetchPreviousEventChatMessages =
  () => async (dispatch, getState) => {
    dispatch(eventChatActions.disabledError());
  };

export const fetchPreviousEventPolls =
  (eventId) => async (dispatch, getState) => {
    dispatch(eventPollActions.startLoading());
    try {
      console.log(eventId);

      let res = await fetch(`${BaseURL}getPreviousEventPolls/${eventId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        eventPollActions.FetchEventPolls({
          eventPolls: res.data.polls,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
export const errorTrackerForFetchPreviousEventPolls =
  () => async (dispatch, getState) => {
    dispatch(eventPollActions.disabledError());
  };

export const fetchPreviousSessionChatMessages =
  (sessionId) => async (dispatch, getState) => {
    dispatch(sessionChatActions.startLoading());
    try {
      console.log(sessionId);

      let res = await fetch(`${BaseURL}getPreviousSessionMsg/${sessionId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        sessionChatActions.FetchSessionChats({
          sessionChats: res.data.chatMessages,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
export const errorTrackerForFetchPreviousSessionChatMessages =
  () => async (dispatch, getState) => {
    dispatch(sessionChatActions.disabledError());
  };

export const fetchPreviousEventAlerts =
  (eventId) => async (dispatch, getState) => {
    dispatch(eventAlertActions.startLoading());
    try {
      console.log(eventId);

      let res = await fetch(`${BaseURL}getPreviousEventAlert/${eventId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        eventAlertActions.FetchEventAlerts({
          eventAlerts: res.data.alerts,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };
export const errorTrackerForFetchPreviousEventAlerts =
  () => async (dispatch, getState) => {
    dispatch(eventAlertActions.disabledError());
  };

export const getRTCToken =
  (sessionId, role, eventId, communityId) => async (dispatch, getState) => {
    dispatch(RTCActions.startLoading());

    const fetchingRTCToken = async () => {
      let res = await fetch(`${BaseURL}getLiveStreamingToken`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: sessionId,
          role: role,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };
    try {
      let res = await fetchingRTCToken();
      console.log(res);

      dispatch(
        RTCActions.fetchRTCToken({
          token: res.token,
        })
      );

      history.push(
        `/community/${communityId}/event/${eventId}/hosting-platform/session/${sessionId}`
      );
    } catch (err) {
      alert(err);
      dispatch(RTCActions.hasError(err.message));
    }
  };

export const getRTCTokenForJoiningTable =
  (tableId, userId, launchTableScreen) => async (dispatch, getState) => {
    dispatch(RTCActions.startLoading());

    const fetchingRTCToken = async () => {
      let res = await fetch(`${BaseURL}getLiveStreamingTokenForJoiningTable`, {
        method: "POST",
        body: JSON.stringify({
          tableId: tableId,
          userId: userId,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };
    try {
      let res = await fetchingRTCToken();
      console.log(res);

      dispatch(
        RTCActions.fetchRTCToken({
          token: res.token,
        })
      );

      launchTableScreen();
    } catch (err) {
      alert(err);
      dispatch(RTCActions.hasError(err.message));
    }
  };

export const getRTCTokenForScreenShare =
  (sessionId, uid, startScreenCall) => async (dispatch, getState) => {
    dispatch(RTCActions.startLoading());

    const fetchingRTCToken = async () => {
      let res = await fetch(`${BaseURL}getLiveStreamingTokenForScreenShare`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: sessionId,
          uid: `screen_${uid}`,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };
    try {
      let res = await fetchingRTCToken();
      console.log(res);

      dispatch(
        RTCActions.fetchRTCScreenToken({
          ScreenToken: res.token,
        })
      );

      startScreenCall();
    } catch (err) {
      alert(err);
      dispatch(RTCActions.hasError(err.message));
    }
  };

export const getRTCTokenForSpeaker =
  (sessionId, role, eventId, communityId, speakerId) =>
  async (dispatch, getState) => {
    dispatch(RTCActions.startLoading());

    const fetchingRTCToken = async () => {
      let res = await fetch(`${BaseURL}getLiveStreamingTokenForSpeaker`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: sessionId,
          role: role,
          speakerId: speakerId,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      res = await res.json();
      return res;
    };

    try {
      let res = await fetchingRTCToken();
      console.log(res);

      dispatch(
        RTCActions.fetchRTCToken({
          token: res.token,
        })
      );

      history.push(
        `/community/${communityId}/event/${eventId}/hosting-platform/session/${sessionId}`
      );
    } catch (err) {
      alert(err);
      dispatch(RTCActions.hasError(err.message));
    }
  };

export const errorTrackerForFetchingRTCToken =
  () => async (dispatch, getState) => {
    dispatch(RTCActions.disabledError());
  };
export const resetAuthError = () => async (dispatch, getState) => {
  dispatch(authActions.ResetError());
};

export const resetUserError = () => async (dispatch, getState) => {
  dispatch(userActions.ResetError());
};

export const resetCommunityError = () => async (dispatch, getState) => {
  dispatch(communityActions.ResetError());
};

export const createDemoRequest = (formValues) => async (dispatch, getState) => {
  dispatch(demoActions.startLoading());
  try {
    let res = await fetch(`${BaseURL}demo/requestDemo`, {
      method: "POST",

      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    res = await res.json();
    console.log(res.data);

    dispatch(
      demoActions.CreateDemo({
        demo: res.data,
      })
    );

    setTimeout(function () {
      dispatch(demoActions.disableSucceded());
    }, 4000);
    // alert("Request submitted successfully!");
    // return <GlobalSnackbar severity={"success"} feedbackMsg={"Successfully recieved your request."}/>;
  } catch (err) {
    dispatch(demoActions.hasError(err.message));
    // return <GlobalSnackbar severity={"error"} feedbackMsg={err.response}/>
    // GlobalSnackbar("error", err.response);
    // console.log(err);
  }
};

export const errorTrackerForCreateDemo = () => async (dispatch, getState) => {
  dispatch(demoActions.disabledError());
};

export const signupForEmailNewsletter =
  (email) => async (dispatch, getState) => {
    try {
      let res = await fetch(`${BaseURL}newsletter/signUpViaEmail`, {
        method: "POST",

        body: JSON.stringify({
          email: email,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

export const contactUs = (formValues) => async (dispatch, getState) => {
  dispatch(contactUsActions.startLoading());
  try {
    let res = await fetch(`${BaseURL}contactUs/contact`, {
      method: "POST",

      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res.data);

    alert("Your contact request is recieved successfully.");
    dispatch(contactUsActions.ContactUs());
  } catch (err) {
    dispatch(contactUsActions.hasError(err.message));
    console.log(err);
  }
};

export const errorTrackerForContactUs = () => async (dispatch, getState) => {
  dispatch(contactUsActions.disabledError());
};

// export const fetchRoomVideoCallToken =
//   (userId, tableId, openTableScreen) => async (dispatch, getState) => {
//     dispatch(twillioActions.startLoading());
//     try {
//       let res = await fetch(
//         `${BaseURL}getRTCVideoCallToken`
//         ,
//       {
//         method: "POST",

//         body: JSON.stringify({
//           tableId,
//           userId
//         }),

//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${getState().auth.token}`,

//         },
//       }

//       );
//       if (!res.ok) {
//         if (!res.message) {
//           throw new Error("Something went wrong");
//         } else {
//           throw new Error(res.message);
//         }
//       }
//       res = await res.json();
//       console.log(res.accessToken);

//       dispatch(
//         twillioActions.FetchVideoRoomToken({
//           videoRoomToken: res.accessToken,
//         })
//       );
//       openTableScreen();
//     } catch (err) {
//       console.log(err);
//     }
//   };
// export const errorTrackerForFetchTwillioVideoRoomToken =
//   () => async (dispatch, getState) => {
//     dispatch(twillioActions.disabledError());
//   };

export const fetchVideoCallToken =
  (userId, tableId, openTableScreen) => async (dispatch, getState) => {
    dispatch(RTCActions.startLoading());
    try {
      let res = await fetch(
        `https://token-service-1443-dev.twil.io/token?identity=${userId}&room=${tableId}`
      );
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res.token);

      dispatch(
        RTCActions.fetchRTCToken({
          token: res.token,
        })
      );
      openTableScreen();
    } catch (err) {
      console.log(err);
    }
  };
export const errorTrackerForFetchVideoCallToken =
  () => async (dispatch, getState) => {
    dispatch(RTCActions.disabledError());
  };

export const generatePayoutLink =
  ({ communityId, communityName, phoneNumber, email, amount }) =>
  async (dispatch) => {
    console.log(communityId, phoneNumber, email, amount);
    // dispatch(eventActions.startLoading());

    // https://api.razorpay.com/v1/payout-links

    const reqBody = {
      account_number: "HbV3YvH7Zo0cDj",
      contact: {
        name: communityName,
        type: "customer",
        contact: phoneNumber,
        email: email,
      },
      amount: amount * 100,
      currency: "INR",
      purpose: "payout",
      description: `Payout link for ${communityName}`,
      send_sms: true,
      send_email: true,
      receipt: "Recipet for Payout",
      notes: {
        communityId: communityId,
        payout_amount: amount,
      },
    };

    const authToken = btoa("rzp_live_bDVAURs4oXxSGi:TFitnOVh9eOIFK3qdZsfCLfQ");

    try {
      let res = await fetch(`https://api.razorpay.com/v1/payout-links`, {
        method: "POST",

        body: JSON.stringify(reqBody),

        headers: {
          "Content-Type": "application/json",

          Authorization: `Basic ${authToken}`,
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res.token);
    } catch (e) {
      console.log(e);
      // dispatch(eventActions.hasError(e.message));
    }
  };

export const fundTransferRequest =
  (formValues) => async (dispatch, getState) => {
    // dispatch(contactUsActions.startLoading());
    try {
      let res = await fetch(`${BaseURL}fund/transferRequest`, {
        method: "POST",

        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res.data);

      alert(
        "Your fund transfer request is recieved successfully! Please check your email."
      );
      // dispatch(contactUsActions.ContactUs());
    } catch (err) {
      // dispatch(contactUsActions.hasError(err.message));
      console.log(err);
    }
  };

export const switchToFreePlan = (communityId) => async (dispatch, getState) => {
  // dispatch(contactUsActions.startLoading());
  try {
    let res = await fetch(`${BaseURL}communityPlan/switchToFree`, {
      method: "POST",

      body: JSON.stringify({
        communityId: communityId,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res.data);

    alert("Successfully switched to free plan!");
    // dispatch(contactUsActions.ContactUs());
  } catch (err) {
    // dispatch(contactUsActions.hasError(err.message));
    console.log(err);
  }
};

export const addNewAffiliate = (formValues) => async (dispatch, getState) => {
  dispatch(affiliateActions.startLoading());
  try {
    let res = await fetch(`${BaseURL}affiliate/createNewAffiliate`, {
      method: "POST",

      body: JSON.stringify({
        ...formValues,
      }),

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res.data);

    alert("Successfully added new affiliate!");

    dispatch(
      affiliateActions.CreateAffiliate({
        affiliate: res.data,
      })
    );
  } catch (err) {
    dispatch(affiliateActions.hasError(err.message));
    console.log(err);
  }
};

export const fetchEventAffiliates = (eventId) => async (dispatch, getState) => {
  dispatch(affiliateActions.startLoading());
  try {
    let res = await fetch(`${BaseURL}events/getAffliates/${eventId}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();
    console.log(res);

    dispatch(
      affiliateActions.FetchAffiliates({
        affiliates: res.data.affiliates,
      })
    );
  } catch (err) {
    dispatch(affiliateActions.hasError(err.message));
    console.log(err);
  }
};

export const captureUserInterestInEvent =
  (eventId) => async (dispatch, getState) => {
    // dispatch(affiliateActions.startLoading());
    try {
      let res = await fetch(
        `${BaseURL}interestedPeople/captureInterest/${eventId}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

export const fetchInterestedPeopleList =
  (eventId) => async (dispatch, getState) => {
    dispatch(interestedPeopleActions.startLoading());
    try {
      let res = await fetch(
        `${BaseURL}interestedPeople/fetchInterestedPeople/${eventId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        interestedPeopleActions.FetchInterestedPeople({
          interestedPeople: res.data,
        })
      );
    } catch (err) {
      dispatch(interestedPeopleActions.hasError(err.message));
      console.log(err);
    }
  };

export const fetchAvailableForNetworking =
  (eventId, id) => async (dispatch, getState) => {
    // dispatch(interestedPeopleActions.startLoading());
    try {
      let res = await fetch(`${BaseURL}availableForNetworking/${eventId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      res = await res.json();
      console.log(res);

      dispatch(
        availableForNetworkingActions.FetchAvailablePeople({
          availablePeople: res.data,
        })
      );
    } catch (err) {
      dispatch(availableForNetworkingActions.hasError(err.message));
      console.log(err);
    }
  };

export const createNewEventMsg = (newMsg) => async (dispatch, getState) => {
  dispatch(
    eventChatActions.CreateEventChat({
      chat: newMsg,
    })
  );
};
export const createNewEventAlert = (newAlert) => async (dispatch, getState) => {
  dispatch(
    eventAlertActions.CreateEventAlert({
      eventAlert: newAlert,
    })
  );
};

export const createNewEventPoll = (newPoll) => async (dispatch, getState) => {
  dispatch(
    eventPollActions.CreateEventPoll({
      eventPoll: newPoll,
    })
  );
};

export const updateEventPoll = (poll) => async (dispatch, getState) => {
  dispatch(
    eventPollActions.UpdateEventPoll({
      updatedPoll: poll,
    })
  );
};

export const createNewSessionMsg = (newMsg) => async (dispatch, getState) => {
  dispatch(
    sessionChatActions.CreateSessionChat({
      chat: newMsg,
    })
  );
};

export const MailChimpAuth = (code) => async (dispatch) => {
  try {
    await eureka.get(`/oauth/mailchimp/callback/?code=${code}`);
  } catch (err) {
    console.log(err);
  }
};

export const DuplicateUserSignOut =
  (userId, message) => async (dispatch, getState) => {
    console.log(userId, "hey hitting duplicate user sign out");
    console.log(getState().user.userDetails._id);

    if (userId === getState().user.userDetails._id) {
      console.log(message);
      alert(message);
      window.localStorage.clear();

      window.gapi.load("client:auth2", () => {
        window.gapi.client
          .init({
            clientId:
              "438235916836-6oaj1fbnqqrcd9ba30348fbe2ebn6lt0.apps.googleusercontent.com",
            scope: "profile email",
          })
          .then(() => {
            window.gapi.auth2.getAuthInstance().signOut();

            // this.onAuthChange(this.auth.isSignedIn.get());
            // this.auth.isSignedIn.listen(this.onAuthChange);
          });
      });

      dispatch(authActions.SignOut());
      dispatch(communityAuthActions.CommunitySignOut());

      setTimeout(function () {
        dispatch(authActions.disabledSignOutSucceded());
      }, 4000);

      history.push("/home");

      //TODO Home page
    }
  };

export const eventRegistrationSignIn =
  (eventId) => async (dispatch, getState) => {
    dispatch(
      authActions.signinForEventRegistration({
        eventId,
      })
    );
  };

export const eventBuyingPlan = (intent) => async (dispatch, getState) => {
  dispatch(
    authActions.signinForBuyingPlan({
      intent,
    })
  );
};
export const fetchMailChimpAudiences =
  (eventId) => async (dispatch, getState) => {
    dispatch(communityActions.startLoading());
    try {
      console.log(eventId, "i am counting on you eventID index.js ");
      const mailChimpAudienceList = await eureka.get(
        `/eureka/v1/fetchMailChimpAudiences/?eventId=${eventId}`
      );
      console.log(mailChimpAudienceList.data);

      dispatch(
        communityActions.FetchMailChimpAudiences({
          mailChimpAudiences: mailChimpAudienceList.data,
        })
      );
    } catch (err) {
      dispatch(communityActions.hasError(err.message));
      // console.log(err);
    }
  };

export const errorTrackerForFetchMailChimpAudiences =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };

export const getPayPalConnectLink = () => async (dispatch, getState) => {
  fetch(`${BaseURL}paypal/getPayPalAccessToken`, {
    method: "GET",

    headers: {
      "Content-Type": "application/json",
    },
  }).then(async (res) => {
    const payPalRes = await res.json();
    console.log(payPalRes);

    dispatch(
      paypalActions.FetchLink({
        link: payPalRes.data.links[1].href,
      })
    );

    // window.location.href = payPalRes.data.links[1].href;
  });
};

export const getCommunityTawkLink =
  (communityId) => async (dispatch, getState) => {
    dispatch(tawkActions.startLoading());
    try {
      const res = await fetch(`${BaseURL}getTawkLink/${communityId}`, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }
      const result = await res.json();

      console.log(result);
      dispatch(
        tawkActions.UpdateTawkLink({
          link: result.data.tawkLink,
        })
      );
    } catch (err) {
      dispatch(tawkActions.hasError(err.message));
    }
  };

export const getEventbriteOrganisations =
  (privateToken) => async (dispatch, getState) => {
    dispatch(eventbriteActions.startLoading());
    try {
      const res = await fetch(
        `https://www.eventbriteapi.com/v3/users/me/organizations/`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${privateToken}`,
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();

      console.log(result);
      dispatch(
        eventbriteActions.UpdateOrganisationList({
          organizations: result.organizations,
        })
      );
    } catch (error) {
      dispatch(eventbriteActions.hasError(error.message));
    }
  };

export const getEventbriteEventsByOrganisation =
  (privateToken, orgId) => async (dispatch, getState) => {
    dispatch(eventbriteActions.startLoading());

    try {
      const res = await fetch(
        `https://www.eventbriteapi.com/v3/organizations/${orgId}/events/`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${privateToken}`,
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();

      console.log(result);

      dispatch(
        eventbriteActions.UpdateEventsList({
          events: result.events,
        })
      );
    } catch (error) {
      dispatch(eventbriteActions.hasError(error.message));
    }
  };

export const createEventbriteWebhookForEventRegistrations =
  (privateToken, orgId, eventId, bluemeetEventId) =>
  async (dispatch, getState) => {
    dispatch(eventbriteActions.startLoading());

    try {
      const res = await fetch(
        `https://www.eventbriteapi.com/v3/organizations/${orgId}/webhooks/`,
        {
          method: "POST",

          body: JSON.stringify({
            endpoint_url: `https://api.bluemeet.in/api-eureka/api/eureka/v1/eventbrite_registration/${orgId}/${eventId}/${bluemeetEventId}`,
            actions: "order.placed",
            event_id: eventId,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${privateToken}`,
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();

      await fetch(`${BaseURL}events/saveEventbriteConf/${bluemeetEventId}`, {
        method: "PATCH",

        body: JSON.stringify({
          eventbriteOrganisation: orgId,
          eventbriteEvent: eventId,
          eventbriteWebhookData: result,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const SaveResult = await res.json();
      console.log(SaveResult);

      console.log("Successfully configured eventbrite integration.");

      console.log(result);

      dispatch(
        eventbriteActions.UpdateWebhook({
          webhookData: result,
        })
      );
    } catch (error) {
      dispatch(eventbriteActions.hasError(error.message));
    }
  };

export const saveEventbriteConfigurationForEvent =
  (bluemeetEventId, orgId, eventId, webhookData) =>
  async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}event/saveEventbriteConf/${bluemeetEventId}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            eventbriteOrganisation: orgId,
            eventbriteEvent: eventId,
            eventbriteWebhookData: webhookData,
          }),

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();
      console.log(result);

      console.log("Successfully configured eventbrite integration.");
    } catch (error) {
      console.log("error saving eventbrite configuration to database");
    }
  };

export const generateAPICredentials =
  (communityId, userId, label) => async (dispatch, getState) => {
    dispatch(apiKeyActions.startLoading());
    try {
      // Submit a request to generate new set of API Key and secret
      const res = await fetch(
        `${BaseURL}community/generateApiKey/${communityId}`,
        {
          method: "POST",

          body: JSON.stringify({
            userId: userId,
            label: label,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      if (!res.ok) {
        if (!res.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(res.message);
        }
      }

      const result = await res.json();
      console.log(result);

      dispatch(
        apiKeyActions.CreateApiKey({
          apiKey: result.data,
        })
      );
    } catch (error) {
      console.log(error);
      dispatch(apiKeyActions.hasError(error.message));
    }
  };

export const fetchApiKeys = (communityId) => async (dispatch, getState) => {
  dispatch(apiKeyActions.startLoading());

  try {
    const res = await fetch(`${BaseURL}community/getApiKeys/${communityId}`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }

    const result = await res.json();
    console.log(result);

    dispatch(
      apiKeyActions.FetchApiKeys({
        apiKeys: result.data,
      })
    );
  } catch (error) {
    console.log(error);
    dispatch(apiKeyActions.hasError(error.message));
  }
};

export const getStripeConnectAccountStatus =
  (userId, communityId, accountId) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}stripe/getStripeConnectStatus/${accountId}/${communityId}`,
        {
          method: "POST",

          body: JSON.stringify({
            communityId: communityId,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      if (result.charges_enabled && result.details_submitted) {
        window.location.href = `/onboarded-successfully/user/${userId}/community/${communityId}/account/${accountId}`;
      }
      if (!result.charges_enabled && !result.details_submitted) {
        window.location.href = `/not-onboarded-yet/user/${userId}/community/${communityId}/account/${accountId}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

export const createNewRole =
  (formValues, communityId, userId, roleTitle) =>
  async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}role/createNewRole/${communityId}/${userId}`,
        {
          method: "POST",

          body: JSON.stringify({
            communityId: communityId,
            userId: userId,
            roleTitle: roleTitle,
            capabilities: { ...formValues },
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      //  Dispatch in roles slice in redux store
    } catch (error) {
      console.log(error);
    }
  };

export const editRoleCapabilities =
  (formValues, roleId, communityId, userId) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}role/editRoleCapabilities/${communityId}/${userId}/${roleId}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            communityId: communityId,
            roleId: roleId,
            userId: userId,
            capabilities: { ...formValues },
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      //  Dispatch in roles slice in redux store
    } catch (error) {
      console.log(error);
    }
  };

export const deleteRole =
  (roleId, communityId, userId) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}role/deleteRole/${communityId}/${userId}/${roleId}`,
        {
          method: "DELETE",

          body: JSON.stringify({
            communityId: communityId,
            roleId: roleId,
            userId: userId,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      //  Dispatch in roles slice in redux store
    } catch (error) {
      console.log(error);
    }
  };

export const fetchRoles = (communityId) => async (dispatch, getState) => {
  console.log("I reached in fetch roles");
  try {
    const res = await fetch(`${BaseURL}role/getRoles/${communityId}/`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().communityAuth.token}`,
      },
    });

    const result = await res.json();
    console.log(result);

    dispatch(
      roleActions.FetchRoles({
        roles: result.roles,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

export const uploadVideoForCommunity =
  (communityId, file) => async (dispatch, getState) => {
    try {
      const key = `${communityId}/${UUID()}.mp4`;

      s3.getSignedUrl(
        "putObject",
        {
          Bucket: "bluemeet",
          Key: key,
          ContentType: "video/mp4",
        },
        async (err, presignedURL) => {
          const awsRes = await fetch(presignedURL, {
            method: "PUT",

            body: file,

            headers: {
              "Content-Type": file.type,
            },
          });

          console.log(awsRes);

          if (awsRes.status === 200) {
            try {
              // Save this video info in community document.

              const res = await fetch(`${BaseURL}community/uploadVideo/`, {
                method: "POST",

                body: JSON.stringify({
                  fileName: file.name,
                  key: key,
                }),

                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${getState().communityAuth.token}`,
                },
              });

              const result = await res.json();
              console.log(result);

              dispatch(
                snackbarActions.openSnackBar({
                  message:
                    "Video file uploaded successfully! Make sure to link it to an event.",
                  severity: "success",
                })
              );

              setTimeout(function () {
                dispatch(snackbarActions.closeSnackBar());
              }, 6000);
            } catch (error) {
              console.log(error);

              dispatch(
                snackbarActions.openSnackBar({
                  message: "Failed to upload video file. Please try again",
                  severity: "error",
                })
              );
              setTimeout(function () {
                dispatch(snackbarActions.closeSnackBar());
              }, 4000);
            }
          } else {
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

export const acceptInvitation =
  (invitationId) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}team-invites/accept-invitation/${invitationId}/`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

export const fetchPendingInvitations =
  (communityId) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}team-invites/fetchPendingInvitations/`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      dispatch(
        communityActions.FetchInvitations({
          invitations: result.pendingInvitations,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const fetchCommunityManagers =
  (communityId) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}team-invites/fetchCommunityManagers/`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      dispatch(
        communityActions.FetchCommunityManagers({
          communityManagers: result.communityManagers.eventManagers,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const removeFromTeam =
  (email, communityId, status) => async (dispatch, getState) => {
    try {
      const res = await fetch(
        `${BaseURL}team-invites/removeFromTeam/${email}/${status}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      const result = await res.json();
      console.log(result);

      dispatch(
        communityActions.RemoveCommunityManager({
          email: email,
          status: status,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

export const updateCommunity =
  (id, formValues, file) => async (dispatch, getState) => {
    const key = `${id}/${UUID()}.jpeg`;

    if (file) {
      s3.getSignedUrl(
        "putObject",
        {
          Bucket: "bluemeet",
          Key: key,
          ContentType: "image/jpeg",
        },

        async (err, presignedURL) => {
          const awsRes = await fetch(presignedURL, {
            method: "PUT",

            body: file,

            headers: {
              "Content-Type": file.type,
            },
          });

          console.log(awsRes);

          if (awsRes.status === 200) {
            dispatch(communityActions.startLoading());

            try {
              const res = await fetch(
                `${BaseURL}community/${id}/updateCommunity`,
                {
                  method: "PATCH",
                  body: JSON.stringify({
                    ...formValues,
                    image: key,
                  }),

                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getState().communityAuth.token}`,
                  },
                }
              );
              if (!res.ok) {
                if (!res.message) {
                  throw new Error("Something went wrong");
                } else {
                  throw new Error(res.message);
                }
              }
              const result = await res.json();

              console.log(result);
              dispatch(
                communityActions.EditCommunity({
                  community: result.data,
                })
              );

              dispatch(
                snackbarActions.openSnackBar({
                  message: "Community details updated successfully",
                  severity: "success",
                })
              );

              setTimeout(function () {
                dispatch(snackbarActions.closeSnackBar());
              }, 6000);
            } catch (err) {
              dispatch(communityActions.hasError(err.message));

              dispatch(
                snackbarActions.openSnackBar({
                  message: "Failed to update community.",
                  severity: "error",
                })
              );
              setTimeout(function () {
                dispatch(snackbarActions.closeSnackBar());
              }, 4000);
            }
          }
        }
      );
    } else {
      dispatch(communityActions.startLoading());
      try {
        const res = await fetch(`${BaseURL}community/${id}/updateCommunity`, {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        });
        if (!res.ok) {
          if (!res.message) {
            throw new Error("Something went wrong");
          } else {
            throw new Error(res.message);
          }
        }
        const result = await res.json();

        console.log(result);
        dispatch(
          communityActions.EditCommunity({
            community: result.data,
          })
        );

        dispatch(
          snackbarActions.openSnackBar({
            message: "Community details updated successfully!",
            severity: "success",
          })
        );

        setTimeout(function () {
          dispatch(snackbarActions.closeSnackBar());
        }, 6000);
      } catch (error) {
        dispatch(communityActions.hasError(error.message));

        dispatch(
          snackbarActions.openSnackBar({
            message: "Failed to update community.",
            severity: "error",
          })
        );
        setTimeout(function () {
          dispatch(snackbarActions.closeSnackBar());
        }, 4000);
      }
    }
  };

export const editRegistrationForm =
  (formValues, eventId) => async (dispatch, getState) => {
    let res = await fetch(
      `${BaseURL}events/${eventId}/updateRegistrationForm`,

      {
        method: "PATCH",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      }
    );
    if (!res.ok) {
      if (!res.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(res.message);
      }
    }
    res = await res.json();

    try {
      console.log(res, 6147);

      dispatch(
        eventActions.EditEvent({
          event: res.data.updatedEvent,
        })
      );

      dispatch(
        snackbarActions.openSnackBar({
          message: "Event updated successfully!",
          severity: "success",
        })
      );

      setTimeout(function () {
        dispatch(snackbarActions.closeSnackBar());
      }, 6000);
    } catch (err) {
      console.log(err);

      dispatch(eventActions.hasError(err.message));

      dispatch(
        snackbarActions.openSnackBar({
          message: "Failed to update event.",
          severity: "error",
        })
      );

      setTimeout(function () {
        dispatch(snackbarActions.closeSnackBar());
      }, 6000);
    }
  };
