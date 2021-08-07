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

const BaseURL = "http://localhost:3000/eureka/v1/";

// authentication with id and password
export const signIn = (formValues, intent, eventId) => async (dispatch) => {
  console.log({ ...formValues });

  try {
    const res = await eureka.post("/eureka/v1/users/login", { ...formValues });
    console.log(res.data);

    dispatch(
      authActions.SignIn({
        token: res.data.token,
        isSignedIn: true,
      })
    );
    dispatch(
      userActions.CreateUser({
        user: res.data.data.user,
      })
    );

    if (intent === "eventRegistration") {
      history.push(`/event-landing-page/${eventId}`);
    } else {
      history.push("/user/home");
    }
  } catch (err) {
    dispatch(authActions.hasError(err.response.data.message));
    console.log(err.response);
    alert(err.response.data.message);
  }
};
export const errorTrackerForSignIn = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
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
      })
    );
    dispatch(
      userActions.CreateUser({
        user: res.data.data.user,
      })
    );
    history.push("/user/home");
  } catch (err) {
    dispatch(authActions.hasError(err.response.data.message));
    alert(err.response.data.message);
  }
};

export const errorTrackerForSignUp = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
};
export const signOut = () => async (dispatch, getState) => {
  // while (window.localStorage.length !== 0) {
  //   window.localStorage.clear();
  // }

  dispatch(authActions.SignOut());
  dispatch(communityAuthActions.CommunitySignOut());

  history.push("/signin");
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
          "http://localhost:3000/eureka/v1/upload/user/img",
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
            "http://localhost:3000/eureka/v1/users/newCommunity",
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
          let res = await fetch(
            "http://localhost:3000/eureka/v1/users/newCommunity",
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
    let res = await fetch(`http://localhost:3000/eureka/v1/users/${id}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getState().auth.token}`,
      },
    });

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
export const googleSignIn = () => async (dispatch) => {
  const signIn = async () => {
    console.log("mai yaha se gujara hue");
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");
    headers.append("Cache", "no-cache");

    const params = {
      dataType: "json",
      method: "GET",
      headers,
      credentials: "include",
    };
    const response = await fetch(
      "http://localhost:3000/eureka/v1/current_user",
      params
    );

    if (!response.ok) {
      if (!response.message) {
        throw new Error("Something went wrong");
      } else {
        throw new Error(response.message);
      }
    }

    const res = await response.json();
    return res;
  };

  try {
    const res = await signIn();
    console.log(res);

    dispatch(
      userActions.CreateUser({
        user: res.user,
      })
    );
    dispatch(
      authActions.SignIn({
        token: res.token,
      })
    );
    dispatch(
      googleAuthActions.TrackerGoogleLogin({
        isClicked: false,
      })
    );
  } catch (err) {
    alert(err.message);
    dispatch(authActions.hasError(err.message));
  }
};

