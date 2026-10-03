let prodottiDispensa = [
    { id: 1, nome: "Mozzarella Fior di Latte", categoria: "Latticini", ubicazione: "Frigo Cucina", quantita: 5, unita: "pz" },
    { id: 2, nome: "Olio Extravergine 5L", categoria: "Condimenti", ubicazione: "Dispensa Secco", quantita: 2, unita: "taniche" },
    { id: 3, nome: "Farina Tipo 00 25kg", categoria: "Farine & Lieviti", ubicazione: "Magazzino Infereriore", quantita: 3, unita: "sacchi" }
];

let operazioneInSospeso = null;
let linguaCorrente = localStorage.getItem('eat_lang') || 'it';

function salvaStatoDispensa() {
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {};
    db.dispensa = prodottiDispensa;
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));
}

const dizionarioScarico = {
    it: {
        titoloPagina: "Scarico e Consumo",
        labelCerca: "🔍 Cerca Prodotto",
        placeholderCerca: "Es. farina, mozzarella, olio...",
        lblNome: "Nome", lblCat: "Categoria", lblUbi: "Ubicazione",
        titoloRisultati: "Risultati Magazzino",
        msgIniziale: "Digita qualcosa nella casella sopra per iniziare la ricerca.",
        msgZero: "Nessun prodotto trovato. Prova ad attivare più filtri o cambia termine.",
        msgTroppi: (n) => `Troppi risultati trovati (${n}). Usa le spunte per restringere il campo.`,
        btnEsaurito: "Esaurito",
        btnIndietro: "← Torna al Menu Principale",
        titoloGuida: "💡 Consiglio Operativo per la Cucina",
        testoGuida: "Per esperienza sappiamo che durante il servizio è difficile aggiornare il programma in tempo reale (per mancanza di tempo o perché si hanno le mani occupate/sporche).<br><br><strong>Il nostro consiglio:</strong> prendi nota dei prodotti che consumi su un bloc-notes o una lavagnetta in cucina, e procedi allo scarico cumulativo in un momento di pausa o a fine turno!",
        lblNonMostrare: "Non mostrare più questo avviso",
        btnInizia: "Ho capito, procedi",
        titoloConferma: "⚠️ Conferma Variazione",
        btnAnnulla: "Annulla",
        btnConfermaOk: "Conferma e Aggiorna",
        msgTerminato: (nome) => `Il prodotto "${nome}" è terminato ed è stato aggiunto automaticamente alla Lista Approvvigionamento!`,
        msgAggiornato: (qta) => `Quantità aggiornata con successo! Rimanenti: ${qta}`,
        messaggioConferma: (qta, nome) => `Stai per registrare il consumo di ${qta} unità di "${nome}". L'operazione aggiornerà subito la giacenza. Procedere?`,
        helpGenerale: "Questa schermata permette di scaricare rapidamente i prodotti dal magazzino durante l'attività di cucina o preparazione.",
        helpRicerca: "Usa la barra di ricerca rapida. Puoi decidere se cercare filtrando per nome esatto, categoria merceologica o ubicazione specifica.",
        helpRisultati: "Cliccando su '-1' scarichi un pezzo. Cliccando su 'Esaurito' azzeri la scorta e sposti l'articolo direttamente sul riordino."
    },
    en: {
        titoloPagina: "Checkout & Consumption",
        labelCerca: "🔍 Search Product",
        placeholderCerca: "E.g., flour, mozzarella, oil...",
        lblNome: "Name", lblCat: "Category", lblUbi: "Location",
        titoloRisultati: "Warehouse Results",
        msgIniziale: "Type something in the box above to start searching.",
        msgZero: "No products found. Try enabling more filters or change search term.",
        msgTroppi: (n) => `Too many results found (${n}). Use filters to narrow down.`,
        btnEsaurito: "Out of stock",
        btnIndietro: "← Back to Main Menu",
        titoloGuida: "💡 Kitchen Operational Tip",
        testoGuida: "Experience shows it's tough to update inventory in real-time during service due to busy schedules or busy hands.<br><br><strong>Our advice:</strong> jot down items on a notepad or small board during service, then perform a bulk checkout during a break!",
        lblNonMostrare: "Don't show this message again",
        btnInizia: "Got it, let's go",
        titoloConferma: "⚠️ Confirm Change",
        btnAnnulla: "Cancel",
        btnConfermaOk: "Confirm & Update",
        msgTerminato: (nome) => `The product "${nome}" is finished and has been automatically added to the Procurement List!`,
        msgAggiornato: (qta) => `Quantity updated successfully! Remaining: ${qta}`,
        messaggioConferma: (qta, nome) => `You are about to record the consumption of ${qta} units of "${nome}". Proceed?`,
        helpGenerale: "This screen allows quick inventory checkout during kitchen operations.",
        helpRicerca: "Use the search bar and toggle filters by name, category, or location.",
        helpRisultati: "Click '-1' to decrement stock, or 'Out of stock' to zero it out and flag it for restocking."
    },
    es: {
        titoloPagina: "Descarga y Consumo",
        labelCerca: "🔍 Buscar Producto",
        placeholderCerca: "Ej. harina, mozzarella, aceite...",
        lblNome: "Nombre", lblCat: "Categoría", lblUbi: "Ubicación",
        titoloRisultati: "Resultados Almacén",
        msgIniziale: "Escribe algo en la casilla superior para comenzar la búsqueda.",
        msgZero: "No se encontraron productos.",
        msgTroppi: (n) => `Demasiados resultados (${n}).`,
        btnEsaurito: "Agotado",
        btnIndietro: "← Volver al Menú",
        titoloGuida: "💡 Consejo Operativo",
        testoGuida: "Durante el servicio es difícil actualizar el programa en tiempo real.<br><br><strong>Nuestro consejo:</strong> apunta los consumos en una libreta o pizarrita y haz la descarga en lote en un momento de pausa.",
        lblNonMostrare: "No volver a mostrar este aviso",
        btnInizia: "Entendido",
        titoloConferma: "⚠️ Confirmar",
        btnAnnulla: "Cancelar",
        btnConfermaOk: "Confirmar y Actualizar",
        msgTerminato: (nome) => `¡El producto "${nome}" se terminó y se añadió a la Lista de Compras!`,
        msgAggiornato: (qta) => `¡Cantidad actualizada! Restantes: ${qta}`,
        messaggioConferma: (qta, nome) => `Vas a registrar el consumo de ${qta} unidades de "${nome}". ¿Continuar?`,
        helpGenerale: "Pantalla para la descarga rápida de stock.",
        helpRicerca: "Filtra por nombre, categoría o ubicación.",
        helpRisultati: "Usa los botones para restar cantidades o agotar el producto."
    },
    fr: {
        titoloPagina: "Sortie et Consommation",
        labelCerca: "🔍 Rechercher un produit",
        placeholderCerca: "Ex. farine, mozzarella, huile...",
        lblNome: "Nom", lblCat: "Catégorie", lblUbi: "Emplacement",
        titoloRisultati: "Résultats Entrepôt",
        msgIniziale: "Tapez quelque chose pour lancer la recherche.",
        msgZero: "Aucun produit trouvé.",
        msgTroppi: (n) => `Trop de résultats (${n}).`,
        btnEsaurito: "Épuisé",
        btnIndietro: "← Retour au Menu",
        titoloGuida: "💡 Conseil Opérationnel",
        testoGuida: "Il est difficile de mettre à jour le logiciel en temps réel pendant le service.<br><br><strong>Notre conseil :</strong> notez les articles sur un carnet et effectuez la sortie en une seule fois lors d'une pause.",
        lblNonMostrare: "Ne plus afficher cet avertissement",
        btnInizia: "Compris",
        titoloConferma: "⚠️ Confirmer",
        btnAnnulla: "Annuler",
        btnConfermaOk: "Confirmer",
        msgTerminato: (nome) => `Le produit "${nome}" est épuisé et ajouté aux approvisionnements !`,
        msgAggiornato: (qta) => `Quantité mise à jour ! Restants : ${qta}`,
        messaggioConferma: (qta, nome) => `Enregistrer la consommation de ${qta} unités de "${nome}" ?`,
        helpGenerale: "Écran de sortie rapide des stocks.",
        helpRicerca: "Filtrez par nom, catégorie ou emplacement.",
        helpRisultati: "Modifiez ou épuisez les articles rapidement."
    },
    de: {
        titoloPagina: "Ausbuchung & Verbrauch",
        labelCerca: "🔍 Produkt suchen",
        placeholderCerca: "Z.B. Mehl, Mozzarella, Öl...",
        lblNome: "Name", lblCat: "Kategorie", lblUbi: "Standort",
        titoloRisultati: "Lagerergebnisse",
        msgIniziale: "Geben Sie oben etwas ein, um zu suchen.",
        msgZero: "Keine Produkte gefunden.",
        msgTroppi: (n) => `Zu viele Ergebnisse (${n}).`,
        btnEsaurito: "Aufgebraucht",
        btnIndietro: "← Zum Menü",
        titoloGuida: "💡 Praxistipp für die Küche",
        testoGuida: "Während des Service ist es oft schwer, das System in Echtzeit zu aktualisieren.<br><br><strong>Unser Tipp:</strong> Notieren Sie verbrauchte Artikel auf einem Notizblock oder einer Tafel und buchen Sie diese in einer ruhigen Phase gemeinsam aus!",
        lblNonMostrare: "Diesen Hinweis nicht mehr anzeigen",
        btnInizia: "Verstanden",
        titoloConferma: "⚠️ Bestätigen",
        btnAnnulla: "Abbrechen",
        btnConfermaOk: "Bestätigen",
        msgTerminato: (nome) => `Das Produkt "${nome}" ist leer und wurde zur Beschaffungsliste hinzugefügt!`,
        msgAggiornato: (qta) => `Menge aktualisiert! Rest: ${qta}`,
        messaggioConferma: (qta, nome) => `Verbrauch von ${qta} Einheiten von "${nome}" erfassen?`,
        helpGenerale: "Bildschirm zur schnellen Bestandsausbuchung.",
        helpRicerca: "Nach Name, Kategorie oder Standort filtern.",
        helpRisultati: "Mengen anpassen oder Artikel als aufgebraucht markieren."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    linguaCorrente = localStorage.getItem('eat_lang') || 'it';
    const select = document.getElementById('selettore-lingua');
    if (select) select.value = linguaCorrente;
    
    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {};
    if (db.dispensa && Array.isArray(db.dispensa)) {
        prodottiDispensa = db.dispensa;
    } else {
        salvaStatoDispensa();
    }
    
    applicaTraduzioniTesti();

    // Controlla se l'utente aveva scelto di non mostrare più il popup iniziale
    if (localStorage.getItem('chefstock_nascondi_guida_scarico') === 'true') {
        document.getElementById('modal-guida-iniziale').style.display = 'none';
    }
});

