document.addEventListener('DOMContentLoaded', () => {
    // Inizializzazione selettore lingua nella barra superiore
    const containerLang = document.getElementById('header-lang');
    if (containerLang) {
        if (typeof creaSelettoreLinguaHTML === 'function') {
            containerLang.innerHTML = creaSelettoreLinguaHTML();
        } else {
            containerLang.innerHTML = `
                <select onchange="cambiaLinguaLocale(this.value)">
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="es">🇪🇸 Español</option>
                </select>
            `;
        }
    }

    // Controllo se l'utente ha scelto di non mostrare più il benvenuto iniziale
    const hideWelcome = localStorage.getItem('chefstock_hide_welcome');
    if (!hideWelcome) {
        const welcomeModal = document.getElementById('welcome-modal');
        if (welcomeModal) {
            welcomeModal.style.display = 'flex';
        }
    }

    applicaTraduzioniInterfaccia();
});

function cambiaLinguaLocale(lang) {
    localStorage.setItem('eat_lang', lang);
    applicaTraduzioniInterfaccia();
    window.dispatchEvent(new CustomEvent('linguaCambiata', { detail: lang }));
}

// Funzione per chiudere il benvenuto e salvare la preferenza se spuntato
function chiudiBenvenuto() {
    const chk = document.getElementById('chk-dont-show');
    if (chk && chk.checked) {
        localStorage.setItem('chefstock_hide_welcome', 'true');
    }
    const welcomeModal = document.getElementById('welcome-modal');
    if (welcomeModal) {
        welcomeModal.style.display = 'none';
    }
}

