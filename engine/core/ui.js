// Manager of ui component

webvn.add('ui', ['class', 'select'], function (s, kclass, $) {

var ui = {},
	uiContainer = {}, // Store all the ui components
	$container = $('body');

// Create and add ui component
ui.create = function (name, type) {

	var newUi;

	switch (type) {
		case 'canvas':
			newUi = new CanvasUi();
			break;
		case 'svg':
			newUi = new SvgUi();
			break;
		default:
			newUi = new DivUi();
			break;
	}

	uiContainer[name] = newUi;

	return newUi;

};

// Get ui component for manipulation
ui.get = function (name) {

	return uiContainer[name];

};

// Base class for all ui class
var BaseUi = kclass.create({
    constructor: function BaseUI(name) {},
    remove: function () {



    }
});

// Div element
var DivUi = BaseUi.extend({
    constructor: function DivUI() {

    	this.callSuper();
    	this.ele = $('<div>');

    }
});

// Canvas element
var CanvasUi = BaseUi.extend({
	constructor: function CanvasUi() {

		this.callSuper();
		this.ele = $('<canvas>');
		this.ctx = this.ele[0].getContext('2d');

	},
	// 获取2d绘图对象
	getContext2d: function () {

		return this.ctx;

	}
});

// Svg element
var SvgUi = BaseUi.extend({

	constructor: function SvgUi() {

		this.callSuper();
		this.ele = $('<svg>');

	}

});

return ui;

});