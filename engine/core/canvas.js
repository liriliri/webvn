// Module canvas

webvn.add('canvas', ['class', 'loader', 'log', 'config', 'util', 'webgl', 'tween'],
    function (s, kclass, loader, log, config, util, webgl, tween) {

var conf = config.create('core-canvas');
conf.set(config.global.canvas, false);

var canvas = {};

canvas.Entity = kclass.create({
    constructor: function () {

        this.parent = null;
        this.order = null;

        this.x = 0;
        this.y = 0;
        this.alpha = 1;
        this.visible = false;

    },
    fadeIn: function (duration) {

        if (!this.visible) {
            this.visible = true;
        }

        tween.create(this).to({
            alpha: 1
        }, duration);

    },
    fadeOut: function (duration) {

        tween.create(this).to({
            alpha: 0
        }, duration).call(function () {

            this.visible = false;

        });

    },
    set: function (key, value) {

        var self = this;

        if (util.isObject(key)) {
            attrs = key;
        } else {
            (attrs = {})[key] = value;
        }

        util.each(attrs, function (value, key) {

            if (self[key]) {
                self[key] = value;
            }

        });

    },
    destroy: function () {

        if (this.parent) {
            this.parent.remove(this.order);
            this.parent = null;
            this.order = null;
        }

    },
    renderWrapper: function (caller) {

        var self = this,
            gl = caller.gl,
            view = caller.view

        if (!self.visible) {
            return;
        }

        self.render(gl, view);

    }
});

canvas.ImageEntity = canvas.Entity.extend({
    constructor: function ImageEntity() {

        this.callSuper();

        var self = this;

        self.image = null;
        self.isLoaded = false;
        self.width = 0;
        self.height = 0;
        // If process is not 1, it means transition executed
        self.progress = 1;

    },
    load: function (source, duration) {

        var self = this;

        loader.image(source).then(function (image) {

            if (!self.image) {
                self.onLoad(image);
            }

            self.image2 = image;
            self.progress = 0;
            tween.create(self).to({
                progress: 1
            }, duration).call(function () {

                self.image = self.image2;

            });

        });

    },
    onLoad: function (image) {

        var self = this;

        self.isLoaded = true;
        self.image = image;
        self.width = self.image.width;
        self.height = self.image.height;

        self.visible = true;
        self.alpha = 0;
        self.fadeIn();

    },
    isTransition: function () {

        return this.progress !== 1;

    },
    render: function (gl) {

        var self = this;

        gl.save();
        gl.alpha = this.alpha;

        if (self.isLoaded && self.parent) {
            // Buffer image1
            if (self.isTransition()) {
                gl.startBuffer(0);
            }
            gl.drawImage(self.image, self.x, self.y);
            // Buffer image2
            if (self.isTransition()) {
                gl.endBuffer(0);
                gl.startBuffer(1);
                gl.drawImage(self.image2, self.x, self.y);
                gl.endBuffer(1);
                gl.drawTransition(gl.getBuffer(0), gl.getBuffer(1), 'circleOpen', self.progress);
            }
        }

        gl.restore();

    }
});

canvas.Scene = kclass.create({
    // v is the canvas element
    constructor: function Scene(v) {

        this.view = v;
        this.order = null;
        this.filterData = {
            name: false,
            param: null
        };
        this.filter = new webgl.Filter(this.view);
        this.gl = webgl.create(this.view, '2d');
        this.width = this.view.width;
        this.height = this.view.height;
        this.children = [];
        this.filterEnabled = false;

    },
    add: function (entity) {

        entity.order = this.children.length;
        entity.parent = this;
        this.children.push(entity);

    },
    clear: function () {

        this.gl.clear();

    },
    remove: function (order) {

        this.children.splice(order, 1);

    },
    filter: function (name, param) {

        this.filterData.name = name;
        if (param) {
            this.filterData.param = param;
        } else {
            this.filterData.param = null;
        }

    },
    render: function () {

        // Remove every thing first
        this.clear();

        if (this.filterEnabled) {
            this.filter.start();
        }

        var children = this.children;
        for (var i = 0, len = children.length; i < len; i++) {
            var child = this.children[i];
            child.renderWrapper(this);
        }

        if (this.filterEnabled) {
            this.filter.end();
        }

    }
});

/* Particle system
 * Use canvas 2d api since it is easier to implement
 * Same logic level as Scene class
 */
canvas.Emitter = kclass.create({
    constructor: function (v, config) {

        this.view = v;
        this.context = v.getContext('2d');
        this.width = v.width;
        this.height = v.height;
        this.bufferCache = {};
        this.reConfigure(config);

    },
    addParticle: function () {

        if (this.isFull()) {
            return false;
        }

        var p = this.particlePool[this.particleCount];
        this.initParticle(p);
        this.particleCount++;

        return true;

    },
    getBuffer: function (texture) {

        var size = '' + texture.width + 'x' + texture.height;

        var canvas = this.bufferCache[size];

        if(!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = texture.width;
            canvas.height = texture.height;
            this.bufferCache[size] = canvas;
        }

        return canvas;

    },
    getPredefined: function (name) {

        var ret = canvas.Emitter.predefined[name],
            x, y,
            w = this.width,
            h = this.height;

        if (util.isString(ret.pos)) {
            switch (ret.pos) {
                case 'center':
                    x = w / 2;
                    y = h / 2;
                    break;
                case 'centerAboveTop':
                    x = w / 2;
                    y = 0;
                    break;
                case 'centerBottom':
                    x = w / 2;
                    y = h * 2 / 3;
                    break;
                case 'centerOffBottom':
                    x = w / 2;
                    y = h + 20;
                    break;
                case 'bottomLeft':
                    x = 0;
                    y = h + 5;
                    break;
            }
            ret.pos = {
                x: x,
                y: y
            };
        }

        if (ret.textureEnabled) {
            var src = ret.texture;
            ret.texture = new Image();
            ret.texture.src = src;
        }

        return ret;

    },
    initParticle: function (particle) {

        particle.texture = this.texture;
        particle.textureEnabled = this.textureEnabled;
        particle.textureAdditive = this.textureAdditive;

        var posVar = {
            x: this.posVar.x * random11(),
            y: this.posVar.y * random11()
        };

        particle.pos.x = this.pos.x + posVar.x;
        particle.pos.y = this.pos.y + posVar.y;

        var angle = this.angle + this.angleVar * random11();
        var speed = this.speed + this.speedVar * random11();

        particle.setVelocity(angle, speed);

        particle.radialAccel = this.radialAccel + this.radialAccelVar * random11() || 0;
        particle.tangentialAccel = this.tangentialAccel + this.tangentialAccelVar * random11() || 0;

        var life = this.life + this.lifeVar * random11() || 0;
        particle.life = Math.max(0, life);

        particle.scale = util.isNumber(this.startScale) ? this.startScale: 1;
        particle.deltaScale = util.isNumber(this.endScale) ? (this.endScale - this.startScale) : 0;
        particle.deltaScale /= particle.life;

        particle.radius = util.isNumber(this.radius) ? this.radius + (this.radiusVar || 0) * random11() : 0;

        // color
        // note that colors are stored as arrays => [r,g,b,a],
        // this makes it easier to tweak the color every frame in _updateParticle
        // The renderer will take this array and turn it into a css rgba string
        if (this.startColor) {
            var startColor = [
            this.startColor[0] + this.startColorVar[0] * random11(), this.startColor[1] + this.startColorVar[1] * random11(), this.startColor[2] + this.startColorVar[2] * random11(), this.startColor[3] + this.startColorVar[3] * random11()];

            // if there is no endColor, then the particle will end up staying at startColor the whole time
            var endColor = startColor;
            if (this.endColor) {
                endColor = [
                this.endColor[0] + this.endColorVar[0] * random11(), this.endColor[1] + this.endColorVar[1] * random11(), this.endColor[2] + this.endColorVar[2] * random11(), this.endColor[3] + this.endColorVar[3] * random11()];
            }

            particle.color = startColor;
            particle.deltaColor = [(endColor[0] - startColor[0]) / particle.life, (endColor[1] - startColor[1]) / particle.life, (endColor[2] - startColor[2]) / particle.life, (endColor[3] - startColor[3]) / particle.life];
        }

    },
    isFull: function () {

        return this.particleCount === this.totalParticles;

    },
    play: function () {

        this.reset();

    },
    // 重置数据
    reConfigure: function (config) {

        if (util.isString(config)) {
            config = this.getPredefined(config);
        }

        if (!config) {
            config = this.getPredefined('glaxy');
        }

        this.totalParticles = 0;
        this.emissionRate = 0;
        this.active = false;
        this.duration = 0;

        this.pos = this.pos || {};
        this.pos.x = 0;
        this.pos.y = 0;
        this.posVar = this.posVar || {};
        this.posVar.x = 0;
        this.posVar.y = 0;

        this.speed = 0;
        this.speedVar = 0;

        this.angle = 0;
        this.angleVar = 0;

        this.life = 0;
        this.lifeVar = 0;

        this.radius = 0;
        this.radiusVar = 0;

        this.texture = null;
        this.textureEnabled = false;
        this.textureAdditive = false;

        this.startScale = 0;
        this.startScaleVar = 0;
        this.endScale = 0;
        this.endScaleVar = 0;

        this.startColor = this.startColor || [];
        this.startColor[0] = 0;
        this.startColor[1] = 0;
        this.startColor[2] = 0;
        this.startColor[3] = 0;

        this.startColorVar = this.startColorVar || [];
        this.startColorVar[0] = 0;
        this.startColorVar[1] = 0;
        this.startColorVar[2] = 0;
        this.startColorVar[3] = 0;

        this.endColor = this.endColor || [];
        this.endColor[0] = 0;
        this.endColor[1] = 0;
        this.endColor[2] = 0;
        this.endColor[3] = 0;

        this.endColorVar = this.endColorVar || [];
        this.endColorVar[0] = 0;
        this.endColorVar[1] = 0;
        this.endColorVar[2] = 0;
        this.endColorVar[3] = 0;

        this.gravity = this.gravity || {};
        this.gravity.x = 0;
        this.gravity.y = 0;

        this.radialAccel = 0;
        this.radialAccelVar = 0;
        this.tangentialAccel = 0;
        this.tangentialAccelVar = 0;

        util.mix(this, config);

        this.restart();

    },
    restart: function () {

        this.particlePool = [];

        for (var i = 0; i < this.totalParticles; i++) {
            this.particlePool.push(new canvas.Emitter.Particle);
        }

        this.particleCount = 0;
        this.particleIndex = 0;
        this.elapsed = 0;
        this.emitCounter = 0;

    },
    render: function (timestamp) {

        // Update particles
        var delta = timestamp - (this.lastTimestamp || timestamp);
        this.lastTimestamp = timestamp;
        delta /= 1000;
        this.update(delta);

        // Draw particles
        var particles = this.particlePool;

        this.context.clearRect(0, 0, this.width, this.height);

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];
            if (p.life > 0 && p.color) {
                if(p.textureAdditive) {
                    this.context.globalCompositeOperation = 'lighter';
                } else {
                    this.context.globalCompositeOperation = 'source-over';
                }
                if(!p.texture || !p.textureEnabled) {
                    this.renderParticle(p);
                } else {
                    this.renderParticleTexture(p);
                }
            }
        }

    },
    renderParticle: function (particle) {

        var context = this.context;
            color = colorArrayToString(particle.color);

        context.fillStyle = color;
        context.beginPath();
        context.arc(particle.pos.x, particle.pos.y, particle.radius * particle.scale, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

    },
    renderParticleTexture: function (particle) {

        particle.buffer = particle.buffer || this.getBuffer(particle.texture);

        var bufferContext = particle.buffer.getContext('2d');

        // figure out what size to draw the texture at, based on the particle's
        // current scale
        var w = (particle.texture.width * particle.scale) | 0;
        var h = (particle.texture.height * particle.scale) | 0;

        // figure out the x and y locations to render at, to center the texture in the buffer
        var x = particle.pos.x - w / 2;
        var y = particle.pos.y - h / 2;

        bufferContext.clearRect(0, 0, particle.buffer.width, particle.buffer.height);
        bufferContext.globalAlpha = particle.color[3];
        bufferContext.drawImage(particle.texture, 0, 0);

        // now use source-atop to "tint" the white texture, here we want the particle's pure color,
        // not including alpha. As we already used the particle's alpha to render the texture above
        bufferContext.globalCompositeOperation = "source-atop";
        bufferContext.fillStyle = colorArrayToString(particle.color, 1);
        bufferContext.fillRect(0, 0, particle.buffer.width, particle.buffer.height);

        // reset the buffer's context for the next time we draw the particle
        bufferContext.globalCompositeOperation = "source-over";
        bufferContext.globalAlpha = 1;

        // finally, take the rendered and tinted texture and draw it into the main canvas, at the
        // particle's location
        this.context.drawImage(particle.buffer, 0, 0, particle.buffer.width, particle.buffer.height, x, y, w, h);
    
    },
    update: function (delta) {

        this.elapsed += delta;
        this.active = this.elapsed < this.duration;

        if (!this.active) {
            return;
        }

        if (this.emissionRate) {
            var rate = 1.0 / this.emissionRate;
            this.emitCounter += delta;
            while (!this.isFull() && this.emitCounter > rate) {
                this.addParticle();
                this.emitCounter -= rate;
            }
        }

        this.particleIndex = 0;

        while (this.particleIndex < this.particleCount) {
            var p = this.particlePool[this.particleIndex];
            this.updateParticle(p, delta, this.particleIndex);
        }

    },
    updateParticle: function (p, delta, i) {

        if (p.life > 0) {
            p.forces = p.forces || {
                x: 0,
                y: 0
            };
            p.forces.x = 0;
            p.forces.y = 0;

            p.radial = p.radial || {
                x: 0,
                y: 0
            };
            p.radial.x = 0;
            p.radial.y = 0;

            if ((p.pos.x !== this.pos.x || p.pos.y !== this.pos.y) && (p.radialAccel || p.tangentialAccel)) {
                p.radial.x = p.pos.x - this.pos.x;
                p.radial.y = p.pos.y - this.pos.y;
                normalize(p.radial);
            }

            p.tangential = p.tangential || {
                x: 0,
                y: 0
            };
            p.tangential.x = p.radial.x;
            p.tangential.y = p.radial.y;

            p.radial.x *= p.radialAccel;
            p.radial.y *= p.radialAccel;

            var newy = p.tangential.x;
            p.tangential.x = - p.tangential.y;
            p.tangential.y = newy;

            p.tangential.x *= p.tangentialAccel;
            p.tangential.y *= p.tangentialAccel;

            p.forces.x = p.radial.x + p.tangential.x + this.gravity.x;
            p.forces.y = p.radial.y + p.tangential.y + this.gravity.y;

            p.forces.x *= delta;
            p.forces.y *= delta;

            p.vel.x += p.forces.x;
            p.vel.y += p.forces.y;

            p.pos.x += p.vel.x * delta;
            p.pos.y += p.vel.y * delta;

            p.life -= delta;

            p.scale += p.deltaScale * delta;

            if (p.color) {
                p.color[0] += p.deltaColor[0] * delta;
                p.color[1] += p.deltaColor[1] * delta;
                p.color[2] += p.deltaColor[2] * delta;
                p.color[3] += p.deltaColor[3] * delta;
            }

            this.particleIndex++;
        } else {
            var temp = this.particlePool[i];
            this.particlePool[i] = this.particlePool[this.particleCount - 1];
            this.particlePool[this.particleCount - 1] = temp;
            this.particleCount--;
        }

    }
}, {
    Particle: kclass.create({
        constructor: function Particle() {

            this.pos = {
                x: 0,
                y: 0
            };

            this.setVelocity(0, 0);
            this.life = 0;

        },
        setVelocity: function (angle, speed) {

            this.vel = {
                x: Math.cos(toRad(angle)) * speed,
                y: -Math.sin(toRad(angle)) * speed
            };

        }
    }),
    predefined: {
        'glaxy': {
            totalParticles: 200,
            emissionRate: 50,
            pos: 'center',
            angle: 90,
            angleVar: 360,
            speed: 60,
            speedVar: 10,
            life: 4,
            lifeVar: 1,
            radialAccel: - 80,
            radialAccelVar: 0,
            tangentialAccel: 80,
            tangentialAccelVar: 0,
            texture: '/engine/img/particle.png',
            textureEnabled: true,
            textureAdditive: true,
            radius: 10,
            radiusVar: 2,
            startScale: 1,
            endScale: 1,
            startColor: [30.6, 63.75, 193.8, 1],
            endColor: [0, 0, 0, 0],
            active: true,
            duration: Infinity
        },
        'smoke': {
            totalParticles: 50,
            emissionRate: 100,
            pos: 'centerOffBottom',
            posVar: {
                x: 640,
                y: 200
            },
            angle: 90,
            angleVar: 60,
            speed: 60,
            speedVar: 10,
            life: 5,
            lifeVar: 2,
            radialAccel: 0,
            radialAccelVar: 0,
            tangentialAccel: 0,
            tangentialAccelVar: 0,
            texture: '/engine/img/smoke.png',
            textureEnabled: true,
            textureAdditive: false,
            radius: 5,
            radiusVar: 2,
            startScale: 1,
            endScale: 1,
            gravity: {
                x: 0,
                y: -50
            },
            startColor: [255, 255, 255, 1],
            endColor: [255, 255, 255, 0.4],
            active: true,
            duration: Infinity
        },
        'bubble': {
            totalParticles: 200,
            emissionRate: 8,
            active: true,
            duration: Infinity,
            pos: 'centerOffBottom',
            posVar: {
                x: 640,
                y: 0
            },
            angle: 90,
            angleVar: 20,
            life: 12,
            lifeVar: 1,
            radius: 20,
            radiusVar: 8,
            textureEnabled: false,
            textureAdditive: false,
            startScale: 1,
            startScaleVar: 0,
            endScale: 1,
            endScaleVar: 0,
            startColor: [255, 255, 255, 1],
            endColor: [25.5, 25.5, 25.5, 0],
            gravity: {
                x: 0,
                y: -30
            },
            radialAccel: 0,
            radialAccelVar: 0,
            tangentialAccel: 0,
            tangentialAccelVar: 0,
            speed: 2,
            speedVar: 0
        },
        'fire': {
            totalParticles: 250,
            emissionRate: 30,
            pos: 'centerOffBottom',
            posVar: {
                x: 40,
                y: 20
            },
            angle: 90,
            angleVar: 10,
            speed: 60,
            speedVar: 20,
            life: 8,
            lifeVar: 4,
            radialAccel: 0,
            radialAccelVar: 0,
            tangentialAccel: 0,
            tangentialAccelVar: 0,
            texture: '/engine/img/particle.png',
            textureEnabled: true,
            textureAdditive: true,
            radius: 10,
            radiusVar: 1,
            startScale: 1,
            endScale: 1,
            startColor: [193.8, 63.75, 30.6, 1],
            endColor: [0, 0, 0, 0],
            active: true,
            duration: Infinity
        },
        'rain': {
            totalParticles: 500,
            emissionRate: 100,
            active: true,
            duration: Infinity,
            pos: 'centerAboveTop',
            posVar: {
                x: 800,
                y: 0
            },
            angle: 260,
            angleVar: 0,
            life: 3,
            lifeVar: 1,
            radius: 2,
            radiusVar: 1,
            texture: '/engine/img/rain.png',
            textureEnabled: true,
            textureAdditive: true,
            startScale: 1,
            startScaleVar: 0,
            endScale: 1,
            endScaleVar: 0,
            startColor: [255, 255, 255, 0.9],
            startColorVar: [0, 0, 0, 0.1],
            endColor: [255, 255, 255, 0.4],
            endColorVar: [0, 0, 0, 0.2],
            gravity: {
                x: -5,
                y: 80
            },
            radialAccel: 0,
            radialAccelVar: 0,
            tangentialAccel: 0,
            tangentialAccelVar: 0,
            speed: 350,
            speedVar: 50
        },
        'snow': {
            totalParticles: 300,
            emissionRate: 8,
            pos: 'centerAboveTop',
            posVar: {
                x: 640,
                y: 0
            },
            gravity: {
                x: 0,
                y: 8
            },
            angle: -90,
            angleVar: 10,
            speed: 9,
            speedVar: 1,
            life: 45,
            lifeVar: 15,
            radialAccel: 0,
            radialAccelVar: 0,
            tangentialAccel: 0,
            tangentialAccelVar: 0,
            textureEnabled: false,
            textureAdditive: false,
            radius: 5,
            radiusVar: 2,
            startScale: 1,
            endScale: 0.3,
            startColor: [255, 255, 255, 0.8],
            startColorVar: [0, 0, 0, 0.2],
            endColor: [255, 255, 255, 0],
            active: true,
            duration: Infinity
        }
    }
});


// Renderer
var requestAnim = window.requestAnimationFrame;

canvas.renderer = {
    isPaused: true,
    interval: 20,
    scenes: [],
    add: function (scene) {

        scene.order = this.scenes.length;
        this.scenes.push(scene);

        return this;

    },
    remove: function (scene) {

        this.scenes.splice(scene.order, 1);

    },
    render: function (timestamp) {

        var scenes = this.scenes;

        if (this.isPaused) {
            return;
        }
        for (var i = 0, len = scenes.length; i < len; i++) {
            scenes[i].render(timestamp);
        }
        requestAnim(this.render.bind(this));

    },
    fps: function (fps) {

        this.interval = Math.floor(1000 / fps);

        return this;

    },
    start: function () {

        var self = this;

        if (!this.isPaused) {
            return;
        }
        this.isPaused = false;

        setTimeout(function () {

            requestAnim(self.render.bind(self));

        }, this.interval);

    },
    stop: function () {

        this.isPaused = true;

    }
};

canvas.renderer.fps(conf.get('fps')).
    start();

// Utils
function colorArrayToString(array, overrideAlpha) {

    var r = array[0] | 0;
    var g = array[1] | 0;
    var b = array[2] | 0;
    var a = overrideAlpha || array[3];

    return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

}

function isInteger(num) {

    return num === (num | 0);

}

/*
 * Given a vector of any length, returns a vector
 * pointing in the same direction but with a magnitude of 1
 */
function normalize(vector) {

    var length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    vector.x /= length;
    vector.y /= length;

}

function random(minOrMax, maxOrUndefined, dontFloor) {

    dontFloor = dontFloor || false;

    var min = util.isNumber(maxOrUndefined) ? minOrMax: 0;
    var max = util.isNumber(maxOrUndefined) ? maxOrUndefined: minOrMax;

    var range = max - min;

    var result = Math.random() * range + min;

    if (isInteger(min) && isInteger(max) && ! dontFloor) {
        return Math.floor(result);
    } else {
        return result;
    }

}

function random11() {

    return random(-1, 1, true);

}

function toRad(deg) {

    return Math.PI * deg / 180;

}

return canvas;

});