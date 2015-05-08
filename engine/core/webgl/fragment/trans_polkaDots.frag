#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
const float dots = 5.0;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float x = progress;
    bool nextImage = distance(fract(p * dots), vec2(0.5, 0.5)) < x;
    if(nextImage)
        gl_FragColor = texture2D(to, p);
    else
        gl_FragColor = texture2D(from, p);
}