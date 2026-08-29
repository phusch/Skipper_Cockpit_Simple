/* Friesland Skipper Cockpit Simple V1.0.2 Test
   Manual JSON export/import layer for iCloud Drive / Files app.
   Existing app storage remains authoritative; no automatic synchronization. */
(()=>{
  'use strict';
  const APP_NAME='Friesland Skipper Cockpit Simple';
  const APP_VERSION='V1.0.2 Test';
  const SCHEMA='friesland-skipper-cockpit-backup';
  const SCHEMA_VERSION=1;
  const META_KEY='fsc_simple_backup_meta_v1';
  const ROLLBACK_KEY='fsc_simple_backup_rollback_v1';
  const CURRENT_BACKUP_URL='friesland-current.json';
  const INTERNAL_KEYS=new Set([META_KEY,ROLLBACK_KEY]);
  let pendingBackup=null;
  let pendingFileName='';
  const q=id=>document.getElementById(id);

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const managedKey=k=>typeof k==='string'&&k.startsWith('fsc_')&&!INTERNAL_KEYS.has(k);
  const isoNow=()=>new Date().toISOString();
  const pad=n=>String(n).padStart(2,'0');
  function fileStamp(d=new Date()){
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
  }
  function humanDate(value){
    try{return new Intl.DateTimeFormat('de-DE',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value))}catch{return value||'—'}
  }
  function allManagedStorage(){
    const out={};
    for(let i=0;i<localStorage.length;i++){
      const key=localStorage.key(i);
      if(managedKey(key))out[key]=localStorage.getItem(key);
    }
    return out;
  }
  function parseJsonValue(storage,key,fallback={}){
    try{const v=JSON.parse(storage[key]??'null');return v??fallback}catch{return fallback}
  }
  function summaryFor(storage){
    const alternatives=parseJsonValue(storage,'fsc_alternative_routes_v1',{});
    const choices=parseJsonValue(storage,'fsc_route_choices_v1',{});
    const originalInfo=parseJsonValue(storage,'fsc_original_route_info_v1',{});
    const bunkering=parseJsonValue(storage,'fsc_bunkering_state_v1',null);
    const runnerKeys=Object.keys(storage).filter(k=>k.startsWith('fsc_runner_route_v1_'));
    return {
      storageEntries:Object.keys(storage).length,
      alternativeRoutes:Object.keys(alternatives||{}).length,
      routeChoices:Object.keys(choices||{}).length,
      routeInfoDays:Object.keys(originalInfo||{}).length,
      shipProfile:storage.fsc_ship_profile!=null,
      bunkering:bunkering!=null,
      runnerRoutes:runnerKeys.length
    };
  }
  function buildBackup(){
    const storage=allManagedStorage();
    return {
      schema:SCHEMA,
      schemaVersion:SCHEMA_VERSION,
      app:{name:APP_NAME,version:APP_VERSION},
      createdAt:isoNow(),
      currentDay:(typeof currentDay!=='undefined'&&Number(currentDay))||1,
      storage,
      summary:summaryFor(storage)
    };
  }
  function saveMeta(patch){
    let meta={};
    try{meta=JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{}
    meta={...meta,...patch};
    try{localStorage.setItem(META_KEY,JSON.stringify(meta))}catch{}
    renderStatus();
  }
  function readMeta(){try{return JSON.parse(localStorage.getItem(META_KEY)||'{}')||{}}catch{return {}}}
  function setStatus(text,kind=''){
    const el=q('simpleBackupStatus');if(!el)return;
    el.className='simpleBackupStatus'+(kind?` ${kind}`:'');el.textContent=text;
  }
  function renderStatus(){
    const el=q('simpleBackupStatus');if(!el)return;
    const meta=readMeta();
    if(meta.lastImportAt){setStatus(`Letzter Import: ${humanDate(meta.lastImportAt)} · ${meta.lastImportFile||'JSON-Backup'}`,'ok')}
    else if(meta.lastExportAt){setStatus(`Letzter Export: ${humanDate(meta.lastExportAt)} · ${meta.lastExportFile||'JSON-Backup'}`,'ok')}
    else setStatus('Noch kein Backup auf diesem Gerät exportiert oder importiert.');
    const rollback=q('simpleBackupRollback');if(rollback){let has=false;try{has=!!sessionStorage.getItem(ROLLBACK_KEY)}catch{}rollback.hidden=!has;}
  }
  async function exportBackup(){
    const btn=q('simpleBackupExport');if(btn)btn.disabled=true;
    try{
      const backup=buildBackup();
      const fileName=`Friesland_Skipper_Cockpit_Backup_${fileStamp()}.json`;
      const json=JSON.stringify(backup,null,2);
      const file=new File([json],fileName,{type:'application/json'});
      let method='download';
      if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
        try{
          await navigator.share({files:[file],title:'Friesland Skipper Cockpit Backup',text:'Skipper-Cockpit-Backup – für iCloud Drive „In Dateien sichern“ wählen.'});
          method='share';
        }catch(err){
          if(err?.name==='AbortError'){setStatus('Export abgebrochen – lokaler App-Stand wurde nicht verändert.','warn');return}
          throw err;
        }
      }else{
        const url=URL.createObjectURL(file),a=document.createElement('a');
        a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
      }
      saveMeta({lastExportAt:backup.createdAt,lastExportFile:fileName,lastExportMethod:method});
      setStatus(method==='share'?`Backup erstellt: ${fileName} · jetzt in „Dateien“/iCloud Drive sichern.`:`Backup heruntergeladen: ${fileName} · anschließend bei Bedarf nach iCloud Drive verschieben.`,'ok');
    }catch(err){
      console.error('Backup export failed',err);setStatus(`Export fehlgeschlagen: ${err?.message||'unbekannter Fehler'}`,'error');
    }finally{if(btn)btn.disabled=false}
  }
  function validateBackup(data){
    if(!data||typeof data!=='object')throw new Error('Die Datei enthält kein gültiges Backup-Objekt.');
    if(data.schema!==SCHEMA)throw new Error('Die Datei ist kein Friesland-Skipper-Cockpit-Backup.');
    if(Number(data.schemaVersion)!==SCHEMA_VERSION)throw new Error(`Backup-Schema ${data.schemaVersion??'—'} wird von dieser Version nicht unterstützt.`);
    if(!data.storage||typeof data.storage!=='object'||Array.isArray(data.storage))throw new Error('Im Backup fehlen die gespeicherten App-Daten.');
    const storage={};
    for(const [key,value] of Object.entries(data.storage)){
      if(!managedKey(key))continue;
      if(typeof value!=='string')throw new Error(`Ungültiger Speicherwert für ${key}.`);
      storage[key]=value;
    }
    if(Object.keys(storage).length>200)throw new Error('Das Backup enthält unerwartet viele Speicherbereiche.');
    return {...data,storage,summary:summaryFor(storage)};
  }
  function previewHtml(data,fileName){
    const s=data.summary||{};
    const lines=[
      ['Datei',fileName],
      ['Erstellt',humanDate(data.createdAt)],
      ['App-Version',data.app?.version||'—'],
      ['Fahrtag beim Export',data.currentDay?`Tag ${data.currentDay}`:'—'],
      ['Gespeicherte Bereiche',s.storageEntries??0],
      ['Waterkaarten-Alternativen',s.alternativeRoutes??0],
      ['Routenentscheidungen',s.routeChoices??0],
      ['Eigene Routeninfos',s.routeInfoDays??0],
      ['Schiffsprofil',s.shipProfile?'vorhanden':'nicht separat gespeichert'],
      ['Bunkern',s.bunkering?'gespeicherter Zustand vorhanden':'kein Zustand'],
      ['Runner-Caches',s.runnerRoutes??0]
    ];
    return `<div class="simpleImportGrid">${lines.map(([a,b])=>`<div><small>${esc(a)}</small><strong>${esc(b)}</strong></div>`).join('')}</div>`;
  }
  function openPreview(data,fileName){
    pendingBackup=data;pendingFileName=fileName;
    q('simpleImportSummary').innerHTML=previewHtml(data,fileName);
    q('simpleImportModal').hidden=false;document.body.style.overflow='hidden';
  }
  function closePreview(){
    q('simpleImportModal').hidden=true;document.body.style.overflow='';pendingBackup=null;pendingFileName='';
    const input=q('simpleBackupFile');if(input)input.value='';
  }
  async function chooseImport(ev){
    const file=ev.target.files?.[0];if(!file)return;
    try{
      if(file.size>12*1024*1024)throw new Error('Die Backup-Datei ist ungewöhnlich groß (> 12 MB).');
      const text=await file.text();
      const data=validateBackup(JSON.parse(text));
      openPreview(data,file.name);
    }catch(err){
      console.error('Backup validation failed',err);setStatus(`Import nicht möglich: ${err?.message||'ungültige JSON-Datei'}`,'error');ev.target.value='';
    }
  }
  async function loadCrewCurrent(){
    const btn=q('simpleBackupCrew');if(btn)btn.disabled=true;
    try{
      setStatus('Aktueller Crew-Stand wird von GitHub geladen …');
      const response=await fetch(`${CURRENT_BACKUP_URL}?t=${Date.now()}`,{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=validateBackup(await response.json());
      openPreview(data,CURRENT_BACKUP_URL);
      setStatus(`Crew-Stand geladen: ${humanDate(data.createdAt)} · vor Übernahme bitte prüfen.`,'ok');
    }catch(err){
      console.error('Crew current load failed',err);
      setStatus(`Crew-Stand konnte nicht geladen werden: ${err?.message||'Netzwerkfehler'}`,'error');
    }finally{if(btn)btn.disabled=false}
  }
  function snapshotCurrent(){
    return {createdAt:isoNow(),storage:allManagedStorage()};
  }
  function restoreStorage(storage){
    const currentKeys=[];
    for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(managedKey(k))currentKeys.push(k)}
    currentKeys.forEach(k=>localStorage.removeItem(k));
    for(const [key,value] of Object.entries(storage))if(managedKey(key))localStorage.setItem(key,value);
  }
  function confirmImport(){
    if(!pendingBackup)return;
    const before=snapshotCurrent();
    try{
      try{sessionStorage.setItem(ROLLBACK_KEY,JSON.stringify(before))}catch(err){throw new Error('Rücksicherung konnte für diese Sitzung nicht angelegt werden. Import wurde nicht gestartet.')}
      restoreStorage(pendingBackup.storage);
      const meta={lastImportAt:isoNow(),lastImportFile:pendingFileName,importedBackupCreatedAt:pendingBackup.createdAt,importedFromVersion:pendingBackup.app?.version||'—'};
      localStorage.setItem(META_KEY,JSON.stringify(meta));
      try{sessionStorage.setItem('fsc_simple_import_notice_v1',`Backup „${pendingFileName}“ wurde erfolgreich importiert.`)}catch{}
      location.reload();
    }catch(err){
      console.error('Backup import failed',err);
      try{restoreStorage(before.storage);sessionStorage.removeItem(ROLLBACK_KEY)}catch{}
      closePreview();setStatus(`Import fehlgeschlagen; vorheriger lokaler Stand wurde wiederhergestellt: ${err?.message||'Speicherfehler'}`,'error');
    }
  }
  function rollbackImport(){
    let rollback;
    try{rollback=JSON.parse(sessionStorage.getItem(ROLLBACK_KEY)||'null')}catch{}
    if(!rollback?.storage){setStatus('Keine Rücksicherung vorhanden.','warn');renderStatus();return}
    if(!window.confirm('Den lokalen Datenstand vor dem letzten Import wiederherstellen?'))return;
    try{
      restoreStorage(rollback.storage);
      sessionStorage.removeItem(ROLLBACK_KEY);
      localStorage.setItem(META_KEY,JSON.stringify({lastRollbackAt:isoNow()}));
      try{sessionStorage.setItem('fsc_simple_import_notice_v1','Der Datenstand vor dem letzten Import wurde wiederhergestellt.')}catch{}
      location.reload();
    }catch(err){setStatus(`Rücksicherung fehlgeschlagen: ${err?.message||'Speicherfehler'}`,'error')}
  }
  function init(){
    const exportBtn=q('simpleBackupExport'),importBtn=q('simpleBackupImport'),crewBtn=q('simpleBackupCrew'),file=q('simpleBackupFile');
    if(!exportBtn||!importBtn||!file)return;
    exportBtn.addEventListener('click',exportBackup);
    importBtn.addEventListener('click',()=>file.click());
    crewBtn?.addEventListener('click',loadCrewCurrent);
    file.addEventListener('change',chooseImport);
    q('simpleImportClose')?.addEventListener('click',closePreview);
    q('simpleImportCancel')?.addEventListener('click',closePreview);
    q('simpleImportConfirm')?.addEventListener('click',confirmImport);
    q('simpleImportModal')?.addEventListener('click',e=>{if(e.target===q('simpleImportModal'))closePreview()});
    q('simpleBackupRollback')?.addEventListener('click',rollbackImport);
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!q('simpleImportModal')?.hidden)closePreview()});
    renderStatus();
    try{
      const notice=sessionStorage.getItem('fsc_simple_import_notice_v1');
      if(notice){sessionStorage.removeItem('fsc_simple_import_notice_v1');setStatus(notice,'ok')}
    }catch{}
  }
  window.addEventListener('load',init);
  window.FSC_SIMPLE_BACKUP={version:APP_VERSION,buildBackup,validateBackup};
})();
