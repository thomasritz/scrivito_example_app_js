import React from "react";
import * as Scrivito from "scrivito";
import useFetch from "use-http";
import "./TargetingWidget.scss";

Scrivito.provideComponent("TargetingWidget", ({ _widget }) => {
  const profileId = localStorage.getItem("profile_id");
  if (!profileId) {
    return;
  }
  const { data = {} } = useFetch(
    `https://eva.crm.infopark.net/api2/profiles/${profileId}/targeting`,
    {
      cacheLife: 60000,
      cachePolicy: "cache-first",
      responseType: "json",
      persist: true,
    },
    []
  );

  return (
    <div className="targeting">
      <div className="score">Score: {data.activity_score}</div>
      <div className="gender">Gender: {data.gender}</div>
    </div>
  );
});
