// 音乐基础模块
define(function() {

var p = Sound.prototype;

function Sound(id) {
    this.audio = document.getElementById(id);
    this.loaded = false;
}

p.play = function() {
    this.audio.play();
}

p.pause = function() {
    this.audio.pause();
}

p.setCurrentTime = function (time) {
	if (this.loaded === true) {
		this.audio.currentTime = time;
	}
}

p.setLoop = function(flag) {
    this.audio.loop = flag;
}

p.setVolume = function (volume) {
	this.audio.volume = volume;
}

p.stop = function() {
	this.setCurrentTime(0);
    this.pause();
}

return Sound;

});