import * as React from 'react';
import * as Scrivito from 'scrivito';
import psa_lib from "./lib/PisaLib.js";
import PisaLogo from './img/pisalogo.png';
import "./css/PisaPortalField.scss";


Scrivito.provideWidgetClass("PisaPortalInputField", {	attributes: {
    fld: "string", 
    titEng: "string",
    titGer: "string",
    editable: ["enum", { values: ["yes", "no"] }],
    val: "string",
    updatedFlag: ["enum", { values: ["yes", "no"] }]
  },
});

//----------------------------- component -------------------------------

class PisaPortalInputField extends React.Component {
	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange(event) {
		this.props.widget.update({"val": event.target.value});	
		this.props.widget.update({"updatedFlag": "yes"});	
	}

	render() {		
		const widget = this.props.widget;
		var returnWidget = [];
		var tit = widget.get("tit" + psa_lib.getLng());
		returnWidget.push(
				<label className="PisaPortalField--label">{tit}</label>
		);
		if (widget.get("editable") === "yes"){
			returnWidget.push(
					<input className="PisaPortalField--label" 
						type="text"
						value={widget.get("val")}
						onChange={this.handleChange}
						placeholder={widget.get("tit" + psa_lib.getLng())} />);
		}
		else {
			returnWidget.push(<span className="PisaPortalField--txtFld PisaPortalField--label">{widget.get("val")}</span>);
		}
		return <div className="PisaPortalField">{returnWidget}</div>;    
	}
}

Scrivito.provideComponent('PisaPortalInputField', PisaPortalInputField);

//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalInputField", {
	  title: "PiSA-Portal Eingabefeld",
	  thumbnail: PisaLogo,
	  properties: ["fld","titEng","titGer","editable"],
	  initialContent: {
		editable: "no",
        updatedFlag: "no",
	  },
	});
