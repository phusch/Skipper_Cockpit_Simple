/* Friesland Skipper Cockpit Simple V1.0.3 Test
   Crew bootstrap: on a genuinely fresh browser profile, seed local app data once
   from friesland-current.json. Existing local app data is never overwritten. */
(()=>{
  'use strict';
  const CURRENT_URL='friesland-current.json';
  const SEED_MARKER='friesland_crew_seed_v1';
  const SCHEMA='friesland-skipper-cockpit-backup';
  const SCHEMA_VERSION=1;
  const hasManagedData=()=>{
    for(let i=0;i<localStorage.length;i++){
      const k=localStorage.key(i);
      if(typeof k==='string'&&k.startsWith('fsc_'))return true;
    }
    return false;
  };
  async function bootstrap(){
    try{
      if(hasManagedData())return;
      const response=await fetch(`${CURRENT_URL}?bootstrap=1`,{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const data=await response.json();
      if(!data||data.schema!==SCHEMA||Number(data.schemaVersion)!==SCHEMA_VERSION||!data.storage||typeof data.storage!=='object')return;
      let count=0;
      for(const [key,value] of Object.entries(data.storage)){
        if(typeof key==='string'&&key.startsWith('fsc_')&&typeof value==='string'){
          localStorage.setItem(key,value);count++;
        }
      }
      if(!count)return;
      localStorage.setItem(SEED_MARKER,JSON.stringify({seededAt:new Date().toISOString(),source:CURRENT_URL,backupCreatedAt:data.createdAt||null}));
      sessionStorage.setItem('fsc_simple_import_notice_v1',`Crew-Stand vom ${data.createdAt?new Date(data.createdAt).toLocaleString('de-DE'):'GitHub'} wurde als Startstand geladen.`);
      location.reload();
    }catch(err){
      console.warn('Crew bootstrap skipped',err);
    }
  }
  bootstrap();
})();
