webvn.use(function (ui, select, config, storage, util) {
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

    var pageSize = 6,
        pageCount = Math.ceil(cfgFiles.length / pageSize);

    $el.addClass('fill');
    $el.html = tpl({
        Gallery: lang.get('Gallery'),
        Close: lang.get('Close'),
        pageCount: pageCount
    });

    var $container = $el.find('.container'),
        $viewer = $el.find('.viewer'),
        $viewerImgFore = $viewer.find('img.fore'),
        $viewerImgBack = $viewer.find('img.back');

    var asset = storage.createAsset(cfgPath, cfgExtension),
        globalStore = storage.createLocalStore('global'),
        imageTpl = ui.template.get('gallery_image'),
        curImg, curImgNum, curImgs, viewerClick = true;

    var galleryStore = globalStore.get('gallery');
    !galleryStore && globalStore.set('gallery', {});

    function renderPage(num) {
        var images = [],
            start = (num - 1) * pageSize,
            end = start + pageSize,
            image, collected, file;

        galleryStore = globalStore.get('gallery');

        if (end > cfgFiles.length) end = cfgFiles.length;

        for (; start < end; start++) {
            file = cfgFiles[start];
            collected = [];

            image = util.isArray(file) ? file : [file];
            util.each(image, function (val, idx) {
                image[idx] = asset.get(val);
                collected[idx] = (galleryStore[start + '-' + idx] === true);
            });

            images.push({
                src: image,
                collected: collected
            });
        }

        $container.html = imageTpl({ images: images });

        curImgs = images;
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
            var num = this.data('num');

            if (!num) return;

            curImg = curImgs[num];
            curImgNum = 0;

            $viewerImgFore.attr('src', curImg.src[0]);
            $viewerImgBack.attr('src', curImg.src[0]);
            $viewer.fadeIn(exports.duration);
        },

        'click .pagination li': function () {
            renderPage(Number(this.attr('data-num')));
        },

        'click .viewer': function () {
            if (!viewerClick) return;

            viewerClick = false;
            curImgNum++;
            while (curImgNum < curImg.src.length &&
                !curImg.collected[curImgNum]) {
                curImgNum++;
            }

            if (curImgNum < curImg.src.length ) {
                $viewerImgFore.hide()
                    .attr('src', curImg.src[curImgNum])
                    .fadeIn(exports.duration, function () {
                        $viewerImgBack.attr('src', curImg.src[curImgNum]);
                        viewerClick = true;
                    });
            } else {
                this.fadeOut(exports.duration, function () {
                    viewerClick = true;
                });
            }
        }

    });

    exports.show = function () {
        renderPage(1);

        exports.fadeIn ? $el.fadeIn(exports.duration) : $el.show();
    };

    var hide = exports.hide = function () {
        exports.fadeOut ? $el.fadeOut(exports.duration) : $el.hide();
    };
});