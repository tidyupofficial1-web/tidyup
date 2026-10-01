let prodottiDispensa = [
    { id: 1, nome: "Burro Parmalat 250g", categoria: "Latticini", ubicazione: "Frigo", quantita: 2 },
    { id: 2, nome: "Latte Intero 1L", categoria: "Latticini", ubicazione: "Frigo", quantita: 1 },
    { id: 3, nome: "Passata di Pomodoro", categoria: "Scatolame", ubicazione: "Dispensa", quantita: 3 }
];

let operazioneInSospeso = null;
let linguaCorrente = localStorage.getItem('eat_me_first_lang') || 'it';

// Dizionario completo per le 5 lingue (it, en, es, fr, de)
const dizionarioScarico = {
    it: {
        titoloPagina: "Scarico e Consumo",
        labelCerca: "🔍 Cerca Prodotto",
        placeholderCerca: "Es. burro, pasta, pomodori...",
        lblNome: "Nome", lblCat: "Categoria", lblUbi: "Ubicazione",
        titoloRisultati: "Risultati Dispensa",
        msgIniziale: "Digita qualcosa nella casella sopra per iniziare la ricerca.",
        msgZero: "Nessun prodotto trovato. Prova ad attivare più filtri o cambia termine.",
        msgTroppi: (n) => `Troppi risultati trovati (${n}). Usa le spunte per restringere il campo.`,
        btnEsaurito: "Esaurito",
        btnIndietro: "← Torna al Menu Principale",
        titoloGuida: "📖 Come funziona lo Scarico",
        testoGuida: "Scrivi liberamente il nome del prodotto che desideri scaricare (es. 'burro'). Se ottieni troppi risultati o zero, usa le spunte di Categoria o Ubicazione. Ogni modifica viene confermata subito!",
        btnInizia: "Inizia a Usare",
        titoloConferma: "⚠️ Conferma Variazione",
        btnAnnulla: "Annulla",
        btnConfermaOk: "Conferma e Aggiorna",
        msgTerminato: (nome) => `Il prodotto "${nome}" è terminato ed è stato aggiunto automaticamente alla Lista della Spesa!`,
        msgAggiornato: (qta) => `Quantità aggiornata con successo! Rimanenti: ${qta}`,
        messaggioConferma: (qta, nome) => `Stai per registrare il consumo di ${qta} pz di "${nome}". L'operazione aggiornerà subito la dispensa e sposterà l'articolo nella lista spesa se esaurito. Procedere?`
    },
    en: {
        titoloPagina: "Checkout & Consumption",
        labelCerca: "🔍 Search Product",
        placeholderCerca: "E.g., butter, pasta, tomatoes...",
        lblNome: "Name", lblCat: "Category", lblUbi: "Location",
        titoloRisultati: "Pantry Results",
        msgIniziale: "Type something in the box above to start searching.",
        msgZero: "No products found. Try enabling more filters or change search term.",
        msgTroppi: (n) => `Too many results found (${n}). Use filters to narrow down.`,
        btnEsaurito: "Out of stock",
        btnIndietro: "← Back to Main Menu",
        titoloGuida: "📖 How Checkout Works",
        testoGuida: "Freely type the product name (e.g., 'butter'). If you get too many or zero results, use Category or Location filters. Every change is confirmed instantly!",
        btnInizia: "Start Using",
        titoloConferma: "⚠️ Confirm Change",
        btnAnnulla: "Cancel",
        btnConfermaOk: "Confirm & Update",
        msgTerminato: (nome) => `The product "${nome}" is finished and has been automatically added to the Shopping List!`,
        msgAggiornato: (qta) => `Quantity updated successfully! Remaining: ${qta}`,
        messaggioConferma: (qta, nome) => `You are about to record the consumption of ${qta} pcs of "${nome}". Proceed?`
    },
    es: {
        titoloPagina: "Descarga y Consumo",
        labelCerca: "🔍 Buscar Producto",
        placeholderCerca: "Ej. mantequilla, pasta, tomates...",
        lblNome: "Nombre", lblCat: "Categoría", lblUbi: "Ubicación",
        titoloRisultati: "Resultados Despensa",
        msgIniziale: "Escribe algo en la casilla superior para comenzar la búsqueda.",
        msgZero: "No se encontraron productos. Intenta activar más filtros.",
        msgTroppi: (n) => `Demasiados resultados (${n}). Usa los filtros para acotar.`,
        btnEsaurito: "Agotado",
        btnIndietro: "← Volver al Menú Principal",
        titoloGuida: "📖 Cómo funciona la Descarga",
        testoGuida: "Escribe libremente el nombre del producto. Si hay muchos o ningún resultado, usa los filtros. ¡Cada cambio se confirma al instante!",
        btnInizia: "Empezar",
        titoloConferma: "⚠️ Confirmar Cambio",
        btnAnnulla: "Cancelar",
        btnConfermaOk: "Confirmar y Actualizar",
        msgTerminato: (nome) => `¡El producto "${nome}" se ha terminado y se añadió a la Lista de Compras!`,
        msgAggiornato: (qta) => `¡Cantidad actualizada con éxito! Restantes: ${qta}`,
        messaggioConferma: (qta, nome) => `Estás a punto de registrar el consumo de ${qta} pzas de "${nome}". ¿Continuar?`
    },
    fr: {
        titoloPagina: "Sortie et Consommation",
        labelCerca: "🔍 Rechercher un produit",
        placeholderCerca: "Ex. beurre, pâtes, tomates...",
        lblNome: "Nom", lblCat: "Catégorie", lblUbi: "Emplacement",
        titoloRisultati: "Résultats du Garde-manger",
        msgIniziale: "Tapez quelque chose dans la case ci-dessus pour lancer la recherche.",
        msgZero: "Aucun produit trouvé. Essayez d'activer plus de filtres.",
        msgTroppi: (n) => `Trop de résultats (${n}). Utilisez les filtres.`,
        btnEsaurito: "Épuisé",
        btnIndietro: "← Retour au Menu Principal",
        titoloGuida: "📖 Comment fonctionne la Sortie",
        testoGuida: "Tapez le nom du produit. Utilisez les filtres si nécessaire. Chaque modification est confirmée instantanément !",
        btnInizia: "Commencer",
        titoloConferma: "⚠️️ Confirmer",
        btnAnnulla: "Annuler",
        btnConfermaOk: "Confirmer et Mettre à jour",
        msgTerminato: (nome) => `Le produit "${nome}" est épuisé et a été ajouté à la liste de courses !`,
        msgAggiornato: (qta) => `Quantité mise à jour ! Restants : ${qta}`,
        messaggioConferma: (qta, nome) => `Vous êtes sur le point d'enregistrer la consommation de ${qta} pcs de "${nome}". Procéder ?`
    },
    de: {
        titoloPagina: "Ausbuchung & Verbrauch",
        labelCerca: "🔍 Produkt suchen",
        placeholderCerca: "Z.B. Butter, Nudeln, Tomaten...",
        lblNome: "Name", lblCat: "Kategorie", lblUbi: "Standort",
        titoloRisultati: "Vorratskammer Ergebnisse",
        msgIniziale: "Geben Sie oben etwas ein, um die Suche zu starten.",
        msgZero: "Keine Produkte gefunden. Aktivieren Sie ggf. Filter.",
        msgTroppi: (n) => `Zu viele Ergebnisse (${n}). Nutzen Sie die Filter.`,
        btnEsaurito: "Aufgebraucht",
        btnIndietro: "← Zurück zum Hauptmenü",
        titoloGuida: "📖 So funktioniert die Ausbuchung",
        testoGuida: "Geben Sie den Produktnamen ein. Nutzen Sie bei Bedarf Filter. Jede Änderung wird sofort bestätigt!",
        btnInizia: "Loslegen",
        titoloConferma: "⚠️ Änderung bestätigen",
        btnAnnulla: "Abbrechen",
        btnConfermaOk: "Bestätigen & Aktualisieren",
        msgTerminato: (nome) => `Das Produkt "${nome}" ist aufgebraucht und wurde zur Einkaufsliste hinzugefügt!`,
        msgAggiornato: (qta) => `Menge erfolgreich aktualisiert! Verbleibend: ${qta}`,
        messaggioConferma: (qta, nome) => `Möchten Sie den Verbrauch von ${qta} Stk. von "${nome}" erfassen?`
    }
};

