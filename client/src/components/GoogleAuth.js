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
      this.props.googleSignIn(
        ModifiedFormValues,
        this.props.intent,
        this.props.eventId
      );
    }
  };

  onSignInClick = () => {
    this.auth.signIn();
  };

  onSignOutClick = () => {
    this.auth.signOut();
  };
  renderAuthButton() {
    return (


      <>
      
      
      <div
                  className="row d-flex"
                  style={{
                    justifyContent: "space-between",
                    marginBottom: "4%",
                  }}
                >
                  <div onClick={this.onSignInClick}>
                    

                    <button
                      type="button"
                      className="btn btn-light py-2"
                      style={{ width: "100%" }}
                    >
                      <div className="google-btn-container d-flex flex-row align-items-center justify-content-center">
                        <img
                          class=""
                          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                          alt="google-signin"
                        />
                        <div className="sign-in-with-google-text ms-4">
                         <a href="https://www.evenz.co.in/api-eureka/eureka/v1/auth/google" style={{textDecoration: "none"}}>Sign in with google</a> 
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
      
      
      
      
      </>
      // <button onClick={this.onSignInClick} className="ui red google button">
      //   <i className="google icon" />
      //   Sign In with Google
      // </button>
    );
  }
  render() {
    return <div>{this.renderAuthButton()}</div>;
  }
}

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
};

export default connect(mapStateToProps, {
  googleSignIn,
})(GoogleAuth);
