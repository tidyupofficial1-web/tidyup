document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('eat_me_first_lang') || 'it';
    const langSelect = document.getElementById('lingua-select');
    if (langSelect) langSelect.value = savedLang;
    
    applicaTraduzioniDispensa(savedLang);
    caricaDatiDispensa();
});

function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    applicaTraduzioniDispensa(lang);
    organizzatoreLuoghi(); // Ridisegna la lista applicando i nuovi termini localizzati
}

let prodottiDispensa = [];

// Dizionario integrato per la gestione nativa delle stringhe dinamiche della dispensa
const dizionarioDispensa = {
    it: { 
        dispensa_title: "La Mia Dispensa", 
        btn_scadenze: "⚠️ Scadenze", 
        btn_carica: "➕ Carica", 
        btn_svuota: "🗑️ Svuota e Azzera", 
        dispensa_empty: "Nessun prodotto presente nella dispensa. Inizia a caricarne qualcuno!", 
        footer_text: "EatMeFirst • Dati locali su dispositivo", 
        altLuogo: "Altro / Non specificato", 
        articoli: "articoli",
        modal_scadenze_title: "⚠️ Attenzione: Scadenze Imminenti",
        modal_scadenze_sub: "I seguenti prodotti richiedono la tua attenzione:",
        btn_ho_capito: "Ho capito",
        badge_dettaglio: "🌟 Dettaglio Prodotto"
    },
    en: { 
        dispensa_title: "My Pantry", 
        btn_scadenze: "⚠️ Expirations", 
        btn_carica: "➕ Add", 
        btn_svuota: "🗑️ Clear All", 
        dispensa_empty: "No products in the pantry. Start adding some!", 
        footer_text: "EatMeFirst • Local device data", 
        altLuogo: "Other / Unspecified", 
        articoli: "items",
        modal_scadenze_title: "⚠️ Warning: Upcoming Expirations",
        modal_scadenze_sub: "The following products require your attention:",
        btn_ho_capito: "Got it",
        badge_dettaglio: "🌟 Product Details"
    },
    fr: { 
        dispensa_title: "Mon Garde-manger", 
        btn_scadenze: "⚠️ Péremptions", 
        btn_carica: "➕ Ajouter", 
        btn_svuota: "🗑️ Tout effacer", 
        dispensa_empty: "Aucun produit dans le garde-manger.", 
        footer_text: "EatMeFirst • Données locales", 
        altLuogo: "Autre / Non spécifié", 
        articoli: "articles",
        modal_scadenze_title: "⚠️ Attention : Péremptions imminentes",
        modal_scadenze_sub: "Les produits suivants requièrent votre attention :",
        btn_ho_capito: "Compris",
        badge_dettaglio: "🌟 Détail du produit"
    },
    es: { 
        dispensa_title: "Mi Despensa", 
        btn_scadenze: "⚠️ Caducidades", 
        btn_carica: "➕ Cargar", 
        btn_svuota: "🗑️ Vaciar todo", 
        dispensa_empty: "No hay productos en la despensa.", 
        footer_text: "EatMeFirst • Datos locales", 
        altLuogo: "Otro / No especificado", 
        articoli: "artículos",
        modal_scadenze_title: "⚠️ Atención: Caducidades Próximas",
        modal_scadenze_sub: "Los siguientes productos requieren tu atención:",
        btn_ho_capito: "Entendido",
        badge_dettaglio: "🌟 Detalle del Producto"
    },
    de: { 
        dispensa_title: "Meine Speisekammer", 
        btn_scadenze: "⚠️ Verfallsdaten", 
        btn_carica: "➕ Hinzufügen", 
        btn_svuota: "🗑️ Alles leeren", 
        dispensa_empty: "Keine Produkte in der Speisekammer.", 
        footer_text: "EatMeFirst • Lokale Daten", 
        altLuogo: "Andere / Nicht angegeben", 
        articoli: "Artikel",
        modal_scadenze_title: "⚠️ Achtung: Baldige Verfallsdaten",
        modal_scadenze_sub: "Die folgenden Produkte erfordern Ihre Aufmerksamkeit:",
        btn_ho_capito: "Verstanden",
        badge_dettaglio: "🌟 Produktdetails"
    }
};

function caricaDatiDispensa() {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [] };
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];
    
    prodottiDispensa = (db.dispensa || []).filter(p => !p.preso && !p.lowStock).map(p => ({
        ...p,
        posizione: p.ubicazione || p.posizione || t.altLuogo,
        barcode: p.codiceBarre || p.barcode
    }));
    
    organizzatoreLuoghi();
    verificaPopupGiornaliero();
}

