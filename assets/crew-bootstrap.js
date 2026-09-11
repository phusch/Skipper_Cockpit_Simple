/* Friesland Skipper Cockpit Simple V1.0.4 Test
   Published tour state: seed a fresh browser completely; on an existing browser
   apply each published route snapshot once without overwriting other local data. */
(()=>{
  'use strict';
  const CURRENT_URL='friesland-current.json';
  const SEED_MARKER='friesland_crew_seed_v1';
  const SCHEMA='friesland-skipper-cockpit-backup';
  const SCHEMA_VERSION=1;
  const ROUTE_KEYS=new Set([
    'fsc_alternative_routes_v1',
    'fsc_route_choices_v1',
    'fsc_original_route_info_v1',
    'fsc_builtin_route_info_disabled_v1'
  ]);
  const hasManagedData=()=>{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(typeof k==='string'&&k.startsWith('fsc_'))return true;
    }
    return false;
  };
  async function bootstrap(){
    try{
      const response=await fetch(`${CURRENT_URL}?bootstrap=1`,{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      if(!data||data.schema!==SCHEMA||Number(data.schemaVersion)!==SCHEMA_VERSION||!data.storage||typeof data.storage!=='object')return;
      const snapshotId=String(data.publishedStateVersion||data.createdAt||'');
      let previous={};
      try{previous=JSON.parse(localStorage.getItem(SEED_MARKER)||'{}')||{}}catch{}
      if(snapshotId&&String(previous.snapshotId||previous.backupCreatedAt||'')===snapshotId)return;
      const fresh=!hasManagedData();
      let count=0;
      for(const [key,value] of Object.entries(data.storage)){
        const eligible=fresh?(typeof key==='string'&&key.startsWith('fsc_')):ROUTE_KEYS.has(key);
        if(eligible&&typeof value==='string'){
          localStorage.setItem(key,value);count++;
        }
      }
      if(!count)return;
      localStorage.setItem(SEED_MARKER,JSON.stringify({seededAt:new Date().toISOString(),source:CURRENT_URL,snapshotId:snapshotId||null,backupCreatedAt:data.createdAt||null,mode:fresh?'full':'routes-only'}));
      const action=fresh?'als Startstand geladen':'als veröffentlichter Routenstand übernommen';
      sessionStorage.setItem('fsc_simple_import_notice_v1',`Crew-Stand vom ${data.createdAt?new Date(data.createdAt).toLocaleString('de-DE'):'GitHub'} wurde ${action}.`);
      location.reload();
    }catch(err){
      console.warn('Crew bootstrap skipped',err);
    }
  }
  bootstrap();
})();
