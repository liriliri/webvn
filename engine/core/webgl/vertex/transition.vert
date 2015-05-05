attribute vec2 a_Position;

void main() {
    gl_Position = vec4(2.0 * a_Position - 1.0, 0.0, 1.0);
}