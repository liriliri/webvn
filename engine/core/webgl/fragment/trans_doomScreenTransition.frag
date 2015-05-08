#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
float rand(int num) {
    return fract(mod(float(num) * 67123.313, 12.0) * sin(float(num) * 10.3) * cos(float(num)));
}
float wave(int num) {
    float fn = float(num) * 1.0 * 0.1 * float(10.0);
    return cos(fn * 0.5) * cos(fn * 0.13) * sin((fn+10.0) * 0.3) / 2.0 + 0.5;
}
float pos(int num) {
    return wave(num);
}
void main() {
    int bar = int(gl_FragCoord.x) / 10;
    float scale = 1.0 + pos(bar) * 2.0;
    float phase = progress * scale;
    float posY = gl_FragCoord.y / resolution.y;
    vec2 p;
    vec4 c;
    if (phase + posY < 1.0) {
        p = vec2(gl_FragCoord.x, gl_FragCoord.y + mix(0.0, resolution.y, phase)) / resolution.xy;
        c = texture2D(from, p);
    } else {
        p = gl_FragCoord.xy / resolution.xy;
        c = texture2D(to, p);
    }
    gl_FragColor = c;
}