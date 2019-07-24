'use strict';

let alarm_source;

window.AudioContext = window.AudioContext || window.webkitAudioContext;  
const context = new AudioContext();
class Player {
    constructor(audioBuffer) {
        this.status = false;
		this.ab = audioBuffer;
    }
	start() {
		this.source = context.createBufferSource();
		this.source.buffer = this.ab;
		this.source.connect(context.destination);
		this.source.onended = () => {
			this.status = false;
		}
		this.status = true;
		this.source.start(0);
	}
	stop() {
		if (this.status) this.source.stop(0);
	}
}


const getAudioBuffer = async (url) => {
	return new Promise( (resolve, reject) => {
		const req = new XMLHttpRequest();
		req.open('GET', url, true);
		req.responseType = 'arraybuffer';
		req.send();
		req.onreadystatechange = () => {
			if (req.status === 200 && req.readyState === 4) {
				context.decodeAudioData(req.response).then((buffer) => {
					resolve(buffer);
				});
			} else if (req.status >= 307 && req.readyState === 4) {
				reject(new Error(req.statusText));
			}
		}
		req.onerror = () => {
			reject(new Error(req.statusText));
		}
	});
};

// 雑でもうしわけ
const audioStop = () => {
	if (typeof(alarm_source) !== 'undefined') alarm_source.stop();
}

const alarmOn = () => {
	getAudioBuffer('js/beep.mp3').then(result => {
		alarm_source = new Player(result);
		alarm_source.start();
	});
};
const clickSE = () => {
	getAudioBuffer('js/clicker.mp3').then(result => {
		const player = new Player(result);
		player.start();
	});
};
$('.btn-lg').on('click', () => {
	clickSE();
	//console.log(context.currentTime);
});