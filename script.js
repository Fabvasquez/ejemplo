const URL_MODELO = "./modelo/";

let model = null;
let maxPredictions = 0;


// ===============================
// CARGAR MODELO
// ===============================

window.addEventListener("DOMContentLoaded", async () => {

    try {

        model = await tmImage.load(
            URL_MODELO + "model.json",
            URL_MODELO + "metadata.json"
        );

        maxPredictions = model.getTotalClasses();

        console.log("Modelo cargado correctamente");

    } catch (error) {

        console.error(error);

        alert(
            "No se pudo cargar el modelo de IA.\n\n" +
            "Verifica que la carpeta 'modelo' contenga:\n" +
            "- model.json\n" +
            "- metadata.json\n" +
            "- archivos .bin"
        );

    }

});


// ===============================
// ELEMENTOS
// ===============================

const imageInput =
    document.getElementById("image-upload");

const uploadArea =
    document.getElementById("drop-area");

const imagePreview =
    document.getElementById("image-preview");

const previewSection =
    document.getElementById("preview-section");

const resultSection =
    document.getElementById("result-section");

const resetButton =
    document.getElementById("reset-button");


// ===============================
// SELECCIONAR IMAGEN
// ===============================

imageInput.addEventListener("change", function(event) {

    const file = event.target.files[0];

    if (!file) {
        return;
    }

    analizarImagen(file);

});


// ===============================
// ARRASTRAR IMAGEN
// ===============================

uploadArea.addEventListener(
    "dragover",
    function(event) {

        event.preventDefault();

        uploadArea.classList.add("dragover");

    }
);


uploadArea.addEventListener(
    "dragleave",
    function() {

        uploadArea.classList.remove("dragover");

    }
);


uploadArea.addEventListener(
    "drop",
    function(event) {

        event.preventDefault();

        uploadArea.classList.remove("dragover");

        const file =
            event.dataTransfer.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            alert("Por favor selecciona una imagen.");

            return;
        }

        analizarImagen(file);

    }
);


// ===============================
// ANALIZAR IMAGEN
// ===============================

function analizarImagen(file) {

    if (!model) {

        alert(
            "El modelo todavía se está cargando. " +
            "Espera unos segundos e inténtalo nuevamente."
        );

        return;
    }


    const imageURL =
        URL.createObjectURL(file);


    imagePreview.src = imageURL;


    previewSection.style.display = "block";

    resultSection.style.display = "block";

    resetButton.style.display = "block";


    imagePreview.onload = async function() {

        await realizarPrediccion(imagePreview);

    };

}


// ===============================
// REALIZAR PREDICCIÓN
// ===============================

async function realizarPrediccion(imageElement) {

    try {

        const prediction =
            await model.predict(imageElement);


        // Ordenar resultados
        prediction.sort(
            (a, b) =>
                b.probability - a.probability
        );


        // Resultado principal
        const resultadoPrincipal =
            prediction[0];


        const clase =
            resultadoPrincipal.className;


        const porcentaje =
            resultadoPrincipal.probability * 100;


        mostrarResultadoPrincipal(
            clase,
            porcentaje
        );


        mostrarResultados(
            prediction
        );


    } catch (error) {

        console.error(
            "Error durante la predicción:",
            error
        );

        alert(
            "Ocurrió un error al analizar la imagen."
        );

    }

}


// ===============================
// MOSTRAR RESULTADO PRINCIPAL
// ===============================

function mostrarResultadoPrincipal(
    clase,
    porcentaje
) {

    const mainResult =
        document.getElementById("main-result");

    const confidenceText =
        document.getElementById("confidence-text");

    const confidencePercent =
        document.getElementById("confidence-percent");

    const confidenceFill =
        document.getElementById("confidence-fill");

    const resultIcon =
        document.getElementById("result-icon");


    const porcentajeFinal =
        porcentaje.toFixed(1);


    /*
       Cambia estas palabras si
       tus clases tienen otros nombres.
    */

    const nombreClase =
        clase.toLowerCase();


    let usaLentes = false;


    if (
        nombreClase.includes("lente") ||
        nombreClase.includes("con lentes") ||
        nombreClase.includes("con_lentes") ||
        nombreClase.includes("si")
    ) {

        usaLentes = true;

    }


    if (usaLentes) {

        mainResult.textContent =
            "USA LENTES";

        resultIcon.textContent =
            "👓";

        confidenceText.textContent =
            "El modelo detectó que la persona utiliza lentes.";

    } else {

        mainResult.textContent =
            "NO USA LENTES";

        resultIcon.textContent =
            "👀";

        confidenceText.textContent =
            "El modelo detectó que la persona no utiliza lentes.";

    }


    confidencePercent.textContent =
        porcentajeFinal + "%";


    confidenceFill.style.width =
        porcentajeFinal + "%";

}


// ===============================
// MOSTRAR TODAS LAS PREDICCIONES
// ===============================

function mostrarResultados(predictions) {

    const container =
        document.getElementById(
            "label-container"
        );


    container.innerHTML = "";


    predictions.forEach(
        function(prediction) {

            const porcentaje =
                (
                    prediction.probability * 100
                ).toFixed(1);


            const item =
                document.createElement("div");


            item.className =
                "result-item";


            item.innerHTML = `

                <div class="result-info">

                    <span>
                        ${prediction.className}
                    </span>

                    <strong>
                        ${porcentaje}%
                    </strong>

                </div>

                <div class="progress-bg">

                    <div
                        class="progress-fill"
                        style="width: ${porcentaje}%;">
                    </div>

                </div>

            `;


            container.appendChild(item);

        }
    );

}


// ===============================
// REINICIAR
// ===============================

function resetApp() {

    imageInput.value = "";

    imagePreview.src = "";

    previewSection.style.display =
        "none";

    resultSection.style.display =
        "none";

    resetButton.style.display =
        "none";


    document.getElementById(
        "label-container"
    ).innerHTML = "";

}