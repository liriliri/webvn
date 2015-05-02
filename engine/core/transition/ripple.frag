#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;
const float amplitude = 100.0;
const float speed = 50.0;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 dir = p - vec2(.5);
    float dist = length(dir);
    vec2 offset = dir * (sin(progress * dist * amplitude - progress * speed) + .5) / 30.;
    gl_FragColor = mix(texture2D(from, p + offset), texture2D(to, p), smoothstep(0.2, 1.0, progress));
}