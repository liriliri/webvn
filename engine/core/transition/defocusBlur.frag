#ifdef GL_ES
precision highp float;
#endif
uniform float progress;
uniform vec2 resolution;
uniform sampler2D from;
uniform sampler2D to;
void main(void) {
    vec2 p = gl_FragCoord.xy / resolution.xy;
    float T = progress;
    float S0 = 1.0;
    float S1 = 50.0;
    float S2 = 1.0;
    float Half = 0.5;
    float PixelSize = ( T < Half ) ? mix( S0, S1, T / Half ) : mix( S1, S2, (T-Half) / Half );
    vec2 D = PixelSize / resolution.xy;
    vec2 UV = (gl_FragCoord.xy / resolution.xy);
    const int NumTaps = 12;
    vec2 Disk[NumTaps];
    Disk[0] = vec2(-.326,-.406);
    Disk[1] = vec2(-.840,-.074);
    Disk[2] = vec2(-.696, .457);
    Disk[3] = vec2(-.203, .621);
    Disk[4] = vec2( .962,-.195);
    Disk[5] = vec2( .473,-.480);
    Disk[6] = vec2( .519, .767);
    Disk[7] = vec2( .185,-.893);
    Disk[8] = vec2( .507, .064);
    Disk[9] = vec2( .896, .412);
    Disk[10] = vec2(-.322,-.933);
    Disk[11] = vec2(-.792,-.598);
    vec4 C0 = texture2D( from, UV );
    vec4 C1 = texture2D( to, UV );
    for ( int i = 0; i != NumTaps; i++ )
    {
        C0 += texture2D( from, Disk[i] * D + UV );
        C1 += texture2D( to, Disk[i] * D + UV );
    }
    C0 /= float(NumTaps+1);
    C1 /= float(NumTaps+1);
    gl_FragColor = mix( C0, C1, T );
}