function cambiaLingua(nuovaLingua) {
    linguaCorrente = nuovaLingua;
    localStorage.setItem('eat_lang', nuovaLingua);
    applicaTraduzioniTesti();
    gestisciRicerca();
}

function applicaTraduzioniTesti() {
    const t = dizionarioScarico[linguaCorrente] || dizionarioScarico.it;
    
    document.getElementById('titolo-pagina').textContent = t.titoloPagina;
    document.getElementById('label-cerca').textContent = t.labelCerca;
    document.getElementById('input-ricerca').placeholder = t.placeholderCerca;
    document.getElementById('lbl-nome').textContent = t.lblNome;
    document.getElementById('lbl-cat').textContent = t.lblCat;
    document.getElementById('lbl-ubi').textContent = t.lblUbi;
    document.getElementById('titolo-risultati').textContent = t.titoloRisultati;
    document.getElementById('btn-indietro').textContent = t.btnIndietro;
    
    document.getElementById('guida-titolo').textContent = t.titoloGuida;
    document.getElementById('guida-testo').innerHTML = t.testoGuida;
    document.getElementById('lbl-non-mostrare').textContent = t.lblNonMostrare;
    document.getElementById('guida-btn').textContent = t.btnInizia;
    
    document.getElementById('conferma-titolo').textContent = t.confermaTitolo || "⚠️ Conferma Variazione";
    document.getElementById('btn-annulla').textContent = t.btnAnnulla;
    document.getElementById('btn-conferma-ok').textContent = t.btnConfermaOk;

    const msgIniziale = document.getElementById('msg-iniziale');
    if (msgIniziale && msgIniziale.classList.contains('empty-message') && !document.getElementById('input-ricerca').value) {
        msgIniziale.textContent = t.msgIniziale;
    }
}

