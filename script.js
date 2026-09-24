const URL_MODELO = "./modelo/"; // Cambia a "./my_model/" si tu carpeta se llama así

let model, maxPredictions;

window.addEventListener('DOMContentLoaded', async () => {
    try {
        model = await tmImage.load(URL_MODELO + "model.json", URL_MODELO + "metadata.json");
        maxPredictions = model.getTotalClasses();
        console.log("Modelo cargado exitosamente.");
    } catch (error) {
        alert("Error al cargar el modelo. Verifica que la carpeta 'modelo' contenga los archivos necesarios.");
        console.error(error);
    }
});

async function previewAndPredict(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreview = document.getElementById('image-preview');
    const dropContent = document.getElementById('drop-zone-content');

    // Ocultar texto de la zona de carga y mostrar la imagen seleccionada
    dropContent.style.display = "none";
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";

    imagePreview.onload = async function() {
        await realizarPrediccion(imagePreview);
    };
}

async function realizarPrediccion(imageElement) {
    if (!model) {
        alert("El modelo aún se está cargando. Espera un momento.");
        return;
    }

    const prediction = await model.predict(imageElement);
    const labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ""; 

    // Generar dinámicamente un diseño de tarjetas con barras de porcentaje para cada clase
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probabilityPercent = (prediction[i].probability * 100).toFixed(1);

        const itemDiv = document.createElement("div");
        itemDiv.className = "result-item";
        
        itemDiv.innerHTML = `
            <div class="result-info">
                <span>${className}</span>
                <span>${probabilityPercent}%</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${probabilityPercent}%;"></div>
            </div>
        `;
        
        labelContainer.appendChild(itemDiv);
    }
}