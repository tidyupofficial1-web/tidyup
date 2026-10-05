let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {
    dispensa: [],
    note: [],
    ricette: []
};

let ricettaSelezionataId = null;

const dizionarioRicette = {
    it: {
        ricette_title: "Ricette & Idee",
        card_nuova_ricetta: "Nuova Ricetta o Idea",
        placeholder_titolo: "Titolo della ricetta o idea...",
        placeholder_testo: "Scrivi qui gli ingredienti e il procedimento...",
        btn_salva_ricetta: "Salva Ricetta",
        card_elenco_ricette: "Elenco Ricette & Idee",
        nessuna_ricetta: "Nessuna ricetta memorizzata.",
        btn_elimina: "Elimina",
        btn_chiudi: "Chiudi",
        conferma_elimina: "Vuoi eliminare questa ricetta?",
        footer_text: "EatMeFirst • Dati locali su dispositivo"
    },
    en: {
        ricette_title: "Recipes & Ideas",
        card_nuova_ricetta: "New Recipe or Idea",
        placeholder_titolo: "Recipe title or idea...",
        placeholder_testo: "Write ingredients and instructions here...",
        btn_salva_ricetta: "Save Recipe",
        card_elenco_ricette: "Recipe & Idea List",
        nessuna_ricetta: "No recipes stored.",
        btn_elimina: "Delete",
        btn_chiudi: "Close",
        conferma_elimina: "Do you want to delete this recipe?",
        footer_text: "EatMeFirst • Local device data"
    },
    fr: {
        ricette_title: "Recettes & Idées",
        card_nuova_ricetta: "Nouvelle Recette ou Idée",
        placeholder_titolo: "Titre de la recette...",
        placeholder_testo: "Écrivez les ingrédients et la préparation ici...",
        btn_salva_ricetta: "Enregistrer",
        card_elenco_ricette: "Liste des Recettes",
        nessuna_ricetta: "Aucune recette enregistrée.",
        btn_elimina: "Supprimer",
        btn_chiudi: "Fermer",
        conferma_elimina: "Voulez-vous supprimer cette recette ?",
        footer_text: "EatMeFirst • Données locales"
    },
    es: {
        ricette_title: "Recetas e Ideas",
        card_nuova_ricetta: "Nueva Receta o Idea",
        placeholder_titolo: "Título de la receta...",
        placeholder_testo: "Escribe aquí los ingredientes y la preparación...",
        btn_salva_ricetta: "Guardar Receta",
        card_elenco_ricette: "Lista de Recetas",
        nessuna_ricetta: "Ninguna receta guardada.",
        btn_elimina: "Eliminar",
        btn_chiudi: "Cerrar",
        conferma_elimina: "¿Deseas eliminar esta receta?",
        footer_text: "EatMeFirst • Datos locales"
    },
    de: {
        ricette_title: "Rezepte & Ideen",
        card_nuova_ricetta: "Neues Rezept oder Idee",
        placeholder_titolo: "Rezepttitel oder Idee...",
        placeholder_testo: "Zutaten und Zubereitung hier schreiben...",
        btn_salva_ricetta: "Rezept speichern",
        card_elenco_ricette: "Rezeptliste",
        nessuna_ricetta: "Keine Rezepte gespeichert.",
        btn_elimina: "Löschen",
        btn_chiudi: "Schließen",
        conferma_elimina: "Möchten Sie dieses Rezept löschen?",
        footer_text: "EatMeFirst • Lokale Daten"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('eat_me_first_lang') || 'it';
    const langSelect = document.getElementById('lingua-select');
    if (langSelect) langSelect.value = savedLang;
    
    applicaTraduzioni(savedLang);
    renderizzaRicette();
});

function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    applicaTraduzioni(lang);
    renderizzaRicette();
}

function applicaTraduzioni(lang) {
    const t = dizionarioRicette[lang] || dizionarioRicette['it'];
    
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

    document.querySelectorAll('[data-placeholder]').forEach(el => {
        const key = el.getAttribute('data-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
}

function salvaDb() {
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));
    renderizzaRicette();
}

function renderizzaRicette() {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioRicette[lang] || dizionarioRicette['it'];
    
    let htmlRicette = '';
    if (db.ricette && db.ricette.length > 0) {
        db.ricette.forEach(r => {
            htmlRicette += `
                <div class="item-row" onclick="apriRicetta(${r.id})">
                    <div class="item-info">
                        <div class="item-title">🍳 ${r.titolo}</div>
                    </div>
                    <span class="arrow-icon">&rarr;</span>
                </div>`;
        });
    } else {
        htmlRicette = `<div class="empty-msg">${t.nessuna_ricetta}</div>`;
    }
    
    const listaDiv = document.getElementById('lista-ricette');
    if (listaDiv) listaDiv.innerHTML = htmlRicette;
}

function aggiungiRicetta(e) {
    e.preventDefault();
    let titoloInput = document.getElementById('ricetta-titolo');
    let testoInput = document.getElementById('ricetta-testo');
    
    let titolo = titoloInput.value.trim();
    let testo = testoInput.value.trim();
    
    if (!titolo || !testo) return;

    if (!db.ricette) db.ricette = [];

    db.ricette.push({
        id: Date.now(),
        titolo: titolo,
        testo: testo
    });

    salvaDb();
    titoloInput.value = '';
    testoInput.value = '';
}

function apriRicetta(id) {
    if (!db.ricette) return;
    let ricetta = db.ricette.find(r => r.id === id);
    if (!ricetta) return;

    ricettaSelezionataId = id;
    document.getElementById('modal-titolo').textContent = ricetta.titolo;
    document.getElementById('modal-testo').textContent = ricetta.testo;
    document.getElementById('modal-dettaglio').style.display = 'flex';
}

function chiudiModal() {
    document.getElementById('modal-dettaglio').style.display = 'none';
    ricettaSelezionataId = null;
}

function eliminaRicettaCorrente() {
    const lang = localStorage.getItem('eat_me_first_lang') || 'it';
    const t = dizionarioRicette[lang] || dizionarioRicette['it'];

    if (ricettaSelezionataId && confirm(t.conferma_elimina)) {
        db.ricette = db.ricette.filter(r => r.id !== ricettaSelezionataId);
        salvaDb();
        chiudiModal();
    }
}