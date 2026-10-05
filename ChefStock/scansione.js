/* ==========================================
   CHEFSTOCK - LOGICA ENTRATA & SCANSIONE MERCI
   ========================================== */

let html5QrCode = null;
let cameraAttiva = false;
let linguaCorrente = 'it';

// Dizionario Traduzioni (IT, EN, FR, ES, DE)
const traduzioni = {
    it: {
        btn_back: "← Menu Principale",
        lbl_guida: "Guida",
        guide_title: "💡 Come funziona l'Entrata Merci",
        guide_text: "Inquadra qualsiasi codice a barre o digitalo manualmente. Compila i dati del prodotto, seleziona il tipo di scadenza e registra l'articolo nel tuo inventario!",
        main_title: "Entrata & Scansione Merci",
        lbl_barcode: "🔍 Scanner Barcode (Usa Spazio o Invio)",
        btn_camera: "📷 Attiva Fotocamera / Scanner",
        btn_manuale: "✏️ Inserimento Manuale / Senza Barcode (Fatto in casa, Contadino, Materiali)",
        section_details: "Dettagli Articolo / Prodotto",
        lbl_categoria: "Categoria",
        cat_latticini: "🥛 Latticini & Freschi",
        cat_ortofrutta: "🍎 Ortofrutta & Mercato",
        cat_salumeria: "🥓 Salumeria & Carni",
        cat_dispensa: "🥫 Dispensa / Alimentari",
        cat_surgelati: "❄ Surgelati & Piatti Pronti",
        cat_bevande: "🧃 Bevande",
        cat_packaging: "📦 Packaging (Cartoni pizza, sacchetti)",
        cat_sala: "🍽️ Sala (Tovaglioli, tovaglie, bicchieri)",
        cat_pulizia: "🧹 Pulizia & Detergenti",
        cat_igiene: "🧴 Igiene & Carta",
        cat_altro: "⚡ Altro / Varie",
        lbl_descrizione: "Descrizione / Nome Articolo (Max 60 caratteri)",
        lbl_marca: "Marca / Origine (Opzionale, Max 40 caratteri)",
        lbl_ubicazione: "Ubicazione (Gestita da te)",
        opt_select_ub: "-- Seleziona ubicazione --",
        btn_nuova_ub: "+ Nuova",
        lbl_quantita: "Quantità & Unità",
        un_pezzi: "Pezzi",
        un_confezioni: "Confezioni",
        un_kg: "Chilogrammi (kg)",
        un_g: "Grammi (g)",
        un_litri: "Litri (L)",
        lbl_tipo_scadenza: "Che scadenza è?",
        scad_tassativa: "Scadenza Tassativa (Rosso)",
        scad_consigliata: "Scadenza Consigliata (Giallo)",
        scad_nessuna: "Senza Scadenza (Consumo/Materiale)",
        lbl_tra_giorni: "⏳ Tra quanti giorni scade?",
        lbl_tra_mesi: "📅 Tra quanti mesi scade?",
        lbl_data_esatta: "Oppure inserisci la data esatta stampata:",
        lbl_info_extra: "➕ Informazioni Extra Personalizzate",
        extra_desc: "Qui puoi aggiungere etichette libere utili alla tua gestione (es. <strong>Lotto</strong>: L-402, <strong>Allergeni</strong>: Glutine/Lattosio, <strong>Temperatura</strong>: +4°C, <strong>Fornitore</strong>: Rossi SRL).",
        btn_add_extra: "+ Aggiungi altra riga",
        lbl_note: "📝 Note, Ricette o Istruzioni (Testo Lungo)",
        btn_registra: "Conferma e Registra in ChefStock",
        link_torna_menu: "← Torna al Pannello di Controllo",
        modal_title: "💡 Suggerimento Utile",
        btn_capito: "Ho capito"
    },
    en: {
        btn_back: "← Main Menu",
        lbl_guida: "Guide",
        guide_title: "💡 How Goods Receipt Works",
        guide_text: "Scan any barcode or type it manually. Fill in product details, select expiration type, and log the item into inventory!",
        main_title: "Goods Receipt & Scanning",
        lbl_barcode: "🔍 Barcode Scanner (Use Space or Enter)",
        btn_camera: "📷 Activate Camera / Scanner",
        btn_manuale: "✏️ Manual Entry / No Barcode (Homemade, Farm, Supplies)",
        section_details: "Item / Product Details",
        lbl_categoria: "Category",
        cat_latticini: "🥛 Dairy & Fresh",
        cat_ortofrutta: "🍎 Produce & Market",
        cat_salumeria: "🥓 Deli & Meats",
        cat_dispensa: "🥫 Pantry / Groceries",
        cat_surgelati: "❄ Frozen & Ready Meals",
        cat_bevande: "🧃 Beverages",
        cat_packaging: "📦 Packaging (Pizza boxes, bags)",
        cat_sala: "🍽️ Dining Room (Napkins, tablecloths, glasses)",
        cat_pulizia: "🧹 Cleaning & Detergents",
        cat_igiene: "🧴 Hygiene & Paper",
        cat_altro: "⚡ Other / Misc",
        lbl_descrizione: "Description / Item Name (Max 60 chars)",
        lbl_marca: "Brand / Origin (Optional, Max 40 chars)",
        lbl_ubicazione: "Location (Managed by you)",
        opt_select_ub: "-- Select location --",
        btn_nuova_ub: "+ New",
        lbl_quantita: "Quantity & Unit",
        un_pezzi: "Pieces",
        un_confezioni: "Packs",
        un_kg: "Kilograms (kg)",
        un_g: "Grams (g)",
        un_litri: "Liters (L)",
        lbl_tipo_scadenza: "Expiration Type?",
        scad_tassativa: "Strict Expiration (Red)",
        scad_consigliata: "Recommended Expiration (Yellow)",
        scad_nessuna: "No Expiration (Consumable/Supply)",
        lbl_tra_giorni: "⏳ Expires in how many days?",
        lbl_tra_mesi: "📅 Expires in how many months?",
        lbl_data_esatta: "Or enter the exact printed date:",
        lbl_info_extra: "➕ Custom Extra Info",
        extra_desc: "Here you can add custom labels useful for your management (e.g. <strong>Batch</strong>: L-402, <strong>Allergens</strong>: Gluten/Lactose, <strong>Temp</strong>: +4°C, <strong>Supplier</strong>: Rossi SRL).",
        btn_add_extra: "+ Add another row",
        lbl_note: "📝 Notes, Recipes or Instructions (Long Text)",
        btn_registra: "Confirm and Log in ChefStock",
        link_torna_menu: "← Back to Dashboard",
        modal_title: "💡 Useful Tip",
        btn_capito: "Got it"
    },
    fr: {
        btn_back: "← Menu Principal",
        lbl_guida: "Guide",
        guide_title: "💡 Fonctionnement de la Réception",
        guide_text: "Scannez un code-barres ou saisissez-le. Remplissez les détails et enregistrez l'article dans votre inventaire !",
        main_title: "Réception & Scan des Marchandises",
        lbl_barcode: "🔍 Scanner Code-barres (Espace ou Entrée)",
        btn_camera: "📷 Activer Caméra / Scanner",
        btn_manuale: "✏️ Saisie Manuelle / Sans Code-barres",
        section_details: "Détails de l'Article",
        lbl_categoria: "Catégorie",
        cat_latticini: "🥛 Produits laitiers & Frais",
        cat_ortofrutta: "🍎 Fruits & Légumes",
        cat_salumeria: "🥓 Charcuterie & Viandes",
        cat_dispensa: "🥫 Épicerie / Conserves",
        cat_surgelati: "❄ Surgelés",
        cat_bevande: "🧃 Boissons",
        cat_packaging: "📦 Emballage",
        cat_sala: "🍽️ Salle",
        cat_pulizia: "🧹 Nettoyage",
        cat_igiene: "🧴 Hygiène",
        cat_altro: "⚡ Autre",
        lbl_descrizione: "Description / Nom (Max 60 car.)",
        lbl_marca: "Marque / Origine (Optionnel)",
        lbl_ubicazione: "Emplacement (Géré par vous)",
        opt_select_ub: "-- Sélectionner emplacement --",
        btn_nuova_ub: "+ Nouveau",
        lbl_quantita: "Quantité & Unité",
        un_pezzi: "Pièces",
        un_confezioni: "Paquets",
        un_kg: "Kilogrammes (kg)",
        un_g: "Grammes (g)",
        un_litri: "Litres (L)",
        lbl_tipo_scadenza: "Type de péremption ?",
        scad_tassativa: "Péremption Stricte (Rouge)",
        scad_consigliata: "Péremption Conseillée (Jaune)",
        scad_nessuna: "Sans Péremption",
        lbl_tra_giorni: "⏳ Expire dans combien de jours ?",
        lbl_tra_mesi: "📅 Expire dans combien de mois ?",
        lbl_data_esatta: "Ou entrez la date exacte :",
        lbl_info_extra: "➕ Infos Extra Personnalisées",
        extra_desc: "Ajoutez des étiquettes libres (ex. <strong>Lot</strong>: L-402, <strong>Allergènes</strong>: Gluten, <strong>Fournisseur</strong>: Rossi SRL).",
        btn_add_extra: "+ Ajouter une ligne",
        lbl_note: "📝 Notes ou Instructions",
        btn_registra: "Confirmer et Enregistrer",
        link_torna_menu: "← Retour au Tableau de Bord",
        modal_title: "💡 Astuce",
        btn_capito: "Compris"
    },
    es: {
        btn_back: "← Menú Principal",
        lbl_guida: "Guía",
        guide_title: "💡 Cómo funciona la Entrada de Mercancías",
        guide_text: "Escanea cualquier código de barras o ingrésalo manualmente. ¡Completa los datos y registra el artículo!",
        main_title: "Entrada y Escaneo de Mercancías",
        lbl_barcode: "🔍 Escáner de Código de Barras (Espacio o Enter)",
        btn_camera: "📷 Activar Cámara / Escáner",
        btn_manuale: "✏️ Ingreso Manual / Sin Código de Barras",
        section_details: "Detalles del Artículo",
        lbl_categoria: "Categoría",
        cat_latticini: "🥛 Lácteos y Frescos",
        cat_ortofrutta: "🍎 Frutas y Verduras",
        cat_salumeria: "🥓 Embutidos y Carnes",
        cat_dispensa: "🥫 Despensa / Abarrotes",
        cat_surgelati: "❄ Congelados",
        cat_bevande: "🧃 Bebidas",
        cat_packaging: "📦 Embalaje",
        cat_sala: "🍽️ Sala",
        cat_pulizia: "🧹 Limpieza",
        cat_igiene: "🧴 Higiene",
        cat_altro: "⚡ Otro",
        lbl_descrizione: "Descripción / Nombre (Máx 60 car.)",
        lbl_marca: "Marca / Origen (Opcional)",
        lbl_ubicazione: "Ubicación (Gestionada por ti)",
        opt_select_ub: "-- Seleccionar ubicación --",
        btn_nuova_ub: "+ Nueva",
        lbl_quantita: "Cantidad y Unidad",
        un_pezzi: "Piezas",
        un_confezioni: "Paquetes",
        un_kg: "Kilogramos (kg)",
        un_g: "Gramos (g)",
        un_litri: "Litros (L)",
        lbl_tipo_scadenza: "¿Qué tipo de caducidad es?",
        scad_tassativa: "Caducidad Estricta (Rojo)",
        scad_consigliata: "Caducidad Recomendada (Amarillo)",
        scad_nessuna: "Sin Caducidad",
        lbl_tra_giorni: "⏳ ¿En cuántos días caduca?",
        lbl_tra_mesi: "📅 ¿En cuántos meses caduca?",
        lbl_data_esatta: "O ingresa la fecha exacta:",
        lbl_info_extra: "➕ Información Extra Personalizada",
        extra_desc: "Añade etiquetas libres (ej. <strong>Lote</strong>: L-402, <strong>Alérgenos</strong>: Gluten, <strong>Proveedor</strong>: Rossi SRL).",
        btn_add_extra: "+ Añadir otra fila",
        lbl_note: "📝 Notas o Instrucciones",
        btn_registra: "Confirmar y Registrar",
        link_torna_menu: "← Volver al Panel",
        modal_title: "💡 Sugerencia",
        btn_capito: "Entendido"
    },
    de: {
        btn_back: "← Hauptmenü",
        lbl_guida: "Anleitung",
        guide_title: "💡 So funktioniert der Wareneingang",
        guide_text: "Scannen Sie einen Barcode oder geben Sie ihn manuell ein. Produktdaten ausfüllen und im Inventar speichern!",
        main_title: "Wareneingang & Scannen",
        lbl_barcode: "🔍 Barcode-Scanner (Leertaste oder Enter)",
        btn_camera: "📷 Kamera / Scanner aktivieren",
        btn_manuale: "✏️ Manuelle Eingabe / Ohne Barcode",
        section_details: "Artikeldetails",
        lbl_categoria: "Kategorie",
        cat_latticini: "🥛 Milchprodukte & Frisches",
        cat_ortofrutta: "🍎 Obst & Gemüse",
        cat_salumeria: "🥓 Wurst & Fleisch",
        cat_dispensa: "🥫 Vorrat / Lebensmittel",
        cat_surgelati: "❄ Tiefkühlkost",
        cat_bevande: "🧃 Getränke",
        cat_packaging: "📦 Verpackung",
        cat_sala: "🍽️ Service",
        cat_pulizia: "🧹 Reinigung",
        cat_igiene: "🧴 Hygiene",
        cat_altro: "⚡ Sonstiges",
        lbl_descrizione: "Beschreibung / Artikelname (Max. 60 Zeichen)",
        lbl_marca: "Marke / Herkunft (Optional)",
        lbl_ubicazione: "Lagerort (Von Ihnen verwaltet)",
        opt_select_ub: "-- Lagerort wählen --",
        btn_nuova_ub: "+ Neu",
        lbl_quantita: "Menge & Einheit",
        un_pezzi: "Stück",
        un_confezioni: "Packungen",
        un_kg: "Kilogramm (kg)",
        un_g: "Gramm (g)",
        un_litri: "Liter (L)",
        lbl_tipo_scadenza: "Welche Haltbarkeit?",
        scad_tassativa: "Striktes Ablaufdatum (Rot)",
        scad_consigliata: "Empfohlenes Ablaufdatum (Gelb)",
        scad_nessuna: "Kein Ablaufdatum",
        lbl_tra_giorni: "⏳ In wie vielen Tagen läuft es ab?",
        lbl_tra_mesi: "📅 In wie vielen Monaten läuft es ab?",
        lbl_data_esatta: "Oder genaues Datum eingeben:",
        lbl_info_extra: "➕ Benutzerdefinierte Extra-Infos",
        extra_desc: "Fügen Sie freie Labels hinzu (z.B. <strong>Charge</strong>: L-402, <strong>Allergene</strong>: Gluten, <strong>Lieferant</strong>: Rossi SRL).",
        btn_add_extra: "+ Weitere Zeile hinzufügen",
        lbl_note: "📝 Notizen oder Anweisungen",
        btn_registra: "Bestätigen und Speichern",
        link_torna_menu: "← Zurück zum Dashboard",
        modal_title: "💡 Nützlicher Tipp",
        btn_capito: "Verstanden"
    }
};

