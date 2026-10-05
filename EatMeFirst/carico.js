let html5QrCode = null;
let cameraAttiva = false;

// Funzione per avviare o fermare la fotocamera
function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');

    if (!cameraAttiva) {
        readerDiv.style.display = 'block';
        cameraAttiva = true;

        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                // Azione eseguita alla lettura corretta del codice a barre
                document.getElementById('barcode-input').value = decodedText;
                fermaFotocamera();
                
                // Mostra la sezione di anteprima del prodotto (assicurati che esista l'elemento nel tuo HTML)
                const previewProdotto = document.getElementById('preview-prodotto');
                if (previewProdotto) {
                    previewProdotto.style.display = 'block';
                }
                
                const nomeProdotto = document.getElementById('nome-prodotto');
                if (nomeProdotto) {
                    nomeProdotto.focus();
                }
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

// Eventuale logica aggiuntiva di gestione del form o del caricamento dati
document.addEventListener('DOMContentLoaded', () => {
    // Esempio di associazione automatica se il pulsante ha un id specifico (es. btn-fotocamera)
    const btnFotocamera = document.getElementById('btn-fotocamera');
    if (btnFotocamera) {
        btnFotocamera.addEventListener('click', toggleFotocamera);
    }
});