export const errorTrackerForGoogleSignIn = () => async (dispatch, getState) => {
  dispatch(authActions.disabledError());
  dispatch(googleAuthActions.disabledError());
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

export const fetchUserAllPersonalData = () => async (dispatch, getState) => {
  dispatch(eventActions.startLoading());

  const fetchData = async () => {
    let res = await fetch(
      `http://localhost:3000/eureka/v1/users/personalData`,
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
      `http://localhost:3000/eureka/v1/users/registeredEvents`,
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
          `http://localhost:3000/eureka/v1/community/events/${id}`,
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
      let fullLocation = `http://localhost:3000/eureka/v1/community/events`;
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
      "http://localhost:3000/eureka/v1/community/events/new",
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
      `http://localhost:3000/eureka/v1/events/${id}/update`,
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
      "http://localhost:3000/eureka/v1/upload/user/img",
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
      `http://localhost:3000/eureka/v1/events/${id}/update`,
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
        `http://localhost:3000/eureka/v1/events/${id}/updateEventDescription`,
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
    dispatch(speakerActions.startLoading());
    try {
      if (file) {
        console.log(formValues);

        console.log(file);

        let uploadConfig = await fetch(
          "http://localhost:3000/eureka/v1/upload/user/img",
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
          `http://localhost:3000/eureka/v1/events/${id}/addSpeaker`,
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
          `http://localhost:3000/eureka/v1/events/${id}/addSpeaker`,
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
      dispatch(speakerActions.hasError(err.message));
    }
  };
export const errorTrackerForCreateSpeaker =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledError());
  };

export const fetchSpeakers =
  (id, term, sessionId) => async (dispatch, getState) => {
    dispatch(speakerActions.startLoading());

    const getSpeakers = async () => {
      let fullLocation = `http://localhost:3000/eureka/v1/events/${id}/speakers`;
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
    dispatch(speakerActions.startLoading());

    const fetchingSpeaker = async () => {
      //console.log(id, "I am passing from particularEvent action");
      const res = await fetch(
        `http://localhost:3000/eureka/v1/speakers/${id}`,
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
      dispatch(speakerActions.hasError(err.message));
      console.log(err);
    }
  };

export const errorTrackerForFetchParticularSpeakerOfEvent =
  () => async (dispatch, getState) => {
    dispatch(speakerActions.disabledError());
  };

export const fetchSpeaker = (id) => async (dispatch, getState) => {
  dispatch(speakerActions.startLoading());

  const fetchingSpeaker = async () => {
    //console.log(id, "I am passing from particularEvent action");
    const res = await fetch(
      `http://localhost:3000/eureka/v1/speakers/${id}/getSpeaker`,
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
    dispatch(speakerActions.startLoading());

    try {
      if (file) {
        console.log(formValues);

        console.log(file);

        let uploadConfig = await fetch(
          "http://localhost:3000/eureka/v1/upload/user/img",
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
          `http://localhost:3000/eureka/v1/speakers/${id}/update`,
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
          `http://localhost:3000/eureka/v1/speakers/${id}/update`,
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
      dispatch(speakerActions.hasError(err.message));
    }
  };
export const errorTrackerForEditSpeaker = () => async (dispatch, getState) => {
  dispatch(speakerActions.disabledError());
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

        let uploadConfig = await fetch(
          "http://localhost:3000/eureka/v1/upload/user/img",
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

        let res = await fetch(
          `http://localhost:3000/eureka/v1/booths/${id}/addBooth`,
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
          `http://localhost:3000/eureka/v1/booths/${id}/addBooth`,
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

    let fullLocation = `http://localhost:3000/eureka/v1/booths/${id}/getAllbooths`;
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

    let res = await fetch(
      `http://localhost:3000/eureka/v1/booths/${id}/getBoothDetails`,
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

        let uploadConfig = await fetch(
          "http://localhost:3000/eureka/v1/upload/user/img",
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

        let res = await fetch(
          `http://localhost:3000/eureka/v1/booths/${id}/updateBooth`,
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
          boothActions.EditBooth({
            booth: res.data,
          })
        );
      } else {
        console.log(id);
        console.log(formValues);
        let res = await fetch(
          `http://localhost:3000/eureka/v1/booths/${id}/updateBooth`,
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
          "http://localhost:3000/eureka/v1/upload/user/img",
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
  dispatch(sponsorActions.startLoading());
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

    dispatch(sponsorActions.hasError(err.message));
  }
};

export const errorTrackerForFetchSponsor = () => async (dispatch, getState) => {
  dispatch(sponsorActions.disabledError());
};

export const fetchSponsors =
  (id, term, sponsorStatus) => async (dispatch, getState) => {
    dispatch(sponsorActions.startLoading());

    const getSponsors = async () => {
      let fullLocation = `http://localhost:3000/eureka/v1/sponsors/${id}`;

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

export const editSponsor =
  (formValues, file, id) => async (dispatch, getState) => {
    dispatch(sponsorActions.startLoading());
    try {
      if (file) {
        console.log(formValues);

        console.log(file);

        let uploadConfig = await fetch(
          "http://localhost:3000/eureka/v1/upload/user/img",
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
      dispatch(sponsorActions.hasError(err.chatMessages));
    }
  };
export const errorTrackerForEditSponsor = () => async (dispatch, getState) => {
  dispatch(sponsorActions.disabledError());
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
    let res = await fetch(
      `http://localhost:3000/eureka/v1/community/${id}/addTicket`,
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
    let fullLocation = `http://localhost:3000/eureka/v1/events/${id}/tickets`;

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
  dispatch(ticketActions.startLoading());

  try {
    console.log(id);

    let res = await fetch(
      `http://localhost:3000/eureka/v1/events/${id}/ticket`,
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
      ticketActions.FetchTicket({
        ticket: res.data,
      })
    );
  } catch (err) {
    dispatch(ticketActions.hasError(err.message));
  }
};
export const errorTrackerForFetchTicket = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledError());
};
export const editTicket = (formValues, id) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoading());
  try {
    console.log(id);
    console.log(formValues);
    let res = await fetch(
      `http://localhost:3000/eureka/v1/events/${id}/updateTicket`,
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
      ticketActions.EditTicket({
        ticket: res.data,
      })
    );
  } catch (err) {
    dispatch(ticketActions.hasError(err.message));
  }
};
export const errorTrackerForEditTicket = () => async (dispatch, getState) => {
  dispatch(ticketActions.disabledError());
};

export const deleteTicket = (id) => async (dispatch, getState) => {
  dispatch(ticketActions.startLoading());

  try {
    console.log(id);

    let res = await fetch(
      `http://localhost:3000/eureka/v1/events/${id}/deleteTicket`,
      {
        method: "DELETE",

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
//       `http://localhost:3000/eureka/v1/events/${id}/addSpeaker`,
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

    let res = await fetch(
      `http://localhost:3000/eureka/v1/events/${id}/speakers`,
      {
        method: "GET",

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
    const res = await fetch("http://localhost:3000/eureka/v1/users/Me", {
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

      let uploadConfig = await fetch(
        "http://localhost:3000/eureka/v1/upload/user/img",
        {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );

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

      const res = await fetch(
        "http://localhost:3000/eureka/v1/users/updateMe",
        {
          method: "PATCH",
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
      const res = await fetch(
        "http://localhost:3000/eureka/v1/users/updateMe",
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
    const res = await fetch(
      "http://localhost:3000/eureka/v1/users/updatePassword",
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
    const res = await fetch(
      `http://localhost:3000/eureka/v1/community/${id}/getCommunity`,
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
    const res = await fetch(
      `http://localhost:3000/eureka/v1/community/${id}/updateCommunity`,
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
    const res = await fetch(`http://localhost:3000/eureka/v1/community/${id}`, {
      method: "GET",
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
    let res = await fetch(
      `http://localhost:3000/eureka/v1/events/${id}/addSession`,
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
    let fullLocation = `http://localhost:3000/eureka/v1/events/${id}/sessions`;
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
    try {
      console.log(id);
      let fullLocation = `http://localhost:3000/eureka/v1/events/${id}/sessionsForUser`;
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
          Authorization: `Bearer ${getState().auth.token}`,
        },
      });

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
    }
  };

export const fetchSession = (id) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoading());
  try {
    console.log(id);

    let res = await fetch(
      `http://localhost:3000/eureka/v1/events/${id}/sessions`,
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

      let res = await fetch(
        `http://localhost:3000/eureka/v1/sessions/${id}/getOneSession`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );

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
    dispatch(sessionActions.startLoading());
    try {
      const existingSession = getState().session.sessions.find((session) => {
        return session.id === id;
      });

      console.log(existingSession);
      if (!existingSession) {
        //console.log(id, "I am passing from particularEvent action");
        const res = await fetch(
          `http://localhost:3000/eureka/v1/sessions/${id}`,
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
      dispatch(sessionActions.hasError(err.message));
      console.log(err);
    }
  };

export const errorTrackerForFetchParticularSessionOfEvent =
  () => async (dispatch, getState) => {
    dispatch(sessionActions.disabledError());
  };

export const editSession = (formValues, id) => async (dispatch, getState) => {
  dispatch(sessionActions.startLoading());
  try {
    console.log(formValues);

    const res = await fetch(
      `http://localhost:3000/eureka/v1/sessions/${id}/update`,
      {
        method: "POST",
        // body: {...formValues},
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
    const result = await res.json();

    console.log(result, result.data);
    console.log(result.data);
    dispatch(
      sessionActions.EditSession({
        session: result.data.updatedSession,
      })
    );
  } catch (err) {
    dispatch(sessionActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForEditSession = () => async (dispatch, getState) => {
  dispatch(sessionActions.disabledError());
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

      let res = await fetch(
        `http://localhost:3000/eureka/v1/events/${id}/updateNetworking`,
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
    let res = await fetch(
      `http://localhost:3000/eureka/v1/community/coupons/createNew`,
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
    let res = await fetch(`http://localhost:3000/eureka/v1/community/coupons`, {
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
  dispatch(couponActions.startLoading());

  try {
    console.log(id);

    let res = await fetch(
      `http://localhost:3000/eureka/v1/community/${id}/getOneCoupon`,
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
      couponActions.FetchCoupon({
        coupon: res.data,
      })
    );
  } catch (err) {
    dispatch(couponActions.hasError(err.message));
    console.log(err);
  }
};
export const errorTrackerForFetchCoupon = () => async (dispatch, getState) => {
  dispatch(couponActions.disabledError());
};

export const editCoupon = (formValues, id) => async (dispatch, getState) => {
  dispatch(couponActions.startLoading());
  try {
    let res = await fetch(
      `http://localhost:3000/eureka/v1/community/${id}/updateCoupon`,
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
    console.log(res.data);

    dispatch(
      couponActions.EditCoupon({
        coupon: res.data,
      })
    );
  } catch (err) {
    dispatch(couponActions.hasError(err.message));
    console.log(err);
  }
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
        `http://localhost:3000/eureka/v1/stripe/getEventRegistrationCheckoutSession`,
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
    let res = await fetch(
      `http://localhost:3000/eureka/v1/users/query/createNew`,
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
      let res = await fetch(
        `http://localhost:3000/eureka/v1/feedback/community`,
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
      let fullLocation = `http://localhost:3000/eureka/v1/community/queries/getAll`;
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
  try {
    let res = await fetch(
      `http://localhost:3000/eureka/v1/community/queries/createAnswer`,
      {
        method: "PATCH",
        body: JSON.stringify({
          answerText: answerText,
          queryId: id,
        }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().communityAuth.token}`,
        },
      }
    );

    res = await res.json();
    console.log(res);

    dispatch(
      queriesActions.EditQuery({
        query: res.data,
      })
    );
  } catch (err) {
    console.log(err);
  }
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
    let res = await fetch(
      `http://localhost:3000/eureka/v1/users/forgotPassword`,
      {
        method: "POST",
        body: JSON.stringify({
          ...formValues,
        }),

        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
    try {
      let res = await fetch(
        `http://localhost:3000/eureka/v1/users/resetPassword/${token}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            ...formValues,
          }),

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
      history.push("/user/home");
    } catch (err) {
      console.log(err);
    }
  };

export const fetchRegistrationsOfParticularCommunity =
  (communityId) => async (dispatch, getState) => {
    dispatch(registrationActions.startLoading());

    const fetchRegistration = async () => {
      console.log(communityId);

      let res = await fetch(
        `http://localhost:3000/eureka/v1/registrations/community/getAll`,
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
export const errorTrackerForfetchRegistrationsOfParticularCommunity =
  () => async (dispatch, getState) => {
    dispatch(registrationActions.disabledError());
  };

export const fetchParticularRegistration =
  (id) => async (dispatch, getState) => {
    try {
      console.log(id);

      let res = await fetch(
        `http://localhost:3000/eureka/v1/registrations/${id}/getOne`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().communityAuth.token}`,
          },
        }
      );

      res = await res.json();
      console.log(res);

      dispatch(
        registrationActions.FetchRegistration({
          registration: res.data,
        })
      );
    } catch (err) {
      console.log(err);
    }
  };

export const createNewInvitation =
  (formValues) => async (dispatch, getState) => {
    try {
      console.log(formValues);

      let res = await fetch(
        `http://localhost:3000/eureka/v1/team-invites/create-new`,
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
    try {
      console.log(sessionRole, sessionId);

      dispatch(
        eventAccessActions.setSessionRole({
          sessionRole: sessionRole,
        })
      );
    } catch (err) {
      console.log(err);
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
//         `http://localhost:3000/eureka/v1/getCurrentUsers/${eventId}`,
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

export const getRTMToken = (eventId) => async (dispatch, getState) => {
  dispatch(RTMActions.startLoading());

  const fetchingRTMToken = async () => {
    let res = await fetch("http://localhost:3000/eureka/v1/getRTMToken", {
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

    await client.login({
      uid: getState().user.userDetails._id,
      token: res.token,
    });
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

export const errorTrackerForfetchEventChats =
  () => async (dispatch, getState) => {
    dispatch(eventChatActions.disabledError());
  };

export const fetchPreviousEventChatMessages =
  (eventId) => async (dispatch, getState) => {
    try {
      console.log(eventId);

      let res = await fetch(
        `http://localhost:3000/eureka/v1/getPreviousEventMsg/${eventId}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      );

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

export const getRTCToken = (sessionId, role) => async (dispatch, getState) => {
  dispatch(RTCActions.startLoading());

  const fetchingRTCToken = async () => {
    let res = await fetch(
      "http://localhost:3000/eureka/v1/getLiveStreamingToken",
      {
        method: "POST",
        body: JSON.stringify({
          sessionId: sessionId,
          role: role,
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
    let res = await fetchingRTCToken();
    console.log(res);

    dispatch(
      RTCActions.fetchRTCToken({
        token: res.token,
      })
    );
  } catch (err) {
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
