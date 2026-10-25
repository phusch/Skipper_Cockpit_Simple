/* Huschel App Speicher für Friesland Skipper Cockpit Simple V1.0.5 TEST.
   Additive cloud/local/JSON module; original app scripts and crew backup stay untouched. */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PROJECT = 'https://qijordwpbwwbizfcslrv.supabase.co';
const FUNCTION = 'github-app-storage';
const APP_ID = 'skipper-cockpit-simple';
const AUTH_UID = '9be7d1bc-4d69-4cb8-bb42-cb2d3c705f75';
const KEY_SETTING = 'huschel-skipper-publishable-v1';
const EMAIL_SETTING = 'huschel-skipper-email-v1';
const SESSION_SETTING = 'huschel-skipper-auth-v1';
const SNAPSHOT_SETTING = 'huschel-skipper-local-snapshot-v1';
const ROLLBACK_SETTING = 'huschel-skipper-import-rollback-v1';
const $ = id => document.getElementById(id);
const backup = window.FSC_SIMPLE_BACKUP;
let supabase = null, activeKey = null, loggedIn = false, busy = false;
let remoteSha, remoteRev = 0, remoteDate = null, remoteData = null, remoteExists = false;
let previousScroll = 0;

function now() { return new Date().toISOString(); }
function formatDate(value) {
  if (!value || !Number.isFinite(Date.parse(value))) return '–';
  return new Date(value).toLocaleString('de-DE', {dateStyle:'medium',timeStyle:'short'});
}
function message(value) { $('hsMessage').textContent = String(value); }
function lamp(value, kind = 'warn') {
  $('hsLamp').className = 'hs-lamp' + (kind === 'ok' ? ' ok' : kind === 'error' ? ' error' : '');
  $('hsLamp').textContent = (kind === 'ok' ? '🟢 ' : kind === 'error' ? '🔴 ' : '🟡 ') + value;
}
function meta() {
  $('hsMeta').textContent = 'Privates GitHub · Revision: ' +
   (remoteSha === undefined ? 'nicht geprüft' : remoteRev) + ' · Letzte Speicherung: ' + formatDate(remoteDate);
}
function loginState(yes, email='', info='') {
  loggedIn = yes;
  $('hsAuthInputs').hidden = yes;
  $('hsSigned').hidden = !yes;
  $('hsAuthPanel').classList.toggle('signed', yes);
  $('hsAuthStatus').className = 'hs-auth-status' + (yes ? ' ok' : info.startsWith('🔴') ? ' error' : '');
  $('hsAuthStatus').textContent = yes ? '🟢 Angemeldet · Supabase-Zugang aktiv' : info || '⚪ Nicht angemeldet';
  $('hsSignedEmail').textContent = yes ? 'Angemeldet als ' + email : '';
}
function validate(input) {
  if (!backup?.validateBackup) throw Error('Das bestehende Backup-Modul ist nicht verfügbar. Bitte alle App-Dateien veröffentlichen.');
  return backup.validateBackup(input);
}
function capture() {
  if (!backup?.buildBackup) throw Error('Die Original-Speicheranbindung ist nicht verfügbar.');
  return validate(backup.buildBackup());
}
function contents(input) {
  const data = validate(input);
  return JSON.stringify(Object.keys(data.storage).sort().map(k => [k, data.storage[k]]));
}
function same(a,b) { try { return contents(a) === contents(b); } catch { return false; } }
function updateLamp() {
  if (busy) return;
  if (remoteSha === undefined) lamp('GitHub-Speicherstand noch nicht geprüft · zuerst GitHub Laden');
  else if (!remoteExists) lamp('Auf GitHub liegt noch kein Skipper-Cockpit-Datensatz');
  else if (same(capture(),remoteData)) lamp('Aktuelle Skipper-Daten sicher auf GitHub gespeichert','ok');
  else lamp('Lokale Skipper-Daten unterscheiden sich von der letzten GitHub-Sicherung');
}
function remoteInfo(response) {
  remoteSha = response.sha ?? null;
  remoteRev = Number(response.revision || 0);
  remoteDate = response.savedAt || null;
  remoteExists = Boolean(response.exists);
  remoteData = remoteExists ? response.data : null;
  meta();
}
function cancelled(action) {
  lamp(action + ' bewusst abgebrochen · keine Daten geändert');
  message(action + ' wurde von dir abgebrochen. Die aktuellen lokalen Skipper-Daten und die private GitHub-Datei bleiben unverändert.');
}
async function task(name, operation) {
  if (busy) return;
  busy = true;
  const buttons = [...document.querySelectorAll('#hsView button')];
  buttons.forEach(b=>b.disabled=true);
  try { await operation(); }
  catch (err) {
    const detail = String(err?.message || err || 'Unbekannter Fehler');
    if (name === 'Anmeldung') { loginState(false,'','🔴 Anmeldung fehlgeschlagen'); $('hsPass').value=''; }
    lamp(name + ' fehlgeschlagen', 'error');
    message(name + ' fehlgeschlagen: ' + detail + '\nDeine Skipper-Daten wurden dadurch nicht absichtlich verändert.');
  } finally {
    busy = false;
    buttons.forEach(b=>b.disabled=false);
  }
}
function newClient(key) {
  if (supabase && activeKey === key) return supabase;
  const previous = supabase;
  const current = createClient(PROJECT,key, {
    auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:false, storageKey:SESSION_SETTING }
  });
  supabase = current; activeKey = key;
  if (previous && previous !== current) void previous.auth.stopAutoRefresh();
  current.auth.onAuthStateChange((event)=>{
    if (current === supabase && event === 'SIGNED_OUT') loginState(false);
  });
  return current;
}
async function restoreSession() {
  const key = $('hsKey').value.trim();
  if (!key.startsWith('sb_publishable_')) return;
  const current = newClient(key);
  $('hsAuthStatus').textContent = '🟡 Gespeicherte Anmeldung wird geprüft …';
  try {
    const {data:session,error:se} = await current.auth.getSession();
    if (current !== supabase) return;
    if (se) throw se;
    if (!session.session) { loginState(false); return; }
    const {data,error} = await current.auth.getUser();
    if (current !== supabase) return;
    if (error || data.user?.id !== AUTH_UID) {
      await current.auth.signOut({scope:'local'});
      throw error || Error('Dieses Benutzerkonto ist nicht freigeschaltet.');
    }
    loginState(true, data.user.email || $('hsEmail').value.trim());
    message('Anmeldung automatisch wiederhergestellt. GitHub Laden prüft den aktuellen Revisionsstand.');
  } catch(err) {
    if (current !== supabase) return;
    loginState(false,'','🔴 Automatische Anmeldung nicht möglich');
    message('Bitte erneut anmelden: '+(err?.message || err));
  }
}
async function invoke(payload) {
  if (!loggedIn || !supabase) throw Error('Bitte zuerst bei Supabase anmelden.');
  const {data,error} = await supabase.functions.invoke(FUNCTION,{body:payload});
  if (error) {
    let detail = error.message || 'GitHub/Supabase-Verbindung fehlgeschlagen';
    if (error.context instanceof Response) {
      detail += ' (HTTP '+error.context.status+')';
      try {
        const response = await error.context.json();
        detail += ': ' + (response.error || response.message || JSON.stringify(response));
      } catch {}
    }
    throw Error(detail);
  }
  if (!data?.ok) throw Error(data?.error || 'Ungültige Antwort der Supabase-Speicherfunktion.');
  return data;
}
function storePayload(data) {
  const backupValue = validate(data);
  const values = backupValue.storage;
  const old = capture().storage;
  if (Object.keys(values).length === 0 && Object.keys(old).length > 0) {
    throw Error('Dieses Backup enthält keine veränderlichen Skipper-Daten. Dein vorhandener lokaler Datenstand wurde geschützt.');
  }
  // Keep one-session rollback separate from the original iCloud import feature.
  sessionStorage.setItem(ROLLBACK_SETTING,JSON.stringify({savedAt:now(),storage:old}));
  const liveKeys = Object.keys(old);
  try {
    for (const key of liveKeys) localStorage.removeItem(key);
    for (const [key,value] of Object.entries(values)) localStorage.setItem(key,value);
  } catch(err) {
    for (const key of Object.keys(values)) localStorage.removeItem(key);
    for (const [key,value] of Object.entries(old)) localStorage.setItem(key,value);
    throw Error('Lokales Laden fehlgeschlagen; ursprünglicher Datenstand wurde soweit möglich wiederhergestellt: '+(err?.message || err));
  }
  // Existing app modules read localStorage on initialization; refresh only after consent.
  location.reload();
}
function downloadBackup(data) {
  const filename = 'Skipper_Cockpit_Simple_Backup_' + now().slice(0,16).replace('T','_').replace(':','') + '.json';
  const file = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(file), link = document.createElement('a');
  link.href=url; link.download=filename; document.body.appendChild(link); link.click(); link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
  message('JSON-Backup '+filename+' erstellt. Bitte die Datei an einem sicheren Ort aufbewahren. GitHub wurde nicht verändert.');
}
$('hsLogin').addEventListener('click',()=>task('Anmeldung',async()=>{
  const key = $('hsKey').value.trim();
  if (!key.startsWith('sb_publishable_')) throw Error('Bitte einen Publishable Key verwenden (sb_publishable_…), keinen Secret Key.');
  const current=newClient(key), email=$('hsEmail').value.trim();
  try {
    const {data,error}=await current.auth.signInWithPassword({email,password:$('hsPass').value});
    if (error) throw error;
    if (data.user?.id !== AUTH_UID) { await current.auth.signOut(); throw Error('Dieses Benutzerkonto ist nicht freigeschaltet.'); }
    loginState(true,data.user.email||email);
    localStorage.setItem(KEY_SETTING,key);
    localStorage.setItem(EMAIL_SETTING,email);
    message('Supabase-Anmeldung erfolgreich. Zum Versionsabgleich bitte zuerst GitHub Laden wählen.');
  } finally { $('hsPass').value=''; }
}));
$('hsLogout').addEventListener('click',()=>task('Abmeldung',async()=>{
  if (supabase) await supabase.auth.signOut();
  remoteSha=undefined;remoteRev=0;remoteDate=null;remoteData=null;remoteExists=false;
  meta();loginState(false);
  lamp('Abgemeldet · GitHub-Speicherstand noch nicht geprüft');
  message('Du bist abgemeldet. Lokale Skipper-Daten und GitHub wurden nicht verändert.');
}));
$('hsGithubLoad').addEventListener('click',()=>task('GitHub Laden',async()=>{
  const data=await invoke({action:'load',app:APP_ID});
  if (data.exists) validate(data.data);
  remoteInfo(data);
  if (!data.exists) {
    lamp('Noch keine private Skipper-Sicherung auf GitHub');
    message('Für skipper-cockpit-simple/data.json existiert noch kein gespeicherter Stand. Deine lokalen Daten bleiben erhalten; mit GitHub Speichern kannst du eine erste Sicherung anlegen.');return;
  }
  if (same(capture(),data.data)) {
    lamp('Lokale Skipper-Daten bereits identisch mit GitHub','ok');
    message('Revision '+remoteRev+' geprüft: Kein Unterschied. Es wurde nichts überschrieben.');return;
  }
  if (!confirm('GitHub Laden ersetzt die lokal gespeicherten Fahrtags-/Routenänderungen, Schiffsprofil-, Bunker- und Runner-Daten durch den privaten GitHub-Stand.\n\nDie festen GPX-Dateien und Programmdaten bleiben unverändert. Bitte vorher bei Bedarf JSON-Backup erstellen.\n\nGitHub-Daten jetzt übernehmen?')) {
    cancelled('GitHub Laden');return;
  }
  lamp('GitHub-Stand wird in den lokalen Speicher übernommen','warn');
  message('Datenübernahme bestätigt. Die App wird anschließend neu geladen.');
  storePayload(data.data);
}));
$('hsGithubSave').addEventListener('click',()=>task('GitHub Speichern',async()=>{
  if (remoteSha === undefined) throw Error('Bitte zuerst GitHub Laden wählen, um die aktuelle GitHub-Dateiversion sicher zu prüfen.');
  const current=capture();
  if (remoteExists && same(current,remoteData)) {
    lamp('Keine neuen Änderungen · GitHub bereits aktuell','ok');
    message('Die aktuellen Skipper-Daten sind identisch mit Revision '+remoteRev+'. Keine neue Revision erstellt.');return;
  }
  if (remoteExists && !confirm('Deine aktuellen Skipper-Daten ersetzen die zuvor geprüfte GitHub-Revision '+remoteRev+'.\n\nBei einem parallelen neueren Speicherstand wird der Server die Änderung blockieren. Jetzt speichern?')) {
    cancelled('GitHub Speichern');return;
  }
  const result=await invoke({action:'save',app:APP_ID,sha:remoteSha,revision:remoteRev,data:current});
  remoteInfo({...result,exists:true,data:current});
  lamp('Skipper-Daten sicher auf GitHub gespeichert','ok');
  message('Erfolgreich unter skipper-cockpit-simple/data.json gespeichert, Revision '+remoteRev+'. Andere Apps und das öffentliche Skipper-Repository wurden nicht verändert.');
}));
$('hsLocalSave').addEventListener('click',()=>task('Lokal Speichern',async()=>{
  const snapshot=capture();
  localStorage.setItem(SNAPSHOT_SETTING,JSON.stringify(snapshot));
  message('Zusätzlicher lokaler Skipper-Schnappschuss gespeichert ('+formatDate(snapshot.createdAt)+'). GitHub wurde nicht verändert.');
  updateLamp();
}));
$('hsLocalLoad').addEventListener('click',()=>task('Lokal Laden',async()=>{
  const raw=localStorage.getItem(SNAPSHOT_SETTING);
  if (!raw) throw Error('Noch kein manueller lokaler Schnappschuss vorhanden.');
  const data=validate(JSON.parse(raw));
  if (same(capture(),data)) {message('Lokaler Schnappschuss und aktuelle Daten sind identisch. Keine Übernahme notwendig.');return;}
  if (!confirm('Den früheren lokalen Schnappschuss wiederherstellen? Aktuelle Fahrtags-/Routen-/Bunker-/Runner-Daten werden dadurch ersetzt. GitHub wird nicht verändert.')) {cancelled('Lokal Laden');return;}
  storePayload(data);
}));
$('hsExport').addEventListener('click',()=>task('JSON-Backup',async()=>{
  downloadBackup(capture());
}));
$('hsImport').addEventListener('click',()=>$('hsFile').click());
$('hsFile').addEventListener('change',async ev=>{
  const file=ev.target.files?.[0];if (!file) return;
  await task('JSON Laden',async()=>{
    if (file.size > 12*1024*1024) throw Error('Backup-Datei ist größer als 12 MB.');
    const data=validate(JSON.parse(await file.text()));
    if (same(capture(),data)) {message('JSON-Datei enthält denselben lokalen Datenstand. Keine Änderung erforderlich.');return;}
    if (!confirm('JSON-Backup „'+file.name+'“ laden? Dies ersetzt die aktuellen lokalen Skipper-Daten; GitHub wird nicht verändert.')) {cancelled('JSON Laden');return;}
    storePayload(data);
  });
  ev.target.value='';
});
$('hsOpen').addEventListener('click',()=>{
  previousScroll=window.scrollY;
  $('hsView').hidden=false;
  document.body.classList.add('hs-open-page');
  meta();updateLamp();window.scrollTo(0,0);
});
function closeView() {
  document.body.classList.remove('hs-open-page');
  $('hsView').hidden=true;
  window.scrollTo(0,previousScroll);
}
$('hsBack').addEventListener('click',closeView);
document.addEventListener('keydown',ev=>{
  if (ev.key === 'Escape' && !$('hsView').hidden) closeView();
});
// Existing local-storage writers are unchanged; recalculate lamp on view open.
try {
  $('hsKey').value=localStorage.getItem(KEY_SETTING)
    || localStorage.getItem('huschel-amflow-publishable-v1')
    || localStorage.getItem('huschel-routen-navigator-publishable-v1')
    || localStorage.getItem('huschel-supabase-publishable-key-v1') || '';
  $('hsEmail').value=localStorage.getItem(EMAIL_SETTING) || $('hsEmail').value;
} catch {}
meta();
if (!backup?.buildBackup || !backup?.validateBackup) {
  lamp('Speicheranbindung der Original-App fehlt','error');
  message('Bitte die vollständige Testversion mit der bestehenden simple-backup.js veröffentlichen.');
} else {
  void restoreSession();
}