function chiudiGuidaIniziale() {
    const checkboxNascondi = document.getElementById('chk-non-mostrare');
    if (checkboxNascondi && checkboxNascondi.checked) {
        localStorage.setItem('chefstock_nascondi_guida_scarico', 'true');
    }
    document.getElementById('modal-guida-iniziale').style.display = 'none';
}

function apriInfoHelp(tipo) {
    const t = dizionarioScarico[linguaCorrente] || dizionarioScarico.it;
    let testo = t.helpGenerale;
    if (tipo === 'ricerca') testo = t.helpRicerca;
    if (tipo === 'risultati') testo = t.helpRisultati;

    document.getElementById('info-help-testo').textContent = testo;
    document.getElementById('modal-info-help').style.display = 'flex';
}

function chiudiInfoHelp() {
    document.getElementById('modal-info-help').style.display = 'none';
}

function gestisciRicerca() {
    const t = dizionarioScarico[linguaCorrente] || dizionarioScarico.it;
    const query = document.getElementById('input-ricerca').value.toLowerCase().trim();
    const usaNome = document.getElementById('chk-nome').checked;
    const usaCategoria = document.getElementById('chk-categoria').checked;
    const usaUbicazione = document.getElementById('chk-ubicazione').checked;
    
    const container = document.getElementById('lista-risultati');

    if (!query) {
        container.innerHTML = `<p class="empty-message" id="msg-iniziale">${t.msgIniziale}</p>`;
        return;
    }

    const risultati = prodottiDispensa.filter(p => {
        let match = false;
        if (usaNome && p.nome.toLowerCase().includes(query)) match = true;
        if (usaCategoria && (p.reparto || p.categoria || '').toLowerCase().includes(query)) match = true;
        if (usaUbicazione && (p.ubicazione || '').toLowerCase().includes(query)) match = true;
        return match;
    });

    if (risultati.length === 0) {
        container.innerHTML = `<p class="empty-message" style="color: #f85149;">${t.msgZero}</p>`;
    } else if (risultati.length > 10) {
        container.innerHTML = `<p class="empty-message" style="color: #eab308;">${t.msgTroppi(risultati.length)}</p>`;
    } else {
        container.innerHTML = risultati.map(p => `
            <div class="product-item">
                <div class="product-info">
                    <h4>${p.nome}</h4>
                    <span>📍 ${p.ubicazione || 'Magazzino'} | 🏷️ ${p.reparto || p.categoria || 'Generale'} | Disp: <strong>${p.quantita} ${p.unita || 'pz'}</strong></span>
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="chiediScarico(${p.id}, 1)">-1</button>
                    <button class="btn-primary" style="background-color: #ef4444;" onclick="chiediScarico(${p.id}, ${p.quantita})">${t.btnEsaurito}</button>
                </div>
            </div>
        `).join('');
    }
}

