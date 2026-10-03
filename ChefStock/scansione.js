let html5QrCode = null;
let cameraAttiva = false;

// Dizionario delle traduzioni incorporato per garantire il funzionamento immediato
const traduzioniChefStock = {
    it: {
        title_page: "ChefStock - Entrata & Scansione Merci",
        btn_back: "← Menu Principale",
        lbl_guida: "Guida",
        guide_title: "💡 Come funziona l'Entrata Merci",
        guide_text: "Inquadra qualsiasi codice a barre (alimentari, bevande, detergenti, cartoni pizza, tovaglioli) o digitalo manualmente. Per i prodotti fatti in casa o del contadino, scrivi la descrizione: l'app riconoscerà la categoria. Gestisci le scadenze con le caselle rapide e aggiungi campi extra personalizzati!",
        main_heading: "Entrata & Scansione Merci",
        lbl_barcode: "🔍 Scanner Barcode & Database Globali",
        ph_barcode: "Scansiona o digita il codice a barre...",
        btn_camera: "📷 Attiva Fotocamera / Scanner",
        btn_manual: "✏️ Inserimento Manuale / Senza Barcode (Fatto in casa, Contadino, Materiali)",
        details_heading: "Dettagli Articolo / Prodotto",
        lbl_category: "Categoria",
        cat_dairy: "🥛 Latticini & Freschi",
        cat_fruit: "🍎 Ortofrutta & Mercato",
        cat_meat: "🥓 Salumeria & Carni",
        cat_pantry: "🥫 Dispensa / Alimentari",
        cat_frozen: "❄️ Surgelati & Piatti Pronti",
        cat_drinks: "🧃 Bevande",
        cat_packaging: "📦 Packaging (Cartoni pizza, sacchetti)",
        cat_hall: "🍽️ Sala (Tovaglioli, tovaglie, bicchieri)",
        cat_cleaning: "🧹 Pulizia & Detergenti",
        cat_hygiene: "🧴 Igiene & Carta",
        cat_other: "⚡ Altro / Varie",
        lbl_name: "Descrizione / Nome Articolo",
        ph_name: "Es. Cartoni pizza 33cm, Zuppa freezer...",
        lbl_brand: "Marca / Origine (Opzionale)",
        ph_brand: "Es. Fornitore, Casalingo...",
        lbl_location: "Ubicazione (Dinamica)",
        opt_select_location: "-- Seleziona o crea ubicazione --",
        lbl_qty: "Quantità & Unità",
        unit_pieces: "Pezzi",
        unit_packs: "Confezioni",
        unit_kg: "Chilogrammi (kg)",
        unit_g: "Grammi (g)",
        unit_liters: "Litri (L)",
        lbl_expiry: "Gestione Scadenza",
        exp_strict: "🔴 Tassativa",
        exp_recommended: "🟡 Consigliata",
        exp_none: "⚪ Senza Scadenza",
        info_auto: "ℹ️ Informazioni Automatiche Rilevate:",
        lbl_extra: "➕ Informazioni Extra Personalizzate",
        ph_extra_label: "Etichetta (es. Lotto)",
        ph_extra_val: "Valore (es. L-402)",
        btn_add_row: "Aggiungi altra riga",
        badge_premium: "(Funzione Premium futura)",
        lbl_notes: "📝 Note, Ricette o Istruzioni (Testo Lungo)",
        ph_notes: "Es. Scongelare lentamente in frigo...",
        btn_submit: "Conferma e Registra in ChefStock",
        link_back_menu: "← Torna al Pannello di Controllo",
        footer_sub: "Gestione professionale scorte, imballi & allergeni",
        modal_help_title: "💡 Suggerimento Utile",
        btn_understood: "Ho capito"
    },
    en: {
        title_page: "ChefStock - Goods In & Scanning",
        btn_back: "← Main Menu",
        lbl_guida: "Guide",
        guide_title: "💡 How Goods In Works",
        guide_text: "Scan any barcode (food, drinks, cleaning supplies, pizza boxes, napkins) or type it manually. For homemade or local farm products, type the description and the app will recognize the category. Manage expiration dates with quick boxes and add custom extra fields!",
        main_heading: "Goods In & Scanning",
        lbl_barcode: "🔍 Barcode Scanner & Global Databases",
        ph_barcode: "Scan or type barcode...",
        btn_camera: "📷 Turn on Camera / Scanner",
        btn_manual: "✏️ Manual Entry / No Barcode (Homemade, Farm, Materials)",
        details_heading: "Item / Product Details",
        lbl_category: "Category",
        cat_dairy: "🥛 Dairy & Fresh",
        cat_fruit: "🍎 Produce & Market",
        cat_meat: "🥓 Deli & Meats",
        cat_pantry: "🥫 Pantry / Groceries",
        cat_frozen: "❄️ Frozen & Ready Meals",
        cat_drinks: "🧃 Drinks",
        cat_packaging: "📦 Packaging (Pizza boxes, bags)",
        cat_hall: "🍽️ Hall & Consumables (Napkins, glasses)",
        cat_cleaning: "🧹 Cleaning & Detergents",
        cat_hygiene: "🧴 Hygiene & Paper",
        cat_other: "⚡ Other / Various",
        lbl_name: "Description / Item Name",
        ph_name: "Ex. Pizza boxes 33cm, Freezer soup...",
        lbl_brand: "Brand / Origin (Optional)",
        ph_brand: "Ex. Supplier, Homemade...",
        lbl_location: "Location (Dynamic)",
        opt_select_location: "-- Select or create location --",
        lbl_qty: "Quantity & Unit",
        unit_pieces: "Pieces",
        unit_packs: "Packs",
        unit_kg: "Kilograms (kg)",
        unit_g: "Grams (g)",
        unit_liters: "Liters (L)",
        lbl_expiry: "Expiration Management",
        exp_strict: "🔴 Strict",
        exp_recommended: "🟡 Recommended",
        exp_none: "⚪ No Expiration",
        info_auto: "ℹ️ Automatic Info Detected:",
        lbl_extra: "➕ Custom Extra Information",
        ph_extra_label: "Label (e.g. Batch)",
        ph_extra_val: "Value (e.g. L-402)",
        btn_add_row: "Add another row",
        badge_premium: "(Future Premium Feature)",
        lbl_notes: "📝 Notes, Recipes or Instructions (Long Text)",
        ph_notes: "Ex. Thaw slowly in fridge...",
        btn_submit: "Confirm and Register in ChefStock",
        link_back_menu: "← Back to Control Panel",
        footer_sub: "Professional stock, packaging & allergen management",
        modal_help_title: "💡 Useful Tip",
        btn_understood: "Understood"
    },
    fr: {
        title_page: "ChefStock - Entrée & Scan des Marchandises",
        btn_back: "← Menu Principal",
        lbl_guida: "Guide",
        guide_title: "💡 Comment fonctionne l'Entrée",
        guide_text: "Scannez n'importe quel code-barres ou saisissez-le manuellement. Gérez les dates de péremption et ajoutez des champs personnalisés !",
        main_heading: "Entrée & Scan des Marchandises",
        lbl_barcode: "🔍 Scanner de Code-barres",
        ph_barcode: "Scannez ou tapez le code-barres...",
        btn_camera: "📷 Activer Caméra",
        btn_manual: "✏️ Saisie Manuelle / Sans Code-barres",
        details_heading: "Détails de l'Article",
        lbl_category: "Catégorie",
        cat_dairy: "🥛 Produits Laitiers",
        cat_fruit: "🍎 Fruits & Légumes",
        cat_meat: "🥓 Charcuterie & Viandes",
        cat_pantry: "🥫 Épicerie",
        cat_frozen: "❄️ Surgelés",
        cat_drinks: "🧃 Boissons",
        cat_packaging: "📦 Emballage",
        cat_hall: "🍽️ Salle",
        cat_cleaning: "🧹 Nettoyage",
        cat_hygiene: "🧴 Hygiène",
        cat_other: "⚡ Autre",
        lbl_name: "Description / Nom",
        ph_name: "Ex. Boîtes à pizza...",
        lbl_brand: "Marque / Origine",
        ph_brand: "Ex. Fournisseur...",
        lbl_location: "Emplacement",
        opt_select_location: "-- Sélectionner ou créer un emplacement --",
        lbl_qty: "Quantité & Unité",
        unit_pieces: "Pièces",
        unit_packs: "Colis",
        unit_kg: "Kilogrammes (kg)",
        unit_g: "Grammes (g)",
        unit_liters: "Litres (L)",
        lbl_expiry: "Gestion de la Péremption",
        exp_strict: "🔴 Stricte",
        exp_recommended: "🟡 Conseillée",
        exp_none: "⚪ Sans Péremption",
        info_auto: "ℹ️ Infos Automatiques:",
        lbl_extra: "➕ Informations Extra",
        ph_extra_label: "Étiquette",
        ph_extra_val: "Valeur",
        btn_add_row: "Ajouter une ligne",
        badge_premium: "(Fonction Premium)",
        lbl_notes: "📝 Notes ou Instructions",
        ph_notes: "Ex. Décongeler...",
        btn_submit: "Confirmer et Enregistrer",
        link_back_menu: "← Retour au Tableau de Bord",
        footer_sub: "Gestion professionnelle des stocks",
        modal_help_title: "💡 Astuce",
        btn_understood: "J'ai compris"
    },
    de: {
        title_page: "ChefStock - Wareneingang & Scannen",
        btn_back: "← Hauptmenü",
        lbl_guida: "Anleitung",
        guide_title: "💡 So funktioniert der Wareneingang",
        guide_text: "Scannen Sie einen Barcode oder geben Sie ihn manuell ein. Verwalten Sie Verfallsdaten und fügen Sie benutzerdefinierte Felder hinzu!",
        main_heading: "Wareneingang & Scannen",
        lbl_barcode: "🔍 Barcode-Scanner",
        ph_barcode: "Barcode scannen oder eingeben...",
        btn_camera: "📷 Kamera einschalten",
        btn_manual: "✏️ Manuelle Eingabe",
        details_heading: "Artikeldetails",
        lbl_category: "Kategorie",
        cat_dairy: "🥛 Molkereiprodukte",
        cat_fruit: "🍎 Obst & Gemüse",
        cat_meat: "🥓 Wurst & Fleisch",
        cat_pantry: "🥫 Vorrat",
        cat_frozen: "❄️ Tiefkühlkost",
        cat_drinks: "🧃 Getränke",
        cat_packaging: "📦 Verpackung",
        cat_hall: "🍽️ Saal",
        cat_cleaning: "🧹 Reinigung",
        cat_hygiene: "🧴 Hygiene",
        cat_other: "⚡ Sonstiges",
        lbl_name: "Beschreibung / Name",
        ph_name: "Z.B. Pizzakartons...",
        lbl_brand: "Marke / Herkunft",
        ph_brand: "Z.B. Lieferant...",
        lbl_location: "Lagerort",
        opt_select_location: "-- Ort auswählen oder erstellen --",
        lbl_qty: "Menge & Einheit",
        unit_pieces: "Stück",
        unit_packs: "Packungen",
        unit_kg: "Kilogramm (kg)",
        unit_g: "Gramm (g)",
        unit_liters: "Liter (L)",
        lbl_expiry: "Ablaufdatum-Verwaltung",
        exp_strict: "🔴 Streng",
        exp_recommended: "🟡 Empfohlen",
        exp_none: "⚪ Kein Ablaufdatum",
        info_auto: "ℹ️ Automatische Infos:",
        lbl_extra: "➕ Zusätzliche Infos",
        ph_extra_label: "Etikett",
        ph_extra_val: "Wert",
        btn_add_row: "Zeile hinzufügen",
        badge_premium: "(Premium-Funktion)",
        lbl_notes: "📝 Notizen oder Anweisungen",
        ph_notes: "Z.B. Auftauen...",
        btn_submit: "Bestätigen und Speichern",
        link_back_menu: "← Zurück zum Dashboard",
        footer_sub: "Professionelles Bestandsmanagement",
        modal_help_title: "💡 Tipp",
        btn_understood: "Verstanden"
    },
    es: {
        title_page: "ChefStock - Entrada y Escaneo de Mercancías",
        btn_back: "← Menú Principal",
        lbl_guida: "Guía",
        guide_title: "💡 Cómo funciona la Entrada",
        guide_text: "Escanea cualquier código de barras o ingrésalo manualmente. ¡Gestiona fechas de caducidad y añade campos personalizados!",
        main_heading: "Entrada y Escaneo de Mercancías",
        lbl_barcode: "🔍 Escáner de Código de Barras",
        ph_barcode: "Escanea o escribe el código de barras...",
        btn_camera: "📷 Activar Cámara",
        btn_manual: "✏️ Entrada Manual / Sin Código",
        details_heading: "Detalles del Artículo",
        lbl_category: "Categoría",
        cat_dairy: "🥛 Lácteos",
        cat_fruit: "🍎 Frutas y Verduras",
        cat_meat: "🥓 Embutidos y Carnes",
        cat_pantry: "🥫 Despensa",
        cat_frozen: "❄️ Congelados",
        cat_drinks: "🧃 Bebidas",
        cat_packaging: "📦 Embalaje",
        cat_hall: "🍽️ Sala",
        cat_cleaning: "🧹 Limpieza",
        cat_hygiene: "🧴 Higiene",
        cat_other: "⚡ Otro",
        lbl_name: "Descripción / Nombre",
        ph_name: "Ej. Cajas de pizza...",
        lbl_brand: "Marca / Origen",
        ph_brand: "Ej. Proveedor...",
        lbl_location: "Ubicación",
        opt_select_location: "-- Selecciona o crea ubicación --",
        lbl_qty: "Cantidad y Unidad",
        unit_pieces: "Piezas",
        unit_packs: "Paquetes",
        unit_kg: "Kilogramos (kg)",
        unit_g: "Gramos (g)",
        unit_liters: "Litros (L)",
        lbl_expiry: "Gestión de Caducidad",
        exp_strict: "🔴 Estricta",
        exp_recommended: "🟡 Recomendada",
        exp_none: "⚪ Sin Caducidad",
        info_auto: "ℹ️ Información Automática:",
        lbl_extra: "➕ Información Extra",
        ph_extra_label: "Etiqueta",
        ph_extra_val: "Valor",
        btn_add_row: "Añadir otra fila",
        badge_premium: "(Función Premium futura)",
        lbl_notes: "📝 Notas o Instrucciones",
        ph_notes: "Ej. Descongelar...",
        btn_submit: "Confirmar y Registrar",
        link_back_menu: "← Volver al Panel",
        footer_sub: "Gestión profesional de stock",
        modal_help_title: "💡 Consejo Útil",
        btn_understood: "Entendido"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('eat_lang') || 'it';
    const selectLangEl = document.getElementById('lingua-select');
    if (selectLangEl) selectLangEl.value = savedLang;
    applicaTraduzioni(savedLang);

    const savedHelpPref = localStorage.getItem('chefstock_scansione_help');
    if (savedHelpPref === 'false') {
        document.getElementById('intro-guide-box').style.display = 'none';
        document.getElementById('chk-mostra-aiuti').checked = false;
    }

    document.getElementById('barcode-input').focus();
    impostaDataOdierna();
    impostaDataScadenzaDefault();
});

