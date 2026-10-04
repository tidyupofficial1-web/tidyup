const dizionarioGlobale = {
    it: {
        titolo_app: "ChefStock",
        suite: "Suite",
        sec_dispensa: "Gestione Dispensa",
        sec_spesa: "Gestione Spesa",
        sec_utilita: "Agenda & Utility",
        carico: "Carico Articolo",
        scarico: "Scarico Prodotti",
        dispensa: "Visualizza Dispensa",
        spesa_lista: "Lista della Spesa",
        spesa_comperare: "Articoli da comperare",
        agenda: "Agenda Scadenze (30 Giorni)",
        ricordarsi: "Ricordarsi di...",
        pop_titolo: "Nuovi Appunti nel Block Notes!",
        pop_testo: "Ci sono promemoria o note inserite in \"Ricordarsi di...\" in attesa di lettura.",
        pop_chiudi: "Ho capito",
        pop_apri: "Vai a Ricordarsi di...",
        footer: "ChefStock &bull; Gestione locale sicura",
        lbl_suite_domestica: "Gestione Domestica / Famiglia",
        lnk_switch_eat: "Hai anche la versione per casa? Apri EatMeFirst &rarr;"
    },
    en: {
        titolo_app: "ChefStock",
        suite: "Suite",
        sec_dispensa: "Pantry Management",
        sec_spesa: "Shopping Management",
        sec_utilita: "Agenda & Utilities",
        carico: "Load Item",
        scarico: "Unload Products",
        dispensa: "View Pantry",
        spesa_lista: "Shopping List",
        spesa_comperare: "Items to buy",
        agenda: "Expiration Agenda (30 Days)",
        ricordarsi: "Remember to...",
        pop_titolo: "New Notes in Block Notes!",
        pop_testo: "There are reminders or notes in \"Remember to...\" waiting to be read.",
        pop_chiudi: "Got it",
        pop_apri: "Go to Remember to...",
        footer: "ChefStock &bull; Secure local management",
        lbl_suite_domestica: "Home / Family Management",
        lnk_switch_eat: "Have a home version too? Open EatMeFirst &rarr;"
    },
    es: {
        titolo_app: "ChefStock",
        suite: "Suite",
        sec_dispensa: "Gestión de Despensa",
        sec_spesa: "Gestión de Compras",
        sec_utilita: "Agenda y Utilidades",
        carico: "Cargar Artículo",
        scarico: "Descargar Productos",
        dispensa: "Ver Despensa",
        spesa_lista: "Lista de Compras",
        spesa_comperare: "Artículos para comprar",
        agenda: "Agenda de Vencimientos (30 Días)",
        ricordarsi: "Recordar que...",
        pop_titolo: "¡Nuevas notas en el Block de Notas!",
        pop_testo: "Hay recordatorios o notas en \"Recordar que...\" esperando ser leídos.",
        pop_chiudi: "Entendido",
        pop_apri: "Ir a Recordar que...",
        footer: "ChefStock &bull; Gestión local segura",
        lbl_suite_domestica: "Gestión Doméstica / Familiar",
        lnk_switch_eat: "¿Tienes versión para casa? Abre EatMeFirst &rarr;"
    },
    fr: {
        titolo_app: "ChefStock",
        suite: "Suite",
        sec_dispensa: "Gestion du Garde-manger",
        sec_spesa: "Gestion des Courses",
        sec_utilita: "Agenda & Utilitaires",
        carico: "Charger Article",
        scarico: "Décharger Produits",
        dispensa: "Voir le Garde-manger",
        spesa_lista: "Liste de Courses",
        spesa_comperare: "Articles à acheter",
        agenda: "Agenda des Échéances (30 Jours)",
        ricordarsi: "Se rappeler de...",
        pop_titolo: "Nouvelles notes dans le Bloc-notes !",
        pop_testo: "Il y a des rappels ou des notes dans \"Se rappeler de...\" en attente de lecture.",
        pop_chiudi: "Compris",
        pop_apri: "Aller à Se rappeler de...",
        footer: "ChefStock &bull; Gestion locale sécurisée",
        lbl_suite_domestica: "Gestion Domestique / Famille",
        lnk_switch_eat: "Vous avez aussi une version maison ? Ouvrez EatMeFirst &rarr;"
    },
    de: {
        titolo_app: "ChefStock",
        suite: "Suite",
        sec_dispensa: "Vorratsverwaltung",
        sec_spesa: "Einkaufsverwaltung",
        sec_utilita: "Agenda & Werkzeuge",
        carico: "Artikel Laden",
        scarico: "Produkte Entladen",
        dispensa: "Vorratskammer Ansehen",
        spesa_lista: "Einkaufsliste",
        spesa_comperare: "Artikel zu kaufen",
        agenda: "Ablaufkalender (30 Tage)",
        ricordarsi: "Erinnern an...",
        pop_titolo: "Neue Notizen im Block!",
        pop_testo: "Es gibt Erinnerungen oder Notizen in \"Erinnern an...\", die darauf warten, gelesen zu werden.",
        pop_chiudi: "Verstanden",
        pop_apri: "Zu Erinnern an... gehen",
        footer: "ChefStock &bull; Sichere lokale Verwaltung",
        lbl_suite_domestica: "Haushalts- / Familienverwaltung",
        lnk_switch_eat: "Auch eine Heimversion? EatMeFirst öffnen &rarr;"
    }
};

