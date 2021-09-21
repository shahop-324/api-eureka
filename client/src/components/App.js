import React from "react";
import { connect } from "react-redux";
import Signin from "./Signin/Signin";
import Signup from "./Signup/Signup";
import UserAccountHome from "./UserAccount/UserAccountHome";
import ExploreEvents from "./ExploreEvents/ExploreEvents";
import SearchEvents from "./SearchEvents/SearchEvents";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "../history";
import EventLandingPage from "./EventLandingPage/EventLandingPage";
import Basics from "./Dashboard/EditEvent/Basics";
import About from "./Dashboard/EditEvent/About";
import Sessions from "./Dashboard/EditEvent/Sessions";
import Speakers from "./Dashboard/EditEvent/Speakers";
import Booths from "./Dashboard/EditEvent/Booths";
import Ticketing from "./Dashboard/EditEvent/Ticketing";
import Sponsors from "./Dashboard/EditEvent/Sponsor";
import Networking from "./Dashboard/EditEvent/Networking";
import Root from "./HostingPlatform/Root";
import SessionScreen from "./HostingPlatform/Screens/SessionScreen";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ResetPassword from "./ResetPassword/ResetPassword";
import DashboardRoot from "./Dashboard/DashboardRoot";
import EditEventRoot from "./Dashboard/EditEvent/EditEventRoot";
import SpecificEventRoot from "./Dashboard/SpecificEvent/root";
import SignInForEventRegistration from "./Signin/SignInForEventRegistration";
import AcceptInvite from "./Dashboard/AcceptInvite";
import NotFoundPage from "./StaticScreens/Screens/NotFound";
import Home from "./StaticScreens/Screens/Home";
import TermsOfService from "./StaticScreens/Screens/TermsOfService";
import PrivacyPolicy from "./StaticScreens/Screens/PrivacyPolicy";
import InternalServerError from "./StaticScreens/Screens/InternalServerError";
import Pricing from "./StaticScreens/Screens/Pricing";
import UseCases from "./StaticScreens/Screens/UseCases";
import AboutUs from "./StaticScreens/Screens/AboutUs";
import ContactUs from "./StaticScreens/Screens/ContactUs";
import AcceptSpeakerInvite from "./AcceptSpeakerInvite";

import AOS from "aos";
import "aos/dist/aos.css";
import EventManagementHome from "./StaticScreens/Screens/EventManagementHome";
import EventBuilder from "./StaticScreens/Screens/EventBuilder";
import EventPlatform from "./StaticScreens/Screens/EventPlatform";
import SigninForBuyingPlan from "./Signin/SigninForBuyingPlan";
import CompatibilityTest from "./HostingPlatform/CompatibilityTest";
import TicketingPricing from "./StaticScreens/Screens/TicketingPricing";
import CommunityPublicPage from "./StaticScreens/Screens/communityPublicPage";

import socket from "./HostingPlatform/service/socket";
import {
  DuplicateUserSignOut,
  googleSignIn,
  newLinkedinLogin,
} from "../actions/index";
import { signIn } from "../actions/index";

import BoothArea from "./HostingPlatform/Screens/BoothArea";
import SignInNew from "./Signin/SigninNew";
import SignupNew from "./Signup/SignupNew";
import SessionStage from "./HostingPlatform/Screens/SessionStage";

AOS.init();

class App extends React.Component {
  componentDidMount = () => {
    socket.on("logOutUser", ({ userId, message }) => {
      console.log("hey,hitting logOutUser");
      console.log(userId);
      console.log(message);
      // dispatch(createNewEventAlert(newAlert));

      this.props.DuplicateUserSignOut(userId, message);
    });

    socket.on("newLogin", (res) => {
      console.log("hey hitting the new login in App.js 64 ");
      this.props.signIn(
        res,
        this.props.signinForEventRegistrationEventId,
        this.props.signinForBuyingPlanIntent
      );
    });
    socket.on("newGoogleLogin", (res) => {
      this.props.googleSignIn(
        res,
        this.props.signinForEventRegistrationEventId,
        this.props.signinForBuyingPlanIntent
      );
    });
    socket.on("newLinkedinLogin", (res) => {
      console.log(res, "i am counting on you res linkedin app");
      console.log("New likedin login was triggered.")
      this.props.newLinkedinLogin(
        res,
        this.props.signinForEventRegistrationEventId,
        this.props.signinForBuyingPlanIntent
      );
    });
  };

