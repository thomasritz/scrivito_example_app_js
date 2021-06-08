import * as React from "react";
import * as Scrivito from "scrivito";
import "./EventSignUpFormWidget.scss";

class EventSignUpFormWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        name: "",
        email: "",
        newsletter_consent: false,
      },
      submissionState: "idle",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const { id } = target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { fields } = this.state;
    fields[id] = value;

    this.setState({
      fields,
    });
  }

  sendDataToWebCRM() {
    try {
      fetch("https://eva.crm.infopark.net/api2/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form_name: "demo",
          confirmation_link_url: "http://localhost:8080/confirm",
          form: this.state.fields,
          language: "de",
          mailing_topics: {},
        }),
      }).then((response) => {
        if (response.ok) {
          this.setState({ submissionState: "success" });
        } else {
          this.setState({ submissionState: "error" });
        }
      });
    } catch (error) {
      console.log(error);
      this.setState({ submissionState: "error" });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.sendDataToWebCRM();
  }

  render() {
    const { submissionState } = this.state;

    const form = (
      <div className="EventSignUpFormWidget">
        <h2>EventSignUpFormWidget</h2>
        <form name="demo">
          <div className="row mb-5">
            <div className="col-xl-6">
              <div className="form-group">
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  placeholder="Name *"
                  noValidate
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="sr-only">
                  E-Mail
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  placeholder="E-Mail *"
                  noValidate
                />
              </div>
              <div className="form-group">
                <label className="check_label">
                  <input
                    id="newsletter_consent"
                    name="newsletter_consent"
                    className="absolute"
                    type="checkbox"
                    onChange={this.handleChange}
                    checked={this.state.fields.newsletter_consent}
                    disabled={Scrivito.isInPlaceEditingActive()}
                  />
                  <span>Ich möchte den Newsletter abonnieren.</span>
                </label>
              </div>
              <div className="form-group">
                <button
                  className="btn btn-brand m_t_20 w_100"
                  onClick={this.handleSubmit}
                >
                  Anmelden
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );

    const success = (
      <div className="EventSignUpFormWidget">
        <div className="box box_white right_box">
          <div className="content_box">
            <ul className="icon_list icon_list_one_line block m_t_20">
              <li>
                <i className="fa fa-check" aria-hidden="true"></i>
                <div className="icon_list_content">
                  <span className="bold block">Bestätigung</span>
                  <span>
                    Wir haben Ihnen eine E-Mail zur Bestätigung an Ihre
                    E-Mail-Adresse gesendet. Bitte klicken Sie auf den enthaltenen
                    Link, um Ihre E-Mail-Adresse zu bestätigen.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );

    const error = (
      <div className="EventSignUpFormWidget">
        <div className="box box_white right_box">
          <div className="content_box">
            <span className="icon_list_content">
              <span className="bold block">Es ist ein Fehler aufgetreten.</span>
            </span>
          </div>
        </div>
      </div>
    );

    switch (submissionState) {
      case "idle":
        return form;
      case "success":
        return success;
      default:
        return error;
    }
  }
}

Scrivito.provideComponent("EventSignUpFormWidget", EventSignUpFormWidget);
