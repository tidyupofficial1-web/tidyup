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
    applicaTraduzioniInterfaccia();
});

function cambiaLinguaLocale(lang) {
    localStorage.setItem('eat_lang', lang);
    applicaTraduzioniInterfaccia();
    window.dispatchEvent(new CustomEvent('linguaCambiata', { detail: lang }));
}

function applicaTraduzioniInterfaccia() {
    let lang = 'it';
    if (typeof getLinguaCorrente === 'function') {
        lang = getLinguaCorrente();
    } else {
        lang = localStorage.getItem('eat_lang') || 'it';
    }

    const selectEl = document.querySelector('#header-lang select');
    if (selectEl) selectEl.value = lang;

    const dizionario = {
        it: {
            back: "Indietro",
            termsTitle: "Termini e Condizioni d'Uso",
            sec1Title: "1. Accettazione dei Termini",
            sec1Desc: "Utilizzando l'applicazione EatMeFirst, l'utente accetta i presenti termini e condizioni. L'applicazione è fornita \"così com'è\" per aiutare nella gestione della dispensa domestica e nella riduzione degli sprechi alimentari.",
            sec2Title: "2. Salvataggio e Dati Locali",
            sec2Desc: "EatMeFirst memorizza i dati dei tuoi prodotti direttamente sul tuo dispositivo (tramite localStorage). Nessun dato sensibile o inventario personale viene trasmesso a server esterni, garantendo la massima privacy e il controllo totale delle tue informazioni.",
            sec3Title: "3. Limitazione di Responsabilità",
            sec3Desc: "Le indicazioni sulle scadenze e le funzioni di assistente intelligente sono di supporto puramente indicativo. L'utente è tenuto a verificare sempre lo stato effettivo degli alimenti prima del consumo per tutelare la propria salute.",
            sec4Title: "4. Funzioni Future e Premium",
            sec4Desc: "Alcune funzionalità avanzate attualmente offerte a titolo gratuito potrebbero in futuro entrare a far parte di pacchetti o versioni Premium dedicate, previa comunicazione all'interno dell'applicazione."
        },
        en: {
            back: "Back",
            termsTitle: "Terms and Conditions of Use",
            sec1Title: "1. Acceptance of Terms",
            sec1Desc: "By using the EatMeFirst application, the user accepts these terms and conditions. The application is provided \"as is\" to help manage the home pantry and reduce food waste.",
            sec2Title: "2. Local Storage and Data",
            sec2Desc: "EatMeFirst stores your product data directly on your device (via localStorage). No sensitive data or personal inventory is transmitted to external servers, ensuring maximum privacy and total control over your information.",
            sec3Title: "3. Limitation of Liability",
            sec3Desc: "Expiry date indications and smart assistant features are purely for guidance. The user is required to always check the actual condition of food before consumption to protect their health.",
            sec4Title: "4. Future & Premium Features",
            sec4Desc: "Some advanced features currently offered for free may become part of dedicated Premium packages or versions in the future, following communication within the application."
        },
        fr: {
            back: "Retour",
            termsTitle: "Termes et Conditions d'Utilisation",
            sec1Title: "1. Acceptation des Termes",
            sec1Desc: "En utilisant EatMeFirst, vous acceptez ces conditions. L'application est fournie \"telle quelle\" pour la gestion du garde-manger.",
            sec2Title: "2. Stockage Local",
            sec2Desc: "Vos données sont stockées directement sur votre appareil (localStorage) pour garantir une confidentialité totale.",
            sec3Title: "3. Limitation de Responsabilité",
            sec3Desc: "Les indications de péremption sont purement indicatives. Vérifiez toujours l'état des aliments avant consommation.",
            sec4Title: "4. Fonctionnalités Futures",
            sec4Desc: "Certaines fonctions gratuites pourront évoluer vers des versions Premium à l'avenir."
        },
        de: {
            back: "Zurück",
            termsTitle: "Nutzungsbedingungen",
            sec1Title: "1. Annahme der Bedingungen",
            sec1Desc: "Durch die Nutzung von EatMeFirst akzeptieren Sie diese Bedingungen. Die App wird \"wie besehen\" bereitgestellt.",
            sec2Title: "2. Lokale Speicherung",
            sec2Desc: "Ihre Produktdaten werden direkt auf Ihrem Gerät gespeichert (localStorage), um absolute Privatsphäre zu gewährleisten.",
            sec3Title: "3. Haftungsbeschränkung",
            sec3Desc: "Haltbarkeitsangaben dienen nur der Orientierung. Überprüfen Sie Lebensmittel immer vor dem Verzehr.",
            sec4Title: "4. Zukünftige Funktionen",
            sec4Desc: "Einige derzeit kostenlose Funktionen können in Zukunft Teil von Premium-Versionen werden."
        },
        es: {
            back: "Volver",
            termsTitle: "Términos y Condiciones de Uso",
            sec1Title: "1. Aceptación de los Términi",
            sec1Desc: "Al utilizar EatMeFirst, el usuario acepta estos términos y condiciones. La aplicación se proporciona \"tal cual\".",
            sec2Title: "2. Almacenamiento Local",
            sec2Desc: "EatMeFirst almacena los datos de tus productos directamente en tu dispositivo (mediante localStorage) garantizando la privacidad.",
            sec3Title: "3. Limitación de Responsabilidad",
            sec3Desc: "Las indicaciones de caducidad son puramente orientativas. Verifica siempre el estado de los alimentos antes de su consumo.",
            sec4Title: "4. Funciones Futuras y Premium",
            sec4Desc: "Algunas funciones avanzadas gratuitas podrían formar parte de versiones Premium en el futuro."
        }
    };

    const t = dizionario[lang] || dizionario['it'];

    document.getElementById('txt-back').textContent = t.back;
    document.getElementById('txt-terms-title').textContent = t.termsTitle;
    document.getElementById('txt-sec1-title').textContent = t.sec1Title;
    document.getElementById('txt-sec1-desc').textContent = t.sec1Desc;
    document.getElementById('txt-sec2-title').textContent = t.sec2Title;
    document.getElementById('txt-sec2-desc').textContent = t.sec2Desc;
    document.getElementById('txt-sec3-title').textContent = t.sec3Title;
    document.getElementById('txt-sec3-desc').textContent = t.sec3Desc;
    document.getElementById('txt-sec4-title').textContent = t.sec4Title;
    document.getElementById('txt-sec4-desc').textContent = t.sec4Desc;
}

window.addEventListener('linguaCambiata', () => {
    applicaTraduzioniInterfaccia();
});