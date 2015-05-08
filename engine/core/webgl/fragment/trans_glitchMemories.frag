#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

void glitch_memories(sampler2D pic) {
  vec2 p = gl_FragCoord.xy / resolution.xy;
  vec2 block = floor(gl_FragCoord.xy / vec2(16));
  vec2 uv_noise = block / vec2(64);
  uv_noise += floor(vec2(progress) * vec2(1200.0, 3500.0)) / vec2(64);
  
  float block_thresh = pow(fract(progress * 1200.0), 2.0) * 0.2;
  float line_thresh = pow(fract(progress * 2200.0), 3.0) * 0.7;
  vec2 red = p, green = p, blue = p, o = p;
  vec2 dist = (fract(uv_noise) - 0.5) * 0.3;
  red += dist * 0.1;
  green += dist * 0.2;
  blue += dist * 0.125;
  
  gl_FragColor.r = texture2D(pic, red).r;
  gl_FragColor.g = texture2D(pic, green).g;
  gl_FragColor.b = texture2D(pic, blue).b;
  gl_FragColor.a = 1.0;

}

void main(void)
{
  float smoothed = smoothstep(0., 1., progress);
  if( ( smoothed < 0.4 && smoothed > 0.1) ) {
      glitch_memories(from);
  } else if ((smoothed > 0.6 && smoothed < 0.9) ) {
      glitch_memories(to);
  } else {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), progress);
  }
}