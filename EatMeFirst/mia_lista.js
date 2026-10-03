document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('eat_me_first_lang') || 'it';
    const langSelect = document.getElementById('lingua-select');
    if (langSelect) langSelect.value = savedLang;
    
    applicaTraduzioniLista(savedLang);
    inizializzaDati();
});

function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    applicaTraduzioniLista(lang);
    renderizzaNote();
}

let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {
    dispensa: [],
    note: []
};

const dizionarioLista = {
    it: {
        lista_title: "Ricordarsi di",
        badge_premium_funzione: "🌟 Funzione Premium Protetta",
        popup_lista_title: "Guida Rapida: Ricordarsi di",
        popup_lista_desc1: "Questa sezione è il tuo spazio di appoggio rapido fuori casa o per promemoria non legati direttamente alla dispensa fissa.",
        popup_lista_es_titolo: "Cosa puoi farci (Esempi pratici):",
        popup_lista_es1: "Commissioni al volo: Annotare \"Passare in farmacia a ritirare la prescrizione\" oppure \"Prendere le pile stilo al centro commerciale\".",
        popup_lista_es2: "Foto e Volantini: Scattare o allegare la foto di un volantino con le offerte del supermercato o l'etichetta di un prodotto particolare.",
        popup_lista_es3: "Promemoria familiari: Registrare indicazioni al volo lasciate da altri membri della famiglia.",
        popup_lista_gestione: "Come si gestisce: Una volta completata la commissione o l'appuntamento, basta spuntare la casella a sinistra e la nota verrà rimossa automaticamente dall'elenco!",
        btn_ho_capito: "Ho capito, apri il Block Notes",
        card_nuovo_appunto: "Nuovo Appunto o Commissione",
        btn_salva_appunto: "Salva Appunto",
        card_elenco_attivi: "Elenco Appunti Attivi",
        placeholder_input: "Es. Passare in farmacia o ritirare scarpe...",
        nessun_appunto: "Nessun appunto memorizzato.",
        foto_allegate: "foto allegate",
        nota_testuale: "Nota testuale",
        conferma_elimina: "Vuoi rimuovere questo appunto completato?",
        footer_text: "EatMeFirst • Dati locali su dispositivo"
    },
    en: {
        lista_title: "Reminders & Errands",
        badge_premium_funzione: "🌟 Protected Premium Feature",
        popup_lista_title: "Quick Guide: Reminders",
        popup_lista_desc1: "This section is your quick note space away from home or for reminders not directly tied to the permanent pantry.",
        popup_lista_es_titolo: "What you can do (Practical examples):",
        popup_lista_es1: "Quick errands: Write down \"Pick up prescription at the pharmacy\" or \"Get AA batteries at the mall\".",
        popup_lista_es2: "Photos & Flyers: Snap or attach a photo of a supermarket flyer or product label.",
        popup_lista_es3: "Family reminders: Record quick notes left by other family members.",
        popup_lista_gestione: "How it works: Once completed, simply check the box on the left and the note will be automatically removed!",
        btn_ho_capito: "Got it, open Notes",
        card_nuovo_appunto: "New Note or Errand",
        btn_salva_appunto: "Save Note",
        card_elenco_attivi: "Active Notes",
        placeholder_input: "E.g., Pick up dry cleaning...",
        nessun_appunto: "No notes stored.",
        foto_allegate: "attached photos",
        nota_testuale: "Text note",
        conferma_elimina: "Do you want to remove this completed note?",
        footer_text: "EatMeFirst • Local device data"
    },
    fr: {
        lista_title: "Rappels & Courses",
        badge_premium_funzione: "🌟 Fonction Premium Protégée",
        popup_lista_title: "Guide Rapide : Rappels",
        popup_lista_desc1: "Cet espace vous permet de noter rapidement vos commissions ou mémos en dehors du garde-manger.",
        popup_lista_es_titolo: "Exemples pratiques :",
        popup_lista_es1: "Courses rapides : Noter \"Passer à la pharmacie\" ou \"Acheter des piles\".",
        popup_lista_es2: "Photos & Prospectus : Joindre la photo d'un prospectus ou d'une étiquette.",
        popup_lista_es3: "Rappels familiaux : Noter les indications de la famille.",
        popup_lista_gestione: "Gestion : Cochez la case une fois terminé pour supprimer la note.",
        btn_ho_capito: "Compris, ouvrir les notes",
        card_nuovo_appunto: "Nouvelle note ou course",
        btn_salva_appunto: "Enregistrer",
        card_elenco_attivi: "Notes actives",
        placeholder_input: "Ex. Passer à la pharmacie...",
        nessun_appunto: "Aucune note enregistrée.",
        foto_allegate: "photos jointes",
        nota_testuale: "Note textuelle",
        conferma_elimina: "Voulez-vous supprimer cette note complétée ?",
        footer_text: "EatMeFirst • Données locales"
    },
    es: {
        lista_title: "Recordatorios y Mandados",
        badge_premium_funzione: "🌟 Función Premium Protegida",
        popup_lista_title: "Guía Rápida: Recordatorios",
        popup_lista_desc1: "Este es tu espacio para apuntes rápidos fuera de casa o recordatorios fuera de la despensa.",
        popup_lista_es_titolo: "Ejemplos prácticos:",
        popup_lista_es1: "Mandados rápidos: Apuntar \"Ir a la farmacia\" o \"Comprar pilas\".",
        popup_lista_es2: "Fotos y Folletos: Adjuntar foto de un folleto o etiqueta.",
        popup_lista_es3: "Avisos familiares: Apuntar recados de la familia.",
        popup_lista_gestione: "Gestión: Marca la casilla al terminar y la nota se eliminará automáticamente.",
        btn_ho_capito: "Entendido, abrir notas",
        card_nuovo_appunto: "Nuevo apunte o mandado",
        btn_salva_appunto: "Guardar apunte",
        card_elenco_attivi: "Notas activas",
        placeholder_input: "Ej. Ir a la farmacia...",
        nessun_appunto: "Ningún apunte guardado.",
        foto_allegate: "fotos adjuntas",
        nota_testuale: "Nota de texto",
        conferma_elimina: "¿Deseas eliminar este apunte completado?",
        footer_text: "EatMeFirst • Datos locales"
    },
    de: {
        lista_title: "Erinnerungen & Erledigungen",
        badge_premium_funzione: "🌟 Geschützte Premium-Funktion",
        popup_lista_title: "Kurzanleitung: Erinnerungen",
        popup_lista_desc1: "Ihr schneller Notizbereich für unterwegs oder Notizen außerhalb der Speisekammer.",
        popup_lista_es_titolo: "Praktische Beispiele:",
        popup_lista_es1: "Schnelle Erledigungen: Notieren \"Zur Apotheke gehen\" oder \"Batterien kaufen\".",
        popup_lista_es2: "Fotos & Prospekte: Fotos von Prospekten oder Etiketten anhängen.",
        popup_lista_es3: "Familienhinweise: Notizen von Familienmitgliedern festhalten.",
        popup_lista_gestione: "Handhabung: Nach Erledigung einfach das Kästchen ankreuzen, die Notiz wird gelöscht.",
        btn_ho_capito: "Verstanden, Notizen öffnen",
        card_nuovo_appunto: "Neue Notiz oder Erledigung",
        btn_salva_appunto: "Notiz speichern",
        card_elenco_attivi: "Aktive Notizen",
        placeholder_input: "Z.B. Zur Apotheke gehen...",
        nessun_appunto: "Keine Notizen gespeichert.",
        foto_allegate: "angehängte Fotos",
        nota_testuale: "Textnotiz",
        conferma_elimina: "Möchten Sie diese erledigte Notiz entfernen?",
        footer_text: "EatMeFirst • Lokale Daten"
    }
};

