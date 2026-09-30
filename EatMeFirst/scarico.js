let mostraAiutiAttivo = true;

document.addEventListener('DOMContentLoaded', () => {
    const savedHelpPref = localStorage.getItem('eat_me_first_help');
    if (savedHelpPref === 'false') {
        mostraAiutiAttivo = false;
        document.getElementById('chk-mostra-aiuti').checked = false;
    }

    inizializzaListenerCampi();
    caricaListaDispensa();
});

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
                if (mostraAiutiAttivo && gruppo.dataset.help) {
                    mostraTooltip(gruppo.dataset.help);
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

function caricaListaDispensa() {
    let container = document.getElementById('listaContainer');
    let filtro = document.getElementById('filtroProdotti').value.toLowerCase();
    
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa: [] };
    container.innerHTML = "";

    // Filtra prodotti attivi (non esauriti)
    let prodottiFiltrati = (db.dispensa || []).filter(item => 
        !item.lowStock && 
        (item.nome.toLowerCase().includes(filtro) || (item.ubicazione && item.ubicazione.toLowerCase().includes(filtro)))
    );

    if (prodottiFiltrati.length === 0) {
        container.innerHTML = `<div class="empty-msg">Nessun prodotto disponibile in dispensa da scaricare.</div>`;
        return;
    }

    prodottiFiltrati.forEach(item => {
        let card = document.createElement('div');
        card.className = 'item-card';

        // Gestione unità (pezzi/grammi) per consumo parziale o totale
        let quantitaAttuale = item.quantita || 1;
        let unitaMisura = item.unitaMisura || 'pezzi';

        card.innerHTML = `
            <div class="item-header">
                <div class="item-info">
                    <h3>${item.nome} (${item.marca || 'Generico'})</h3>
                    <p>📍 Ubicazione: <b>${item.ubicazione || 'Dispensa'}</b> | ⏳ Scadenza: <b>${item.scadenza || 'Nessuna'}</b></p>
                    <p>📦 Disponibili: <b style="color: #58a6ff; font-size: 1rem;">${quantitaAttuale} ${unitaMisura}</b></p>
                </div>
                <button class="btn-termina" onclick="terminaProdotto(${item.id})">🗑️ Termina & Spesa</button>
            </div>
            
            <div class="consumo-controllo">
                <span style="font-size: 0.85rem; color: #8b949e;">Consumo rapido:</span>
                <button class="btn-qty" onclick="aggiornaQuantita(${item.id}, -1)">-1</button>
                <span style="font-size: 0.9rem; font-weight: bold; min-width: 30px; text-align: center;">${quantitaAttuale}</span>
                <button class="btn-qty" onclick="aggiornaQuantita(${item.id}, 1)">+1</button>
                <span style="font-size: 0.80rem; color: #8b949e; margin-left: auto;">Scala i singoli pezzi (es. uova)</span>
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
        
        // Se la quantità scende a 0 o meno, consideriamo il prodotto esaurito
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
    item.lowStock = true; // Segnato come esaurito in dispensa

    // Aggiunge alla lista della spesa se non è già presente
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
    alert(`Il prodotto "${item.nome}" è terminato! Spostato automaticamente nella Lista della Spesa.`);
    caricaListaDispensa();
}