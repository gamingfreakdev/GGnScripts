// ==UserScript==
// @name        GOG Uploady
// @namespace   gamingfreak, Gruselgurke
// @include     https://gazellegames.net/upload.php
// @include     http://gazellegames.net/upload.php
// @version     0.11
// @grant	GM_xmlhttpRequest
// ==/UserScript==

var addElementTo = document.getElementById('uploady').parentNode;
addElementTo.innerHTML += " <input id='goguploady' type='button' value='GOG Uploady'/>";

var elmLink = document.getElementById('goguploady');
elmLink.addEventListener("click", searchGOG, true);

function helloWorld(event)
{
	var elem = event.currentTarget;
	event.preventDefault();	
	GM_xmlhttpRequest({
		method: "GET",
		url: elem.href,
		onload: function(r) {
			var doc1 = document.createElement('div');
			doc1.innerHTML = r.responseText;

			// Process the game title
			meta = doc1.getElementsByTagName('meta');
			for (var i = 0; i < meta.length; i++) {
				if (meta[i].getAttribute('property') == "og:title") {
					document.getElementById('title').value = meta[i].getAttribute('content');
				}
			}
			// Process the year it was made
			var year = doc1.getElementsByClassName('details')[0].getElementsByTagName('li')[3].innerHTML.toString().split(', ')[1];
			document.getElementById('year').value = year;

			// Process the description of the game
			var description = doc1.getElementsByClassName('content_in')[0].getElementsByTagName('p')[1].innerHTML.toString().replace(/^\s*/, "").replace(/\s*$/, "").replace(/<br><br>/g, "");
			description = description.replace(/<.*?>/g, "");
			document.getElementById('album_desc').value = description;

			// Process the System Requirements
			var requirements = doc1.getElementsByClassName('requirements')[0].innerHTML;
			requirements = requirements.toString().replace(/<style>\s.*\s*.*\s*.*\s*<\/style>/, "");
			requirements = requirements.replace(/^\s*/, "").replace(/\s*$/, "");
			requirements = requirements.replace(/<b>/g, "[b]").replace(/<\/b>/g, "[/b]");
			requirements = requirements.replace(/,/g, "\n");
			document.getElementById('album_desc').value += "\n[quote][b]System Requirements:[/b]\n" + requirements + "[/quote]";

			// Process the pegi and esrb age rating (if it's there)
			var i = 0;
			while (i < doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p').length) {
				var agerating = doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p')[i].className.toString().split(' ')[0];
				if (agerating == "pegi") {
					 agerating = doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p')[i].className.toString().split(' ')[1];
					 i = doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p').length;
				}
				i++;
			}
			console.log(agerating);
			if (agerating != "a3" && agerating != "a7" && agerating != "a12" && agerating != "a16" && agerating != "a18"){
			i = 0;
				while (i < doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p').length) {
					agerating = doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p')[i].className.toString().split(' ')[0];
					if (agerating == "esrb"){
						agerating = doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p')[i].className.toString().split(' ')[1];
						i = doc1.getElementsByClassName('footnotes')[0].getElementsByTagName('p').length;
					}
					i++;
				}
			}
			console.log(agerating);
			switch (agerating)
			{
				case "a3":
					agerating = "1";
					break;
				case "a7":
					agerating = "3";
					break;
				case "a12":
					agerating = "5";
					break;
				case "a16":
					agerating = "7";
					break;
				case "a18":
					agerating = "9";
					break;
				case "ae":
					agerating = "1";
					break;
				case "ae10":
					agerating = "3";
					break;					
				case "at":
					agerating = "5";
					break;
				case "am":
					agerating = "7";
					break;	
				case "aa":
					agerating = "9";
					break;					
				default:
					agerating = "13";
			}
			document.getElementById('Rating').value = agerating;
			
			// Process Images
			var images = doc1.innerHTML.toString().match(/class=\"big_screen\" src=\"(.*?)"/g);
			for (var i = 0; i < images.length; i++) 
			{
				images[i] = /src=\"(.*?)"/g.exec(images[i])[1];
				console.log("Image " + i + ": " + images[i]);
				document.getElementById('image_block_preview').innerHTML = "<img width='150px' src='" + images[i] + "' onclick='imageImgur(this); return false;'> " + document.getElementById('image_block_preview').innerHTML;
			}
			document.getElementById('image_block_preview').parentNode.style.display = "table-row";
			
			var maxImages = 12;
			if (maxImages > images.length-1) { maxImages = images.length-1; }
			for (var i = 3; i < maxImages; i++) {
				document.getElementById('image_block').innerHTML += "<br><input id=\"answer\" type=\"text\" name=\"screens[]\" style=\"width: 90%;\">";
			}
			
			// Game front cover
			var gameCover = doc1.getElementsByClassName('game_box')[0].src;
			document.getElementById('image_cover_preview').innerHTML = "<img width='150px' src='" + gameCover + "' onclick='imageImgur(this); return false;'>";	document.getElementById('image_cover_preview').parentNode.style.display = "table-row";
			
			// Game Generes !!!
			var tempGenres = doc1.getElementsByClassName('details')[0].getElementsByTagName('li')[0].getElementsByTagName('a');
			var genres = [];

			
			//check for genre combinations and reformat
			if (genres.toString().indexOf("shooter") !== -1 && genres.toString().indexOf("fpp") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/shooter/g)){
					genres[i] = "first.person.shooter";
					}
					if (genres[i].match(/fpp/g)){
					genres[i] = "";
					}
				}
			}
			
			if (genres.toString().indexOf("shooter") !== -1 && genres.toString().indexOf("tpp") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/shooter/g)){
					genres[i] = "third.person.shooter";
					}
					if (genres[i].match(/tpp/g)){
					genres[i] = "";
					}
				}
			}
			
			if (genres.toString().indexOf("real-time") !== -1 && genres.toString().indexOf("strategy") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/real\-time/g)){
					genres[i] = "real.time.strategy";
					}
					if (genres[i].match(/strategy/g)){
					genres[i] = "";
					}
				}
			}	
			
			if (genres.toString().indexOf("real-time") !== -1 && genres.toString().indexOf("tactical") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/real\-time/g)){
					genres[i] = "real.time.strategy";
					}
					if (genres[i].match(/strategy/g)){
					genres[i] = "";
					}
				}
			}	
			
			if (genres.toString().indexOf("turn-based") !== -1 && genres.toString().indexOf("strategy") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/turn\-based/g)){
					genres[i] = "turn.based.strategy";
					}
					if (genres[i].match(/strategy/g)){
					genres[i] = "";
					}
				}
			}	
			
			if (genres.toString().indexOf("modern") !== -1 && genres.toString().indexOf("shooter") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/modern/g)){
					genres[i] = "modern.military.shooter";
					}
					if (genres[i].match(/shooter/g)){
					genres[i] = "";
					}
				}
			}				
			
			if (genres.toString().indexOf("sci-fi") !== -1 && genres.toString().indexOf("simulation") !== -1){
				for (var i = 0; i < genres.length; i++) {
					if (genres[i].match(/sci-fi/g)){
					genres[i] = "space.simulation";
					}
					if (genres[i].match(/simulation/g)){
					genres[i] = "";
					}
				}
			}	
			//check for common genere matches and reformat
			for (var i = 0; i < genres.length; i++) {
			
					switch (genres[i])
				{
				case "sci-fi":
					genres[i] = "science.fiction";
					break;
				case "rpg":
					genres[i] = "role.playing.game";
					break;
				case "detective-mystery":
					genres[i] = "crime, mystery";
					break;	
				case "detective":
					genres[i] = "crime";
					break;
				case "fps":
					genres[i] = "first.person.shooter";
					break;
				case "building":
					genres[i] = "construction.simulation";
					break;		
				case "virtual-life":
					genres[i] = "life.simulation";
					break;	
				case "combat":
					genres[i] = "action";
					break;	
				case "rally":
					genres[i] = "racing";
					break;
				case "economic":
					genres[i] = "simulation";
					break;
				case "managerial":
					genres[i] = "simulation";
					break;
				case "chess":
					genres[i] = "strategy";
					break;
				case "off-road":
					genres[i] = "racing";	
					break;
				case "soccer":
					genres[i] = "sports";	
					break;	
				case "tactical":
					genres[i] = "strategy";	
					break;			
				case "modern":
					genres[i] = "";	
					break;	
				case "fpp":
					genres[i] = "";	
					break;	
				case "tpp":
					genres[i] = "";	
					break;		
				case "real-time":
					genres[i] = "";	
					break;		
				case "historical":
					genres[i] = "";	
					break;						
				default:
					break;
				}
				
				//replace - with .
				if (genres[i].toString().match(/\-/g)){
					var makeDot = genres[i].toString().replace(/\-/g, ".");
					genres[i] = makeDot
				}
				if (genres[i] !== ""){
				//check for dupes
					if (document.getElementById('tags').value.toString().indexOf(genres[i].toString()) == -1){
					//add tags to the tag field
						if (document.getElementById('tags').value == ""){
							document.getElementById('tags').value = genres[i].toString();
							}
						else {
							document.getElementById('tags').value += ", " + genres[i].toString();
							}
						}		
					}
				}

			
			//Get YouTube Trailer if it exists
			if (doc1.getElementsByTagName('iframe')[0]){
				var ytLink = doc1.getElementsByTagName('iframe')[0].src;
				ytLink = ytLink.split("?")[0].split("/");
				ytLink = ytLink[ytLink.length - 1]
				console.log(ytLink);
				document.getElementById('trailer').value = "http://www.youtube.com/watch?v=" + ytLink;}
			else {
				console.log("No YouTube link found.");}
				
			//Enable for mass uploads:
			//Set Platform
			document.getElementById('platform').value = "PC";
			//Set Release Type
			document.getElementById('miscellaneous').value = "Home Rip";
			//Set Release Description
			document.getElementById('release_desc').value += "1. Install the "+gameTitle.replace(/\:/g, "")+".exe\n2. Done!";
			//Set Edition
			document.getElementById('remaster').checked=false;
			document.getElementById('remaster').click();
			document.getElementById('remaster_year').value="2012";
			document.getElementById('remaster_title').value="GOG Edition";
			//Set Language
			document.getElementById('language').value = "English";
		
		}
	});
}

