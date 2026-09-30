document.addEventListener('DOMContentLoaded', () => {
    const containerLang = document.getElementById('header-lang');
    if (containerLang) {
        containerLang.innerHTML = creaSelettoreLinguaHTML();
    }

    applicaTraduzioniInterfaccia();
    renderizzaListe();
});

let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {
    dispensa: []
};

let loopCount = 0;
const maxLoops = 3;
const videoElement = document.getElementById('clip-carrello');
const videoContainer = document.getElementById('video-container');

if(videoElement) {
    videoElement.addEventListener('ended', function() {
        loopCount++;
        if (loopCount >= maxLoops) {
            videoContainer.style.opacity = '0';
            setTimeout(() => { videoContainer.style.display = 'none'; }, 500);
        } else {
            videoElement.play();
        }
    });
}

function salvaDb() {
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    renderizzaListe();
}

// Converte la data da AAAA-MM-GG a GG/MM/AA (formato italiano)
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

function renderizzaListe() {
    const lang = getLinguaCorrente();
    // Dizionario completo per la pagina liste
    const etichette = {
        it: {
            ubicazione: "Ubicazione",
            scadenza: "Scadenza",
            inEsaurimento: "In esaurimento",
            preso: "Preso",
            vuotoPrendere: "Nessun prodotto da acquistare.",
            vuotoCarrello: "Nessun prodotto nel carrello. Spunta gli articoli mentre fai la spesa.",
            tabPrendere: "Da Prendere",
            tabPresi: "Già Presi (Carrello)",
            titoloSezionePrendere: "Articoli da Acquistare",
            descSezionePrendere: "Metti la spunta sui prodotti presi. Quelli non spuntati rimarranno qui per la prossima spesa.",
            titoloSezionePresi: "Prodotti nel Carrello (Già Presi)",
            descSezionePresi: "Riepilogo dei prodotti acquistati. Cliccando il pulsante sotto verranno pulite le visualizzazioni sbarrate, lasciando intatti quelli non presi.",
            btnPulisci: "Pulisci testi sbarrati",
            navBack: "&larr; Torna al Menu Principale"
        },
        en: {
            ubicazione: "Location",
            scadenza: "Expires",
            inEsaurimento: "Low stock",
            preso: "Taken",
            vuotoPrendere: "No items to buy.",
            vuotoCarrello: "No items in the cart. Check off items while shopping.",
            tabPrendere: "To Buy",
            tabPresi: "Already Taken (Cart)",
            titoloSezionePrendere: "Items to Purchase",
            descSezionePrendere: "Check off the items you've taken. Unchecked items will remain here for your next trip.",
            titoloSezionePresi: "Products in Cart (Already Taken)",
            descSezionePresi: "Summary of purchased products. Clicking the button below will clear crossed-out items, leaving unpicked ones intact.",
            btnPulisci: "Clear crossed-out items",
            navBack: "&larr; Back to Main Menu"
        },
        es: {
            ubicazione: "Ubicación",
            scadenza: "Caducidad",
            inEsaurimento: "Poco stock",
            preso: "Cogido",
            vuotoPrendere: "No hay productos para comprar.",
            vuotoCarrello: "No hay productos en el carro.",
            tabPrendere: "Por Comprar",
            tabPresi: "Ya Cogidos (Carro)",
            titoloSezionePrendere: "Artículos para Comprar",
            descSezionePrendere: "Marca los productos que hayas cogido. Los no marcados se quedarán aquí para la próxima compra.",
            titoloSezionePresi: "Productos en el Carro (Ya Cogidos)",
            descSezionePresi: "Resumen de los productos comprados. Al hacer clic en el botón de abajo se limpiarán los tachados.",
            btnPulisci: "Limpiar textos tachados",
            navBack: "&larr; Volver al Menú Principal"
        },
        fr: {
            ubicazione: "Emplacement",
            scadenza: "Expiration",
            inEsaurimento: "Stock faible",
            preso: "Pris",
            vuotoPrendere: "Aucun article à acheter.",
            vuotoCarrello: "Aucun article dans le panier.",
            tabPrendere: "À Acheter",
            tabPresi: "Déjà Pris (Panier)",
            titoloSezionePrendere: "Articles à Acheter",
            descSezionePrendere: "Cochez les produits pris. Ceux non cochés resteront ici pour la prochaine course.",
            titoloSezionePresi: "Produits dans le Panier (Déjà Pris)",
            descSezionePresi: "Résumé des produits achetés. En cliquant sur le bouton ci-dessous, les éléments barrés seront effacés.",
            btnPulisci: "Effacer les éléments barrés",
            navBack: "&larr; Retour au Menu Principal"
        },
        de: {
            ubicazione: "Standort",
            scadenza: "Verfallsdatum",
            inEsaurimento: "Fast leer",
            preso: "Mitgenommen",
            vuotoPrendere: "Keine Artikel zu kaufen.",
            vuotoCarrello: "Keine Artikel im Warenkorb.",
            tabPrendere: "Zu Kaufen",
            tabPresi: "Bereits Mitgenommen (Warenkorb)",
            titoloSezionePrendere: "Zu kaufende Artikel",
            descSezionePrendere: "Haken Sie gekaufte Produkte ab. Nicht abgehakte bleiben für den nächsten Einkauf hier.",
            titoloSezionePresi: "Produkte im Warenkorb (Bereits mitgenommen)",
            descSezionePresi: "Zusammenfassung der gekauften Produkte. Durch Klick auf den Button unten werden durchgestrichene Einträge bereinigt.",
            btnPulisci: "Durchgestrichene Texte bereinigen",
            navBack: "&larr; Zurück zum Hauptmenü"
        }
    };

    const t = etichette[lang] || etichette['it'];

    // Aggiorna i testi fissi dell'interfaccia tramite gli ID dedicati
    document.getElementById('tab-btn-prendere').innerText = t.tabPrendere;
    document.getElementById('tab-btn-presi').innerText = t.tabPresi;
    document.getElementById('txt-sezione-prendere-titolo').innerText = t.titoloSezionePrendere;
    document.getElementById('txt-sezione-prendere-disc').innerText = t.descSezionePrendere;
    document.getElementById('txt-sezione-presi-titolo').innerText = t.titoloSezionePresi;
    document.getElementById('txt-sezione-presi-disc').innerText = t.descSezionePresi;
    document.getElementById('btn-pulisci-testi').innerText = t.btnPulisci;
    document.getElementById('nav-back-link').innerHTML = t.navBack;

    let htmlDaPrendere = '';
    let htmlGiaPresi = '';

    (db.dispensa || []).forEach(item => {
        let dataFormatted = formattaDataItaliana(item.scadenza);

        if (item.lowStock) {
            if (!item.preso) {
                htmlDaPrendere += `
                    <div class="item-row low-stock">
                        <input type="checkbox" style="transform: scale(1.3); cursor: pointer;" onchange="spuntatoProdotto(${item.id})">
                        <div class="item-info">
                            <div class="item-title">${item.nome} ⚠️ (${t.inEsaurimento})</div>
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
        }
    });

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
    let acquistatiCount = db.dispensa.filter(i => i.lowStock && i.preso).length;
    
    if (acquistatiCount === 0) {
        alert("Non ci sono prodotti spuntati come 'presi' da pulire.");
        return;
    }

    if (confirm("Vuoi ripulire i testi sbarrati dei prodotti acquistati? Quelli non presi rimarranno in lista.")) {
        db.dispensa = db.dispensa.filter(item => !(item.lowStock && item.preso));
        salvaDb();
        cambiaVistaSpesa('prendere');
    }
}

function applicaTraduzioniInterfaccia() {
    const lang = getLinguaCorrente();
    const glob = dizionarioGlobale[lang] || dizionarioGlobale['it'];
    if(glob && glob.footer) {
        document.getElementById('txt-footer').innerHTML = glob.footer;
    }
    // Rende dinamico anche il titolo principale della spesa se gestito nel dizionario globale o locale
    if(glob && glob.shoppingListTitle) {
        document.getElementById('txt-liste-title').innerText = glob.shoppingListTitle;
    }
}