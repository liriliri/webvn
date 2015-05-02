#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;
const float grayPhase = 0.3;
vec3 grayscale (vec3 color) {
    return vec3(0.2126*color.r + 0.7152*color.g + 0.0722*color.b);
}
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec4 fc = texture2D(from, p);
    vec4 tc = texture2D(to, p);
    gl_FragColor = mix(
        mix(vec4(grayscale(fc.rgb), 1.0), texture2D(from, p), smoothstep(1.0-grayPhase, 0.0, progress)),
        mix(vec4(grayscale(tc.rgb), 1.0), texture2D(to,   p), smoothstep(    grayPhase, 1.0, progress)),
        progress);
    gl_FragColor.a = mix(fc.a, tc.a, progress);
}