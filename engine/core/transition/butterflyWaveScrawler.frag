#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const float amplitude = 1.0;
const float waves = 30.0;
const float colorSeparation = 0.3;
float PI = 3.14159265358979323846264;
float compute(vec2 p, float progress, vec2 center) {
    vec2 o = p*sin(progress * amplitude)-center;
    vec2 h = vec2(1., 0.);
    float theta = acos(dot(o, h)) * waves;
    return (exp(cos(theta)) - 2.*cos(4.*theta) + pow(sin((2.*theta - PI) / 24.), 5.)) / 10.;
}
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float inv = 1. - progress;
    vec2 dir = p - vec2(.5);
    float dist = length(dir);
    float disp = compute(p, progress, vec2(0.5, 0.5)) ;
    vec4 texTo = texture2D(to, p + inv*disp);
    vec4 texFrom = vec4(
    texture2D(from, p + progress*disp*(1.0 - colorSeparation)).r,
    texture2D(from, p + progress*disp).g,
    texture2D(from, p + progress*disp*(1.0 + colorSeparation)).b,
    1.0);
    gl_FragColor = texTo*progress + texFrom*inv;
}