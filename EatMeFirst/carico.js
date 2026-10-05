let html5QrCode = null;
let cameraAttiva = false;
let mostraAiutiAttivo = true;

document.addEventListener('DOMContentLoaded', () => {
    const savedHelpPref = localStorage.getItem('eat_me_first_help');
    if (savedHelpPref === 'false') {
        mostraAiutiAttivo = false;
        document.getElementById('chk-mostra-aiuti').checked = false;
    }

    const barcodeInput = document.getElementById('barcode-input');
    if (barcodeInput) barcodeInput.focus();
    
    inizializzaListenerCampi();
    impostaDataOdierna();
});

function toggleGlobalHelp(stato) {
    mostraAiutiAttivo = stato;
    localStorage.setItem('eat_me_first_help', stato);
}

function inizializzaListenerCampi() {
    const gruppi = document.querySelectorAll('.form-group');
    gruppi.forEach((gruppo, index) => {
        const input = gruppo.querySelector('input, select');
        if (input && gruppo.dataset.help) {
            const campoId = input.id || `campo_${index}`;
            
            input.addEventListener('focus', () => {
                if (!mostraAiutiAttivo) return;

                const oggi = new Date().toISOString().split('T')[0];
                const ultimiAiutiLetti = JSON.parse(localStorage.getItem('eat_me_first_visti') || "{}");

                if (ultimiAiutiLetti[campoId] === oggi) return;

                mostraTooltipModal(gruppo.dataset.help, campoId);
            });
        }
    });
}

function mostraTooltipModal(testo, campoId) {
    let modal = document.getElementById('tooltip-modal');
    if (!modal) return;

    document.getElementById('tooltip-text').textContent = testo;
    modal.dataset.campoAttivo = campoId;
    modal.style.display = 'flex';
}

function chiudiTooltip() {
    const modal = document.getElementById('tooltip-modal');
    if (!modal) return;

    const campoId = modal.dataset.campoAttivo;

    if (campoId) {
        const oggi = new Date().toISOString().split('T')[0];
        let ultimiAiutiLetti = JSON.parse(localStorage.getItem('eat_me_first_visti') || "{}");
        ultimiAiutiLetti[campoId] = oggi;
        localStorage.setItem('eat_me_first_visti', JSON.stringify(ultimiAiutiLetti));
    }

    modal.style.display = 'none';
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
    const reader = document.getElementById('reader');
    if (reader) reader.style.display = 'none';
    const btnCam = document.getElementById('btn-toggle-cam');
    if (btnCam) btnCam.textContent = "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

async function cercaBarcodeMultiplo() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcodeInput = document.getElementById('barcode-input');
    if (!barcodeInput) return;
    const barcode = barcodeInput.value.trim();
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

            // PULIZIA TOTALE DEI CAMPI SCADENZA: NESSUNA STIMA PRECOMPILATA
            pulisciTuttiCampiScadenza();

            const imgEl = document.getElementById('img-anteprima');
            if(immagine && imgEl) {
                imgEl.src = immagine;
                imgEl.style.display = 'block';
            } else if (imgEl) {
                imgEl.style.display = 'none';
            }

            document.getElementById('preview-prodotto').style.display = 'block';
            
            // Focus immediato sul campo giorni per procedere subito all'inserimento
            document.getElementById('stima-giorni').focus();
        } else {
            gestisciProdottoNonTrovato(barcode);
        }
    } catch (error) {
        gestisciProdottoNonTrovato(barcode);
    }
}

function impostaCategoriaIntelligente(fonte, nomeProdotto) {
    const selectCat = document.getElementById('categoria-prodotto');
    if (!selectCat) return;
    const t = nomeProdotto.toLowerCase();

    if (fonte === "igiene" || t.includes('dentifricio') || t.includes('shampoo') || t.includes('sapone') || t.includes('bagnoschiuma') || t.includes('deodorante')) {
        selectCat.value = "Igiene";
    } else if (fonte === "casa" || t.includes('pile') || t.includes('batterie') || t.includes('piatti') || t.includes('bicchieri') || t.includes('tovaglioli') || t.includes('carta igienica') || t.includes('scottex') || t.includes('alluminio')) {
        selectCat.value = "Casa & Varie";
    } else if (t.includes('detersivo') || t.includes('candeggina') || t.includes('sgrassatore') || t.includes('ammorbidente') || t.includes('pavimenti')) {
        selectCat.value = "Pulizia";
    } else if (t.includes('latte') || t.includes('yogurt') || t.includes('formaggio') || t.includes('mozzarella') || t.includes('burro')) {
        selectCat.value = "Latticini";
    } else if (t.includes('acqua') || t.includes('bibita') || t.includes('succo') || t.includes('vino')  || t.includes('birra')) {
        selectCat.value = "Bevande";
    } else if (t.includes('prosciutto') || t.includes('salame') || t.includes('bresaola') || t.includes('speck')) {
        selectCat.value = "Salumeria";
    } else {
        selectCat.value = "Dispensa / Generi alimentari";
    }
}

function pulisciTuttiCampiScadenza() {
    document.getElementById('stima-giorni').value = '';
    document.getElementById('stima-mesi').value = '';
    document.getElementById('scad-gg').value = '';
    document.getElementById('scad-mm').value = '';
    document.getElementById('scad-aa').value = '';
}

