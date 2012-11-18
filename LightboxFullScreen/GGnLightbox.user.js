// ==UserScript==
// @name           LightBox Modifcation
// @namespace      gamingfreak
// @include        https://gazellegames.net/*
// @include        https://www.gazellegames.net/*
// @include        http://gazellegames.net/*
// @include        http://www.gazellegames.net/*
// @match          https://gazellegames.net/*
// @match          https://www.gazellegames.net/*
// @match          http://gazellegames.net/*
// @match          http://www.gazellegames.net/*
// ==/UserScript==

function GM_addStyle(css) {
	var head = document.getElementsByTagName('head')[0], style = document.createElement('style');
	if (!head) {return}
	style.type = 'text/css';
	try {style.innerHTML = css} catch(x) {style.innerText = css}
	head.appendChild(style);
}

GM_addStyle("#lightbox > img { max-width: 99%; max-height: 99%; } .lightbox { top: 2.5% !important; left: 2.5% !important; height: 95% !important; width: 95% !important; }");
