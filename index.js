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

// Variable para el modelo seleccionado
let selectedModel = null; // 'Paquito', 'Cato' o null

let modeladopacoFRONT_inflado, modeladopacoBACK_inflado; // Modelos inflados
let isInflated = false; // Estado para controlar si el modelo está inflado o no

function preload() {
    // Cargar texturas
    texturaFront = loadImage("PACOSI/PACOUV.png");
    texturaBack = loadImage("PACOSI/PACOUVBACK.png");
    texturaCatoFront = loadImage("PACOSI/UVCATOFRONT.png");
    texturaCatoBack = loadImage("PACOSI/UVCATOBACK.png");

    // Cargar modelos
    modeladopacoFRONT = loadModel("PACOSI/paco_front2.obj", true);
    modeladopacoBACK = loadModel("PACOSI/paco_back2.obj", true);
    modeladoCATOFRONT = loadModel("PACOSI/CATRIEL_FRONT.obj", true);
    modeladoCATOBACK = loadModel("PACOSI/CATRIEL_BACK.obj", true);

    // modeladopacoFRONT_inflado = loadModel("PACOSI/pacoSUPERinflaoFront.obj", true);
    // modeladopacoBACK_inflado = loadModel("PACOSI/pacoSUPERinflaoBack.obj", true);
}

function setup() {
    angleMode(DEGREES);
    createCanvas(windowWidth, windowHeight, WEBGL);

    // Inicializar velocidades de flotación aleatorias
    floatSpeedPaquito = random(0.01, 0.03);
    floatSpeedCato = random(0.01, 0.03);
}

function draw() {
    //directionalLight(255, 255, 0, 0, -1, 0);
    
    ambientLight(255);

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
        background(218); // Fondo normal
    }

    if (showPaquito) {
        if (isInflated) {
            mostrarPacoInflado(); // Mostrar modelo inflado
        } else {
            mostrarPaco(); // Mostrar modelo normal
        }
    }

    // Mostrar Cato (frente y atrás)
    if (showCato) {
        mostrarCato();
    }

    // Aplicar orbitControl solo al modelo seleccionado
    if (selectedModel === 'Paquito') {
        orbitControl(); // Control para Paquito
    } else if (selectedModel === 'Cato') {
        orbitControl(); // Control para Cato
    }
}

function toggleInflate() {
    isInflated = !isInflated; // Cambiar el estado
    console.log(isInflated ? "Paco inflado" : "Paco normal");
}

function mousePressed() {
    // Verificar si el usuario hizo clic en un modelo
    let paquitoDistance = dist(mouseX, mouseY, floatOffsetXPaquito, floatOffsetYPaquito);
    let catoDistance = dist(mouseX, mouseY, floatOffsetXCato + 100, floatOffsetYCato - 200);

    // Definir un umbral de selección (ajusta según el tamaño de los modelos)
    let selectionThreshold = 1500;

    if (paquitoDistance < selectionThreshold) {
        selectedModel = 'Paquito'; // Seleccionar Paquito
    } else if (catoDistance < selectionThreshold) {
        selectedModel = 'Cato'; // Seleccionar Cato
    } else {
        selectedModel = null; // Deseleccionar ambos
    }

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
    translate(-20, 10, 272);

    // Mostrar el modelo frontal correspondiente
    if (isInflated) {
        if (modeladopacoFRONT_inflado) {
            model(modeladopacoFRONT_inflado); // Modelo inflado
        } else {
            console.error("Modelo inflado frontal no cargado.");
        }
    } else {
        if (modeladopacoFRONT) {
            model(modeladopacoFRONT); // Modelo normal
        } else {
            console.error("Modelo frontal no cargado.");
        }
    }
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

    // Mostrar el modelo trasero correspondiente
    if (isInflated) {
        if (modeladopacoBACK_inflado) {
            model(modeladopacoBACK_inflado); // Modelo inflado
        } else {
            console.error("Modelo inflado trasero no cargado.");
        }
    } else {
        if (modeladopacoBACK) {
            model(modeladopacoBACK); // Modelo normal
        } else {
            console.error("Modelo trasero no cargado.");
        }
    }
    pop();

    angle += 0.1; // Rotación lenta (opcional)
}
function mostrarPacoInflado () {
        // Mostrar la parte frontal de Paquito inflado
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
    
        // Mostrar el modelo frontal inflado
        if (modeladopacoFRONT_inflado) {
            model(modeladopacoFRONT_inflado); // Modelo inflado
        } else {
            console.error("Modelo inflado frontal no cargado.");
        }
        pop();
    
        // Mostrar la parte trasera de Paquito inflado
        push();
        noStroke();
        texture(texturaBack); // Aplicar textura trasera
    
        // Aplicar las mismas transformaciones que al frente
        translate(floatOffsetXPaquito, floatOffsetYPaquito, -100);
        rotateZ(-180);
        rotateY(-angle); 
        rotateX(-angle);
        translate(-20, 10, 300);
    
        // Mostrar el modelo trasero inflado
        if (modeladopacoBACK_inflado) {
            model(modeladopacoBACK_inflado); // Modelo inflado
        } else {
            console.error("Modelo inflado trasero no cargado.");
        }
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

function toggleInflate() {
    isInflated = !isInflated; // Cambiar el estado
    console.log(isInflated ? "Paco inflado" : "Paco normal");
}
