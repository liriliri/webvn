#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}
void main() {
    float revProgress = (1.0 - progress);
    float distFromEdges = min(progress, revProgress);
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec4 fromColor = texture2D(from, p);
    vec4 toColor = texture2D(to, p);
    float squareSize = 20.0;
    float flickerSpeed = 60.0;
    vec2 seed = floor(gl_FragCoord.xy / squareSize) * floor(distFromEdges * flickerSpeed);
    gl_FragColor = mix(fromColor, toColor, progress) + rand(seed) * distFromEdges * 0.5;
}