class PsaLib{ 
	lng = "Eng";
	sto = window.localStorage;
			
	/***********************************************************/	
	/**                     User Information                   */
	/***********************************************************/	
	/**
	 * returns the user ident of the currently logged in user
	 * 
	 * @return User ident of current user
	 */
	getUsrIdn(){
		var ret = ""; // this.sto.getItem("usr_idn");
		if (ret==null){			
			//TODO: get user id on login; also set in store 
			ret = "tschammer@pisasales.de";		
		}
		return ret;
	}

	/**
	 * returns the user password of the currently logged in user
	 * 
	 * @return User password of current user
	 */
	getUsrPwd(){
		var ret = "secret";		
		return ret;
	}

		/**
	 * returns the user token of the currently logged in user
	 * 
	 * @return User token of current user from oAuth
	 */
	getUsrTok(){
		var ret = this.sto.getItem("tok");
		if (ret==null){
			ret = '{ \
				"sub": "b3f979b5-56bf-472c-b9f5-1cca75ffeea9",\
				"event_id": "3afa9a99-0efd-4bdd-9f74-9850956c633f",\
				"token_use": "access",\
				"scope": "openid",\
				"auth_time": 1607093724,\
				"iss": "https://cognito-idp.eu-west-1.amazonaws.com/eu-west-1_3sEwkHG3Y",\
				"exp": 1608277818,\
				"iat": 1607093724,\
				"version": 2,\
				"jti": "3b58b765-e857-4629-984f-36a63179d066",\
				"aud": "1u0a92hr8k7um41lpueh87nn65",\
				"username": "b3f979b5-56bf-472c-b9f5-1cca75ffeea9",\
				"email": "thomas.ritz@infopark.de",\
				"alg": "RS256",\
				"kid": "YNTGgawhVC6fpGsjXxk9BkVRpIinWrRkgxvC9m6ZzmY="\
				}';
			this.sto.setItem("tok",ret);
		}
		return ret;
	}
	
	setIdToken(tok){
		this.sto.setItem("tok",tok);
	}

	/**
	 * returns the preferred language of the currently logged in user
	 * 
	 * @return user language
	 */
	getLng(){
		var ret = this.sto.getItem("lng");
		if (ret==null){
			ret = "Eng";
			this.sto.setItem("lng",ret);
		}
		return ret;
	}
	
	/**
	 * Sets the user language
	 */
	setLng(lng){
		var prv = this.getLng();		
		this.sto.setItem("lng",lng);
		if (prv!=lng){
			location.reload(); 
		}
	}

	/***********************************************************/
	/**                 Server Communication                   */
	/***********************************************************/

	getEndpoint(){
//		return "http://nb-jet-18:8888/psawsc/psaprt/";
		return "https://dtv.pisasales.de/psaprtl/psaprt/";
	}
		
	/**
	 * saves the data from the website to PiSA
	 * @param wdg_arr an array of widgets with attributes
	 * @param dto_nam the DTO in PiSA where the data should be saved
	 * @param gid the GID of the record where the data will be saved
	 * @return boolean true if data was saved
	 */
	savePisaData(wdg_arr,dto_nam,gid){
		var jso_str = this.widgetArrayToJson(wdg_arr,dto_nam,gid);
		this.calPsa("putDat", jso_str, function(rsp){	//success with test of contacts?search=1234585641
			if("true" == rsp){
				alert("gespeichert");
			}else{
				alert("Fehler beim Speichern: " + rsp);
			}
		});
	}

	
	/**
	 * turns a widget array of PisaPortalInputFields into a stringified JSON
	 * @param wgt_arr widget array of PisaPortalInputFields
	 * @param dto_nam name of dto
	 * @param gid name of gid - empty for new entry
	 * @param inc_val include values from widgets
	 * @param fld_atr widget's attribute to get the field name
	 * @param val_atr widget's attribute to get the field's value
	 */
	widgetArrayToJson(wdg_arr,dto_nam,gid,inc_val = true,fld_atr = "fld",val_atr = "val"){
		var fld_arr = [];
		for(var i = 0; i < wdg_arr.length; ++i){
			var fld_obj =  {
					fld: wdg_arr[i].get(fld_atr),
					val: inc_val ? wdg_arr[i].get(val_atr) : ""
				};
			fld_arr.push(fld_obj);
		}
		var obj = {
					head:
					{
						usr_idn: this.getUsrIdn(),
						usr_tok: this.getUsrTok(),
						usr_pwd: this.getUsrPwd(),
						usr_ip: "127.0.0.1"
					},
					body:
					{
						dto: dto_nam,
						gid: gid,
						fld_arr: fld_arr
					}
				};
		 return JSON.stringify(obj);
	}

	/**
	 * Makes a call to the PiSA server
	 * 
	 * @param endPoint
	 *            defines the Endpoint to which the request is posted
	 * @param json
	 *            the json to be transmitted
	 * @param callback
	 *            the function which should use the response of the request
	 */
	calPsa(endPoint, json, callback){	
		var xhttp = new XMLHttpRequest();
		var url = this.getEndpoint() + endPoint;
		xhttp.open("POST", url , true);		
		xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');	
		xhttp.withCredentials = false; //TODO change to true when the proxy is set with credentials
		xhttp.onreadystatechange = function () {
			if(xhttp.readyState == 4 && xhttp.status == 200){
				if(callback != null){
					var rsp = xhttp.responseText;
					if ( endPoint==="getDat" ) {
						var rspObj = JSON.parse(rsp).body.fld_arr;
						var rspFld = JSON.stringify(rspObj);
						callback(rspFld);
					} else {
						callback(rsp);
					}
				}
			}			
		}
		xhttp.send(json);	
	}
	
		
	/***********************************************************/
	/**                communication by widget                 */
	/***********************************************************/
	
	/**
	 * returns the chat log
	 * @param projGid project GID in PiSA of the Chat
	 * @return the JSON data from PiSASales
	 * TODO which form? just all the HTML?
	 */
	getChat(projGid){
		// TODO Anfrage an pisa schicken, JSON zur�ckbekommen
		var psa_ans ;
//		return Json.parse(psa_ans)
		return {__html: '<div>User: Hallo!</div><div>User2: <script>alert("I try to alert you")</script> :) </div>'}
	}
	
	sendChat(projGid, chatMessage){
		// TODO Anfrage an pisa schicken
		alert("message send : " + chatMessage);
		
	}

	/**
	 * returns a PiSA BLOB as base 64
	 * @param dto_nam name of the DTO
	 * @param gid GID of the data in PiSA
	 * @return the file in base 64
	 */
	getPisaBlob(dto_nam, gid){
		// TODO Anfrage als JSON erstellen
		// TODO Anfrage an pisa schicken, Base 64 zurückbekommen
		var psa_ans = 	"data:image/png;base64,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";
		return psa_ans;	
	}
	/**
	 * get A Filename from Pisa for a Given DTO an GID 
	 * @param dto_nam name of the DTO
	 * @param gid GID of the data in PiSA
	 * @return filename as string
	 */
	getFilNam(dto_nam, gid){
		// get A Filename from Pisa for a Given DTO an GID
		return;
	}
}

const psa_lib = new PsaLib();

export default psa_lib;




