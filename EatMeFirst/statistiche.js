let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {
    dispensa: []
};

let linguaCorrente = 'it';

const dizionarioStatistiche = {
    it: {
        titoloMeta: "EatMeFirst - Agenda Scadenze",
        titoloHeader: "Agenda Scadenze",
        menuTitolo: "Menu EatMeFirst",
        menuDispensa: "📦 Dispensa e Frigorifero",
        menuListe: "🛒 Lista della Spesa",
        menuStatistiche: "📅 Agenda Scadenze",
        menuSecImpostazioni: "Impostazioni & Dati",
        menuBackup: "💾 Scarica Backup Database",
        menuDetonatore: "💣 Svuota Intera Dispensa",
        cardTitolo: "📅 Prossimi Giorni in Scadenza",
        cardSubtitle: "Scorri la barra per visualizzare l'andamento. Clicca su una colonna per scoprire i prodotti del giorno.",
        legendaFresco: "Fresco (Tassativo)",
        legendaConsigliato: "Consigliato",
        btnChiudi: "Chiudi",
        titoloModalGiorno: (data) => `Scadenze del ${data}`,
        msgZeroProdotti: "Nessun prodotto in scadenza in questo giorno. Ottimo!",
        tipoFresco: "🚨 Fresco (Scadenza tassativa)",
        tipoConsigliato: "⚠️ Consigliato (Preferibilmente entro)",
        paywallTitolo: "Funzione Extra Avanzata",
        paywallTesto: "L'Agenda Scadenze è una funzione extra attualmente offerta in uso gratuito, ma che in futuro diventerà a pagamento per lo sviluppo avanzato.",
        paywallBtnSblocca: "Accedi subito alla funzione",
        paywallBtnIndietro: "← Torna alla Dispensa"
    },
    en: {
        titoloMeta: "EatMeFirst - Expiry Schedule",
        titoloHeader: "Expiry Schedule",
        menuTitolo: "EatMeFirst Menu",
        menuDispensa: "📦 Pantry & Fridge",
        menuListe: "🛒 Shopping List",
        menuStatistiche: "📅 Expiry Schedule",
        menuSecImpostazioni: "Settings & Data",
        menuBackup: "💾 Download Database Backup",
        menuDetonatore: "💣 Clear Entire Pantry",
        cardTitolo: "📅 Upcoming Expiries",
        cardSubtitle: "Scroll the bar to view the trend. Click on a column to see products for that day.",
        legendaFresco: "Fresh (Strict)",
        legendaConsigliato: "Recommended",
        btnChiudi: "Close",
        titoloModalGiorno: (data) => `Expiries for ${data}`,
        msgZeroProdotti: "No products expiring on this day. Great!",
        tipoFresco: "🚨 Fresh (Strict expiry)",
        tipoConsigliato: "⚠️ Recommended (Preferably by)",
        paywallTitolo: "Advanced Extra Feature",
        paywallTesto: "The Expiry Schedule is an extra feature currently offered for free use, but it will become paid in the future for advanced development.",
        paywallBtnSblocca: "Access feature now",
        paywallBtnIndietro: "← Back to Pantry"
    },
    es: {
        titoloMeta: "EatMeFirst - Agenda de Caducidades",
        titoloHeader: "Agenda de Caducidades",
        menuTitolo: "Menú EatMeFirst",
        menuDispensa: "📦 Despensa y Nevera",
        menuListe: "🛒 Lista de Compras",
        menuStatistiche: "📅 Agenda de Caducidades",
        menuSecImpostazioni: "Ajustes y Datos",
        menuBackup: "💾 Descargar Copia de Seguridad",
        menuDetonatore: "💣 Vaciar Toda la Despensa",
        cardTitolo: "📅 Próximos Días",
        cardSubtitle: "Desliza la barra para ver la tendencia. Haz clic en una columna para ver los productos.",
        legendaFresco: "Fresco (Estricto)",
        legendaConsigliato: "Recomendado",
        btnChiudi: "Cerrar",
        titoloModalGiorno: (data) => `Caducidades del ${data}`,
        msgZeroProdotti: "Ningún producto caduca este día. ¡Genial!",
        tipoFresco: "🚨 Fresco (Caducidad estricta)",
        tipoConsigliato: "⚠️ Recomendado (Preferiblemente antes de)",
        paywallTitolo: "Función Extra Avanzada",
        paywallTesto: "La Agenda de Caducidades es una función extra gratuita por ahora, pero en el futuro requerirá un pago para su mantenimiento.",
        paywallBtnSblocca: "Acceder a la función",
        paywallBtnIndietro: "← Volver a la Despensa"
    },
    fr: {
        titoloMeta: "EatMeFirst - Agenda des Péremptions",
        titoloHeader: "Agenda des Péremptions",
        menuTitolo: "Menu EatMeFirst",
        menuDispensa: "📦 Garde-manger et Frigo",
        menuListe: "🛒 Liste de Courses",
        menuStatistiche: "📅 Agenda des Péremptions",
        menuSecImpostazioni: "Paramètres et Données",
        menuBackup: "💾 Télécharger la Sauvegarde",
        menuDetonatore: "💣 Vider Tout le Garde-manger",
        cardTitolo: "📅 Prochaines Péremptions",
        cardSubtitle: "Faites défiler la barre pour voir la tendance. Cliquez sur une colonne pour voir les produits.",
        legendaFresco: "Frais (Strict)",
        legendaConsigliato: "Recommandé",
        btnChiudi: "Fermer",
        titoloModalGiorno: (data) => `Péremptions du ${data}`,
        msgZeroProdotti: "Aucun produit ne périt ce jour-là. Super !",
        tipoFresco: "🚨 Frais (Péremption stricte)",
        tipoConsigliato: "⚠️ Recommandé (De préférence avant)",
        paywallTitolo: "Fonctionnalité Extra",
        paywallTesto: "L'agenda des péremptions est une fonction extra actuellement gratuite, mais qui deviendra payante à l'avenir.",
        paywallBtnSblocca: "Accéder à la fonction",
        paywallBtnIndietro: "← Retour au Garde-manger"
    },
    de: {
        titoloMeta: "EatMeFirst - Ablaufkalender",
        titoloHeader: "Ablaufkalender",
        menuTitolo: "EatMeFirst Menü",
        menuDispensa: "📦 Vorratskammer & Kühlschrank",
        menuListe: "🛒 Einkaufsliste",
        menuStatistiche: "📅 Ablaufkalender",
        menuSecImpostazioni: "Einstellungen & Daten",
        menuBackup: "💾 Datenbank-Backup herunterladen",
        menuDetonatore: "💣 Gesamte Vorratskammer leeren",
        cardTitolo: "📅 Anstehende Abläufe",
        cardSubtitle: "Leiste verschieben, um den Trend zu sehen. Klicken Sie auf eine Spalte für Details.",
        legendaFresco: "Frisch (Streng)",
        legendaConsigliato: "Empfohlen",
        btnChiudi: "Schließen",
        titoloModalGiorno: (data) => `Ablaufdatum am ${data}`,
        msgZeroProdotti: "An diesem Tag läuft kein Produkt ab. Super!",
        tipoFresco: "🚨 Frisch (Strenges Ablaufdatum)",
        tipoConsigliato: "⚠️ Empfohlen (Vorzugsweise bis)",
        paywallTitolo: "Erweiterte Extra-Funktion",
        paywallTesto: "Der Ablaufkalender ist eine Extra-Funktion, die derzeit kostenlos angeboten wird, aber zukünftig kostenpflichtig werden kann.",
        paywallBtnSblocca: "Funktion jetzt nutzen",
        paywallBtnIndietro: "← Zurück zur Vorratskammer"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    linguaCorrente = localStorage.getItem('eat_me_first_lang') || 'it';
    const select = document.getElementById('selettore-lingua');
    if (select) select.value = linguaCorrente;

    applicaTraduzioni();
    controllaAccessoPro();
});

