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
import NewSignIn from "./Signin/NewSignIn";

class App extends React.Component {
  render() {
    const { isSignedIn } = this.props;
    // (() => {
    //   console.log("i run ");
    //   window.localStorage.clear();
    //   console.log("i runned");
    // })();
    return (
      <>
        <Router history={history}>
          <div>
            <Switch>
              {!isSignedIn && (
                <Route path="/signin" exact component={Signin} />
                // <Route path="/signup" exact component={Signup} />
              )}

              <Route
                path="/signin/:eventId"
                exact
                component={SignInForEventRegistration}
              />

              {/* // TODO LINK ALL STATIC PAGES HERE */}

              <Route path="/login" exact component={NewSignIn} />
              <Route path="/not-found" exact component={NotFoundPage} />
              <Route path="/internal-server-error" exact component={InternalServerError} />
              <Route path="/home" exact component={Home} />
              <Route path="/" exact component={Home} />
              <Route
                path="/terms-of-service"
                exact
                component={TermsOfService}
              />
              <Route path="/privacy-policy" exact component={PrivacyPolicy} />

              <Route path="/signin" exact component={Signin} />
              <Route path="/signup" exact component={Signup} />
              <Route path="/accept-invite" exact component={AcceptInvite} />

              <Route path="/explore-events/" exact component={ExploreEvents} />
              <Route
                path="/event-landing-page/:id"
                exact
                component={EventLandingPage}
              />
              <Route path="/search-events/" exact component={SearchEvents} />

              <Route path="/user/home" exact component={UserAccountHome} />

              <Route path="/user/events" exact component={UserAccountHome} />
              <Route
                path="/user/recordings"
                exact
                component={UserAccountHome}
              />
              <Route path="/user/profile" exact component={UserAccountHome} />

              <Route
                path="/user/:userId/community/:communityId/event/:eventId/pre-analytics"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/registrations"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/queries"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/reviews"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/post-analytics"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/polls"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/stage-customisation"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/uploaded-content"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/rtmp-and-live-streaming"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/integrations"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/email-customisation"
                exact
                component={SpecificEventRoot}
              />
              <Route
                path="/user/:userId/community/:communityId/event/:eventId/security-checks"
                exact
                component={SpecificEventRoot}
              />

              <Route
                path="/community/:communityId/edit-event/:id/basics"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/about-event"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/sessions"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/speakers"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/booths"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/sponsors"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/ticketing"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/community/:communityId/edit-event/:id/networking"
                exact
                component={EditEventRoot}
              />
              <Route
                path="/user/:userId/community/overview/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/event-management/:id"
                exact
                component={DashboardRoot}
              />

              <Route
                path="/user/:userId/community/reviews/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/queries/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/registrations/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/recordings/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/coupons/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/billing/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/team-management/:id"
                exact
                component={DashboardRoot}
              />
              <Route
                path="/user/:userId/community/revenue-management/:id"
                exact
                component={DashboardRoot}
              />

              <Route
                path="/community/event-management/basics"
                exact
                component={Basics}
              />
              <Route
                path="/community/event-management/about"
                exact
                component={About}
              />
              <Route
                path="/community/event-management/sessions"
                exact
                component={Sessions}
              />
              <Route
                path="/community/event-management/speakers"
                exact
                component={Speakers}
              />
              <Route
                path="/community/event-management/booths"
                exact
                component={Booths}
              />
              <Route
                path="/community/event-management/ticketing"
                exact
                component={Ticketing}
              />
              <Route
                path="/community/event-management/sponsors"
                exact
                component={Sponsors}
              />
              <Route
                path="/community/event-management/networking"
                exact
                component={Networking}
              />

              <Route
                path="/community/:communityId/event/:eventId/hosting-platform/lobby"
                exact
                component={Root}
              />
              <Route
                path="/community/:communityId/event/:eventId/hosting-platform/sessions"
                exact
                component={Root}
              />
              <Route
                path="/community/:communityId/event/:eventId/hosting-platform/networking"
                exact
                component={Root}
              />
              <Route
                path="/community/:communityId/event/:eventId/hosting-platform/rooms"
                exact
                component={Root}
              />
              <Route
                path="/community/:communityId/event/:eventId/hosting-platform/booths"
                exact
                component={Root}
              />

              {/* // TODO */}

              <Route
                path="/community/:communityId/event/:eventId/hosting-platform/session/:sessionId"
                exact
                component={SessionScreen}
              />

              <Route path="/forgotPassword" exact component={ForgotPassword} />
              <Route
                path="/resetPassword/:passwordResetToken"
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
});

export default connect(mapStateToProps)(App);