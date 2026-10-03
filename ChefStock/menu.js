document.addEventListener('DOMContentLoaded', () => {
    // Inizializzazione selettore lingua nella barra superiore
    const containerLang = document.getElementById('header-lang');
    if (containerLang && !containerLang.querySelector('select')) {
        if (typeof creaSelettoreLinguaHTML === 'function') {
            containerLang.innerHTML = creaSelettoreLinguaHTML();
        } else {
            containerLang.innerHTML = `
                <select id="lingua-select" onchange="cambiaLinguaLocale(this.value)">
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

// Funzione globale compatibile anche con l'onchange del select diretto in HTML
function cambiaLingua(lang) {
    cambiaLinguaLocale(lang);
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

// Dizionari multilingua per la pagina menu (voci, pulsanti e testi informativi per i modali ❓)
const dizionarioMenu = {
    it: {
        menu_page_title: "ChefStock - Menu Principale",
        menu_subtitle: "Menu Principale di Gestione",
        menu_inventario: "📦 Consultazione Inventario",
        menu_carica: "➕ Carica Merci (Scansione)",
        menu_scarico: "📉 Scarico e Consumo Rapido",
        menu_spesa: "🛒 Lista della Spesa",
        menu_statistiche: "📊 Statistiche & Report",
        menu_ricordati: "🔔 Ricordati di...",
        menu_aggiornamenti: "🚀 Aggiornamenti & Manutenzione",
        tipWelcome: "Consiglio: Accanto ad ogni comando trovi un'icona (?) per scoprire i dettagli d'uso.",
        footer_text: "ChefStock • Gestione Professionale Magazzino Cucina",
        info: {
            inventario: {
                titolo: "📦 Consultazione Inventario",
                testo: "Qui puoi visualizzare l'elenco completo dei prodotti registrati in ChefStock. Puoi verificare in tempo reale le quantità disponibili, i numeri di lotto e le date di scadenza. I prodotti sono evidenziati con colori differenti in base all'urgenza di consumo."
            },
            scansione: {
                titolo: "➕ Carica Merci (Scansione)",
                testo: "Sezione dedicata al carico rapido delle merci. Puoi collegare un lettore barcode USB/wireless oppure usare la fotocamera. Se un codice manca, l'app ti permette di inserire manualmente descrizione, scadenze e quantità."
            },
            scarico: {
                titolo: "📉 Scarico e Consumo Rapido",
                testo: "Sezione ottimizzata per il servizio in cucina: cerca rapidamente i prodotti e scala le quantità consumate o scartate, aggiornando istantaneamente le giacenze di magazzino."
            },
            spesa: {
                titolo: "🛒 Lista della Spesa",
                testo: "Questo blocco monitora automaticamente i prodotti che sono scesi sotto la soglia minima o che risultano esauriti, aiutandoti a generare la lista degli acquisti per i rifornimenti."
            },
            statistiche: {
                titolo: "📊 Statistiche & Report",
                testo: "Analizza i dati storici sui consumi, i prodotti più movimentati, l'andamento delle scorte e gli sprechi per ottimizzare gli ordini e la gestione del magazzino."
            },
            ricordati: {
                titolo: "🔔 Ricordati di...",
                testo: "Promemoria e avvisi utili configurati per segnalare scadenze imminenti, pulizie periodiche o attività di controllo importanti in cucina."
            },
            aggiornamenti: {
                titolo: "🚀 Aggiornamenti & Manutenzione",
                testo: "Verifica lo stato del sistema, gestisci i backup di sicurezza dei dati e consulta le novità e i miglioramenti introdotti nelle ultime versioni."
            }
        }
    },
    en: {
        menu_page_title: "ChefStock - Main Menu",
        menu_subtitle: "Main Management Menu",
        menu_inventario: "📦 Stock Inventory",
        menu_carica: "➕ Add Stock (Scan)",
        menu_scarico: "📉 Quick Checkout & Consumption",
        menu_spesa: "🛒 Shopping List",
        menu_statistiche: "📊 Statistics & Reports",
        menu_ricordati: "🔔 Remember to...",
        menu_aggiornamenti: "🚀 Updates & Maintenance",
        tipWelcome: "Tip: Next to each command you will find a (?) icon to discover usage details.",
        footer_text: "ChefStock • Professional Kitchen Management",
        info: {
            inventario: { titolo: "📦 Stock Inventory", testo: "View the complete list of registered products, available quantities, batch numbers, and expiration dates." },
            scansione: { titolo: "➕ Add Stock (Scan)", testo: "Register incoming products via barcode scanner or camera, managing batches and expiration dates." },
            scarico: { titolo: "📉 Quick Checkout", testo: "Quickly look up items and log consumption or waste during service, updating stock levels instantly." },
            spesa: { titolo: "🛒 Shopping List", testo: "Monitors out-of-stock or low-stock items to help you generate shopping lists easily for upcoming supplies." },
            statistiche: { titolo: "📊 Statistics & Reports", testo: "Analyze consumption history, top items, stock trends, and waste to optimize orders." },
            ricordati: { titolo: "🔔 Remember to...", testo: "Reminders and alerts configured for upcoming expiration dates, periodic cleaning, or kitchen controls." },
            aggiornamenti: { titolo: "🚀 Updates & Maintenance", testo: "Check system status, manage data backups, and view release notes for recent updates." }
        }
    },
    fr: {
        menu_page_title: "ChefStock - Menu Principal",
        menu_subtitle: "Menu Principal de Gestion",
        menu_inventario: "📦 Inventaire des Stocks",
        menu_carica: "➕ Charger (Scan)",
        menu_scarico: "📉 Sortie Rapide",
        menu_spesa: "🛒 Liste de Courses",
        menu_statistiche: "📊 Statistiques & Rapports",
        menu_ricordati: "🔔 Rappelez-vous de...",
        menu_aggiornamenti: "🚀 Mises à jour & Maintenance",
        tipWelcome: "Conseil : À côté de chaque commande, trouvez une icône (?) pour plus de détails.",
        footer_text: "ChefStock • Gestion Professionnelle",
        info: {
            inventario: { titolo: "📦 Inventaire", testo: "Visualisez l'état actuel des stocks, lots et dates de péremption." },
            scansione: { titolo: "➕ Charger (Scan)", testo: "Enregistrez l'entrée de nouveaux produits par code-barres." },
            scarico: { titolo: "📉 Sortie Rapide", testo: "Déduisez rapidement les produits consommés pendant le service." },
            spesa: { titolo: "🛒 Liste de Courses", testo: "Surveillez les articles épuisés à réapprovisionner." },
            statistiche: { titolo: "📊 Statistiques & Rapports", testo: "Analysez l'historique des consommations et les tendances de stock." },
            ricordati: { titolo: "🔔 Rappels", testo: "Alertes et rappels pour les tâches de cuisine." },
            aggiornamenti: { titolo: "🚀 Mises à jour", testo: "État du système et sauvegardes." }
        }
    },
    es: {
        menu_page_title: "ChefStock - Menú Principal",
        menu_subtitle: "Menú Principal de Gestión",
        menu_inventario: "📦 Inventario de Existencias",
        menu_carica: "➕ Cargar (Escanear)",
        menu_scarico: "📉 Descarga y Consumo",
        menu_spesa: "🛒 Lista de la Compra",
        menu_statistiche: "📊 Estadísticas e Informes",
        menu_ricordati: "🔔 Acuérdate de...",
        menu_aggiornamenti: "🚀 Actualizaciones y Mantenimiento",
        tipWelcome: "Consejo: Junto a cada comando hay un icono (?) con detalles.",
        footer_text: "ChefStock • Gestión Profesional",
        info: {
            inventario: { titolo: "📦 Inventario", testo: "Consulta el listado completo de existencias y fechas de caducidad." },
            scansione: { titolo: "➕ Cargar (Escanear)", testo: "Registra nuevos productos escaneando códigos de barras." },
            scarico: { titolo: "📉 Descarga y Consumo", testo: "Descuenta existencias rápidamente durante el servicio de cocina." },
            spesa: { titolo: "🛒 Lista de la Compra", testo: "Monitorea artículos agotados para reabastecer." },
            statistiche: { titolo: "📊 Estadísticas e Informes", testo: "Analiza el historial de consumo, tendencias y mermas." },
            ricordati: { titolo: "🔔 Acuérdate de...", testo: "Recordatorios y avisos útiles para el control de la cocina." },
            aggiornamenti: { titolo: "🚀 Actualizaciones", testo: "Estado del sistema y copias de seguridad." }
        }
    },
    de: {
        menu_page_title: "ChefStock - Hauptmenü",
        menu_subtitle: "Hauptverwaltungsmenü",
        menu_inventario: "📦 Bestandsinventar",
        menu_carica: "➕ Hinzufügen (Scan)",
        menu_scarico: "📉 Schnell-Ausbuchung",
        menu_spesa: "🛒 Einkaufsliste",
        menu_statistiche: "📊 Statistiken & Berichte",
        menu_ricordati: "🔔 Denken Sie daran...",
        menu_aggiornamenti: "🚀 Updates & Wartung",
        tipWelcome: "Tipp: Neben jedem Befehl finden Sie ein (?)-Symbol.",
        footer_text: "ChefStock • Professionelles Küchenmanagement",
        info: {
            inventario: { titolo: "📦 Bestandsinventar", testo: "Aktuellen Lagerbestand, Chargen und Verfallsdaten anzeigen." },
            scansione: { titolo: "➕ Hinzufügen (Scan)", testo: "Wareneingang per Barcode-Scanner oder Kamera erfassen." },
            scarico: { titolo: "📉 Schnell-Ausbuchung", testo: "Verbrauchte Artikel während des Service schnell ausbuchen." },
            spesa: { titolo: "🛒 Einkaufsliste", testo: "Fehlende oder zur Neige gehende Artikel überwachen." },
            statistiche: { titolo: "📊 Statistiken & Berichte", testo: "Verbrauchshistorie, Trends und Bestandsveränderungen analysieren." },
            ricordati: { titolo: "🔔 Erinnerungen", testo: "Hinweise zu Verfallsdaten und Küchenaufgaben." },
            aggiornamenti: { titolo: "🚀 Updates", testo: "Systemstatus und Daten-Backups verwalten." }
        }
    }
};

function applicaTraduzioniInterfaccia() {
    let lang = 'it';
    if (typeof getLinguaCorrente === 'function') {
        lang = getLinguaCorrente();
    } else {
        lang = localStorage.getItem('eat_lang') || 'it';
    }

    const selectEl = document.querySelector('#header-lang select') || document.getElementById('lingua-select');
    if (selectEl) selectEl.value = lang;

    const t = dizionarioMenu[lang] || dizionarioMenu['it'];

    // Traduci elementi con attributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) {
            if (el.tagName === 'TITLE') {
                document.title = t[chiave];
            } else {
                el.textContent = t[chiave];
            }
        }
    });
}

window.addEventListener('linguaCambiata', () => {
    applicaTraduzioniInterfaccia();
});

// Apertura del modal informativo specifico con supporto multilingua
function apriInfoMenu(chiave) {
    let lang = 'it';
    if (typeof getLinguaCorrente === 'function') {
        lang = getLinguaCorrente();
    } else {
        lang = localStorage.getItem('eat_lang') || 'it';
    }

    const t = dizionarioMenu[lang] || dizionarioMenu['it'];
    const infoMap = t.info || dizionarioMenu.it.info;
    const info = infoMap[chiave] || { titolo: "Informazione", testo: "Nessun dettaglio disponibile." };

    const titoloEl = document.getElementById('info-titolo');
    const testoEl = document.getElementById('info-testo');
    const modalEl = document.getElementById('modal-info-menu');

    if (titoloEl) titoloEl.textContent = info.titolo;
    if (testoEl) testoEl.textContent = info.testo;
    if (modalEl) modalEl.style.display = 'flex';
}

// Chiusura del modal informativo
function chiudiInfoMenu() {
    const modalEl = document.getElementById('modal-info-menu');
    if (modalEl) modalEl.style.display = 'none';
}