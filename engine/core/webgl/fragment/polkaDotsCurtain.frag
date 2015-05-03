#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const float SQRT_2 = 1.414213562373;
const float dots = 20.0;
const vec2 center = vec2(1.0, 1.0);
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float x = progress /2.0;
    bool nextImage = distance(fract(p * dots), vec2(0.5, 0.5)) < (2.0 * x / distance(p, center));
    if(nextImage) gl_FragColor = texture2D(to, p);
    else gl_FragColor = texture2D(from, p);
}