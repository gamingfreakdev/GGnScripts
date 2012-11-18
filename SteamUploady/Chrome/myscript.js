/* Auto Update Variables */
var now = new Date();
var date = now.getDate().toString() + "/" + now.getMonth().toString() + "/" +  (now.getYear()+1900).toString();
var lstDate = window.localStorage.getItem("lstDate");
var version = 0.43;
/* End */


if (!document.getElementById('steamAuto')) {
	var placement = document.getElementById('content').getElementsByClassName('thin')[0];
	var steam = document.createElement('div');
	steam.setAttribute('id', 'steamAuto');
	steam.setAttribute('style', 'padding: 0px 0px 5px 0px; text-align: center;');
	placement.parentNode.insertBefore(steam, placement);
}

document.getElementById('steamAuto').innerHTML = "<table><tr class=\"colhead\"><td colspan=\"2\">Steam Store 'HELP' Uploady</td></tr>" + 
"<tr><td class=\"label\">Steam App Id:</td><td><input type=\"text\" value=\"\" size=\"10\" /></td>" +
"<tr><td class=\"label\">System Requirements</td><td><input type=\"checkbox\" id=\"systemReq\" name=\"systemReq\" /> <label for=\"systemReq\">Include System Requirements?</label></td></tr>" + 
"<tr><td class=\"label\">Status:</td><td><span id=\"AutoSteamStatus\"></span><span id=\"abortLink\" style=\"display: none;\"> | <a href=\"#\" id=\"steamAbort\" onclick=\"return false\">Abort</a></span></td></tr>" + 
"<tr><td class=\"label\">Start:</td><td><a href=\"#\" onclick=\"return false;\" id=\"steamAutoGo\">Go!</a></td></tr></table><br>";
var elmLink = document.getElementById('steamAutoGo');
elmLink.addEventListener("click", main, true);
elmLink = document.getElementById('steamAbort');
elmLink.addEventListener("click", imgAbort, false);
var abort = false;

//Here is the steamstore stuff
var images = "";
var imagePost = 0;

if (lstDate != date) {
	window.localStorage.setItem("lstDate", date);
	update();
}

checks();

function addImg(data, i) {
	var doc1 = document.createElement('div');
	doc1.innerHTML = data;
	var input = doc1.getElementsByTagName('input');
	var i2 = 0;
	while (input[i2].id != 'direct') {
		i2++;
	}
	var url = input[i2].value.toString().split('/');
	var screens = document.getElementById('image_block').getElementsByTagName('input');
	var i = 0;
	while (screens[i].value != "") { i++; }
	screens[i].value = "http://i.imgur.com/" + url[url.length-1];
	imagePost += 1;
	imgurUp(imagePost);
}

function imgurUp(i) {
	if (document.getElementById('abortLink').style.display == "none") {
		document.getElementById('abortLink').style.display = 'inline';
	}
	var splitImg = images.split('|');	
	if (i < splitImg.length && !abort) {
		document.getElementById('AutoSteamStatus').innerHTML = "Uploading Image: " + (i+1) + " out of " + splitImg.length;
		chrome.extension.sendRequest({'action' : 'imgurUp', 'url' : splitImg[i], 'i' : i}, addImg);
	} else {
		if (abort) {
			document.getElementById('AutoSteamStatus').innerHTML = "Image Upload Aborted";
		} else {
			document.getElementById('AutoSteamStatus').innerHTML = "Completed Image Upload";
		}
	}
}

