#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

float Rand(vec2 v) {
  return fract(sin(dot(v.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float Gaussian(float p, float center, float c) {
  return 0.75 * exp(- pow((p - center) / c, 2.));
}

void main() {
  vec2 p = gl_FragCoord.xy / resolution.xy;
  float c = cos(Gaussian(progress * (1. + Gaussian(progress * Rand(p), 0.5, 0.5)), 0.5, 0.25));
  vec2 d = p * c;
  
  gl_FragColor = mix(texture2D(from, d), texture2D(to, d), progress);
}