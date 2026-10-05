/* ==========================================
   CHEFSTOCK - LOGICA ENTRATA & SCANSIONE MERCI
   ========================================== */

let html5QrCode = null;
let cameraAttiva = false;

// Al caricamento della pagina inizializza la data odierna e carica le ubicazioni
document.addEventListener('DOMContentLoaded', () => {
    impostaDataOdierna();
    caricaUbicazioniSalvate();
});

function impostaDataOdierna() {
    const oggi = new Date().toISOString().split('T')[0];
    const campoData = document.getElementById('data-carico');
    if (campoData) {
        campoData.value = oggi;
    }
}

// --- Gestione Fotocamera e Scanner Barcode ---
function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');

    if (!cameraAttiva) {
        readerDiv.style.display = 'block';
        btnCam.innerText = "🛑 Chiudi Fotocamera";
        cameraAttiva = true;

        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                // Barcode scansionato con successo
                document.getElementById('barcode-input').value = decodedText;
                fermaFotocamera();
                gestisciCodiceTrovato(decodedText);
            },
            (errorMessage) => {
                // Errori di scansione ignorati per fluidità
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

function fermaFotocamera() {
    if (html5QrCode && cameraAttiva) {
        html5QrCode.stop().then(() => {
            html5QrCode.clear();
            chiudiStreamFotocamera();
        }).catch(err => {
            console.error("Errore arresto scanner:", err);
            chiudiStreamFotocamera();
        });
    } else {
        chiudiStreamFotocamera();
    }
}

function chiudiStreamFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');
    readerDiv.style.display = 'none';
    btnCam.innerText = "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

// Gestione invio/spazio sul campo barcode o digitazione manuale
function handleBarcodeKey(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const barcode = document.getElementById('barcode-input').value.trim();
        if (barcode) {
            gestisciCodiceTrovato(barcode);
        }
    }
}

function gestisciCodiceTrovato(barcode) {
    // Mostra il form di preview dei dettagli prodotto
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('inf-nome').innerText = "Codice " + barcode;
    
    // Esempio simulato di riconoscimento base o recupero offline
    document.getElementById('nome-prodotto').focus();
}

function abilitaCompilazioneManuale() {
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('barcode-input').value = "MANUALE-" + Date.now();
    document.getElementById('inf-nome').innerText = "Inserimento Manuale / Articolo Libero";
    document.getElementById('nome-prodotto').focus();
}

// --- Analisi Testuale e Categorie ---
function analizzaDescrizioneTestuale(testo) {
    const t = testo.toLowerCase();
    const selectCategoria = document.getElementById('categoria-prodotto');

    if (t.includes('carton') || t.includes('scatola') || t.includes('sacchet') || t.includes('asporto')) {
        selectCategoria.value = 'Packaging & Asporto';
    } else if (t.includes('tovagli') || t.includes('bicchier') || t.includes('piatt') || t.includes('sala')) {
        selectCategoria.value = 'Sala & Consumo';
    } else if (t.includes('detergent') || t.includes('sgrassator') || t.includes('candeggina') || t.includes('puliz')) {
        selectCategoria.value = 'Pulizia & Detergenti';
    } else if (t.includes('latte') || t.includes('mozzarell') || t.includes('formaggio') || t.includes('yogurt')) {
        selectCategoria.value = 'Latticini';
    } else if (t.includes('mela') || t.includes('insalat') || t.includes('verdura') || t.includes('frutta')) {
        selectCategoria.value = 'Ortofrutta';
    }
}

// --- Gestione Scadenza Pulita ---
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

function saltoAutomatico(corrente, prossimoId, maxLen) {
    if (corrente.value.length >= maxLen && prossimoId) {
        document.getElementById(prossimoId).focus();
    }
}

function impostaTipoScadenza(tipo) {
    const containerScadenza = document.querySelector('.scadenza-box-container');
    if (tipo === 'nessuna') {
        containerScadenza.style.opacity = '0.3';
        containerScadenza.style.pointerEvents = 'none';
        document.getElementById('stima-giorni').value = '';
        document.getElementById('stima-mesi').value = '';
        document.getElementById('scad-gg').value = '';
        document.getElementById('scad-mm').value = '';
        document.getElementById('scad-aa').value = '';
    } else {
        containerScadenza.style.opacity = '1';
        containerScadenza.style.pointerEvents = 'auto';
    }
}

