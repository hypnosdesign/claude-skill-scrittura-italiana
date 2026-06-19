# Esecuzione di riferimento — A/B 2.12.2 vs 2.11.0

Prima esecuzione misurata della suite (`evals.json`, 13 eval). Prodotta da `evals/run.mjs`.
I dir dei singoli run sono rigenerabili (gitignored); qui resta la sintesi auditabile.

- **candidata:** working tree 2.12.2
- **baseline:** `e56cd74` (2.11.0), estratta con `git show e56cd74:SKILL.md`
- **editor + giudice:** `sonnet` · **iniezione:** `SKILL.md` (il nucleo, non il single-file)
- **data:** 2026-06-19

## Esito complessivo (13 eval, 1 run)

| | nuova 2.12.2 | baseline 2.11.0 |
|---|---|---|
| pass | 11/13 | 11/13 |
| invenzioni | **0** | 3 |
| fallisce su | #7 doc-tecnica, #8 scientifico (over-edit) | #12 citazione, #13 bipolare |

Pareggio sul pass rate, **modi di fallire opposti**: la nuova fallisce per eccesso di zelo
(0 invenzioni, nessun significato alterato); il baseline per aggiunta di entità e inversione del
bipolare.

## Stabilità — 4 casi divergenti × 3 run aggiuntivi (4 osservazioni each)

| caso | tipo | nuova | baseline | lettura |
|---|---|---|---|---|
| #7 doc-tecnica | preserve | 0/4 | 4/4 | regressione robusta della nuova → **corretta** (vedi sotto) |
| #8 scientifico | preserve | 3/4 | 2/4 | nuova più affidabile; entrambe rumorose (over-edit modale) |
| #12 citazione | improve | 4/4 | 1/4 | **vittoria robusta** (baseline aggiunge fonti) |
| #13 bipolare | mixed | 4/4 | 3/4 | nuova meglio; l'inversione del baseline è occasionale, non sistematica |
| **invenzioni** | (su 25 run) | **0** | **8** | **il dato più robusto** |

Segnale (robusto): la nuova **non inventa** (0/25 vs 8/25) ed è più affidabile su modalità e
citazioni. Rumore (l'n=1 avrebbe ingannato): il fail #8 della nuova nella prima run; l'inversione
del baseline su #13.

## Corpus reale — 2 passaggi della tesi (privati, fuori dal repo)

Entrambe le skill: **PASS, 0 invenzioni**. Preservano i bipolari informativi (*«l'opacità non è
un guasto da riparare: è la forma ordinaria»*), citazioni e registro. La differenza vecchia-nuova
**non emerge** su prosa filosofica già netta (rientra nelle eccezioni di entrambe le regole); si
vede sui casi borderline (esclusione di categoria), non qui.

## Regressione corretta — over-editing su testo funzionale

La misura ha rivelato #7 (doc-tecnica) **0/4**: la nuova rifiniva stilisticamente documentazione
che andava lasciata stare. Fix: guardia *«default conservativo per il testo funzionale»* in
`SKILL.md`. Ri-misura post-fix: **#7 → 3/3**, senza danni collaterali (#3, #9, #12 PASS).

## Caveat (onesti)

- Giudice singolo (LLM), fact-checkato su #12 ed era corretto, ma resta una fonte di rumore.
- Iniettato solo `SKILL.md`; n piccolo (≤4 osservazioni/cella); *preserve = zero modifiche* è un
  criterio severo (alcuni over-edit sono migliorie difendibili). Indicativo, non definitivo.

## Riprodurre

```bash
git show e56cd74:SKILL.md > /tmp/skill-2.11.0.md
node evals/run.mjs --label new --model sonnet
node evals/run.mjs --skill /tmp/skill-2.11.0.md --label baseline-2.11.0 --model sonnet
node evals/run.mjs --ids 7,8,12,13 --runs 3 --label stab-new --model sonnet
node evals/run.mjs --ids 7,8,12,13 --runs 3 --skill /tmp/skill-2.11.0.md --label stab-baseline --model sonnet
```
