# Buon compleanno Elisa 🎂

Sito in HTML/CSS/JS puro, pronto per GitHub Pages. Struttura del progetto:

```
index.html
style.css
script.js
images/
  photo1.jpg ... photo6.jpg
```

## Come pubblicarla su GitHub Pages

1. Crea un nuovo repository su GitHub (es. `elisa-21`). **Nota**: con un account gratuito, GitHub Pages richiede che il repository sia **pubblico** — chiunque abbia il link potrà vedere la pagina (non finirà nei motori di ricerca, ma non è protetta da password). Per più riservatezza serve un piano con repo privati + Pages, o un altro host con pagine private.
2. Estrai lo zip e carica **tutti i file mantenendo la struttura delle cartelle** (incluso `images/` con dentro le 6 foto) nella root del repository — su GitHub web "Add file → Upload files" permette di trascinare anche intere cartelle.
3. Vai su **Settings → Pages**.
4. In "Build and deployment": source = `Deploy from a branch`, branch `main`, cartella `/ (root)`.
5. Salva. Dopo un minuto o due il link sarà tipo `https://tuonomeutente.github.io/elisa-21/`.

Importante: se le immagini non compaiono dopo la pubblicazione, controlla che la cartella `images/` sia stata caricata insieme ai suoi 6 file e che i nomi combacino esattamente (case-sensitive: `photo1.jpg`, non `Photo1.jpg`).

## Cosa contiene

- Contatore live di giorni/ore/minuti/secondi insieme, calcolato dal 12 gennaio 2021 (già impostato, cercalo in `script.js` alla riga `START_DATE` se vuoi cambiarlo)
- 6 foto con effetto tendina a comparsa durante lo scroll
- Cielo animato che vira dal giorno al tramonto alla notte stellata mentre si scorre la pagina
- Finale con 21 candeline: un bottone "Soffia per spegnere le candeline" (funziona sempre, ovunque) e in più un'opzione con il microfono vero — se lo smartphone/computer concede il permesso, si possono spegnere soffiando davvero verso lo schermo

## Personalizzazioni facili

- **Data di inizio**: in `script.js`, riga `const START_DATE = new Date('2021-01-12T00:00:00');`
- **Firma finale**: in `index.html`, dentro `<p class="secret" id="secretMsg">`, puoi aggiungere il tuo nome dopo "Ti amo."
- **Frasi delle foto**: ogni foto ha una frase nel tag `<p>` dentro `.caption`, in `index.html` — modificale liberamente.

Ho già testato in locale che tutte e 6 le foto si caricano correttamente e che le candeline si spengono come previsto.
