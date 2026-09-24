const URL = "./modelo/";

let model, webcam, ctx, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // Cargamos el modelo y los metadatos
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
    } catch (error) {
        alert("No se pudo cargar el modelo. Asegúrate de tener la carpeta 'my_model' con los archivos correctos.");
        console.error(error);
        return;
    }

    // Configuración de la webcam
    const flip = true; // espejo horizontal
    webcam = new tmImage.Webcam(300, 300, flip); 
    await webcam.setup(); // Solicita acceso a la cámara
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Ocultar botón de inicio al arrancar la cámara
    document.getElementById("start-btn").style.display = "none";

    // Añadir el elemento de video/canvas de la webcam al DOM
    document.getElementById("webcam-box").appendChild(webcam.canvas);
    
    // Inicializar contenedores de etiquetas
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; // Limpiar contenedor
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // Actualiza el frame de la webcam
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    // Predicción a partir de la imagen de la webcam
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(1);
        
        // Mostramos el nombre de la clase y su porcentaje de certeza
        labelContainer.childNodes[i].innerHTML = `<span>${className}</span> <span>${probability}%</span>`;
    }
}