import React from "react";
import { connect } from "react-redux";
import { googleSignIn } from "../actions";

class GoogleAuth extends React.Component {
  componentDidMount() {
    window.gapi.load("client:auth2", () => {
      window.gapi.client
        .init({
          clientId:
            "438235916836-6oaj1fbnqqrcd9ba30348fbe2ebn6lt0.apps.googleusercontent.com",
          scope: "profile email",
        })
        .then(() => {
          this.auth = window.gapi.auth2.getAuthInstance();

          this.onAuthChange(this.auth.isSignedIn.get());
          this.auth.isSignedIn.listen(this.onAuthChange);
        });
    });
  }

  onAuthChange = (isSignedIn) => {
    if (isSignedIn) {
      let profile = this.auth.currentUser.get().getBasicProfile();

      //this.props.googleSignIn();

      const ModifiedFormValues = {};

      ModifiedFormValues.firstName = profile.getGivenName();
      ModifiedFormValues.lastName = profile.getFamilyName();
      ModifiedFormValues.image = profile.getImageUrl();
      ModifiedFormValues.googleId = profile.getId();
      ModifiedFormValues.email = profile.getEmail();
      this.props.googleSignIn(ModifiedFormValues);
    } else {
      this.props.signOut();
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  // onSignOutClick = () => {
  //   this.auth.signOut();
  // };
  renderAuthButton() {
    return (
      <button onClick={this.onSignInClick} className="ui red google button">
        <i className="google icon" />
        Sign In with Google
      </button>
    );
  }

  // renderAuthButton() {
  //   if (this.props.isSignedIn === null) {
  //     return null;
  //   } else if (this.props.isSignedIn) {
  //     return (
  //       <button onClick={this.onSignOutClick} className="ui red google button">
  //         <i className="google icon" />
  //         Sign Out
  //       </button>
  //     );
  //   } else {
  //     return (
  //       <button onClick={this.onSignInClick} className="ui red google button">
  //         <i className="google icon" />
  //         Sign In with Google
  //       </button>
  //     );
  //   }
  // }

  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, {
  googleSignIn,

  // errorTrackerForGoogleSignIn,
})(GoogleAuth);
