document.addEventListener('DOMContentLoaded', () => {
    applicaTraduzioniInterfaccia();
    inizializzaCalendarioScadenze();
});

function toggleMenu() {
    const menu = document.getElementById('side-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

function cambiaLingua(lang) {
    localStorage.setItem('eat_lang', lang);
    applicaTraduzioniInterfaccia();
    window.dispatchEvent(new CustomEvent('linguaCambiata', { detail: lang }));
    inizializzaCalendarioScadenze();
}

// Dizionario multilingua completo
const dizionarioStatistiche = {
    it: {
        stat_page_title: "ChefStock - Statistiche & Agenda Scadenze",
        stat_header: "Agenda Scadenze & Statistiche",
        menu_titolo: "Menu ChefStock",
        menu_home: "🏠 Menu Principale",
        menu_dispensa: "📦 Consultazione Inventario",
        menu_liste: "🛒 Lista della Spesa",
        menu_statistiche: "📊 Statistiche & Scadenze",
        card_titolo_calendario: "📅 Prossimi 30 Giorni in Scadenza",
        card_subtitle_calendario: "Scorri la barra per visualizzare l'andamento. Clicca su una colonna per scoprire i prodotti del giorno.",
        legenda_fresco: "Fresco (Tassativo)",
        legenda_consigliato: "Consigliato",
        modal_chiudi: "Chiudi"
    },
    en: {
        stat_page_title: "ChefStock - Statistics & Expiration Schedule",
        stat_header: "Expiration Schedule & Statistics",
        menu_titolo: "ChefStock Menu",
        menu_home: "🏠 Main Menu",
        menu_dispensa: "📦 Stock Inventory",
        menu_liste: "🛒 Shopping List",
        menu_statistiche: "📊 Statistics & Expirations",
        card_titolo_calendario: "📅 Next 30 Expiration Days",
        card_subtitle_calendario: "Scroll the bar to view trends. Click on a column to see items for that day.",
        legenda_fresco: "Urgent (Strict)",
        legenda_consigliato: "Recommended",
        modal_chiudi: "Close"
    },
    fr: {
        stat_page_title: "ChefStock - Statistiques & Calendrier",
        stat_header: "Calendrier des Péremptions & Statistiques",
        menu_titolo: "Menu ChefStock",
        menu_home: "🏠 Menu Principal",
        menu_dispensa: "📦 Inventaire des Stocks",
        menu_liste: "🛒 Liste de Courses",
        menu_statistiche: "📊 Statistiques & Péremptions",
        card_titolo_calendario: "📅 Prochains 30 Jours d'Expiration",
        card_subtitle_calendario: "Faites défiler pour voir les tendances. Cliquez sur une colonne pour voir les produits.",
        legenda_fresco: "Frais (Strict)",
        legenda_consigliato: "Conseillé",
        modal_chiudi: "Fermer"
    },
    es: {
        stat_page_title: "ChefStock - Estadísticas y Agenda",
        stat_header: "Agenda de Caducidades y Estadísticas",
        menu_titolo: "Menú ChefStock",
        menu_home: "🏠 Menú Principal",
        menu_dispensa: "📦 Inventario de Existencias",
        menu_liste: "🛒 Lista de la Compra",
        menu_statistiche: "📊 Estadísticas y Caducidades",
        card_titolo_calendario: "📅 Próximos 30 Días de Caducidad",
        card_subtitle_calendario: "Desplácese para ver la tendencia. Haga clic en una columna para ver los productos.",
        legenda_fresco: "Fresco (Estricto)",
        legenda_consigliato: "Recomendado",
        modal_chiudi: "Cerrar"
    },
    de: {
        stat_page_title: "ChefStock - Statistiken & Fristen",
        stat_header: "Fristenkalender & Statistiken",
        menu_titolo: "ChefStock Menü",
        menu_home: "🏠 Hauptmenü",
        menu_dispensa: "📦 Bestandsinventar",
        menu_liste: "🛒 Einkaufsliste",
        menu_statistiche: "📊 Statistiken & Fristen",
        card_titolo_calendario: "📅 Nächste 30 Verfallstage",
        card_subtitle_calendario: "Leiste scrollen, um den Trend anzuzeigen. Auf eine Spalte klicken, um Artikel anzuzeigen.",
        legenda_fresco: "Frisch (Streng)",
        legenda_consigliato: "Empfohlen",
        modal_chiudi: "Schließen"
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

    const t = dizionarioStatistiche[lang] || dizionarioStatistiche['it'];

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

// Funzione di popolamento del calendario a 30 giorni
function inizializzaCalendarioScadenze() {
    const container = document.getElementById('calendario-30-giorni');
    if (!container) return;

    container.innerHTML = '';

    // Tenta di leggere l'inventario da tutte le possibili chiavi salvate nel progetto
    let prodotti = [];
    const possibiliChiavi = ['inventario', 'chefstock_prodotti', 'eat_prodotti', 'prodotti'];
    for (let chiave of possibiliChiavi) {
        const dati = localStorage.getItem(chiave);
        if (dati) {
            try {
                const parsed = JSON.parse(dati);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    prodotti = parsed;
                    break;
                }
            } catch (e) {}
        }
    }

    const lang = localStorage.getItem('eat_lang') || 'it';
    const oggi = new Date();
    
    // Genera 30 giorni in avanti
    for (let i = 0; i < 30; i++) {
        let dataCorrente = new Date();
        dataCorrente.setDate(oggi.getDate() + i);
        
        // Formato data standard YYYY-MM-DD per il confronto con le scadenze salvate
        const anno = dataCorrente.getFullYear();
        const mese = String(dataCorrente.getMonth() + 1).padStart(2, '0');
        const giorno = String(dataCorrente.getDate()).padStart(2, '0');
        const formatoDataKey = `${anno}-${mese}-${giorno}`;

        const etichettaGiorno = dataCorrente.toLocaleDateString(lang, { weekday: 'short', day: 'numeric', month: 'numeric' });

        // Cerca i prodotti in scadenza in questa data (controlla campi comuni come scadenza, dataScadenza, expire)
        const scadenzeGiorno = prodotti.filter(p => {
            const sc = p.scadenza || p.dataScadenza || p.expire || '';
            return sc.startsWith(formatoDataKey);
        });

        const altezzaBarra = Math.min(scadenzeGiorno.length * 20 + 20, 110);

        const colonna = document.createElement('div');
        colonna.style.cssText = `display: flex; flex-direction: column; align-items: center; min-width: 50px; cursor: pointer;`;
        colonna.onclick = () => apriModalGiorno(etichettaGiorno, scadenzeGiorno);

        colonna.innerHTML = `
            <div style="font-size: 0.7rem; color: var(--accent-blue, #38bdf8); font-weight: bold; margin-bottom: 4px; height: 15px;">${scadenzeGiorno.length > 0 ? scadenzeGiorno.length : ''}</div>
            <div style="width: 30px; height: ${Math.max(altezzaBarra, 20)}px; background: ${scadenzeGiorno.length > 0 ? 'var(--warning, #e74c3c)' : 'var(--border-color, #334155)'}; border-radius: 6px 6px 0 0; transition: transform 0.2s, background 0.2s;"></div>
            <div style="font-size: 0.7rem; color: var(--text-muted, #94a3b8); margin-top: 8px; text-align: center; white-space: nowrap;">${etichettaGiorno}</div>
        `;
        
        // Effetto hover sulla colonna
        colonna.onmouseenter = () => { colonna.style.transform = 'translateY(-3px)'; };
        colonna.onmouseleave = () => { colonna.style.transform = 'translateY(0)'; };

        container.appendChild(colonna);
    }
}

function apriModalGiorno(dataStr, prodotti) {
    const modal = document.getElementById('modal-giorno');
    const titolo = document.getElementById('modal-data-titolo');
    const lista = document.getElementById('modal-lista-prodotti');

    if (titolo) titolo.textContent = `Scadenze: ${dataStr}`;
    if (lista) {
        if (prodotti.length === 0) {
            lista.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 15px;">Nessun prodotto in scadenza in questa data.</p>`;
        } else {
            lista.innerHTML = prodotti.map(p => `
                <div style="padding: 10px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500; color: var(--text-main);">${p.nome || p.descrizione || p.prodotto || 'Prodotto'}</span>
                    <span style="background: rgba(56, 189, 248, 0.1); color: var(--accent-blue); padding: 3px 8px; border-radius: 4px; font-size: 0.8rem;">${p.quantita || p.qta || 1} pz</span>
                </div>
            `).join('');
        }
    }
    if (modal) modal.style.display = 'flex';
}

function chiudiModalGiorno() {
    const modal = document.getElementById('modal-giorno');
    if (modal) modal.style.display = 'none';
}