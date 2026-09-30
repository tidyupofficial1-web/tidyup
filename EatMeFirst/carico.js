async function cercaOpenFoodFacts() {
    if (cameraAttiva) await chiudiFotocamera();

    const barcode = document.getElementById('barcode-input').value.trim();
    if (!barcode) return;

    try {
        // 1. Primo tentativo: Open Food Facts (Alimentari)
        let response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
        let data = await response.json();

        // 2. Secondo tentativo: Open Products Facts (Non alimentari / Casa / Igienici) se il primo fallisce
        if (!data || data.status !== 1) {
            response = await fetch(`https://world.openproductsfacts.org/api/v0/product/${barcode}.json`);
            data = await response.json();
        }

        if (data && data.status === 1) {
            const prodotto = data.product;
            let nome = prodotto.product_name || prodotto.product_name_it || "";
            if (nome.length > 45) nome = nome.substring(0, 42) + '...';

            const marca = (prodotto.brands || "").substring(0, 30);
            const immagine = prodotto.image_front_url || "";

            if(nome) document.getElementById('nome-prodotto').value = nome;
            if(marca) document.getElementById('marca-prodotto').value = marca;

            document.getElementById('inf-nome').textContent = nome || "Sconosciuto";
            document.getElementById('inf-marca').textContent = marca || "Non specificata";

            estraiQuantitaIntelligente(prodotto.quantity || "");
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