// --- Ubicazioni Dinamiche ---
function caricaUbicazioniSalvate() {
    const selectUbicazione = document.getElementById('ubicazione');
    // Ubicazioni predefinite per la ristorazione
    const ubicazioniDefault = [
        "Cella Frigo Principale",
        "Frigo Negozio / Esposizione",
        "Congelatore / Freezer",
        "Dispensa / Magazzino Secchi",
        "Scaffale Sala / Servizio",
        "Locale Pulizie & Detergenti"
    ];

    ubicazioniDefault.forEach(ub => {
        let opt = document.createElement('option');
        opt.value = ub;
        opt.textContent = "📍 " + ub;
        selectUbicazione.appendChild(opt);
    });
}

// --- Righe Extra Dinamiche ---
function aggiungiRigaExtra() {
    const container = document.getElementById('container-campi-extra');
    const nuovaRiga = document.createElement('div');
    nuovaRiga.className = 'extra-row';
    nuovaRiga.innerHTML = `
        <input type="text" placeholder="Etichetta" class="extra-label">
        <input type="text" placeholder="Valore" class="extra-valore">
    `;
    container.appendChild(nuovaRiga);
}

// --- Registrazione Carico ---
function registraCarico(event) {
    event.preventDefault();

    const barcode = document.getElementById('barcode-input').value;
    const categoria = document.getElementById('categoria-prodotto').value;
    const nome = document.getElementById('nome-prodotto').value;
    const marca = document.getElementById('marca-prodotto').value;
    const ubicazione = document.getElementById('ubicazione').value;
    const quantita = document.getElementById('quantita').value;
    const unita = document.getElementById('unita-misura').value;
    const note = document.getElementById('note-prodotto').value;

    const tipoScadenza = document.querySelector('input[name="tipo-scadenza"]:checked').value;
    let giorni = document.getElementById('stima-giorni').value;
    let mesi = document.getElementById('stima-mesi').value;
    let gg = document.getElementById('scad-gg').value;
    let mm = document.getElementById('scad-mm').value;
    let aa = document.getElementById('scad-aa').value;

    const articoloRegistrato = {
        barcode,
        categoria,
        nome,
        marca,
        ubicazione,
        quantita,
        unita,
        note,
        scadenza: {
            tipo: tipoScadenza,
            giorni: giorni || null,
            mesi: mesi || null,
            dataEsatta: (gg && mm && aa) ? `${aa}-${mm}-${gg}` : null
        },
        dataCarico: new Date().toISOString()
    };

    console.log("Articolo registrato con successo in ChefStock:", articoloRegistrato);
    alert("Articolo registrato correttamente in ChefStock!");

    // Reset del form
    document.querySelector('form').reset();
    document.getElementById('preview-prodotto').style.display = 'none';
    impostaDataOdierna();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Gestione Guide e Tooltip ---
function chiudiGuidaIniziale() {
    document.getElementById('intro-guide-box').style.display = 'none';
}

function toggleGlobalHelp(mostra) {
    const minibuttons = document.querySelectorAll('.btn-help-mini');
    minibuttons.forEach(btn => {
        btn.style.display = mostra ? 'inline-block' : 'none';
    });
}

function mostraTooltipDaHelp(btnElement) {
    const formGroup = btnElement.closest('.form-group');
    const helpText = formGroup.getAttribute('data-help');
    if (helpText) {
        document.getElementById('tooltip-text').innerText = helpText;
        document.getElementById('tooltip-modal').style.display = 'flex';
    }
}

function chiudiTooltip() {
    document.getElementById('tooltip-modal').style.display = 'none';
}

function apriGuidaPrincipale() {
    document.getElementById('tooltip-text').innerText = "ChefStock Pro: Inquadra il codice a barre o inserisci l'articolo manualmente. Compila la quantità, scegli la modalità di scadenza pulita e registra l'inventario.";
    document.getElementById('tooltip-modal').style.display = 'flex';
}