import * as Scrivito from "scrivito";
import * as React from "react";
import "./css/PisaPortalLanguage.scss";
import psa_lib from "./lib/PisaLib.js";
import PisaLogo from './img/pisalogo.png';

Scrivito.provideWidgetClass("PisaPortalLanguageItem", {
	attributes: {
		lng: ["enum", {values: ["Ger", "Eng"] }],
		shape: ["enum", {values: ["square", "normal"] }],
		image: ["enum", {values: ["image", "text"] }],

	}
});

//----------------------------- component -------------------------------


class PisaPortalLanguageItem extends React.Component {
	constructor() {
		super();
	}

	setLng(){
		const widget = this.props.widget;
		var lng = widget.get("lng");
		psa_lib.setLng(lng);
	}
	
	render() {
		const widget = this.props.widget;
		// get the right country to the language for shown flag
		var countryFlag ;
		if(widget.get("lng")=="Ger"){
			countryFlag = "germany";
		}
		else if(widget.get("lng")=="Eng"){
			countryFlag = "united-kingdom";
		}
		//get the shape to know if square or long img
		var shape ="";
		if(widget.get("shape")=="square"){
			shape = "-square";
		}
		var srcStr="Flags/" + countryFlag + "-flag" + shape + "-icon-256.png";
		return <img src={srcStr} id="image" onClick={ this.setLng.bind(this)}/>
	}
}

Scrivito.provideComponent("PisaPortalLanguageItem", PisaPortalLanguageItem);

//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalLanguageItem", {
	title: "PiSA-Portal Language Item",
	properties: ["lng", "shape", "images"],
	thumbnail: PisaLogo,
	initialContent: {lng:"Ger", shape:"normal", image:"image" }
});


