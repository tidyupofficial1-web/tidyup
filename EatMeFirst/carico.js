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
                // 1. Il numero viene rilevato e caricato nella casella
                const barcodeInput = document.getElementById('barcode-input');
                if (barcodeInput) {
                    barcodeInput.value = decodedText;
                }
                
                // Ferma la fotocamera dopo la scansione riuscita
                fermaFotocamera();
                
                // 2. Avvia lo scaricamento delle informazioni dal database
                cercaProdottoPerBarcode(decodedText);
            },
            (errorMessage) => {
                // Eventuali errori di scansione fotogramma (ignorati per evitare log superflui)
            }
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
                const prodotto = data.product;
                
                // Compila i campi del form (adatta gli ID se nel tuo HTML si chiamano diversamente)
                const nomeProdotto = document.getElementById('nome-prodotto');
                if (nomeProdotto) {
                    nomeProdotto.value = prodotto.product_name || '';
                }
                
                const marcaProdotto = document.getElementById('marca-prodotto');
                if (marcaProdotto) {
                    marcaProdotto.value = prodotto.brands || '';
                }
                
                // Mostra la sezione di anteprima o sblocca i campi se nascosti
                const previewProdotto = document.getElementById('preview-prodotto');
                if (previewProdotto) {
                    previewProdotto.style.display = 'block';
                }
            } else {
                alert("Prodotto non trovato nel database. Puoi inserire i dati manualmente.");
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

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    const btnFotocamera = document.getElementById('btn-fotocamera');
    if (btnFotocamera) {
        btnFotocamera.addEventListener('click', toggleFotocamera);
    }
});