// Dizionari multilingua per la pagina menu
const dizionarioMenu = {
    it: {
        back: "Indietro",
        welcomeTitle: "👋 Benvenuto nel Pannello di Comando!",
        welcomeDesc: "ChefStock è progettato per ottimizzare la tua gestione delle scorte e ridurre gli sprechi. Da qui puoi accedere rapidamente alle funzioni chiave:",
        invTitle: "Gestione Inventario:",
        invDescShort: "Controlla scorte, lotti e scadenze.",
        scanTitle: "Entrata / Scansione Merci:",
        scanDescShort: "Registra prodotti con lettore barcode o fotocamera.",
        shopTitle: "Lista della Spesa:",
        shopDescShort: "Monitora gli articoli in esaurimento.",
        tipWelcome: "Consiglio: Accanto ad ogni comando trovi un'icona (?) per scoprire i dettagli d'uso.",
        dontShowAgain: "Non mostrare più questo benvenuto",
        btnProceed: "Ho capito, procedi",
        btnClose: "Chiudi",
        proTipTitle: "Consiglio Pro:",
        proTipDesc: "Per un'attività intensiva, l'uso di un lettore barcode USB/Wireless (stile supermercato, spesa 20-30€) velocizza l'ingresso merci in un millisecondo. È supportato nativamente!",
        cardInvTitle: "📦 Gestione Inventario",
        cardInvDesc: "Monitora lo stato attuale della dispensa, filtra per categorie e controlla le scadenze imminenti.",
        btnOpenInv: "Apri Inventario",
        cardScanTitle: "📷 Entrata / Scansione Merci",
        cardScanDesc: "Aggiungi nuovi prodotti scansionando il codice a barre tramite lettore hardware o fotocamera del cellulare.",
        btnOpenScan: "Nuovo Ingresso",
        cardShopTitle: "🛒 Lista della Spesa",
        cardShopDesc: "Visualizza gli articoli esauriti o sotto scorta minima da riordinare per i prossimi rifornimenti.",
        btnOpenShop: "Vai alla Spesa"
    },
    en: {
        back: "Back",
        welcomeTitle: "👋 Welcome to the Control Center!",
        welcomeDesc: "ChefStock is designed to optimize inventory management and reduce waste. Access core features quickly from here:",
        invTitle: "Inventory Management:",
        invDescShort: "Check stocks, batches and expiration dates.",
        scanTitle: "Goods Entry / Scanning:",
        scanDescShort: "Register products using a barcode reader or camera.",
        shopTitle: "Shopping List:",
        shopDescShort: "Monitor running-out items.",
        tipWelcome: "Tip: Next to each command you will find a (?) icon to discover usage details.",
        dontShowAgain: "Don't show this welcome again",
        btnProceed: "Got it, let's go",
        btnClose: "Close",
        proTipTitle: "Pro Tip:",
        proTipDesc: "For intensive tasks, using a USB/Wireless barcode reader (supermarket style, €20-30) speeds up goods entry in milliseconds. Natively supported!",
        cardInvTitle: "📦 Inventory Management",
        cardInvDesc: "Monitor current pantry status, filter by categories, and check upcoming expiration dates.",
        btnOpenInv: "Open Inventory",
        cardScanTitle: "📷 Goods Entry / Scanning",
        cardScanDesc: "Add new products by scanning barcodes via hardware reader or phone camera.",
        btnOpenScan: "New Entry",
        cardShopTitle: "🛒 Shopping List",
        cardShopDesc: "View out-of-stock or low-stock items to reorder for upcoming supplies.",
        btnOpenShop: "Go to Shopping"
    },
    fr: {
        back: "Retour",
        welcomeTitle: "👋 Bienvenue dans le Panneau de Commande !",
        welcomeDesc: "ChefStock est conçu pour optimiser la gestion des stocks. Accédez rapidement aux fonctions clés :",
        invTitle: "Gestion des Stocks :",
        invDescShort: "Contrôlez les stocks, lots et dates de péremption.",
        scanTitle: "Entrée / Scan des Marchandises :",
        scanDescShort: "Enregistrez les produits par code-barres ou appareil photo.",
        shopTitle: "Liste de Courses :",
        shopDescShort: "Surveillez les articles épuisés.",
        tipWelcome: "Conseil : À côté de chaque commande, trouvez une icône (?) pour plus de détails.",
        dontShowAgain: "Ne plus afficher ce message",
        btnProceed: "J'ai compris",
        btnClose: "Fermer",
        proTipTitle: "Conseil Pro :",
        proTipDesc: "Un lecteur de code-barres USB/Sans fil accélère grandement l'entrée des marchandises.",
        cardInvTitle: "📦 Gestion des Stocks",
        cardInvDesc: "Surveillez l'état actuel du garde-manger et les dates de péremption.",
        btnOpenInv: "Ouvrir l'Inventaire",
        cardScanTitle: "📷 Entrée / Scan",
        cardScanDesc: "Ajoutez de nouveaux produits en scannant le code-barres.",
        btnOpenScan: "Nouvelle Entrée",
        cardShopTitle: "🛒 Liste de Courses",
        cardShopDesc: "Consultez les articles à réapprovisionner.",
        btnOpenShop: "Aller aux Courses"
    },
    de: {
        back: "Zurück",
        welcomeTitle: "👋 Willkommen im Kontrollzentrum!",
        welcomeDesc: "ChefStock wurde entwickelt, um die Bestandsverwaltung zu optimieren.",
        invTitle: "Bestandsverwaltung:",
        invDescShort: "Bestände und Verfallsdaten prüfen.",
        scanTitle: "Wareneingang / Scannen:",
        scanDescShort: "Produkte mit Barcode oder Kamera erfassen.",
        shopTitle: "Einkaufsliste:",
        shopDescShort: "Artikel überwachen.",
        tipWelcome: "Tipp: Neben jedem Befehl finden Sie ein (?)-Symbol.",
        dontShowAgain: "Nicht mehr anzeigen",
        btnProceed: "Verstanden",
        btnClose: "Schließen",
        proTipTitle: "Pro-Tipp:",
        proTipDesc: "Ein USB/Funk-Barcodescanner beschleunigt den Wareneingang erheblich.",
        cardInvTitle: "📦 Bestandsverwaltung",
        cardInvDesc: "Überwachen Sie den aktuellen Vorrat und bevorstehende Verfallsdaten.",
        btnOpenInv: "Inventar öffnen",
        cardScanTitle: "📷 Wareneingang / Scan",
        cardScanDesc: "Fügen Sie neue Produkte per Barcode hinzu.",
        btnOpenScan: "Neuer Eingang",
        cardShopTitle: "🛒 Einkaufsliste",
        cardShopDesc: "Artikel anzeigen, die nachbestellt werden müssen.",
        btnOpenShop: "Zur Einkaufsliste"
    },
    es: {
        back: "Volver",
        welcomeTitle: "👋 ¡Bienvenido al Panel de Control!",
        welcomeDesc: "ChefStock está diseñado para optimizar la gestión de inventario.",
        invTitle: "Gestión de Inventario:",
        invDescShort: "Controla existencias y caducidades.",
        scanTitle: "Entrada / Escaneo de Mercancía:",
        scanDescShort: "Registra productos con lector de códigos o cámara.",
        shopTitle: "Lista de Compras:",
        shopDescShort: "Monitorea artículos agotados.",
        tipWelcome: "Consejo: Junto a cada comando hay un icono (?) con detalles.",
        dontShowAgain: "No mostrar de nuevo",
        btnProceed: "Entendido",
        btnClose: "Cerrar",
        proTipTitle: "Consejo Pro:",
        proTipDesc: "Un lector de códigos de barras USB/Inalámbrico acelera la entrada de mercancía.",
        cardInvTitle: "📦 Gestión de Inventario",
        cardInvDesc: "Monitorea el estado actual de la despensa y fechas de caducidad.",
        btnOpenInv: "Abrir Inventario",
        cardScanTitle: "📷 Entrada / Escaneo",
        cardScanDesc: "Agrega nuevos productos escaneando códigos de barras.",
        btnOpenScan: "Nueva Entrada",
        cardShopTitle: "🛒 Lista de Compras",
        cardShopDesc: "Visualiza artículos agotados para reabastecer.",
        btnOpenShop: "Ir de Compras"
    }
};

