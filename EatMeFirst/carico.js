let mostraAiutiAttivo = true;
let html5QrCode = null;
let cameraAttiva = false;

document.addEventListener('DOMContentLoaded', () => {
    const savedHelpPref = localStorage.getItem('eat_me_first_help');
    if (savedHelpPref === 'false') {
        mostraAiutiAttivo = false;
        document.getElementById('chk-mostra-aiuti').checked = false;
    }

    inizializzaListenerCampi();
    impostaDataOdierna();
});

function toggleGlobalHelp(stato) {
    mostraAiutiAttivo = stato;
    localStorage.setItem('eat_me_first_help', stato);
}

function inizializzaListenerCampi() {
    const gruppi = document.querySelectorAll('.form-group');
    gruppi.forEach(gruppo => {
        const input = gruppo.querySelector('input, select');
        if (input) {
            input.addEventListener('focus', () => {
                if (mostraAiutiAttivo && gruppo.dataset.help) {
                    mostraTooltip(gruppo.dataset.help);
                }
            });
        }
    });
}

function mostraTooltip(testo) {
    document.getElementById('tooltip-text').textContent = testo;
    document.getElementById('tooltip-modal').style.display = 'flex';
}

function chiudiTooltip() {
    document.getElementById('tooltip-modal').style.display = 'none';
}

function impostaDataOdierna() {
    const oggi = new Date().toISOString().split('T')[0];
    const campoData = document.getElementById('data-carico');
    if(campoData && !campoData.value) {
        campoData.value = oggi;
    }
}

// Gestione Fotocamera con Html5Qrcode
async function avviaFotocamera() {
    const readerDiv = document.getElementById('reader');
    readerDiv.style.display = 'block';

    if (cameraAttiva) return;

    try {
        html5QrCode = new Html5Qrcode("reader");
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            async (decodedText) => {
                document.getElementById('barcode-input').value = decodedText;
                await chiudiFotocamera();
                cercaBarcodeMultiplo();
            },
            (errorMessage) => {
                // Errori di scansione fotogramma ignorati per fluidità
            }
        );
        cameraAttiva = true;
    } catch (err) {
        console.error("Errore avvio fotocamera:", err);
        alert("Impossibile avviare la fotocamera. Verifica i permessi del browser.");
        readerDiv.style.display = 'none';
        cameraAttiva = false;
    }
}

async function chiudiFotocamera() {
    if (html5QrCode && cameraAttiva) {
        try {
            await html5QrCode.stop();
            html5QrCode.clear();
        } catch (e) {
            console.error("Errore chiusura fotocamera", e);
        }
        cameraAttiva = false;
    }
    document.getElementById('reader').style.display = 'none';
}

// Ricerca sequenziale su 3 database: Alimentari -> Cosmetici/Igiene -> Prodotti Vari (Casa, Animali, Pile)
async function cercaBarcodeMultiplo() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) {
        alert("Inserisci o scansiona un codice a barre valido.");
        return;
    }

    try {
        // 1. Tentativo: Open Food Facts (Alimentari)
        let response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        let data = await response.json();

        // 2. Tentativo: Open Beauty Facts (Cosmetici e Igiene personale)
        if (!data || data.status !== 1) {
            response = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
            data = await response.json();
        }

        // 3. Tentativo: Open Products Facts (Casa, animali, pile, stoviglie, varia)
        if (!data || data.status !== 1) {
            response = await fetch(`https://world.openproductsfacts.org/api/v0/product/${barcode}.json`);
            data = await response.json();
        }

        if (data && data.status === 1) {
            const prodotto = data.product;
            let nome = prodotto.product_name || prodotto.product_name_it || "";
            if (nome.length > 45) nome = nome.substring(0, 42) + '...';

            const marca = (prodotto.brands || "").substring(0, 30);
            const immagine = prodotto.image_front_url || "";

            if(nome) document.getElementById('nome-prodotto').value = nome;
            if(marca) document.getElementById('marca-prodotto').value = marca;

            document.getElementById('inf-nome').textContent = nome || "Sconosciuto";
            document.getElementById('inf-marca').textContent = marca || "Non specificata";

            estraiQuantitaIntelligente(prodotto.quantity || "");
            impostaScadenzaConsigliata(30);

            const imgEl = document.getElementById('img-anteprima');
            if(immagine) {
                imgEl.src = immagine;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }

            document.getElementById('preview-prodotto').style.display = 'block';
            document.getElementById('ubicazione').focus();
        } else {
            gestisciProdottoNonTrovato(barcode);
        }
    } catch (error) {
        console.error("Errore di rete durante la ricerca del barcode:", error);
        gestisciProdottoNonTrovato(barcode);
    }
}

function estraiQuantitaIntelligente(rawQuantity) {
    if (!rawQuantity) return;
    const match = rawQuantity.match(/(\d+)/);
    if (match) {
        document.getElementById('quantita').value = match[1];
    }
}

function impostaScadenzaConsigliata(giorni) {
    const dataCorrente = new Date();
    dataCorrente.setDate(dataCorrente.getDate() + giorni);
    document.getElementById('scadenza').value = dataCorrente.toISOString().split('T')[0];
}

function gestisciProdottoNonTrovato(barcode) {
    document.getElementById('inf-nome').textContent = "Prodotto non catalogato";
    document.getElementById('inf-marca').textContent = "Inserisci i dati manualmente";
    document.getElementById('img-anteprima').style.display = 'none';
    document.getElementById('preview-prodotto').style.display = 'block';
    
    document.getElementById('nome-prodotto').value = "";
    document.getElementById('marca-prodotto').value = "";
    document.getElementById('quantita').value = "1";
    
    document.getElementById('nome-prodotto').focus();
}

function salvaProdotto() {
    const nome = document.getElementById('nome-prodotto').value.trim();
    const barcode = document.getElementById('barcode-input').value.trim();
    const ubicazione = document.getElementById('ubicazione').value;
    const scadenza = document.getElementById('scadenza').value;
    const quantita = parseInt(document.getElementById('quantita').value) || 1;
    const marca = document.getElementById('marca-prodotto').value.trim();

    if (!nome) {
        alert("Il nome del prodotto è obbligatorio.");
        document.getElementById('nome-prodotto').focus();
        return;
    }

    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };

    const nuovoItem = {
        id: Date.now(),
        barcode: barcode,
        nome: nome,
        marca: marca,
        ubicazione: ubicazione,
        scadenza: scadenza,
        quantita: quantita,
        unitaMisura: "pezzi",
        lowStock: false,
        dataCarico: document.getElementById('data-carico').value
    };

    db.dispensa.push(nuovoItem);
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));

    alert(`Prodotto "${nome}" salvato con successo in ${ubicazione}!`);
    
    // Reset form
    document.getElementById('barcode-input').value = "";
    document.getElementById('preview-prodotto').style.display = 'none';
    document.getElementById('barcode-input').focus();
}