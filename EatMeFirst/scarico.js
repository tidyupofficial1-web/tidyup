let mostraAiutiAttivo = true;
let linguaCorrente = 'it';

// Dizionario delle traduzioni
const dizionario = {
    it: {
        mostraAiuti: "Mostra suggerimenti e guide passo-passo",
        titoloPagina: "Scarico e Consumo Prodotti",
        etichettaCerca: "🔍 Cerca in Dispensa",
        placeholderCerca: "Cerca prodotto...",
        tornaMenu: "← Torna al Menu Principale",
        footerTesto: "Gestione locale sicura &bull; Risparmia cibo, vivi meglio",
        suggerimentoTitolo: "💡 Suggerimento Utile",
        btnCapito: "Ho capito",
        nessunProdotto: "Nessun prodotto disponibile in dispensa da scaricare.",
        ubicazione: "📍 Ubicazione:",
        scadenza: "⏳ Scadenza:",
        disponibili: "📦 Disponibili:",
        terminaSpesa: "🗑️ Termina & Spesa",
        consumoRapido: "Consumo rapido:",
        scalaPezzi: "Scala i singoli pezzi",
        prodottoTerminato: (nome) => `Il prodotto "${nome}" è terminato! Spostato automaticamente nella Lista della Spesa.`
    },
    en: {
        mostraAiuti: "Show tips and step-by-step guides",
        titoloPagina: "Product Checkout & Consumption",
        etichettaCerca: "🔍 Search Pantry",
        placeholderCerca: "Search product...",
        tornaMenu: "← Back to Main Menu",
        footerTesto: "Secure local management &bull; Save food, live better",
        suggerimentoTitolo: "💡 Useful Tip",
        btnCapito: "Got it",
        nessunProdotto: "No products available in the pantry to check out.",
        ubicazione: "📍 Location:",
        scadenza: "⏳ Expiry:",
        disponibili: "📦 Available:",
        terminaSpesa: "🗑️ Finish & Shop",
        consumoRapido: "Quick consumption:",
        scalaPezzi: "Scale individual items",
        prodottoTerminato: (nome) => `The product "${nome}" is finished! Automatically moved to the Shopping List.`
    },
    es: {
        mostraAiuti: "Mostrar sugerencias y guías paso a paso",
        titoloPagina: "Descarga y Consumo de Productos",
        etichettaCerca: "🔍 Buscar en Despensa",
        placeholderCerca: "Buscar producto...",
        tornaMenu: "← Volver al Menú Principal",
        footerTesto: "Gestión local segura &bull; Ahorra comida, vive mejor",
        suggerimentoTitolo: "💡 Consejo Útil",
        btnCapito: "Entendido",
        nessunProdotto: "No hay productos disponibles en la despensa para descargar.",
        ubicazione: "📍 Ubicación:",
        scadenza: "⏳ Caducidad:",
        disponibili: "📦 Disponibles:",
        terminaSpesa: "🗑️ Terminar y Comprar",
        consumoRapido: "Consumo rápido:",
        scalaPezzi: "Restar piezas individuales",
        prodottoTerminato: (nome) => `¡El producto "${nome}" se ha terminado! Movido automáticamente a la Lista de Compras.`
    },
    fr: {
        mostraAiuti: "Afficher les conseils et guides étape par étape",
        titoloPagina: "Consommation et Sortie des Produits",
        etichettaCerca: "🔍 Rechercher dans le Garde-manger",
        placeholderCerca: "Rechercher un produit...",
        tornaMenu: "← Retour au Menu Principal",
        footerTesto: "Gestion locale sécurisée &bull; Sauvez de la nourriture, vivez mieux",
        suggerimentoTitolo: "💡 Conseil Utile",
        btnCapito: "J'ai compris",
        nessunProdotto: "Aucun produit disponible dans le garde-manger à consommer.",
        ubicazione: "📍 Emplacement:",
        scadenza: "⏳ Expiration:",
        disponibili: "📦 Disponibles:",
        terminaSpesa: "🗑️ Terminer & Courses",
        consumoRapido: "Consommation rapide:",
        scalaPezzi: "Déduire les pièces individuelles",
        prodottoTerminato: (nome) => `Le produit "${nome}" est épuisé ! Déplacé automatiquement vers la liste de courses.`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Gestione preferenza aiuti
    const savedHelpPref = localStorage.getItem('eat_me_first_help');
    if (savedHelpPref === 'false') {
        mostraAiutiAttivo = false;
        document.getElementById('chk-mostra-aiuti').checked = false;
    }

    // Gestione preferenza lingua
    linguaCorrente = localStorage.getItem('eat_me_first_lang') || 'it';
    const selectLingua = document.getElementById('select-lingua');
    if (selectLingua) {
        selectLingua.value = linguaCorrente;
    }

    traduciInterfaccia();
    inizializzaListenerCampi();
    caricaListaDispensa();
    
    // Focus iniziale sulla barra di ricerca
    const inputRicerca = document.getElementById('filtroProdotti');
    if(inputRicerca) inputRicerca.focus();
});

