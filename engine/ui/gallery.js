webvn.use(function (ui, select, config, storage, canvas) {
    "use strict";
    var uiName = 'gallery',
        exports = ui.create('gallery'),
        $el = exports.$el,
        lang = ui.lang.get(uiName),
        tpl = ui.template.get(uiName);

    var cfg = config.create('uiGallery'),
        cfgPath = cfg.get('path'),
        cfgExtension = cfg.get('extension'),
        cfgFiles = cfg.get('files');

    $el.addClass('fill').html(tpl({
        Gallery: lang.get('Gallery'),
        Close: lang.get('Close')
    }));

    var $container = $el.find('.container'),
        $viewer = $el.find('.viewer'),
        $pagination = $el.find('.pagination');

    var renderer = canvas.renderer,
        asset = storage.createAsset(cfgPath, cfgExtension),
        pageSize = 6,
        pageCount = Math.ceil(cfgFiles.length / pageSize);

    function page(num) {
        var html = '',
            start = (num - 1) * pageSize,
            end = start + pageSize;
        if (end > cfgFiles.length) {
            end = cfgFiles.length;
        }
        for (; start < end; start++) {
            html += '<li><img class="th" src="' + asset.get(cfgFiles[start]) + '"></li>';
        }
        $container.html(html);
    }
    page(1);

    if (pageCount > 1) {
        var html = '';
        for (var i = 0; i < pageCount; i++) {
            html += '<li class="button" data-num="' + (i+1) + '">' + (i+1) + '</li>';
        }
        $pagination.html(html);
    }

    exports.stopPropagation().properties({
        fadeIn: cfg.get('fadeIn'),
        fadeOut: cfg.get('fadeOut'),
        duration: cfg.get('duration')
    }).events({

        'click .close': function () {
            hide();
        },

        'click li img': function () {
            var $this = select.get(this),
                src = $this.attr('src');
            $viewer.find('img').attr('src', src);
            $viewer.removeClass('hidden').fadeIn(exports.duration);
        },

        'click .pagination li': function () {
            var $this = select.get(this);
            page(Number($this.attr('data-num')));
        },

        'click .viewer': function () {
            var $this = select.get(this);
            $this.fadeOut(exports.duration);
        }

    });

    exports.show = function () {
        renderer.stop();

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    var hide = exports.hide = function () {
        renderer.start();

        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };
});