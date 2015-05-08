#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

void main() {
  vec2 p = gl_FragCoord.xy / resolution.xy;
  vec4 a = texture2D(from, (p - vec2(progress, 0.0)) / vec2(1.0-progress, 1.0));
  vec4 b = texture2D(to, p / vec2(progress, 1.0));
  gl_FragColor = mix(a, b, step(p.x, progress));
}