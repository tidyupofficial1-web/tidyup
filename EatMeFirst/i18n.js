// --- SISTEMA MULTILINGUA GLOBALE (i18n) ---

const dizionarioGlobale = {
    it: {
        appTitle: "EatMeFirst - Gestione Dispensa",
        linguaNome: "Italiano"
    },
    en: {
        appTitle: "EatMeFirst - Pantry Management",
        linguaNome: "English"
    },
    fr: {
        appTitle: "EatMeFirst - Gestion du Garde-manger",
        linguaNome: "Français"
    },
    de: {
        appTitle: "EatMeFirst - Speisekammer-Verwaltung",
        linguaNome: "Deutsch"
    },
    es: {
        appTitle: "EatMeFirst - Gestión de Despensa",
        linguaNome: "Español"
    }
};

function getLinguaCorrente() {
    return localStorage.getItem('eat_lang') || 'it';
}

function creaSelettoreLinguaHTML() {
    const langCorrente = getLinguaCorrente();
    return `
        <select onchange="cambiaLinguaLocale(this.value)" aria-label="Seleziona lingua">
            <option value="it" ${langCorrente === 'it' ? 'selected' : ''}>🇮🇹 Italiano</option>
            <option value="en" ${langCorrente === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="fr" ${langCorrente === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
            <option value="de" ${langCorrente === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
            <option value="es" ${langCorrente === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
        </select>
    `;
}