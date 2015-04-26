#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;
void main(void)
{
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float T = progress;
    float S0 = 1.0;
    float S1 = 50.0;
    float S2 = 1.0;
    float Half = 0.5;
    float PixelSize = ( T < Half ) ? mix( S0, S1, T / Half ) : mix( S1, S2, (T-Half) / Half );
    vec2 D = PixelSize / resolution.xy;
    vec2 UV = ( p + vec2( -0.5 ) ) / D;
    vec2 Coord = clamp( D * ( ceil( UV + vec2( -0.5 ) ) ) + vec2( 0.5 ), vec2( 0.0 ), vec2( 1.0 ) );
    vec4 C0 = texture2D( from, Coord );
    vec4 C1 = texture2D( to, Coord );
    gl_FragColor = mix( C0, C1, T );
}