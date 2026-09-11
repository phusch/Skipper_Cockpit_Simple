# Friesland Skipper Cockpit Simple V1.0.4 Final

**Verbindlicher Stand:** Diese V1.0.4 Final ist zugleich die abgeschlossene Endversion der Friesland-Tour 2026 und die stabile MASTER-/Weiterarbeitungsbasis. Spätere Änderungen müssen auf genau dieser Version aufbauen, sofern nicht ausdrücklich eine neuere Basis festgelegt wird.

## V1.0.4 Final – gefahrene Tour und Tag 9

- Der veröffentlichte Stand in `friesland-current.json` enthält die tatsächlich während der Tour gewählten Original- und Alternativrouten.
- Ein neuer veröffentlichter Routenstand wird beim Öffnen einmalig übernommen. Auf einem bestehenden Gerät werden dabei ausschließlich Routenwahl, Alternativrouten und zugehörige Routeninformationen aktualisiert; Bunkern, Runner und andere lokale Arbeitsdaten bleiben erhalten.
- **Tag 9 · Lytse Griene → Sneek** dokumentiert die tatsächlich gefahrene Rückfahrt zur Schiffsabgabe mit 12,1 km und 96 GPX-Punkten.
- Die neue T9-Datenbasis liegt additiv in `assets/route-t9-data.js`; die sieben bisherigen Standardrouten und ihre GPX-Dateien bleiben unverändert.
- Die hochgeladene T9-GPX liegt unverändert als `routes/T9 Lytse Griene - Sneek.gpx` bei.

Hinweis: Die Fahrtagauswahl folgt der Reisedokumentation **1–7 und 9**. Ein Tag 8 wird nicht erfunden, weil dafür keine Route bereitgestellt wurde.

## Neuer, strikt getrennter Ableger

Diese Version ist der **separate finale Simple-Ableger** der funktionierenden V0.19.x-Reise-App. Sie verwendet eine neue Bedienoberfläche, übernimmt aber bewusst die bestehende technische Logik für Routen, GPX, Waterkaarten, GPS, Wetter, Nautik, Runner, Tagesinformationen, Landgang, Nachtplätze/Hafenmeister, Bunkern, Speicherung, Einstellungen, Schiffsprofil, Hilfe und Routenverwaltung.

- Neue Hauptnavigation: **HEUTE | FAHREN | WETTER | MEHR**
- **HEUTE** bündelt Tagesroute, Aktion, Nachtplatz, Wetter-Kurzstatus und relevante Tageskarten.
- **PLAN ÄNDERN** verwendet für die tatsächlich aktive Navigationsroute ausschließlich die bereits vorhandene lokale Routenwahl.
- Bestehende optische Tagesentscheidungen (z. B. PLAN A/B oder RECHTZEITIG/SPÄT) bleiben in V1.0.4 ausdrücklich **nicht** mit einer GPX gekoppelt und erhalten keine neue Speicherlogik.
- Nachtplatz-Plan A/B/C/Reserve bleibt zunächst Informationslogik; es wird keine neue dauerhafte Auswahl eingeführt.
- Technische Routenverwaltung bleibt vollständig vorhanden und liegt unter **FAHREN → ROUTE VERWALTEN**.
- Die alte Sidebar bleibt im Quellbestand erhalten, wird in der Simple-Oberfläche aber ausgeblendet.
- `assets/app.css` und die bestehende Fachlogik bleiben erhalten. In `assets/app.js` wurde für V1.0.4 ausschließlich die sichtbare Fahrtagsfolge um Tag 9 ergänzt; die neue Oberfläche bleibt in `assets/simple-ui.js` und `assets/simple-ui.css` getrennt.
- Der `.git`-Ordner der alten App wurde **nicht** in diesen Ableger übernommen. Für dieses Projekt muss ein neues GitHub-Repository verwendet werden.


## Neu in V1.0.3 Test – manueller iCloud-Backuptransfer