function chiediScarico(idProdotto, qtaDaScaricare) {
    const t = dizionarioScarico[linguaCorrente] || dizionarioScarico.it;
    const prodotto = prodottiDispensa.find(p => p.id === idProdotto);
    if (!prodotto) return;

    operazioneInSospeso = { id: idProdotto, qta: qtaDaScaricare };
    
    document.getElementById('testo-conferma').textContent = t.messaggioConferma(qtaDaScaricare, prodotto.nome);
    document.getElementById('modal-conferma').style.display = 'flex';
}

function chiudiConferma(confermato) {
    const t = dizionarioScarico[linguaCorrente] || dizionarioScarico.it;
    document.getElementById('modal-conferma').style.display = 'none';
    
    if (confermato && operazioneInSospeso) {
        const prodotto = prodottiDispensa.find(p => p.id === operazioneInSospeso.id);
        if (prodotto) {
            prodotto.quantita = Math.max(0, prodotto.quantita - operazioneInSospeso.qta);
            if (prodotto.quantita === 0) {
                prodotto.stato = 'esaurito';
            }
            
            salvaStatoDispensa();
            
            if (prodotto.quantita === 0) {
                alert(t.msgTerminato(prodotto.nome));
            } else {
                alert(t.msgAggiornato(prodotto.quantita));
            }
            
            gestisciRicerca();
        }
    }
    operazioneInSospeso = null;
}

function tornaAlMenu() {
    window.location.href = 'menu.html';
}