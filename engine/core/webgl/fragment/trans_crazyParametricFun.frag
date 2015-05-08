#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const float a = 4.0;
const float b = 1.0;
const float amplitude = 120.0;
const float smoothness = 0.1;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 dir = p - vec2(.5);
    float dist = length(dir);
    float x = (a - b) * cos(progress) + b * cos(progress * ((a / b) - 1.) );
    float y = (a - b) * sin(progress) - b * sin(progress * ((a / b) - 1.));
    vec2 offset = dir * vec2(sin(progress  * dist * amplitude * x), sin(progress * dist * amplitude * y)) / smoothness;
    gl_FragColor = mix(texture2D(from, p + offset), texture2D(to, p), smoothstep(0.2, 1.0, progress));
}