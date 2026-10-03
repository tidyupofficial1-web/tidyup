document.addEventListener('DOMContentLoaded', () => {
    // 1. Inserisce il selettore delle 5 lingue
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

    // 2. Applica le traduzioni
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

    const descrizioni = {
        it: "La tua soluzione intelligente per la gestione della dispensa, il controllo delle scadenze e la lotta allo spreco alimentare.",
        en: "Your smart solution for pantry management, expiry tracking, and food waste reduction.",
        fr: "Votre solution intelligente pour la gestion du garde-manger et la réduction du gaspillage.",
        de: "Ihre intelligente Lösung für Vorratsverwaltung und Lebensmittelrettung.",
        es: "Tu solución inteligente para la gestión de despensas y la reducción del desperdicio."
    };

    const entraBtn = {
        it: "Entra nell'App",
        en: "Enter App",
        fr: "Entrer dans l'App",
        de: "App öffnen",
        es: "Entrar en la App"
    };

    const footerText = {
        it: "EatMeFirst &bull; Dati locali su dispositivo",
        en: "EatMeFirst &bull; Local device data",
        fr: "EatMeFirst &bull; Données locales sur l'appareil",
        de: "EatMeFirst &bull; Lokale Gerätedaten",
        es: "EatMeFirst &bull; Datos locales en el dispositivo"
    };

    document.getElementById('txt-welcome-desc').textContent = descrizioni[lang] || descrizioni['it'];
    document.getElementById('txt-btn-enter').textContent = entraBtn[lang] || entraBtn['it'];
    document.getElementById('txt-footer').innerHTML = footerText[lang] || footerText['it'];
}

window.addEventListener('linguaCambiata', () => {
    applicaTraduzioniInterfaccia();
});