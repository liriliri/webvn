#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const vec3 color = vec3(0.9, 0.4, 0.2);
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = mix(
        texture2D(from, p) + vec4(progress*color, 0.0),
        texture2D(to, p) + vec4((1.0-progress)*color, 0.0),
        progress);
}