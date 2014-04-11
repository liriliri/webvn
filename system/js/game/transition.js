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
        '向内羽化': 'gradientCircle',
        '向下羽化': 'gradientDown',
        '向左羽化': 'gradientLeft',
        '向右羽化': 'gradientRight',
        '向上羽化': 'gradientUp',
        '脱落': 'hinge',
        '光速渐隐': 'lightSpeedOut',
        '旋转渐隐': 'rotateOut'
    }

function Transition($div, $img) {
    this.$div = $div,
    this.$img = $img,
    this.img = $img[0],
    this.timer = null;
    this.timer2 = null;
}

// 初始化
p.init = function(transDuration, transType) {
    this.setDuration(transDuration);
    this.setType(transType);
}

// 切换图片
p.run = function (url) {
    var that = this;
    var type = this.type;
    // 如果上次动画未执行完毕，则立即将其取消
    if (this.timer !== null) {
        clearTimeout(this.timer);
        this.animateDoneCallback(false);
    }
    if (this.timer2 !== null) {
        clearTimeout(this.timer2);
        this.timer2 = null;
    }
    this.$div.css({
        'background-image': 'url(' + url + ')'
    });
    this.img.offsetWidth = this.img.offsetWidth; // 必须这样做才能使CSS3动画重新开始
    this.$img.addClass(type);
    this.animateDoneCallback = function(flag) {
        this.timer = null;
        // flag为false的话立即关闭掉渐变效果
        if (flag === false) {
            this.$img.attr({
                'src': url,
                'class': 'fill'
            });
            return;
        }
        this.$img.attr('src', url);
        this.timer2 = setTimeout(function () {
            that.$img.removeClass(type);
            that.timer2 = null;
        }, 500);
    };
    this.timer = setTimeout(function () {
        that.animateDoneCallback();
    }, this.time);
}

// 设置过渡时长
p.setDuration = function (duration) {
    this.time = duration;
    this.$img.css({
        '-webkit-animation-duration': (duration - 200) / 1000 + 's',
        '-webkit-animation-delay': '0.2s'
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