import * as React from 'react';
import * as Scrivito from 'scrivito';
import PisaLogo from './img/pisalogo.png';
import psa_lib from "./lib/PisaLib.js";
import "./css/PisaPortalFAQ.scss";
import "./css/PisaButton.scss";


Scrivito.provideWidgetClass('PisaPortalFAQ', {
	attributes: {
		placeholderGer:"string",
		placeholderEng:"string",
		buttonTxtGer:"string",
		buttonTxtEng:"string"
	},
});



//----------------------------- component -------------------------------

class PisaPortalFAQ extends React.Component {
	constructor() {
		super();
		this.state = { 
			faqContent : ""				
		};
	}

	load(event){
		if(typeof event.keyCode == 'undefined' || event.keyCode == 13){
			var tis = this;
			var searchVal = event.target.parentNode.getElementsByClassName("PisaFaqSearch")[0].value;
			psa_lib.calPsa("getDat", '{"dto":"PSA_FAQ","usr_gid":"'+psa_lib.getUserGid()+'","fld_arr":[{"fld":"QUE","val":""},{"fld":"ANS","val":""}],"que_arr":[{"fld":"QUE","que":"%'+searchVal+'%"}]}', function(rsp){
				var rslObj = JSON.parse(rsp);
				var faqElmArr = [];
				for(var i = 0; i < rslObj.length; ++i){
					var el = <div className='PisaFaq'>
								<div className='PisaFaqQuestion' onClick={tis.toggleVisible.bind(tis)}>{rslObj[i].QUE}</div>
								<div className='PisaFaqAnswer'>{rslObj[i].ANS}</div>
							</div>;
					faqElmArr.push(el);
				}
				tis.setState({faqContent:faqElmArr});
			});
		}		
	}
	
	toggleVisible(event){
		var div = event.target.parentNode.getElementsByClassName('PisaFaqAnswer')[0];
		if(div.style.height == ""){
			div.style.height = "auto";
		}else{
			div.style.height = "";
		}
	}
	
	render () {
		const widget = this.props.widget;
		return <div>
					<input className="PisaFaqSearch" onKeyDown={this.load.bind(this)} type="text" placeholder={widget.get("placeholder" + psa_lib.getLng())} /> 
					<button className="PisaButton--standard PisaButton--FAQ" onClick={this.load.bind(this)}>{widget.get("buttonTxt" + psa_lib.getLng())}</button>
					{this.state.faqContent}
				</div>;  
	}

}	
Scrivito.provideComponent('PisaPortalFAQ', PisaPortalFAQ);


//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig('PisaPortalFAQ', {
	title: 'Pisa Portal FAQ',
	thumbnail: PisaLogo,
	description: 'A frequently asked question plugin for PiSA-Sales.',
	properties: ["placeholderGer", "placeholderEng","buttonTxtGer","buttonTxtEng"],
	initialContent: {
		placeholderGer: "Bitte geben Sie eine Frage ein",
		placeholderEng: "Please enter a question",
		buttonTxtGer: "Suchen",
		buttonTxtEng: "Search"
	},
});