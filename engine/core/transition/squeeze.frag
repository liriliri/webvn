#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from;
uniform sampler2D to;
uniform float progress;
uniform vec2 resolution;
const float colorSeparation = 0.02;
float progressY (float y) {
    return 0.5 + (y-0.5) / (1.0-progress);
}
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float y = progressY(p.y);
    if (y < 0.0 || y > 1.0) {
        gl_FragColor = texture2D(to, p);
    }
    else {
        vec2 fp = vec2(p.x, y) + progress*vec2(0.0, colorSeparation);
        vec4 c = vec4(
            texture2D(from, fp).r,
            texture2D(from, fp).g,
            texture2D(from, fp).b,
            texture2D(from, fp).a
            );
        gl_FragColor = c;
        if (c.a == 0.0) {gl_FragColor = texture2D(to, p);}
    }
}