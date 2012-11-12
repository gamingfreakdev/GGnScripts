// ==UserScript==
// @name        GOG Uploady
// @namespace   gamingfreak, Gruselgurke
// @include     https://gazellegames.net/upload.php
// @include     http://gazellegames.net/upload.php
// @version     0.06
// @grant	GM_xmlhttpRequest
// ==/UserScript==

var addElementTo = document.getElementById('uploady').parentNode;
addElementTo.innerHTML += " <input id='goguploady' type='button' value='GOG Uploady'/>";

var elmLink = document.getElementById('goguploady');
elmLink.addEventListener("click", searchGOG, true);

function helloWorld(event)
{
	var elem = event.currentTarget;
	document.getElementById('title').value = elem.innerHTML;
	event.preventDefault();	
	GM_xmlhttpRequest({
		method: "GET",
		url: elem.href,
		onload: function(r) {
			var doc1 = document.createElement('div');
			doc1.innerHTML = r.responseText;
			
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

			for (var i = 0; i < tempGenres.length; i++) 
			{
				genres[i] = tempGenres[i].innerHTML;	
				console.log("Genre " + i + ": " + genres[i]);
			}

			for (var i = 0; i < genres.length; i++) {
				if (!genres[i].toString().match(/fpp/))
				{
					if (document.getElementById('tags').value == "")
						document.getElementById('tags').value = genres[i].toString();
					else
						document.getElementById('tags').value += ", " + genres[i].toString();
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
			document.getElementById('release_desc').value += "1. Install the .exe\n2. Done!";
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
				htmlMatch = htmlMatch.toString().replace(/\\/g, "");
				htmlMatch = htmlMatch.toString().replace(/<\/a><a/g, "</a><br><a");
				htmlMatch = htmlMatch.toString().replace(/<span class=\"nav_price\"><span>\$<\/span>\d*\.\d\d<\/span>/g, "");
				htmlMatch = htmlMatch.toString().replace(/data-pos=\"\d*\" /g, "");
				htmlMatch = htmlMatch.toString().replace(/class=\".*?"/g, "");
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