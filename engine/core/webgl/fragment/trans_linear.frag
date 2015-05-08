#ifdef GL_ES
  precision mediump float;
#endif

uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

void main() {
  vec2 p = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = mix(texture2D(from, p), texture2D(to, p), progress);
}