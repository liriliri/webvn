#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

void main() {
  vec2 p = gl_FragCoord.xy / resolution.xy;
  vec2 q = p;
  p.x = (p.x - 0.5)/abs(progress - 0.5)*0.5 + 0.5;
  vec4 a = texture2D(from, p);
  vec4 b = texture2D(to, p);
  gl_FragColor = vec4(mix(a, b, step(0.5, progress)).rgb * step(abs(q.x - 0.5), abs(progress - 0.5)), 1.0);
}