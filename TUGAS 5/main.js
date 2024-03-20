const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}

const canvasWidth = 400;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(1.0, 1.0, 0.0, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);

const squareSize = 0.2;
const squareX = 0; // Kotak di tengah horizontal
let squareY = 0; // Kotak di tengah vertikal
let jumpVelocity = 0;
const jumpStrength = 0.02;
const gravity = 0.001;
let isJumping = false;

const square = [
  squareX - squareSize, squareY - squareSize, // Kiri bawah
  squareX + squareSize, squareY - squareSize, // Kanan bawah
  squareX + squareSize, squareY + squareSize, // Kanan atas
  squareX - squareSize, squareY + squareSize  // Kiri atas
];

const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;  
  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(square), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

function animate() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (isJumping) {
    squareY += jumpVelocity;
    jumpVelocity -= gravity;
    
    if (squareY <= 0) {
      squareY = 0;
      jumpVelocity = 0;
      isJumping = false;
    }
  }

  const animatedSquare = [
    squareX - squareSize, squareY - squareSize,
    squareX + squareSize, squareY - squareSize,
    squareX + squareSize, squareY + squareSize,
    squareX - squareSize, squareY + squareSize
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(animatedSquare), gl.STATIC_DRAW);

  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

  requestAnimationFrame(animate);
}

animate();

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowUp' && !isJumping) {
    isJumping = true;
    jumpVelocity = jumpStrength;
  }
});
