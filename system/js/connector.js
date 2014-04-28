// 元素事件连接器
define(function () {

var events = {};

// 发布事件
function on(event, func) {
    events[event] = func;
}

// 触发事件
function trigger(event) {
    if (events[event]) {
        events[event].apply(null, [].splice.call(arguments, 1, 1));
    }
}

return {
    on: on,
    trigger: trigger
}

});