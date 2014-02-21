
//function save_options() {
//	
//    var iconRadios = document.forms[0].icon_set;
//    for(var i in iconRadios) {
//        if(iconRadios[i].checked) {
//            localStorage["icon_set"] = iconRadios[i].value;
//            break;
//        }
//    }
//	
//	
//	var soundRadios = document.forms[0].sound_set;
//    for(var i in soundRadios) {
//        if(soundRadios[i].checked) {
//            localStorage["audio_src"] = soundRadios[i].value;
//            break;
//        }
//    }
//    
//  
//    localStorage["poll_interval"] = $('#poll_interval').val();
//
//    // alert message
//    alert("Saved!");
//}

// Restores input states to saved values from localStorage.
function restore_options() {
   
	spawnIconRow("");
    for(var i=1;i<13;i++){
    	spawnIconRow("set"+i);
    }
    

	spawnSoundRow("sounds/chime.mp3" , "Chime");
	spawnSoundRow("sounds/ding.ogg" , "Ding");
	spawnSoundRow("sounds/message1.wav" , "There is a message for u..!");
	spawnSoundRow("sounds/youGotmail.wav" , "You got mail..!");
	spawnSoundRow("sounds/robotic.wav" , "Robotic sound");
	spawnSoundRow("sounds/tone_1.wav" , "Short tune");
	spawnSoundRow("sounds/typewriter.wav" , "Typewriter sound");
	spawnSoundRow("","No sound");
   
	//set icon radios
    var iconRadios = document.forms[0].icon_set;
    var iconFound = false;
    for(var i in iconRadios) {
        if(iconRadios[i].value == localStorage["icon_set"]) {
            iconRadios[i].checked = true;
            iconFound = true;
            break;
        }
    }
    if(!iconFound) {
        iconRadios[0].checked = true;
    }
       
	//set sound radios
	var soundRadios = document.forms[0].sound_set;   
	var soundFound = false;
    for(var i in soundRadios) {
        if(soundRadios[i].value == localStorage["audio_src"]) {
            soundRadios[i].checked = true;
            soundFound = true;
            break;
        }
    }
    if(!soundFound) {
        soundRadios[0].checked = true;
    }   
	   

    if(localStorage["poll_interval"] != null)
        $("#poll_interval").val(localStorage["poll_interval"]);
}

function spawnIconRow(value) {
    var selectionElement = document.getElementById("icon_selection");
    selectionElement.innerHTML += '<span><input type="radio" name="icon_set" value="' + value + '" onClick="saveAndChangeIcon(\''+value+'\')"/><img src="icons/' + value+ '/new.png" /><img src="icons/' + value+ '/no_new.png" /><img src="icons/' + value+ '/not_logged_in.png" /></span><br />';
}

function spawnSoundRow(value, description) {
	var selectionElement = document.getElementById("sound_selection");
	selectionElement.innerHTML += '<span><input type="radio" name="sound_set" value="' + value + '" onClick="saveAndPlaySound(\''+value+'\')"/><small>' + description + '</small></span><br />';
}
function saveAndChangeInterval(){
	if($("#poll_interval").val()>0){
		localStorage["poll_interval"] = $("#poll_interval").val();
	}
}
function saveAndChangeIcon(icon_set){
	localStorage["icon_set"] = icon_set;
	chrome.browserAction.setIcon({
		path : "../icons/" + icon_set + "/not_logged_in.png"
	});
}

function saveAndPlaySound(audio_src){
	localStorage["audio_src"] = audio_src;
	playSound(audio_src);
}
function playSound(audio_src){
	try {
			var audioElement = new Audio();
			audioElement.src = audio_src;
			audioElement.load();
			audioElement.play();
		
	} catch (e) {
		console.error(e);
	}
}