function cambiaLingua(lang) {
    localStorage.setItem('eat_lang', lang);
    applicaTraduzioni(lang);
}

function applicaTraduzioni(lang) {
    const t = traduzioniChefStock[lang] || traduzioniChefStock['it'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.innerHTML = t[key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.setAttribute('placeholder', t[key]);
        }
    });
}

function toggleGlobalHelp(stato) {
    localStorage.setItem('chefstock_scansione_help', stato);
    document.getElementById('intro-guide-box').style.display = stato ? 'block' : 'none';
}

function chiudiGuidaIniziale() {
    document.getElementById('intro-guide-box').style.display = 'none';
    document.getElementById('chk-mostra-aiuti').checked = false;
    localStorage.setItem('chefstock_scansione_help', 'false');
}

function apriGuidaPrincipale() {
    const lang = localStorage.getItem('eat_lang') || 'it';
    const msg = lang === 'en' ? 
        "ChefStock Guide - Goods In:\n\n1. Scan barcode or use manual entry.\n2. The app fetches name, category, calories and allergens.\n3. Enter expiration date with quick GG/MM/YY boxes.\n4. Add custom fields and notes before confirming!" :
        "Guida ChefStock - Entrata & Scansione:\n\n1. Inquadra il barcode o usa l'inserimento manuale.\n2. L'app ricava nome, categoria, calorie e allergeni.\n3. Inserisci la scadenza con le caselle rapide GG/MM/AA.\n4. Aggiungi campi personalizzati e note prima di confermare!";
    mostraTooltip(msg);
}

