#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;
const float size = 0.04;
const float zoom = 30.0;
const float colorSeparation = 0.3;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float inv = 1. - progress;
    vec2 disp = size*vec2(cos(zoom*p.x), sin(zoom*p.y));
    vec4 texTo = texture2D(to, p + inv*disp);
    vec4 texFrom = vec4(
        texture2D(from, p + progress*disp*(1.0 - colorSeparation)).r,
        texture2D(from, p + progress*disp).g,
        texture2D(from, p + progress*disp*(1.0 + colorSeparation)).b,
        texture2D(from, p + progress*disp).a);
    gl_FragColor = texTo*progress + texFrom*inv;
}