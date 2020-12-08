import * as React from 'react';
import * as Scrivito from 'scrivito';
import psa_lib from "./lib/PisaLib.js";
import PisaLogo from './img/pisalogo.png';
import "./css/PisaPortalTable.scss";

Scrivito.provideWidgetClass("PisaPortalTable", {	
	attributes: {	
		titEng: "string",
		titGer: "string",
		dto: "string",  
		psaData: ["widgetlist",{ only: ["PisaData"]}],
		sortBy:"string",
		sortColumn:"string"
	}
});

// ----------------------------- component -------------------------------

class PisaPortalTable extends React.Component {
	constructor() {
		super();
		this.state = {
			table:"",
			sortBy:"",
			sortColumn:"",


		};
		this.load = this.load.bind(this);
	}

	search(event, timeout = 25){
		var input = event.target;
		var table = input.parentNode;
		while(table.tagName.toUpperCase() != "TABLE"){
			table = table.parentNode;
		}
		setTimeout(function(){
			var searchInputs = table.getElementsByClassName("PisaTableSearch");
			var searchValues = [];
			for(var i = 0; i < searchInputs.length; ++i){
				searchValues.push(searchInputs[i].value.toLowerCase());
			}
			var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
			for(var i = 0; i < rows.length; ++i){
				var cols = rows[i].getElementsByTagName("td");
				var visible = true;
				for(var j = 0; j < cols.length && j < searchValues.length; ++j){
					if(searchValues[j] != ""){
						var fieldVal = cols[j].innerHTML.toLowerCase();
						if(fieldVal.indexOf(searchValues[j]) === -1){
							visible = false;
							break;
						}
					}
				}
				rows[i].style.display = visible ? "" : "none";
			}
		},timeout);
			
	}
	
	
	sortTbl(event){
		var sortBy = this.state.sortBy;
		var sortColumn = this.state.sortColumn;
		var tar = event.target;
		var selColumn = tar.id;
		if (sortColumn == selColumn){
			if (sortBy == "dsc"){
				tar.innerHTML = tar.innerHTML.replace("↑","↓");
				this.setState({sortBy: "asc"});
			}
			else if (sortBy == "asc"){
				tar.innerHTML = tar.innerHTML.replace("↓","↑");
				this.setState({sortBy: "dsc"});
				
			}
			else{
				tar.innerHTML = tar.innerText + "↓";
				this.setState({sortBy: "asc"});
			}
		}
		else{
			var headers = tar.parentNode.getElementsByClassName("PisaTableHeader");
			for(var i = 0; i < headers.length; i++){
				headers[i].innerHTML = headers[i].innerHTML.replace("↓","").replace("↑","");
				if(headers[i] == tar){
					tar.innerHTML = tar.innerHTML + "↓";
					this.setState({sortBy: "asc"});
				}
			}
		}
		
		var table = this.state.table;
	
		table.sort(function (a, b){
			var valA = a.props.children[selColumn].props.children;
			var valB = b.props.children[selColumn].props.children;
			return valA.localeCompare(valB);
		});
		
		if (sortBy == "asc"){
			table.reverse();
		}	
		
		this.setState({sortColumn: selColumn});//, table:sortedTable
		this.search(event,0);
	}
	
	componentDidMount(){
		const widget = this.props.widget;
		this.load(widget);
	}
	
	load(widget){
		const reactComponent = this;
		var lng = psa_lib.getLng();
		var wgdArr = widget.get("psaData");
		var fldPosArr = [];
		for(var i = 0; i < wgdArr.length; ++i){
			fldPosArr.push(wgdArr[i].get("fldNam" + lng));
		}		
		var jso_str = psa_lib.widgetArrayToJson(wgdArr,widget.get("dto"),"",false,"fldNam" + lng);
		psa_lib.calPsa("getDat", jso_str, function(rsp){			
			var rspObj = JSON.parse(rsp);
			var reactElmArr = [];
			for(var i = 0; i < rspObj.length; ++i){
				var rowReactColElm = [];
				for(var j = 0; j < fldPosArr.length; ++j){
					for (var key of Object.keys(rspObj[i])) {
						if(key == fldPosArr[j]){
							rowReactColElm.push(<td>{rspObj[i][key]}</td>);
						}
					}
				}
				reactElmArr.push(<tr>{rowReactColElm}</tr>);
			}
			reactComponent.setState({table:reactElmArr});
		});
	}

	render() {
		const widget = this.props.widget;
		var lng = psa_lib.getLng();
		var fldObjArr = widget.get("psaData");
		var headerColumns = [];
		var searchColumns = [];
		for(var i = 0; i < fldObjArr.length; ++i){			
			headerColumns.push(<th className="PisaTableHeader" id={i} onClick={ this.sortTbl.bind(this)}>{fldObjArr[i].get("fldDsc" + lng)}</th>);
			searchColumns.push(<th><input type="text" className="PisaTableSearch" onKeyDown={this.search.bind(this)} /></th>);
		}
		return <div className="PisaPortalTable">
					<h1>{widget.get("tit" + lng)}</h1>
					<table>
						<thead>
							<tr>
								{headerColumns}
							</tr>
							<tr>
								{searchColumns}
							</tr>
						</thead>
						<tbody>{this.state.table}</tbody>
					</table>
				</div>;
	}
	
}

Scrivito.provideComponent('PisaPortalTable', PisaPortalTable);

// ------------------------------ config ---------------------------------

Scrivito.provideEditingConfig("PisaPortalTable", {
	  title: "PiSA-Portal Tabelle",
	  properties: ["psaData","titEng","titGer","dto","val"],	
	  thumbnail: PisaLogo,
	  attributes: {		  
		    TitGer: {
		    	title: 'Tabellen Überschrift',
		    },
		    TitEng: {
		    	title: 'Table Heading',
		    },
		  },
	  initialContent: {
		  titEng: "Table",
		  titGer: "Tabelle"
	  },
	});
