#ifdef GL_ES
precision mediump float;
#endif
#define DEG2RAD 0.03926990816987241548078304229099
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
void main() {
    float phase = progress < 0.5 ? progress * 2.0 : (progress - 0.5) * 2.0;
    float angleOffset = progress < 0.5 ? mix(0.0, 6.0 * DEG2RAD, phase) : mix(-6.0 * DEG2RAD, 0.0, phase);
    float newScale = progress < 0.5 ? mix(1.0, 1.2, phase) : mix(1.2, 1.0, phase);
    vec2 center = vec2(0, 0);
    float maxRes = max(resolution.x, resolution.y);
    float resX = resolution.x / maxRes * 0.5;
    float resY = resolution.y / maxRes * 0.5;
    vec2 p = (gl_FragCoord.xy / maxRes - vec2(resX, resY)) / newScale;
    float angle = atan(p.y, p.x) + angleOffset;
    float dist = distance(center, p);
    p.x = cos(angle) * dist + resX;
    p.y = sin(angle) * dist + resY;
    vec4 c = progress < 0.5 ? texture2D(from, p) : texture2D(to, p);
    gl_FragColor = c + (progress < 0.5 ? mix(0.0, 1.0, phase) : mix(1.0, 0.0, phase));
}