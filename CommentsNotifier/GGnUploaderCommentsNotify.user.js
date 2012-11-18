// ==UserScript==
// @name		GGn :: Upload Comments Notifier
// @namespace	http://www.what.cd edited by GamingFreak of GGn
// @description	Will notify you when you have unread comments on your uploads
// @include	    https://www.gazellegames.net*
// @include	    https://gazellegames.net*
// @include	    http://www.gazellegames.net*
// @include	    http://gazellegames.net*
// @version	1.6
// ==/UserScript==

function main() {
	var alert_style = 1;	/* 1 = comment bubble + comment alert bubble (blinking)					*/
							/* 2 = comment alert bubble only (doesn't leave comment bubble by "Uploads") 	*/
							/* 3 = alert bar only (no comment bubble) 							*/
	
	var check_interval = 300000; /* amount of time to wait before checking for new upload comments	*/
								 /* keep to above 5 minutes to reduce load on the server 			*/
								 /* 900k = 15 min, 600k = 10 min, 300k = 5 min					*/

    if (debug) { check_interval = 1; }

	/*	PLEASE DO NOT EDIT BELOW THIS POINT  *********  PLEASE DO NOT EDIT BELOW THIS POINT		*/
	/* 	PLEASE DO NOT EDIT BELOW THIS POINT  *********  PLEASE DO NOT EDIT BELOW THIS POINT		*/
	
	var whatcd_base_url = document.URL.match(/^http(s|):\/\/gazellegames\.net/)[1];
	var target = document.getElementById('userinfo_minor').getElementsByTagName('li'); /* User menu */
	var comment_image = 'data:image/png;base64,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'
	var comment_alert_image = 'data:image/gif;base64,R0lGODlhEAAPAMQWAP/+/v/Bwdjn6OGwsdTk5d6trt3p6uWxsvu/v/b5+fG6uu63t/H29unx8fS7u+q0te309OPt7vr7+/i9vZNpanGKi////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFhwAWACwAAAAAEAAPAAAFRqAljmQ5VmiqoifgvrBbWZVk3ziOJnzv+yiGcEgkoiDIpFKJajifUCgqQq1arbOKYcvtbmeilGC8ApcqBLOJxFqb1O54KQQAIfkEBSMAFgAsAAABABAADQAABUKgZVFkaZLiGKxsu1IjIs80TU54ruuk4/9AIElBLBqNpIVyyWSSHtCoVAqjHK7Y7BUmKg2+J26qWxCPzyMzeqw+hwAAOw=='
	var matches;
	var unviewedComments;
	var unviewedCount;
	var lastViewed;
	var lastChecked;
	var current = new Date();
	
	unviewedComments = GM_getValue("unviewedComments", false);
	unviewedCount = GM_getValue("unviewedCount", "0");;
	lastChecked = GM_getValue("lastChecked", "1");
	lastViewed = GM_getValue("lastViewed", "post");
	
	if ( (document.URL.indexOf("comments.php") > "-1") && (document.URL.indexOf("action=my_torrents") > "-1") && (document.URL.indexOf("page=") == "-1") ) {
		/* Update the last time you've viewed your upload comments */
		GM_setValue("lastChecked", String(current.getTime()));
		matches = document.documentElement.innerHTML.match(/id=\"post[0-9]{1,}/gi);
		if (matches != null ) {
			/* Mark unread comments with "(New!)"  */
			for (i = 0; i < matches.length; i++) { 
				matches[i] = matches[i].replace("id=\"", "");
				if ( lastViewed == matches[i] ) {
					break;
				} else if (lastViewed != matches[i] ) {
					document.getElementById('' + matches[i] + '').getElementsByTagName('span')[0].innerHTML += ' <span style="color: red;">(New!)</span>';
				}
			}
			
			/* Update the most recent comment you've viewed  */
			lastViewed = matches[0];
			unviewedComments = false;
			unviewedCount = 0;
			GM_setValue("lastViewed", lastViewed);
			GM_setValue("unviewedComments", unviewedComments);
			GM_setValue("unviewedCount", unviewedCount);
		}
	}
	
	/* To change the "check" interval, please adjust the value at the top of this script */
	if ( !lastChecked || (current.getTime() - lastChecked) > check_interval ) {
		/* Update the last time you've viewed your upload comments */
		GM_setValue("lastChecked", String(current.getTime()));
		/* Check for new comments on your uploads */
		if (!debug) {
		    GM_xmlhttpRequest({
			    method: 'GET',
			    url: whatcd_base_url + '/comments.php?action=my_torrents',
			    headers: {
				    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				    'Accept': 'application/atom+xml,application/xml,text/xml',
			    },
			    onload: function(responseDetails) {
				    if ( responseDetails.status == "200" ) {
					    matches = responseDetails.responseText.match(/id=\"post[0-9]{1,}/gi);
					    if ( matches != null ) {
						    unviewedCount = 0;
						    for (i = 0; i < matches.length; i++) { 
							    matches[i] = matches[i].replace("id=\"", "");
							    if ( lastViewed == matches[i] ) {
								    break;
							    } else if (lastViewed != matches[i] ) {
								    unviewedCount++;
							    }
						    }
						
						    if ( unviewedCount > 0 ) {
							    /* There's a new comment! */
							    unviewedComments = true;
						    }

						    GM_setValue("unviewedCount", unviewedCount);
						    GM_setValue("unviewedComments", unviewedComments);
					    }
				    }
			    }
		    });
		} else {
		    unviewedComments = true; unviewedCount = 1;
		}
	}
	
	if ( alert_style >= 4 ) { return 0; }
	
	/* Insert link to uplaod comments page if we've found a new/unviewed comment */
	if ( alert_style != 3 ) {
		if ( unviewedComments == true ) {
			target[1].innerHTML += ' <a style="width: 58px;" href="/comments.php?action=my_torrents"><img src="' + comment_alert_image + '" style="height: 11px; width: 10px; padding: 0px 5px 0px 3px;" title="You have ' + unviewedCount + ' new comments left on your uploads" /></a>';
		} else {
			target[1].innerHTML += ' <a style="width: 58px;" href="/comments.php?action=my_torrents"><img src="' + comment_image + '" style="height: 11px; width: 10px;" title="View comments left on your uploads" /></a>';
		}
	
		var myStyle = getComputedStyle(target[0].getElementsByTagName('a')[0], '');
		target[1].getElementsByTagName('a')[0].style.width = "39px";	
	}
	
	if ( alert_style != 2 ) {
		if ( unviewedComments == true ) {
			if ( document.getElementById('alerts') != null ) {
				/* If there's an existing alert, append a new alertbar */
				document.getElementById('header').style.marginBottom = "-10px";
				var alerts = document.getElementById('alerts');
				var new_alertbar = document.createElement('div');
				new_alertbar.setAttribute('class', 'alertbar');
				new_alertbar.setAttribute('style', 'left:0; margin:0 auto; padding: 0px 0px 0px 0px; right:0; width: 976px; text-align: center; -moz-border-radius: 5px;');
				new_alertbar.innerHTML = '<a href="/comments.php?action=my_torrents">You have ' + unviewedCount + ' new comments left on your uploads</a>';
				alerts.appendChild(new_alertbar);
			} else {
				/* If there's no existing alert ... we'll have to be a little creative */
				document.getElementById('header').style.marginBottom = "-10px";
				var content = document.getElementById('content');
				var new_alertbar = document.createElement('div');
				new_alertbar.setAttribute('class', 'alertbar colhead');
				new_alertbar.setAttribute('style', 'left:0; margin:0 auto; margin-bottom: 5px; padding: 0px 0px 0px 0px; right:0; width: 976px; text-align: center; -moz-border-radius: 5px;');
				new_alertbar.innerHTML = '<div style="padding-top: 5px;"><a style="color: #000000; font-weight:normal; padding-top: 5px;" href="/comments.php?action=my_torrents">You have ' + unviewedCount + ' new comments left on your uploads</a></div>';
				content.parentNode.insertBefore(new_alertbar, content);
			}
		}
	}
}

main();