function cambiaLingua(lang) {
    localStorage.setItem('chef_stock_lang', lang);
    const traduzioni = dizionarioGlobale[lang] || dizionarioGlobale['it'];

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const chiave = element.getAttribute('data-i18n');
        if (traduzioni[chiave]) {
            element.innerHTML = traduzioni[chiave];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    gestisciIntroVideo();

    const langSalvata = localStorage.getItem('chef_stock_lang') || 'it';
    const selectLang = document.getElementById('select-lingua');
    if (selectLang) {
        selectLang.value = langSalvata;
    }
    cambiaLingua(langSalvata);

    let db = JSON.parse(localStorage.getItem('chef_stock_db')) || { note: [] };
    let haNoteNonLette = db.note && db.note.some(n => n.letto === false);
    
    if (haNoteNonLette) {
        const btnNotes = document.getElementById('btn-block-notes');
        if(btnNotes) btnNotes.classList.add('blinking-btn');
        const popNotif = document.getElementById('popup-notifica');
        if(popNotif) popNotif.style.display = 'flex';
    }
});

function gestisciIntroVideo() {
    const oggi = new Date().toISOString().slice(0, 10);
    const ultimaRiproduzione = localStorage.getItem('chefstock_intro_last_date');
    const overlay = document.getElementById('intro-overlay');
    const video = document.getElementById('intro-video');

    if (ultimaRiproduzione !== oggi) {
        if (overlay) overlay.style.display = 'flex';
        
        if (video) {
            video.play().catch(e => {
                console.log("Autoplay bloccato dal browser:", e);
            });

            video.onended = () => {
                chiudiIntroVideo();
            };
        }
    } else {
        if (overlay) {
            overlay.remove();
        }
    }
}

function chiudiIntroVideo() {
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            overlay.remove();
        }, 500);
    }
    const oggi = new Date().toISOString().slice(0, 10);
    localStorage.setItem('chefstock_intro_last_date', oggi);
}

function toggleMenu() {
    const menu = document.getElementById('side-menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

function esportaDatabase() {
    let db = JSON.parse(localStorage.getItem('chef_stock_db')) || {};
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `chef_stock_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

function avviaDetonatore() {
    if(confirm("ATTENZIONE: Stai per attivare il sistema di svuotamento totale della dispensa. Vuoi procedere?")) {
        alert("Qui collegheremo la sequenza video del detonatore che abbiamo progettato!");
    }
}

function chiudiPopupNotifica() {
    const pop = document.getElementById('popup-notifica');
    if(pop) pop.style.display = 'none';
}

function apriBlockNotes() {
    window.location.href = 'mia_lista.html';
}