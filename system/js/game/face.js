// 表情
define(['game/name'], function (url) {

var $face = $('#dialog-face'),
	image = new Image();

image.onload = function() {
	$face.attr('src', image.src);
}

function hide() {
	$face.addClass('hidden');
}

function load(name, type) {
	image.src = url.face(name, type);
}

function show() {
	$face.removeClass('hidden');
}

return {
	hide: hide,
	load: load,
	show: show
}

});