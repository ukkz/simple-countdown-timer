'use strict';

// Global
let userSetSec = 0;
let countSec = 0;
let jsTimer;

const timerShow = () => {
	const minutes = Math.floor(countSec / 60);
	const seconds = countSec % 60;
	const ss = (seconds < 10) ? '0'+seconds : seconds;
	const mi = (minutes < 10) ? '0'+minutes : minutes;
	$('#display').text(mi+':'+ss);
}

const buttonSwitch = (running) => {
	$('#btn-start').prop('disabled', running);
	$('#btn-5m').prop('disabled', running);
	$('#btn-1m').prop('disabled', running);
	$('#btn-10s').prop('disabled', running);
	$('#btn-1s').prop('disabled', running);
	$('#btn-pause').prop('disabled', !running);
}

const timerCountUp = () => {
	// 99min & 59sec = 5999
	if (countSec < 5999) countSec++;
	timerShow();
}

const timerCountDn = () => {
	if (countSec >= 0) countSec--;
	if (countSec < 0) {
		// Fin!
		timerReset(true);
	}
	timerShow();
}

const timerSet = (add_seconds) => {
	for (let index = 0; index < add_seconds; index++) {
		timerCountUp();
	}
}

const timerStart = () => {
	userSetSec = countSec;
	buttonSwitch(true);
	jsTimer = setInterval(timerCountDn, 1000);
}

const timerPause = () => {
	buttonSwitch(false);
	clearInterval(jsTimer);
}

const timerReset = (alarm_on = false) => {
	timerPause();
	if (alarm_on) {
		countSec = 0;
		alarmOn();
	} else if (userSetSec > 0) {
		// First click
		audioStop();
		countSec = userSetSec;
		userSetSec = 0;
	} else {
		// after Second click
		audioStop();
		countSec = 0;
	}
	timerShow();
}




timerReset();