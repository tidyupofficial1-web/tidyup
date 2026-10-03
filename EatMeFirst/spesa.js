document.addEventListener('DOMContentLoaded', () => {
    const containerLang = document.getElementById('header-lang');
    if (containerLang && typeof creaSelettoreLinguaHTML === 'function') {
        containerLang.innerHTML = creaSelettoreLinguaHTML();
    }
    
    applicaTraduzioniSpesaExtra();
    renderizzaListeExtra();
    gestisciLoopVideo();

    const nonMostrareGuidaSpesa = localStorage.getItem('eat_me_first_nascondi_guida_spesa') === 'true';
    if (!nonMostrareGuidaSpesa) {
        apriGuidaSpesa();
    }
});

let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa_extra: [] };
let isPremiumActive = true; 

if (!db.spesa_extra) {
    db.spesa_extra = [];
}

const dizionarioSpesaExtra = {
    it: {
        spesa_extra_titolo: "Spesa Extra (Extra-Dispensa)",
        btnGuidaTesto: "ℹ️ Guida",
        sec_spesa_extra: "Lavagnetta Prodotti Extra (Funzione Premium)",
        desc_spesa_extra: "Inserisci qui i prodotti extra non presenti in dispensa. Verranno uniti automaticamente nella lista generale della pagina Liste.",
        titolo_aggiungi_extra: "Aggiungi Prodotto Extra",
        placeholder_extra: "Es. Candeline compleanno, Lampadina...",
        btnAggiungi: "Aggiungi",
        tabPrendere: "Da Prendere",
        tabPresi: "Già Presi (Carrello)",
        btnPulisciExtra: "Pulisci extra acquistati",
        navBack: "← Torna al Menu Principale",
        footer: "EatMeFirst • Gestione locale sicura",
        guidaSpesaTitolo: "💡 Come funziona la Spesa Extra",
        guidaSpesaTesto1: "Questa sezione ti permette di gestire liberamente elementi che non fanno parte della dispensa monitorata.",
        guidaSpesaTesto2: "Inserisci una descrizione dettagliata del prodotto: l'applicazione analizzerà il testo per assegnarlo automaticamente al reparto corretto.",
        nonMostrarePiu: "Non mostrare più questo messaggio all'avvio",
        guidaChiudi: "Ho capito, procedi",
        repartoAuto: "Reparto (Auto)",
        vuotoExtra: "Nessun prodotto extra inserito.",
        vuotoCarrelloExtra: "Nessun prodotto extra nel carrello.",
        premiumBloccato: "🔒 Funzione Premium Bloccata: Sblocca l'accesso completo alla lavagnetta Spesa Extra."
    },
    en: {
        spesa_extra_titolo: "Extra Shopping (Extra-Pantry)",
        btnGuidaTesto: "ℹ️ Guide",
        sec_spesa_extra: "Extra Products Board (Premium Feature)",
        desc_spesa_extra: "Enter extra products not found in your pantry here. They will automatically merge into the general List page.",
        titolo_aggiungi_extra: "Add Extra Product",
        placeholder_extra: "E.g., Birthday candles, Lightbulb...",
        btnAggiungi: "Add",
        tabPrendere: "To Buy",
        tabPresi: "Already Taken (Cart)",
        btnPulisciExtra: "Clear purchased extras",
        navBack: "← Back to Main Menu",
        footer: "EatMeFirst • Secure local management",
        guidaSpesaTitolo: "💡 How Extra Shopping Works",
        guidaSpesaTesto1: "This section lets you freely manage items that are not part of your monitored pantry.",
        guidaSpesaTesto2: "Enter a detailed description of the product: the app will analyze the text to assign it to the correct department automatically.",
        nonMostrarePiu: "Don't show this message again at startup",
        guidaChiudi: "Got it, let's go",
        repartoAuto: "Department (Auto)",
        vuotoExtra: "No extra products entered.",
        vuotoCarrelloExtra: "No extra products in cart.",
        premiumBloccato: "🔒 Premium Feature Locked: Unlock full access to the Extra Shopping board."
    },
    es: {
        spesa_extra_titolo: "Compra Extra", btnGuidaTesto: "ℹ️ Guía", sec_spesa_extra: "Tablero Extra (Premium)",
        desc_spesa_extra: "Añade productos fuera de despensa.", titolo_aggiungi_extra: "Añadir Extra",
        placeholder_extra: "Ej. Velas, Bombilla...", btnAggiungi: "Añadir", tabPrendere: "Comprar",
        tabPresi: "En Carrito", btnPulisciExtra: "Limpiar extras", navBack: "← Volver al Menú",
        footer: "EatMeFirst • Gestión segura", guidaSpesaTitolo: "💡 Ayuda",
        guidaSpesaTesto1: "Gestiona elementos fuera de despensa.", guidaSpesaTesto2: "Asignación automática de sección.",
        nonMostrarePiu: "No volver a mostrar", guidaChiudi: "Entendido", repartoAuto: "Sección (Auto)",
        vuotoExtra: "Ningún extra.", vuotoCarrelloExtra: "Carrito vacío.", premiumBloccato: "🔒 Función bloqueada."
    },
    fr: {
        spesa_extra_titolo: "Courses Extra", btnGuidaTesto: "ℹ Guide", sec_spesa_extra: "Tableau Extra (Premium)",
        desc_spesa_extra: "Ajoutez des produits hors garde-manger.", titolo_aggiungi_extra: "Ajouter Extra",
        placeholder_extra: "Ex. Bougies, Ampoule...", btnAggiungi: "Ajouter", tabPrendere: "À Acheter",
        tabPresi: "Panier", btnPulisciExtra: "Effacer extras", navBack: "← Retour au Menu",
        footer: "EatMeFirst • Gestion locale", guidaSpesaTitolo: "💡 Aide",
        guidaSpesaTesto1: "Gérez les éléments hors stock.", guidaSpesaTesto2: "Attribution automatique de rayon.",
        nonMostrarePiu: "Ne plus afficher", guidaChiudi: "Compris", repartoAuto: "Rayon (Auto)",
        vuotoExtra: "Aucun extra.", vuotoCarrelloExtra: "Panier vide.", premiumBloccato: "🔒 Fonction verrouillée."
    },
    de: {
        spesa_extra_titolo: "Extra-Einkauf", btnGuidaTesto: "ℹ️ Hilfe", sec_spesa_extra: "Extra-Produkte (Premium)",
        desc_spesa_extra: "Zusätzliche Artikel hinzufügen.", titolo_aggiungi_extra: "Extra hinzufügen",
        placeholder_extra: "Z.B. Kerzen, Glühbirne...", btnAggiungi: "Hinzufügen", tabPrendere: "Zu kaufen",
        tabPresi: "Wagen", btnPulisciExtra: "Gekaufte Extras löschen", navBack: "← Zum Menü",
        footer: "EatMeFirst • Sichere Verwaltung", guidaSpesaTitolo: "💡 Hilfe",
        guidaSpesaTesto1: "Artikel außerhalb des Bestands verwalten.", guidaSpesaTesto2: "Automatische Abteilungserkennung.",
        nonMostrarePiu: "Nicht mehr anzeigen", guidaChiudi: "Verstanden", repartoAuto: "Abteilung (Auto)",
        vuotoExtra: "Keine Extras.", vuotoCarrelloExtra: "Wagen leer.", premiumBloccato: "🔒 Funktion gesperrt."
    }
};

