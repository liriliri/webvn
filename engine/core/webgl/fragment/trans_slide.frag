#ifdef GL_ES
precision mediump float;
#endif
uniform sampler2D from, to;
uniform float progress;
uniform vec2 resolution;

float translateX = 1.0;
float translateY = 0.0;

void main() {
    vec2 texCoord = gl_FragCoord.xy / resolution.xy;
    float x = progress * translateX;
    float y = progress * translateY;

    if (x >= 0.0 && y >= 0.0) {
        if (texCoord.x >= x && texCoord.y >= y) {
            gl_FragColor = texture2D(from, texCoord - vec2(x, y));
        }
        else {
            vec2 uv;
            if (x > 0.0)
                uv = vec2(x - 1.0, y);
            else if (y > 0.0)
                uv = vec2(x, y - 1.0);
            gl_FragColor = texture2D(to, texCoord - uv);
        }
    }
    else if (x <= 0.0 && y <= 0.0) {
        if (texCoord.x <= (1.0 + x) && texCoord.y <= (1.0 + y))
            gl_FragColor = texture2D(from, texCoord - vec2(x, y));
        else {
            vec2 uv;
            if (x < 0.0)
                uv = vec2(x + 1.0, y);
            else if (y < 0.0)
                uv = vec2(x, y + 1.0);
            gl_FragColor = texture2D(to, texCoord - uv);
        }
    }
    else
        gl_FragColor = vec4(0.0);
}