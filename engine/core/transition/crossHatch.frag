#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;
const vec2 center = vec2(0.5, 0.5);
float quadraticInOut(float t) {
    float p = 2.0 * t * t;
    return t < 0.5 ? p : -p + (4.0 * t) - 1.0;
}
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    if (progress == 0.0) {
        gl_FragColor = texture2D(from, p);
    } else if (progress == 1.0) {
        gl_FragColor = texture2D(to, p);
    } else {
        float x = progress;
        float dist = distance(center, p);
        float r = x - min(rand(vec2(p.y, 0.0)), rand(vec2(0.0, p.x)));
        float m = dist <= r ? 1.0 : 0.0;
        gl_FragColor = mix(texture2D(from, p), texture2D(to, p), m);
    }
}