function cambiaLingua(nuovaLingua) {
    linguaCorrente = nuovaLingua;
    localStorage.setItem('eat_me_first_lang', nuovaLingua);
    applicaTraduzioni();
    generaCalendario30Giorni();
}

function applicaTraduzioni() {
    const t = dizionarioStatistiche[linguaCorrente] || dizionarioStatistiche.it;
    
    document.getElementById('titolo-pagina-meta').textContent = t.titoloMeta;
    document.getElementById('titolo-header').textContent = t.titoloHeader;
    document.getElementById('menu-titolo').textContent = t.menuTitolo;
    document.getElementById('menu-dispensa').textContent = t.menuDispensa;
    document.getElementById('menu-liste').textContent = t.menuListe;
    document.getElementById('menu-statistiche').textContent = t.menuStatistiche;
    document.getElementById('menu-sec-impostazioni').textContent = t.menuSecImpostazioni;
    document.getElementById('menu-backup').textContent = t.menuBackup;
    document.getElementById('menu-detonatore').textContent = t.menuDetonatore;
    document.getElementById('card-titolo-calendario').textContent = t.cardTitolo;
    document.getElementById('card-subtitle-calendario').textContent = t.cardSubtitle;
    document.getElementById('legenda-fresco').textContent = t.legendaFresco;
    document.getElementById('legenda-consigliato').textContent = t.legendaConsigliato;
    document.getElementById('btn-chiudi-modal').textContent = t.btnChiudi;
    
    document.getElementById('paywall-titolo').textContent = t.paywallTitolo;
    document.getElementById('paywall-testo').textContent = t.paywallTesto;
    document.getElementById('paywall-btn-sblocca').textContent = t.paywallBtnSblocca;
    document.getElementById('paywall-btn-indietro').textContent = t.paywallBtnIndietro;
}

