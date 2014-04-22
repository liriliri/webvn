// 点击区
define(['connector'], function (connector) {

var $clickArea = $('#click-area');

$clickArea.on('click', function () {
    connector.trigger('gameClicked');
});

});