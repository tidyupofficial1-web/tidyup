document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('eat_me_first_lang') || 'it';
    const langSelect = document.getElementById('lingua-select');
    if (langSelect) langSelect.value = savedLang;
    
    applicaTraduzioniDispensa(savedLang);
    caricaDatiDispensa();
    mostraPopupBenvenutoPremiumUnaTantum();
});

function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    applicaTraduzioniDispensa(lang);
    popolaFiltriDinamici();
    organizzatoreLuoghi();
}

let prodottiDispensa = [];

const dizionarioDispensa = {
    it: { 
        dispensa_title: "La Mia Dispensa", 
        btn_scadenze: "⚠️ Scadenze", 
        btn_carica: "➕ Carica", 
        btn_svuota: "🗑️ Svuota e Azzera", 
        dispensa_empty: "Nessun prodotto presente nella dispensa. Inizia a caricarne qualcuno!", 
        footer_text: "EatMeFirst • Dati locali su dispositivo", 
        altLuogo: "Altro / Non specificato", 
        altCategoria: "Altra / Non specificata",
        articoli: "articoli",
        modal_scadenze_title: "⚠️ Attenzione: Scadenze Imminenti",
        modal_scadenze_sub: "I seguenti prodotti richiedono la tua attenzione (esclusi i prodotti senza scadenza):",
        btn_ho_capito: "Ho capito",
        btn_inizia: "Inizia subito",
        badge_dettaglio: "🌟 Dettaglio Prodotto",
        scadenzaLabel: "Scad",
        tutte_categorie: "📂 Tutte le Categorie",
        tutte_ubicazioni: "📍 Tutte le Ubicazioni",
        premium_popup_desc: "La versione Premium è offerta subito in uso gratuito per testare tutte le funzioni avanzate. Goditi tutte le funzionalità senza pensieri!"
    },
    en: { 
        dispensa_title: "My Pantry", 
        btn_scadenze: "⚠️ Expirations", 
        btn_carica: "➕ Add", 
        btn_svuota: "🗑️ Clear All", 
        dispensa_empty: "No products in the pantry. Start adding some!", 
        footer_text: "EatMeFirst • Local device data", 
        altLuogo: "Other / Unspecified", 
        altCategoria: "Other / Unspecified",
        articoli: "items",
        modal_scadenze_title: "⚠️ Warning: Upcoming Expirations",
        modal_scadenze_sub: "The following products require your attention:",
        btn_ho_capito: "Got it",
        btn_inizia: "Get Started",
        badge_dettaglio: "🌟 Product Details",
        scadenzaLabel: "Exp",
        tutte_categorie: "📂 All Categories",
        tutte_ubicazioni: "📍 All Locations",
        premium_popup_desc: "The Premium version is offered right away for free trial to test advanced features. Enjoy all functionalities!"
    },
    fr: { 
        dispensa_title: "Mon Garde-manger", 
        btn_scadenze: "⚠️️ Péremptions", 
        btn_carica: "➕ Ajouter", 
        btn_svuota: "🗑️ Tout effacer", 
        dispensa_empty: "Aucun produit dans le garde-manger.", 
        footer_text: "EatMeFirst • Données locales", 
        altLuogo: "Autre / Non spécifié", 
        altCategoria: "Autre / Non spécifiée",
        articoli: "articles",
        modal_scadenze_title: "⚠️ Attention : Péremptions imminentes",
        modal_scadenze_sub: "Les produits suivants requièrent votre attention :",
        btn_ho_capito: "Compris",
        btn_inizia: "Commencer",
        badge_dettaglio: "🌟 Détail du produit",
        scadenzaLabel: "Exp",
        tutte_categorie: "📂 Toutes les catégories",
        tutte_ubicazioni: "📍 Tous les emplacements",
        premium_popup_desc: "La version Premium est offerte immédiatement pour tester les fonctions avancées."
    },
    es: { 
        dispensa_title: "Mi Despensa", 
        btn_scadenze: "⚠️ Caducidades", 
        btn_carica: "➕ Cargar", 
        btn_svuota: "🗑️ Vaciar todo", 
        dispensa_empty: "No hay productos en la despensa.", 
        footer_text: "EatMeFirst • Datos locales", 
        altLuogo: "Otro / No especificado", 
        altCategoria: "Otra / No especificada",
        articoli: "artículos",
        modal_scadenze_title: "⚠️ Atención: Caducidades Próximas",
        modal_scadenze_sub: "Los siguientes productos requieren tu atención:",
        btn_ho_capito: "Entendido",
        btn_inizia: "Empezar",
        badge_dettaglio: "🌟 Detalle del Producto",
        scadenzaLabel: "Cad",
        tutte_categorie: "📂 Todas las categorías",
        tutte_ubicazioni: "📍 Todas las ubicaciones",
        premium_popup_desc: "La versión Premium se ofrece de inmediato de forma gratuita para probar funciones avanzadas."
    },
    de: { 
        dispensa_title: "Meine Speisekammer", 
        btn_scadenze: "⚠️ Verfallsdaten", 
        btn_carica: "➕ Hinzufügen", 
        btn_svuota: "🗑️️ Alles leeren", 
        dispensa_empty: "Keine Produkte in der Speisekammer.", 
        footer_text: "EatMeFirst • Lokale Daten", 
        altLuogo: "Andere / Nicht angegeben", 
        altCategoria: "Andere / Nicht angegeben",
        articoli: "Artikel",
        modal_scadenze_title: "⚠️ Achtung: Baldige Verfallsdaten",
        modal_scadenze_sub: "Die folgenden Produkte erfordern Ihre Aufmerksamkeit:",
        btn_ho_capito: "Verstanden",
        btn_inizia: "Loslegen",
        badge_dettaglio: "🌟 Produktdetails",
        scadenzaLabel: "Verf",
        tutte_categorie: "📂 Alle Kategorien",
        tutte_ubicazioni: "📍 Alle Standorte",
        premium_popup_desc: "Die Premium-Version wird sofort zur kostenlosen Testversion angeboten."
    }
};

