precision mediump float;
attribute vec2 a_Position;
attribute vec2 a_Uv;
varying vec2 v_Uv;
void main() {
    v_Uv = a_Uv;
    gl_Position = vec4(a_Position.x, -a_Position.y, 0.0, 1.0);
}