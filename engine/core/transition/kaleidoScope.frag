#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 q = p;
    float t = pow(progress, 2.0)*1.0;
    p = p -0.5;
    for (int i = 0; i < 7; i++) {
        p = vec2(sin(t)*p.x + cos(t)*p.y, sin(t)*p.y - cos(t)*p.x);
        t += 2.0;
        p = abs(mod(p, 2.0) - 1.0);
    }
    abs(mod(p, 1.0));
    gl_FragColor = mix(
        mix(texture2D(from, q), texture2D(to, q), progress),
        mix(texture2D(from, p), texture2D(to, p), progress), 1.0 - 2.0*abs(progress - 0.5));
}