function applicaTraduzioniInterfaccia() {
    let lang = 'it';
    if (typeof getLinguaCorrente === 'function') {
        lang = getLinguaCorrente();
    } else {
        lang = localStorage.getItem('eat_lang') || 'it';
    }

    const selectEl = document.querySelector('#header-lang select');
    if (selectEl) selectEl.value = lang;

    const t = dizionarioMenu[lang] || dizionarioMenu['it'];

    // Traduci elementi con attributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) {
            el.textContent = t[chiave];
        }
    });
}

window.addEventListener('linguaCambiata', () => {
    applicaTraduzioniInterfaccia();
});

// Database dei testi informativi aggiornato con la nota sul barcode manuale
function getInfoTesti(lang) {
    const testi = {
        it: {
            inventario: {
                titolo: "📦 Gestione Inventario",
                descrizione: "Qui puoi visualizzare l'elenco completo dei prodotti registrati in ChefStock. Puoi verificare in tempo reale le quantità disponibili, i numeri di lotto e le date di scadenza. I prodotti sono evidenziati con colori diversi in base all'urgenza di consumo."
            },
            scansione: {
                titolo: "📷 Entrata / Scansione Merci",
                descrizione: "Sezione dedicata al carico rapido delle merci. Puoi collegare un lettore barcode USB o wireless per sparare i codici a fulmine, oppure usare la fotocamera. Nota importante: se il codice a barre non viene rilevato o manca, l'applicazione ti permetterà di inserire manualmente la descrizione, le scadenze e le quantità, con funzioni future pensate per automatizzare e velocizzare ogni passaggio."
            },
            spesa: {
                titolo: "🛒 Lista della Spesa",
                descrizione: "Questo blocco monitora automaticamente i prodotti che sono scesi sotto la soglia minima o che risultano esauriti, aiutandoti a generare la lista degli acquisti."
            }
        },
        en: {
            inventario: {
                titolo: "📦 Inventory Management",
                descrizione: "View the complete list of registered products, available quantities, batch numbers, and expiration dates."
            },
            scansione: {
                titolo: "📷 Goods Entry / Scanning",
                descrizione: "Dedicated to fast goods loading. Use a hardware barcode reader or camera. Note: if a barcode isn't recognized or missing, you can manually enter description, quantities, and expiration dates. Future updates will further automate this process."
            },
            spesa: {
                titolo: "🛒 Shopping List",
                descrizione: "Monitors out-of-stock or low-stock items to help you generate shopping lists easily."
            }
        }
    };
    return testi[lang] || testi['it'];
}

// Apertura del modal informativo specifico con supporto multilingua
function apriInfo(chiave) {
    let lang = 'it';
    if (typeof getLinguaCorrente === 'function') {
        lang = getLinguaCorrente();
    } else {
        lang = localStorage.getItem('eat_lang') || 'it';
    }

    const database = getInfoTesti(lang);
    const info = database[chiave];
    if (!info) return;

    document.getElementById('info-modal-title').textContent = info.titolo;
    document.getElementById('info-modal-desc').textContent = info.descrizione;
    
    document.getElementById('info-modal').style.display = 'flex';
}

// Chiusura del modal informativo
function chiudiInfoModal() {
    document.getElementById('info-modal').style.display = 'none';
}