- **Keine automatische Synchronisation und kein Supabase.** Die App bleibt offline-first und speichert wie bisher lokal im Browser.
- Unter **MEHR → DATEN & BACKUP** kann der gesamte relevante lokale App-Zustand als eine JSON-Datei exportiert werden.
- Auf iPhone/iPad wird – sofern vom Browser unterstützt – der System-Teilen-Dialog verwendet. Dort kann die JSON über **„In Dateien sichern“** in einen iCloud-Drive-Ordner gelegt werden. Als Fallback wird eine normale JSON-Datei heruntergeladen.
- Ein Backup kann auf dem iPad oder iPhone wieder importiert werden. Vor der Übernahme werden App-Version, Erstellungszeitpunkt und enthaltene Daten angezeigt.
- Vor jedem Import wird der aktuelle lokale Zustand automatisch als **einmalige Rücksicherung für diese App-Sitzung** gespeichert. Der letzte Import kann über **„LETZTEN IMPORT RÜCKGÄNGIG MACHEN“** zurückgenommen werden.
- Der Export umfasst die bestehenden `fsc_...`-Speicherdaten (u. a. Schiffsprofil, Routenwahl, importierte Waterkaarten-Alternativen, Tour-/Routeninfos, Bunkern und Runner-Caches). Interne Backup-Metadaten und die Rücksicherung selbst werden nicht mit exportiert.
- Fest eingebaute Programmdateien, Standard-GPX, Routendaten, Wetter-/Nautiklogik und statische Reisedaten werden durch Export oder Import nicht verändert.

## Bestandsschutz V1.0.3 Test

Unverändert übernommen werden insbesondere alle Original-GPX, Routendaten, Tourinformationen, Runner-Daten, Nachtplatz-/Hafenmeisterdaten, Bunkerdaten, Bilder, bestehende Speicher-Schlüssel und die vorhandene Fachlogik.

---

## Technische Herkunft der Ausgangsbasis

## Runner-Reiter – additive Erweiterung

1. **Eigener Runner-Bereich**
   - Neuer Hauptmenüpunkt `RUNNER`, ohne Änderung der bestehenden Skipper-Funktionen.
   - Fahrtage 3, 5 und 6 enthalten die geprüften Runner-Korridore; Tag 1 bleibt bewusst frei.
   - Tag 3 bietet Standardroute IJlst–Sneek sowie die separate Bolsward-Alternative Workum–Parrega–Tjerkwerd.

2. **Boot und Läufer auf einer Karte**
   - Türkis zeigt den exakten Wasser-Teilabschnitt aus den vom Nutzer bereitgestellten Waterkaarten-GPX-Dateien.
   - Grün gestrichelt zeigt die Runner-Fußroute. Sie wird online aus dem aktuellen OpenStreetMap-Wegenetz berechnet.
   - START und PICKUP werden deutlich markiert. FULL/SHORT kann je nach Strecke gewählt werden.

3. **Synchronisationskontrolle**
   - Planungsannahme: Artemis und Läufer bewegen sich ungefähr gleich schnell.
   - Die App vergleicht deshalb Wasser-km und Lauf-km und zeigt die Distanzdifferenz in km und Prozent.
   - Geroutete Fußwege werden lokal im Browser zwischengespeichert und können anschließend als Runner-GPX gesichert werden.

4. **Bestandsschutz**
   - Basis ist die am 14.08.2026 erneut aus GitHub gezippte App. Ein Dateivergleich bestätigte, dass ihre Nutzdateien der V0.18.5 entsprechen.
   - `assets/app.js`, `assets/routes-data.js`, die sieben bestehenden Standard-GPX, Wetter-, Nautik-, Waterkaarten-, Tagesplan-, Landgang-, Nachtplatz-, Bunker- und Speicherlogik wurden funktional nicht verändert.
   - Neu sind ausschließlich `assets/runner-data.js`, `assets/runner.js`, der zusätzliche Runner-Reiter sowie dessen CSS. Versions-/Cache-Hinweise und README/Manifest wurden auf V0.19.0 aktualisiert.

---

## Bisheriger Stand V0.18.5

## Home-Bildschirmicon für iPad und iPhone

- Das neue SkipperCockpit-Icon ist als Apple-Touch-Icon und in den Web-App-Standardgrößen 192 × 192 und 512 × 512 Pixel eingebunden.
- Beim Hinzufügen der App zum Home-Bildschirm verwendet iPadOS beziehungsweise iOS das neue Icon.
- Für eine bereits vorhandene Home-Bildschirmverknüpfung muss das alte Symbol einmal entfernt und die App anschließend über Safari erneut zum Home-Bildschirm hinzugefügt werden.

## Bestandsschutz

