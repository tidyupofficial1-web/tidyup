document.addEventListener('DOMContentLoaded', () => {
    const containerLang = document.getElementById('header-lang');
    if (containerLang && typeof creaSelettoreLinguaHTML === 'function') {
        containerLang.innerHTML = creaSelettoreLinguaHTML();
    }
    
    applicaTraduzioniSpesa();
    renderizzaListaApprovvigionamento();
});

let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa_extra: [] };

if (!db.spesa_extra) {
    db.spesa_extra = [];
}

const dizionarioSpesa = {
    it: {
        spesa_titolo: "Lista Approvvigionamento & Magazzino",
        btnGuidaTesto: "ℹ️ Guida",
        sec_approvvigionamento: "Controllo Riordino e Fornitori (Cash & Carry)",
        desc_approvvigionamento: "I prodotti in esaurimento o terminati dalla dispensa appaiono qui con la giacenza attuale. Valuta se acquistarli in base al trend o a eventuali periodi di chiusura/ferie. Aggiungi eventuali voci extra.",
        titolo_aggiungi_extra: "Aggiungi Voce al Carico / Extra",
        placeholder_extra: "Es. Detersivo lavastoviglie, Stuzzicadenti...",
        btnAggiungi: "Aggiungi",
        tabPrendere: "Da Acquistare / Ordinare",
        tabPresi: "Già Presi (Registro Arrivi)",
        btnPulisciExtra: "Conferma arrivi e pulisci spuntati",
        navBack: "← Torna al Menu Principale",
        footer: "ChefStock • Gestione Professionale Magazzino Cucina",
        guidaSpesaTitolo: "💡 Come funziona il Riordino",
        guidaSpesaTesto1: "L'elenco mostra i prodotti esauriti o in esaurimento con la relativa giacenza attuale.",
        guidaSpesaTesto2: "Spunta i prodotti mentre sei al magazzino. Al ritorno, potrai confermare l'acquisto o lasciare indietro ciò che non hai preso.",
        guidaChiudi: "Ho capito, procedi",
        vuotoLista: "Nessun articolo da riordinare al momento.",
        vuotoArrivi: "Nessun articolo registrato negli arrivi recenti.",
        giacenzaAttuale: "Giacenza attuale in magazzino:",
        origineDispensa: "Da Inventario",
        origineExtra: "Extra / Fuori inventario"
    },
    en: {
        spesa_titolo: "Procurement & Warehouse List",
        btnGuidaTesto: "ℹ️ Guide",
        sec_approvvigionamento: "Restock & Supplier Control (Cash & Carry)",
        desc_approvvigionamento: "Low or depleted inventory items appear here with current stock. Decide whether to buy based on your schedule. Add extra items as needed.",
        titolo_aggiungi_extra: "Add Item / Extra",
        placeholder_extra: "E.g., Dishwasher detergent, Toothpicks...",
        btnAggiungi: "Add",
        tabPrendere: "To Buy / Order",
        tabPresi: "Already Taken (Arrivals)",
        btnPulisciExtra: "Confirm arrivals & clear checked",
        navBack: "← Back to Main Menu",
        footer: "ChefStock • Professional Kitchen Management",
        guidaSpesaTitolo: "💡 How Restocking Works",
        guidaSpesaTesto1: "The list shows depleted or low stock items with their current quantity.",
        guidaSpesaTesto2: "Check items while at the warehouse. Upon return, confirm purchases or keep unbought items for later.",
        guidaChiudi: "Got it, let's go",
        vuotoLista: "No items to reorder at the moment.",
        vuotoArrivi: "No items recorded in recent arrivals.",
        giacenzaAttuale: "Current stock in warehouse:",
        origineDispensa: "From Inventory",
        origineExtra: "Extra / Non-inventory"
    },
    es: {
        spesa_titolo: "Lista de Aprovisionamiento", btnGuidaTesto: "ℹ️ Guía", sec_approvvigionamento: "Control de Reposición",
        desc_approvvigionamento: "Artículos bajos o agotados con stock actual.", titolo_aggiungi_extra: "Añadir Artículo",
        placeholder_extra: "Ej. Detergente, Palillos...", btnAggiungi: "Añadir", tabPrendere: "A Comprar",
        tabPresi: "Llegadas", btnPulisciExtra: "Confirmar y limpiar", navBack: "← Volver al Menú",
        footer: "ChefStock • Gestión Profesional", guidaSpesaTitolo: "💡 Ayuda",
        guidaSpesaTesto1: "Muestra artículos con stock actual.", guidaSpesaTesto2: "Gestiona llegadas y pendientes.",
        guidaChiudi: "Entendido", vuotoLista: "Ningún artículo que reordenar.", vuotoArrivi: "Sin llegadas registradas.",
        giacenzaAttuale: "Stock actual en almacén:", origineDispensa: "De Inventario", origineExtra: "Extra"
    },
    fr: {
        spesa_titolo: "Liste d'Approvisionnement", btnGuidaTesto: "ℹ Guide", sec_approvvigionamento: "Contrôle Réapprovisionnement",
        desc_approvvigionamento: "Articles bas ou épuisés avec stock actuel.", titolo_aggiungi_extra: "Ajouter Élément",
        placeholder_extra: "Ex. Détergent, Cure-dents...", btnAggiungi: "Ajouter", tabPrendere: "À Acheter",
        tabPresi: "Arrivages", btnPulisciExtra: "Confirmer et effacer", navBack: "← Retour au Menu",
        footer: "ChefStock • Gestion Professionnelle", guidaSpesaTitolo: "💡 Aide",
        guidaSpesaTesto1: "Affiche les articles avec stock actuel.", guidaSpesaTesto2: "Gérez les arrivages.",
        guidaChiudi: "Compris", vuotoLista: "Aucun article à commander.", vuotoArrivi: "Aucun arrivage récent.",
        giacenzaAttuale: "Stock actuel en entrepôt:", origineDispensa: "Du stock", origineExtra: "Extra"
    },
    de: {
        spesa_titolo: "Beschaffungsliste", btnGuidaTesto: "ℹ️ Hilfe", sec_approvvigionamento: "Nachbestellung & Großmarkt",
        desc_approvvigionamento: "Geringer oder leerer Bestand mit aktuellem Lagerbestand.", titolo_aggiungi_extra: "Artikel hinzufügen",
        placeholder_extra: "Z.B. Spülmittel, Zahnstocher...", btnAggiungi: "Hinzufügen", tabPrendere: "Zu bestellen",
        tabPresi: "Eingetroffen", btnPulisciExtra: "Bestätigen & leeren", navBack: "← Zum Menü",
        footer: "ChefStock • Professionelles Küchenmanagement", guidaSpesaTitolo: "💡 Beschaffung",
        guidaSpesaTesto1: "Zeigt Artikel mit aktuellem Bestand.", guidaSpesaTesto2: "Ankünfte verwalten.",
        guidaChiudi: "Verstanden", vuotoLista: "Keine Artikel zu bestellen.", vuotoArrivi: "Keine Ankunft verzeichnet.",
        giacenzaAttuale: "Aktueller Bestand im Lager:", origineDispensa: "Aus Bestand", origineExtra: "Extra"
    }
};