function cambiaLingua(lingua) {
    linguaCorrente = lingua;
    const t = traduzioni[lingua];
    if (!t) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) {
            el.innerHTML = t[chiave];
        }
    });
}

// Al caricamento della pagina inizializza data, ubicazioni e lingua
document.addEventListener('DOMContentLoaded', () => {
    impostaDataOdierna();
    caricaUbicazioniUtente();
    cambiaLingua('it');
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
        btnCam.innerText = linguaCorrente === 'en' ? "🛑 Close Camera" : (linguaCorrente === 'fr' ? "🛑 Fermer Caméra" : (linguaCorrente === 'es' ? "🛑 Cerrar Cámara" : (linguaCorrente === 'de' ? "🛑 Kamera schließen" : "🛑 Chiudi Fotocamera")));
        cameraAttiva = true;

        html5QrCode = new Html5Qrcode("reader");
        html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 150 } },
            (decodedText) => {
                document.getElementById('barcode-input').value = decodedText;
                fermaFotocamera();
                gestisciCodiceTrovato(decodedText);
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

function chiudiStreamFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');
    readerDiv.style.display = 'none';
    btnCam.innerHTML = linguaCorrente === 'en' ? "📷 Activate Camera / Scanner" : "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

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
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('nome-prodotto').focus();
}

