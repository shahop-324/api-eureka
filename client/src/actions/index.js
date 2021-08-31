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

import { LinkedInApi, NodeServer } from "../components/LinkedinConfig";
import axios from "axios";

import { eventAlertActions } from "../reducers/eventAlertSlice";
import { eventPollActions } from "../reducers/eventPollSlice";
import { availableForNetworkingActions } from "../reducers/availableForNetworking";
import { StreamActions } from "../reducers/streamSlice";

const { REACT_APP_MY_ENV } = process.env;
const BaseURL = REACT_APP_MY_ENV
  ? "http://localhost:3000/api-eureka/eureka/v1/"
  : "https://www.evenz.co.in/api-eureka/eureka/v1/";
// authentication with id and password
const urlToGetLinkedInAccessToken =
  "https://www.linkedin.com/oauth/v2/accessToken";
const urlToGetUserProfile =
  "https://api.linkedin.com/v2/me?projection=(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))";
const urlToGetUserEmail =
  "https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))";
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

export const signIn = (formValues, intent, eventId) => async (dispatch) => {
  console.log({ ...formValues });

  try {
    const res = await eureka.post("/eureka/v1/users/login", { ...formValues });
    console.log(res.data);

    dispatch(
      authActions.SignIn({
        token: res.data.token,
        referralCode: res.data.data.user.hasUsedAnyReferral
          ? null
          : res.data.data.user.referralCode,
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
      // window.location.href = REACT_APP_MY_ENV
      //   ? "http://localhost:3001/user/home"
      //   : "https://www.evenz.in/user/home";
    }
  } catch (err) {
    dispatch(authActions.hasError(err.response.data.message));
    console.log(err.response);
  }
};
export const errorTrackerForSignIn = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};

export const fetchReferralCode =
  (referredUserId) => async (dispatch, getState) => {
    dispatch(userActions.FetchReferralCode({ referredUserId }));
  };

export const signUp = (formValues) => async (dispatch) => {
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
    history.push("/user/home");
    // window.location.href = REACT_APP_MY_ENV
    //   ? "http://localhost:3001/user/home"
    //   : "https://www.evenz.in/user/home";
  } catch (err) {
    dispatch(authActions.hasError(err.response.data.message));
    alert(err.response.data.message);
  }
};

