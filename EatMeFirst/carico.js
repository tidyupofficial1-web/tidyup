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
                // Inserisce il codice a barre rilevato nella casella di input
                const barcodeInput = document.getElementById('barcode-input');
                if (barcodeInput) {
                    barcodeInput.value = decodedText;
                }
                
                // Ferma la fotocamera dopo la scansione riuscita
                fermaFotocamera();
                
                // Avvia lo scaricamento delle informazioni dal database
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

// Funzione per scaricare, pulire e tradurre le informazioni del prodotto tramite Open Food Facts
function cercaProdottoPerBarcode(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                const p = data.product;
                
                // 1. Gestione prioritaria della lingua per il nome (cerca italiano, poi generico, poi inglese)
                const nome = p.product_name_it || p.product_name || p.product_name_en || '';
                const marca = p.brands || '';
                
                // 2. Pulizia e formattazione della categoria (rimuove prefissi tecnici es. "en:" o "it:")
                let categoriaGrezza = p.categories || '';
                if (Array.isArray(p.categories_tags) && p.categories_tags.length > 0) {
                    // Prende l'ultima categoria della gerarchia (di solito la più specifica)
                    categoriaGrezza = p.categories_tags[p.categories_tags.length - 1];
                }
                const categoria = categoriaGrezza.includes(':') ? categoriaGrezza.split(':').pop() : categoriaGrezza;
                
                // Assegnazione ai campi del form (verifica che gli ID corrispondano al tuo HTML)
                const nomeInput = document.getElementById('nome-prodotto');
                if (nomeInput) {
                    nomeInput.value = nome;
                }
                
                const marcaInput = document.getElementById('marca-prodotto');
                if (marcaInput) {
                    marcaInput.value = marca;
                }
                
                const categoriaInput = document.getElementById('categoria-prodotto');
                if (categoriaInput) {
                    categoriaInput.value = categoria;
                }
                
                // Mostra la sezione di anteprima o sblocca i campi
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

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    const btnFotocamera = document.getElementById('btn-fotocamera');
    if (btnFotocamera) {
        btnFotocamera.addEventListener('click', toggleFotocamera);
    }
});