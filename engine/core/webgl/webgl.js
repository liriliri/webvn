WebVN.extend('webgl', function (exports, Class)
{
    var DrawImageProgram = exports.DrawImageProgram,
        createFrameBuffer = exports.createFrameBuffer,
        TransitionProgram = exports.TransitionProgram,
        FilterProgram = exports.FilterProgram;

    var WebGL2D = exports.WebGL2D = Class.create({

        constructor: function WebGL2D(view) {
            this.view = view;
            this.gl = view.getContext('webgl');
            this.width = view.width;
            this.height = view.height;

            this._init();
        },

        _init: function () {
            var gl = this.gl,
                view = this.view;

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            this.drawImageProgram = new DrawImageProgram(gl, view);
            this.transitionProgram = new TransitionProgram(gl, view);
            this.filterProgram = new FilterProgram(gl, view);
        },

        drawImage: function (image, x, y, alpha, scaleX, scaleY) {
            this.drawImageProgram.use().render(image, x, y, alpha, scaleX, scaleY);
        },

        drawTransition: function (image1, image2, progress, type, x1, y1, x2, y2, alpha, scaleX, scaleY, filter, lumaImage) {
            var gl = this.gl,
                view = this.view;

            var frameBuffer1 = createFrameBuffer(gl, view, 0),
                frameBuffer2 = createFrameBuffer(gl, view, 1);
            frameBuffer1.start();
            this.drawImage(image1, x1, y1, alpha, scaleX, scaleY);
            frameBuffer1.end();
            frameBuffer2.start();
            this.drawImage(image2, x2, y2, alpha, scaleX, scaleY);
            frameBuffer2.end();

            if (filter) this.bufferFilter();
            this.transitionProgram.render(frameBuffer1.get(),
                frameBuffer2.get(), progress, type, lumaImage);
            if (filter) this.drawFilter(filter.name, filter.value);
        },

        bufferFilter: function () {
            var gl = this.gl,
                view = this.view;

            this.filterFrameBuffer = createFrameBuffer(gl, view, 2);
            this.filterFrameBuffer.start();
        },

        drawFilter: function (type, value) {
            var filterFrameBuffer = this.filterFrameBuffer;

            filterFrameBuffer.end();
            this.filterProgram.render(filterFrameBuffer.get(), type, value);
        },

        clear: function () {
            var gl = this.gl;

            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

    });

    exports.create = function (view) {
        return new WebGL2D(view);
    };

});