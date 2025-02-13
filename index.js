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
let currentTexture;
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
let texturaPaquito, texturaCato;
let modeladopaco_sg, modeladopaco_g;
let modeladoCATO_sg, modeladoCATO_g;

// Variables para el efecto de estiramiento
let isStretched = false; // Indica si los modelos están estirados
let stretchStartTime = 0; // Tiempo en que comenzó el estiramiento
const stretchDuration = 1000; // Duración del estiramiento en milisegundos
const stretchScale = 2.5; // Factor de escala para el estiramiento

function preload() {
    // Cargar texturas
    texturaPaquito = loadImage("PACOSI/COMBINEDUV.png");
    texturaCato = loadImage("PACOSI/COMBINEDCATRIEL.png");

    // Cargar modelos
    modeladopaco_sg = loadModel("PACOSI/pacoinflao2.obj", true);
    modeladopaco_g = loadModel("PACOSI/pacoinflao2.obj", true);
    modeladoCATO_sg = loadModel("PACOSI/CATO.obj", true);
    modeladoCATO_g = loadModel("PACOSI/CATO.obj", true);

    currentTexture = texturaPaquito; // Textura inicial
}

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight, WEBGL);

    // Inicializar velocidades de flotación aleatorias
    floatSpeedPaquito = random(0.01, 0.03);
    floatSpeedCato = random(0.01, 0.03);
}

function draw() {
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

    ambientLight(255, 255, 255);

    // Mostrar Paquito
    if (showPaquito) {
        mostrarPaco();
    }
    if (showPaco) {
        mostrarPacog();
    }

    // Mostrar Cato
    if (showCato) {
        mostrarCato();
    }

    // Verificar colisión y aplicar efecto de estiramiento
    if (checkCollision()) {
        if (!isStretched) {
            isStretched = true;
            stretchStartTime = millis(); // Registrar el tiempo de inicio del estiramiento
        }
    } else {
        if (isStretched && millis() - stretchStartTime > stretchDuration) {
            isStretched = false; // Restaurar la escala original después de la duración del estiramiento
        }
    }

    orbitControl();
}

function mostrarPaco() {
    texture(currentTexture);
    push();
    noStroke();

    // Efecto de flotación suave y aleatorio para Paquito
    floatOffsetXPaquito = 100 * sin(frameCount * floatSpeedPaquito); // Movimiento horizontal
    floatOffsetYPaquito = 50 * cos(frameCount * floatSpeedPaquito * 1.5); // Movimiento vertical

    translate(floatOffsetXPaquito, floatOffsetYPaquito, -100); // Aplica el desplazamiento de flotación
    rotateZ(180);
    rotateY(-angle); 
    rotateX(-angle);
    translate(-20, 10, 300);

    // Aplicar efecto de estiramiento si hay colisión
    if (isStretched) {
        scale(100, stretchScale, -21); // Estirar en el eje Y
    }

    model(modeladopaco_sg);
    pop();

    angle += 0.1; // Rotación lenta (opcional)
}

function mostrarCato() {
    texture(texturaCato); // Usar la textura de Cato
    push();
    noStroke();

    // Efecto de flotación suave y aleatorio para Cato
    floatOffsetXCato = 100 * sin(frameCount * floatSpeedCato * 1.2); // Movimiento horizontal
    floatOffsetYCato = 50 * cos(frameCount * floatSpeedCato * 1.8); // Movimiento vertical

    translate(floatOffsetXCato + 200, floatOffsetYCato - 100, -100); // Aplica el desplazamiento de flotación
    rotateZ(180);
    rotateY(angle); 
    rotateX(angle);
    translate(10, 109, 100);

    // Aplicar efecto de estiramiento si hay colisión
    if (isStretched) {
        scale(100, stretchScale, -21); // Estirar en el eje Y
    }

    model(modeladoCATO_sg);
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

function changeTexture(newTexture) {
    currentTexture = newTexture;
}

function tomarCaptura() {
    saveGif('mySketch', 3 , { delay: 1 });
    enlaceDescarga.download = 'mi_souvenir.GIF'; // 
    enlaceDescarga.click();
}