import * as Scrivito from "scrivito";
import * as React from "react";
import "./css/PisaPortalForm.scss";
import psa_lib from "./lib/PisaLib.js";
import PisaLogo from './img/pisalogo.png';

//
const PisaPortalFormProfil = Scrivito.provideWidgetClass("PisaPortalFormProfil", {
	attributes: {
		inputFields: ["widgetlist",{ only: ["PisaPortalInputField", "PisaButton", "DividerWidget", "ColumnContainerWidget", "SpaceWidget"]}],
		headlineGer: "string",
		headlineEng: "string",
		dto: "string",
		gid: "string"
	}
});

export default PisaPortalFormProfil;

//----------------------------- component -------------------------------


Scrivito.provideComponent("PisaPortalFormProfil", ({ widget }) => {
		return <div className="PisaPortalForm">
			<label className="PisaPortalForm--header">{widget.get("headline" + psa_lib.getLng())}</label>
			<Scrivito.ContentTag
			tag="div"
			content={widget}
			attribute="inputFields"			
			onLoad={() => {widget.update({ gid: psa_lib.getUserGid() })}}	
				/>	
		</div>		
		
});

//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalFormProfil", {
	title: "PiSA-Portal Formular / Profil",
	properties: ["inputFields", "headlineGer","headlineEng","dto"],
	thumbnail: PisaLogo,
	initialContent: {headline:"PiSA Profilbereich",}
});


/**/