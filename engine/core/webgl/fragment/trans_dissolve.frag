#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const float blocksize = 1.0;
float rand(vec2 co) {
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), step(rand(floor(gl_FragCoord.xy/blocksize)), progress));
}