/*
 * DBosta.js
 * created by joaovieira.com
 * 
 * version 		: 1.308.01
 * 
 * what?		: well, a Localstorage easy handler with JSON values floating all around
 * 
 * date in		: 20130213
 * dependencies	: HTML5 compatible browsers (mostly from 2010 afterwards), with standard Javascript support
 * 
 * MIT LICENSE
 * 
 */

DBosta = {
	
	//default created collection
	vCollection	: 'aBosta',
	//default array for collection
	vArray		: {},
	//default string for collection
	vString		: "",
	//to see all those beautiful messages from console.log
	vDebug		: false,
	//interval general collections timestamp update, per example for server-side sync control
	vTSTcheck	: 3600, //1 => 1 second, 60 => 1 minute, 3600 => 1 hour, 86400 => 1 day, 604800 => 1 week, 2592000 => 1 month, 31536000 => 1 year
 	vMaxsize	: false, //still not being used
	//total collections
	total			: function() {
		return localStorage.length;
	},
	//total size collections database
	size			: function() {
		
		arrResult	= {};
		intTotal	= 0;
		for(var x in localStorage) {
			arrResult[x]	= (localStorage[x].length * 2);
			intTotal		+= arrResult[x];
		}
		arrResult['total']	= intTotal;
		
		var strBrowser			= navigator.userAgent.toLowerCase();
        if(strBrowser.indexOf("firefox") > -1) {
           arrResult['limit']	= 2500;
		}else if(strBrowser.indexOf("opera") > -1) {
           arrResult['limit']	= 5000;
		}else if(strBrowser.indexOf("msie") > -1){
           arrResult['limit']	= 5000;
		}else if(strBrowser.indexOf("safari") > -1){
           arrResult['limit']	= 2500;
		}else arrResult['limit']= 1000;
		
		return arrResult;
	},
	//timestamp function creator
	tst				: function(){
		var mDia    				= new Date();
		var ano     				= mDia.getFullYear(); 
		if ( ano < 2013 ) ano 		= 2013;
		var mes             		= mDia.getMonth();
		mes                 		= mes + 1;
		if ( mes < 10 ) mes 		= '0' + mes;
		var dia             		= mDia.getDate();
		if ( dia < 10 ) dia 		= '0' + dia;
		var hora             		= mDia.getHours();
		if ( hora < 10 ) hora 		= '0' + hora;
		var minuto             		= mDia.getMinutes();
		if ( minuto < 10 ) minuto 	= '0' + minuto;
		var segundo             	= mDia.getSeconds();
		if ( segundo < 10 ) segundo = '0' + segundo;
		return (parseInt(' ' + ano + mes + dia + hora + minuto + segundo));
	},
	//timestamp function creator
	id				: function(){
		var strId	= this.tst();
		strId		= strId + Math.floor((Math.random()*9999)+1);		
		strId		= strId.toString(36);		
		return strId;
	},
	//check browsere ability to use or not localStorage object/db
	compatibility	: function(){
		if ( typeof(Storage) !== "undefined" ){
			if ( this.vDebug ) console.log("[DBosta.MSG:001] Yes! localStorage and sessionStorage are supported, let's have some work done!");
			return true;
		}else{
			if ( this.vDebug ) console.log("[DBosta.MSG:010] Sorry! No web storage support...");
			return false;
		}
	},
	//prepare collection to be used
	collection		: function(objValue){
		var lclCollection 		= objValue;
		if ( this.compatibility ) {
			this.vArray			= {};
			this.vArray['tst']	= this.tst(); 
			if ( !localStorage[lclCollection + 'Config'] ) {   	
				localStorage[lclCollection + 'Config']	= JSON.stringify(this.vArray);
			} else {
				objConfig		= JSON.parse(localStorage[lclCollection + 'Config']);
				if ( (this.vArray['tst'] - this.vTSTcheck) > objConfig.tst ) {	
					localStorage[lclCollection + 'Config']	= JSON.stringify(this.vArray);
				}
				
			}
			if ( !localStorage[lclCollection] ) localStorage[lclCollection]	= "";
			var tmpObj			= JSON.parse(localStorage[lclCollection + 'Config']);
			tmpObj.count		= Object.keys(JSON.parse("[" + localStorage[lclCollection] + "]")).length;		
			if ( this.vDebug )  console.log("[DBosta.MSG:117] Using " + lclCollection + " collection, with " + tmpObj.count + " record(s) checked at " + tmpObj.tst + ".");
			return tmpObj;
		}else return false;	
	},
	//insert records in collection
	//all records get two automagically added fields _id and tst
	//_id: is a unique very short hash
	//tst: is a timestamp in format YYYYMMDDHHMMSS
	insert		: function(objValue){
		this.vArray						= {};
		var strData 					= localStorage[objValue.collection];
		var lastChar 					= strData.substr(1);	
		var strValue					= JSON.stringify(objValue.fields);
		var strId						= this.id();
		strValue						= strValue.substring(1);
		strValue						= '{"_id":"' + strId + '","tst":"' + this.tst() + '",' + strValue;
			
		var strResult					= "";
		if ( strData[0] === "{" ) {
			strData						= strData + ",";
			strResult					= strData.concat(strValue);
		}else strResult = strValue;	
		
		localStorage[objValue.collection]		= strResult;
		this.vArray						= JSON.parse("[" + localStorage[objValue.collection] + "]");
		
		if ( this.vDebug ) console.log("[DBosta.MSG:137]: Inserted Record " + strId);
		
		return strId;
	},
	//handles actions for inserts
	register		: function(objValue){
		
		var tmpCollection	= "";
		
		if ('collection' in objValue) {
			tmpCollection				= objValue.collection;
		}else {
			tmpCollection				= this.vCollection;
		}			
		var objTmp 			= {};
		var objResult		= {};
		if ( typeof(objValue.fields[0]) !== "undefined" ){
			
			for (var key in objValue.fields) {
				objTmp	= {"collection":objValue.collection, "fields":objValue.fields[key]};
				objResult	= this.insert(objTmp);
			}			
		}else {			
			objTmp	= {"collection":objValue.collection, "fields":objValue.fields};
			objResult	= this.insert(objTmp);
		}
		return objResult;
		
	},
	cleanstring		: function (strText){
		var rExps=[
			{re:/[\xC0-\xC6]/g, ch:'A'},
			{re:/[\xE0-\xE6]/g, ch:'a'},
			{re:/[\xC8-\xCB]/g, ch:'E'},
			{re:/[\xE8-\xEB]/g, ch:'e'},
			{re:/[\xCC-\xCF]/g, ch:'I'},
			{re:/[\xEC-\xEF]/g, ch:'i'},
			{re:/[\xD2-\xD6]/g, ch:'O'},
			{re:/[\xF2-\xF6]/g, ch:'o'},
			{re:/[\xD9-\xDC]/g, ch:'U'},
			{re:/[\xF9-\xFC]/g, ch:'u'},
			{re:/[\xD1]/g, ch:'N'},
			{re:/[\xF1]/g, ch:'n'} 
		];
		for(var i=0, len=rExps.length; i<len; i++)
		strText	= strText.replace(rExps[i].re, rExps[i].ch);
		
		return strText;
	},
	
	//search records in collection
	find			: function(objValue){
		this.vArray		= {};
		var booAnd		= false;
		var booOr		= true;
		if ('collection' in objValue) {
			this.vArray = JSON.parse("[" + localStorage[objValue.collection] + "]");			
		}else { 			
			this.vArray = JSON.parse("[" + localStorage[this.vCollection] + "]"); 
		}			
		if ( typeof(objValue.$and) !== "undefined" ){
			objValue	= objValue.$and;
			booOr		= false;
			booAnd		= true;
		}else if ( typeof(objValue.$or) !== "undefined" ){
			objValue	= objValue.$or;
			booOr		= true;
			booAnd		= false;
		}else {
			objValue	= {};
			booOr		= true;
			booAnd		= false;
		}		
		if ( Object.keys(objValue).length > 0 ) {
			var tmpArray	= [{}];
			var booFound	= false;
			
			for (var key in this.vArray) {	
				if ( typeof(this.vArray[key]._id) !== "undefined" ) {		
					for (var yey in this.vArray[key]) {	
						if ( yey in objValue ) {
							strObjValyey 	= this.cleanstring(objValue[yey]);
							strVarrkyey		= this.cleanstring(this.vArray[key][yey]);
							arrObjValyey	= strObjValyey.split("%*");
							for (var zey in arrObjValyey) {
								if ( strVarrkyey.search(arrObjValyey[zey]) > -1 && booOr ) {
									booFound = true;
									break;
								}else if ( strVarrkyey.search(arrObjValyey[zey]) > -1 && booAnd ) {
									booFound = true;
								}else if ( strVarrkyey.search(arrObjValyey[zey]) < 0 && booAnd ) {
									booFound = false;
									break;
								}
							}
						}
					}
				}	
				if ( !booFound ) {
					delete(this.vArray[key]);
				}else {
				}
				booFound	= false;
			}
		}		
		return this.vArray;
	},
	//update record in collection
	change			:	function(objValue){
		var tmpArray		= [{}];
		var tmpCollection	= '';
		if ('collection' in objValue) {
			tmpArray 		= JSON.parse("[" + localStorage[objValue.collection] + "]");		
			tmpCollection	= objValue.collection;
		}else { 			
			tmpArray 		= JSON.parse("[" + localStorage[this.vCollection] + "]"); 
			tmpCollection	= this.vCollection;
		}
		if ( typeof(objValue.$and) !== "undefined" ){
			var tmpValue	= {"collection":tmpCollection,"$and":objValue.$and};
		}else if ( typeof(objValue.$or) !== "undefined" ){
			var tmpValue	= {"collection":tmpCollection,"$or":objValue.$or};
		}	
		var objResult 		= this.find(tmpValue);		
		if ( Object.keys(objValue).length > 0 ) {
			for (var key in objResult) {		
				if ( typeof(objResult[key]._id) !== "undefined" ) {	
					for (var yey in objResult[key]) {	
						if ( yey in objValue.fields ) {	
							tmpArray[key][yey] = objValue.fields[yey];
							if ( this.vDebug ) console.log("[DBosta.MSG:210]: Updated Record _id:" + objResult[key]._id);
						}
					}
				}	
			}
			tmpArray					= JSON.stringify(tmpArray);
			localStorage[tmpCollection]	= tmpArray.substring(1, tmpArray.length-1);
		}		
	},
	//remove record in collection
	remove			: function(objValue){
		var tmpArray		= [{}];
		var tmpCollection	= '';
		if ('collection' in objValue) {
			tmpArray 		= JSON.parse("[" + localStorage[objValue.collection] + "]");		
			tmpCollection	= objValue.collection;
		}else { 			
			tmpArray 		= JSON.parse("[" + localStorage[this.vCollection] + "]"); 
			tmpCollection	= this.vCollection;
		}				
		var objResult 		= this.find(objValue);
		if ( Object.keys(objValue).length > 0 ) {
			for (var key in objResult) {		
				if ( typeof(objResult[key]._id) !== "undefined" ) {						
					delete(tmpArray[key]);
					if ( this.vDebug ) console.log("[DBosta.MSG:242]: REMOVED Record _id:" + objResult[key]._id);
				}	
			}
			var newArray = new Array();
			for(var i = 0; i < tmpArray.length; i++){
				if (tmpArray[i]){
					newArray.push(tmpArray[i]);
				}
			}			
			tmpArray						= JSON.stringify(newArray);						
			localStorage[tmpCollection]		= tmpArray.substring(1, tmpArray.length-1);
		}		
	},
	//remove collection
	clean			: function(objValue){
		this.vArray			= {};
		var tmpCollection	= "";
		if ('collection' in objValue) {
			tmpCollection	= objValue.collection;	
		}else { 			
			tmpCollection	= this.vCollection;	
		}			
		localStorage.removeItem(tmpCollection);
		localStorage.removeItem(tmpCollection + 'Config');
		if ( this.vDebug )  console.log("[DBosta.MSG:267]: REMOVED COLLECTION " + tmpCollection);
	},
	//remove all collections
	puf			: function(){
		this.vArray		= {};
		localStorage.clear();
		if ( this.vDebug )  console.log("[DBosta.MSG:300]: WIPED ALL");
	}
	
}
