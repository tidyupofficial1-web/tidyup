document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('eat_lang') || 'it';
    const langSelect = document.getElementById('lingua-select');
    if (langSelect) langSelect.value = savedLang;
    
    applicaTraduzioniInventario(savedLang);
    caricaDatiInventario();
});

function cambiaLingua(lang) {
    localStorage.setItem('eat_lang', lang);
    applicaTraduzioniInventario(lang);
    popolaFiltriDinamici();
    organizzatoreLuoghi();
}

let prodottiInventario = [];

const dizionarioInventario = {
    it: { 
        inventario_title: "Inventario Merci", 
        btn_scadenze: "⚠️ Scadenze Imminenti", 
        btn_carica: "➕ Carica Merci", 
        btn_svuota: "🗑️ Svuota Archivio", 
        inventario_empty: "Nessun prodotto presente nell'inventario. Inizia a caricarne qualcuno!", 
        footer_text: "ChefStock • Gestione Professionale Magazzino Cucina", 
        altLuogo: "Altro / Cucina", 
        altCategoria: "Generale",
        articoli: "articoli",
        modal_scadenze_title: "⚠️ Attenzione: Scadenze Imminenti",
        modal_scadenze_sub: "I seguenti prodotti richiedono un utilizzo immediato:",
        modal_guida_title: "📖 Informazioni e Utilizzo Inventario",
        btn_ho_capito: "Ho capito",
        badge_dettaglio: "🌟 Scheda Articolo ChefStock",
        scadenzaLabel: "Scad",
        tutte_categorie: "📂 Tutte le Categorie",
        tutte_ubicazioni: "📍 Tutte le Ubicazioni",
        help_inventario_desc: "Questo pannello mostra lo stato in tempo reale delle scorte nel tuo magazzino. I prodotti sono suddivisi per ubicazione e ordinati per urgenza scadenza (🔴 rossi oggi/domani, 🟡 gialli nei giorni successivi)."
    },
    en: { 
        inventario_title: "Stock Inventory", 
        btn_scadenze: "⚠️ Upcoming Expirations", 
        btn_carica: "➕ Add Stock", 
        btn_svuota: "🗑️ Clear Archive", 
        inventario_empty: "No products in inventory. Start adding some!", 
        footer_text: "ChefStock • Professional Kitchen Management", 
        altLuogo: "Other / Kitchen", 
        altCategoria: "General",
        articoli: "items",
        modal_scadenze_title: "⚠️ Warning: Upcoming Expirations",
        modal_scadenze_sub: "The following products require immediate attention:",
        modal_guida_title: "📖 Inventory Guide & Info",
        btn_ho_capito: "Got it",
        badge_dettaglio: "🌟 ChefStock Item Details",
        scadenzaLabel: "Exp",
        tutte_categorie: "📂 All Categories",
        tutte_ubicazioni: "📍 All Locations",
        help_inventario_desc: "This panel shows real-time stock status in your kitchen. Products are grouped by location and sorted by expiration urgency."
    },
    fr: { 
        inventario_title: "Inventaire des Stocks", 
        btn_scadenze: "⚠️️ Péremptions Imminentes", 
        btn_carica: "➕ Charger", 
        btn_svuota: "🗑️ Tout effacer", 
        inventario_empty: "Aucun produit dans l'inventaire.", 
        footer_text: "ChefStock • Gestion Professionnelle", 
        altLuogo: "Autre / Cuisine", 
        altCategoria: "Général",
        articoli: "articles",
        modal_scadenze_title: "⚠️ Attention : Péremptions",
        modal_scadenze_sub: "Les produits suivants nécessitent une attention immédiate :",
        modal_guida_title: "📖 Guide de l'Inventaire",
        btn_ho_capito: "Compris",
        badge_dettaglio: "🌟 Détail Article ChefStock",
        scadenzaLabel: "Exp",
        tutte_categorie: "📂 Toutes les catégories",
        tutte_ubicazioni: "📍 Tous les emplacements",
        help_inventario_desc: "Ce panneau affiche l'état des stocks en temps réel. Triés par urgence de péremption."
    },
    es: { 
        inventario_title: "Inventario de Existencias", 
        btn_scadenze: "⚠️ Caducidades Próximas", 
        btn_carica: "➕ Cargar Mercancía", 
        btn_svuota: "🗑️ Vaciar Archivo", 
        inventario_empty: "No hay productos en el inventario.", 
        footer_text: "ChefStock • Gestión Profesional", 
        altLuogo: "Otro / Cocina", 
        altCategoria: "General",
        articoli: "artículos",
        modal_scadenze_title: "⚠️ Atención: Caducidades",
        modal_scadenze_sub: "Los siguientes productos requieren uso inmediato:",
        modal_guida_title: "📖 Guía del Inventario",
        btn_ho_capito: "Entendido",
        badge_dettaglio: "🌟 Detalle de Artículo ChefStock",
        scadenzaLabel: "Cad",
        tutte_categorie: "📂 Todas las categorías",
        tutte_ubicazioni: "📍 Todas las ubicaciones",
        help_inventario_desc: "Este panel muestra el estado del stock en tiempo real ordenado por urgencia de caducidad."
    },
    de: { 
        inventario_title: "Bestandsinventar", 
        btn_scadenze: "⚠️ Baldige Verfallsdaten", 
        btn_carica: "➕ Ware hinzufügen", 
        btn_svuota: "🗑️ Archiv leeren", 
        inventario_empty: "Keine Produkte im Inventar.", 
        footer_text: "ChefStock • Professionelles Küchenmanagement", 
        altLuogo: "Andere / Küche", 
        altCategoria: "Allgemein",
        articoli: "Artikel",
        modal_scadenze_title: "⚠️ Achtung: Verfallsdaten",
        modal_scadenze_sub: "Die folgenden Produkte erfordern sofortige Aufmerksamkeit:",
        modal_guida_title: "📖 Inventar-Leitfaden",
        btn_ho_capito: "Verstanden",
        badge_dettaglio: "🌟 ChefStock Artikeldetails",
        scadenzaLabel: "Verf",
        tutte_categorie: "📂 Alle Kategorien",
        tutte_ubicazioni: "📍 Alle Standorte",
        help_inventario_desc: "Dieses Panel zeigt den Echtzeit-Lagerbestand sortiert nach Verfallsurgenz."
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

function caricaDatiInventario() {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [] };
    const lang = localStorage.getItem('eat_lang') || 'it';
    const t = dizionarioInventario[lang] || dizionarioInventario['it'];
    
    prodottiInventario = (db.dispensa || []).filter(p => !p.preso && !p.lowStock).map(p => ({
        ...p,
        posizione: p.ubicazione || p.posizione || t.altLuogo,
        categoria: p.categoria || t.altCategoria,
        barcode: p.codiceBarre || p.barcode
    }));
    
    popolaFiltriDinamici();
    organizzatoreLuoghi();
}

function popolaFiltriDinamici() {
    const selCat = document.getElementById('filtro-categoria');
    const selUbi = document.getElementById('filtro-ubicazione');
    if (!selCat || !selUbi) return;

    const lang = localStorage.getItem('eat_lang') || 'it';
    const t = dizionarioInventario[lang] || dizionarioInventario['it'];

    const valCatCorrente = selCat.value;
    const valUbiCorrente = selUbi.value;

    let categorieSet = new Set();
    let ubicazioniSet = new Set();

    prodottiInventario.forEach(p => {
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

    const lang = localStorage.getItem('eat_lang') || 'it';
    const t = dizionarioInventario[lang] || dizionarioInventario['it'];

    const catFiltro = document.getElementById('filtro-categoria')?.value || "";
    const ubiFiltro = document.getElementById('filtro-ubicazione')?.value || "";

    let listaFiltrata = prodottiInventario.filter(p => {
        let matchCat = !catFiltro || p.categoria === catFiltro;
        let matchUbi = !ubiFiltro || p.posizione === ubiFiltro;
        return matchCat && matchUbi;
    });

    if (listaFiltrata.length === 0) {
        contenitore.innerHTML = `<div class="empty-msg">${t.inventario_empty}</div>`;
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

        lista.sort((a, b) => {
            let urgenzaA = getLivelloUrgenza(a.scadenza);
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
            li.onclick = () => apriSchedaArticolo(prod);

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

function getLivelloUrgenza(dataStr) {
    if (!dataStr) return 4;
    const oggi = new Date();
    oggi.setHours(0, 0, 0, 0);
    const scadenza = new Date(dataStr);
    if (isNaN(scadenza)) return 4;
    
    const diffTime = scadenza - oggi;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 1;
    if (diffDays <= 5) return 2;
    return 3;
}

function azzeraTuttoDatabase() {
    if (confirm("⚠️ Sei sicuro di voler azzerare TUTTO l'archivio inventario di ChefStock?")) {
        localStorage.removeItem('eat_me_first_db');
        alert("Archivio azzerato con successo.");
        location.reload();
    }
}

function toggleHelpBox() {
    const content = document.getElementById('helpBoxContent');
    if (content) {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    }
}

function mostraGuidaInventario() {
    document.getElementById('popupGuida').style.display = 'flex';
}

function chiudiGuidaInventario() {
    document.getElementById('popupGuida').style.display = 'none';
}

function mostraPopupScadenzeManualita() {
    let scadenzeUrgenti = prodottiInventario.filter(p => {
        let livello = getLivelloUrgenza(p.scadenza);
        return livello === 1 || livello === 2;
    });
    if (scadenzeUrgenti.length === 0) {
        alert("Nessun prodotto con scadenza imminente in inventario.");
        return;
    }
    const divLista = document.getElementById('lista-scadenze-urgenti');
    if (!divLista) return;
    divLista.innerHTML = '';

    scadenzeUrgenti.forEach(p => {
        let livello = getLivelloUrgenza(p.scadenza);
        let coloreIcona = livello === 1 ? '🔴' : '🟡';
        let bgStyle = livello === 1 ? 'background: rgba(239,68,68,0.2); border: 1px solid var(--accent-danger);' : 'background: rgba(245,158,11,0.2); border: 1px solid var(--accent-warning);';

        let row = document.createElement('div');
        row.style.cssText = `padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: bold; ${bgStyle}`;
        row.innerHTML = `<span>${coloreIcona} ${p.nome} (${p.posizione})</span> <span>Scad: ${formattaDataItaliana(p.scadenza)}</span>`;
        divLista.appendChild(row);
    });

    document.getElementById('popupScadenze').style.display = 'flex';
}

function chiudiPopupScadenze() {
    document.getElementById('popupScadenze').style.display = 'none';
}

function apriSchedaArticolo(prod) {
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

function applicaTraduzioniInventario(lang) {
    const t = dizionarioInventario[lang] || dizionarioInventario['it'];
    
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