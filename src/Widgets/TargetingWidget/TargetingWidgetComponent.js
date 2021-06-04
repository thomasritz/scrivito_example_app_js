import * as React from "react";
import * as Scrivito from "scrivito";
import axios from "axios";
import "./TargetingWidget.scss";

class TargetingWidgetComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activityScore: 0, gender: "" };
  }

  componentDidMount() {
    getProfileTargetingData().then((state) => {
      if (this.isUnmounted) {
        return;
      }
      this.setState(state);
      console.log("state in widget:", state);
    });
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  render() {
    return (
      <div className="targeting">
        <div className="score">Score: {this.state.activityScore}</div>
        <div className="gender">Gender: {this.state.gender}</div>
      </div>
    );
  }
}

Scrivito.provideComponent("TargetingWidget", TargetingWidgetComponent);

let cachedRequest;

function getProfileTargetingData() {
  if (!cachedRequest) {
    const profileId = "3997c37116004f90b21230276ff61ed4";
    cachedRequest = axios(
      `https://eva.crm.infopark.net/api2/profiles/${profileId}/targeting`
    ).then((response) => {
      const { activity_score: activityScore, gender } = response.data;
      return { activityScore, gender };
    });
  }
  return cachedRequest;
}