V0.18.5 ergänzt ausschließlich die Icondateien und deren Verknüpfung in `index.html` und `manifest.webmanifest`. Sämtliche Funktionen, Daten, Routen, Bilder und GPX-Dateien der V0.18.4 bleiben unverändert erhalten.

---

## Bisheriger Stand V0.18.4

## Bunkerliste mit dauerhafter lokaler Speicherung

1. **Neuer Hauptmenüpunkt Bunkern**
   - Die bereinigte Grundliste ist fest in der App enthalten und vollständig offline verfügbar.
   - Sie umfasst Dokumente & Kontakte, Navigation & Sicherheit, Elektronik & Strom, Kleidung & Persönliches, Küche & Grill, Baden & Freizeit sowie die Prüfungen bei der Bootsübernahme.
   - Lebensmittel und Getränke werden bewusst außerhalb der App geplant.

2. **Abhaken und verteilen**
   - Jeder Eintrag kann einzeln abgehakt werden.
   - Menge beziehungsweise Hinweis und zuständige Person lassen sich direkt ergänzen.
   - Fortschrittsanzeige sowie die Filter Alle, Offen und Erledigt erleichtern den Überblick.

3. **Eigene Ergänzungen**
   - Zusätzliche Einträge können einer vorhandenen Kategorie zugeordnet werden.
   - Eigene Einträge lassen sich wieder einzeln löschen.
   - „Liste zurücksetzen“ entfernt Häkchen, Mengen und Zuständigkeiten, lässt eigene Ergänzungen jedoch bestehen.

4. **Speicherung**
   - Häkchen, Mengen, Zuständigkeiten und eigene Ergänzungen werden nach jeder Änderung automatisch im lokalen Browserspeicher des Geräts gesichert.
   - Die stabilen Eintrags-IDs sorgen dafür, dass gespeicherte Angaben auch nach einem normalen App-Update wieder den richtigen Grundlisteneinträgen zugeordnet werden.
   - Die Daten werden nicht zwischen iPad, iPhone und MacBook synchronisiert und können beim Löschen der Websitedaten verloren gehen.

## Bestandsschutz

V0.18.4 ergänzt ausschließlich den Hauptmenüpunkt Bunkern und dessen getrennte Daten- und Speicherlogik. `assets/app.js`, sämtliche Routen- und Informationsdaten, alle Bilder und alle sieben GPX-Dateien bleiben gegenüber V0.18.3 unverändert.

---

## Bisheriger Stand V0.18.3

## Integrierte Hilfe und Bedienungsanleitung

1. **Neuer Hauptmenüpunkt Hilfe**
   - Die Bedienungsanleitung ist direkt in der App erreichbar und vollständig offline verfügbar.
   - Ein Schnellstart erklärt den täglichen Ablauf von der Fahrtagauswahl bis zur Navigation in Waterkaarten.
   - Aufklappbare Abschnitte erläutern Cockpit, Tagesplan, Landgang, Nachtplätze, Wetter, Nautik, Karte, GPS, Waterkaarten-Alternativen, Tour-Routeninfos und Schiffsprofil.

2. **Speicherung und Sicherheit verständlich erklärt**
   - Die Hilfeseite unterscheidet fest eingebaute Inhalte, lokale Browserdaten und Funktionen mit Internetbedarf.
   - Eine kurze Anleitung beschreibt die Installation auf dem iPad- und iPhone-Home-Bildschirm.
   - Der sichtbare Sicherheitshinweis stellt klar, dass das Cockpit eine Planungshilfe ist und keine amtliche Navigation ersetzt.

## Bestandsschutz

V0.18.3 ergänzt ausschließlich den Hauptmenüpunkt und die statische Hilfeseite. Sämtliche Funktionen, Daten, Routen, GPX-Dateien und Inhalte der freigegebenen MASTER V0.18.2 bleiben unverändert erhalten.

---

## Bisheriger Stand V0.18.2

## Orts- und Kartenlinks im Tagesplan

1. **Links je Fahrtag**
   - Der Tagesplan zeigt zu den jeweils relevanten Orten und Naturzielen eigene Schaltflächen für Ortsinformationen und Google Maps.
   - Die Linkzuordnung liegt dauerhaft in `assets/day-place-links.js` und ist damit auf jedem Gerät Bestandteil der App.
   - Die Tagesplantexte bleiben offline verfügbar; nur das Öffnen externer Orts- und Kartenlinks benötigt Internet.