function chiudiPopup() {
    const overlay = document.getElementById('popup-overlay');
    if (overlay) overlay.style.display = 'none';
}

function salvaDb() {
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    renderizzaNote();
}

function renderizzaNote() {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioLista[lang] || dizionarioLista['it'];
    
    let htmlNote = '';
    if (db.note && db.note.length > 0) {
        db.note.forEach(n => {
            let infoFoto = (n.foto && n.foto.length > 0) ? `📷 ${n.foto.length} ${t.foto_allegate}` : t.nota_testuale;
            
            htmlNote += `
                <div class="item-row">
                    <input type="checkbox" class="item-checkbox" onclick="eliminaNota(${n.id})" title="${t.conferma_elimina}">
                    <div class="item-info">
                        <div class="item-title">${n.testo}</div>
                        <div class="item-details">${infoFoto}</div>
                    </div>
                </div>`;
        });
    } else {
        htmlNote = `<div class="empty-msg">${t.nessun_appunto}</div>`;
    }
    const listaDiv = document.getElementById('lista-note');
    if (listaDiv) listaDiv.innerHTML = htmlNote;
}

function aggiungiNota(e) {
    e.preventDefault();
    let inputTesto = document.getElementById('nota-testo');
    let testo = inputTesto.value.trim();
    if (!testo) return;

    if (!db.note) db.note = [];

    // Gestione eventuale caricamento foto convertite in DataURL se presenti
    let fileInput = document.getElementById('nota-foto');
    let fotoArray = [];

    if (fileInput && fileInput.files && fileInput.files.length > 0) {
        // Per semplicità e salvataggio locale sicuro, possiamo predisporre la lettura file
        // Qui inseriamo la struttura base pronta
    }

    db.note.push({
        id: Date.now(),
        testo: testo,
        foto: fotoArray,
        letto: false
    });

    salvaDb();
    inputTesto.value = '';
    if (fileInput) fileInput.value = '';
}

function eliminaNota(id) {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioLista[lang] || dizionarioLista['it'];

    if (confirm(t.conferma_elimina)) {
        db.note = db.note.filter(n => n.id !== id);
        salvaDb();
    }
}

function inizializzaDati() {
    if (db.note) {
        db.note.forEach(n => n.letto = true);
        localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    }
    renderizzaNote();
}

function applicaTraduzioniLista(lang) {
    const t = dizionarioLista[lang] || dizionarioLista['it'];
    
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

    const inputTesto = document.getElementById('nota-testo');
    if (inputTesto && t.placeholder_input) {
        inputTesto.placeholder = t.placeholder_input;
    }
}