function searchGOG()
{
	console.log("Called: SearchGOG");

	var title = document.getElementById('title').value;
	console.log("Title: " + title);
	var date = new Date();
	var time = date.getTime();
	console.log("Time: " + time);
	GM_xmlhttpRequest({
		method: "GET",
		url: "http://www.gog.com/catalogue/ajax/?a=topMenuSearch&s="+title.replace(/ /g, "+")+"&t=" + time,
		onload: function(r) {
			var response = r.responseText;
			var matches = /"count":(\d*?),/.exec(response)[1];
			console.log("Number of Matches: " + matches);
			if (parseInt(matches) > 0)
			{
				// Parsing Results and cleaning them up
				var htmlMatch = /"html":"(.*?)","search"/.exec(response)[1];
				htmlMatch = htmlMatch.toString().replace(/&#163;/g, "£");
				console.log(htmlMatch)
				htmlMatch = htmlMatch.toString().replace(/\\/g, "");
				htmlMatch = htmlMatch.toString().replace(/<\/a><a/g, "</a><br><a");
				htmlMatch = htmlMatch.toString().replace(/<span class=\"nav_price\"><span>[\$|£]<\/span>\d*\.\d\d<\/span>/g, "");
				htmlMatch = htmlMatch.toString().replace(/data-pos=\"\d*\" /g, "");
				htmlMatch = htmlMatch.toString().replace(/class=\".*?"/g, "");
				htmlMatch = htmlMatch.toString().replace(/ u2122/g, "");
				htmlMatch = htmlMatch.toString().replace(/ u00ae/g, "");
				htmlMatch = htmlMatch.toString().replace(/u2122/g, "");
				htmlMatch = htmlMatch.toString().replace(/u00ae/g, "");
				htmlMatch = htmlMatch.toString().replace(/<span ><span>&euro;<\/span>\d*\.\d*<\/span>/g, "");
				htmlMatch = htmlMatch.replace(/href=\"/g, "href=\"http://www.gog.com");
				console.log(htmlMatch);

				if (!document.getElementById('gogresults')) {
					var results = document.createElement('tr');
					results.innerHTML = "<td class='label'>GOG Results:</td><td id='gogresults'>" + htmlMatch + "</td>";
					addElementTo.parentNode.parentNode.insertBefore(results, addElementTo.parentNode.nextSibling);
				} else {
					document.getElementById('gogresults').innerHTML = htmlMatch;
				}

				for (var i = 0; i < document.getElementById('gogresults').getElementsByTagName('a').length; i++) {
					var elmLink = document.getElementById('gogresults').getElementsByTagName('a')[i];
					elmLink.addEventListener("click", helloWorld, true);
				}
			}
		}
	});
}