2. **Cockpit-Navigation bereinigt**
   - Der bisher nicht verknüpfte Tagesplan-Button rechts unten im Cockpit wurde entfernt.
   - Der Tagesplan bleibt unverändert über das Hauptmenü erreichbar.

## Bestandsschutz

V0.18.2 ergänzt ausschließlich die Tagesplan-Verlinkungen und bereinigt den redundanten Cockpit-Button. Sämtliche Funktionen und Daten der V0.18.1 – einschließlich Nachtplätze, Tagesplan, Landgang, Wetter, Nautik, Karte, GPX, Waterkaarten-Alternativen, Schiffsprofil, GPS und iPhone-Querformat – bleiben erhalten.

---

## Bisheriger Stand V0.18.1

## Nachtplätze mit Fotos und praktischen Informationen

1. **Ausführliche Nachtplatzansicht**
   - Für alle sieben Fahrtage gibt es eine eigene Nachtplatzkarte mit Charakter, Liegeart, Versorgung, Anlegetaktik und Reserveplan.
   - Workum, Marchjepolle, Giethoorn und Sloten werden mit echten Ortsfotos gezeigt; die Naturplätze erhalten ein gekennzeichnetes Friesland-Stimmungsfoto.
   - Direkte Karten- und Quellenlinks erleichtern die Kontrolle am Fahrtag.

2. **Aktueller Informationsstand**
   - Workum enthält die kommunalen Gebühren und Sanitärzeiten mit Stand 10.08.2026.
   - Giethoorn enthält die veröffentlichte Saison und die Passantentarife 2026.
   - SN38A Longschar enthält Liegekantenlänge, Aufenthaltsdauer und die vorhandene beziehungsweise fehlende Infrastruktur.
   - Naturplätze bleiben ausdrücklich Zielgebiete: Belegung, Beschilderung, Wassertiefe, Windlage und Eignung für Artemis werden vor Ort geprüft.

3. **Dauerhaft und offline**
   - Texte liegen fest in `assets/night-info-data.js`.
   - Alle fünf Bilddateien liegen lokal unter `assets/nightplaces/` und benötigen nach der Installation keine Internetverbindung.
   - Bilder stammen aus Wikimedia Commons und enthalten sichtbare Urheber- und Lizenzhinweise; Details stehen zusätzlich in `IMAGE-LICENSES.md`.

## Bestandsschutz

V0.18.1 ergänzt ausschließlich den Reiter Nachtplätze. Alle Funktionen und Daten der V0.18.0 – einschließlich Tagesplan, Landgang, Wetter, Nautik, Karte, GPX, Waterkaarten-Alternativen, Schiffsprofil, GPS und iPhone-Querformat – bleiben erhalten.

---

## Bisheriger Stand V0.18.0

## Tagesplan und Landgang ausführlich dargestellt

1. **Reiter Tagesplan**
   - Der ausgewählte Fahrtag wird als vollständiger Ablauf dargestellt: Tagesziel, Schwerpunkte, Gewässerfolge, wichtige Passagen, Landgänge, Nachtziel und Reservetaktik.
   - Alle sieben Tage sind direkt im Reiter auswählbar.
   - Die Anzeige verwendet die jeweils aktive Route und berücksichtigt damit auch eine ausgewählte Waterkaarten-Alternative mit importierten Routeninfos.

2. **Reiter Landgang**
   - Die bereits vorhandenen ausführlichen Landganginformationen werden als einzelne, gut lesbare Karten angezeigt.
   - Die Karten werden in Stopp & Landgang, Erleben, Essen & Trinken, Versorgung und Reserve gegliedert.
   - Nachtziel und Reservetaktik des gewählten Fahrtags bleiben direkt sichtbar.

3. **Dauerhafte Speicherung**
   - Die Informationen der sieben Standardrouten bleiben Bestandteil von `assets/tour-info-data.js` und werden nicht nur im Browserspeicher abgelegt.
   - Sie sind nach einer Installation oder GitHub-Bereitstellung auf iPad, iPhone und MacBook vorhanden und funktionieren ohne Internet.
   - Lokale Tour-Updates oder Alternativrouten können weiterhin darüberliegen. Nach dem Entfernen eines lokalen Updates erscheint wieder die dauerhaft integrierte Fassung.

## Bestandsschutz

