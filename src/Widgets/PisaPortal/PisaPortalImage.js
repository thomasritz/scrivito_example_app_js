import * as Scrivito from "scrivito";
import PisaLogo from './img/pisalogo.png';
import * as React from "react";
import psa_lib from "./lib/PisaLib.js";
import "./css/PisaPortalImage.scss";
import "./css/PisaButton.scss";

Scrivito.provideWidgetClass("PisaPortalImage", {
    attributes: {
        dataType: 		["enum", {values: ["image", "...", "...", "..."]}],
        scaling: 		["enum", {values: ["small", "normal", "large"] }],
        dto: 			"string",
        gid: 			"string",
        fileBase:		"string",
        fileName:		"string",

    },
});

//export default PisaPortalImage;

//----------------------------- component -------------------------------

class PisaPortalImage extends React.Component {
	constructor() {
		super();
		this.state = {
			fileBase : "",	//base64 String of file
			fileName: ""
		};
	}
	
	
	load(event){
		//TODO insert param to search for file
		
		var file = psa_lib.getPisaBlob("", "");
		this.setState({fileBase: file});
		
		//TODO File Name logic
		var filNam = psa_lib.getFilNam();
		this.setState({fileName: filNam})
	}
	
	render (){
		const widget = this.props.widget;
	    return <div>
	    <label className="img" onClick={this.load.bind(this)}>{widget.get("fileName")}</label>
	    <img src={this.state.fileBase}></img>
	           </div>
	}
}	


Scrivito.provideComponent("PisaPortalImage", PisaPortalImage);




//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalImage", {
    title: "Pisa Image",
    thumbnail: PisaLogo,
    properties: ["dataType", "scaling", "dto", "gid","fileName"],
    initialContent: {
    	dataType: "image",
    	scaling: "normal",
    	fileName: "File",
    },
});