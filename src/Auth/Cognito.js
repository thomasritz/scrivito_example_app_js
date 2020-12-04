import { CognitoAuth } from "amazon-cognito-auth-js";

export class Cognito {
  constructor({ domain, clientId, redirectUri, userPoolId }) {
    this.auth = new CognitoAuth({
      ClientId: clientId,
      AppWebDomain: domain,
      TokenScopesArray: ["openid", "profile", "email"],
      RedirectUriSignIn: redirectUri,
      RedirectUriSignOut: redirectUri,
      UserPoolId: userPoolId,
    });
    this.auth.useCodeGrantFlow();
    this.auth.userhandler = {
      onSuccess: (cognitoSession) => {
        console.log("onSuccess");
        const idToken = cognitoSession.getIdToken().getJwtToken();
        const expiresAt = cognitoSession.getIdToken().getExpiration();
        const d = new Date();
        d.setTime(expiresAt * 1000);
        console.log("id token expires at", d);
        this.setSession({ idToken, expiresAt });
        this.startRenewSessionTimer();
        this.tokenSuccessCallbacks.forEach((callback) => callback());
      },
      onFailure: (_err) => {
        this.stopRenewSessionTimer();
        this.tokenFailureCallbacks.forEach((callback) => callback());
      },
    };

    this.tokenSuccessCallbacks = [];
    this.tokenFailureCallbacks = [];

    this.idToken = null;
    this.expiresAt = 0;
  }

  // token lifecycle hooks

  onTokenSuccess(callback) {
    return addEntry(this.tokenSuccessCallbacks, callback);
  }

  onTokenFailure(callback) {
    return addEntry(this.tokenFailureCallbacks, callback);
  }

  // state

  getIdToken() {
    return this.idToken;
  }

  // getSession gets an existing session or starts a new one. The onSuccess will be called with the
  // session data once the session has been established.
  getSession() {
    console.log("getSession()");
    this.auth.getSession();
  }

  // handleReturnUrl looks if the URL looks like a return URL to our app after the user filled in
  // the login form. In this case the URL params are processed by the Cognito lib.
  handleReturnUrl() {
    const wasReturnUrl = isIdTokenReturnUrl(window.location);
    this.auth.parseCognitoWebResponse(window.location.href);
    const isReturnUrl = isIdTokenReturnUrl(window.location);

    if (wasReturnUrl && isReturnUrl) {
      window.history.pushState("", document.title, window.location.pathname);
    }
    console.log("handleReturnUrl():");
    console.log(wasReturnUrl);
    return wasReturnUrl;
  }

  renewSession() { // eslint-disable-line
    // TODO: Must not return a cached session if called from expiry prevention
    console.log("renewSession()");
    this.auth.getSession();
  }

  logout() {
    this.idToken = null;
    this.expiresAt = 0;

    this.auth.signOut();
    this.stopRenewSessionTimer();
  }

  // private

  setSession({ idToken, expiresAt }) {
    this.idToken = idToken;
    this.expiresAt = expiresAt;

    this.tokenSuccessCallbacks.forEach((callback) => callback());
  }

  startRenewSessionTimer() {
    this.stopRenewSessionTimer();

    const sleepMillis = this.expiresAt * 1000 - new Date().getTime();
    console.log("now:", new Date(), "startRenewSessionTimer again in:", sleepMillis / 1000, "s");
    this.expirationTimeout = setTimeout(() => this.renewSession(), sleepMillis);
  }

  stopRenewSessionTimer() {
    if (this.expirationTimeout) {
      clearTimeout(this.expirationTimeout);
      this.expirationTimeout = undefined;
    }
  }
}

function isIdTokenReturnUrl(windowLocation) {
  const { hash } = windowLocation;
  return hash !== undefined && hash.substr(0, 9) === "#id_token";
}

function addEntry(list, entry) {
  list.push(entry);
  return () => {
    const index = list.indexOf(entry);
    list.splice(index, 1);
  };
}
