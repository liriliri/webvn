#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const ivec2 squares = ivec2(10.0, 10.0);
const vec2 direction = vec2(1.0, -0.5);
const float smoothness = 1.6;
const vec2 center = vec2(0.5, 0.5);
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 v = normalize(direction);
    if (v != vec2(0.0))
        v /= abs(v.x)+abs(v.y);
    float d = v.x * center.x + v.y * center.y;
    float offset = smoothness;
    float pr = smoothstep(-offset, 0.0, v.x * p.x + v.y * p.y - (d-0.5+progress*(1.+offset)));
    vec2 squarep = fract(p*vec2(squares));
    vec2 squaremin = vec2(pr/2.0);
    vec2 squaremax = vec2(1.0 - pr/2.0);
    float a = all(lessThan(squaremin, squarep)) && all(lessThan(squarep, squaremax)) ? 1.0 : 0.0;
    gl_FragColor = mix(texture2D(from, p), texture2D(to, p), a);
}