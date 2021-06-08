function addScore(eventType) {
  const profileId = localStorage.getItem("profile_id");
  fetch(`https://eva.crm.infopark.net/api2/profiles/${profileId}/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event_type: eventType }),
  });
}

export default addScore;
