#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

uniform sampler2D lumaTex;
bool invertLuma = true;
float softness = 0.25;

void main() {
    vec2 p = gl_FragCoord.xy / resolution.xy;

    float luma = texture2D(lumaTex, p).x;
    if (invertLuma)
        luma = 1.0 - luma;
    vec4 fromColor = texture2D(from, p);
    vec4 toColor = texture2D(to, p);
    float time = mix(0.0, 1.0 + softness, progress);
    if (luma <= time - softness)
        gl_FragColor = toColor;
    else if (luma >= time)
        gl_FragColor = fromColor;
    else {
        float alpha = (time - luma) / softness;
        gl_FragColor = mix(fromColor, toColor, alpha);
    }
}