V0.18.0 erweitert ausschließlich die Darstellung der vorhandenen Informationen. Alle Funktionen und Daten der freigegebenen MASTER V0.17.3 – einschließlich Wetter, Nautik, Karte, GPX, Waterkaarten-Alternativen, Schiffsprofil, GPS und iPhone-Querformat – bleiben erhalten.

---

## Bisheriger Stand V0.17.3

## Fehlerkorrekturen gegenüber der getesteten V0.17.2

1. **Skipper-Hinweise wieder vollständig lesbar**
   - Die Anzeige verarbeitet sowohl das ältere dreiteilige Listenformat als auch das neue Objektformat der dauerhaft integrierten Tourinfos.
   - `undefined` wird nicht mehr anstelle von Status, Überschrift oder Hinweistext ausgegeben.

2. **Kompakte iPhone-Navigation im Querformat**
   - Die linke Kategorienleiste wird auf Smartphones im Querformat als schmale Symbolleiste oberhalb des Inhalts dargestellt.
   - Alle acht Kategorien bleiben direkt erreichbar, ohne die Inhaltsfläche seitlich zu verdrängen.
   - iPad- und Desktop-Darstellung bleiben unverändert.

## Bestandsschutz

Die Korrektur ist additiv. Alle sieben Standard-GPX, `assets/routes-data.js`, die dauerhaft integrierten Tourinfos, Waterkaarten-Alternativen, Wetter-, Karten-, GPS- und Nautikfunktionen bleiben erhalten.

---

## Bisheriger Stand V0.17.2

## Additive Erweiterung gegenüber der getesteten V0.17.1

1. **Tour-Routeninfos dauerhaft integriert**
   - Das geprüfte Informationspaket für alle sieben Standardrouten ist jetzt Bestandteil der App.
   - Landgang, Gewässer, Passagen, Nautik und Skipperbriefing erscheinen auf iPad und MacBook ohne vorherigen Import.
   - Die integrierten Informationen benötigen weder Supabase noch eine andere Cloudverbindung.

2. **Dreistufige, rückbaubare Datenebene**
   - Ein später importiertes Tour-Paket hat als lokale Aktualisierung Vorrang.
   - Wird diese Aktualisierung entfernt, erscheinen wieder die dauerhaft integrierten Tourinfos.
   - Werden auch die integrierten Infos ausgeblendet, erscheinen die unveränderten Originalinformationen aus `assets/routes-data.js`.
   - „Tour-Infos wiederherstellen“ aktiviert die integrierte Ebene erneut.

3. **Geräte- und Bestandsschutz**
   - Die integrierten Informationen liegen in `assets/tour-info-data.js` und reisen mit jeder ZIP bzw. GitHub-Bereitstellung mit.
   - Das Löschen lokaler Browserdaten entfernt höchstens lokale Updates und Ausblendungen; die integrierte Informationsebene erscheint danach automatisch wieder.
   - Die sieben Original-GPX und `assets/routes-data.js` bleiben unverändert.

## Bestandsschutz

Alle Funktionen der getesteten V0.17.1 einschließlich Waterkaarten-Alternativen, Einzelanalyse, Tour-Analyse, JSON-Import, Wetter, Karten, GPS, Nautik und GPX-Download bleiben erhalten.

---

## Bisheriger Stand V0.17.1

## Additive Erweiterung gegenüber der getesteten V0.17.0

1. **Ein Analysepaket für alle sieben Standardrouten**
   - „Tour-Analysepaket“ exportiert die sieben eingebauten Originalrouten gemeinsam als JSON.
   - Enthalten sind ausschließlich Routengeometrie, Fahrtage, Planwerte und Schiffsprofil; die aktuelle GPS-Position wird nicht exportiert.
   - Der Rechercheauftrag legt besonderen Wert auf konkrete Landgangtipps, Versorgung, Gastronomie, Sehenswürdigkeiten und Aktivitäten nahe sinnvoller Anlegeplätze.

2. **Ein Tour-Routeninfopaket importieren**
   - Ein gemeinsames `fsc-tour-info-v1`-Paket ergänzt alle sieben Standardrouten in einem Schritt.
   - Alle sieben Fahrtage und GPX-Fingerabdrücke werden vollständig geprüft, bevor etwas gespeichert wird. Bei nur einem Fehler wird das gesamte Paket abgewiesen.
   - Angereicherte Standardrouten verhalten sich in Karte, Wetter, GPS, Nautik, Tagesdetails und GPX-Download weiterhin wie normale Originalrouten.

