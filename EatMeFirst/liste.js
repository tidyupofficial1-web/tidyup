document.addEventListener('DOMContentLoaded', () => {
    const containerLang = document.getElementById('header-lang');
    if (containerLang) {
        containerLang.innerHTML = creaSelettoreLinguaHTML();
    }

    applicaTraduzioniFooter();
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
                            <div class="item-title">${item.nome} ⚠️ (In esaurimento)</div>
                            <div class="item-details">Ubicazione: ${item.ubicazione || 'N/D'} | Scadenza: ${dataFormatted}</div>
                        </div>
                    </div>`;
            } else {
                htmlDaPrendere += `
                    <div class="item-row" style="background-color: #21262d;">
                        <input type="checkbox" checked disabled style="transform: scale(1.3);">
                        <div class="item-info" style="color: var(--text-muted);">
                            <div class="item-title" style="text-decoration: line-through; color: var(--text-muted);">${item.nome}</div>
                            <div class="item-details">Ubicazione: ${item.ubicazione || 'N/D'} | Scadenza: ${dataFormatted}</div>
                        </div>
                    </div>`;

                htmlGiaPresi += `
                    <div class="item-row">
                        <div class="item-info">
                            <div class="item-title" style="color: var(--accent-green);">&#10004; ${item.nome}</div>
                            <div class="item-details">Ubicazione: ${item.ubicazione || 'N/D'} | Preso</div>
                        </div>
                    </div>`;
            }
        }
    });

    document.getElementById('lista-da-prendere').innerHTML = htmlDaPrendere || '<p style="padding:10px; color:var(--text-muted); font-style: italic;">Nessun prodotto da acquistare.</p>';
    document.getElementById('lista-gia-presi').innerHTML = htmlGiaPresi || '<p style="padding:10px; color:var(--text-muted); font-style: italic;">Nessun prodotto nel carrello. Spunta gli articoli mentre fai la spesa.</p>';
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

function applicaTraduzioniFooter() {
    const lang = getLinguaCorrente();
    const glob = dizionarioGlobale[lang] || dizionarioGlobale['it'];
    if(glob && glob.footer) {
        document.getElementById('txt-footer').innerHTML = glob.footer;
    }
}