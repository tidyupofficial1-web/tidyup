function pulisciAltriCampiScadenza(origine) {
    if (origine === 'giorni') {
        document.getElementById('stima-mesi').value = '';
        document.getElementById('scad-gg').value = '';
        document.getElementById('scad-mm').value = '';
        document.getElementById('scad-aa').value = '';
    } else if (origine === 'mesi') {
        document.getElementById('stima-giorni').value = '';
        document.getElementById('scad-gg').value = '';
        document.getElementById('scad-mm').value = '';
        document.getElementById('scad-aa').value = '';
    } else if (origine === 'data') {
        document.getElementById('stima-giorni').value = '';
        document.getElementById('stima-mesi').value = '';
    }
}

function saltoAutomatico(corrente, prossimoId, maxLen) {
    if (corrente.value.length >= maxLen && prossimoId) {
        document.getElementById(prossimoId).focus();
    }
}

function impostaTipoScadenza(tipo) {
    const containerScadenza = document.getElementById('stima-giorni').closest('.form-group');
    if (tipo === 'nessuna') {
        containerScadenza.style.opacity = '0.3';
        containerScadenza.style.pointerEvents = 'none';
    } else {
        containerScadenza.style.opacity = '1';
        containerScadenza.style.pointerEvents = 'auto';
    }
}