function mostraTooltipDaHelp(btnElement) {
    const formGroup = btnElement.closest('.form-group');
    if (formGroup && formGroup.dataset.help) {
        mostraTooltip(formGroup.dataset.help);
    }
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
    const campo = document.getElementById('data-carico');
    if(campo) campo.value = oggi;
}

function impostaDataScadenzaDefault() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    document.getElementById('gg').value = String(d.getDate()).padStart(2, '0');
    document.getElementById('mm').value = String(d.getMonth() + 1).padStart(2, '0');
    document.getElementById('aa').value = String(d.getFullYear()).slice(-2);
}

function saltaAlCampo(corrente, prossimoId) {
    if (corrente.value.length >= corrente.maxLength && prossimoId) {
        document.getElementById(prossimoId).focus();
    }
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
        btnCam.textContent = "⏳ Apertura fotocamera...";
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
            btnCam.textContent = "🛑 Chiudi Fotocamera";
        } catch (err) {
            alert("Impossibile accedere alla fotocamera.");
            await chiudiFotocamera();
        }
    } else {
        await chiudiFotocamera();
    }
}

async function chiudiFotocamera() {
    if (html5QrCode) {
        try {
            if (html5QrCode.isScanning) await html5QrCode.stop();
            html5QrCode.clear();
        } catch (e) {}
    }
    html5QrCode = null;
    document.getElementById('reader').style.display = 'none';
    document.getElementById('btn-toggle-cam').textContent = "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

async function cercaBarcodeMultiplo() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) return;

    let fonteTrovata = "alimentari";
    let datiProdotto = null;

    try {
        let res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        let data = await res.json();
        if (data && data.status === 1) {
            datiProdotto = data.product;
        } else {
            res = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
            data = await res.json();
            if (data && data.status === 1) {
                datiProdotto = data.product;
                fonteTrovata = "igiene";
            } else {
                res = await fetch(`https://world.openproductsfacts.org/api/v0/product/${barcode}.json`);
                data = await res.json();
                if (data && data.status === 1) {
                    datiProdotto = data.product;
                    fonteTrovata = "packaging";
                }
            }
        }

        if (datiProdotto) {
            let nome = datiProdotto.product_name || datiProdotto.product_name_it || "Articolo scansionato";
            let marca = datiProdotto.brands || "";
            let immagine = datiProdotto.image_front_url || "";

            document.getElementById('nome-prodotto').value = nome;
            document.getElementById('marca-prodotto').value = marca;
            document.getElementById('inf-nome').textContent = `Trovato (${fonteTrovata})`;
            document.getElementById('inf-marca').textContent = marca || "Non specificata";

            estraiAllergeniENutrienti(datiProdotto);
            impostaCategoriaIntelligente(fonteTrovata, nome);
            aggiornaListaUbicazioniDinamiche("");

            const imgEl = document.getElementById('img-anteprima');
            if (immagine) {
                imgEl.src = immagine;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }

            document.getElementById('preview-prodotto').style.display = 'block';
            document.getElementById('ubicazione').focus();
        } else {
            gestisciArticoloNonTrovato(barcode);
        }
    } catch (error) {
        gestisciArticoloNonTrovato(barcode);
    }
}

