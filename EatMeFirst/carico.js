let html5QrCode = null;
let cameraAttiva = false;
let tipoScadenzaCorrente = "consigliata"; 
let mostraAiutiAttivo = true;
let isProdottoSenzaScadenza = false;

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

// Gestione pulita dei suggerimenti senza bloccare la digitazione
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

                // Se l'utente ha già chiuso l'aiuto oggi per questo campo, non facciamo nulla
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
    const reader = document.getElementById('reader');
    if (reader) reader.style.display = 'none';
    const btnCam = document.getElementById('btn-toggle-cam');
    if (btnCam) btnCam.textContent = "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

// Ricerca Multipla con gestione ubicazioni dinamiche e dizionario corposo
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
            analizzaScadenzaEValutaDizionario(fonteTrovata, nome);

            const imgEl = document.getElementById('img-anteprima');
            if(immagine && imgEl) {
                imgEl.src = immagine;
                imgEl.style.display = 'block';
            } else if (imgEl) {
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

function verificaDescrizioneDettagliata(testo) {
    const t = testo.trim().toLowerCase();
    const suggerimentoEl = document.getElementById('suggerimento-dettaglio');
    if (!suggerimentoEl) return;
    
    const generici = ['pomodori', 'verdura', 'frutta', 'formaggio', 'carne', 'pesce', 'pane', 'olio', 'farina'];
    
    if (generici.includes(t)) {
        suggerimentoEl.textContent = `💡 Suggerimento: specifica meglio (es. "${t} freschi" o "${t} secchi") per stimare la scadenza corretta!`;
    } else {
        suggerimentoEl.textContent = "";
        analizzaScadenzaEValutaDizionario("manuale", t);
    }
}

function analizzaScadenzaEValutaDizionario(fonte, nomeProdotto) {
    const t = nomeProdotto.toLowerCase();
    const boxSenzaScadenza = document.getElementById('box-senza-scadenza-container');
    const testoAvviso = document.getElementById('testo-avviso-scadenza');
    const containerInputData = document.getElementById('container-input-data');
    const badgeEl = document.getElementById('inf-tipo-scadenza-badge');

    if (!boxSenzaScadenza || !containerInputData || !badgeEl) return;

    isProdottoSenzaScadenza = false;
    boxSenzaScadenza.style.display = 'none';
    containerInputData.style.display = 'block';

    if (t.includes('tovaglioli') || t.includes('carta igienica') || t.includes('scottex') || t.includes('rotoloni') || t.includes('pile') || t.includes('batterie') || t.includes('piatti di plastica') || t.includes('bicchieri di plastica') || t.includes('candeggina') || t.includes('sgrassatore') || t.includes('pellicola') || t.includes('alluminio')) {
        boxSenzaScadenza.style.display = 'block';
        testoAvviso.textContent = "🔍 Questo articolo sembra un prodotto durevole o senza scadenza. Ha una data di scadenza?";
        badgeEl.innerHTML = '<span class="scadenza-badge" style="background: #30363d; color: #8b949e;">📦 Prodotto Durevole</span>';
        return;
    }

    let giorniStima = 30; 
    let tipoBadge = "consigliata";
    let testoBadge = "⏳ Scadenza Stimata (Dizionario)";

    if (t.includes('pasta') || t.includes('riso') || t.includes('farina') || t.includes('biscotti') || t.includes('caffè') || t.includes('zucchero') || t.includes('sale') || t.includes('tonno') || t.includes('passata') || t.includes('pelati') || t.includes('legumi') || t.includes('fagioli') || t.includes('ceci') || t.includes('piselli') || t.includes('olio') || t.includes('aceto') || t.includes('miele') || t.includes('marmellata') || t.includes('fette biscottate') || t.includes('crackers') || t.includes('cioccolato') || t.includes('latte uht')) {
        giorniStima = 365; 
    } else if (t.includes('latte fresco') || t.includes('yogurt') || t.includes('formaggio fresco') || t.includes('mozzarella') || t.includes('ricotta') || t.includes('stracchino') || t.includes('affettati') || t.includes('prosciutto') || t.includes('salame') || t.includes('carne') || t.includes('pesce') || t.includes('verdura') || t.includes('frutta')) {
        giorniStima = 5; 
        testoBadge = "⚠️ Prodotto Fresco: Verifica con attenzione l'etichetta!";
        tipoBadge = "fresco";
    }

    const d = new Date();
    d.setDate(d.getDate() + giorniStima);
    const campoScadenza = document.getElementById('scadenza');
    if (campoScadenza) campoScadenza.value = d.toISOString().split('T')[0];
    
    if (tipoBadge === "fresco") {
        badgeEl.innerHTML = `<span class="scadenza-badge" style="background: #9e6a03; color: #fff;">${testoBadge}</span>`;
    } else {
        badgeEl.innerHTML = `<span class="scadenza-badge badge-consigliata">${testoBadge}</span>`;
    }
}

function confermaSenzaScadenza(rispostaSi) {
    const boxSenzaScadenza = document.getElementById('box-senza-scadenza-container');
    const containerInputData = document.getElementById('container-input-data');
    const badgeEl = document.getElementById('inf-tipo-scadenza-badge');

    if (rispostaSi) {
        isProdottoSenzaScadenza = true;
        document.getElementById('scadenza').value = "";
        containerInputData.style.display = 'none';
        boxSenzaScadenza.style.display = 'none';
        badgeEl.innerHTML = '<span class="scadenza-badge" style="background: #238636; color: #fff;">✅ Nessuna Scadenza (Confermato)</span>';
    } else {
        isProdottoSenzaScadenza = false;
        boxSenzaScadenza.style.display = 'none';
        containerInputData.style.display = 'block';
        badgeEl.innerHTML = '<span class="scadenza-badge badge-consigliata">📅 Inserisci manualmente la data</span>';
        document.getElementById('scadenza').focus();
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

    let scadenzaVal = isProdottoSenzaScadenza ? "Nessuna scadenza" : (document.getElementById('scadenza').value || "Nessuna scadenza");

    const confermaMessaggio = isProdottoSenzaScadenza 
        ? `Confermi di caricare "${nome}" senza data di scadenza?` 
        : `Confermi la scadenza al ${scadenzaVal} per "${nome}"?`;

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