function applicaTraduzioniSpesaExtra() {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioSpesaExtra[lang] || dizionarioSpesaExtra['it'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) {
            el.innerHTML = t[chiave];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const chiave = el.getAttribute('data-i18n-placeholder');
        if (t[chiave]) {
            el.placeholder = t[chiave];
        }
    });
}

function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    if (typeof applicaTraduzioniInterfaccia === 'function') {
        applicaTraduzioniInterfaccia(lang);
    }
    applicaTraduzioniSpesaExtra();
    renderizzaListeExtra();
}

function gestisciLoopVideo() {
    const video = document.getElementById('clip-carrello');
    const cardContainer = document.getElementById('card-video-container');
    
    if (!video || !cardContainer) return;

    let contatoreLoop = 0;
    const maxLoop = 3;

    video.addEventListener('ended', () => {
        contatoreLoop++;
        if (contatoreLoop >= maxLoop) {
            cardContainer.style.transition = 'opacity 0.5s ease';
            cardContainer.style.opacity = '0';
            setTimeout(() => {
                cardContainer.style.display = 'none';
            }, 500);
        } else {
            video.play();
        }
    });
}

function apriGuidaSpesa() {
    const modal = document.getElementById('modal-guida-spesa');
    if (modal) modal.style.display = 'flex';
}

