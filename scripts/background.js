var fduMailURL = "http://mail.fudan.edu.cn/";
var pollInterval = 1000 * 15; // 15 seconds default
var sid;
var currentNewMailCount = 0;
// called when firstTime
function loginOnInit() {
	if (sid) {
		// open the inbox
		chrome.tabs.create({
			url : fduMailURL + "coremail/XPS/index.jsp?sid=" + sid
		});
	} else {
		chrome.tabs.create({
			url : fduMailURL
		}, function(tab) {
			chrome.tabs.onUpdated.addListener(function(tabId, changeInfo,
					newTab) {
				if (tabId == tab.id && changeInfo.status == 'complete') {
					var url = newTab.url;
					// check if logged in
					if (url.indexOf('sid') > 0) {
						sid = url.split('=')[1];
						checkMail();
					}
				}
			});
		});
	}
}

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
	loginOnInit();
});

function init() {
	setNotLoggedInState();

	firstTime = true;
	// loginOnInit(); // cancelled
	regularCheck();
}
function regularCheck() {
	checkMail();
	scheduleRequest();
}

// set timer for the next iteration
function scheduleRequest() {
	if (localStorage['pollInterval']) {
		pollInterval = localStorage['pollInterval'];
	}
	window.setTimeout(regularCheck, pollInterval);
}

function checkMail() {
	if (sid) {
		var url = fduMailURL + "coremail/XPS/mbox/list.jsp?fid=1&sid=" + sid;
		$.ajax({
			url : url,
			success : function(data) {
				// load the data
				$("#hiddenFrame").html(data);

				// if new mail exists
				var newMails;
				if ((newMails = $('span.fNewMail').text())) {
					setNewMailState(newMails);
				}
			},
			error : function(data) {
				sid = undefined;
				setNotLoggedInState();
			},
		});

	}
}
function setNewMailState(newMailText) {
	if (newMailText > 0) {
		if (currentNewMailCount != newMailText) {
			// play sound when new mail is received
			playSound();
		}

		currentNewMailCount = newMailText;

		if (localStorage.icon_set) {
			chrome.browserAction.setIcon({
				path : "../icons/" + localStorage.icon_set + "/new.png"
			});
		} else {
			chrome.browserAction.setIcon({
				path : "../icons/new.png"
			});
		}
		chrome.browserAction.setTitle({
			title : newMailText + " new mail(s)"
		});
		chrome.browserAction.setBadgeBackgroundColor({
			color : [ 250, 218, 221, 255 ]
		});
		chrome.browserAction.setBadgeText({
			text : newMailText
		});

	} else {
		if (localStorage.icon_set) {
			chrome.browserAction.setIcon({
				path : "../icons/" + localStorage.icon_set + "/no_new.png"
			});
		} else {
			chrome.browserAction.setIcon({
				path : "../icons/no_new.png"
			});
		}
		chrome.browserAction.setTitle({
			title : newMailText + " new mail(s)"
		});
		chrome.browserAction.setBadgeBackgroundColor({
			color : [ 250, 218, 221, 255 ]
		});
		chrome.browserAction.setBadgeText({
			text : ""
		});
	}
}
function setNotLoggedInState() {
	if (localStorage.icon_set) {
		chrome.browserAction.setIcon({
			path : "../icons/" + localStorage.icon_set + "/not_logged_in.png"
		});
	} else {
		chrome.browserAction.setIcon({
			path : "../icons/not_logged_in.png"
		});
	}
	chrome.browserAction.setTitle({
		title : "not logged in"
	});
	chrome.browserAction.setBadgeBackgroundColor({
		color : [ 240, 240, 240, 255 ]
	});
	chrome.browserAction.setBadgeText({
		text : " "
	});
}
function playSound() {
	if (localStorage["audio_src"] != undefined
			&& localStorage["audio_src"] == "")
		return;
	var source;
	if (localStorage["audio_src"])
		source = localStorage["audio_src"];
	else
		source = "../sounds/chime.mp3"; // default audio source

	try {
		var audioElement = new Audio();
		audioElement.src = "../" + source;
		audioElement.load();
		audioElement.play();

	} catch (e) {
		console.error(e);
	}
}