function controllaAccessoPro() {
    const isPro = localStorage.getItem('eat_me_first_pro') === 'true';
    const modalPaywall = document.getElementById('modal-paywall');
    
    if (!isPro) {
        modalPaywall.style.display = 'flex';
    } else {
        modalPaywall.style.display = 'none';
        generaCalendario30Giorni();
    }
}

function sbloccaFunzionePro() {
    localStorage.setItem('eat_me_first_pro', 'true');
    document.getElementById('modal-paywall').style.display = 'none';
    generaCalendario30Giorni();
}

function tornaAlMenuPrincipale() {
    window.location.href = 'dispensa.html';
}

function toggleMenu() {
    const menu = document.getElementById('side-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function esportaDatabase() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `eat_me_first_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function avviaDetonatore() {
    if(confirm("ATTENZIONE: Stai per attivare il sistema di svuotamento totale della dispensa. Vuoi procedere?")) {
        alert("Qui collegheremo la sequenza video del detonatore che abbiamo progettato!");
    }
}

// Converte in modo sicuro sia date YYYY-MM-DD sia date italiane GG/MM/AA o GG/MM/AAAA
function normalizzaDataIso(dataStr) {
    if (!dataStr) return null;
    let s = String(dataStr).trim();
    
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    
    let parti = s.split(/[\/\-]/);
    if (parti.length === 3) {
        let gg = parti[0].padStart(2, '0');
        let mm = parti[1].padStart(2, '0');
        let aa = parti[2];
        if (aa.length === 2) {
            aa = '20' + aa;
        }
        return `${aa}-${mm}-${gg}`;
    }
    return null;
}

function generaCalendario30Giorni() {
    const container = document.getElementById('calendario-30-giorni');
    if (!container) return;

    let scadenzePerData = {};
    if (db && Array.isArray(db.dispensa)) {
        db.dispensa.forEach(item => {
            if (!item.scadenza) return;
            let dataIso = normalizzaDataIso(item.scadenza);
            if (!dataIso) return;

            if (!scadenzePerData[dataIso]) {
                scadenzePerData[dataIso] = [];
            }
            scadenzePerData[dataIso].push(item);
        });
    }

    let htmlContainer = '';
    let oggi = new Date();
    
    for (let i = 0; i < 30; i++) {
        let d = new Date();
        d.setDate(oggi.getDate() + i);
        
        let anno = d.getFullYear();
        let mese = String(d.getMonth() + 1).padStart(2, '0');
        let giorno = String(d.getDate()).padStart(2, '0');
        let dataIso = `${anno}-${mese}-${giorno}`;
        
        let prodottiDelGiorno = scadenzePerData[dataIso] || [];
        
        let freschi = prodottiDelGiorno.filter(p => p.tipoScadenza === 'tassativa' || !p.tipoScadenza);
        let consigliati = prodottiDelGiorno.filter(p => p.tipoScadenza === 'consigliata');
        
        let altFreschi = Math.min(85, freschi.length * 20);
        if (altFreschi < 4 && freschi.length > 0) altFreschi = 10;

        let altConsigliati = Math.min(85, consigliati.length * 20);
        if (altConsigliati < 4 && consigliati.length > 0) altConsigliati = 10;

        let totaleGiorno = prodottiDelGiorno.length;

        htmlContainer += `
            <div onclick="apriDettaglioGiorno('${dataIso}', ${escapeStringaProdotti(prodottiDelGiorno)})" style="flex: 0 0 45px; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
                <div style="font-size: 0.7rem; color: #aaa; margin-bottom: 2px; font-weight: bold;">${totaleGiorno > 0 ? totaleGiorno : ''}</div>
                
                <div style="width: 100%; background: #2a2a2a; height: 95px; display: flex; align-items: flex-end; justify-content: center; gap: 3px; border-radius: 6px; padding: 0 3px; overflow: hidden; border: 1px solid #333;">
                    <div style="width: 45%; height: ${altFreschi}px; background: var(--warning); border-radius: 3px 3px 0 0;" title="Freschi: ${freschi.length}"></div>
                    <div style="width: 45%; height: ${altConsigliati}px; background: var(--warning-soft); border-radius: 3px 3px 0 0;" title="Consigliati: ${consigliati.length}"></div>
                </div>
                
                <div style="font-size: 0.7rem; color: #fff; margin-top: 5px; font-weight: bold;">${giorno}/${mese.slice(-2)}</div>
            </div>
        `;
    }

    container.innerHTML = htmlContainer;
}

function escapeStringaProdotti(prodotti) {
    return encodeURIComponent(JSON.stringify(prodotti));
}

function apriDettaglioGiorno(dataIso, prodottiEncoded) {
    const t = dizionarioStatistiche[linguaCorrente] || dizionarioStatistiche.it;
    let prodotti = JSON.parse(decodeURIComponent(prodottiEncoded));
    
    const dataFormattata = dataIso.split('-').reverse().join('/');
    document.getElementById('modal-data-titolo').innerText = t.titoloModalGiorno(dataFormattata);
    
    let htmlLista = '';
    if (prodotti.length === 0) {
        htmlLista = `<p style="color: #aaa; text-align: center; padding: 15px 0;">${t.msgZeroProdotti}</p>`;
    } else {
        prodotti.forEach(p => {
            let isConsigliato = p.tipoScadenza === 'consigliata';
            let bgColore = isConsigliato ? '#3d3822' : '#4a2020';
            let bordoColore = isConsigliato ? '#f1c40f' : '#e74c3c';
            let etichettaTipo = isConsigliato ? t.tipoConsigliato : t.tipoFresco;

            htmlLista += `
                <div style="padding: 10px; margin-bottom: 8px; border-radius: 6px; background: ${bgColore}; border-left: 4px solid ${bordoColore}; display: flex; flex-direction: column; gap: 3px;">
                    <div style="display: flex; justify-content: space-between; color: #fff;">
                        <strong>📦 ${p.nome}</strong>
                        <span style="font-size: 0.75rem; color: #ccc;">Q.tà: ${p.qta || 1}</span>
                    </div>
                    <div style="font-size: 0.75rem; color: #ddd; display: flex; justify-content: space-between;">
                        <span>Ubicazione: ${p.ubicazione || 'N/D'}</span>
                        <strong style="color: ${bordoColore};">${etichettaTipo}</strong>
                    </div>
                </div>`;
        });
    }
    
    document.getElementById('modal-lista-prodotti').innerHTML = htmlLista;
    document.getElementById('modal-giorno').style.display = 'flex';
}

function chiudiModalGiorno() {
    document.getElementById('modal-giorno').style.display = 'none';
}