function formattaDataItaliana(dataStr) {
    if (!dataStr) return '';
    let parti = dataStr.split('-');
    if (parti.length === 3) {
        let anno2CIFRE = parti[0].slice(-2);
        return `${parti[2]}/${parti[1]}/${anno2CIFRE}`;
    }
    return dataStr;
}

function caricaDatiDispensa() {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [] };
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];
    
    prodottiDispensa = (db.dispensa || []).filter(p => !p.preso && !p.lowStock).map(p => ({
        ...p,
        posizione: p.ubicazione || p.posizione || t.altLuogo,
        categoria: p.categoria || t.altCategoria,
        barcode: p.codiceBarre || p.barcode
    }));
    
    popolaFiltriDinamici();
    organizzatoreLuoghi();
    verificaPopupGiornaliero();
}

// Popola i menu a tendina dei filtri prendendo ESATTAMENTE i dati inseriti dal tizio
function popolaFiltriDinamici() {
    const selCat = document.getElementById('filtro-categoria');
    const selUbi = document.getElementById('filtro-ubicazione');
    if (!selCat || !selUbi) return;

    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];

    const valCatCorrente = selCat.value;
    const valUbiCorrente = selUbi.value;

    let categorieSet = new Set();
    let ubicazioniSet = new Set();

    prodottiDispensa.forEach(p => {
        if (p.categoria) categorieSet.add(p.categoria);
        if (p.posizione) ubicazioniSet.add(p.posizione);
    });

    selCat.innerHTML = `<option value="">${t.tutte_categorie}</option>`;
    Array.from(categorieSet).sort().forEach(cat => {
        let opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        selCat.appendChild(opt);
    });
    selCat.value = valCatCorrente;

    selUbi.innerHTML = `<option value="">${t.tutte_ubicazioni}</option>`;
    Array.from(ubicazioniSet).sort().forEach(ubi => {
        let opt = document.createElement('option');
        opt.value = ubi;
        opt.textContent = ubi;
        selUbi.appendChild(opt);
    });
    selUbi.value = valUbiCorrente;
}

function organizzatoreLuoghi() {
    const contenitore = document.getElementById('contenitore-luoghi');
    if (!contenitore) return;
    contenitore.innerHTML = '';

    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioDispensa[lang] || dizionarioDispensa['it'];

    const catFiltro = document.getElementById('filtro-categoria')?.value || "";
    const ubiFiltro = document.getElementById('filtro-ubicazione')?.value || "";

    // Filtraggio in base ai menu a tendina
    let listaFiltrata = prodottiDispensa.filter(p => {
        let matchCat = !catFiltro || p.categoria === catFiltro;
        let matchUbi = !ubiFiltro || p.posizione === ubiFiltro;
        return matchCat && matchUbi;
    });

    if (listaFiltrata.length === 0) {
        contenitore.innerHTML = `<div class="empty-msg">${t.dispensa_empty}</div>`;
        return;
    }

    let luoghiMap = {};
    listaFiltrata.forEach(p => {
        let luogo = p.posizione || t.altLuogo;
        if (!luoghiMap[luogo]) luoghiMap[luogo] = [];
        luoghiMap[luogo].push(p);
    });

    Object.keys(luoghiMap).sort().forEach(luogo => {
        let lista = luoghiMap[luogo];

        // ORDINAMENTO RICHIESTA: Prima urgenza (rossi, poi gialli, poi scadenze normali), in fondo la palude dei senza scadenza
        lista.sort((a, b) => {
            let urgenzaA = getLivelloUrgenza(a.scadenza); // 1 = rosso, 2 = giallo, 3 = normale, 4 = senza scadenza
            let urgenzaB = getLivelloUrgenza(b.scadenza);
            if (urgenzaA !== urgenzaB) return urgenzaA - urgenzaB;
            return a.nome.localeCompare(b.nome);
        });

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
            
            let badgeScadenzaHtml = '';
            let livelloUrg = getLivelloUrgenza(prod.scadenza);
            let dataFormattata = formattaDataItaliana(prod.scadenza);

            if (livelloUrg === 1) {
                badgeScadenzaHtml = `<div class="prodotto-scadenza rosso">${t.scadenzaLabel}: ${dataFormattata}</div>`;
            } else if (livelloUrg === 2) {
                badgeScadenzaHtml = `<div class="prodotto-scadenza giallo">${t.scadenzaLabel}: ${dataFormattata}</div>`;
            } else if (livelloUrg === 3) {
                badgeScadenzaHtml = `<div class="prodotto-scadenza">${t.scadenzaLabel}: ${dataFormattata}</div>`;
            } else {
                badgeScadenzaHtml = `<div class="prodotto-scadenza senza-scadenza">${t.scadenzaLabel}: N/D</div>`;
            }

            li.innerHTML = `
                ${img}
                <div class="prodotto-info">
                    <div class="prodotto-nome">${prod.nome}</div>
                    <div class="prodotto-dettagli">Qt: ${prod.quantita} | Cat: ${prod.categoria} | Barcode: ${prod.barcode || 'N/D'}</div>
                </div>
                ${badgeScadenzaHtml}
            `;
            ul.appendChild(li);
        });

        section.appendChild(header);
        section.appendChild(ul);
        contenitore.appendChild(section);
    });
}

