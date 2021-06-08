import React, { useEffect, useState } from "react";
import * as Scrivito from "scrivito";
import addScore from "../../utils/addScore";

Scrivito.provideComponent("DoubleOptInConfirmationWidget", ({ _widget }) => {
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    postData();
  }, []);

  const postData = () => {
    const { t } = Scrivito.currentPageParams();
    if (t && (status === "idle" || status === "error")) {
      setStatus("processing");
      try {
        fetch("https://eva.crm.infopark.net/api2/forms/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ t }),
        })
          .then((response) => {
            if (response.ok) {
              setStatus("success");
              return response.json();
            }
            setStatus("error");
          })
          .then((data) => {
            const profileId = data.profile_id;
            localStorage.setItem("profile_id", profileId);
            addScore("confirm-form");
          });
      } catch (error) {
        console.log(error);
        setStatus("error");
      }
    }
  };

  const msg = () => {
    switch (status) {
      case "error":
        return "Something went wrong, please try again";
      case "success":
        return "Sie haben Ihre E-Mail erfolgreich bestätigt.";
      default:
        return "Bitte bestätigen Sie Ihre E-Mail";
    }
  };

  return (
    <div className="theme_green">
      <div className="btn btn-brand" onClick={postData}>
        {msg()}
      </div>
    </div>
  );
});