document.addEventListener('DOMContentLoaded', () => {
    linguaCorrente = localStorage.getItem('eat_me_first_lang') || 'it';
    const select = document.getElementById('selettore-lingua');
    if (select) select.value = linguaCorrente;
    applicaTraduzioniTesti();
});

function cambiaLingua(nuovaLingua) {
    linguaCorrente = nuovaLingua;
    localStorage.setItem('eat_me_first_lang', nuovaLingua);
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
    document.getElementById('guida-testo').textContent = t.testoGuida;
    document.getElementById('guida-btn').textContent = t.btnInizia;
    
    document.getElementById('conferma-titolo').textContent = t.titoloConferma;
    document.getElementById('btn-annulla').textContent = t.btnAnnulla;
    document.getElementById('btn-conferma-ok').textContent = t.btnConfermaOk;

    const msgIniziale = document.getElementById('msg-iniziale');
    if (msgIniziale && msgIniziale.classList.contains('empty-message') && !document.getElementById('input-ricerca').value) {
        msgIniziale.textContent = t.msgIniziale;
    }
}

function chiudiGuidaIniziale() {
    document.getElementById('modal-guida-iniziale').style.display = 'none';
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
        if (usaCategoria && p.categoria.toLowerCase().includes(query)) match = true;
        if (usaUbicazione && p.ubicazione.toLowerCase().includes(query)) match = true;
        return match;
    });

    if (risultati.length === 0) {
        container.innerHTML = `<p class="empty-message" style="color: #da3633;">${t.msgZero}</p>`;
    } else if (risultati.length > 10) {
        container.innerHTML = `<p class="empty-message" style="color: #d29922;">${t.msgTroppi(risultati.length)}</p>`;
    } else {
        container.innerHTML = risultati.map(p => `
            <div class="product-item">
                <div class="product-info">
                    <h4>${p.nome}</h4>
                    <span>📍 ${p.ubicazione} | 🏷️ ${p.categoria} | Disp: <strong>${p.quantita}</strong></span>
                </div>
                <div class="product-actions">
                    <button class="btn-primary" onclick="chiediScarico(${p.id}, 1)">-1</button>
                    <button class="btn-primary" style="background-color: #da3633;" onclick="chiediScarico(${p.id}, ${p.quantita})">${t.btnEsaurito}</button>
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
    window.location.href = 'index.html';
}