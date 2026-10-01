document.addEventListener('DOMContentLoaded', () => {
    const langSalvata = localStorage.getItem('eat_me_first_lang') || 'it';
    const selectLang = document.getElementById('select-lingua');
    if (selectLang) {
        selectLang.value = langSalvata;
    }
    applicaTraduzioniInterfaccia(langSalvata);
    renderizzaListe();

    // Controlla se l'utente ha scelto di non vedere più la guida all'avvio
    const nonMostrareGuida = localStorage.getItem('eat_me_first_nascondi_guida_liste') === 'true';
    if (!nonMostrareGuida) {
        apriGuidaListe();
    }
});

let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {
    dispensa: []
};

// Imposta a 'false' se vuoi testare il blocco della funzione Premium predittiva
let isPremiumActive = true; 

function salvaDb() {
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    renderizzaListe();
}

function formattaDataItaliana(dataStr) {
    if (!dataStr) return '';
    let parti = dataStr.split('-');
    if (parti.length === 3) {
        let anno2CIFRE = parti[0].slice(-2);
        return `${parti[2]}/${parti[1]}/${anno2CIFRE}`;
    }
    return dataStr;
}

function cambiaVistaSpesa(vista) {
    const btnPrendere = document.getElementById('tab-btn-prendere');
    const btnPresi = document.getElementById('tab-btn-presi');
    const sezPrendere = document.getElementById('sezione-prendere');
    const sezPresi = document.getElementById('sezione-presi');

    if (vista === 'prendere') {
        btnPrendere.classList.add('active');
        btnPresi.classList.remove('active');
        sezPrendere.style.display = 'block';
        sezPresi.style.display = 'none';
    } else {
        btnPresi.classList.add('active');
        btnPrendere.classList.remove('active');
        sezPresi.style.display = 'block';
        sezPrendere.style.display = 'none';
    }
}

