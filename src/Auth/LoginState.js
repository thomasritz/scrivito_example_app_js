import * as Scrivito from "scrivito";
import { Cognito } from "./Cognito";
import psa_lib from "../Widgets/PisaPortal/lib/PisaLib";

const keyIsVisitorLoggedIn = "Scrivito.isVisitorLoggedIn";
const keyRedirectAfterLoginUrl = "Scrivito.redirectAfterLoginUrl";

// undefined  - initial state
// "disabled" - logged in as editor, so logging in wouldn't change anything
// true       - user is logged in as visitor
// false      - user is not logged in as visitor
let initialState;
let currentState;
const stateChangeNotifications = [];

export function wantVisitorAuthentication() {
  initializeStatesIfNecessary();
  return initialState === true;
}

function initializeStatesIfNecessary() {
  if (initialState !== undefined) {
    return;
  }

  if (Scrivito.isEditorLoggedIn()) {
    initialState = "disabled";
  } else if (getVisitorIdentityProvider().handleReturnUrl()) {
    // If the window URL looked like an IdP return URL and the IdP lib handled this case we know
    // we're already right in the middle of the login process.
    initialState = true;
  } else if (localStorage.getItem(keyIsVisitorLoggedIn) === "true") {
    // Some IdP libraries want us to remember the login state. If we remembered that the user was
    // logged in already we trigger to get the session from the IdP. In case the user is still
    // logged in with the IdP, this just results in Scrivito getting the ID token again. Otherwise,
    // the user will be prompted with a login page.
    getVisitorIdentityProvider().getSession();
    initialState = true;
  } else {
    initialState = false;
  }
  currentState = initialState;
}

export function login() {
  // Some IdP libs always want to redirect to a preconfigured URL after login. We remember the
  // current URL for redirecting to this specific page instead.
  localStorage.setItem(keyRedirectAfterLoginUrl, window.location.href);
  getVisitorIdentityProvider().getSession();
}

export function logout() {
  localStorage.removeItem(keyIsVisitorLoggedIn);
  getVisitorIdentityProvider().logout();
}

export function onLoginStateChange(callback) {
  stateChangeNotifications.push(callback);
  initializeStatesIfNecessary();
  callback(currentState);

  return () => {
    const index = stateChangeNotifications.index(callback);
    if (index !== -1) {
      stateChangeNotifications.splice(index, 1);
    }
  };
}

let provider;

function getVisitorIdentityProvider() {
  if (provider) {
    return provider;
  }

  provider = getCognito();
  provider.onTokenSuccess(() => {
    currentState = true;
    localStorage.setItem(keyIsVisitorLoggedIn, "true");

    // Previously, we remembered to which page we want to redirect after login.
    const url = localStorage.getItem(keyRedirectAfterLoginUrl);
    if (url) {
      localStorage.removeItem(keyRedirectAfterLoginUrl);
      window.location.href = url;
    }

    // Some IdP libs call this onTokenSuccess callback synchronously if they have the session
    // cached. In this case telling Scrivito about the ID token is too early, before Scrivito
    // initialized itself. Here we let Scrivito finish its initialization first.
    setTimeout(() => {
      console.log("id token", provider.getIdToken());
      Scrivito.setVisitorIdToken(provider.getIdToken());
      psa_lib.setIdToken(provider.getIdToken());
      stateChangeNotifications.forEach((callback) => callback(currentState));
    }, 0);
  });

  provider.onTokenFailure(() => {
    currentState = false;
    localStorage.removeItem(keyIsVisitorLoggedIn);
    // We want to make sure the user is logged out. Maybe the IdP has already cleared previous login
    // state, maybe not.
    provider.logout();
    stateChangeNotifications.forEach((callback) => callback(currentState));
    if (initialState === true) {
      window.location.reload();
    }
  });

  return provider;
}

function getCognito() {
  return new Cognito({
    domain: process.env.AUTH_DOMAIN,
    clientId: process.env.AUTH_CLIENT_ID,
    redirectUri: `${window.location.origin}/`,
    userPoolId: process.env.AUTH_USER_POOL_ID,
  });
}
