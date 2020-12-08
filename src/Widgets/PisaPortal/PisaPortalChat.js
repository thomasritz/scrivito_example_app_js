import * as Scrivito from "scrivito";
import * as React from "react";
import "./css/PisaPortalChat.scss";
import psa_lib from "./lib/PisaLib.js";
import PisaLogo from './img/pisalogo.png';

Scrivito.provideWidgetClass("PisaPortalChat", {
	attributes: {
		content: "string",
		input: "string",	
		projgid: "string",	//projekt GID Zuordnung für PiSA
		headline:"string",
		txtFont: ["enum", {values: ["small", "normal", "big", "superBig"] }],
		mode: ["enum", {values: ["dark", "normal", "colorful"] }],
		
	}
});

//----------------------------- component -------------------------------


class PisaPortalChat extends React.Component {
	constructor() {
		super();
		this.state = {
			chatContent:"",
		};
		this.load = this.load.bind(this);
	}
	
	send(chat){
		//if the send button is clicked
		if (chat.type == "click"){
			chat = 123; //TODO value of Textarea
		}
		psa_lib.sendChat("someProjGID", chat);
		load();
	}
	
	sendOnEnter(event){
		if(event.keyCode == 13){
			var chat = event.target.value;
			event.target.value = "";
			this.send(chat);
			event.target.value = "";
		}
		
	}
	
	componentDidMount(){
		const widget = this.props.widget;
		this.load(widget);
	}
	
	load(event){
		// TODO: Ajax-loading
		setTimeout(function(){
			this.setState({chatContent: psa_lib.getChat()});
		},50);
	}

	render() {
		const widget = this.props.widget;
		var lng = psa_lib.getLng();
		var chatContent = psa_lib.getChat();
		return  <body>
		<h1>{widget.get("headline")}</h1>
		<div className={`chat--normal chat--${widget.get("mode")} chat--${widget.get("txtFont")}`}>
					
					<div dangerouslySetInnerHTML={psa_lib.getChat()}></div>
					<div><textarea className='boxsizingBorder' id='chat' onKeyUp={this.sendOnEnter.bind(this)}></textarea></div>
					<button onClick={this.send.bind(this)}>Send</button>
				</div>
				</body>

	}
	
}

Scrivito.provideComponent("PisaPortalChat", PisaPortalChat);

//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalChat", {
	title: "PiSA-Portal Chat",
	properties: ["projgid", "headline", "mode", "txtFont", "titEng", "titGer"],
	thumbnail: PisaLogo,
	initialContent: {headline:"Chat", mode:"normal", txtFont:"normal"}
});