3. **Getrennte, lokale und rückbaubare Zusatzebene**
   - Die importierten Texte liegen separat im lokalen Browserspeicher; `assets/routes-data.js` und alle Original-GPX bleiben unverändert.
   - Informationen können je Fahrtag oder gemeinsam entfernt werden. Danach erscheinen sofort wieder die exakt eingebauten Originalinformationen.
   - Der bestehende Einzelworkflow für Waterkaarten-Alternativrouten bleibt erhalten.

## Bestandsschutz

Alle Funktionen, Inhalte, Wetter-, Karten-, GPS-, Nautik-, GPX- und Alternativroutenfunktionen der getesteten V0.17.0 bleiben erhalten. Die Erweiterung betrifft ausschließlich eine zusätzliche lokale Informationsebene für Standardrouten.

---

## Bisheriger Stand V0.17.0

## Additive Erweiterung gegenüber der getesteten V0.16.0

1. **Analysepaket für ChatGPT**
   - Die aktive Waterkaarten-Alternative kann als kompaktes JSON-Analysepaket gesichert werden.
   - Enthalten sind Fahrtag, Datum, Route, Stichproben der GPX-Geometrie, automatische Basisdaten und das Schiffsprofil.
   - Die aktuelle GPS-Position des Benutzers wird nicht exportiert.

2. **Routeninformationspaket importieren**
   - Von ChatGPT erstellte Informationen können als JSON wieder in die passende Alternativroute importiert werden.
   - Übernommen werden Routentitel, Beschreibung, Ziel-/Nachtplatzhinweis, Gewässer, Passagen, Landgang, Nautik und Skipperbriefing.
   - Fahrtag und ein Fingerabdruck der GPX müssen exakt passen; falsche Pakete werden abgewiesen.

3. **Rückbaubar und lokal**
   - Importierte Informationen werden ausschließlich lokal mit der Alternativroute gespeichert.
   - Sie können separat entfernt werden, ohne GPX, automatische Basisdaten oder Originalroute zu verändern.
   - Ein erneuter Import ersetzt bestehende Informationen nur nach Bestätigung.

## Bestandsschutz

Die GPX-Import-, Auswahl-, Wetter-, Karten-, GPS- und Nautikfunktionen der
getesteten V0.16.0 bleiben erhalten. Alle sieben Original-GPX und
`assets/routes-data.js` bleiben unverändert.

---

## Bisheriger Stand V0.16.0

## Additive Erweiterung gegenüber der freigegebenen MASTER V0.15.2

1. **Automatische Basisinformationen für importierte Alternativrouten**
   - Start und Ziel werden aus den GPX-Koordinaten bestimmt.
   - Ortsnamen werden einmalig über OpenStreetMap/Nominatim ermittelt und lokal mit der Alternative gespeichert.
   - Distanz und Punktzahl stammen direkt aus der importierten GPX.
   - Die Plan-Fahrzeit wird transparent mit 8 km/h und auf fünf Minuten gerundet berechnet.

2. **Wetter entlang der Alternativroute**
   - Wetter wird getrennt für Start, Routenmitte und Ziel geladen.
   - Innerhalb des Prognosefensters wird der tatsächliche Fahrtag verwendet.
   - Außerhalb des Prognosefensters werden eindeutig gekennzeichnete aktuelle Live-Werte angezeigt.
   - Wind, Böen, Regen und eine Ampel-Risikoeinschätzung werden dargestellt.

3. **Offline- und Bestandsschutz**
   - Bei fehlendem Internet bleiben importierte GPX, gespeicherte Ortsdaten und Routenauswahl nutzbar; neue Karten-, Orts- und Wetterdaten benötigen Internet.
   - Fehler externer Dienste werden sichtbar angezeigt und erzeugen keine erfundenen Werte.
   - Die sieben Originalrouten und sämtliche Original-GPX bleiben unverändert.

### Bestandsschutz V0.16.0

Alle Funktionen, Inhalte, Karten, GPS, Nautik, Schiffsprofil, Skipperbriefing,
Landgänge, Nachtplätze und das Layout der freigegebenen MASTER V0.15.2 bleiben
erhalten. Die V0.16.0 erweitert ausschließlich importierte GPX-Alternativrouten.

---

