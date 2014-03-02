define(function() {

var p = Transition.prototype;
    types = {
        '弹跳缩小渐隐': 'bounceOut',
        '渐隐': 'fadeOut',
        '向下渐隐': 'fadeOutDown',
        '向左渐隐': 'fadeOutLeft',
        '向右渐隐': 'fadeOutRight',
        '向上渐隐': 'fadeOutUp',
        '横向翻转渐隐': 'flipOutX',
        '纵向翻转渐隐': 'flipOutY',
        '脱落': 'hinge',
        '光速渐隐': 'lightSpeedOut',
        '旋转渐隐': 'rotateOut'
    }

function Transition($div, $img) {
    this.$div = $div,
    this.$img = $img,
    this.img = $img[0],
    this.timer = null;
}

// 初始化
p.init = function(transDuration, transType) {
    this.setDuration(transDuration);
    this.setType(transType);
}

// 切换图片
p.run = function (url) {
    // 如果上次动画未执行完毕，则立即将其取消
    if (this.timer !== null) {
        clearTimeout(this.timer);
        this.animateDoneCallback();
    }
    var type = this.type;
    this.$div.css({
        'background-image': 'url(' + url + ')'
    });
    this.img.offsetWidth = this.img.offsetWidth; // 必须这样做才能使CSS3动画重新开始
    this.$img.addClass(type);
    this.animateDoneCallback = $.proxy(function(type, url) {
        this.timer = null;
        this.$img.attr('src', url).removeClass(type);
    }, this, type, url);
    this.timer = setTimeout(this.animateDoneCallback, this.time - 100);
}

// 设置过渡时长
p.setDuration = function (duration) {
    this.time = duration;
    this.$img.css({
        '-webkit-animation-duration': duration / 1000 + 's'
    });
}

// 设置过渡类型
p.setType = function (type) {
    if (types[type]) {
        this.type = types[type];
    }
}

return Transition;

});