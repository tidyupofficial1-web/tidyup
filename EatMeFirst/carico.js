let html5QrCode = null;
let cameraAttiva = false;

// Funzione per avviare o fermare la fotocamera
function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');

    if (!cameraAttiva) {
        if (readerDiv) {
            readerDiv.style.display = 'block';
        }
        cameraAttiva = true;

        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                const barcodeInput = document.getElementById('barcode-input');
                if (barcodeInput) {
                    barcodeInput.value = decodedText;
                }
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

// Funzione per interrompere la scansione
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

// Nasconde il box video e resetta lo stato
function chiudiStreamFotocamera() {
    const readerDiv = document.getElementById('reader');
    if (readerDiv) {
        readerDiv.style.display = 'none';
    }
    cameraAttiva = false;
}

// Funzione per scaricare le informazioni del prodotto tramite Open Food Facts
function cercaProdottoPerBarcode(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                const p = data.product;
                
                const nome = p.product_name_it || p.product_name || p.product_name_en || '';
                const marca = p.brands || '';
                
                const nomeInput = document.getElementById('nome-prodotto');
                if (nomeInput) {
                    nomeInput.value = nome;
                }
                
                const marcaInput = document.getElementById('marca-prodotto');
                if (marcaInput) {
                    marcaInput.value = marca;
                }
                
                const previewProdotto = document.getElementById('preview-prodotto');
                if (previewProdotto) {
                    previewProdotto.style.display = 'block';
                }
            } else {
                alert("Prodotto non trovato nel database. Inserisci i dati manualmente.");
                
                const previewProdotto = document.getElementById('preview-prodotto');
                if (previewProdotto) {
                    previewProdotto.style.display = 'block';
                }
            }
        })
        .catch(error => {
            console.error("Errore di connessione al database:", error);
            alert("Errore durante il recupero delle informazioni.");
        });
}

// Inizializzazione all'avvio della pagina
document.addEventListener('DOMContentLoaded', () => {
    const btnFotocamera = document.getElementById('btn-fotocamera');
    if (btnFotocamera) {
        btnFotocamera.addEventListener('click', toggleFotocamera);
    }

    // Rimuove qualsiasi puntino, marcatore o selezione automatica dalle categorie all'avvio
    const elementiCategorie = document.querySelectorAll('ul, ol, li, .latticini, [data-categoria], .categoria-item');
    elementiCategorie.forEach(el => {
        el.classList.remove('active', 'selected', 'evidenziato', 'latticini');
        if (el.style) {
            el.style.listStyleType = 'none';
        }
    });
});