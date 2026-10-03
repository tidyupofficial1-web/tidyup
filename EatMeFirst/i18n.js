// --- SISTEMA MULTILINGUA GLOBALE (i18n) ---

const dizionarioGlobale = {
    it: {
        appTitle: "EatMeFirst - Gestione Dispensa",
        linguaNome: "Italiano",
        navAggiornamenti: "Aggiornamenti & Backup",
        centroAggiornamenti: "🔄 Centro Aggiornamenti",
        testoAggiornamenti: "Verifica la disponibilità di nuove versioni dell'applicazione. Prima di procedere, il sistema metterà al sicuro i tuoi dati creando un backup crittografato.",
        consiglioTest: "💡 Consiglio per i test:",
        testoConsiglio: "Fai prima delle simulazioni. Se inserisci molti prodotti reali e poi decidi di tornare alla versione precedente (downgrade), i dati della nuova versione potrebbero non essere compatibili.",
        versioneInUso: "Versione in uso:",
        btnControllaAggiornamenti: "🔍 Controlla Aggiornamenti",
        ripristinoVersione: "🔙 Ripristino Versione",
        testoRipristino: "Se un aggiornamento non ti soddisfa o riscontri problemi, carica il file di backup salvato in precedenza per tornare immediatamente alla versione stabile precedente.",
        btnEseguiDowngrade: "Esegui Downgrade",
        salvataggiAutomatici: "🛡️ Salvataggi Automatici",
        testoSalvataggi: "Il dispositivo crea automaticamente un punto di ripristino ogni 30 minuti di utilizzo effettivo (mantiene gli ultimi 3 in rotazione circolare).",
        btnVisualizzaSalvataggi: "📂 Visualizza Salvataggi Automatici",
        tornaMenu: "← Torna al Menu Principale",
        footerText: "EatMeFirst • Gestione locale sicura"
    },
    en: {
        appTitle: "EatMeFirst - Pantry Management",
        linguaNome: "English",
        navAggiornamenti: "Updates & Backup",
        centroAggiornamenti: "🔄 Update Center",
        testoAggiornamenti: "Check for new application versions. Before proceeding, the system will secure your data by creating an encrypted backup.",
        consiglioTest: "💡 Testing tip:",
        testoConsiglio: "Run simulations first. If you enter many real products and then decide to downgrade, the new version data might not be compatible.",
        versioneInUso: "Current version:",
        btnControllaAggiornamenti: "🔍 Check for Updates",
        ripristinoVersione: "🔙 Version Restoration",
        testoRipristino: "If an update does not satisfy you or you encounter issues, upload a previously saved backup file to immediately revert to the previous stable version.",
        btnEseguiDowngrade: "Run Downgrade",
        salvataggiAutomatici: "🛡️ Automatic Saves",
        testoSalvataggi: "The device automatically creates a restore point every 30 minutes of actual use (keeps the last 3 in circular rotation).",
        btnVisualizzaSalvataggi: "📂 View Automatic Saves",
        tornaMenu: "← Back to Main Menu",
        footerText: "EatMeFirst • Secure local management"
    },
    fr: {
        appTitle: "EatMeFirst - Gestion du Garde-manger",
        linguaNome: "Français",
        navAggiornamenti: "Mises à jour & Sauvegarde",
        centroAggiornamenti: "🔄 Centre de Mises à jour",
        testoAggiornamenti: "Vérifiez la disponibilité de nouvelles versions. Avant de continuer, le système sécurisera vos données en créant une sauvegarde chiffrée.",
        consiglioTest: "💡 Conseil de test :",
        testoConsiglio: "Faites d'abord des simulations. Si vous saisissez de vrais produits puis décidez de rétrograder, les données risquent d'être incompatibles.",
        versioneInUso: "Version actuelle :",
        btnControllaAggiornamenti: "🔍 Vérifier les mises à jour",
        ripristinoVersione: "🔙 Restauration de version",
        testoRipristino: "Si une mise à jour ne vous convient pas ou pose problème, chargez le fichier de sauvegarde précédent pour revenir à la version stable.",
        btnEseguiDowngrade: "Effectuer le Downgrade",
        salvataggiAutomatici: "🛡️ Sauvegardes Automatiques",
        testoSalvataggi: "L'appareil crée automatiquement un point de restauration toutes les 30 minutes d'utilisation (conserve les 3 derniers en rotation).",
        btnVisualizzaSalvataggi: "📂 Afficher les sauvegardes",
        tornaMenu: "← Retour au Menu Principal",
        footerText: "EatMeFirst • Gestion locale sécurisée"
    },
    de: {
        appTitle: "EatMeFirst - Speisekammer-Verwaltung",
        linguaNome: "Deutsch",
        navAggiornamenti: "Updates & Backup",
        centroAggiornamenti: "🔄 Update-Zentrum",
        testoAggiornamenti: "Prüfen Sie auf neue Versionen. Vor dem Fortfahren sichert das System Ihre Daten durch ein verschlüsseltes Backup.",
        consiglioTest: "💡 Test-Tipp:",
        testoConsiglio: "Machen Sie zuerst Simulationen. Wenn Sie echte Produkte eingeben und ein Downgrade machen, sind Daten eventuell inkompatibel.",
        versioneInUso: "Aktuelle Version:",
        btnControllaAggiornamenti: "🔍 Nach Updates suchen",
        ripristinoVersione: "🔙 Versionswiederherstellung",
        testoRipristino: "Wenn ein Update nicht gefällt, laden Sie eine zuvor gespeicherte Backup-Datei hoch, um zur stabilen Version zurückzukehren.",
        btnEseguiDowngrade: "Downgrade ausführen",
        salvataggiAutomatici: "🛡️ Automatische Speicherungen",
        testoSalvataggi: "Das Gerät erstellt alle 30 Minuten einen Wiederherstellungspunkt (behält die letzten 3 in rotierender Reihenfolge).",
        btnVisualizzaSalvataggi: "📂 Automatische Speicherungen anzeigen",
        tornaMenu: "← Zurück zum Hauptmenü",
        footerText: "EatMeFirst • Sichere lokale Verwaltung"
    },
    es: {
        appTitle: "EatMeFirst - Gestión de Despensa",
        linguaNome: "Español",
        navAggiornamenti: "Actualizaciones y Resguardo",
        centroAggiornamenti: "🔄 Centro de Actualizaciones",
        testoAggiornamenti: "Verifica si hay nuevas versiones. Antes de continuar, el sistema asegurará tus datos creando una copia de seguridad cifrada.",
        consiglioTest: "💡 Consejo de prueba:",
        testoConsiglio: "Haz simulaciones primero. Si ingresas muchos productos reales y luego decides volver atrás, los datos podrían no ser compatibles.",
        versioneInUso: "Versión actual:",
        btnControllaAggiornamenti: "🔍 Buscar Actualizaciones",
        ripristinoVersione: "🔙 Restauración de Versión",
        testoRipristino: "Si una actualización no te convence, carga el archivo de copia de seguridad guardado anteriormente para volver a la versión estable.",
        btnEseguiDowngrade: "Ejecutar Downgrade",
        salvataggiAutomatici: "🛡️ Guardados Automáticos",
        testoSalvataggi: "El dispositivo crea automáticamente un punto de restauración cada 30 minutos de uso (mantiene los últimos 3 en rotación).",
        btnVisualizzaSalvataggi: "📂 Ver Guardados Automáticos",
        tornaMenu: "← Volver al Menú Principal",
        footerText: "EatMeFirst • Gestión local segura"
    }
};

