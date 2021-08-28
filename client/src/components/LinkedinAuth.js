import React from "react";
import { LinkedInApi, NodeServer } from "./LinkedinConfig";
import axios from "axios";
import linkedInLoginImage from "./linkedin-login-images/Retina/Sign-In-Small---Default.png";
import { connect } from "react-redux";
import { linkedinSignIn } from "../actions/index";
import { Link } from "react-router-dom";
class LinkedinAuth extends React.Component {
  // initialState = {
  //   user: {},
  //   loggedIn: false,
  // };

  // constructor(props) {
  //   super(props);
  //   // this.state = this.initialState;
  // }

  // componentDidMount = () => {
  //   if (window.opener && window.opener !== window) {
  //     const code = this.getCodeFromWindowURL(window.location.href);
  //     console.log(code);
  //     window.opener.postMessage({ type: "code", code: code }, "*");
  //     window.close();
  //   }
  //   window.addEventListener("message", this.handlePostMessage);
  // };

  // handlePostMessage = (event) => {
  //   if (event.data.type === "code") {
  //     const { code } = event.data;
  //     console.log(code);
  //     this.props.linkedinSignIn(code);
  //   }
  // };

  // getCodeFromWindowURL = (url) => {
  //   const popupWindowURL = new URL(url);
  //   return popupWindowURL.searchParams.get("code");
  // };

  // showPopup = () => {
  //   let { clientId, redirectUrl, oauthUrl, scope, state } = LinkedInApi;
  //   oauthUrl = `${oauthUrl}&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUrl}`;
  //   const width = 450,
  //     height = 730,
  //     left = window.screen.width / 2 - width / 2,
  //     top = window.screen.height / 2 - height / 2;
  //   window.open(
  //     oauthUrl,
  //     "Linkedin",
  //     "menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=" +
  //       width +
  //       ", height=" +
  //       height +
  //       ", top=" +
  //       top +
  //       ", left=" +
  //       left
  //   );
  // };

  // getUserCredentials = (code) => {
  //   axios
  //     .get(
  //       `${NodeServer.baseURL} + ${NodeServer.getUserCredentials}?code=${code}`
  //     )
  //     .then((res) => {
  //       const user = res.data;
  //       this.setState({
  //         user,
  //         loaded: true,
  //       });
  //       // Do something with user
  //     });
  // };

  render() {
    // const { loggedIn, user } = this.state;
    // const contentWhenLoggedIn = (
    //   <>
    //     <img src={user.profileImageURL} alt="Profile image" />
    //     <h3>{`${user.firstName} ${user.lastName}`}</h3>
    //     <h3>{user.email}</h3>
    //   </>
    // );
    let { clientId, redirectUrl, oauthUrl, scope, state } = LinkedInApi;
    oauthUrl = `${oauthUrl}&client_id=${clientId}&scope=${scope}&state=${state}&redirect_uri=${redirectUrl}`;
    const contentWhenLoggedOut = (
      <>
        <a href={oauthUrl}>SignIn With LinkedIn</a>
        {/* <h2>Sign in with LinkedIn</h2> */}
        {/* <a href> <img
          src={linkedInLoginImage}
          alt="Sign in with LinkedIn"
          onClick={this.showPopup}
        /></a> */}
      </>
    );
    return <div>{contentWhenLoggedOut}</div>;
  }
}

export default connect(null, { linkedinSignIn })(LinkedinAuth);