function pulisciAltriCampiScadenza(origine) {
    if (origine === 'giorni') {
        document.getElementById('stima-mesi').value = '';
        document.getElementById('scad-gg').value = '';
        document.getElementById('scad-mm').value = '';
        document.getElementById('scad-aa').value = '';
    } else if (origine === 'mesi') {
        document.getElementById('stima-giorni').value = '';
        document.getElementById('scad-gg').value = '';
        document.getElementById('scad-mm').value = '';
        document.getElementById('scad-aa').value = '';
    } else if (origine === 'data') {
        document.getElementById('stima-giorni').value = '';
        document.getElementById('stima-mesi').value = '';
    }
}

function saltoAutomatico(corrente, prossimoId, maxLunghezza) {
    if (corrente.value.length >= maxLunghezza) {
        document.getElementById(prossimoId).focus();
    }
}

function aggiornaListaUbicazioniDinamiche(ubicazioneSelezionata = "") {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    const selectUbicazione = document.getElementById('ubicazione');
    if (!selectUbicazione) return;
    
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
    const infConv = document.getElementById('inf-conversione');
    if (infConv) {
        infConv.textContent = rawQuantity ? `💡 Confezione singola (${rawQuantity})` : `💡 Confezione singola`;
    }
}

function abilitaCompilazioneManuale() {
    if (cameraAttiva) chiudiFotocamera();
    aggiornaListaUbicazioniDinamiche("");
    
    const preview = document.getElementById('preview-prodotto');
    if (preview) preview.style.display = 'block';
    
    const nomeProd = document.getElementById('nome-prodotto');
    if (nomeProd) {
        nomeProd.value = "";
        nomeProd.focus();
    }
    const marcaProd = document.getElementById('marca-prodotto');
    if (marcaProd) marcaProd.value = "";
    
    const infNome = document.getElementById('inf-nome');
    if (infNome) infNome.textContent = "Inserimento manuale";
    const infMarca = document.getElementById('inf-marca');
    if (infMarca) infMarca.textContent = "Locale";
    
    const imgAnt = document.getElementById('img-anteprima');
    if (imgAnt) imgAnt.style.display = 'none';

    pulisciTuttiCampiScadenza();
    impostaDataOdierna();
}

function gestisciProdottoNonTrovato(barcode) {
    document.getElementById('inf-nome').textContent = "Non catalogato";
    document.getElementById('inf-marca').textContent = "Inserimento manuale";
    const imgAnt = document.getElementById('img-anteprima');
    if (imgAnt) imgAnt.style.display = 'none';
    
    aggiornaListaUbicazioniDinamiche("");
    
    const preview = document.getElementById('preview-prodotto');
    if (preview) preview.style.display = 'block';
    
    const nomeProd = document.getElementById('nome-prodotto');
    if (nomeProd) {
        nomeProd.value = `Prodotto [${barcode}]`;
        nomeProd.focus();
    }
    const marcaProd = document.getElementById('marca-prodotto');
    if (marcaProd) marcaProd.value = "";
    const quantita = document.getElementById('quantita');
    if (quantita) quantita.value = "1";

    pulisciTuttiCampiScadenza();
}

function registraCarico(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-prodotto').value.trim();
    const barcode = document.getElementById('barcode-input').value.trim();
    const ubicazioneScelta = document.getElementById('ubicazione').value;
    const quantitaInput = document.getElementById('quantita');

    if (!ubicazioneScelta || ubicazioneScelta === "__nuova__") {
        alert("Attenzione: seleziona o crea un'ubicazione valida per il prodotto.");
        document.getElementById('ubicazione').focus();
        return;
    }

    if (!quantitaInput || !quantitaInput.value.trim() || parseInt(quantitaInput.value) <= 0) {
        alert("Attenzione: inserisci una quantità valida.");
        quantitaInput.focus();
        return;
    }

    // Calcolo della scadenza basato esclusivamente sull'input scelto dall'utente
    let scadenzaVal = "";
    const giorniInput = document.getElementById('stima-giorni').value.trim();
    const mesiInput = document.getElementById('stima-mesi').value.trim();
    
    const gg = document.getElementById('scad-gg').value.trim();
    const mm = document.getElementById('scad-mm').value.trim();
    const aa = document.getElementById('scad-aa').value.trim();

    const oggi = new Date();

    if (gg && mm && aa) {
        const annoPieno = aa.length === 2 ? `20${aa}` : aa;
        scadenzaVal = `${annoPieno}-${mm.padStart(2, '0')}-${gg.padStart(2, '0')}`;
    } else if (giorniInput) {
        oggi.setDate(oggi.getDate() + parseInt(giorniInput));
        scadenzaVal = oggi.toISOString().split('T')[0];
    } else if (mesiInput) {
        oggi.setMonth(oggi.getMonth() + parseInt(mesiInput));
        scadenzaVal = oggi.toISOString().split('T')[0];
    } else {
        scadenzaVal = "Nessuna scadenza";
    }

    const confermaMessaggio = `Confermi il carico di "${nome}" con scadenza al ${scadenzaVal}?`;
    if (!confirm(confermaMessaggio)) {
        return; 
    }

    const nuovoArticolo = {
        id: Date.now(),
        barcode: barcode,
        categoria: document.getElementById('categoria-prodotto').value,
        nome: nome,
        marca: document.getElementById('marca-prodotto').value.trim(),
        ubicazione: ubicazioneScelta,
        scadenza: scadenzaVal,
        quantita: parseInt(quantitaInput.value) || 1,
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