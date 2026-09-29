<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EatMeFirst - Menu Principale</title>
    <!-- Collegamento al file centrale delle lingue -->
    <script src="i18n.js"></script>
    <style>
        :root {
            --bg-color: #0d1117;
            --card-bg: #161b22;
            --border-color: #30363d;
            --text-main: #f0f6fc;
            --text-muted: #8b949e;
            --accent-blue: #58a6ff;
            --accent-green: #238636;
            --accent-danger: #ef4444;
            --accent-warning: #f59e0b;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            padding-bottom: 80px;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        
        header { 
            background: var(--card-bg); 
            color: var(--text-main); 
            padding: 1rem 1.5rem; 
            text-align: center; 
            border-bottom: 1px solid var(--border-color);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
            width: 100%;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .header-logo {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid var(--border-color);
        }

        h1 { font-size: 1.2rem; margin: 0; color: var(--accent-blue); }
        
        /* --- BARRA SUPERIORE / MENU A TENDINA E LINGUA --- */
        .top-bar-controls {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropbtn {
            background-color: var(--card-bg);
            color: var(--text-main);
            padding: 8px 12px;
            font-size: 0.9rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            transition: background-color 0.2s, border-color 0.2s;
        }

        .dropbtn:hover {
            background-color: #21262d;
            border-color: var(--text-muted);
        }

        .dropdown-content {
            display: none;
            position: absolute;
            right: 0;
            background-color: var(--card-bg);
            min-width: 220px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.4);
            z-index: 1;
            overflow: hidden;
            margin-top: 6px;
            text-align: left;
        }

        .dropdown-content a {
            color: var(--text-main);
            padding: 10px 14px;
            text-decoration: none;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 0.9rem;
            transition: background-color 0.2s;
        }

        .dropdown-content a:hover {
            background-color: #21262d;
        }

        .dropdown-logo {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            object-fit: cover;
            border: 1px solid var(--border-color);
        }

        .dropdown:hover .dropdown-content {
            display: block;
        }

        /* Selettore Lingua personalizzato integrato */
        .lang-select {
            background-color: var(--card-bg);
            color: var(--text-main);
            padding: 8px 10px;
            font-size: 0.9rem;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            cursor: pointer;
            outline: none;
        }
        .lang-select:hover {
            border-color: var(--text-muted);
        }

        /* Hamburger Menu Stile */
        .menu-btn-nav { background: none; border: none; color: var(--text-main); font-size: 1.5rem; cursor: pointer; padding: 0 5px; }
        
        #side-menu {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 260px; height: 100%;
            background: var(--card-bg);
            border-right: 1px solid var(--border-color);
            box-shadow: 4px 0 15px rgba(0,0,0,0.4);
            z-index: 1000;
            padding: 20px;
            overflow-y: auto;
            text-align: left;
        }
        .menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 10px; }
        .menu-header h2 { font-size: 1.1rem; color: var(--text-main); }
        .close-menu { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: var(--text-muted); }
        .close-menu:hover { color: var(--text-main); }
        
        .menu-item { display: block; padding: 10px 12px; margin-bottom: 8px; color: var(--text-main); text-decoration: none; border-radius: 6px; font-weight: 500; background: #21262d; transition: background 0.2s; }
        .menu-item:hover { background: #30363d; }
        .menu-item.danger { background: rgba(239, 68, 68, 0.15); color: var(--accent-danger); font-weight: bold; border: 1px solid rgba(239, 68, 68, 0.3); }

        .container { max-width: 500px; width: 100%; margin: 1.5rem auto; padding: 0 1rem; display: flex; flex-direction: column; gap: 0.9rem; }
        
        /* Pulsanti del menu principali */
        .menu-card-btn { 
            background: var(--card-bg); 
            color: var(--text-main); 
            border: 1px solid var(--border-color); 
            border-left: 5px solid var(--accent-blue);
            padding: 1rem 1.2rem; 
            border-radius: 10px; 
            cursor: pointer; 
            font-size: 1.05rem; 
            font-weight: 600; 
            text-align: left; 
            text-decoration: none; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.2); 
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .menu-card-btn:hover { 
            background: #21262d; 
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.3); 
            border-color: var(--text-muted);
        }

        .btn-dispensa { border-left-color: #58a6ff; }
        .btn-spesa { border-left-color: #f59e0b; }
        .btn-note { border-left-color: var(--accent-danger); }
        .btn-statistiche { border-left-color: #a855f7; }

        /* Effetto lampeggiante per notifiche Block Notes */
        @keyframes pulse-blink {
            0% { border-left-color: var(--accent-danger); background-color: rgba(239, 68, 68, 0.05); }
            50% { border-left-color: #b91c1c; background-color: rgba(239, 68, 68, 0.15); }
            100% { border-left-color: var(--accent-danger); background-color: rgba(239, 68, 68, 0.05); }
        }
        .blinking-btn { animation: pulse-blink 1.2s infinite; }

        /* Popup Notifica Nuove Note */
        #popup-notifica { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: none; justify-content: center; align-items: center; z-index: 1000; padding: 1rem; }
        #popup-box { background: var(--card-bg); border: 1px solid var(--border-color); width: 100%; max-width: 400px; padding: 25px 20px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); text-align: center; }
        #popup-box h3 { color: var(--accent-danger); margin-bottom: 10px; font-size: 1.2rem; }
        #popup-box p { font-size: 0.95rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 20px; }
        .popup-actions { display: flex; gap: 10px; }
        .popup-btn { flex: 1; padding: 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; font-size: 0.95rem; transition: opacity 0.2s; }
        .btn-chiudi { background: #21262d; color: var(--text-muted); border: 1px solid var(--border-color); }
        .btn-chiudi:hover { background: #30363d; color: var(--text-main); }
        .btn-apri { background: var(--accent-blue); color: #0d1117; }
        .btn-apri:hover { opacity: 0.85; }

        /* Logo Fisso in basso a destra */
        .fixed-logo {
            position: fixed;
            bottom: 15px;
            right: 15px;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
            z-index: 99;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            object-fit: cover;
        }

        footer {
            color: var(--text-muted);
            font-size: 0.85rem;
            margin-top: auto;
            text-align: center;
        }
    </style>
</head>
<body>

    <header>
        <div class="header-left">
            <button class="menu-btn-nav" onclick="toggleMenu()">☰</button>
            <img src="IMG/logo_1024_white.png" alt="EatMeFirst Logo" class="header-logo">
            <h1>EatMeFirst</h1>
        </div>
        
        <!-- CONTROLLI IN ALTO A DESTRA: MENU SUITE + LINGUA -->
        <div class="top-bar-controls">
            <div class="dropdown">
                <button class="dropbtn">
                    <span>≡ Suite</span>
                </button>
                <div class="dropdown-content">
                    <a href="../index.html">
                        <img src="../IMG/logo_tidyup.png" alt="TidyUp Logo" class="dropdown-logo">
                        Home TidyUp Suite
                    </a>
                    <a href="index.html">
                        <img src="IMG/logo_1024_white.png" alt="EatMeFirst Logo" class="dropdown-logo">
                        EatMeFirst
                    </a>
                    <a href="../NO_FOOD/index.html">
                        <img src="../NO_FOOD/IMG/logo_sortout.png" alt="SortOut Logo" class="dropdown-logo">
                        SortOut
                    </a>
                </div>
            </div>
            <!-- Selettore delle 5 lingue -->
            <div id="header-lang">
                <select id="select-lingua" class="lang-select" onchange="cambiaLinguaLocale(this.value)">
                    <option value="it">🇮🇹 IT</option>
                    <option value="en">🇬🇧 EN</option>
                    <option value="es">🇪🇸 ES</option>
                    <option value="fr">🇫🇷 FR</option>
                    <option value="de">🇩🇪 DE</option>
                </select>
            </div>
        </div>
    </header>

    <!-- Menu a scomparsa (Hamburger) -->
    <div id="side-menu">
        <div class="menu-header">
            <h2>Menu EatMeFirst</h2>
            <button class="close-menu" onclick="toggleMenu()">✕</button>
        </div>
        <a href="menu.html" class="menu-item" style="background: #30363d; color: var(--accent-blue);">🏠 Plancia Principale</a>
        <a href="dispensa.html" class="menu-item">📦 Dispensa e Frigorifero</a>
        <a href="liste.html" class="menu-item">🛒 Lista della Spesa</a>
        <a href="statistiche.html" class="menu-item">📅 Agenda Scadenze</a>
        <a href="mia_lista.html" class="menu-item">💭 Ricordarsi di...</a>
        
        <div style="margin: 15px 0 10px 0; font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); font-weight: bold;">Impostazioni & Dati</div>
        <a href="#" onclick="esportaDatabase()" class="menu-item">💾 Scarica Backup Database</a>
        <a href="#" onclick="avviaDetonatore()" class="menu-item danger">💣 Svuota Intera Dispensa</a>
    </div>

    <div class="container">
        <!-- Funzioni Storiche della Dispensa -->
        <a href="carico.html" class="menu-card-btn btn-dispensa">📦 Carico Articolo</a>
        <a href="scarico.html" class="menu-card-btn btn-dispensa">📤 Scarico Prodotti</a>
        <a href="dispensa.html" class="menu-card-btn btn-dispensa">📋 Visualizza Dispensa</a>

        <!-- Sezioni Spesa e Note -->
        <a href="liste.html" class="menu-card-btn btn-spesa">🛒 Lista della Spesa</a>
        <a href="spesa.html" class="menu-card-btn btn-spesa">🛍️ Articoli da comperare</a>
        <a href="statistiche.html" class="menu-card-btn btn-statistiche">📅 Agenda Scadenze (30 Giorni)</a>
        <a href="mia_lista.html" id="btn-block-notes" class="menu-card-btn btn-note">💭 Ricordarsi di...</a>
    </div>

    <!-- Logo fisso in basso a destra -->
    <img src="IMG/logo_1024_white.png" alt="Logo EatMeFirst" class="fixed-logo">

    <!-- Popup Notifica Nuove Note -->
    <div id="popup-notifica">
        <div id="popup-box">
            <h3>Nuovi Appunti nel Block Notes!</h3>
            <p>Ci sono promemoria o note inserite in "Ricordarsi di..." in attesa di lettura.</p>
            <div class="popup-actions">
                <button class="popup-btn btn-chiudi" onclick="chiudiPopupNotifica()">Ho capito</button>
                <button class="popup-btn btn-apri" onclick="apriBlockNotes()">Vai a Ricordarsi di...</button>
            </div>
        </div>
    </div>

    <footer id="txt-footer" style="margin-top: 40px;">
        EatMeFirst &bull; Gestione locale sicura
    </footer>

    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Sincronizza il selettore con la lingua attualmente salvata
            const langSalvata = localStorage.getItem('eat_me_first_lang') || 'it';
            const sel = document.getElementById('select-lingua');
            if(sel) sel.value = langSalvata;

            applicaTraduzioniFooter();

            let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { note: [] };
            let haNoteNonLette = db.note && db.note.some(n => n.letto === false);
            
            if (haNoteNonLette) {
                const btnNotes = document.getElementById('btn-block-notes');
                if(btnNotes) btnNotes.classList.add('blinking-btn');
                const popNotif = document.getElementById('popup-notifica');
                if(popNotif) popNotif.style.display = 'flex';
            }
        });

        function cambiaLinguaLocale(nuovaLingua) {
            localStorage.setItem('eat_me_first_lang', nuovaLingua);
            // Se nel file i18n.js è definita una funzione globale di aggiornamento, la richiama
            if (typeof cambiaLingua === 'function') {
                cambiaLingua(nuovaLingua);
            } else {
                location.reload();
            }
        }

        function toggleMenu() {
            const menu = document.getElementById('side-menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }

        function esportaDatabase() {
            let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || {};
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `eat_me_first_backup_${new Date().toISOString().slice(0,10)}.json`);
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
            document.getElementById('popup-notifica').style.display = 'none';
        }

        function apriBlockNotes() {
            window.location.href = 'mia_lista.html';
        }

        function applicaTraduzioniFooter() {
            if (typeof dizionarioGlobale !== 'undefined') {
                const lang = localStorage.getItem('eat_me_first_lang') || 'it';
                const glob = dizionarioGlobale[lang] || dizionarioGlobale['it'];
                if(glob && glob.footer) {
                    document.getElementById('txt-footer').innerHTML = glob.footer;
                }
            }
        }
    </script>
</body>
</html>// Dizionario multilingue per EatMeFirst
const dizionarioGlobale = {
    it: {
        titolo_app: "EatMeFirst",
        suite: "Suite",
        carico: "Carico Articolo",
        scarico: "Scarico Prodotti",
        dispensa: "Visualizza Dispensa",
        spesa_lista: "Lista della Spesa",
        spesa_comperare: "Articoli da comperare",
        agenda: "Agenda Scadenze (30 Giorni)",
        ricordarsi: "Ricordarsi di...",
        footer: "EatMeFirst &bull; Gestione locale sicura"
    },
    en: {
        titolo_app: "EatMeFirst",
        suite: "Suite",
        carico: "Load Item",
        scarico: "Unload Products",
        dispensa: "View Pantry",
        spesa_lista: "Shopping List",
        spesa_comperare: "Items to buy",
        agenda: "Expiration Agenda (30 Days)",
        ricordarsi: "Remember to...",
        footer: "EatMeFirst &bull; Secure local management"
    },
    es: {
        titolo_app: "EatMeFirst",
        suite: "Suite",
        carico: "Cargar Artículo",
        scarico: "Descargar Productos",
        dispensa: "Ver Despensa",
        spesa_lista: "Lista de Compras",
        spesa_comperare: "Artículos para comprar",
        agenda: "Agenda de Vencimientos (30 Días)",
        ricordarsi: "Recordar que...",
        footer: "EatMeFirst &bull; Gestión local segura"
    },
    fr: {
        titolo_app: "EatMeFirst",
        suite: "Suite",
        carico: "Charger Article",
        scarico: "Décharger Produits",
        dispensa: "Voir le Garde-manger",
        spesa_lista: "Liste de Courses",
        spesa_comperare: "Articles à acheter",
        agenda: "Agenda des Échéances (30 Jours)",
        ricordarsi: "Se rappeler de...",
        footer: "EatMeFirst &bull; Gestion locale sécurisée"
    },
    de: {
        titolo_app: "EatMeFirst",
        suite: "Suite",
        carico: "Artikel Laden",
        scarico: "Produkte Entladen",
        dispensa: "Vorratskammer Ansehen",
        spesa_lista: "Einkaufsliste",
        spesa_comperare: "Artikel zu kaufen",
        agenda: "Ablaufkalender (30 Tage)",
        ricordarsi: "Erinnern an...",
        footer: "EatMeFirst &bull; Sichere lokale Verwaltung"
    }
};

// Funzione globale che applica le traduzioni alla pagina
function cambiaLingua(lang) {
    localStorage.setItem('eat_me_first_lang', lang);
    const traduzioni = dizionarioGlobale[lang] || dizionarioGlobale['it'];

    // Cerca tutti gli elementi con l'attributo data-i18n e sostituisce il testo
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const chiave = element.getAttribute('data-i18n');
        if (traduzioni[chiave]) {
            element.innerHTML = traduzioni[chiave];
        }
    });
}

// Applica la lingua salvata appena si carica la pagina
document.addEventListener('DOMContentLoaded', () => {
    const langSalvata = localStorage.getItem('eat_me_first_lang') || 'it';
    const selectLang = document.getElementById('select-lingua');
    if (selectLang) selectLang.value = langSalvata;
    cambiaLingua(langSalvata);
});