function applicaTraduzioniSpesa() {
    const lang = localStorage.getItem('eat_lang') || 'it';
    const t = dizionarioSpesa[lang] || dizionarioSpesa['it'];

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) el.innerHTML = t[chiave];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const chiave = el.getAttribute('data-i18n-placeholder');
        if (t[chiave]) el.placeholder = t[chiave];
    });
}

function cambiaLingua(lang) {
    localStorage.setItem('eat_lang', lang);
    applicaTraduzioniSpesa();
    renderizzaListaApprovvigionamento();
}

function apriGuidaSpesa() {
    document.getElementById('modal-guida-spesa').style.display = 'flex';
}

function chiudiGuidaSpesa() {
    document.getElementById('modal-guida-spesa').style.display = 'none';
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

function determinaRepartoAutomatico(testo) {
    let t = testo.toLowerCase();
    if (t.includes('frutta') || t.includes('verdura') || t.includes('mela') || t.includes('insalata')) return 'Ortofrutta';
    if (t.includes('latte') || t.includes('formaggio') || t.includes('yogurt') || t.includes('burro')) return 'Frigo / Latticini';
    if (t.includes('carne') || t.includes('pesce') || t.includes('pollo') || t.includes('bistecca')) return 'Carne / Pesce';
    if (t.includes('acqua') || t.includes('vino') || t.includes('bibita')) return 'Bevande';
    if (t.includes('detersivo') || t.includes('carta') || t.includes('spugna') || t.includes('stuzzicadenti') || t.includes('tovaglioli')) return 'Pulizia / Materiale Consumo';
    if (t.includes('pasta') || t.includes('riso') || t.includes('farina') || t.includes('olio') || t.includes('zucchero')) return 'Dispensa / Secco';
    return 'Varie / Altro';
}

function aggiungiProdottoExtra() {
    const inputNome = document.getElementById('input-nuovo-extra');
    const nome = inputNome.value.trim();
    if (!nome) return;

    const reparto = determinaRepartoAutomatico(nome);
    const nuovoItem = {
        id: 'extra_' + Date.now(),
        nome: nome,
        reparto: reparto,
        preso: false,
        isExtra: true
    };

    db.spesa_extra.push(nuovoItem);
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));

    inputNome.value = '';
    renderizzaListaApprovvigionamento();
}

