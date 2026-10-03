document.addEventListener('DOMContentLoaded', () => {
    const containerLang = document.getElementById('header-lang');
    if (containerLang) {
        if (typeof creaSelettoreLinguaHTML === 'function') {
            containerLang.innerHTML = creaSelettoreLinguaHTML();
        } else {
            containerLang.innerHTML = `
                <select onchange="cambiaLinguaLocale(this.value)">
                    <option value="it">🇮🇹 Italiano</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="fr">🇫🇷 Français</option>
                    <option value="de">🇩🇪 Deutsch</option>
                    <option value="es">🇪🇸 Español</option>
                </select>
            `;
        }
    }
    applicaTraduzioniPresentazione();
});

function cambiaLinguaLocale(lang) {
    localStorage.setItem('chefstock_lang', lang);
    applicaTraduzioniPresentazione();
    window.dispatchEvent(new CustomEvent('linguaCambiata', { detail: lang }));
}

function applicaTraduzioniPresentazione() {
    let lang = 'it';
    if (typeof getLinguaCorrente === 'function') {
        lang = getLinguaCorrente();
    } else {
        lang = localStorage.getItem('chefstock_lang') || 'it';
    }

    const selectEl = document.querySelector('#header-lang select');
    if (selectEl) selectEl.value = lang;

    const dizionario = {
        it: {
            subtitle: "Il sistema professionale per la gestione delle scadenze e delle scorte in cucina.",
            sec1H: "Ottimizza la gestione della tua cucina",
            sec1P1: "ChefStock nasce per supportare chef, brigate e ristoratori nel controllo quotidiano del magazzino, riducendo drasticamente gli sprechi alimentari e prevenendo errori sulle scadenze.",
            sec1P2: "Tutti i dati vengono salvati in locale sul tuo dispositivo, garantendo la massima privacy e operatività immediata senza dipendere da server esterni.",
            card1H: "Controllo Rapido delle Scadenze",
            card1Li1: "Monitoraggio visivo immediato dei prodotti in scadenza.",
            card1Li2: "Gestione flessibile dei lotti e delle categorie alimentari.",
            card1Li3: "Interfaccia pensata per ritmi di lavoro professionali.",
            card2H: "Conformità e Sicurezza",
            card2Li1: "Supporto organizzativo ideale per i protocolli HACCP.",
            card2Li2: "Privacy totale con archiviazione dati locale (localStorage).",
            card2Li3: "Funzioni essenziali sempre gratuite e accessibili.",
            btnProceed: "Accedi all'Applicazione",
            terms: "Termini e Condizioni d'Uso"
        },
        en: {
            subtitle: "The professional system for kitchen expiry and stock management.",
            sec1H: "Optimize your kitchen management",
            sec1P1: "ChefStock is designed to support chefs, kitchen brigades, and restaurateurs in daily inventory control, drastically reducing food waste and preventing expiry errors.",
            sec1P2: "All data is saved locally on your device, ensuring maximum privacy and immediate operation without relying on external servers.",
            card1H: "Quick Expiry Monitoring",
            card1Li1: "Immediate visual monitoring of expiring products.",
            card1Li2: "Flexible management of batches and food categories.",
            card1Li3: "Interface tailored for professional work paces.",
            card2H: "Compliance and Security",
            card2Li1: "Ideal organizational support for HACCP protocols.",
            card2Li2: "Total privacy with local data storage (localStorage).",
            card2Li3: "Essential features always free and accessible.",
            btnProceed: "Access the Application",
            terms: "Terms and Conditions of Use"
        },
        fr: {
            subtitle: "Le système professionnel pour la gestion des péremptions et des stocks en cuisine.",
            sec1H: "Optimisez la gestion de votre cuisine",
            sec1P1: "ChefStock est conçu pour soutenir les chefs et les restaurateurs dans le contrôle quotidien des stocks, réduisant le gaspillage alimentaire et prévenant les erreurs de péremption.",
            sec1P2: "Toutes les données sont stockées localement sur votre appareil, garantissant une confidentialité totale.",
            card1H: "Suivi Rapide des Péremptions",
            card1Li1: "Suivi visuel immédiat des produits proches de la péremption.",
            card1Li2: "Gestion flexible des lots et des catégories d'aliments.",
            card1Li3: "Interface conçue pour les rythmes professionnels.",
            card2H: "Conformité et Sécurité",
            card2Li1: "Support organisationnel idéal pour les protocoles HACCP.",
            card2Li2: "Confidentialité totale avec stockage local (localStorage).",
            card2Li3: "Fonctions essentielles gratuites et accessibles.",
            btnProceed: "Accéder à l'Application",
            terms: "Termes et Conditions d'Utilisation"
        },
        de: {
            subtitle: "Das professionelle System für Küchenbestände und Ablaufdaten.",
            sec1H: "Optimieren Sie Ihr Küchenmanagement",
            sec1P1: "ChefStock unterstützt Köche und Gastronomen bei der täglichen Bestandskontrolle, um Lebensmittelverschwendung drastisch zu reduzieren.",
            sec1P2: "Alle Daten werden lokal auf Ihrem Gerät gespeichert, was absolute Privatsphäre garantiert.",
            card1H: "Schnelle Ablaufüberwachung",
            card1Li1: "Sofortige visuelle Überwachung ablaufender Produkte.",
            card1Li2: "Flexible Verwaltung von Chargen und Lebensmittelkategorien.",
            card1Li3: "Benutzeroberfläche für professionelle Arbeitsabläufe.",
            card2H: "Sicherheit und Konformität",
            card2Li1: "Ideale organisatorische Unterstützung für HACCP-Protokolle.",
            card2Li2: "Volle Datensouveränität durch lokale Speicherung (localStorage).",
            card2Li3: "Grundfunktionen dauerhaft kostenlos und zugänglich.",
            btnProceed: "Zur Anwendung",
            terms: "Nutzungsbedingungen"
        },
        es: {
            subtitle: "El sistema profesional para la gestión de caducidades y stocks en cocina.",
            sec1H: "Optimiza la gestión de tu cocina",
            sec1P1: "ChefStock apoya a chefs y restauradores en el control diario del inventario, reduciendo el desperdicio de alimentos y previniendo errores de caducidad.",
            sec1P2: "Todos los datos se guardan localmente en tu dispositivo, garantizando total privacidad.",
            card1H: "Control Rápido de Caducidades",
            card1Li1: "Monitoreo visual inmediato de productos próximos a caducar.",
            card1Li2: "Gestión flexible de lotes y categorías de alimentos.",
            card1Li3: "Interfaz diseñada para ritmos de trabajo profesionales.",
            card2H: "Cumplimiento y Seguridad",
            card2Li1: "Apoyo organizativo ideal para protocolos HACCP.",
            card2Li2: "Privacidad total con almacenamiento local (localStorage).",
            card2Li3: "Funciones esenciales siempre gratuitas y accesibles.",
            btnProceed: "Acceder a la Aplicación",
            terms: "Términos y Condiciones de Uso"
        }
    };

    const t = dizionario[lang] || dizionario['it'];

    document.getElementById('txt-subtitle').textContent = t.subtitle;
    document.getElementById('txt-sec1-h').textContent = t.sec1H;
    document.getElementById('txt-sec1-p1').textContent = t.sec1P1;
    document.getElementById('txt-sec1-p2').textContent = t.sec1P2;
    document.getElementById('txt-card1-h').textContent = t.card1H;
    document.getElementById('txt-card1-li1').textContent = t.card1Li1;
    document.getElementById('txt-card1-li2').textContent = t.card1Li2;
    document.getElementById('txt-card1-li3').textContent = t.card1Li3;
    document.getElementById('txt-card2-h').textContent = t.card2H;
    document.getElementById('txt-card2-li1').textContent = t.card2Li1;
    document.getElementById('txt-card2-li2').textContent = t.card2Li2;
    document.getElementById('txt-card2-li3').textContent = t.card2Li3;
    document.getElementById('txt-btn-proceed').textContent = t.btnProceed;
    document.getElementById('txt-terms').textContent = t.terms;
}