function estraiAllergeniENutrienti(prod) {
    const box = document.getElementById('box-allergeni-nutri');
    const testo = document.getElementById('testo-allergeni');
    
    let infoList = [];
    if (prod.allergens_tags && prod.allergens_tags.length > 0) {
        let allergeniClean = prod.allergens_tags.map(a => a.replace('en:', '').replace('it:', '')).join(', ');
        infoList.push(`⚠️ <strong>Allergeni:</strong> ${allergeniClean}`);
    }
    if (prod.nutriments && prod.nutriments['energy-kcal_100g']) {
        infoList.push(`🔥 <strong>Calorie:</strong> ${prod.nutriments['energy-kcal_100g']} kcal / 100g`);
    }

    if (infoList.length > 0) {
        testo.innerHTML = infoList.join(' | ');
        box.style.display = 'block';
    } else {
        box.style.display = 'none';
    }
}

function impostaCategoriaIntelligente(fonte, nome) {
    const sel = document.getElementById('categoria-prodotto');
    const t = nome.toLowerCase();

    if (fonte === "packaging" || t.includes('cartone') || t.includes('scatola') || t.includes('sacchetto') || t.includes('shopper')) {
        sel.value = "Packaging & Asporto";
    } else if (t.includes('tovagliolo') || t.includes('tovaglia') || t.includes('bicchiere') || t.includes('piatto')) {
        sel.value = "Sala & Consumo";
    } else if (t.includes('detersivo') || t.includes('sgrassatore') || t.includes('candeggina')) {
        sel.value = "Pulizia & Detergenti";
    } else if (t.includes('dentifricio') || t.includes('shampoo') || t.includes('carta igienica')) {
        sel.value = "Igiene & Bagno";
    } else if (t.includes('latte') || t.includes('yogurt') || t.includes('mozzarella')) {
        sel.value = "Latticini & Freschi";
    } else if (t.includes('acqua') || t.includes('vino') || t.includes('bibita')) {
        sel.value = "Bevande";
    } else {
        sel.value = "Dispensa / Generi alimentari";
    }
}