function raccogliTuttiGliArticoli() {
    let listaUnificata = [];

    // 1. Prodotti dall'inventario (sia alimentari che non) sotto soglia o esauriti
    if (db.dispensa && Array.isArray(db.dispensa)) {
        db.dispensa.forEach(item => {
            let quantitaAttuale = item.quantita !== undefined ? item.quantita : 0;
            let sogliaCritica = item.soglia_minima !== undefined ? item.soglia_minima : 2;

            if (quantitaAttuale <= sogliaCritica || item.stato === 'esaurito') {
                // Distinguiamo se è completamente esaurito (0) o se ha ancora qualcosina (residuo)
                let haResiduo = quantitaAttuale > 0;
                
                listaUnificata.push({
                    id: 'inv_' + item.id,
                    nome: item.nome,
                    reparto: item.reparto || 'Dispensa / Secco',
                    quantitaAttuale: `${quantitaAttuale} ${item.unita || 'pz'}`,
                    haResiduo: haResiduo,
                    preso: item.in_arrivo || false,
                    isExtra: false,
                    originalRefId: item.id
                });
            }
        });
    }

    // 2. Voci extra inserite manualmente
    if (db.spesa_extra && Array.isArray(db.spesa_extra)) {
        db.spesa_extra.forEach(item => {
            listaUnificata.push(item);
        });
    }

    return listaUnificata;
}

