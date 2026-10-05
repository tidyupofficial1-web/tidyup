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

// Funzione per scaricare le informazioni del prodotto tramite Open Food Facts
function cercaProdottoPerBarcode(barcode) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === 1) {
                const p = data.product;
                
                // Cerca prima il nome in italiano, altrimenti ripiega sulle altre lingue disponibili
                const nome = p.product_name_it || p.product_name || p.product_name_en || '';
                const marca = p.brands || '';
                
                // Prende direttamente la stringa della categoria da Open Food Facts se presente, altrimenti stringa vuota
                const categoria = p.categories || '';
                
                // Assegnazione dei campi del form
                const nomeInput = document.getElementById('nome-prodotto');
                if (nomeInput) {
                    nomeInput.value = nome;
                }
                
                const marcaInput = document.getElementById('marca-prodotto');
                if (marcaInput) {
                    marcaInput.value = marca;
                }
                
                // Se Open Food Facts fornisce la categoria la scrive, altrimenti la lascia bianca per l'utente
                const categoriaInput = document.getElementById('categoria-prodotto');
                if (categoriaInput) {
                    categoriaInput.value = categoria;
                }
                
                // Mostra la sezione di anteprima
                const previewProdotto = document.getElementById('preview-prodotto');
                if (previewProdotto) {
                    previewProdotto.style.display = 'block';
                }
            } else {
                alert("Prodotto non trovato nel database. Inserisci i dati manualmente.");
                
                // Pulisce o lascia vuoti i campi e mostra comunque il form per l'inserimento manuale
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