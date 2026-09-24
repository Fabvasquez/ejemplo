// Asegúrate de que coincida con el nombre real de tu carpeta ("./modelo/" o "./my_model/")
const URL = "./modelo/";

let model, maxPredictions;

// Cargamos el modelo automáticamente al abrir la página
window.onload = async function() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("Modelo cargado correctamente");
    } catch (error) {
        alert("No se pudo cargar el modelo. Revisa la ruta de tu carpeta.");
        console.error(error);
    }
};

// Función que se ejecuta cuando el usuario selecciona una imagen
function loadFile(event) {
    const imagePreview = document.getElementById('image-preview');
    imagePreview.src = URL.createObjectURL(event.target.files[0]);
    imagePreview.style.display = "block";

    // Una vez que la imagen carga visualmente, procedemos a predecir
    imagePreview.onload = async function() {
        await predict(imagePreview);
    };
}

// Función para realizar la predicción usando la imagen cargada
async function predict(imageElement) {
    if (!model) {
        alert("El modelo aún se está cargando, espera un momento.");
        return;
    }

    // Pasamos el elemento de imagen al modelo para que lo clasifique
    const prediction = await model.predict(imageElement);
    
    const labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; // Limpiar resultados anteriores

    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(1);
        
        // Creamos los elementos visuales para mostrar las clases y porcentajes
        const div = document.createElement("div");
        div.innerHTML = `<span>${className}</span> <span>${probability}%</span>`;
        labelContainer.appendChild(div);
    }
}