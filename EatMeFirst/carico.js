// Gestione Fotocamera ultra-robusta per Smartphone via Web
async function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');

    if (!cameraAttiva) {
        // 1. Prima di tutto forziamo la visibilità del box
        readerDiv.style.display = 'block';
        btnCam.textContent = "⏳ Apertura fotocamera in corso...";
        cameraAttiva = true;

        try {
            // 2. Chiediamo esplicitamente il permesso al browser del cellulare
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: { exact: "environment" } } 
            }).catch(async () => {
                // Fallback se la fotocamera posteriore "exact" non è disponibile
                return await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            });

            // Spegniamo subito lo stream nativo di prova, lo gestirà Html5Qrcode
            stream.getTracks().forEach(track => track.stop());

            // 3. Avviamo la libreria di scansione
            html5QrCode = new Html5Qrcode("reader");
            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 220, height: 140 } },
                async (decodedText) => {
                    document.getElementById('barcode-input').value = decodedText;
                    await chiudiFotocamera();
                    cercaBarcodeMultiplo();
                },
                (errorMessage) => {}
            );

            btnCam.textContent = "🛑 Chiudi Fotocamera";
        } catch (err) {
            console.error("Errore accesso fotocamera:", err);
            alert("Impossibile accedere alla fotocamera.\n\nAssicurati di:\n1. Usare una connessione sicura (HTTPS).\n2. Aver autorizzato i permessi della fotocamera nel browser (tocca l'icona del lucchetto o delle impostazioni nella barra degli indirizzi del cellulare).");
            await chiudiFotocamera();
        }
    } else {
        await chiudiFotocamera();
    }
}