// Sintesi vocale opzionale all'avvio
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if ('speechSynthesis' in window) {
            const lang = localStorage.getItem('chefstock_lang') || 'it';
            let msg = "Benvenuto in ChefStock. Gestisci le tue scorte e le scadenze in cucina in totale semplicità.";
            if (lang === 'en') msg = "Welcome to ChefStock. Manage your kitchen stock and expiries with ease.";
            if (lang === 'fr') msg = "Bienvenue dans ChefStock. Gérez vos stocks et péremptions en cuisine en toute simplicité.";
            if (lang === 'de') msg = "Willkommen bei ChefStock. Verwalten Sie Ihre Bestände und Ablaufdaten in der Küche ganz einfach.";
            if (lang === 'es') msg = "Bienvenido a ChefStock. Gestiona tu stock y caducidades en la cocina con total sencillez.";

            const utterance = new SpeechSynthesisUtterance(msg);
            utterance.lang = lang === 'en' ? 'en-US' : (lang === 'fr' ? 'fr-FR' : (lang === 'de' ? 'de-DE' : (lang === 'es' ? 'es-ES' : 'it-IT')));
            utterance.rate = 1.0;
            // window.speechSynthesis.speak(utterance); // Scommenta se vuoi abilitare la voce automatica
        }
    }, 1200);
});

window.addEventListener('linguaCambiata', () => {
    applicaTraduzioniPresentazione();
});