export const errorTrackerForSignUp = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};
export const linkedinSignIn = (code, intent, eventId) => async (dispatch) => {
  // console.log(code);

  // try {

  //  dispatch(authActions.startLoading());
  try {
    let res = await eureka.get(`/getUserCredentials/?code=${code}`);
    console.log(res.data);

    // const formValues=res.data;
    res = await eureka.post("/eureka/v1/users/linkedinSignIn", {
      ...res.data,
    });
    console.log(res.data.data.user);
    dispatch(
      authActions.SignIn({
        token: res.data.token,
        isSignedInThroughLinkedin: true,

        referralCode: res.data.data.user.hasUsedAnyReferral
          ? null
          : res.data.data.user.referralCode,
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
      // window.location.href = REACT_APP_MY_ENV
      //   ? "http://localhost:3001/user/home"
      //   : "https://www.evenz.in/user/home";
    }
  } catch (err) {
    console.log(err);
  }
};

export const errorTrackerForLinkedinSignIn =
  () => async (dispatch, getState) => {
    dispatch(authActions.disabledError());
  };
export const googleSignIn =
  (formValues, intent, eventId) => async (dispatch) => {
    try {
      const res = await eureka.post("/eureka/v1/users/googleSignIn", {
        ...formValues,
      });
      console.log(res.data.data.user);
      dispatch(
        authActions.SignIn({
          token: res.data.token,
          isSignedInThroughGoogle: true,

          referralCode: res.data.data.user.hasUsedAnyReferral
            ? null
            : res.data.data.user.referralCode,
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
        // window.location.href = REACT_APP_MY_ENV
        //   ? "http://localhost:3001/user/home"
        //   : "https://www.evenz.in/user/home";
      }
      //history.push("/user/home");
    } catch (err) {
      console.log(err);
      // dispatch(authActions.hasError(err.response.data.message));
      // alert(err.response.data.message);
    }
  };

export const errorTrackerForGoogleSignIn = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};

export const signOut = () => async (dispatch, getState) => {
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

  history.push("/home");

  //TODO Home page
};

///community auth
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
            `/user/${userId}/community/overview/${res.communityDoc.id}`
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
    dispatch(
      communityActions.CreateCommunity({
        community: res.communityDoc,
      })
    );
    // /user/:userId/community/overview/:id
    history.push(`/user/${userId}/community/overview/${res.communityDoc.id}`);
  } catch (e) {
    dispatch(communityActions.hasError(e.message));
  }
};

export const errorTrackerForCommunitySignIn =
  () => async (dispatch, getState) => {
    dispatch(communityActions.disabledError());
  };
// authentication with google auth

// export const googleSignIn = () => async (dispatch) => {
//   const signIn = async () => {
//    // console.log("mai yaha se gujara hue");
//     const headers = new Headers();
//     headers.append("Content-Type", "application/json");
//     headers.append("Accept", "application/json");
//     headers.append("Cache", "no-cache");

//     const params = {
//       dataType: "json",
//       method: "GET",
//       headers,
//       credentials: "include",
//     };
//     const response = await fetch(
//       "${BaseURL}current_user",
//       params
//     );

//     if (!response.ok) {
//       if (!response.message) {
//         throw new Error("Something went wrong");
//       } else {
//         throw new Error(response.message);
//       }
//     }

//     const res = await response.json();
//     return res;
//   };

//   try {
//     const res = await signIn();
//     console.log(res);

//     dispatch(
//       userActions.CreateUser({
//         user: res.user,
//       })
//     );
//     dispatch(
//       authActions.SignIn({
//         token: res.token,
//       })
//     );
//     dispatch(
//       googleAuthActions.TrackerGoogleLogin({
//         isClicked: false,
//       })
//     );
//   } catch (err) {
//     alert(err.message);
//     dispatch(authActions.hasError(err.message));
//   }
// };

// export const errorTrackerForGoogleSignIn = () => async (dispatch, getState) => {
//   dispatch(authActions.disabledError());
//   dispatch(googleAuthActions.disabledError());
// };
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
        events: res.data.data.events,
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

export const fetchUserAllPersonalData =
  (code) => async (dispatch, getState) => {
    dispatch(communityActions.startCommunityLoading());
    console.log(code);
    const fetchData = async (code) => {
      // if(code)
      // {

      // }
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
      // console.log(res.data.personalData);

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
      const existingEvent = getState().event.events.find((event) => {
        console.log(id);
        return event.id === id;
      });

      if (!existingEvent) {
        console.log(id, "I am passing from particularEvent action");

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
      } else {
        dispatch(
          eventActions.FetchEvent({
            event: existingEvent,
          })
        );
      }
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
  (term) => async (dispatch, getState) => {
    dispatch(eventActions.startLoading());

    const fetchEvents = async () => {
      let fullLocation = `${BaseURL}community/events`;
      let url = new URL(fullLocation);
      let search_params = url.searchParams;

      if (term) {
        search_params.set("text", term);
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
  } catch (err) {
    console.log(err);
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
  } catch (err) {
    console.log(err);

    dispatch(eventActions.hasError(err.message));
  }
};
export const errorTrackerForeditEvent = () => async (dispatch, getState) => {
  dispatch(eventActions.disabledError());
};

export const uploadEventImage = (file, id) => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());
  const uploadingImage = async () => {
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

    const res = await fetch(
      `${BaseURL}events/${id}/update`,

      {
        method: "PATCH",
        body: JSON.stringify({
          image: uploadConfig.key,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      }
    );

    const result = await res.json();
    return result;
  };
  try {
    const result = await uploadingImage();

    console.log(result);

    dispatch(
      eventActions.EditEvent({
        event: result.updatedEvent,
      })
    );
  } catch (err) {
    eventActions.hasError(err.message);

    console.log(err);
  }
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
          `${BaseURL}events/${id}/addSpeaker`,

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
          speakerActions.CreateSpeaker({
            speaker: res.data,
          })
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
      }
    } catch (err) {
      dispatch(speakerActions.detailHasError(err.message));
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

//alice routes
export const madeJustForYou = () => async (dispatch) => {
  dispatch(eventActions.startLoading());
  try {
    const res = await eureka.get("eureka/v1/exploreEvents/madeJustForYou");
    console.log(res.data);

    dispatch(
      eventActions.FetchEvents({
        events: res.data.data.events,
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
  dispatch(authActions.startLoading());
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
    dispatch(authActions.hasError(err.message));
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
  } catch (err) {
    console.log(err);

    dispatch(sessionActions.hasError(err.message));
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
      console.log(err);

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
      // body: {...formValues},
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
  } catch (err) {
    dispatch(sessionActions.detailHasError(err.message));
    console.log(err);
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
  } catch (err) {
    dispatch(sessionActions.hasError(err.message));
    console.log(err);
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
      console.log(err);

      networkingActions.hasError(err.message);
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

// export const connectToStripe = (return_url) => async (dispatch, getState) => {
//   console.log("I entered connect to stripe action");
//   try {
//     let res = await fetch(`${BaseURL}stripe/createStripeAccount`, {
//       method: "POST",

//       body: JSON.stringify({
//         return_url: return_url,
//       }),

//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getState().communityAuth.token}`,
//       },
//     });

//     res = await res.json();
//     console.log(res);
//     window.location.href = res.data.url;
//   } catch (err) {
//     console.log(err);
//   }
// };

export const getEventRegistrationCheckoutSession =
  (formValues) => async (dispatch, getState) => {
    try {
      const checkoutSession = await fetch(
        `${BaseURL}stripe/getEventRegistrationCheckoutSession`,
        {
          method: "POST",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );
      if (!checkoutSession.ok) {
        if (!checkoutSession.message) {
          throw new Error("Something went wrong");
        } else {
          throw new Error(checkoutSession.message);
        }
      }

      const res = await checkoutSession.json();

      console.log(res);

      window.location.href = res.data.url;
    } catch (err) {
      console.log(err);
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
        : "https://www.evenz.in/user/home";
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

      // dispatch(
      //   registrationActions.FetchRegistration({
      //     registration: res.data,
      //   })
      // );
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

export const getRTCTokenForScreenShare =
  (sessionId, uid, startScreenCall) => async (dispatch, getState) => {
    dispatch(RTCActions.startLoading());

    const fetchingRTCToken = async () => {
      let res = await fetch(`${BaseURL}getLiveStreamingTokenForScreenShare`, {
        method: "POST",
        body: JSON.stringify({
          sessionId: sessionId,
          uid: uid,
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

    alert("Your demo request is recived successfully.");
    dispatch(
      demoActions.CreateDemo({
        demo: res.data,
      })
    );
  } catch (err) {
    dispatch(demoActions.hasError(err.message));
    console.log(err);
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

    const authToken = btoa(
      "rzp_live_bDVAURs4oXxSGi" + ":" + "TFitnOVh9eOIFK3qdZsfCLfQ"
    );

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

export const fetchRemoteStreams =
  (remoteStreams) => async (dispatch, getState) => {
   
    dispatch(
      StreamActions.fetchRemoteStreams({
        streams: remoteStreams,
      })
    );
  };

export const fetchLocalStream = (localStream) => async (dispatch, getState) => {
  
  dispatch(
    StreamActions.fetchLocalStream({
      localStream: localStream,
    })
  );
};