function renderizzaListaApprovvigionamento() {
    const lang = localStorage.getItem('eat_lang') || 'it';
    const t = dizionarioSpesa[lang] || dizionarioSpesa['it'];

    const tuttiGliArticoli = raccogliTuttiGliArticoli();
    const daPrendereContainer = document.getElementById('contenitore-categorie-da-prendere');
    const presiContainer = document.getElementById('lista-extra-gia-presi');

    let categorieMap = {};
    let htmlPresi = '';
    let countPrendere = 0;

    tuttiGliArticoli.forEach(item => {
        if (!item.preso) {
            countPrendere++;
            let cat = item.reparto || 'Varie / Altro';
            if (!categorieMap[cat]) categorieMap[cat] = [];
            categorieMap[cat].push(item);
        } else {
            htmlPresi += `
                <div class="item-row-pro" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06);">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <input type="checkbox" checked onchange="deselezionaPreso('${item.id}', ${item.isExtra})" style="transform: scale(1.2); cursor: pointer;">
                        <span style="color: var(--accent-green); font-weight: bold; text-decoration: line-through;">✔ ${item.nome}</span>
                    </div>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">${item.reparto} &bull; ${item.isExtra ? t.origineExtra : t.origineDispensa}</span>
                </div>`;
        }
    });

    let htmlCategorie = '';
    if (countPrendere === 0) {
        htmlCategorie = `<div class="menu-section-card" style="text-align: center; color: var(--text-muted); font-style: italic; padding: 25px;">${t.vuotoLista}</div>`;
    } else {
        for (let cat in categorieMap) {
            htmlCategorie += `
                <div class="categoria-section">
                    <div class="categoria-header">
                        <span>📁 ${cat}</span>
                        <span style="font-size: 0.8rem; background: var(--bg-color); padding: 2px 8px; border-radius: 12px; border: 1px solid var(--border-color);">${categorieMap[cat].length}</span>
                    </div>
                    <div class="categoria-body">`;
            
            categorieMap[cat].forEach(item => {
                let stileSfondo = '';
                let dettagliInfo = '';

                if (!item.isExtra) {
                    if (item.haResiduo) {
                        // Sfondo evidenziato per prodotti che hanno ancora una scorta residua ma stanno per finire
                        stileSfondo = 'background: rgba(234, 179, 8, 0.08); border-left: 3px solid #eab308; padding-left: 8px; border-radius: 4px;';
                        dettagliInfo = `<div style="font-size: 0.75rem; color: #eab308; margin-top: 2px; font-weight: 500;">⚠️ ${t.giacenzaAttuale} <strong>${item.quantitaAttuale}</strong></div>`;
                    } else {
                        stileSfondo = 'background: rgba(239, 68, 68, 0.06); border-left: 3px solid #ef4444; padding-left: 8px; border-radius: 4px;';
                        dettagliInfo = `<div style="font-size: 0.75rem; color: #ef4444; margin-top: 2px; font-weight: 500;">❌ ${t.giacenzaAttuale} <strong>${item.quantitaAttuale} (Esaurito)</strong></div>`;
                    }
                }

                htmlCategorie += `
                    <div class="item-row-pro" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 4px; border-bottom: 1px solid rgba(255,255,255,0.05); ${stileSfondo}">
                        <div style="display: flex; align-items: flex-start; gap: 12px; flex-grow: 1;">
                            <input type="checkbox" style="transform: scale(1.2); cursor: pointer; margin-top: 3px;" onchange="segnaComePreso('${item.id}', ${item.isExtra})">
                            <div style="flex-grow: 1;">
                                <div style="font-weight: 600; color: var(--text-main);">${item.nome}</div>
                                ${dettagliInfo}
                            </div>
                        </div>
                        <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 10px;">${item.isExtra ? t.origineExtra : t.origineDispensa}</span>
                    </div>`;
            });

            htmlCategorie += `</div></div>`;
        }
    }

    daPrendereContainer.innerHTML = htmlCategorie;
    presiContainer.innerHTML = htmlPresi || `<p style="color: var(--text-muted); font-style: italic; text-align: center; margin: 0;">${t.vuotoArrivi}</p>`;
}

function segnaComePreso(id, isExtra) {
    if (isExtra) {
        let item = db.spesa_extra.find(i => i.id === id);
        if (item) {
            item.preso = true;
            localStorage.setItem('eat_me_first_db', JSON.stringify(db));
        }
    } else {
        let realId = id.replace('inv_', '');
        let itemInv = db.dispensa.find(i => i.id == realId);
        if (itemInv) {
            itemInv.in_arrivo = true;
        }
        // Lo tracciamo negli extra come spuntato per portarlo nel registro arrivi
        db.spesa_extra.push({
            id: 'arrivo_' + Date.now(),
            nome: itemInv ? itemInv.nome : id,
            reparto: itemInv ? itemInv.reparto : 'Varie',
            preso: true,
            isExtra: true,
            sourceInvId: realId
        });
        localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    }
    renderizzaListaApprovvigionamento();
}

function deselezionaPreso(id, isExtra) {
    if (isExtra && id.startsWith('arrivo_')) {
        db.spesa_extra = db.spesa_extra.filter(i => i.id !== id);
        localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    } else if (isExtra) {
        let item = db.spesa_extra.find(i => i.id === id);
        if (item) {
            item.preso = false;
            localStorage.setItem('eat_me_first_db', JSON.stringify(db));
        }
    }
    renderizzaListaApprovvigionamento();
}

function pulisciExtraPresi() {
    if (confirm("Vuoi confermare gli arrivi? I prodotti spuntati verranno rimossi dalla lista di acquisto. (Ricordati poi di procedere al carico in dispensa).")) {
        // Rimuoviamo gli extra spuntati
        db.spesa_extra = db.spesa_extra.filter(item => !item.preso);
        
        // Sblocchiamo anche i flag in_arrivo sugli inventari se necessario
        if (db.dispensa) {
            db.dispensa.forEach(item => {
                item.in_arrivo = false;
            });
        }

        localStorage.setItem('eat_me_first_db', JSON.stringify(db));
        renderizzaListaApprovvigionamento();
        cambiaVistaSpesa('prendere');
    }
}