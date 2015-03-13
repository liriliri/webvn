// Particle ui component

webvn.use(['ui', 'canvas'], function (s, ui, canvas) {

var particle = ui.create('particle', 'canvas'),
    $el = particle.$el;

$el.addClass('fill');

var emitter = new canvas.Emitter(particle.getCanvas());

particle.show = function () {

    canvas.renderer.add(emitter);
    $el.fadeIn();

};

particle.hide = function () {

    $el.fadeOut(function () {

        canvas.renderer.remove(emitter);

    });

};

// Set the predefined type
particle.type = function (name) {

    emitter.reConfigure(name);

};

});