function analizzaDescrizioneTestuale(testo) {
    impostaCategoriaIntelligente("manuale", testo);
}

function abilitaCompilazioneManuale() {
    if (cameraAttiva) chiudiFotocamera();
    aggiornaListaUbicazioniDinamiche("");
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('inf-nome').textContent = "Inserimento Manuale";
    document.getElementById('inf-marca').textContent = "-";
    document.getElementById('img-anteprima').style.display = 'none';
    document.getElementById('box-allergeni-nutri').style.display = 'none';
    document.getElementById('nome-prodotto').value = "";
    document.getElementById('nome-prodotto').focus();
}

function gestisciArticoloNonTrovato(barcode) {
    document.getElementById('inf-nome').textContent = `Non in cataloghi globali [${barcode}]`;
    document.getElementById('inf-marca').textContent = "Inserimento manuale consigliato";
    document.getElementById('img-anteprima').style.display = 'none';
    document.getElementById('box-allergeni-nutri').style.display = 'none';
    aggiornaListaUbicazioniDinamiche("");
    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('nome-prodotto').value = `Articolo [${barcode}]`;
    document.getElementById('nome-prodotto').focus();
}

function aggiornaListaUbicazioniDinamiche(ubicazioneSelezionata = "") {
    let db = JSON.parse(localStorage.getItem('chefstock_db')) || { dispensa: [] };
    const selectU = document.getElementById('ubicazione');
    
    const salvate = [...new Set((db.dispensa || []).map(i => i.ubicazione).filter(Boolean))];
    
    selectU.innerHTML = '<option value="" disabled selected data-i18n="opt_select_location">-- Seleziona o crea ubicazione --</option>';
    
    salvate.forEach(ub => {
        const opt = document.createElement('option');
        opt.value = ub;
        opt.textContent = ub;
        selectU.appendChild(opt);
    });

    const optNuova = document.createElement('option');
    optNuova.value = "__nuova__";
    optNuova.textContent = "➕ Aggiungi nuova ubicazione...";
    selectU.appendChild(optNuova);

    if (ubicazioneSelezionata && salvate.includes(ubicazioneSelezionata)) {
        selectU.value = ubicazioneSelezionata;
    }

    selectU.onchange = function() {
        if (this.value === "__nuova__") {
            const nuovo = prompt("Nome della nuova ubicazione (es. Frigo cucina, Magazzino sala, Cantina):");
            if (nuovo && nuovo.trim() !== "") {
                const nomeLuogo = nuovo.trim();
                const optNew = document.createElement('option');
                optNew.value = nomeLuogo;
                optNew.textContent = nomeLuogo;
                selectU.insertBefore(optNew, selectU.lastElementChild);
                selectU.value = nomeLuogo;
            } else {
                selectU.value = "";
            }
        }
    };
    applicaTraduzioni(localStorage.getItem('eat_lang') || 'it');
}

