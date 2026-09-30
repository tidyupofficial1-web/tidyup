let html5QrCode = null;
let cameraAttiva = false;
let tipoScadenzaCorrente = "consigliata"; // 'tassativa' o 'consigliata'

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('barcode-input').focus();
});

function handleBarcodeKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        cercaOpenFoodFacts();
    }
}

async function toggleFotocamera() {
    const readerDiv = document.getElementById('reader');
    const btnCam = document.getElementById('btn-toggle-cam');

    if (!cameraAttiva) {
        readerDiv.style.display = 'block';
        btnCam.textContent = "🛑 Chiudi Fotocamera";
        cameraAttiva = true;

        try {
            html5QrCode = new Html5Qrcode("reader");
            await html5QrCode.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 150 } },
                (decodedText) => {
                    document.getElementById('barcode-input').value = decodedText;
                    chiudiFotocamera();
                    cercaOpenFoodFacts();
                },
                (errorMessage) => {}
            );
        } catch (err) {
            alert("Impossibile accedere alla fotocamera. Verifica i permessi del browser.");
            chiudiFotocamera();
        }
    } else {
        chiudiFotocamera();
    }
}

async function chiudiFotocamera() {
    if (html5QrCode) {
        try {
            await html5QrCode.stop();
            html5QrCode.clear();
        } catch (e) {}
    }
    document.getElementById('reader').style.display = 'none';
    document.getElementById('btn-toggle-cam').textContent = "📷 Attiva Fotocamera / Scanner";
    cameraAttiva = false;
}

async function cercaOpenFoodFacts() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) return;

    try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        const data = await response.json();

        if (data && data.status === 1) {
            const prodotto = data.product;
            const nome = prodotto.product_name || prodotto.product_name_it || "";
            const marca = prodotto.brands || "";
            const immagine = prodotto.image_front_url || "";

            if(nome) document.getElementById('nome-prodotto').value = nome;
            if(marca) document.getElementById('marca-prodotto').value = marca;

            document.getElementById('inf-nome').textContent = nome || "Sconosciuto";
            document.getElementById('inf-marca').textContent = marca || "Non specificata";

            impostaScadenzaConsigliata(30);

            const imgEl = document.getElementById('img-anteprima');
            if(immagine) {
                imgEl.src = immagine;
                imgEl.style.display = 'block';
            } else {
                imgEl.style.display = 'none';
            }

            document.getElementById('preview-prodotto').style.display = 'block';
            document.getElementById('ubicazione').focus();
        } else {
            gestisciProdottoNonTrovato(barcode);
        }
    } catch (error) {
        gestisciProdottoNonTrovato(barcode);
    }
}

function gestisciProdottoNonTrovato(barcode) {
    confirm(`Il codice a barre (${barcode}) non è presente su Open Food Facts.\n\nProcediamo con l'inserimento manuale o cerchiamo sul web?`) 
        && window.open(`https://www.google.com/search?q=${encodeURIComponent(barcode)}`, '_blank');
    
    abilitaCompilazioneManuale();
    document.getElementById('nome-prodotto').value = `Prodotto [${barcode}]`;
}

function abilitaCompilazioneManuale() {
    if (cameraAttiva) chiudiFotocamera();

    const haScadenza = confirm("Il prodotto ha una scadenza?\n\n- Premi 'OK' se è un prodotto fresco con scadenza tassativa (es. latte, carne).\n- Premi 'Annulla' se NON ha scadenza (es. detersivi, carta igienica) o se inserisci un prodotto fatto in casa/mercato con scadenza consigliata.");

    const groupScadenza = document.getElementById('group-scadenza');

    if (haScadenza) {
        groupScadenza.style.display = 'block';
        const eTassativa = confirm("Trattasi di prodotto fresco a scadenza TASSATIVA (inserita da te)?\n\n- OK = Tassativa (Sfondo Rosso)\n- Annulla = Consigliata/Stimata dall'app");
        
        if(eTassativa) {
            impostaScadenzaTassativa();
        } else {
            impostaScadenzaConsigliata(15);
        }
    } else {
        groupScadenza.style.display = 'none';
        document.getElementById('scad-gg').value = '';
        document.getElementById('scad-mm').value = '';
        document.getElementById('scad-aa').value = '';
    }

    document.getElementById('preview-prodotto').style.display = 'block';
    document.getElementById('nome-prodotto').focus();
}

