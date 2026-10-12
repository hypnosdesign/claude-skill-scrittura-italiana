# SEO del sito: manutenzione e Search Console

Il sito è pubblicato su GitHub Pages nella sottocartella
`https://hypnosdesign.github.io/claude-skill-scrittura-italiana/`.
La risorsa descritta è una skill editoriale per gli LLM, disponibile in formato
Agent Skills e come istruzioni complete in Markdown.

## Controlli del repository

```bash
node scripts/sync-site.mjs
node scripts/check-seo.mjs
```

Le cinque pagine hanno title e descrizioni distinti, H1 descrittivi, canonical,
anteprime Open Graph e Twitter e JSON-LD. Il markup identifica il sito, le pagine
e la risorsa editoriale (`CreativeWork`); non presenta le istruzioni come un'app
standalone e non aggiunge recensioni o punteggi non disponibili.

La sitemap contiene solo i cinque URL canonici. Non riporta date di modifica
stimate né include i file Markdown di manutenzione e delle release. Il controllo
SEO verifica metadati, riferimenti nel JSON-LD, anteprime e copertura della sitemap.
Non sostituisce Search Console o una misura delle prestazioni reali.

## Robots.txt e GitHub Pages

Google legge `robots.txt` alla radice dell'host:
`https://hypnosdesign.github.io/robots.txt`. Il file dentro la sottocartella del
progetto non viene usato: è stato rimosso per non suggerire che governi la scansione.
L'assenza del file alla radice non impedisce l'accesso alle pagine.

Se in seguito viene gestito un sito alla radice di `hypnosdesign.github.io`, il
suo `robots.txt` può includere questa riga, conservando le regole degli altri progetti:

```text
Sitemap: https://hypnosdesign.github.io/claude-skill-scrittura-italiana/sitemap.xml
```

La gestione della radice è separata da questo repository. Non occorre creare un
altro sito o cambiare dominio per rendere queste cinque pagine accessibili ai crawler.

## Search Console: configurazione rinviata

La configurazione è rinviata su richiesta del manutentore. Quando verrà attivata:

1. Aggiungere una proprietà **Prefisso URL** con l'indirizzo completo del progetto.
2. Verificare la proprietà con il tag HTML o il file fornito da Google.
3. Inviare `https://hypnosdesign.github.io/claude-skill-scrittura-italiana/sitemap.xml`
   nel rapporto Sitemap. Non usare i vecchi endpoint pubblici di ping.
4. Usare Controllo URL sulla home e sulle quattro pagine interne per verificare
   accesso, indicizzazione e canonical scelto da Google.
5. Controllare impressioni, query e clic; verificare i Core Web Vitals quando
   ci sono dati sufficienti. I metadati da soli non dimostrano un miglioramento.

Fonti: [posizione di robots.txt](https://developers.google.com/crawling/docs/robots-txt/create-robots-txt),
[sitemap e invio a Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[CreativeWork](https://schema.org/CreativeWork).
