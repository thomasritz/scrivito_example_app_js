import React from "react";
import * as Scrivito from "scrivito";
import useFetch from "use-http";
import "./TargetingWidget.scss";

Scrivito.provideComponent("TargetingWidget", ({ _widget }) => {
  const profileId = "3997c37116004f90b21230276ff61ed4";
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
