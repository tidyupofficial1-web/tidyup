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
            const previewProdotto = document.getElementById('preview-prodotto');
            if (previewProdotto) {
                previewProdotto.style.display = 'block';
            }

            const nomeInput = document.getElementById('nome-prodotto');
            const marcaInput = document.getElementById('marca-prodotto');
            const categoriaInput = document.getElementById('categoria-prodotto');

            // Pulisce preventivamente i campi per non lasciare residui
            if (nomeInput) nomeInput.value = '';
            if (marcaInput) marcaInput.value = '';
            if (categoriaInput) categoriaInput.value = ''; // Nessun "latticini" forzato

            if (data.status === 1) {
                const p = data.product;
                const nome = p.product_name_it || p.product_name || p.product_name_en || '';
                const marca = p.brands || '';
                
                if (nomeInput) nomeInput.value = nome;
                if (marcaInput) marcaInput.value = marca;
            } else {
                alert("Prodotto non trovato nel database. Inserisci i dati manualmente.");
            }
        })
        .catch(error => {
            console.error("Errore di connessione al database:", error);
            alert("Errore durante il recupero delle informazioni.");
            const previewProdotto = document.getElementById('preview-prodotto');
            if (previewProdotto) previewProdotto.style.display = 'block';
        });
}

// Gestione della memoria delle categorie (LocalStorage)
function caricaCategorieMemorizzate() {
    const datalist = document.getElementById('storico-categorie');
    if (!datalist) return;

    let categorie = JSON.parse(localStorage.getItem('dispensa_categorie')) || [];
    
    datalist.innerHTML = '';
    categorie.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        datalist.appendChild(option);
    });
}

function memorizzaCategoria(nuovaCategoria) {
    if (!nuovaCategoria || nuovaCategoria.trim() === '') return;
    nuovaCategoria = nuovaCategoria.trim();

    let categorie = JSON.parse(localStorage.getItem('dispensa_categorie')) || [];
    
    // Aggiunge la categoria se non esiste già nella lista
    if (!categorie.includes(nuovaCategoria)) {
        categorie.push(nuovaCategoria);
        localStorage.setItem('dispensa_categorie', JSON.stringify(categorie));
        caricaCategorieMemorizzate();
    }
}

// Inizializzazione all'avvio della pagina
document.addEventListener('DOMContentLoaded', () => {
    const btnFotocamera = document.getElementById('btn-fotocamera');
    if (btnFotocamera) {
        btnFotocamera.addEventListener('click', toggleFotocamera);
    }

    // Carica le categorie salvate in precedenza nei suggerimenti
    caricaCategorieMemorizzate();

    // Esempio: se hai un pulsante di salvataggio prodotto, puoi chiamare memorizzaCategoria(categoriaInput.value)
    const categoriaInput = document.getElementById('categoria-prodotto');
    if (categoriaInput) {
        categoriaInput.addEventListener('change', (e) => {
            memorizzaCategoria(e.target.value);
        });
    }
});