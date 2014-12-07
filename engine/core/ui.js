// Manager of ui component

webvn.add('ui', ['class'], function (s, kclass) {

var ui = {};

ui.add = funsction (type) {

};

// Base class for all ui class
var BaseUi = kclass.create({
    constructor: function BaseUI(name) {},
    remove: function () {

    }
});

// Div element
var DivUI = BaseUi.extend({
    constructor: function DivUI() {

    }
});


return ui;

});