// Restituisce il livello di urgenza per l'ordinamento e la colorazione
function getLivelloUrgenza(dataStr) {
    if (!dataStr) return 4; // 4 = Senza scadenza (finisce in fondo)
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const scadenza = new Date(dataStr);
    if (isNaN(scadenza)) return 4;
    
    const diffTime = scadenza - oggi;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 1; // Rosso (oggi/domani)
    if (diffDays <= 5) return 2; // Giallo (nei giorni immediatamente successivi)
    return 3; // Normale
}

function azzeraTuttoDatabase() {
    if (confirm("⚠️ Sei sicuro di voler azzerare TUTTI gli archivi, la dispensa e le liste della spesa?")) {
        localStorage.removeItem('eat_me_first_db');
        localStorage.removeItem('eatMeFirst_dispensa');
        localStorage.removeItem('eatme_prodotti');
        localStorage.removeItem('eatme_ultimo_popup_scadenze');
        localStorage.removeItem('eatme_popup_premium_visto');
        
        alert("Tutti gli archivi sono stati azzerati con successo.");
        location.reload();
    }
}

// Popup informativo iniziale sulla natura del Premium provvisorio
function mostraPopupBenvenutoPremiumUnaTantum() {
    const giaVisto = localStorage.getItem('eatme_popup_premium_visto');
    if (!giaVisto) {
        const modal = document.getElementById('popupInfoPremium');
        if (modal) modal.style.display = 'flex';
    }
}

function chiudiPopupInfoPremium() {
    document.getElementById('popupInfoPremium').style.display = 'none';
    localStorage.setItem('eatme_popup_premium_visto', 'true');
}

function verificaPopupGiornaliero() {
    const oggiStr = new Date().toISOString().slice(0, 10);
    const ultimoVisto = localStorage.getItem('eatme_ultimo_popup_scadenze');
    
    // IL PREMIUM CONSIDERA SOLO I PRODOTTI CON SCADENZA (esclude i senza scadenza e filtra solo urgenti)
    let scadenzeUrgenti = prodottiDispensa.filter(p => {
        let livello = getLivelloUrgenza(p.scadenza);
        return livello === 1 || livello === 2; // Solo rossi e gialli imminenti
    });

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
        let livello = getLivelloUrgenza(p.scadenza);
        let coloreIcona = livello === 1 ? '🔴' : '🟡';
        let bgStyle = livello === 1 ? 'background: rgba(239,68,68,0.2); border: 1px solid var(--accent-danger);' : 'background: rgba(245,158,11,0.2); border: 1px solid var(--accent-warning);';

        let row = document.createElement('div');
        row.className = livello === 1 ? 'lampeggiante' : '';
        row.style.cssText = `padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: bold; ${bgStyle}`;
        row.innerHTML = `<span>${coloreIcona} ${p.nome} (${p.posizione || t.altLuogo})</span> <span>${t.scadenzaLabel}: ${formattaDataItaliana(p.scadenza)}</span>`;
        divLista.appendChild(row);
    });

    document.getElementById('popupScadenze').style.display = 'flex';
    localStorage.setItem('eatme_ultimo_popup_scadenze', new Date().toISOString().slice(0, 10));
}

function mostraPopupScadenzeManualita() {
    let scadenzeUrgenti = prodottiDispensa.filter(p => {
        let livello = getLivelloUrgenza(p.scadenza);
        return livello === 1 || livello === 2;
    });
    if (scadenzeUrgenti.length === 0) {
        alert("Nessun prodotto con scadenza imminente in dispensa.");
        return;
    }
    mostraPopupScadenze(scadenzeUrgenti);
}

function chiudiPopupScadenze() {
    document.getElementById('popupScadenze').style.display = 'none';
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
            📂 <strong>Categoria:</strong> ${prod.categoria || 'Non specificata'}<br>
            📅 <strong>Scadenza:</strong> ${formattaDataItaliana(prod.scadenza) || 'N/D'}<br>
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