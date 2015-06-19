#ifdef GL_ES
    precision mediump float;
#endif

uniform sampler2D u_Sampler;
uniform float u_Alpha;
varying vec2 v_TexCoord;

void main() {
    vec4 textureColor = texture2D(u_Sampler, v_TexCoord);
    gl_FragColor = vec4(textureColor.rgb, textureColor.a * u_Alpha);
}