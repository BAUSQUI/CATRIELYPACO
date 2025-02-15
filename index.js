let modelado;
let ZeroRadious = 75;
let OneRadious = 150;
let pos;
let angle = 0; 
let orbitX, orbitY, orbitZ;
let currentState;
let showPaquito = true;
let showPaco = false;
let showCato = true;
let showBackground = true;
let isGlitched = false;
let isOrbiting = false;

// Variables de flotación para Paquito
let floatOffsetXPaquito = 0;
let floatOffsetYPaquito = 0;
let floatSpeedPaquito;

// Variables de flotación para Cato
let floatOffsetXCato = 0;
let floatOffsetYCato = 0;
let floatSpeedCato;

// Texturas y modelos
let texturaFront, texturaBack, texturaCatoFront, texturaCatoBack;
let modeladopacoFRONT, modeladopacoBACK;
let modeladoCATOFRONT, modeladoCATOBACK;

// Variables para el efecto de estiramiento
let isStretched = false; // Indica si los modelos están estirados
let stretchStartTime = 0; // Tiempo en que comenzó el estiramiento
const stretchDuration = 1000; // Duración del estiramiento en milisegundos
const stretchScale = 2.5; // Factor de escala para el estiramiento

function preload() {
    // Cargar texturas
    texturaFront = loadImage("PACOSI/UVFRONTP.png");
    texturaBack = loadImage("PACOSI/UVBACKP.png");
    texturaCatoFront = loadImage("PACOSI/UVCATOFRONT.png");
    texturaCatoBack = loadImage("PACOSI/UVCATOBACK.png");

    // Cargar modelos
    modeladopacoFRONT = loadModel("PACOSI/pacoinflaoFRONT.obj", true);
    modeladopacoBACK = loadModel("PACOSI/pacoinflaoBACK.obj", true);
    modeladoCATOFRONT = loadModel("PACOSI/CATOFRONT.obj", true);
    modeladoCATOBACK = loadModel("PACOSI/CATOBACK.obj", true);
}

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight, WEBGL);

    // Inicializar velocidades de flotación aleatorias
    floatSpeedPaquito = random(0.01, 0.03);
    floatSpeedCato = random(0.01, 0.03);
}

function draw() {

    ambientLight(255, 255, 255);
    // Verifica si el usuario está manipulando la cámara
    if (mouseIsPressed && (movedX !== 0 || movedY !== 0)) {
        isOrbiting = true;
    } else {
        isOrbiting = false;
    }

    // Si el usuario está manipulando la cámara, desactiva la limpieza del fondo
    if (isOrbiting) {
        showBackground = false; // Desactiva el fondo para que no se limpie
    } else {
        showBackground = true; // Reactiva el fondo si no se está manipulando
    }

    // Dibuja el fondo solo si showBackground es true
    if (showBackground) {
        background(0); // Fondo normal
    }



    // Mostrar Paquito (frente y atrás)
    if (showPaquito) {
        mostrarPaco();
    }
    if (showPaco) {
        mostrarPacog();
    }

    // Mostrar Cato (frente y atrás)
    if (showCato) {
        mostrarCato();
    }


    orbitControl();
}

function mostrarPaco() {
    // Mostrar la parte frontal de Paquito
    push();
    noStroke();
    texture(texturaFront); // Aplicar textura frontal

    // Efecto de flotación suave y aleatorio para Paquito
    floatOffsetXPaquito = 100 * sin(frameCount * floatSpeedPaquito); // Movimiento horizontal
    floatOffsetYPaquito = 50 * cos(frameCount * floatSpeedPaquito * 1.5); // Movimiento vertical

    translate(floatOffsetXPaquito, floatOffsetYPaquito, -100); // Aplica el desplazamiento de flotación
    rotateZ(180);
    rotateY(-angle); 
    rotateX(-angle);
    translate(-20, 10, 330);

    // Aplicar efecto de estiramiento si hay colisión
    if (isStretched) {
        scale(100, stretchScale, -21); // Estirar en el eje Y
    }

    model(modeladopacoFRONT); // Mostrar el modelo frontal
    pop();

    // Mostrar la parte trasera de Paquito
    push();
    noStroke();
    texture(texturaBack); // Aplicar textura trasera

    // Aplicar las mismas transformaciones que al frente
    translate(floatOffsetXPaquito, floatOffsetYPaquito, -100);
    rotateZ(-180);
    rotateY(-angle); 
    rotateX(-angle);
    translate(-20, 10, 300);

    // Aplicar efecto de estiramiento si hay colisión
    if (isStretched) {
        scale(100, stretchScale, -21); // Estirar en el eje Y
    }

    model(modeladopacoBACK); // Mostrar el modelo trasero
    pop();

    angle += 0.1; // Rotación lenta (opcional)
}

function mostrarCato() {
    // Mostrar la parte frontal de Cato
    push();
    noStroke();
    texture(texturaCatoFront); // Aplicar textura frontal

    // Efecto de flotación suave y aleatorio para Cato
    floatOffsetXCato = 100 * sin(frameCount * floatSpeedCato * 1.2); // Movimiento horizontal
    floatOffsetYCato = 50 * cos(frameCount * floatSpeedCato * 1.8); // Movimiento vertical

    translate(floatOffsetXCato + 200, floatOffsetYCato - 100, -100); // Aplica el desplazamiento de flotación
    rotateZ(180);
    rotateY(angle); 
    rotateX(angle);
    translate(10, 109, 136);

    // Aplicar efecto de estiramiento si hay colisión
    if (isStretched) {
        scale(100, stretchScale, -21); // Estirar en el eje Y
    }

    model(modeladoCATOFRONT); // Mostrar el modelo frontal
    pop();

    // Mostrar la parte trasera de Cato
    push();
    noStroke();
    texture(texturaCatoBack); // Aplicar textura trasera

    // Aplicar las mismas transformaciones que al frente
    translate(floatOffsetXCato + 200, floatOffsetYCato - 100, -100);
    rotateZ(180);
    rotateY(angle); 
    rotateX(angle);
    translate(10, 109, 100);

    // Aplicar efecto de estiramiento si hay colisión
    if (isStretched) {
        scale(100, stretchScale, -21); // Estirar en el eje Y
    }

    model(modeladoCATOBACK); // Mostrar el modelo trasero
    pop();

    angle += 0.1; // Rotación lenta (opcional)
}

function checkCollision() {
    // Calcular la distancia entre Paquito y Cato
    let distance = dist(
        floatOffsetXPaquito, floatOffsetYPaquito,
        floatOffsetXCato + 200, floatOffsetYCato - 100
    );

    // Definir un umbral de colisión (ajusta según el tamaño de los modelos)
    let collisionThreshold = 10;

    // Verificar si hay colisión
    return distance < collisionThreshold;
}

function toggleGlitchAndBackground() {
    toggleGlitch();      // Llama a la función para activar el glitch
    toggleBackground();  // Llama a la función para cambiar el fondo
}

function toggleFlower() {
    showPaquito = !showPaquito;
}

function toggleCato() {
    showCato = !showCato;
}

function toggleBackground() {
    showBackground = !showBackground;
}

function toggleGlitch() {
    isGlitched = !isGlitched;
    if (isGlitched) {
        console.log("Glitch activado");
    } else {
        console.log("Glitch desactivado");
    }
}

function tomarCaptura() {
    saveGif('mySketch', 3 , { delay: 1 });
    enlaceDescarga.download = 'mi_souvenir.GIF'; // 
    enlaceDescarga.click();
}
