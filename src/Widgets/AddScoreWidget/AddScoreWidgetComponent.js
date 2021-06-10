import React from "react";
import * as Scrivito from "scrivito";
import addScore from "../../utils/addScore";

Scrivito.provideComponent("AddScoreWidget", ({ _widget }) => {
  const profileId = localStorage.getItem("profile_id");
  if (!profileId) {
    return;
  }
  addScore("visit-landing-page");

  return <div></div>;
});