function getLinguaCorrente() {
    return localStorage.getItem('eat_lang') || 'it';
}

function cambiaLingua(lang) {
    localStorage.setItem('eat_lang', lang);
    location.reload();
}

function getTraduzione(chiave) {
    const lang = getLinguaCorrente();
    if (dizionarioGlobale[lang] && dizionarioGlobale[lang][chiave]) {
        return dizionarioGlobale[lang][chiave];
    }
    return dizionarioGlobale['it'][chiave] || chiave;
}

function applicaTraduzioniPagina() {
    const elementi = document.querySelectorAll('[data-i18n]');
    elementi.forEach(el => {
        const chiave = el.getAttribute('data-i18n');
        const traduzione = getTraduzione(chiave);
        if (traduzione) {
            el.textContent = traduzione;
        }
    });
}

function creaSelettoreLinguaHTML() {
    const langCorrente = getLinguaCorrente();
    return `
        <select onchange="cambiaLingua(this.value)" aria-label="Seleziona lingua" class="lang-select">
            <option value="it" ${langCorrente === 'it' ? 'selected' : ''}>🇮🇹 Italiano</option>
            <option value="en" ${langCorrente === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            <option value="fr" ${langCorrente === 'fr' ? 'selected' : ''}>🇫🇷 Français</option>
            <option value="de" ${langCorrente === 'de' ? 'selected' : ''}>🇩🇪 Deutsch</option>
            <option value="es" ${langCorrente === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
        </select>
    `;
}

// Applica le traduzioni automaticamente appena la pagina carica
document.addEventListener('DOMContentLoaded', () => {
    applicaTraduzioniPagina();
});