  render() {
    const { isSignedIn } = this.props;

    // (() => {
    //   console.log("i run ");
    //   window.localStorage.clear();
    //   console.log("i runned");
    // })();

    console.log(typeof isSignedIn);
    return (
      <>
        <Router history={history}>
          <div>
            <Switch>
              <Route path="/test" exact component={SessionStage} />
              <Route path="/home" exact component={Home} />

              <Route path="/" exact component={Home} />

              <Route path="/signup" exact component={Signup} />
              <Route path="/login" exact component={SignInNew} />
              <Route path="/signup-new" exact component={SignupNew} />

              {!isSignedIn && <Route path="/signin" exact component={Signin} />}

              <Route
                path="/signin/:eventId"
                exact
                component={SignInForEventRegistration}
              />

              <Route
                path="/login/buy-plan"
                exact
                component={SigninForBuyingPlan}
              />

              {/* // TODO LINK ALL STATIC PAGES HERE */}

              <Route
                path="/join-as-speaker"
                exact
                component={AcceptSpeakerInvite}
              />
              <Route
                path="/compatibility-test/community/:communityId/event/:eventId/"
                exact
                component={CompatibilityTest}
              />
              <Route path="/use-cases" exact component={UseCases} />
              <Route path="/about-us" exact component={AboutUs} />
              <Route
                path="/event-management"
                exact
                component={EventManagementHome}
              />
              <Route path="/event-builder" exact component={EventBuilder} />
              <Route path="/event-platform" exact component={EventPlatform} />
              <Route path="/contact-us" exact component={ContactUs} />
              <Route
                path="/community-public-page/:communityId"
                exact
                component={CommunityPublicPage}
              />

              <Route
                path="/pricing/ticketing"
                exact
                component={TicketingPricing}
              />
              <Route path="/pricing" exact component={Pricing} />
              <Route path="/not-found" exact component={NotFoundPage} />
              <Route
                path="/internal-server-error"
                exact
                component={InternalServerError}
              />

              <Route
                path="/terms-of-service"
                exact
                component={TermsOfService}
              />
              <Route path="/privacy-policy" exact component={PrivacyPolicy} />

              <Route path="/accept-invite" exact component={AcceptInvite} />

              <Route path="/explore-events/" exact component={ExploreEvents} />
              <Route
                path="/event-landing-page/:id"
                exact
                component={EventLandingPage}
              />
              <Route path="/search-events/" exact component={SearchEvents} />

              {isSignedIn && (
                <Route path="/user/home" exact component={UserAccountHome} />
              )}

              {isSignedIn && (
                <Route path="/user/events" exact component={UserAccountHome} />
              )}
              {isSignedIn && (
                <Route
                  path="/user/recordings"
                  exact
                  component={UserAccountHome}
                />
              )}
              {isSignedIn && (
                <Route path="/user/profile" exact component={UserAccountHome} />
              )}
              {isSignedIn && (
                <Route path="/user/reviews" exact component={UserAccountHome} />
              )}
              {isSignedIn && (
                <Route path="/user/queries" exact component={UserAccountHome} />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/analytics"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/registrations"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/custom-registration"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/affiliates"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/interested-people"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/leads"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/integrations"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/video-library"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/branding"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/recordings"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/live-streaming"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/:communityId/event/:eventId/mail-campaign"
                  exact
                  component={SpecificEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/basics"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/about-event"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/sessions"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/speakers"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/booths"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/sponsors"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/ticketing"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/edit-event/:id/networking"
                  exact
                  component={EditEventRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/overview/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/event-management/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/reviews/:id"
                  exact
                  component={DashboardRoot}
                />
              )}
              {isSignedIn && (
                <Route
                  path="/user/:userId/community/queries/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/registrations/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/recordings/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/integrations/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/coupons/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/billing/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/team-management/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/user/:userId/community/revenue-management/:id"
                  exact
                  component={DashboardRoot}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/basics"
                  exact
                  component={Basics}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/about"
                  exact
                  component={About}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/sessions"
                  exact
                  component={Sessions}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/speakers"
                  exact
                  component={Speakers}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/booths"
                  exact
                  component={Booths}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/ticketing"
                  exact
                  component={Ticketing}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/sponsors"
                  exact
                  component={Sponsors}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/event-management/networking"
                  exact
                  component={Networking}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/lobby"
                  exact
                  component={Root}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/sessions"
                  exact
                  component={Root}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/networking"
                  exact
                  component={Root}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/rooms"
                  exact
                  component={Root}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/booths"
                  exact
                  component={Root}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/reception"
                  exact
                  component={Root}
                />
              )}

              {/* // TODO */}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/session/:sessionId"
                  exact
                  component={SessionStage}
                />
              )}

              {isSignedIn && (
                <Route
                  path="/community/:communityId/event/:eventId/hosting-platform/booths/:boothId"
                  exact
                  component={BoothArea}
                />
              )}

              <Route path="/forgot-password" exact component={ForgotPassword} />
              <Route
                path="/reset-password/:passwordResetToken"
                exact
                component={ResetPassword}
              />

              <Route path="*">
                <Redirect to="/not-found" exact component={NotFoundPage} />
              </Route>
            </Switch>
          </div>
        </Router>
      </>
    );
  }
}
const mapStateToProps = (state, props) => ({
  isSignedIn: state.auth.isSignedIn,
  signinForBuyingPlanIntent: state.auth.signinForBuyingPlanIntent,
  signinForEventRegistrationEventId:
    state.auth.signinForEventRegistrationEventId,
});

export default connect(mapStateToProps, {
  DuplicateUserSignOut,
  signIn,
  googleSignIn,
  newLinkedinLogin,
})(App);