function IGNRatings() {
	var gametitle = document.getElementById('title').value.toString();
	gametitle = gametitle.replace(/:/gi,'');
	gametitle = gametitle.replace(/ /gi,'+');
	gametitle = gametitle.replace(/&/gi,'and');
	gametitle = gametitle.replace(/'/gi,'%27');
	var gameplat = document.getElementById('platform').value;
	gameplat = gameplat.toString().replace(/\s/g,'').toLowerCase();
	var urlgameplat = gameplatform(gameplat);
	if (gameplat == '---') {
		alert('Select Game Platform');
		var elmLink = document.getElementById('steamAutoGo');
		elmLink.removeEventListener('click', main, true);
		elmLink.addEventListener("click", IGNRatings, true);
		elmLink.innerHTML = "Continue IGN Ratings";
		return 0;
	}
	var url = "http://search.ign.com/product?query=" + gametitle + "&sort=relevance&platform=" + urlgameplat;
	if (urlgameplat != 'null') { chrome.extension.sendRequest({'action' : 'ign', 'url' : url }, IGNFiller); } else { document.getElementById('AutoSteamStatus').innerHTML = "No IGN rating"; }
	
}

function IGNFiller(data) {
	var doc1 = document.createElement('div');
	doc1.innerHTML = data;
	var i = 0;
	while (doc1.getElementsByTagName('div')[i].id != 'searchResults') { i++ }
	var results = doc1.getElementsByTagName('div')[i].getElementsByClassName('product-result');
	i = 0;
	var found = false;
	var rating = "";
	while ((!found) && (i < results.length)) {
		rating = parseFloat(results[i].getElementsByClassName('ratingBox')[0].innerHTML.toString());
		var ignTitle = results[i].getElementsByClassName('game-title')[0].getElementsByTagName('a')[0].innerHTML.toString();
		ignTitle = ignTitle.replace('\u2122', '');
		ignTitle = ignTitle.replace(/&amp;/g, '&');
		ignTitle = ignTitle.replace(/(^\s*|\s*$)/g, '');
		var ignPlat = results[i].getElementsByClassName('platform')[0].innerHTML.toString().replace(/\s/g,'').toLowerCase();
		var gameplat = document.getElementById('platform').value.toString().replace(/\s/g,'').toLowerCase();;
		if ((ignTitle == document.getElementById('title').value.toString()) && (ignPlat == gameplat)) { found = true; }
	}
	document.getElementById('ignscore').value = rating;
	document.getElementById('AutoSteamStatus').innerHTML = "IGN Rating Completed";
	
}

function gameplatform(plat) {
	switch (plat) {
		case 'xbox360':
		case 'wii':
		case 'pc':
			break;
		case 'nintendods':
			plat = 'ds';
			break;
		case 'playstationportable':
			plat = 'psp';
			break;
		case 'playstation3':
			plat = 'ps3';
			break;
		default:
			plat = 'null';
			break;
	}
	return plat;
}

function steamGrab(data) {
	var maxImagesUpload = 12;
	var doc1 = document.createElement('div');
	doc1.innerHTML = data;
	var screens = doc1.getElementsByClassName('screenshot_holder');
	var imgurImages = "";
	var title2 = doc1.getElementsByClassName('game_area_purchase_game')[0].getElementsByTagName('h1')[0];
	var gamename = title2.innerHTML.toString().replace('Buy ','');;
	//var links = doc1.getElementsByClassName('blockbg')[0].getElementsByTagName('a');
	//var gamename = links[links.length-1].innerHTML.toString();
	gamename = gamename.replace('\u2122', '');
	gamename = gamename.replace(/&amp;/g, '&');
	if (document.getElementById('title').value == "") { document.getElementById('title').value = gamename; }
	
	var metacritic = doc1.getElementsByClassName('block_content_inner')[doc1.getElementsByClassName('block_content_inner').length-1].getElementsByTagName('div')[0].innerHTML;
	if (doc1.getElementsByClassName('block_content_inner')[doc1.getElementsByClassName('block_content_inner').length-1].getElementsByTagName('div')[0].id == "game_area_metascore") { 
		if (document.getElementById('meta').value == "") { document.getElementById('meta').value = metacritic; }
	}
	document.getElementById('AutoSteamStatus').innerHTML = "MetaCritic Completed";
	
	var glanceFinal = doc1.getElementsByClassName('glance_details').length-1;
	
	var category = doc1.getElementsByClassName('glance_details')[glanceFinal].getElementsByTagName('div')[0].getElementsByTagName('a')[0].innerHTML;
	if (document.getElementById('tags').value == "") { document.getElementById('tags').value = category; }
	document.getElementById('AutoSteamStatus').innerHTML = "Category Completed";
	
	//Year of release
	var release = doc1.getElementsByClassName('glance_details')[glanceFinal].getElementsByTagName('div')[1].innerHTML;
	release = release.replace(/[\t|\n]/g, '');
	var temp1 = release.split(' ');
	release = temp1[temp1.length-1];
	if (document.getElementById('year').value == "") { document.getElementById('year').value = release; }
	document.getElementById('AutoSteamStatus').innerHTML = "Year Release Completed";
	
	var gad = doc1.getElementsByClassName("game_area_description");
	//Game Description
	var des = "";
	for (var i=0; i < gad.length; i++) {
		if (gad[i].id == "game_area_description") { des = gad[i].innerHTML.toString().replace(/<(\/|)(h2|p|ul|li|strong|i)>/gi, ''); i = gad.length; }
	}
	des = des.replace(/About the Game/, '');
	des = des.replace(/<(script|noscript)>(.*)<\/(script|noscript)>/gi, '');
	des = des.replace(/\t/g, '');
	des = des.replace(/\n\n/, '');
	des = des.replace(/<br>/g, '\n');
	if (document.getElementById('album_desc').innerHTML == "") { document.getElementById('album_desc').innerHTML = des; }	
	document.getElementById('AutoSteamStatus').innerHTML = "Description Completed";
	
	//Game Requirements
	if (document.getElementById('systemReq').checked) {
		var req = "";
		for (var i=0; i < gad.length; i++) {
			if (gad[i].id == "game_area_sys_req") { req = gad[i].getElementsByTagName('div')[0].innerHTML; i = gad.length; }
		}
		if (req != "") {
			req = req.replace(/(\t|\n)/g, '');
			req = req.replace(/<(h2|ul|strong|p|br)>/g, '');
			req = req.replace(/<img (.*)>/g, '');
			//req = req.replace(/: /g, ':\n[*]');
			req = req.replace(/<li>/g, '[*]');
			req = req.replace(/<\/strong>/g, '');
			req = req.replace(/<\/(li|p|ul)>/g, '\n');
			req = req.replace(/\s*/, '');
			req = req.replace(/\n\s*/g, '\n');
			req = "\n[quote][b]System Requirements:[/b]\n" + req + "[/quote]";
			document.getElementById('album_desc').innerHTML += req;
		}
	}
	var screensGGn = document.getElementById('image_block').getElementsByTagName('input');
	var upStart = 0;
	for (var i = 0; ((i < screensGGn.length) && (screensGGn[i].value != "")); i++) {
		maxImagesUpload -= 1;
		upStart += 1;
	}
	
	for (var i = 0; ((i < screens.length) && (i < maxImagesUpload)); i++) {
		if (images == "") {
			images = screens[i].getElementsByTagName('a')[0].href;
		} else { 
			images = images + "|" + screens[i].getElementsByTagName('a')[0].href;
		}
	}
	
	var maxImages = images.split('|').length + upStart;

	for (var i = 3; i < maxImages; i++) {
		document.getElementById('image_block').innerHTML += "<br><input id=\"answer\" type=\"text\" name=\"screens[]\" style=\"width: 90%;\">";
	}
	imgurUp(0);
	IGNRatings();
}

function main() {
	images = "";
	var appid = parseInt(document.getElementById('steamAuto').getElementsByTagName('input')[0].value.toString());	
	if (!appid) { return 0; }
	chrome.extension.sendRequest({'action' : 'steamPageGrab', 'appid' : appid}, steamGrab)
	return(false);
}

function imgAbort() {
	abort = true;
}

function update() {
	var url = "http://dl.dropbox.com/u/20017678/GGn/SteamUploady/C/update.txt";
	chrome.extension.sendRequest({'action' : 'ign', 'url' : url }, update2);
}

function update2(data) {
	var temp = data.toString().split('|');
	var Uversion = parseFloat(temp[0]);
	var url = temp[1];
	if (Uversion > version) {
		alert("New update available - opening in same tab!");
		window.location = url;
	}
}