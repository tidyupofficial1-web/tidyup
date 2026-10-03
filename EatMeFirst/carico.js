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

// Gestione Fotocamera robusta
async function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');

    if (!cameraAttiva) {
        readerDiv.style.display = 'block';
        btnCam.textContent = "⏳ Apertura fotocamera in corso...";
        cameraAttiva = true;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: { exact: "environment" } } 
            }).catch(async () => {
                return await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            });

            stream.getTracks().forEach(track => track.stop());

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

            btnCam.textContent = "🛑 Chiudi Fotocamera";
        } catch (err) {
            console.error("Errore accesso fotocamera:", err);
            alert("Impossibile accedere alla fotocamera. Verifica i permessi nel browser.");
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

// Ricerca Multipla con gestione ubicazioni dinamiche e storico
async function cercaBarcodeMultiplo() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) return;

    let fonteTrovata = "alimentari";

    try {
        let response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        let data = await response.json();

        if (!data || data.status !== 1) {
            response = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
            data = await response.json();
            if (data && data.status === 1) fonteTrovata = "igiene";
        }

        if (!data || data.status !== 1) {
            response = await fetch(`https://world.openproductsfacts.org/api/v0/product/${barcode}.json`);
            data = await response.json();
            if (data && data.status === 1) fonteTrovata = "casa";
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

            impostaCategoriaIntelligente(fonteTrovata, nome);
            impostaUbicazioneStorica(barcode, nome);
            gestisciQuantitaPezzoSingolo(prodotto.quantity || "");
            impostaScadenzaIntelligentePerCategoria(fonteTrovata, nome);

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

function impostaCategoriaIntelligente(fonte, nomeProdotto) {
    const selectCat = document.getElementById('categoria-prodotto');
    const t = nomeProdotto.toLowerCase();

    if (fonte === "igiene" || t.includes('dentifricio') || t.includes('shampoo') || t.includes('sapone') || t.includes('bagnoschiuma')) {
        selectCat.value = "Igiene";
    } else if (fonte === "casa" || t.includes('pile') || t.includes('batterie') || t.includes('piatti') || t.includes('fazzoletti') || t.includes('carta')) {
        selectCat.value = "Casa & Varie";
    } else if (t.includes('detersivo') || t.includes('candeggina') || t.includes('sgrassatore')) {
        selectCat.value = "Pulizia";
    } else if (t.includes('latte') || t.includes('yogurt') || t.includes('formaggio')) {
        selectCat.value = "Latticini";
    } else if (t.includes('acqua') || t.includes('bibita') || t.includes('succo')) {
        selectCat.value = "Bevande";
    } else {
        selectCat.value = "Dispensa / Generi alimentari";
    }
}

// Gestione Ubicazioni Dinamiche (Partono vuote e si popolano solo con i salvataggi utente)
function aggiornaListaUbicazioniDinamiche(ubicazioneSelezionata = "") {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    const selectUbicazione = document.getElementById('ubicazione');
    
    const ubicazioniSalvate = [...new Set((db.dispensa || []).map(item => item.ubicazione).filter(Boolean))];
    
    selectUbicazione.innerHTML = '<option value="" disabled selected>-- Seleziona un\'ubicazione --</option>';
    
    ubicazioniSalvate.forEach(ub => {
        const opt = document.createElement('option');
        opt.value = ub;
        opt.textContent = ub;
        selectUbicazione.appendChild(opt);
    });

    const optNuova = document.createElement('option');
    optNuova.value = "__nuova__";
    optNuova.textContent = "➕ Aggiungi nuova ubicazione...";
    selectUbicazione.appendChild(optNuova);

    if (ubicazioneSelezionata && ubicazioniSalvate.includes(ubicazioneSelezionata)) {
        selectUbicazione.value = ubicazioneSelezionata;
    }

    selectUbicazione.onchange = function() {
        if (this.value === "__nuova__") {
            const nuovoLuogo = prompt("Inserisci il nome della nuova ubicazione (es. Frigo alto, Cantina scaffale 2):");
            if (nuovoLuogo && nuovoLuogo.trim() !== "") {
                const nomeNuovo = nuovoLuogo.trim();
                const optNew = document.createElement('option');
                optNew.value = nomeNuovo;
                optNew.textContent = nomeNuovo;
                selectUbicazione.insertBefore(optNew, selectUbicazione.lastElementChild);
                selectUbicazione.value = nomeNuovo;
            } else {
                selectUbicazione.value = "";
            }
        }
    };
}

function impostaUbicazioneStorica(barcode, nome) {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    const storicoItem = (db.dispensa || []).reverse().find(item => (barcode && item.barcode === barcode) || item.name === nome);
    const ubicazioneTrovata = storicoItem ? storicoItem.ubicazione : "";
    aggiornaListaUbicazioniDinamiche(ubicazioneTrovata);
}

function gestisciQuantitaPezzoSingolo(rawQuantity) {
    document.getElementById('quantita').value = "1";
    document.getElementById('unita-misura').value = "pezzi";
    if (rawQuantity) {
        document.getElementById('inf-conversione').textContent = `💡 Confezione singola (${rawQuantity})`;
    } else {
        document.getElementById('inf-conversione').textContent = `💡 Confezione singola`;
    }
}

function impostaScadenzaIntelligentePerCategoria(fonte, nomeProdotto) {
    tipoScadenzaCorrente = "consigliata";
    const t = nomeProdotto.toLowerCase();
    let giorni = 30; // Default generico per dispensa

    // Regole intelligenti basate su parole chiave
    if (fonte === "igiene" || fonte === "casa" || t.includes('dentifricio') || t.includes('pile') || t.includes('piatti')) {
        giorni = 365;
    } else if (t.includes('pasta') || t.includes('riso') || t.includes('farina') || t.includes('biscotti') || t.includes('caffè') || t.includes('zucchero') || t.includes('sale') || t.includes('scatola') || t.includes('tonno') || t.includes('passata')) {
        giorni = 365; // 1 anno per i secchi e le conserve a lunga conservazione
    } else if (t.includes('latte') || t.includes('fresco')) {
        giorni = 7;
    } else if (t.includes('carne') || t.includes('pesce')) {
        giorni = 3;
    }

    const dataProposta = new Date();
    dataProposta.setDate(dataProposta.getDate() + giorni);
    document.getElementById('scadenza').value = dataProposta.toISOString().split('T')[0];
    document.getElementById('inf-tipo-scadenza-badge').innerHTML = '<span class="scadenza-badge badge-consigliata">⏳ Scadenza Stimata</span>';
}

function stimaScadenzaDallaDescrizione(testo) {
    if (tipoScadenzaCorrente !== "consigliata") return;
    const t = testo.toLowerCase();
    let giorni = 30;

    if (t.includes('dentifricio') || t.includes('pile') || t.includes('piatti') || t.includes('fazzoletti')) {
        giorni = 365;
    } else if (t.includes('pasta') || t.includes('riso') || t.includes('farina') || t.includes('biscotti') || t.includes('caffè') || t.includes('zucchero') || t.includes('sale') || t.includes('tonno') || t.includes('passata')) {
        giorni = 365;
    } else if (t.includes('latte') || t.includes('fresco')) {
        giorni = 7;
    }

    const d = new Date();
    d.setDate(d.getDate() + giorni);
    document.getElementById('scadenza').value = d.toISOString().split('T')[0];
}

function abilitaCompilazioneManuale() {
    if (cameraAttiva) chiudiFotocamera();
    aggiornaListaUbicazioniDinamiche("");
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('nome-prodotto').focus();
}

function gestisciProdottoNonTrovato(barcode) {
    document.getElementById('inf-nome').textContent = "Non catalogato";
    document.getElementById('inf-marca').textContent = "Inserimento manuale";
    document.getElementById('img-anteprima').style.display = 'none';
    aggiornaListaUbicazioniDinamiche("");
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
    const ubicazioneScelta = document.getElementById('ubicazione').value;

    if (!ubicazioneScelta || ubicazioneScelta === "__nuova__") {
        alert("Seleziona o crea un'ubicazione valida per il prodotto.");
        document.getElementById('ubicazione').focus();
        return;
    }

    const scadenzaVal = document.getElementById('scadenza').value || "Nessuna scadenza";

    const nuovoArticolo = {
        id: Date.now(),
        barcode: barcode,
        categoria: document.getElementById('categoria-prodotto').value,
        nome: nome,
        marca: document.getElementById('marca-prodotto').value.trim(),
        ubicazione: ubicazioneScelta,
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