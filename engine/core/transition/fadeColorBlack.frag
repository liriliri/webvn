#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;
const vec3 color = vec3(0.0, 0.0, 0.0);
const float colorPhase = 0.4;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = mix(
        mix(vec4(color, 1.0), texture2D(from, p), smoothstep(1.0-colorPhase, 0.0, progress)),
        mix(vec4(color, 1.0), texture2D(to,   p), smoothstep(    colorPhase, 1.0, progress)),
        progress);
    gl_FragColor.a = mix(texture2D(from, p).a, texture2D(to, p).a, progress);
}