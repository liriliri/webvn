#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

void main() {
  
  vec2 p = gl_FragCoord.xy / resolution.xy;
  
  float circPos = atan(p.y - 0.5, p.x - 0.5) + progress;
  float modPos = mod(circPos, 3.1415 / 4.);
  float signed = sign(progress - modPos);
  float smoothed = smoothstep(0., 1., signed);
  
  if (smoothed > 0.5){
    gl_FragColor = texture2D(to, p);
  } else {
    gl_FragColor = texture2D(from, p);
  }
  
}
