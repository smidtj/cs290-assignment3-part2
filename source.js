

var arrayTemp = [];
count = 0
var httpRequest;
var gistArray = [];
gistArray[0] = [];
gistArray[1] = [];
gistArray[2] = [];
gistArray[3] = [];
gistArray[4] = [];
var keyCount = 0;

function makeRequest() {
	for (var i = 1; i < 6; i++){
	if (window.XMLHttpRequest) { // Mozilla, Safari, ...
		httpRequest = new XMLHttpRequest();	
	} else if (window.ActiveXObject) { // IE
		try {
			httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} 
		catch (e) {
			try {
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} 
		catch (e) {}
		}
	}
	if (!httpRequest) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
		var url1 = 'http://api.github.com/gists?page=' + i
		httpRequest.onreadystatechange = getContents;
		httpRequest.open('GET', url1);
		httpRequest.send();
	}
}

function getContents() {
	if (this.readyState === 4) {
		if (this.status === 200) {
			arrayTemp[count] = JSON.parse(this.responseText)
			count++;
		} else {	
			alert('There was a problem with the request.');
		}		
	}
}

function Gist(language, description, url){
	this.language = language
	this.description = description
	this.url = url
} 


function printGist(Gist){
	var output = document.getElementById('output')
	var myli = document.createElement('a')
	var text = document.createTextNode("Description: " + Gist.description + "<------>" + "Language: " + Gist.language)
	myli.setAttribute('href', Gist.url)
	myli.appendChild(text)
	output.appendChild(myli)
	var favButton = document.createElement("input")
	favButton.setAttribute("type", "button")
	favButton.setAttribute("value", "Favorite")
	favButton.onclick = function() {store(Gist.description, Gist.language, Gist.url); };
	output.appendChild(favButton)
	var mybr = document.createElement('br')
	output.appendChild(mybr)
}

function getGists(){
	var numPage = document.getElementById('numPages').value;
	if (numPage > 5){
		numPage = 5;
	}
	for(var j = 0; j < numPage; j++){
		for (var k = 0; k < 30; k++){
			var desc = arrayTemp[j][k].description
			var file = arrayTemp[j][k].files
			var tempString = JSON.stringify(file)
			if (desc === ""){
	 			desc = "NO DESCRIPTION"
			}
	 		tempString = tempString.split('"language"')
			tempString = tempString[1].split('"')
			var language = tempString[1]
			temp_url = JSON.stringify(file)
			temp_url = temp_url.split('"raw_url"')
			temp_url = temp_url[1].split('"')
			var url = temp_url[1]
			gistArray[j].push(new Gist(language, desc, url))
			var python = document.getElementsByName('language')[0].checked
			var json = document.getElementsByName('language')[1].checked
			var javascript = document.getElementsByName('language')[2].checked
			var sql = document.getElementsByName('language')[3].checked
			if(!python && !json && !javascript && !sql){
				printGist(gistArray[j][k]);	
			} else if ((python && gistArray[j][k].language == "Python") || (json && gistArray[j][k].language == "JSON") || (javascript && gistArray[j][k].language == "JavaScript") || (sql && gistArray[j][k].language == "SQL")){
				printGist(gistArray[j][k]);
			}
		}
	}
	var output = document.getElementById('output')
	var mybr = document.createElement('br')
	output.appendChild(mybr)	
	return false;
}


window.onload = function(){
	makeRequest();
	var i = 0
	while (localStorage.getItem("key " + i + 0) || localStorage.getItem("key " + (i + 1) + 0) || localStorage.getItem("key " + (i + 2) + 0) || localStorage.getItem("key " + (i + 3) + 0)){
		if (localStorage.getItem("key " + i + 0) !== null){
			printLocal(i)
		}
		i++;
	}
}

addFavorite = function(){
	localStorage.setItem()
}

clearLocal = function(){
	localStorage.clear();
}

printLocal = function(val){
	var favOut = document.getElementById('favorites')
	var myli = document.createElement('a')
	var desc = localStorage.getItem("key " + val + 0)
	var lang = localStorage.getItem("key " + val + 1)
	var url = localStorage.getItem("key " + val + 2)
	var text = document.createTextNode("Description: " + desc + "<------>" + "Language: " + lang)
	myli.setAttribute('href', url)
	myli.setAttribute("id", "key " + val)
	myli.appendChild(text)
	var favButton = document.createElement("input")
	favButton.setAttribute("id", "button_key " + val)
	favButton.setAttribute("type", "button")
	favButton.setAttribute("value", "unFavorite")
	favButton.onclick = function() {unStore(desc, lang, url); };
	favOut.appendChild(favButton)
	favOut.appendChild(myli)
	var mybr = document.createElement('br')
	favOut.appendChild(mybr)
}
store = function (desc, lang, url){
	while (localStorage.getItem("key " + keyCount + 0)){
		keyCount++
	}
	localStorage.setItem("key " + keyCount + 0, desc)
	localStorage.setItem("key " + keyCount + 1, lang)
	localStorage.setItem("key " + keyCount + 2, url)
	printLocal(keyCount);
}

unStore = function(desc, lang, url){
	var i = 0
	while (localStorage.getItem("key " + i + 0) || localStorage.getItem("key " + (i + 1) + 0) || localStorage.getItem("key " + (i + 2) + 0) || localStorage.getItem("key " + (i + 3) + 0)){
		if ((localStorage.getItem("key " + i + 0) == desc) && (localStorage.getItem("key " + i + 1) == lang) && (localStorage.getItem("key " + i + 2) == url)){
			var remove = document.getElementById("key " + i);
			remove.parentNode.removeChild(remove);
			remove = document.getElementById("button_key " + i);
			remove.parentNode.removeChild(remove);
			localStorage.removeItem("key " + i + 0);
			localStorage.removeItem("key " + i + 1);
			localStorage.removeItem("key " + i + 2);
		}
		i++;
	}
}