function impostaTipoScadenza(tipo) {
    const containerGG = document.getElementById('container-date-ggmmaa');
    if (tipo === 'nessuna') {
        containerGG.style.opacity = '0.3';
        containerGG.style.pointerEvents = 'none';
    } else {
        containerGG.style.opacity = '1';
        containerGG.style.pointerEvents = 'auto';
    }
}

function aggiungiRigaExtra() {
    const container = document.getElementById('container-campi-extra');
    const div = document.createElement('div');
    div.className = 'extra-row';
    div.innerHTML = `
        <input type="text" placeholder="Etichetta" class="extra-label">
        <input type="text" placeholder="Valore" class="extra-valore">
    `;
    container.appendChild(div);
    alert("💡 Nota ChefStock: Per ora è tutto gratuito e illimitato! In futuro, quando attiveremo i piani di abbonamento per le grandi attività, la creazione multipla di campi extra sarà una funzione Premium. Goditela!");
}

function registraCarico(event) {
    event.preventDefault();

    const nome = document.getElementById('nome-prodotto').value.trim();
    const barcode = document.getElementById('barcode-input').value.trim();
    const ubicazione = document.getElementById('ubicazione').value;

    if (!ubicazione || ubicazione === "__nuova__") {
        alert("Seleziona un'ubicazione valida.");
        document.getElementById('ubicazione').focus();
        return;
    }

    const gg = document.getElementById('gg').value.trim();
    const mm = document.getElementById('mm').value.trim();
    const aa = document.getElementById('aa').value.trim();
    const tipoScadenza = document.querySelector('input[name="tipo-scadenza"]:checked').value;
    
    let stringaScadenza = "Nessuna scadenza";
    if (tipoScadenza !== 'nessuna') {
        if (!gg || !mm || !aa) {
            alert("Compila correttamente i campi Giorno, Mese e Anno della scadenza.");
            document.getElementById('gg').focus();
            return;
        }
        stringaScadenza = `${gg}/${mm}/20${aa}`;
    }

    let extraCampi = [];
    document.querySelectorAll('.extra-row').forEach(row => {
        const l = row.querySelector('.extra-label').value.trim();
        const v = row.querySelector('.extra-valore').value.trim();
        if (l && v) extraCampi.push({ etichetta: l, valore: v });
    });

    const nuevoArticolo = {
        id: Date.now(),
        barcode: barcode || "MANUALE",
        categoria: document.getElementById('categoria-prodotto').value,
        nome: nome,
        marca: document.getElementById('marca-prodotto').value.trim(),
        ubicazione: ubicazione,
        scadenza: stringaScadenza,
        tipoScadenza: tipoScadenza,
        quantita: parseInt(document.getElementById('quantita').value) || 1,
        unitaMisura: document.getElementById('unita-misura').value,
        note: document.getElementById('note-prodotto').value.trim(),
        extraCampi: extraCampi,
        immagine: document.getElementById('img-anteprima').src || "",
        dataCarico: document.getElementById('data-carico').value
    };

    let db = JSON.parse(localStorage.getItem('chefstock_db')) || { dispensa: [] };
    if (!db.dispensa) db.dispensa = [];
    
    db.dispensa.push(nuevoArticolo);
    localStorage.setItem('chefstock_db', JSON.stringify(db));

    alert("Articolo registrato con successo nel magazzino ChefStock!");
    window.location.href = "inventario.html";
}