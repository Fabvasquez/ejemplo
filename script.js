const URL_MODELO = "./modelo/"; 

let model, maxPredictions;


window.addEventListener('DOMContentLoaded', async () => {
    const modelURL = URL_MODELO + "model.json";
    const metadataURL = URL_MODELO + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log("¡Modelo cargado con éxito!");
    } catch (error) {
        alert("Error al cargar el modelo. Verifica que la carpeta y los archivos existan.");
        console.error(error);
    }
});


async function previewAndPredict(event) {
    const file = event.target.files[0];
    if (!file) return;

    const imagePreview = document.getElementById('image-preview');
    
   
    imagePreview.src = URL.createObjectURL(file);
    imagePreview.style.display = "block";

   
    imagePreview.onload = async function() {
        await realizarPrediccion(imagePreview);
    };
}


async function realizarPrediccion(imageElement) {
    if (!model) {
        alert("El modelo todavía se está cargando. Espera un segundo e inténtalo de nuevo.");
        return;
    }


    const prediction = await model.predict(imageElement);
    
    const labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = "";

  
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(1);
        
        const div = document.createElement("div");
        div.innerHTML = `<span>${className}</span> <strong>${probability}%</strong>`;
        labelContainer.appendChild(div);
    }
}