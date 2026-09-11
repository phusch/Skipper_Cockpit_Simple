/* Friesland Skipper Cockpit Simple V1.0.4 Test
   Additive navigation/presentation layer. No new persistence schema. */
(()=>{
  const VERSION='V1.0.4 Test';
  let simpleMain='today';
  const q=id=>document.getElementById(id);
  const escSimple=value=>String(value??'').replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

  function berthPlans(day){
    const src=window.FSC_BERTH_PLANS;
    return (src&&src.days&&src.days[String(day)])||[];
  }
  function runnerForDay(day){
    const routes=window.FSC_RUNNER_DATA?.routes||[];
    return routes.filter(r=>Number(r.day)===Number(day));
  }
  function activeRoute(){
    try{return getActiveRoute(currentDay)}catch(e){return null}
  }
  function setBottomActive(name){
    simpleMain=name;
    document.querySelectorAll('[data-simple-main]').forEach(b=>b.classList.toggle('active',b.dataset.simpleMain===name));
  }
  function openScreen(name,mainHint='more'){
    if(name==='today'){setScreen('today');setBottomActive('today');renderSimpleToday();return}
    if(name==='cockpit'){setScreen('cockpit');setBottomActive('drive');setTimeout(()=>{try{initMap(currentDay)}catch(e){}},50);return}
    if(name==='weather'){setScreen('weather');setBottomActive('weather');return}
    if(name==='more'){setScreen('more');setBottomActive('more');return}
    setScreen(name);setBottomActive(mainHint);
    if(name==='runner'&&window.FSC_RUNNER_RENDER)setTimeout(()=>window.FSC_RUNNER_RENDER(currentDay),30);
  }
  function syncWeatherQuick(){
    const glyph=q('weatherGlyph')?.textContent||'🌦️';
    const summary=q('weatherSummary')?.textContent||'Noch nicht geladen';
    const temp=q('weatherTemp')?.textContent||'—';
    const wind=q('weatherWind')?.textContent||'—';
    q('simpleWeatherIcon').textContent=glyph;
    q('simpleWeatherText').textContent=summary;
    q('simpleWeatherMeta').textContent=`${temp} · Wind ${wind} · Tippen für Details`;
  }
  function renderSimpleToday(){
    const d=activeRoute(); if(!d)return;
    const day=Number(currentDay)||1;
    const plans=berthPlans(day);
    q('simpleDayKicker').textContent=`HEUTE · TAG ${day}`;
    q('simpleDayTitle').textContent=d.title||'—';
    q('simpleDayDate').textContent=d.date||'—';
    q('simpleRouteChip').textContent=d.source==='alternative'?'WATERKAARTEN-ALTERNATIVE':'ORIGINALROUTE';
    q('simpleRouteChip').className=`chip ${d.source==='alternative'?'yellow':'aqua'}`;
    q('simplePlanRoute').textContent=d.route_text||d.title||'—';
    q('simplePlanRouteState').textContent=d.source==='alternative'?'Aktive, lokal gespeicherte Alternativroute':'Freigegebene Originalroute aktiv';
    q('simplePlanAction').textContent=(d.landgang&&d.landgang[0])||'Keine besondere Tagesaktion hinterlegt';
    q('simplePlanNight').textContent=plans[0]?.name||d.night||'—';
    q('simplePlanNightAlt').textContent=plans[1]?`Alternative: ${plans[1].name}`:'Keine Alternative hinterlegt';
    q('simpleDriveValue').textContent=`${Number(d.km).toFixed(1)} km · ${d.plan_time||'—'}`;
    q('simpleBriefValue').textContent=d.brief?.summary||'Tagesbrief öffnen';
    q('simpleLandValue').textContent=(d.landgang&&d.landgang[0])||'Landgangdetails öffnen';
    q('simpleNightValue').textContent=plans[0]?.name||d.night||'Nachtplatzdetails öffnen';
    const runner=runnerForDay(day);
    q('simpleRunnerToday').hidden=!runner.length;
    if(runner.length)q('simpleRunnerValue').textContent=runner.length===1?runner[0].title:`${runner.length} Runner-Varianten vorhanden`;
    syncWeatherQuick();
  }
  function syncPlanDialog(){
    const d=activeRoute(); if(!d)return;
    const original=q('simpleOriginalRoute'), alt=q('simpleAlternativeRoute');
    const actualOriginal=q('routeOriginalBtn'), actualAlt=q('routeAlternativeBtn');
    const isAlt=d.source==='alternative';
    original.classList.toggle('active',!isAlt);alt.classList.toggle('active',isAlt);
    alt.disabled=!!actualAlt?.disabled;
    q('simpleAlternativeNote').textContent=alt.disabled?'Für diesen Fahrtag ist noch keine Waterkaarten-Alternative importiert.':'Eine gespeicherte Waterkaarten-Alternative ist verfügbar.';

    const decisionBox=d.decision==='weather'?q('decisionWeather'):d.decision==='time'?q('decisionTime'):null;
    const section=q('simpleDayDecisionSection'), holder=q('simpleDecisionChoices');
    if(decisionBox){
      section.hidden=false;holder.innerHTML='';
      decisionBox.querySelectorAll('.choice').forEach((source,index)=>{
        const b=document.createElement('button');b.type='button';b.className=source.classList.contains('active')?'active':'';
        b.innerHTML=`<strong>${escSimple(source.querySelector('strong')?.textContent||`Option ${index+1}`)}</strong><span>${escSimple(source.querySelector('span')?.textContent||'')}</span>`;
        b.addEventListener('click',()=>{source.click();syncPlanDialog();renderSimpleToday()});holder.appendChild(b);
      });
    }else{section.hidden=true;holder.innerHTML=''}

    const nightHolder=q('simpleNightChoices');nightHolder.innerHTML='';
    const plans=berthPlans(currentDay);
    if(!plans.length){nightHolder.innerHTML='<article><strong>Keine zusätzlichen Nachtplatzoptionen hinterlegt.</strong></article>'}
    plans.forEach(p=>{const a=document.createElement('article');a.innerHTML=`<small>${escSimple(p.label||'OPTION')}</small><strong>${escSimple(p.name||'—')}</strong><span>${escSimple(p.type||'')}${p.note?` · ${escSimple(p.note)}`:''}</span>`;nightHolder.appendChild(a)});
  }
  function openPlan(){syncPlanDialog();q('simplePlanModal').hidden=false;document.body.style.overflow='hidden'}
  function closePlan(){q('simplePlanModal').hidden=true;document.body.style.overflow='';renderSimpleToday()}
  function installRouteToolsToggle(){
    const rm=document.querySelector('#screen-cockpit .routeManager'); if(!rm||q('simpleRouteToolsToggle'))return;
    const btn=document.createElement('button');btn.type='button';btn.id='simpleRouteToolsToggle';btn.className='simpleRouteToolsToggle';btn.textContent='⚙ ROUTE VERWALTEN';
    btn.addEventListener('click',()=>{const open=document.body.classList.toggle('simple-route-tools-open');btn.textContent=open?'▴ ROUTENVERWALTUNG SCHLIESSEN':'⚙ ROUTE VERWALTEN'});
    rm.parentNode.insertBefore(btn,rm);
  }
  function interceptHeaderDaySelection(){
    document.addEventListener('click',e=>{
      const b=e.target.closest?.('[data-header-day]'); if(!b)return;
      e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
      const day=Number(b.dataset.headerDay);
      const activeScreen=document.querySelector('.screen.active')?.id?.replace('screen-','')||'today';
      q('headerDayMenu').hidden=true;renderDay(day);renderSimpleToday();
      // The original app does not refresh weather on a day-only change. In the Simple UI,
      // invoke the existing weather loader so HEUTE cannot continue to show the previous day's values.
      try{loadWeather()}catch(err){}
      setScreen(activeScreen);
      if(activeScreen==='today')setBottomActive('today');
      else if(activeScreen==='cockpit')setBottomActive('drive');
      else if(activeScreen==='weather')setBottomActive('weather');
      else setBottomActive('more');
    },true);
  }
  function installWeatherObserver(){
    const ids=['weatherSummary','weatherTemp','weatherWind','weatherGlyph'];
    const observer=new MutationObserver(syncWeatherQuick);
    ids.forEach(id=>{const el=q(id);if(el)observer.observe(el,{childList:true,subtree:true,characterData:true})});
  }
  function initSimple(){
    document.body.classList.add('simple-ui');
    installRouteToolsToggle();interceptHeaderDaySelection();installWeatherObserver();
    document.querySelectorAll('[data-simple-main]').forEach(b=>b.addEventListener('click',()=>openScreen(b.dataset.simpleMain==='drive'?'cockpit':b.dataset.simpleMain,b.dataset.simpleMain)));
    document.querySelectorAll('[data-simple-open]').forEach(b=>b.addEventListener('click',()=>openScreen(b.dataset.simpleOpen,'more')));
    q('simplePlanChange').addEventListener('click',openPlan);q('simplePlanClose').addEventListener('click',closePlan);q('simplePlanDone').addEventListener('click',closePlan);
    q('simplePlanModal').addEventListener('click',e=>{if(e.target===q('simplePlanModal'))closePlan()});
    q('simpleOriginalRoute').addEventListener('click',()=>{q('routeOriginalBtn')?.click();setTimeout(()=>{syncPlanDialog();renderSimpleToday()},0)});
    q('simpleAlternativeRoute').addEventListener('click',()=>{if(!q('routeAlternativeBtn')?.disabled)q('routeAlternativeBtn')?.click();setTimeout(()=>{syncPlanDialog();renderSimpleToday()},0)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!q('simplePlanModal').hidden)closePlan()});
    // Preserve existing renderDay logic and add only a presentation refresh.
    const originalRenderDay=renderDay;
    window.renderDay=function(day){const result=originalRenderDay(day);setTimeout(renderSimpleToday,0);return result};
    renderSimpleToday();openScreen('today');
  }
  window.addEventListener('load',initSimple);
  window.FSC_SIMPLE={version:VERSION,renderToday:renderSimpleToday,openScreen};
})();