function cambiaLingua(lang) {
    linguaCorrente = lang;
    localStorage.setItem('eat_me_first_lang', lang);
    traduciInterfaccia();
    caricaListaDispensa(); // Ricarica la lista per applicare la lingua ai prodotti generati dinamicamente
}

function traduciInterfaccia() {
    const t = dizionario[linguaCorrente] || dizionario.it;

    // Traduce gli elementi fissi con attributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        if (t[chiave]) {
            el.innerHTML = t[chiave];
        }
    });

    // Traduce il placeholder della ricerca
    const inputFiltro = document.getElementById('filtroProdotti');
    if (inputFiltro) {
        inputFiltro.placeholder = t.placeholderCerca;
    }
}

function toggleGlobalHelp(stato) {
    mostraAiutiAttivo = stato;
    localStorage.setItem('eat_me_first_help', stato);
}

function inizializzaListenerCampi() {
    const gruppi = document.querySelectorAll('.form-group');
    gruppi.forEach(gruppo => {
        const input = gruppo.querySelector('input, select');
        if (input) {
            input.addEventListener('focus', () => {
                if (mostraAiutiAttivo) {
                    // Prende l'aiuto nella lingua corrente (es. data-help-en, data-help-es, ecc.)
                    const testoAiuto = gruppo.getAttribute(`data-help-${linguaCorrente}`) || gruppo.getAttribute('data-help-it');
                    if (testoAiuto) {
                        mostraTooltip(testoAiuto);
                    }
                }
            });
        }
    });
}

function mostraTooltip(testo) {
    document.getElementById('tooltip-text').textContent = testo;
    document.getElementById('tooltip-modal').style.display = 'flex';
}

function chiudiTooltip() {
    document.getElementById('tooltip-modal').style.display = 'none';
}

function handleSearchKey(event) {
    if (event.key === 'Enter' || event.code === 'Space') {
        event.preventDefault();
    }
}

function caricaListaDispensa() {
    const t = dizionario[linguaCorrente] || dizionario.it;
    let container = document.getElementById('listaContainer');
    let filtro = document.getElementById('filtroProdotti').value.toLowerCase();
    
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    container.innerHTML = "";

    let prodottiFiltrati = (db.dispensa || []).filter(item => 
        !item.lowStock && 
        (item.nome.toLowerCase().includes(filtro) || (item.ubicazione && item.ubicazione.toLowerCase().includes(filtro)))
    );

    if (prodottiFiltrati.length === 0) {
        container.innerHTML = `<div class="empty-msg">${t.nessunProdotto}</div>`;
        return;
    }

    prodottiFiltrati.forEach(item => {
        let card = document.createElement('div');
        card.className = 'item-card';

        let quantitaAttuale = item.quantita || 1;
        let unitaMisura = item.unitaMisura || 'pezzi';

        card.innerHTML = `
            <div class="item-header">
                <div class="item-info">
                    <h3>${item.nome} (${item.marca || 'Generico'})</h3>
                    <p>${t.ubicazione} <b>${item.ubicazione || 'Dispensa'}</b> | ${t.scadenza} <b>${item.scadenza || 'Nessuna'}</b></p>
                    <p>${t.disponibili} <b style="color: #58a6ff; font-size: 1rem;">${quantitaAttuale} ${unitaMisura}</b></p>
                </div>
                <button class="btn-termina" onclick="terminaProdotto(${item.id})">${t.terminaSpesa}</button>
            </div>
            
            <div class="consumo-controllo">
                <span style="font-size: 0.85rem; color: #8b949e;">${t.consumoRapido}</span>
                <button class="btn-qty" onclick="aggiornaQuantita(${item.id}, -1)">-1</button>
                <span style="font-size: 0.9rem; font-weight: bold; min-width: 30px; text-align: center;">${quantitaAttuale}</span>
                <button class="btn-qty" onclick="aggiornaQuantita(${item.id}, 1)">+1</button>
                <span style="font-size: 0.80rem; color: #8b949e; margin-left: auto;">${t.scalaPezzi}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function aggiornaQuantita(id, delta) {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    let item = db.dispensa.find(i => i.id === id);

    if (item) {
        item.quantita = (item.quantita || 1) + delta;
        
        if (item.quantita <= 0) {
            item.quantita = 0;
            spostaInListaSpesa(item, db);
        } else {
            localStorage.setItem('eat_me_first_db', JSON.stringify(db));
            caricaListaDispensa();
        }
    }
}

function terminaProdotto(id) {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    let item = db.dispensa.find(i => i.id === id);

    if (item) {
        item.quantita = 0;
        spostaInListaSpesa(item, db);
    }
}

function spostaInListaSpesa(item, db) {
    const t = dizionario[linguaCorrente] || dizionario.it;
    item.lowStock = true; 

    if (!db.spesa) db.spesa = [];
    const esisteGia = db.spesa.some(s => s.nome.toLowerCase() === item.nome.toLowerCase() && !s.comprato);
    
    if (!esisteGia) {
        db.spesa.push({
            id: Date.now(),
            nome: item.nome,
            marca: item.marca || "",
            quantita: 1,
            comprato: false
        });
    }

    localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    alert(t.prodottoTerminato(item.nome));
    caricaListaDispensa();
}