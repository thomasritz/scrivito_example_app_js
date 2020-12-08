import * as Scrivito from "scrivito";
import PisaLogo from './img/pisalogo.png';
import * as React from "react";
import psa_lib from "./lib/PisaLib.js";
import "./css/PisaButton.scss";

const PisaPortalInputField = Scrivito.provideWidgetClass("PisaButton", {
    attributes: {
        color: 			["enum", {values: ["standard", "red", "green", "blue"]}],
        alignment: 		["enum", {values: ["left", "center", "right"] }],
        width: 			["enum", {values: ["small", "standard", "medium", "large", "super"] }],
        buttonText: 	"string",
        jsCommandId:   	["enum", {values: ["save", "refresh","new"]}],
        
    },
});

export default PisaPortalInputField;

//----------------------------- component -------------------------------

Scrivito.provideComponent("PisaButton", ({widget}) => {
    return <div>
             <button className={`PisaButton--standard 
             PisaButton--${widget.get("alignment")}
             PisaButton--${widget.get("color")}
             PisaButton--${widget.get("width")}
             `}
            onClick={()=>{ 
                {
                	var obj = widget.container().get("inputFields")	//get the objects(widgets) used in the Profil Class	                                
                	if("save" == widget.get("jsCommandId")){
                		var obj_snd = [];
    	                for(var i = 0; i < obj.length; ++i){
    	                	if("yes" == obj[i].get("editable")){
    	                		obj_snd.push(obj[i]);
    	                	}
    	                }
		                psa_lib.savePisaData(obj_snd,widget.container().get("dto"),psa_lib.getUserGid()); //TODO wieder einfügenwidget.container().get("gid")
                	}else if("refresh" == widget.get("jsCommandId")){
                		var rqs_jso = psa_lib.widgetArrayToJson(obj,widget.container().get("dto"),widget.container().get("gid"),false);
                		psa_lib.calPsa("getDat", rqs_jso, function(rsp){
                			var jso_obj_arr = JSON.parse(rsp);
                    		for (var key of Object.keys(jso_obj_arr[0])) {
                    			for(var j = 0; j < obj.length;++j){
                    				if(obj[j].get("fld") == key){
                    					obj[j].update({val: jso_obj_arr[0][key]});
                    					obj[j].update({updatedFlag: "no"});
                    				}
                    			}                			
                    		}
                		});
                	}else if("new" == widget.get("jsCommandId")){
                		widget.container().update({ gid: "new" });
                		for(var i = 0; i < obj.length; ++i){
                			obj[i].update({"val": event.target.value});	
                		}
                	}
               };
    
            }}
             > {widget.get("buttonText") || "GO"} 
            </button> 
            </div>

});


//------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaButton", {
    title: "Pisa Button",
    thumbnail: PisaLogo,
    properties: ["color", "alignment", "width", "buttonText", "jsCommandId"],
    initialContent: {
        buttonText: "Speichern",
        alignment: "left",
        color: "standard",
        width: "standard",
    },
});