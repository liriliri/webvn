#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.141592653589
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 rp = p*2.-1.;
    float a = atan(rp.y, rp.x);
    float pa = progress*PI*2.5-PI*1.25;
    vec4 fromc = texture2D(from, p);
    vec4 toc = texture2D(to, p);
    if(a>pa) {
        gl_FragColor = mix(toc, fromc, smoothstep(0., 1., (a-pa)));
    } else {
        gl_FragColor = toc;
    }
}