function chiudiGuidaSpesa() {
    const chkNascondi = document.getElementById('chk-non-mostrare-spesa');
    if (chkNascondi && chkNascondi.checked) {
        localStorage.setItem('eat_me_first_nascondi_guida_spesa', 'true');
    }
    const modal = document.getElementById('modal-guida-spesa');
    if (modal) modal.style.display = 'none';
}

function cambiaVistaSpesa(vista) {
    const btnPrendere = document.getElementById('tab-btn-prendere');
    const btnPresi = document.getElementById('tab-btn-presi');
    const sezPrendere = document.getElementById('sezione-prendere');
    const sezPresi = document.getElementById('sezione-presi');

    if (vista === 'prendere') {
        btnPrendere.classList.add('active');
        btnPrendere.style.color = 'var(--accent-blue)';
        btnPresi.classList.remove('active');
        btnPresi.style.color = 'var(--text-muted)';
        sezPrendere.style.display = 'block';
        sezPresi.style.display = 'none';
    } else {
        btnPresi.classList.add('active');
        btnPresi.style.color = 'var(--accent-blue)';
        btnPrendere.classList.remove('active');
        btnPrendere.style.color = 'var(--text-muted)';
        sezPresi.style.display = 'block';
        sezPrendere.style.display = 'none';
    }
}

function determinaRepartoAutomatico(testo) {
    let t = testo.toLowerCase();
    if (t.includes('frutta') || t.includes('verdura') || t.includes('mela') || t.includes('insalata') || t.includes('pomodor')) return 'Ortofrutta';
    if (t.includes('latte') || t.includes('formaggio') || t.includes('yogurt') || t.includes('burro') || t.includes('frigo')) return 'Frigo / Latticini';
    if (t.includes('carne') || t.includes('pesce') || t.includes('pollo') || t.includes('bistecca') || t.includes('salmone')) return 'Carne / Pesce';
    if (t.includes('acqua') || t.includes('vino') || t.includes('bibita') || t.includes('succo') || t.includes('birra')) return 'Bevande';
    if (t.includes('detersivo') || t.includes('carta igienica') || t.includes('spugna') || t.includes('candeggina') || t.includes('pulizia') || t.includes('lampadin')) return 'Pulizia / Casa';
    if (t.includes('pasta') || t.includes('riso') || t.includes('farina') || t.includes('olio') || t.includes('caffè') || t.includes('biscotti')) return 'Dispensa / Secco';
    return 'Varie / Extra';
}

function aggiungiProdottoExtra() {
    if (!isPremiumActive) {
        alert("🔒 La lavagnetta Spesa Extra è una funzione Premium. Attiva l'abbonamento per aggiungere prodotti extra.");
        return;
    }

    const inputNome = document.getElementById('input-nuovo-extra');
    const nome = inputNome.value.trim();
    
    if (!nome) {
        alert("Inserisci la descrizione del prodotto extra da acquistare.");
        return;
    }

    const repartoAutomatico = determinaRepartoAutomatico(nome);

    const nuovoItem = {
        id: Date.now(),
        nome: nome,
        reparto: repartoAutomatico,
        preso: false,
        isExtra: true
    };

    db.spesa_extra.push(nuovoItem);
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));

    inputNome.value = '';
    renderizzaListeExtra();
}

