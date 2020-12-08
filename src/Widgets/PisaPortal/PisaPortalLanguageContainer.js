import * as Scrivito from "scrivito";
import * as React from "react";
import "./css/PisaPortalLanguage.scss";
import psa_lib from "./lib/PisaLib.js";
import PisaLogo from './img/pisalogo.png';

const PisaPortalLanguageContainer = Scrivito.provideWidgetClass("PisaPortalLanguageContainer", {
	attributes: {
		lngList: ["widgetlist", { only: ["PisaPortalLanguageItem", "ColumnContainerWidget", "SpaceWidget"] }],
	}
});

export default PisaPortalLanguageContainer;

//----------------------------- component -------------------------------

Scrivito.provideComponent("PisaPortalLanguageContainer", ({ widget }) => (
		<div>			
			<Scrivito.ContentTag
			tag="div"
			content={widget}
			attribute="lngList" />	
		</div>				
));

//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalLanguageContainer", {
	title: "PiSA-Portal Languages",
	  attributes: {
		  lngList: {
		      title: "language list",
		    },
		  },
			properties: ["lngList"],
	thumbnail: PisaLogo,
});


