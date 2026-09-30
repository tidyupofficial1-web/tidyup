let html5QrCode = null;
let cameraAttiva = false;
let tipoScadenzaCorrente = "consigliata"; 
let mostraAiutiAttivo = true;

document.addEventListener('DOMContentLoaded', () => {
    const savedHelpPref = localStorage.getItem('eat_me_first_help');
    if (savedHelpPref === 'false') {
        mostraAiutiAttivo = false;
        document.getElementById('chk-mostra-aiuti').checked = false;
    }

    document.getElementById('barcode-input').focus();
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
    if(campoData) campoData.value = oggi;
}

function handleBarcodeKey(event) {
    if (event.key === 'Enter' || event.code === 'Space') {
        event.preventDefault();
        cercaBarcodeMultiplo();
    }
}

// Gestione Fotocamera Robusta per Mobile e Web
async function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');

    if (!cameraAttiva) {
        readerDiv.style.display = 'block';
        btnCam.textContent = "🛑 Chiudi Fotocamera";
        cameraAttiva = true;

        try {
            html5QrCode = new Html5Qrcode("reader");
            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 220, height: 140 } },
                async (decodedText) => {
                    document.getElementById('barcode-input').value = decodedText;
                    await chiudiFotocamera();
                    cercaBarcodeMultiplo();
                },
                (errorMessage) => {}
            );
        } catch (err) {
            console.error("Errore fotocamera:", err);
            alert("Impossibile accedere alla fotocamera. Verifica i permessi del browser sul cellulare.");
            await chiudiFotocamera();
        }
    } else {
        await chiudiFotocamera();
    }
}

async function chiudiFotocamera() {
    if (html5QrCode) {
        try {
            if (html5QrCode.isScanning) {
                await html5QrCode.stop();
            }
            html5QrCode.clear();
        } catch (e) {}
    }
    html5QrCode = null;
    document.getElementById('reader').style.display = 'none';
    document.getElementById('btn-toggle-cam').textContent = "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

// Ricerca Multipla: Open Food Facts -> Open Beauty Facts -> Open Products Facts
async function cercaBarcodeMultiplo() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) return;

    try {
        let response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        let data = await response.json();

        if (!data || data.status !== 1) {
            response = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
            data = await response.json();
        }

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

            document.getElementById('inf-nome').textContent = nome || "Trovato";
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
        gestisciProdottoNonTrovato(barcode);
    }
}

function estraiQuantitaIntelligente(rawQuantity) {
    if (!rawQuantity) return;
    const match = rawQuantity.match(/(\d+)/);
    if (match) {
        document.getElementById('quantita').value = match[1];
        document.getElementById('inf-conversione').textContent = `💡 Riconosciuto: "${rawQuantity}"`;
    }
}

function abilitaCompilazioneManuale() {
    if (cameraAttiva) chiudiFotocamera();
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('nome-prodotto').focus();
}

function impostaScadenzaConsigliata(giorniInPiu) {
    tipoScadenzaCorrente = "consigliata";
    const dataProposta = new Date();
    dataProposta.setDate(dataProposta.getDate() + giorniInPiu);
    document.getElementById('scadenza').value = dataProposta.toISOString().split('T')[0];
    document.getElementById('inf-tipo-scadenza-badge').innerHTML = '<span class="scadenza-badge badge-consigliata">⏳ Scadenza Consigliata</span>';
}

function stimaScadenzaDallaDescrizione(testo) {
    if (tipoScadenzaCorrente !== "consigliata") return;
    const t = testo.toLowerCase();
    let giorni = 30;

    if (t.includes('latte') || t.includes('fresco') || t.includes('mozzarella') || t.includes('ricotta')) {
        giorni = 7;
    } else if (t.includes('carne') || t.includes('pesce')) {
        giorni = 3;
    } else if (t.includes('pane')) {
        giorni = 4;
    }

    const d = new Date();
    d.setDate(d.getDate() + giorni);
    document.getElementById('scadenza').value = d.toISOString().split('T')[0];
}

function gestisciProdottoNonTrovato(barcode) {
    document.getElementById('inf-nome').textContent = "Non catalogato";
    document.getElementById('inf-marca').textContent = "Inserimento manuale";
    document.getElementById('img-anteprima').style.display = 'none';
    document.getElementById('preview-prodotto').style.display = 'block';
    
    document.getElementById('nome-prodotto').value = `Prodotto [${barcode}]`;
    document.getElementById('marca-prodotto').value = "";
    document.getElementById('quantita').value = "1";
    document.getElementById('nome-prodotto').focus();
}

function registraCarico(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-prodotto').value.trim();
    const barcode = document.getElementById('barcode-input').value.trim();
    const scadenzaVal = document.getElementById('scadenza').value || "Nessuna scadenza";

    const nuovoArticolo = {
        id: Date.now(),
        barcode: barcode,
        categoria: document.getElementById('categoria-prodotto').value,
        nome: nome,
        marca: document.getElementById('marca-prodotto').value.trim(),
        ubicazione: document.getElementById('ubicazione').value,
        scadenza: scadenzaVal,
        quantita: parseInt(document.getElementById('quantita').value) || 1,
        unitaMisura: document.getElementById('unita-misura').value,
        immagine: document.getElementById('img-anteprima').src || "",
        dataCarico: document.getElementById('data-carico').value
    };

    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    if (!db.dispensa) db.dispensa = [];
    
    db.dispensa.push(nuovoArticolo);
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));

    alert("Articolo caricato con successo nella dispensa!");
    window.location.href = "dispensa.html";
}