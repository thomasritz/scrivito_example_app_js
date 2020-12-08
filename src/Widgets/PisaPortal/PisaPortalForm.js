import * as Scrivito from "scrivito";
import * as React from "react";
import "./css/PisaPortalForm.scss";
import PisaLogo from './img/pisalogo.png';


const PisaPortalForm = Scrivito.provideWidgetClass("PisaPortalForm", {
	attributes: {
		inputFields: ["widgetlist",{ only: ["PisaPortalInputField", "PisaButton", "DividerWidget", "ColumnContainerWidget", "SpaceWidget"]}],
		headline: "string",
		dto: "string",
		gid: "string"
	},		
});

export default PisaPortalForm;

//----------------------------- component -------------------------------


Scrivito.provideComponent("PisaPortalForm", ({ widget }) => (
		<div className="PisaPortalForm">
			<label className="PisaPortalForm--header">{widget.get("headline")}</label>
			<Scrivito.ContentTag
			tag="div"
			content={widget}
			attribute="inputFields" />	
		</div>		
		
));

//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalForm", {
	title: "PiSA-Portal Formular",
	thumbnail: PisaLogo,
	properties: ["inputFields", "headline","dto"],
	initialContent: {headline:"PiSA Formular",}
});


