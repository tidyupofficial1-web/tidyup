let html5QrCode = null;
let cameraAttiva = false;

function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');

    if (!cameraAttiva) {
        if (readerDiv) readerDiv.style.display = 'block';
        cameraAttiva = true;

        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                const barcodeInput = document.getElementById('barcode-input');
                if (barcodeInput) barcodeInput.value = decodedText;
                
                fermaFotocamera();
                cercaProdottoPerBarcode(decodedText);
            },
            (errorMessage) => {}
        ).catch(err => {
            console.error("Errore avvio fotocamera:", err);
            alert("Impossibile avviare la fotocamera.");
            fermaFotocamera();
        });
    } else {
        fermaFotocamera();
    }
}

function fermaFotocamera() {
    if (html5QrCode && cameraAttiva) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            chiudiStreamFotocamera();
        }).catch(err => {
            chiudiStreamFotocamera();
        });
    } else {
        chiudiStreamFotocamera();
    }
}

function chiudiStreamFotocamera() {
    const readerDiv = document.getElementById('reader');
    if (readerDiv) readerDiv.style.display = 'none';
    cameraAttiva = false;
}

function cercaProdottoPerBarcode(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                const p = data.product;
                
                // Gestione delle lingue: cerca prima il nome in italiano, poi ripiega su generico o inglese
                const nome = p.product_name_it || p.product_name || p.product_name_en || '';
                const marca = p.brands || '';
                
                const nomeInput = document.getElementById('nome-prodotto');
                if (nomeInput) nomeInput.value = nome;
                
                const marcaInput = document.getElementById('marca-prodotto');
                if (marcaInput) marcaInput.value = marca;
                
                const preview = document.getElementById('preview-prodotto');
                if (preview) preview.style.display = 'block';
            } else {
                alert("Prodotto non trovato nel database. Inserisci i dati manualmente.");
                const preview = document.getElementById('preview-prodotto');
                if (preview) preview.style.display = 'block';
            }
        })
        .catch(error => {
            console.error("Errore di connessione:", error);
            alert("Errore durante il recupero delle informazioni.");
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const btnFotocamera = document.getElementById('btn-fotocamera');
    if (btnFotocamera) {
        btnFotocamera.addEventListener('click', toggleFotocamera);
    }
});