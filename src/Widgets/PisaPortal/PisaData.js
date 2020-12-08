import * as React from 'react';
import * as Scrivito from 'scrivito';
import PisaLogo from './img/pisalogo.png';

const PisaData = Scrivito.provideWidgetClass("PisaData", {
	attributes: {
		fldNamGer: "string",  
		fldNamEng: "string",
		fldDscGer: "string",
		fldDscEng: "string"
	}
});

export default PisaData;

//------------------------------ component ---------------------------------
//
//Scrivito.provideComponent("PisaData", ({ widget }) => {
//	  return <div/>;
//	});



// ------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaData", {
	  title: "PiSA-Data Field",
	  properties: ["fldNamGer", "fldDscGer", "fldNamEng", "fldDscEng"],	
	  thumbnail: PisaLogo,
	  attributes: {
		  fldNamGer: {
				title: 'Feldname - Deutsch',
			    description: '',
		      	},
		 fldDscGer: {
		    	title: 'Überschrift - Deutsch',
		    	description: '',
		    	},
		  fldNamEng: {
				title: 'Feldname - Englisch',
			    description: '',
		      	},
		 fldDscEng: {
		    	title: 'Überschrift - Englisch',
		    	description: '',
		    	}
		  },
	  initialContent: {
		  fldNamGer: "FRN_IDN",
		  fldDscGer: "Name"
	  },
	});
