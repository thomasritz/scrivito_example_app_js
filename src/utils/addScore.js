function addScore(eventType) {
  const profileId = localStorage.getItem("profile_id");
  if (!profileId) {
    return;
  }
  try {
    fetch(`https://eva.crm.infopark.net/api2/profiles/${profileId}/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_type: eventType }),
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

export default addScore;