function abilitaCompilazioneManuale() {
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('barcode-input').value = "MANUALE-" + Date.now();
    document.getElementById('nome-prodotto').focus();
}

// --- Analisi Testuale e Categorie ---
function analizzaDescrizioneTestuale(testo) {
    const t = testo.toLowerCase();
    const selectCategoria = document.getElementById('categoria-prodotto');

    if (t.includes('carton') || t.includes('scatola') || t.includes('sacchet') || t.includes('asporto') || t.includes('box')) {
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

// --- Gestione Ubicazioni Dinamiche dell'Utente ---
function caricaUbicazioniUtente() {
    const selectUbicazione = document.getElementById('ubicazione-select');
    const defaultOptText = traduzioni[linguaCorrente]?.opt_select_ub || "-- Seleziona ubicazione --";
    selectUbicazione.innerHTML = `<option value="" disabled selected>${defaultOptText}</option>`;
    
    let ubicazioniSalvate = JSON.parse(localStorage.getItem('chefstock_ubicazioni')) || [];
    
    ubicazioniSalvate.forEach(ub => {
        let opt = document.createElement('option');
        opt.value = ub;
        opt.textContent = "📍 " + ub;
        selectUbicazione.appendChild(opt);
    });
}

function attivaNuovaUbicazione() {
    const selectUbicazione = document.getElementById('ubicazione-select');
    const inputNuova = document.getElementById('ubicazione-nuova');
    const btnNuova = document.getElementById('btn-toggle-nuova-ub');

    selectUbicazione.style.display = 'none';
    selectUbicazione.value = '';
    inputNuova.style.display = 'block';
    inputNuova.focus();
    btnNuova.innerText = "Annulla";
    btnNuova.setAttribute('onclick', 'annullaNuovaUbicazione()');
}

function annullaNuovaUbicazione() {
    const selectUbicazione = document.getElementById('ubicazione-select');
    const inputNuova = document.getElementById('ubicazione-nuova');
    const btnNuova = document.getElementById('btn-toggle-nuova-ub');

    inputNuova.style.display = 'none';
    inputNuova.value = '';
    selectUbicazione.style.display = 'block';
    btnNuova.innerText = traduzioni[linguaCorrente]?.btn_nuova_ub || "+ Nuova";
    btnNuova.setAttribute('onclick', 'attivaNuovaUbicazione()');
}

function gestisciCambioUbicazione(valore) {
    document.getElementById('ubicazione-nuova').value = '';
}

function sincronizzaNuovaUbicazione(valore) {}

function ottieniUbicazioneCorrente() {
    const inputNuova = document.getElementById('ubicazione-nuova');
    const selectUbicazione = document.getElementById('ubicazione-select');

    if (inputNuova.style.display !== 'none' && inputNuova.value.trim() !== '') {
        let nuovaUb = inputNuova.value.trim();
        salvaNuovaUbicazioneNelDatabase(nuovaUb);
        return nuovaUb;
    } else {
        return selectUbicazione.value;
    }
}

function salvaNuovaUbicazioneNelDatabase(nuovaUb) {
    let ubicazioniSalvate = JSON.parse(localStorage.getItem('chefstock_ubicazioni')) || [];
    if (!ubicazioniSalvate.includes(nuovaUb)) {
        ubicazioniSalvate.push(nuovaUb);
        localStorage.setItem('chefstock_ubicazioni', JSON.stringify(ubicazioniSalvate));
    }
}

// --- Gestione Scadenza con 3 Checkbox ---
function gestisciSelezioneScadenza(tipoSelezionato) {
    const chkTassativa = document.getElementById('chk-scad-tassativa');
    const chkConsigliata = document.getElementById('chk-scad-consigliata');
    const chkNessuna = document.getElementById('chk-scad-nessuna');
    const containerScadenza = document.querySelector('.scadenza-box-container');

    if (tipoSelezionato === 'tassativa') {
        chkTassativa.checked = true;
        chkConsigliata.checked = false;
        chkNessuna.checked = false;
    } else if (tipoSelezionato === 'consigliata') {
        chkTassativa.checked = false;
        chkConsigliata.checked = true;
        chkNessuna.checked = false;
    } else if (tipoSelezionato === 'nessuna') {
        chkTassativa.checked = false;
        chkConsigliata.checked = false;
        chkNessuna.checked = true;
    }

    if (chkNessuna.checked) {
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

// --- Righe Extra Dinamiche ---
function aggiungiRigaExtra() {
    const container = document.getElementById('container-campi-extra');
    const nuovaRiga = document.createElement('div');
    nuovaRiga.className = 'extra-row';
    nuovaRiga.innerHTML = `
        <input type="text" placeholder="Es. Fornitore / Temperatura" class="extra-label">
        <input type="text" placeholder="Es. Fornitore Rossi / +4°C" class="extra-valore">
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
    const ubicazione = ottieniUbicazioneCorrente();

    if (!ubicazione) {
        alert("Seleziona o inserisci un'ubicazione per l'articolo.");
        return;
    }

    const quantita = document.getElementById('quantita').value;
    const unita = document.getElementById('unita-misura').value;
    const note = document.getElementById('note-prodotto').value;

    let tipoScadenza = 'consigliata';
    if (document.getElementById('chk-scad-tassativa').checked) {
        tipoScadenza = 'tassativa';
    } else if (document.getElementById('chk-scad-nessuna').checked) {
        tipoScadenza = 'nessuna';
    }

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

    document.querySelector('form').reset();
    document.getElementById('preview-prodotto').style.display = 'none';
    annullaNuovaUbicazione();
    caricaUbicazioniUtente();
    document.getElementById('chk-scad-consigliata').checked = true;
    gestisciSelezioneScadenza('consigliata');
    impostaDataOdierna();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- Guide e Tooltip ---
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
    document.getElementById('tooltip-text').innerText = "ChefStock: Inquadra il codice a barre o inserisci l'articolo manualmente. Spunta la tipologia di scadenza e registra l'inventario.";
    document.getElementById('tooltip-modal').style.display = 'flex';
}