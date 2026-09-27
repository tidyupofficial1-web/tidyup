// i18n.js - Dizionario globale multilingua (IT, EN, FR, ES, DE) per EatMeFirst

const dizionarioGlobale = {
    it: {
        // Comune / Menu
        menuTitle: "Menu Principale EatMeFirst",
        menuSubtitle: "Gestione Intelligente della Dispensa",
        caricoArticolo: "📥 Carico Articolo",
        visualizzaDispensa: "📋 Visualizza Dispensa",
        statistiche: "📊 Statistiche & Scadenze",
        impostazioni: "⚙️ Impostazioni",
        ricettaSvuotaFrigo: "🍳 Ricetta Svuota Frigo",
        spesa: "🛒 Lista della Spesa",
        footer: "EatMeFirst &bull; Dati locali su dispositivo",
        backBtn: "&#129144; Menu Principale",
        
        // Carico Articolo
        caricoTitle: "Carico Articolo",
        caricoSubtitle: "Dispositivo Standalone (Tablet / Smartphone)",
        sectionReg: "📥 Registrazione Prodotto",
        camLabel: "📷 Scatta foto al codice a barre",
        camBtn: "📸 Apri Fotocamera e Scatta",
        camStatus: "Tocca per scattare o inserisci il codice sotto.",
        lblBarcode: "Codice a Barre",
        manualToggle: "Prodotto senza codice? Compila manualmente",
        lblName: "Nome Prodotto *",
        lblCategory: "Categoria",
        lblLocation: "Ubicazione / Luogo *",
        newLocationOpt: "+ Aggiungi nuovo luogo...",
        newLocationPlaceholder: "Scrivi il nuovo luogo...",
        lblQty: "Quantità *",
        lblUnit: "Unità di Misura",
        lblExpiry: "Data di Scadenza * (GG / MM / AA)",
        confirmExpiry: "Confermo che la tipologia di scadenza è corretta",
        btnSave: "Salva in Dispensa",
        alertMissing: "Compila tutti i campi obbligatori e verifica che la data di scadenza sia valida.",
        alertSaved: "Salvato correttamente in",

        // Dispensa / Lista
        dispensaTitle: "Visualizza Dispensa",
        filtroLuogo: "Filtra per luogo:",
        tuttiLuoghi: "Tutti i luoghi",
        vuotaDispensaMsg: "La tua dispensa è vuota o nessun prodotto corrisponde al filtro.",
        eliminaBtn: "Elimina",
        modificaBtn: "Modifica",

        // Impostazioni
        impostazioniTitle: "Impostazioni Generali",
        exportData: "📤 Esporta Dati (Backup)",
        importData: "📥 Importa Dati",
        resetData: "⚠️ Resetta Tutti i Dati",

        // Statistiche / Svuota Frigo / Spesa
        statTitle: "Statistiche e Scadenze",
        ricettaTitle: "Ricetta Svuota Frigo",
        spesaTitle: "Lista della Spesa"
    },
    en: {
        // Common / Menu
        menuTitle: "EatMeFirst Main Menu",
        menuSubtitle: "Smart Pantry Management",
        caricoArticolo: "📥 Load Item",
        visualizzaDispensa: "📋 View Pantry",
        statistiche: "📊 Statistics & Expiries",
        impostazioni: "⚙️ Settings",
        ricettaSvuotaFrigo: "🍳 Clear-Fridge Recipe",
        spesa: "🛒 Shopping List",
        footer: "EatMeFirst &bull; Local device storage",
        backBtn: "&#129144; Main Menu",

        // Load Item
        caricoTitle: "Load Item",
        caricoSubtitle: "Standalone Device (Tablet / Smartphone)",
        sectionReg: "📥 Product Registration",
        camLabel: "📷 Take a picture of the barcode",
        camBtn: "📸 Open Camera & Snap",
        camStatus: "Tap to snap or enter barcode below.",
        lblBarcode: "Barcode",
        manualToggle: "Product without barcode? Fill manually",
        lblName: "Product Name *",
        lblCategory: "Category",
        lblLocation: "Location / Storage *",
        newLocationOpt: "+ Add new location...",
        newLocationPlaceholder: "Type new location...",
        lblQty: "Quantity *",
        lblUnit: "Unit of Measurement",
        lblExpiry: "Expiry Date * (DD / MM / YY)",
        confirmExpiry: "I confirm the expiry type is correct",
        btnSave: "Save to Pantry",
        alertMissing: "Please fill in all mandatory fields and check the expiry date format.",
        alertSaved: "Successfully saved to",

        // Pantry List
        dispensaTitle: "View Pantry",
        filtroLuogo: "Filter by location:",
        tuttiLuoghi: "All locations",
        vuotaDispensaMsg: "Your pantry is empty or no products match the filter.",
        eliminaBtn: "Delete",
        modificaBtn: "Edit",

        // Settings
        impostazioniTitle: "General Settings",
        exportData: "📤 Export Data (Backup)",
        importData: "📥 Import Data",
        resetData: "⚠️ Reset All Data",

        // Stats / Fridge / Shopping
        statTitle: "Statistics & Expiries",
        ricettaTitle: "Clear-Fridge Recipe",
        spesaTitle: "Shopping List"
    },
    fr: {
        // Common / Menu
        menuTitle: "Menu Principal EatMeFirst",
        menuSubtitle: "Gestion Intelligente du Garde-manger",
        caricoArticolo: "📥 Charger un Article",
        visualizzaDispensa: "📋 Voir le Garde-manger",
        statistiche: "📊 Statistiques & Péremptions",
        impostazioni: "⚙️ Paramètres",
        ricettaSvuotaFrigo: "🍳 Recette Anti-Gaspi",
        spesa: "🛒 Liste de Courses",
        footer: "EatMeFirst &bull; Stockage local sur l'appareil",
        backBtn: "&#129144; Menu Principal",

        // Load Item
        caricoTitle: "Charger un Article",
        caricoSubtitle: "Appareil Autonome (Tablette / Smartphone)",
        sectionReg: "📥 Enregistrement du Produit",
        camLabel: "📷 Prendre une photo du code-barres",
        camBtn: "📸 Ouvrir la Caméra",
        camStatus: "Appuyez pour capturer ou entrez le code ci-dessous.",
        lblBarcode: "Code-barres",
        manualToggle: "Produit sans code ? Remplir manuellement",
        lblName: "Nom du Produit *",
        lblCategory: "Catégorie",
        lblLocation: "Emplacement *",
        newLocationOpt: "+ Ajouter un nouvel emplacement...",
        newLocationPlaceholder: "Nom du nouvel emplacement...",
        lblQty: "Quantité *",
        lblUnit: "Unité de Mesure",
        lblExpiry: "Date de Péremption * (JJ / MM / AA)",
        confirmExpiry: "Je confirme que le type de péremption est correct",
        btnSave: "Enregistrer",
        alertMissing: "Veuillez remplir tous les champs obligatoires et vérifier la date.",
        alertSaved: "Enregistré avec succès dans",

        // Pantry List
        dispensaTitle: "Voir le Garde-manger",
        filtroLuogo: "Filtrer par emplacement :",
        tuttiLuoghi: "Tous les emplacements",
        vuotaDispensaMsg: "Votre garde-manger est vide ou aucun produit ne correspond au filtre.",
        eliminaBtn: "Supprimer",
        modificaBtn: "Modifier",

        // Settings
        impostazioniTitle: "Paramètres Généraux",
        exportData: "📤 Exporter les Données (Sauvegarde)",
        importData: "📥 Importer les Données",
        resetData: "⚠️ Réinitialiser Toutes les Données",

        // Stats / Fridge / Shopping
        statTitle: "Statistiques et Péremptions",
        ricettaTitle: "Recette Anti-Gaspi",
        spesaTitle: "Liste de Courses"
    },
    es: {
        // Common / Menu
        menuTitle: "Menú Principal EatMeFirst",
        menuSubtitle: "Gestión Inteligente de Despensa",
        caricoArticolo: "📥 Cargar Artículo",
        visualizzaDispensa: "📋 Ver Despensa",
        statistiche: "📊 Estadísticas y Caducidades",
        impostazioni: "⚙️ Configuración",
        ricettaSvuotaFrigo: "🍳 Receta Vacía-Nevera",
        spesa: "🛒 Lista de la Compra",
        footer: "EatMeFirst &bull; Almacenamiento local en el dispositivo",
        backBtn: "&#129144; Menú Principal",

        // Load Item
        caricoTitle: "Cargar Artículo",
        caricoSubtitle: "Dispositivo Autónomo (Tablet / Smartphone)",
        sectionReg: "📥 Registro de Producto",
        camLabel: "📷 Tomar foto al código de barras",
        camBtn: "📸 Abrir Cámara",
        camStatus: "Toca para capturar o introduce el código abajo.",
        lblBarcode: "Código de Barras",
        manualToggle: "¿Producto sin código? Rellenar manualmente",
        lblName: "Nombre del Producto *",
        lblCategory: "Categoría",
        lblLocation: "Ubicación / Lugar *",
        newLocationOpt: "+ Añadir nuevo lugar...",
        newLocationPlaceholder: "Escribe el nuevo lugar...",
        lblQty: "Cantidad *",
        lblUnit: "Unidad de Medida",
        lblExpiry: "Fecha de Caducidad * (DD / MM / AA)",
        confirmExpiry: "Confirmo que el tipo de caducidad es correcto",
        btnSave: "Guardar en Despensa",
        alertMissing: "Completa todos los campos obligatorios y verifica la fecha de caducidad.",
        alertSaved: "Guardado correctamente en",

        // Pantry List
        dispensaTitle: "Ver Despensa",
        filtroLuogo: "Filtrar por lugar:",
        tuttiLuoghi: "Todos los lugares",
        vuotaDispensaMsg: "Tu despensa está vacía o ningún producto coincide con el filtro.",
        eliminaBtn: "Eliminar",
        modificaBtn: "Modificar",

        // Settings
        impostazioniTitle: "Configuración General",
        exportData: "📤 Exportar Datos (Copia de seguridad)",
        importData: "📥 Importar Datos",
        resetData: "⚠️ Restablecer Todos los Datos",

        // Stats / Fridge / Shopping
        statTitle: "Estadísticas y Caducidades",
        ricettaTitle: "Receta Vacía-Nevera",
        spesaTitle: "Lista de la Compra"
    },
    de: {
        // Common / Menu
        menuTitle: "EatMeFirst Hauptmenü",
        menuSubtitle: "Intelligente Vorratskammer-Verwaltung",
        caricoArticolo: "📥 Artikel Hinzufügen",
        visualizzaDispensa: "📋 Vorrat Ansehen",
        statistiche: "📊 Statistik & Mindesthaltbarkeit",
        impostazioni: "⚙️ Einstellungen",
        ricettaSvuotaFrigo: "🍳 Kühlschrank-Leerungs-Rezept",
        spesa: "🛒 Einkaufsliste",
        footer: "EatMeFirst &bull; Lokaler Gerätespeicher",
        backBtn: "&#129144; Hauptmenü",

        // Load Item
        caricoTitle: "Artikel Hinzufügen",
        caricoSubtitle: "Eigenständiges Gerät (Tablet / Smartphone)",
        sectionReg: "📥 Produktregistrierung",
        camLabel: "📷 Barcode-Foto aufnehmen",
        camBtn: "📸 Kamera öffnen",
        camStatus: "Zum Aufnehmen tippen oder Barcode unten eingeben.",
        lblBarcode: "Strichcode / Barcode",
        manualToggle: "Produkt ohne Code? Manuell ausfüllen",
        lblName: "Produktname *",
        lblCategory: "Kategorie",
        lblLocation: "Lagerort *",
        newLocationOpt: "+ Neuen Ort hinzufügen...",
        newLocationPlaceholder: "Neuen Ort eingeben...",
        lblQty: "Menge *",
        lblUnit: "Maßeinheit",
        lblExpiry: "Ablaufdatum * (TT / MM / JJ)",
        confirmExpiry: "Ich bestätige, dass der Ablauftyp korrekt ist",
        btnSave: "In Vorrat speichern",
        alertMissing: "Bitte füllen Sie alle Pflichtfelder aus und prüfen Sie das Datum.",
        alertSaved: "Erfolgreich gespeichert in",

        // Pantry List
        dispensaTitle: "Vorrat Ansehen",
        filtroLuogo: "Nach Ort filtern:",
        tuttiLuoghi: "Alle Orte",
        vuotaDispensaMsg: "Ihre Vorratskammer ist leer oder es gibt keine passenden Produkte.",
        eliminaBtn: "Löschen",
        modificaBtn: "Bearbeiten",

        // Settings
        impostazioniTitle: "Allgemeine Einstellungen",
        exportData: "📤 Daten Exportieren (Backup)",
        importData: "📥 Daten Importieren",
        resetData: "⚠️ Alle Daten Zurücksetzen",

        // Stats / Fridge / Shopping
        statTitle: "Statistik & Haltbarkeit",
        ricettaTitle: "Kühlschrank-Leerungs-Rezept",
        spesaTitle: "Einkaufsliste"
    }
};

function getLinguaCorrente() {
    return localStorage.getItem('eat_lang') || 'it';
}

function impostaLinguaGlobale(lang) {
    localStorage.setItem('eat_lang', lang);
    location.reload();
}

// Generatore automatico del selettore a tendina con le 5 lingue
function creaSelettoreLinguaHTML() {
    const lang = getLinguaCorrente();
    return `
        <select id="langSelectGlobal" class="lang-selector" onchange="impostaLinguaGlobale(this.value)">
            <option value="it" ${lang === 'it' ? 'selected' : ''}>🇮🇹 Italiano</option>
            <option value="en" ${lang === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="fr" ${lang === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
            <option value="es" ${lang === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
            <option value="de" ${lang === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
        </select>
    `;
}