## Bisheriger Stand V0.15.2

## Additive Erweiterung gegenüber der freigegebenen MASTER V0.14.1

1. **Eine Waterkaarten-GPX-Alternative pro Fahrtag**
   - GPX-Datei über die lokale Dateiauswahl auf iPad/Mac importieren.
   - Alternative wird ausschließlich lokal im Browser dem aktuellen Fahrtag zugeordnet.
   - Originalroute und alle sieben Original-GPX-Dateien bleiben unverändert.

2. **Freie Routenauswahl**
   - Jeder Fahrtag kann zwischen Originalroute und gespeicherter Alternative wechseln.
   - Die aktive Route wird auf Karte, bei Distanz, GPX-Download, Wetterpunkt, GPS-Abstand und Nautikscan verwendet.
   - Die Alternative kann gelöscht werden; anschließend ist automatisch wieder die Originalroute aktiv.

3. **Sichere erste Ausbaustufe**
   - GPX-Name, Streckenverlauf, Punktzahl und Distanz werden beim Import übernommen bzw. berechnet.
   - Weitere automatisch erzeugte Basisinformationen folgen bewusst in einem getrennten zweiten Schritt.

### Bestandsschutz V0.15.2

Alle Funktionen, Inhalte, sieben Original-GPX, Karten, GPS, Nautik, Schiffsprofil,
Skipperbriefing, Landgänge, Nachtplätze und das bestehende Layout aus V0.14.1
bleiben erhalten. Die neue Funktion ist additiv und lokal rückbaubar.

---

## Bisheriger Stand V0.14.1

Fehlerkorrektur auf Basis V0.14, weiterhin additiv zum Master V0.13.2.

## Korrigiert
1. **Tagesauswahl auf GitHub Pages/iPad**
   - eigene CSS/JS-Dateien werden jetzt mit Versionsparameter geladen (`?v=0.14.1`), damit Safari/GitHub keine ältere V0.13/V0.12-Datei aus dem Cache verwendet.
   - alte Tagesleiste und Sidebar-Tageswahl werden zusätzlich über eine kleine kritische Inline-Regel ausgeblendet.
   - Kopfzeilen-Tageswahl nutzt explizite DOM-Zugriffe für Safari.

2. **Open-Meteo Wetter**
   - ein JavaScript-Namenskonflikt zwischen der Funktion `weatherRisk()` und dem DOM-Element `id="weatherRisk"` wurde behoben.
   - dieser Fehler trat erst NACH erfolgreicher Wetterabfrage auf und wurde fälschlich als „Online-Wetter nicht erreichbar“ angezeigt.
   - Wetter-Buttons sind jetzt explizit an ihre DOM-Elemente gebunden.
   - Fehlermeldungen zeigen künftig den tatsächlichen Fehlertext an.

3. **IJsselmeer-Seewetter**
   - wird wieder ausgeführt, sobald der normale Wetterblock erfolgreich verarbeitet wurde.

## Unverändert
Alle Funktionen, Inhalte, sieben Original-GPX, Karten, GPS, Nautik, Schiffsprofil,
Skipperbrief, Landgang, Nachtplätze und das Layout des Masters V0.13.2 bleiben erhalten.


## V0.19.1 – iPhone Hochformat
Reiner Darstellungs-Fix für iPhone im Hochformat: kompakter Header und zweizeilige, horizontal wischbare Navigation. Skipper- und Runner-Funktionalität unverändert.


## Neu in V1.0.3 Test – veröffentlichter Crew-Stand

- `friesland-current.json` enthält den aktuell veröffentlichten Reise-/Bunker-Datenstand.
- Auf einem wirklich neuen Gerät ohne vorhandene `fsc_`-Daten wird dieser Stand einmalig automatisch als Startstand geladen.
- Bestehende lokale Daten werden beim normalen App-Start niemals automatisch überschrieben.
- Über **CREW-STAND LADEN** kann der aktuelle GitHub-Stand bewusst geladen, geprüft und anschließend wie ein normaler Backup-Import übernommen werden.
- Zum Aktualisieren des veröffentlichten Crew-Stands genügt es, im GitHub-Repository `friesland-current.json` durch ein neues, gültiges App-Backup zu ersetzen; der Dateiname bleibt gleich.
- Die bestehende manuelle iCloud-Export-/Import-Funktion bleibt unverändert erhalten.