function impostaScadenzaTassativa() {
    tipoScadenzaCorrente = "tassativa";
    document.getElementById('group-scadenza').style.display = 'block';
    document.getElementById('inf-tipo-scadenza-badge').innerHTML = '<span class="scadenza-badge badge-tassativa">🔒 Scadenza Tassativa (Inserisci la data reale)</span>';
}

function impostaScadenzaConsigliata(giorniInPiu) {
    tipoScadenzaCorrente = "consigliata";
    document.getElementById('group-scadenza').style.display = 'block';
    
    const dataProposta = new Date();
    dataProposta.setDate(dataProposta.getDate() + giorniInPiu);
    
    document.getElementById('scad-gg').value = String(dataProposta.getDate()).padStart(2, '0');
    document.getElementById('scad-mm').value = String(dataProposta.getMonth() + 1).padStart(2, '0');
    document.getElementById('scad-aa').value = dataProposta.getFullYear();

    document.getElementById('inf-tipo-scadenza-badge').innerHTML = '<span class="scadenza-badge badge-consigliata">💡 Scadenza Consigliata (Verifica o modifica)</span>';
}

function stimaScadenzaDallaDescrizione(testo) {
    if (tipoScadenzaCorrente !== "consigliata") return;
    const t = testo.toLowerCase();
    let giorni = 30;

    if (t.includes('latte') || t.includes('fresco') || t.includes('mozzarella') || t.includes('ricotta')) {
        giorni = 7;
    } else if (t.includes('torta') || t.includes('dolce') || t.includes('marmellata') || t.includes('fatto in casa')) {
        giorni = 10;
    } else if (t.includes('carne') || t.includes('pesce')) {
        giorni = 3;
    } else if (t.includes('pane') || t.includes('panetteria')) {
        giorni = 4;
    }

    const d = new Date();
    d.setDate(d.getDate() + giorni);
    document.getElementById('scad-gg').value = String(d.getDate()).padStart(2, '0');
    document.getElementById('scad-mm').value = String(d.getMonth() + 1).padStart(2, '0');
    document.getElementById('scad-aa').value = d.getFullYear();
}

function registraCarico(event) {
    event.preventDefault();

    const groupVisible = document.getElementById('group-scadenza').style.display !== 'none';
    let dataScadenzaVal = "Nessuna scadenza";

    if (groupVisible) {
        const gg = document.getElementById('scad-gg').value.trim();
        const mm = document.getElementById('scad-mm').value.trim();
        const aa = document.getElementById('scad-aa').value.trim();

        if (gg && mm && aa) {
            dataScadenzaVal = `${aa}-${mm.padStart(2,'0')}-${gg.padStart(2,'0')}`;
        } else {
            alert("Compila correttamente la data di scadenza (Giorno, Mese e Anno) oppure rimuovi la scadenza.");
            return;
        }
    }

    const nuovoArticolo = {
        id: Date.now(),
        categoria: document.getElementById('categoria-prodotto').value,
        nome: document.getElementById('nome-prodotto').value.trim(),
        marca: document.getElementById('marca-prodotto').value.trim(),
        ubicazione: document.getElementById('ubicazione').value,
        scadenza: dataScadenzaVal,
        tipoScadenza: groupVisible ? tipoScadenzaCorrente : "nessuna",
        quantita: parseInt(document.getElementById('quantita').value) || 1,
        immagine: document.getElementById('img-anteprima').src || "",
        dataCarico: new Date().toISOString()
    };

    let db = JSON.parse(localStorage.getItem('eat_me_first_db')) || { dispensa: [] };
    if (!db.dispensa) db.dispensa = [];
    
    db.dispensa.push(nuovoArticolo);
    localStorage.setItem('eat_me_first_db', JSON.stringify(db));

    alert("Articolo caricato con successo nella dispensa!");
    window.location.href = "dispensa.html";
}