function renderizzaListeExtra() {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioSpesaExtra[lang] || dizionarioSpesaExtra['it'];

    let htmlDaPrendere = '';
    let htmlGiaPresi = '';

    if (!isPremiumActive) {
        document.getElementById('lista-extra-da-prendere').innerHTML = `
            <div style="padding: 20px; text-align: center; color: var(--text-muted); background: rgba(239, 68, 68, 0.05); border: 1px dashed var(--accent-warning); border-radius: 8px;">
                ${t.premiumBloccato}
            </div>`;
        document.getElementById('lista-extra-gia-presi').innerHTML = '';
        return;
    }

    (db.spesa_extra || []).forEach(item => {
        if (!item.preso) {
            htmlDaPrendere += `
                <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); background-color: rgba(168, 85, 247, 0.08); border-left: 4px solid var(--accent-purple); margin-bottom: 8px; border-radius: 4px;">
                    <input type="checkbox" style="transform: scale(1.3); cursor: pointer;" onchange="spuntatoExtra(${item.id})">
                    <div class="item-info" style="flex-grow: 1; margin-left: 12px;">
                        <div class="item-title" style="font-weight: bold; color: var(--text-main);">${item.nome}</div>
                        <div class="item-details" style="font-size: 0.8rem; color: var(--text-muted);">${t.repartoAuto}: ${item.reparto || 'Varie'}</div>
                    </div>
                </div>`;
        } else {
            htmlDaPrendere += `
                <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); background-color: #21262d; margin-bottom: 8px; border-radius: 4px;">
                    <input type="checkbox" checked disabled style="transform: scale(1.3);">
                    <div class="item-info" style="flex-grow: 1; margin-left: 12px; color: var(--text-muted);">
                        <div class="item-title" style="text-decoration: line-through;">${item.nome}</div>
                        <div class="item-details" style="font-size: 0.8rem;">${t.repartoAuto}: ${item.reparto || 'Varie'}</div>
                    </div>
                </div>`;

            htmlGiaPresi += `
                <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); margin-bottom: 8px; background: #21262d; border-radius: 4px;">
                    <div class="item-info" style="flex-grow: 1;">
                        <div class="item-title" style="color: var(--accent-green); font-weight: bold;">&#10004; ${item.nome}</div>
                        <div class="item-details" style="font-size: 0.8rem; color: var(--text-muted);">${t.repartoAuto}: ${item.reparto || 'Varie'} (Extra)</div>
                    </div>
                </div>`;
        }
    });

    document.getElementById('lista-extra-da-prendere').innerHTML = htmlDaPrendere || `<p style="padding:10px; color:var(--text-muted); font-style: italic;">${t.vuotoExtra}</p>`;
    document.getElementById('lista-extra-gia-presi').innerHTML = htmlGiaPresi || `<p style="padding:10px; color:var(--text-muted); font-style: italic;">${t.vuotoCarrelloExtra}</p>`;
}

function spuntatoExtra(id) {
    let item = db.spesa_extra.find(i => i.id === id);
    if (item) {
        item.preso = true;
        localStorage.setItem('eat_me_first_db', JSON.stringify(db));
        renderizzaListeExtra();
    }
}

function pulisciExtraPresi() {
    let acquistatiCount = db.spesa_extra.filter(i => i.preso).length;
    if (acquistatiCount === 0) {
        alert("Non ci sono prodotti extra spuntati come 'presi' da pulire.");
        return;
    }
    if (confirm("Vuoi rimuovere definitivamente i prodotti extra acquistati?")) {
        db.spesa_extra = db.spesa_extra.filter(item => !item.preso);
        localStorage.setItem('eat_me_first_db', JSON.stringify(db));
        renderizzaListeExtra();
        cambiaVistaSpesa('prendere');
    }
}