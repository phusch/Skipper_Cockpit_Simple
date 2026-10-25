# Friesland Skipper Cockpit Simple – V1.0.5 Test mit Huschel App Speicher

## Herkunft und Bestandsschutz

**Ausgangsbasis ist ausschließlich die am 25.10.2026 hochgeladene `Skipper_Cockpit_Simple.zip` (App V1.0.4 Final).** Nicht die alte V0.19.x-App und nicht deren Repository ändern! V1.0.5 ist ausschließlich ein zusätzlicher Speicherzugang für den eigenständigen Simple-Ableger.

## Installation

1. Gesamten Inhalt dieses Versionsordners in das **bestehende Repository `phusch/Skipper_Cockpit_Simple`** hochladen (Inhalt des Ordners, nicht den Versionsordner als Unterordner). Ein separater Testbranch ist vorzuziehen, bis die Version freigegeben wird.
2. In Supabase `huschel-speicher-pilot` → Edge Functions → `github-app-storage` → Code die **bestehende** serverseitige `APPS`-Liste um **eine Zeile** ergänzen, ohne die bestehenden App-Einträge zu entfernen:

   ```typescript
   "skipper-cockpit-simple": "skipper-cockpit-simple/data.json",
   ```

   Anschließend `Deploy updates`. **Nicht** eine ältere komplette Edge Function erneut deployen! Vorhandene Freigaben für Chillout Lab, Routen Navigator und Amflow bleiben unverändert.
3. In der App das neue Speichern-Symbol **⇧** oben rechts öffnen. Bei der ersten Benutzung Publishable Key und den bisherigen Supabase Auth-Benutzer eingeben; auf demselben Browser bleiben gültige Sitzungen anschließend erhalten. **Nie ein GitHub-Token oder `sb_secret_` in die App eintragen.**
4. Zuerst **GitHub Laden** wählen, um die Dateiversion zu prüfen. Falls keine Skipper-Daten existieren: **GitHub Speichern**. Falls auf GitHub andere Daten liegen: nie ungeprüft übernehmen.
5. GitHub lädt/speichert nur die **veränderlichen lokalen `fsc_...`-Werte**, nicht Kartenkacheln, statische GPX, Programmdateien oder das öffentlich veröffentlichte `friesland-current.json`.

## Speichern & Backup

- Oben: GitHub-Speicherampel, darunter letzte Revision und Speicherzeitpunkt.
- Separater grün hinterlegter Supabase-Anmeldestatus mit dauerhaftem Auto-Login (Passwort selbst wird nicht gespeichert).
- Deutlich hervorgehobenes GitHub Speichern/Laden mit SHA-/Revisionsschutz durch die vorhandene Supabase Edge Function.
- Lokal Speichern/Laden legt bewusst einen **separaten manuellen Schnappschuss** an. Die originale automatische Speicherung im Browser läuft weiter.
- JSON erstellen/laden: Backup kompatibel zum bestehenden `friesland-skipper-cockpit-backup`-Schema. Vor einer Übernahme werden Unterschiede und Überschreibungen bestätigt. Bei Übernahme wird die App neu geladen, damit alle Module die wiederhergestellten Daten korrekt einlesen.
- Unter MEHR bleibt der **originale iCloud-Export/Import inklusive Crew-Stand-Laden und Rücksicherung** unverändert erreichbar. Keine Synchronisierung zwischen öffentlichem Crew-Stand und privatem GitHub-Speicher im Hintergrund.

## Unverändert

`assets/app.js`, `assets/simple-ui.js`, `assets/simple-backup.js`, ursprüngliche CSS-Dateien, alle GPX-/Runner-/Wetter-/Nautik-/Bunker-/Tourinformationen, `friesland-current.json`, Bilder und die Hauptnavigation bleiben bitgenau unverändert. Der separate Ableger berührt nicht das alte Skipper Cockpit V0.19.x.

## Dateien geändert / ergänzt

- `index.html`: additive `⇧`-Schaltfläche, zusätzliche Speicheransicht und Verweise; sichtbare Kennzeichnung V1.0.5.
- **Neu** `assets/huschel-skipper-speicher.js`: Cloud-/lokaler-/JSON-Speichercontroller, arbeitet ausschließlich über das vorhandene Backup-Schema.
- **Neu** `assets/huschel-skipper-speicher.css`: isolierte Styles für Speicherseite und Symbolbutton.
- **Neu** `README_HUSCHEL_SPEICHER_V1.0.5.md`: dieses Dokument.

## Sicherheit, Besonderheiten und Test

- GitHub-Token bleibt als Supabase Secret `GITHUB_TOKEN` auf dem Server. Server muss App-ID auf festen Pfad einschränken.
- Die UID- und JWT-Prüfung der vorhandenen Edge Function bleibt bestehen.
- Kein automatischer GitHub-Upload; Cloud-Speichern bleibt eine bewusste Handlung.
- Der öffentliche Crew-Stand `friesland-current.json` bleibt eine separate Funktion. Sollte er künftig geändert werden, kann die vorhandene `crew-bootstrap.js` beim Start eine veröffentlichte Routenaktualisierung durchführen. **Darum privaten GitHub-Stand nur bewusst laden und bei Routenabweichungen nach dem Neustart die aktive Tagesroute kontrollieren.**
- Eine öffentliche GitHub-Pages-App kann kein echtes GitHub-Secret enthalten. Auch `sb_publishable_...` ist absichtlich öffentlich, aber nicht zum Schreiben ohne Auth berechtigt.
- Quellsyntax, Struktur und Datenformat können lokal getestet werden; ein echter End-to-End-Test mit deinem Supabase-Konto und GitHub Pages ist nach Upload erforderlich. **Diese Version ist noch kein neuer MASTER-Stand.**

## Empfohlener Abnahmetest

1. Original-App öffnen: HEUTE, FAHREN, WETTER und MEHR prüfen; bestehende Tag-9-Route und GPX sichtbar.
2. ⇧ öffnen, Login-Status grün, Zurück bringt dich zur selben App ohne Neuaufbau.
3. GitHub Laden (erste Nutzung: noch keine Datei) → GitHub Speichern (Revision 1).
4. Schiffsprofil oder Routenentscheidung lokal ändern; Ampel wird beim Öffnen gelb; GitHub Speichern (Revision erhöht sich).
5. Vorhandene Änderungen beim GitHub Laden nur nach Bestätigung übernehmen; die App lädt neu.
6. JSON-Backup lokal exportieren, Testimport nur mit bewusst gewählter Datei durchführen; Original iCloud-Backup unter MEHR prüfen.
7. Auto-Login nach Schließen/Neustart prüfen; keine erneute Passworteingabe.
