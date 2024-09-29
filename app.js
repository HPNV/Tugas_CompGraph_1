let gl, shaderProgram;

window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    let fsSource = getFragmentShaderSource(1.0, 0.0, 0.0);

    shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    drawScene();

    document.getElementById('redButton').addEventListener('click', () => changeColor(1.0, 0.0, 0.0));
    document.getElementById('greenButton').addEventListener('click', () => changeColor(0.0, 1.0, 0.0));
    document.getElementById('blueButton').addEventListener('click', () => changeColor(0.0, 0.0, 1.0));
    document.getElementById('resetButton').addEventListener('click', () => resetScene());
};

function drawScene() {
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
            0.7,  0.5,
        -0.7, -0.5,
            0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function changeColor(r, g, b) {
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    const fsSource = getFragmentShaderSource(r, g, b);
    shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    drawScene();
}

function getFragmentShaderSource(r, g, b) {
    return `
        void main() {
            gl_FragColor = vec4(${r}, ${g}, ${b}, 1.0);
        }
    `;
}

function resetScene() {
    changeColor(1.0, 0.0, 0.0);
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}