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
          confirmation_link_url: `${window.location.protocol}//${window.location.host}/confirm`,
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
        <h2>Anfrage</h2>
        <form name="demo">
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
            <label htmlFor="company" className="sr-only">
              Firma
            </label>
            <input
              type="text"
              className="form-control"
              id="company"
              name="company"
              value={this.state.company}
              onChange={this.handleChange}
              placeholder="Firma"
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
              <span>&nbsp;&nbsp;Ich habe die Datenschutzerklärung zur Kenntnis genommen. Ich stimme einer elektronischen Speicherung und Verarbeitung meiner eingegebenen Daten zur Beantwortung meiner Anfrage zu. Die Einwilligung kann jederzeit für die Zukunft per E-Mail an datenschutz@MENNEKES.de widerrufen werden.*</span>
            </label>
          </div>
          <p>
            Unsere Datenschutzerklärung finden Sie <a href="https://example.com">hier</a>.
          </p>
          <div className="form-group">
            <button
              className="btn btn-brand m_t_20 w_100"
              onClick={this.handleSubmit}
            >
              Anmelden
            </button>
          </div>
        </form>
      </div>
    );

    const success = (
      <div className="EventSignUpFormWidget">
        <div className="box box_white right_box">
          <div className="content_box">
            <div className="icon_list_content">
              <span className="bold block">Bestätigung</span>
              <span>
                Wir haben Ihnen eine E-Mail zur Bestätigung an Ihre
                E-Mail-Adresse gesendet. Bitte klicken Sie auf den enthaltenen
                Link, um Ihre E-Mail-Adresse zu bestätigen.
              </span>
            </div>
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
