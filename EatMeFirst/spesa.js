document.addEventListener('DOMContentLoaded', () => {
    const containerLang = document.getElementById('header-lang');
    if (containerLang && typeof creaSelettoreLinguaHTML === 'function') {
        containerLang.innerHTML = creaSelettoreLinguaHTML();
    }
    if (typeof applicaTraduzioniInterfaccia === 'function') {
        applicaTraduzioniInterfaccia();
    }
    renderizzaListeExtra();
});

// Inizializzazione Database locale per la spesa extra
let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [], spesa_extra: [] };

// Assicuriamoci che esista l'array spesa_extra
if (!db.spesa_extra) {
    db.spesa_extra = [];
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

function aggiungiProdottoExtra() {
    const inputNome = document.getElementById('input-nuovo-extra');
    const selectReparto = document.getElementById('select-reparto-extra');
    
    const nome = inputNome.value.trim();
    if (!nome) {
        alert("Inserisci il nome del prodotto extra da acquistare.");
        return;
    }

    const nuovoItem = {
        id: Date.now(),
        nome: nome,
        reparto: selectReparto.value,
        preso: false,
        isExtra: true // Flag fondamentale per riconoscerlo e colorarlo in liste.html
    };

    db.spesa_extra.push(nuovoItem);
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));

    inputNome.value = '';
    renderizzaListeExtra();
}

function renderizzaListeExtra() {
    let htmlDaPrendere = '';
    let htmlGiaPresi = '';

    (db.spesa_extra || []).forEach(item => {
        if (!item.preso) {
            htmlDaPrendere += `
                <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); background-color: rgba(168, 85, 247, 0.08); border-left: 4px solid var(--accent-purple); margin-bottom: 8px; border-radius: 4px;">
                    <input type="checkbox" style="transform: scale(1.3); cursor: pointer;" onchange="spuntatoExtra(${item.id})">
                    <div class="item-info" style="flex-grow: 1; margin-left: 12px;">
                        <div class="item-title" style="font-weight: bold; color: var(--text-main);">${item.nome}</div>
                        <div class="item-details" style="font-size: 0.8rem; color: var(--text-muted);">Reparto: ${item.reparto || 'Varie'} (Extra)</div>
                    </div>
                </div>`;
        } else {
            htmlDaPrendere += `
                <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); background-color: #21262d; margin-bottom: 8px; border-radius: 4px;">
                    <input type="checkbox" checked disabled style="transform: scale(1.3);">
                    <div class="item-info" style="flex-grow: 1; margin-left: 12px; color: var(--text-muted);">
                        <div class="item-title" style="text-decoration: line-through;">${item.nome}</div>
                        <div class="item-details" style="font-size: 0.8rem;">Reparto: ${item.reparto || 'Varie'}</div>
                    </div>
                </div>`;

            htmlGiaPresi += `
                <div class="item-row" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid var(--border-color); margin-bottom: 8px; background: #21262d; border-radius: 4px;">
                    <div class="item-info" style="flex-grow: 1;">
                        <div class="item-title" style="color: var(--accent-green); font-weight: bold;">&#10004; ${item.nome}</div>
                        <div class="item-details" style="font-size: 0.8rem; color: var(--text-muted);">Reparto: ${item.reparto || 'Varie'} (Extra)</div>
                    </div>
                </div>`;
        }
    });

    document.getElementById('lista-extra-da-prendere').innerHTML = htmlDaPrendere || `<p style="padding:10px; color:var(--text-muted); font-style: italic;">Nessun prodotto extra inserito.</p>`;
    document.getElementById('lista-extra-gia-presi').innerHTML = htmlGiaPresi || `<p style="padding:10px; color:var(--text-muted); font-style: italic;">Nessun prodotto extra nel carrello.</p>`;
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