function organizzatoreLuoghi() {
    const contenitore = document.getElementById('contenitore-luoghi');
    if (!contenitore) return;
    contenitore.innerHTML = '';

    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];

    if (prodottiDispensa.length === 0) {
        contenitore.innerHTML = `<div class="empty-msg">${t.dispensa_empty}</div>`;
        return;
    }

    let luoghiMap = {};
    prodottiDispensa.forEach(p => {
        let luogo = p.posizione || t.altLuogo;
        if (!luoghiMap[luogo]) luoghiMap[luogo] = [];
        luoghiMap[luogo].push(p);
    });

    Object.keys(luoghiMap).sort().forEach(luogo => {
        let lista = luoghiMap[luogo];
        lista.sort((a, b) => a.nome.localeCompare(b.nome));

        let section = document.createElement('div');
        section.className = 'luogo-section';

        let header = document.createElement('div');
        header.className = 'luogo-header';
        header.innerHTML = `<span>📍 ${luogo} (${lista.length} ${t.articoli})</span> <span>▼</span>`;
        
        let ul = document.createElement('ul');
        ul.className = 'prodotti-list';
        
        header.onclick = () => {
            ul.style.display = ul.style.display === 'none' ? 'block' : 'none';
        };

        lista.forEach(prod => {
            let li = document.createElement('li');
            li.className = 'prodotto-item';
            li.onclick = () => apriSchedaPremium(prod);

            let img = prod.immagine ? `<img src="${prod.immagine}" class="prodotto-img">` : '<div class="prodotto-img" style="display:flex;align-items:center;justify-content:center;">📦</div>';
            let urgenteClass = isScadenzaUrgente(prod.scadenza) ? ' urgente' : '';

            li.innerHTML = `
                ${img}
                <div class="prodotto-info">
                    <div class="prodotto-nome">${prod.nome}</div>
                    <div class="prodotto-dettagli">Qt: ${prod.quantita} | Barcode: ${prod.barcode || 'N/D'}</div>
                </div>
                <div class="prodotto-scadenza${urgenteClass}">Scad: ${prod.scadenza || 'N/D'}</div>
            `;
            ul.appendChild(li);
        });

        section.appendChild(header);
        section.appendChild(ul);
        contenitore.appendChild(section);
    });
}

function azzeraTuttoDatabase() {
    if (confirm("⚠️ Sei sicuro di voler azzerare TUTTI gli archivi, la dispensa e le liste della spesa?")) {
        localStorage.removeItem('eat_me_first_db');
        localStorage.removeItem('eatMeFirst_dispensa');
        localStorage.removeItem('eatme_prodotti');
        localStorage.removeItem('eatme_ultimo_popup_scadenze');
        
        alert("Tutti gli archivi sono stati azzerati con successo.");
        location.reload();
    }
}

function verificaPopupGiornaliero() {
    const oggiStr = new Date().toISOString().slice(0, 10);
    const ultimoVisto = localStorage.getItem('eatme_ultimo_popup_scadenze');
    let scadenzeUrgenti = prodottiDispensa.filter(p => isScadenzaUrgente(p.scadenza));

    if (scadenzeUrgenti.length > 0 && ultimoVisto !== oggiStr) {
        mostraPopupScadenze(scadenzeUrgenti);
    }
}

function mostraPopupScadenze(listaUrgenti) {
    const divLista = document.getElementById('lista-scadenze-urgenti');
    if (!divLista) return;
    divLista.innerHTML = '';

    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];

    listaUrgenti.forEach(p => {
        let row = document.createElement('div');
        row.className = 'lampeggiante';
        row.style.cssText = 'padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: bold; background: rgba(239,68,68,0.2); border: 1px solid var(--accent-danger);';
        row.innerHTML = `<span>🔴 ${p.nome} (${p.posizione || t.altLuogo})</span> <span>Scad: ${p.scadenza}</span>`;
        divLista.appendChild(row);
    });

    document.getElementById('popupScadenze').style.display = 'flex';
    localStorage.setItem('eatme_ultimo_popup_scadenze', new Date().toISOString().slice(0, 10));
}

function mostraPopupScadenzeManualita() {
    let scadenzeUrgenti = prodottiDispensa.filter(p => isScadenzaUrgente(p.scadenza));
    if (scadenzeUrgenti.length === 0) {
        alert("Nessun prodotto con scadenza imminente in dispensa.");
        return;
    }
    mostraPopupScadenze(scadenzeUrgenti);
}

function chiudiPopupScadenze() {
    document.getElementById('popupScadenze').style.display = 'none';
}

function isScadenzaUrgente(dataStr) {
    if (!dataStr) return false;
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const scadenza = new Date(dataStr);
    if (isNaN(scadenza)) return false;
    
    const diffTime = scadenza - oggi;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
}

function apriSchedaPremium(prod) {
    const contenuto = document.getElementById('dettaglio-prodotto-contenuto');
    if (!contenuto) return;
    
    let img = prod.immagine ? `<img src="${prod.immagine}" style="max-width:120px; max-height:120px; object-fit:contain; margin-bottom:10px; border-radius:6px;">` : '📦';
    
    contenuto.innerHTML = `
        ${img}
        <h3 style="margin: 5px 0; color:var(--text-main);">${prod.nome}</h3>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:15px;">Codice a barre: ${prod.barcode || 'N/D'}</p>
        <div style="text-align: left; background: #21262d; border: 1px solid var(--border-color); padding: 12px; border-radius: 8px; font-size: 13px; line-height: 1.5; color: var(--text-main);">
            📍 <strong>Ubicazione:</strong> ${prod.posizione || 'Non specificata'}<br>
            📅 <strong>Scadenza:</strong> ${prod.scadenza || 'N/D'}<br>
            🔢 <strong>Quantità:</strong> ${prod.quantita}<br>
            📝 <strong>Note:</strong> ${prod.note || 'Nessuna nota aggiuntiva'}
        </div>
    `;
    document.getElementById('modalPremium').style.display = 'flex';
}

function chiudiSchedaProdotto() {
    document.getElementById('modalPremium').style.display = 'none';
}

function applicaTraduzioniDispensa(lang) {
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];
    
    // Aggiorna elementi statici tramite attributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'TITLE') {
                document.title = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });
}