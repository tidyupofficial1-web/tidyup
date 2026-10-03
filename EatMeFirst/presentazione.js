// --- LOGICA PRESENTAZIONE & AUDIO ---
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance("Benvenuto in EatMeFirst. Gestisci le tue scadenze in totale semplicità.");
            utterance.lang = 'it-IT';
            utterance.rate = 1.0;
            // window.speechSynthesis.speak(utterance); // Scommenta se vuoi abilitare la voce automatica
        }
    }, 1000);
});