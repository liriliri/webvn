attribute vec2 a_Position;
uniform mat4 u_ModelMatrix;
varying vec2 v_TexCoord;
uniform vec2 u_Resolution;

void main() {
    // float w = 2.0 / u_Resolution.x;
    // float h = -2.0 / u_Resolution.y;
    mat4 ViewMatrix = mat4(
        0.0015625, 0, 0, 0,
        0, -0.002777777777777778, 0, 0,
        0, 0, 1.0, 1.0,
        -1.0, 1.0, 0, 0
    );

    gl_Position = ViewMatrix * u_ModelMatrix * vec4(a_Position, 1.0, 1.0);
    v_TexCoord = a_Position;
}