// --- GESTIONE TRADUZIONI MULTILINGUA ---
const dizionarioListe = {
    it: {
        spesa_lista: "Lista della Spesa",
        btnGuidaTesto: "ℹ️ Guida",
        tabPrendere: "Da Prendere",
        tabPresi: "Già Presi (Carrello)",
        titoloSezionePrendere: "Articoli da Acquistare",
        descSezionePrendere: "Metti la spunta sui prodotti presi. Quelli non spuntati rimarranno qui per la prossima spesa.",
        titoloSezionePresi: "Prodotti nel Carrello (Già Presi)",
        descSezionePresi: "Riepilogo dei prodotti acquistati. Cliccando il pulsante sotto verranno pulite le visualizzazioni sbarrate.",
        btnPulisci: "Pulisci testi sbarrati",
        navBack: "← Torna al Menu Principale",
        footer: "EatMeFirst • Gestione locale sicura",
        esaurito: "Esaurito",
        inScadenza: "In esaurimento / Smart",
        ubicazione: "Ubicazione",
        scadenza: "Scadenza",
        preso: "Preso",
        vuotoPrendere: "Nessun prodotto da acquistare.",
        vuotoCarrello: "Nessun prodotto nel carrello. Spunta gli articoli mentre fai la spesa.",
        premiumLockedMsg: "🔒 Funzione Smart/Predittiva Premium bloccata: Attiva l'abbonamento per visualizzare i suggerimenti intelligenti basati sul consumo.",
        guidaTitolo: "💡 Come funziona la Lista (Smart)",
        guidaTesto1: "<b>🔴 Rosso:</b> Prodotti già effettivamente esauriti.",
        guidaTesto2: "<b>🟡 Giallo (Smart/Premium):</b> Prodotti che l'algoritmo prevede si esauriranno prima del tuo prossimo ritorno al supermercato.",
        guidaTesto3: "Spunta i prodotti mentre fai la spesa e usa 'Pulisci testi sbarrati' per ripulire il carrello.",
        nonMostrarePiu: "Non mostrare più questo messaggio all'avvio",
        guidaChiudi: "Ho capito, procedi"
    },
    en: {
        spesa_lista: "Shopping List",
        btnGuidaTesto: "ℹ️ Guide",
        tabPrendere: "To Buy",
        tabPresi: "Already Taken (Cart)",
        titoloSezionePrendere: "Items to Buy",
        descSezionePrendere: "Check items as you take them. Unchecked items remain for your next trip.",
        titoloSezionePresi: "Cart Items (Already Taken)",
        descSezionePresi: "Summary of purchased items. Click below to clear crossed-out items.",
        btnPulisci: "Clear crossed items",
        navBack: "← Back to Main Menu",
        footer: "EatMeFirst • Secure local management",
        esaurito: "Out of stock",
        inScadenza: "Low stock / Smart",
        ubicazione: "Location",
        scadenza: "Expires",
        preso: "Taken",
        vuotoPrendere: "No items to buy.",
        vuotoCarrello: "No items in the cart.",
        premiumLockedMsg: "🔒 Premium Smart/Predictive feature locked: Upgrade to unlock consumption predictions.",
        guidaTitolo: "💡 How the List Works (Smart)",
        guidaTesto1: "<b>🔴 Red:</b> Out-of-stock items.",
        guidaTesto2: "<b>🟡 Yellow (Smart/Premium):</b> Items predicted to run out before your next grocery trip.",
        guidaTesto3: "Check items while shopping and use 'Clear crossed items' when back home.",
        nonMostrarePiu: "Don't show this message again at startup",
        guidaChiudi: "Got it, let's go"
    },
    es: {
        spesa_lista: "Lista de la Compra", btnGuidaTesto: "ℹ️ Guía", tabPrendere: "Comprar", tabPresi: "En Carrito",
        titoloSezionePrendere: "Artículos a Comprar", descSezionePrendere: "Marca los productos cogidos.",
        titoloSezionePresi: "Productos en el Carrito", descSezionePresi: "Resumen de compras.", btnPulisci: "Limpiar tachados",
        navBack: "← Volver al Menú", footer: "EatMeFirst • Gestión segura", esaurito: "Agotado", inScadenza: "Smart",
        ubicazione: "Ubicación", scadenza: "Caducidad", preso: "Cogido", vuotoPrendere: "No hay productos.",
        vuotoCarrello: "Carrito vacío.", premiumLockedMsg: "🔒 Función Smart Premium bloqueada.",
        guidaTitolo: "💡 Ayuda", guidaTesto1: "🔴 Productos ya agotados.", guidaTesto2: "🟡 Sugerencias Smart por previsión.", guidaTesto3: "Usa la lista con facilidad.",
        nonMostrarePiu: "No volver a mostrar", guidaChiudi: "Entendido"
    },
    fr: {
        spesa_lista: "Liste de Courses", btnGuidaTesto: "ℹ Guide", tabPrendere: "À Acheter", tabPresi: "Panier",
        titoloSezionePrendere: "Articles à Acheter", descSezionePrendere: "Cochez les produits pris.",
        titoloSezionePresi: "Articles dans le Panier", descSezionePresi: "Résumé des achats.", btnPulisci: "Effacer barrés",
        navBack: "← Retour au Menu", footer: "EatMeFirst • Gestion locale", esaurito: "Épuisé", inScadenza: "Smart",
        ubicazione: "Emplacement", scadenza: "Expiration", preso: "Pris", vuotoPrendere: "Aucun article.",
        vuotoCarrello: "Panier vide.", premiumLockedMsg: "🔒 Fonction Smart Premium verrouillée.",
        guidaTitolo: "💡 Aide", guidaTesto1: "🔴 Articles déjà épuisés.", guidaTesto2: "🟡 Suggestions Smart par prévision.", guidaTesto3: "Cochez vos articles.",
        nonMostrarePiu: "Ne plus afficher", guidaChiudi: "Compris"
    },
    de: {
        spesa_lista: "Einkaufsliste", btnGuidaTesto: "ℹ️ Hilfe", tabPrendere: "Zu kaufen", tabPresi: "Wagen",
        titoloSezionePrendere: "Einkaufsartikel", descSezionePrendere: "Haken Sie gekaufte Artikel ab.",
        titoloSezionePresi: "Artikel im Wagen", descSezionePresi: "Zusammenfassung.", btnPulisci: "Durchgestrichene löschen",
        navBack: "← Zum Menü", footer: "EatMeFirst • Sichere lokale Verwaltung", esaurito: "Ausverkauft", inScadenza: "Smart",
        ubicazione: "Standort", scadenza: "Verfallsdatum", preso: "Mitgenommen", vuotoPrendere: "Keine Artikel.",
        vuotoCarrello: "Wagen leer.", premiumLockedMsg: "🔒 Smart Premium-Funktion gesperrt.",
        guidaTitolo: "💡 Hilfe", guidaTesto1: "🔴 Bereits ausverkaufte Artikel.", guidaTesto2: "🟡 Vorhergesagte Artikel.", guidaTesto3: "Viel Spaß beim Einkaufen.",
        nonMostrarePiu: "Nicht mehr anzeigen", guidaChiudi: "Verstanden"
    }
};

