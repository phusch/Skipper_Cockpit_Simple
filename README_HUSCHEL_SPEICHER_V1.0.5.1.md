# Skipper Cockpit Simple V1.0.5.1 – sichtbarer Speicherbutton

## Ausgangsbasis
Ausschließlich `Skipper_Cockpit_Simple_V1.0.5_Huschel_Speicher_Test.zip`. Die gesamte Fachlogik einschließlich GPX, Bunkern, Runner, Schiffsprofil, Wetter, Auto-Speichern und Crew-/iCloud-Backup ist unverändert.

## Korrektur
Der neue Speicherbutton war im hellen Kopfbereich wegen weißer Schrift auf sehr hellem Hintergrund kaum sichtbar. Jetzt ist er als dunkelblaues Disketten-Symbol in einem leicht blauen Rahmen gestaltet. Auf sehr schmalen Bildschirmen (bis 360 CSS-Pixel Breite) wird nur das Versionsbadge verborgen. Auf Tablets bleiben im Kopfbereich der Fahrtag und der Speicherbutton sichtbar; zusätzliche Statusfelder werden dort platzbedingt ausgeblendet, bleiben aber in den Fachansichten erhalten.

## Veränderte Dateien
* `index.html` – eindeutiges SVG-Speichersymbol, neuer CSS-Cache-Parameter, Versionsanzeige
* `assets/huschel-skipper-speicher.css` – Kontrast/Fokus und mobile Darstellung des Speicherbuttons
* Diese zusätzliche README zum Fix

Alle übrigen Dateien sind bitidentisch zur V1.0.5-Testversion. Supabase muss nicht geändert werden.

## Installation und Test
1. Lade die beiden veränderten Dateien in die identischen Pfade des GitHub-Pages-Repositories. Die vollständige ZIP kann stattdessen komplett hochgeladen werden.
2. Safari/Startbildschirm-App vollständig neu laden, gegebenenfalls den Website-Cache leeren.
3. Oben im hellen Kopfbereich neben der Versionsanzeige sollte ein blau umrandetes Speichersymbol sichtbar sein. Darauf tippen → separate Speicherseite; Zurück funktioniert.
4. GitHub Laden/Speichern nur mit deinen echten Daten prüfen.

V1.0.5.1 ist eine Testversion, bis der Nutzer sie freigibt.