function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    applicaTraduzioniInterfaccia(lang);
    renderizzaListe();
}

function applicaTraduzioniInterfaccia(lang) {
    const t = dizionarioListe[lang] || dizionarioListe['it'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) {
            el.innerHTML = t[chiave];
        }
    });
}

function apriGuidaListe() {
    document.getElementById('modal-guida').style.display = 'flex';
}

function chiudiGuidaListe() {
    const chkNascondi = document.getElementById('chk-non-mostrare');
    if (chkNascondi && chkNascondi.checked) {
        localStorage.setItem('eat_me_first_nascondi_guida_liste', 'true');
    }
    document.getElementById('modal-guida').style.display = 'none';
}

// --- RENDERIZZAZIONE INTELLIGENTE DELLE LISTE ---
function renderizzaListe() {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioListe[lang] || dizionarioListe['it'];

    let htmlDaPrendere = '';
    let htmlGiaPresi = '';
    const giorniMancantiAlSupermercato = 7; 

    let prodottiRossi = []; 
    let prodottiGialli = []; 

    (db.dispensa || []).forEach(item => {
        let consumo = item.consumoGiornaliero || 1;
        let giacenza = item.giacenza !== undefined ? item.giacenza : (item.lowStock ? 0 : 5); 
        let giorniAutonomia = giacenza / consumo;

        let giorniScadenza = 999;
        if (item.scadenza) {
            let oggi = new Date();
            let dataScad = new Date(item.scadenza);
            let diffTime = dataScad - oggi;
            giorniScadenza = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // Rosso: Solo prodotti effettivamente esauriti
        if (giacenza === 0 || item.lowStock) {
            prodottiRossi.push(item);
        } 
        // Giallo: Previsione esaurimento o scadenza vicina
        else if (giorniAutonomia < giorniMancantiAlSupermercato || giorniScadenza <= 10) {
            prodottiGialli.push(item);
        }
    });

    // Render Prodotti Rossi (Effettivamente esauriti - sempre attivi)
    prodottiRossi.forEach(item => {
        let dataFormatted = formattaDataItaliana(item.scadenza);
        if (!item.preso) {
            htmlDaPrendere += `
                <div class="item-row low-stock" style="border-left: 4px solid var(--accent-danger); background-color: rgba(239, 68, 68, 0.05);">
                    <input type="checkbox" style="transform: scale(1.3); cursor: pointer;" onchange="spuntatoProdotto(${item.id})">
                    <div class="item-info">
                        <div class="item-title" style="color: var(--accent-danger);">${item.nome} 🔴 (${t.esaurito})</div>
                        <div class="item-details">${t.ubicazione}: ${item.ubicazione || 'N/D'} | ${t.scadenza}: ${dataFormatted}</div>
                    </div>
                </div>`;
        } else {
            htmlDaPrendere += `
                <div class="item-row" style="background-color: #21262d;">
                    <input type="checkbox" checked disabled style="transform: scale(1.3);">
                    <div class="item-info" style="color: var(--text-muted);">
                        <div class="item-title" style="text-decoration: line-through; color: var(--text-muted);">${item.nome}</div>
                        <div class="item-details">${t.ubicazione}: ${item.ubicazione || 'N/D'} | ${t.scadenza}: ${dataFormatted}</div>
                    </div>
                </div>`;

            htmlGiaPresi += `
                <div class="item-row">
                    <div class="item-info">
                        <div class="item-title" style="color: var(--accent-green);">&#10004; ${item.nome}</div>
                        <div class="item-details">${t.ubicazione}: ${item.ubicazione || 'N/D'} | ${t.preso}</div>
                    </div>
                </div>`;
        }
    });

    // Render Prodotti Gialli (Funzione Smart protetta da controllo Premium)
    if (prodottiGialli.length > 0) {
        if (isPremiumActive) {
            prodottiGialli.forEach(item => {
                let dataFormatted = formattaDataItaliana(item.scadenza);
                if (!item.preso) {
                    htmlDaPrendere += `
                        <div class="item-row" style="border-left: 4px solid var(--accent-warning); background-color: rgba(245, 158, 11, 0.05);">
                            <input type="checkbox" style="transform: scale(1.3); cursor: pointer;" onchange="spuntatoProdotto(${item.id})">
                            <div class="item-info">
                                <div class="item-title" style="color: var(--accent-warning);">${item.nome} 🟡 (${t.inScadenza})</div>
                                <div class="item-details">${t.ubicazione}: ${item.ubicazione || 'N/D'} | ${t.scadenza}: ${dataFormatted}</div>
                            </div>
                        </div>`;
                } else {
                    htmlDaPrendere += `
                        <div class="item-row" style="background-color: #21262d;">
                            <input type="checkbox" checked disabled style="transform: scale(1.3);">
                            <div class="item-info" style="color: var(--text-muted);">
                                <div class="item-title" style="text-decoration: line-through; color: var(--text-muted);">${item.nome}</div>
                                <div class="item-details">${t.ubicazione}: ${item.ubicazione || 'N/D'} | ${t.scadenza}: ${dataFormatted}</div>
                            </div>
                        </div>`;

                    htmlGiaPresi += `
                        <div class="item-row">
                            <div class="item-info">
                                <div class="item-title" style="color: var(--accent-green);">&#10004; ${item.nome}</div>
                                <div class="item-details">${t.ubicazione}: ${item.ubicazione || 'N/D'} | ${t.preso}</div>
                            </div>
                        </div>`;
                }
            });
        } else {
            // Messaggio blocco Premium visibile se l'utente non ha l'abbonamento attivo
            htmlDaPrendere += `
                <div style="padding: 15px; margin-top: 10px; background: rgba(239, 68, 68, 0.1); border: 1px dashed var(--accent-warning); border-radius: 8px; text-align: center; color: var(--text-muted); font-size: 0.9rem;">
                    ${t.premiumLockedMsg}
                </div>`;
        }
    }

    document.getElementById('lista-da-prendere').innerHTML = htmlDaPrendere || `<p style="padding:10px; color:var(--text-muted); font-style: italic;">${t.vuotoPrendere}</p>`;
    document.getElementById('lista-gia-presi').innerHTML = htmlGiaPresi || `<p style="padding:10px; color:var(--text-muted); font-style: italic;">${t.vuotoCarrello}</p>`;
}

function spuntatoProdotto(id) {
    let item = db.dispensa.find(i => i.id === id);
    if (item) {
        item.preso = true;
        salvaDb();
    }
}

function pulisciProdottiPresi() {
    let acquistatiCount = db.dispensa.filter(i => i.preso).length;
    
    if (acquistatiCount === 0) {
        alert("Non ci sono prodotti spuntati come 'presi' da pulire.");
        return;
    }

    if (confirm("Vuoi ripulire i testi sbarrati dei prodotti acquistati? Quelli non presi rimarranno in lista.")) {
        db.dispensa = db.dispensa.filter(item => !item.preso);
        salvaDb();
        cambiaVistaSpesa('prendere');
    }
}