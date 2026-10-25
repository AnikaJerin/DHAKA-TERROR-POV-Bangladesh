import {createBusImpacts} from './characters/bus/bus-impacts.js';
import {createBusStops} from './characters/bus/stops-and-passengers.js';
import {createTrafficLod} from './shared/traffic/traffic-lod.js';
import {createSlowSpeedJoke} from './characters/bus/slow-speed-joke.js';
import {createBusOpening} from './characters/bus/opening.js';
import {createDhakaAudio} from './characters/bus/audio.js';
import { createPresence } from './shared/multiplayer/presence.js';
import { createBangladeshCngFactory } from './bangladesh-cng.js';
import { createBangladeshBikeFactory } from './bangladesh-bike.js';
import { createRickshaw } from './rickshaw.js';
import { createNetworkWorld } from './shared/map/world.js';
import {places,roads,getPlace,exits,shortestRoute} from './shared/map/network.js';
import { createBangladeshBusFactory } from './bangladesh-bus.js';
import { createVegetation } from './vegetation.js';
import { createNeighborhoods } from './neighborhoods.js';
import { createMetroStructure } from './metro-structure.js';
import { createCityDetails } from './city-details.js';
// One persistent world; mission definitions can be extended without separate game pages.
export const missions=[{id:'bus-01',title:['First trip, Mirpur','প্রথম ট্রিপ, মিরপুর'],pickup:'selected-area',dropoff:'mirpur10-or-agargaon',passengers:3}];
let instance;
export async function startBusMission({language='en',startPlaceId='mirpur12',characterId='bus',onExit=()=>{}}={}){
 if(instance){instance.resume(language,onExit,startPlaceId,characterId);return}
 const streetAudio=createDhakaAudio();streetAudio.unlock();
 const root=document.createElement('section');root.className='mission-screen';root.setAttribute('aria-label','Dhaka Terror 3D bus mission');document.body.append(root);
 const bn=()=>language==='bn',tr=(en,b)=>bn()?b:en;
 root.innerHTML=`<div class="mission-fallback"><h2>Preparing Dhaka in 3D…</h2><p>Loading the 3D renderer.</p><button class="mission-pill" id="load-exit">Back to welcome</button></div>`;
 root.querySelector('#load-exit').onclick=()=>{streetAudio.stop();root.remove();onExit()};
 let T;try{T=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')}catch{root.querySelector('.mission-fallback p').textContent=tr('The 3D library could not load. Connect to the internet and try again.','থ্রিডি লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ দিয়ে আবার চেষ্টা করুন।');return}
 if(!root.isConnected)return;
 // Rasterize world lettering only after Bengali glyphs are ready (bounded offline fallback).
 if(document.fonts){try{await Promise.race([document.fonts.load('700 48px "Noto Sans Bengali"'),new Promise(resolve=>setTimeout(resolve,1800))])}catch{}}
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'})}catch{root.querySelector('.mission-fallback p').textContent='WebGL is unavailable. Enable hardware acceleration or use a WebGL-compatible browser.';return}
 root.innerHTML=`<div class="mission-top"><div class="mama-hud"><strong>মামা পাওয়ার <span id="mama-power">০</span></strong><small id="passengers">যাত্রী সংখ্যা: ০</small></div><div><button class="mission-pill" id="pause"></button> <button class="mission-pill" id="exit"></button></div></div><div class="mission-controls"><button class="mission-action" id="doors"></button><button id="horn"></button><button id="restart"></button></div><div class="mission-bottom" id="keys"></div><div class="drive-touch" aria-label="Driving controls"><button data-key="ArrowLeft" aria-label="Steer left">←</button><button data-key="ArrowUp" aria-label="Accelerate">↑</button><button data-key="ArrowRight" aria-label="Steer right">→</button><button data-key="ArrowDown" aria-label="Brake">↓</button></div><div class="mission-speed"><strong id="speed">0</strong><small>KM/H</small></div><div class="mission-pause" hidden><h2 id="pause-title"></h2><p id="pause-copy"></p><button class="primary" id="resume"></button></div>`;
 const elementCache=new Map();const el=id=>{if(!elementCache.has(id))elementCache.set(id,root.querySelector('#'+id));return elementCache.get(id)};const put=(id,value)=>{const e=el(id);if(e.textContent!==String(value))e.textContent=value};
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D Dhaka street. Use arrow keys to drive the bus.');root.prepend(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#c7cec3');scene.fog=new T.Fog('#c7cec3',220,370);
 const camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,400);
 scene.add(new T.HemisphereLight('#ffffff','#b0d4e5',2.1));const sun=new T.DirectionalLight('#fffaf1',2.5);sun.position.set(-35,55,20);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-40;sun.shadow.camera.right=40;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;sun.shadow.normalBias=.04;scene.add(sun,sun.target);
 const labelCache=new Map(),labelGeometry=new Map();
 const mats=new Map(),geo=new T.BoxGeometry(1,1,1);function mat(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.82}));return mats.get(color)}
 function box(parent,x,y,z,w,h,d,color){const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=h>.4;m.receiveShadow=true;parent.add(m);return m}
 function cylinder(parent,x,y,z,r,h,color,sides=10){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
 function label(parent,text,x,y,z,w=5,h=1.1,bg='#234b43',fg='#fff9e5'){
  const key=JSON.stringify([text,w,h,bg,fg]);let material=labelCache.get(key);if(!material){
  const c=document.createElement('canvas');c.width=1024;c.height=Math.max(128,Math.min(1024,Math.round(1024*h/w)));
  const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=fg;ctx.globalAlpha=.45;ctx.lineWidth=5;ctx.strokeRect(7,7,c.width-14,c.height-14);ctx.globalAlpha=1;
  ctx.textAlign='center';ctx.textBaseline='middle';let size=Math.floor(c.height*.56);ctx.font=`800 ${size}px "Noto Sans Bengali", sans-serif`;
  while(ctx.measureText(text).width>c.width-54&&size>18){size-=2;ctx.font=`800 ${size}px "Noto Sans Bengali", sans-serif`}
  ctx.fillStyle=fg;ctx.fillText(text,c.width/2,c.height*.52);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  material=new T.MeshBasicMaterial({map:tex,side:T.DoubleSide,toneMapped:false});labelCache.set(key,material);}
  const dimensions=w+':'+h;if(!labelGeometry.has(dimensions))labelGeometry.set(dimensions,new T.PlaneGeometry(w,h));const m=new T.Mesh(labelGeometry.get(dimensions),material);m.position.set(x,y,z);parent.add(m);return m;
 }
 function person(parent,x,z,shirt='#ceac68',cap=false){
  const p=new T.Group();p.position.set(x,0,z);parent.add(p);
  function oval(x,y,z,sx,sy,sz,color){const m=new T.Mesh(new T.SphereGeometry(1,10,8),mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);p.add(m);return m}
  // Keep the actor child ordering used by existing seated bike poses.
  for(const side of [-1,1]){const leg=new T.Mesh(new T.CylinderGeometry(.09,.075,.76,9),mat('#304354'));leg.position.set(side*.13,.45,0);p.add(leg)}
  oval(0,1.1,0,.27,.35,.16,shirt);oval(0,1.63,-.02,.15,.2,.14,'#bc8765');
  for(const side of [-1,1]){const arm=new T.Mesh(new T.CylinderGeometry(.08,.055,.59,9),mat(shirt));arm.position.set(side*.34,1.13,0);p.add(arm)}const arm=p.children[5];
  for(const side of [-1,1]){oval(side*.13,.08,-.06,.095,.065,.18,'#29343b');oval(side*.34,.79,0,.055,.075,.04,'#bc8765');for(let i=0;i<4;i++)oval(side*.34-.023+i*.015,.74,-.005,.009,.033,.009,'#bc8765');oval(side*.15,1.64,0,.026,.045,.025,'#bc8765');oval(side*.055,1.66,-.153,.027,.014,.009,'#efe5d0');oval(side*.055,1.66,-.16,.012,.012,.006,'#26343b');oval(side*.056,1.69,-.14,.033,.009,.008,'#293038')}
  oval(0,1.61,-.16,.03,.042,.035,'#bd8865');oval(0,1.56,-.158,.037,.006,.006,'#86574b');oval(0,1.79,.01,.153,.07,.14,'#293038');
  if(cap){const hat=new T.Mesh(new T.CylinderGeometry(.15,.16,.09,12),mat('#aa3930'));hat.position.set(0,1.84,0);p.add(hat);box(p,0,1.8,-.14,.27,.035,.2,'#aa3930')}
  return{group:p,arm};
 }
  const busFactory=createBangladeshBusFactory(T,{box,label,mat,person}),cngFactory=createBangladeshCngFactory(T,{box,label,mat,person}),bikeFactory=createBangladeshBikeFactory(T,{box,cylinder,label,mat,person});let bus;function setVehicle(){if(bus)scene.remove(bus.group);let model;if(characterId==='cng')model=cngFactory.create(0);else if(characterId==='biker')model=bikeFactory.create(0);else if(characterId==='rickshaw')model=createRickshaw(T,{box,label,mat,person},0);else model=busFactory.create({player:true});bus={...model,group:model.group||model.g,door:model.door||{rotation:{y:0}}};scene.add(bus.group)}setVehicle();
 const vegetation=createVegetation(T),neighborhoods=createNeighborhoods(T,{box,cylinder,label,mat,vegetation}),metro=createMetroStructure(T),city=createCityDetails(T,{box,cylinder,label,person,mat,neighborhoods,busFactory});
 const world=createNetworkWorld(T,{scene,city,metro,neighborhoods,vegetation,box,label,mat});
 const opening=createBusOpening(T,{root,camera,getBus:()=>bus.group,audio:streetAudio});
 const slowJoke=createSlowSpeedJoke(T,{root,camera,getBus:()=>bus.group,audio:streetAudio});
 const busImpacts=createBusImpacts(T,{root,camera,getBus:()=>bus.group,audio:streetAudio,onPoints:points=>respect+=points,onPush:pushTrafficBus});
 const busStops=createBusStops(T,{scene,root,camera,world,getBus:()=>bus.group,audio:streetAudio,dialogueBusy:()=>slowJoke.busy||busImpacts.busy,onBoard:()=>++boarded,onPoints:points=>respect+=points,onDoor:()=>doorOpen=true});
 const soundButton=document.createElement('button');soundButton.className='mission-pill mission-sound';soundButton.setAttribute('aria-label','Toggle street audio');root.append(soundButton);
 function soundUi(){soundButton.textContent=streetAudio.enabled?'♫ ON':'♫ OFF';soundButton.setAttribute('aria-pressed',String(streetAudio.enabled))}soundButton.onclick=()=>{streetAudio.setEnabled(!streetAudio.enabled);soundUi()};soundUi();
 root.addEventListener('pointerdown',()=>streetAudio.unlock());
 const held=new Set();let player,speed=0,stage='pickup',boarded=0,boardTime=0,doorOpen=true,paused=false,active=false,lastTime=0,elapsed=0,raf,respect=0,metroPhase=0,goal,dropPose,missionDone=false,collisionCooldown=0,reverseWait=0;
 const train=new T.Group();scene.add(train);
 for(let i=0;i<3;i++){box(train,0,11.75,i*10.8,3.55,2.5,10.3,'#e0e5dc');box(train,0,10.75,i*10.8,3.6,.45,10.3,'#18835e');for(const side of [-1,1])for(let w=0;w<5;w++)box(train,side*1.79,12,i*10.8-3.8+w*1.8,.03,.85,1.35,'#326a79')}
 label(train,'ঢাকা মেট্রো',0,11.7,26.9,3,.6,'#17704e','#fff1c6');
 const markers=new T.Group();scene.add(markers);
 function marker(p,text,color){const g=new T.Group();g.position.set(p.x,.14,p.z);g.rotation.y=p.yaw;markers.add(g);box(g,0,0,0,3.5,.08,13,color);box(g,-2,2,0,.1,4,.1,'#687f85');label(g,text,-2,3.7,0,4,.7,'#17654f','#fff2bf');return g}
 function reset(id=startPlaceId){startPlaceId=id;const start=getPlace(id)||getPlace('mirpur12'),next=exits(start.id)[0].target.id;goal=start;player=world.pose(start.id,next,48,10.4);dropPose=null;speed=0;steering=0;reverseWait=0;metroPhase=500-Math.max(-820,Math.min(440,player.z-85))-elapsed*18;stage=characterId==='bus'?'pickup':'done';boarded=characterId==='bus'?30:0;boardTime=0;doorOpen=characterId==='bus';respect=0;missionDone=true;markers.clear();opening.reset(characterId==='bus');slowJoke.reset(characterId==='bus');busStops.reset(characterId==='bus',player);busImpacts.reset();seedTraffic(start.id);if(characterId==='bus')marker(player,'বাস স্টপ','#c7ad65');helper('Welcome to '+start.en+'. Drive anywhere—there is no destination to select.','স্বাগতম '+start.bn+'। যেদিকে ইচ্ছা যান—গন্তব্য বেছে নেওয়ার দরকার নেই।');world.update(player,elapsed);updateBus();ui()}

 function helper(a,b){/* Helper dialogue is shown as timed comic bubbles, never a permanent panel. */}
 function updateBus(){bus.group.position.set(player.x,.06,player.z);bus.group.rotation.set(0,player.yaw,0)}
 function nearestNode(){return places.reduce((best,p)=>Math.hypot(p.x-player.x,p.z-player.z)<Math.hypot(best.x-player.x,best.z-player.z)?p:best,places[0])}
 function gate(){if(stage==='pickup'||Math.abs(speed)>.4)return;doorOpen=!doorOpen;ui();}

 function pause(v){paused=v;streetAudio.setPaused(v);held.clear();root.querySelector('.mission-pause').hidden=!v;put('pause-title',tr('A little breathing room.','একটু বিরতি।'));put('pause-copy',tr('Your route and bus are waiting.','আপনার বাস ও রুট অপেক্ষায়।'));put('resume',tr('Resume ↗','আবার চালান ↗'));}

 function ui(){
  const digits=value=>String(value).replace(/\d/g,n=>'০১২৩৪৫৬৭৮৯'[n]);
  put('mama-power',digits(respect));put('passengers','যাত্রী সংখ্যা: '+digits(characterId==='bus'?boarded:0));
  el('doors').hidden=characterId!=='bus';put('doors',doorOpen?tr('E · Close gate','E · গেট বন্ধ'):tr('E · Open gate','E · গেট খুলুন'));put('pause',tr('P · Pause','P · বিরতি'));put('exit',tr('Menu','মেনু'));put('horn',tr('H · Horn','H · হর্ন'));put('restart',tr('Return to start','শুরুর স্থানে ফিরুন'));put('keys',tr('W/↑ DRIVE · S/↓ REVERSE · A/D TURN · SPACE BRAKE · M MAP','W/↑ চালান · S/↓ রিভার্স · A/D মোড় · SPACE ব্রেক · M মানচিত্র'));put('speed',Math.round(Math.abs(speed)*3.6));
  const nav=world.navigation(player),arrows={left:'←',right:'→',forward:'↑',back:'↶'};
  navigation.textContent=tr('Now: '+nav.here.en,'এখন: '+nav.here.bn)+' · '+nav.distance+tr(' m to ',' মিটার সামনে ')+tr(nav.upcoming.en,nav.upcoming.bn)+'\n'+(nav.choices.map(e=>arrows[e.turn]+' '+tr(e.target.en,e.target.bn)).join('   |   ')||tr('↶ Turnaround','↶ ঘুরে ফিরুন'));drawMap();
 }

 const navigation=document.createElement('div');navigation.className='network-navigation';root.append(navigation);
 const map=document.createElement('div');map.className='network-minimap';root.append(map);let largeMap=false;
 let mapKey='',mapArrow;
 function drawMap(){const key=language+':'+largeMap;const sx=p=>185+p.x*.15,sz=p=>170+p.z*.15;map.classList.toggle('expanded',largeMap);if(key!==mapKey){mapKey=key;map.innerHTML=`<svg viewBox="0 0 240 270" aria-label="Live route map">${roads.map(r=>{const a=getPlace(r.from),b=getPlace(r.to);return `<path d="M${sx(a)} ${sz(a)}L${sx(b)} ${sz(b)}" stroke="#fbd457" stroke-width="3"/>`}).join('')}${places.map(p=>`<circle cx="${sx(p)}" cy="${sz(p)}" r="3" fill="${'#e8eed8'}"/>${largeMap?`<text x="${sx(p)+4}" y="${sz(p)-5}" font-size="6" fill="white">${tr(p.en,p.bn)}</text>`:''}`).join('')}<path class="player-arrow" d="M0 -6L-4 5L4 5Z" transform="translate(${sx(player)} ${sz(player)}) rotate(${-player.yaw*180/Math.PI})" fill="#ff6f58"/><text x="10" y="263" fill="#fce1a0" font-size="9">M · ${tr('CITY MAP','শহরের মানচিত্র')}</text></svg>`;mapArrow=map.querySelector('.player-arrow');}mapArrow?.setAttribute('transform',`translate(${sx(player)} ${sz(player)}) rotate(${-player.yaw*180/Math.PI})`)}
 map.onclick=()=>{largeMap=!largeMap;drawMap()};
 const keyMap={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',KeyP:'p',KeyH:'h',KeyM:'m',Space:' ',ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d',Escape:'p'};
 window.addEventListener('keydown',e=>{if(!active)return;streetAudio.unlock();const k=keyMap[e.code];if(!k)return;e.preventDefault();if(k==='p'&&!e.repeat)pause(!paused);if(k==='e'&&!paused&&!e.repeat)gate();if(k==='m'&&!e.repeat){largeMap=!largeMap;drawMap()}if(k==='h'&&!e.repeat){streetAudio.horn();helper('Horn won’t make the road wider, Ostad!','হর্ন দিলে রাস্তা চওড়া হবে না ওস্তাদ!')}if(!paused)held.add(k)},true);window.addEventListener('keyup',e=>held.delete(keyMap[e.code]),true);window.addEventListener('blur',()=>held.clear());
 root.querySelectorAll('[data-key]').forEach(b=>{const keys={ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d'};b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held.add(keys[b.dataset.key])};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>held.delete(keys[b.dataset.key])});el('doors').onclick=gate;el('pause').onclick=()=>pause(!paused);el('resume').onclick=()=>pause(false);el('restart').onclick=()=>reset();el('horn').onclick=()=>{streetAudio.horn();helper('A little patience, Ostad!','একটু ধৈর্য ওস্তাদ!')};el('exit').onclick=()=>{streetAudio.stop();opening.hide();slowJoke.hide();busStops.hide();busImpacts.hide();presence?.stop();active=false;held.clear();cancelAnimationFrame(raf);root.hidden=true;document.body.style.overflow='';onExit()};
 // Traffic follows actual graph edges and curved junction paths, rather than a straight treadmill.
 const traffic=[];const trafficLod=createTrafficLod(T,{box,mat});
 const templates=new Map(),spares=new Map(),templateRoot=new T.Group();templateRoot.position.y=-10000;scene.add(templateRoot);
 for(const [type,count]of [['rickshaw',8],['bike',6],['cng',6],['bus',4],['car',6]])for(let i=0;i<count;i++){const model=city.vehicle(type,i);templates.set(type+':'+i,model);templateRoot.add(model.g);}
 const styleSeed=index=>{let value=Math.imul(index+1,2654435761);value^=value>>>16;value=Math.imul(value,2246822519);return(value^(value>>>13))>>>0};
 const templateKey=(type,index)=>type+':'+index%({rickshaw:8,bike:6,cng:6,bus:4,car:6}[type]);
 function acquireDetail(type,index){const key=templateKey(type,index),pool=spares.get(key);if(pool?.length)return pool.pop();const source=templates.get(key),g=source.g.clone(true),originals=[],copies=[];source.g.traverse(o=>originals.push(o));g.traverse(o=>copies.push(o));const mapping=new Map(originals.map((o,i)=>[o,copies[i]]));return{g,wheels:source.wheels.map(w=>mapping.get(w)),length:source.length,width:source.width};}
 function releaseDetail(type,index,model){const key=templateKey(type,index);if(!spares.has(key))spares.set(key,[]);spares.get(key).push(model);}
 let detailTime=1;
 function updateTrafficDetail(dt){detailTime+=dt;if(detailTime<.3)return;detailTime=0;const nearby=[...traffic].sort((a,b)=>Math.hypot(a.g.position.x-player.x,a.g.position.z-player.z)-Math.hypot(b.g.position.x-player.x,b.g.position.z-player.z));const selected=new Set(nearby.filter(n=>Math.hypot(n.g.position.x-player.x,n.g.position.z-player.z)<65).slice(0,36));for(const n of traffic){if(selected.has(n)){const model=n.ensureDetail();n.wheels=model?.wheels||[];}else{n.releaseDetail();n.wheels=[];}}}

 // Dense mixed traffic: 42% rickshaws, 33% bikes, followed by CNGs, buses and cars.
 const types=[...Array(140).fill('rickshaw'),...Array(112).fill('bike'),...Array(28).fill('cng'),...Array(24).fill('bus'),...Array(16).fill('car')];
 // Interleave types rather than creating consecutive blocks of identical vehicles.
 const mixedTypes=types.map((type,i)=>({type,order:(i*137)%331})).sort((a,b)=>a.order-b.order).map(v=>v.type);

 function planCar(n,from,to){const a=getPlace(from),b=getPlace(to),dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz);n.from=from;n.to=to;const p=world.pose(from,to,34,n.lane),q=world.pose(from,to,len-34,n.lane);n.curve=new T.LineCurve3(new T.Vector3(p.x,0,p.z),new T.Vector3(q.x,0,q.z));n.length=n.curve.getLength();n.along=0;n.turn=false;n.straight=false}
 function nextLeg(n){if(n.turn){planCar(n,n.to,n.next);return}const choices=exits(n.to).filter(e=>e.target.id!==n.from),next=(choices.length?choices:exits(n.to))[Math.floor(Math.random()*(choices.length||1))].target.id;const b=getPlace(n.to),start=n.curve.getPoint(1),endPose=world.pose(n.to,next,34,n.lane),end=new T.Vector3(endPose.x,0,endPose.z),points=[start];if(b.junction==='circle'){const a=Math.atan2(start.z-b.z,start.x-b.x),endAngle=Math.atan2(end.z-b.z,end.x-b.x);let delta=endAngle-a;while(delta<0)delta+=Math.PI*2;for(let i=0;i<=8;i++){const t=i/8,angle=a+delta*t;points.push(new T.Vector3(b.x+Math.cos(angle)*(12+n.lane*.75),0,b.z+Math.sin(angle)*(12+n.lane*.75)))}}else points.push(new T.Vector3(b.x+(start.x-b.x)*.2,0,b.z+(end.z-b.z)*.2));points.push(end);const incoming=getPlace(n.from),outgoing=getPlace(next),ax=b.x-incoming.x,az=b.z-incoming.z,bx=outgoing.x-b.x,bz=outgoing.z-b.z;n.straight=b.junction!=='circle'&&ax*bx+az*bz>0&&Math.abs(ax*bz-az*bx)<.01;n.curve=n.straight?new T.LineCurve3(start,end):new T.CatmullRomCurve3(points);n.curve.arcLengthDivisions=32;n.length=n.curve.getLength();n.along=0;n.turn=true;n.next=next}
 mixedTypes.forEach((type,i)=>{const model=trafficLod.lazy(type,styleSeed(i),acquireDetail,releaseDetail),road=roads[i%roads.length],n={...model,type,priority:i,lane:type==='rickshaw'?10.8:type==='bike'?[4.2,7.2,10.8][i%3]:type==='bus'?5:8.3,cruise:type==='rickshaw'?4.2+(i%3)*.5:type==='bike'?12+(i%4):type==='bus'?10:11,velocity:0,aiTime:0,modelLength:model.length||3};scene.add(n.g);planCar(n,i%2?road.to:road.from,i%2?road.from:road.to);n.along=n.length*((i%7)+1)/8;traffic.push(n)});
 // Three isolated pull-ins, deliberately far apart; these are not repeated at junctions.
 for(const [i,site]of [{from:'mirpur12',to:'mirpur11',along:145},{from:'shewrapara',to:'agargaon',along:150},{from:'technical',to:'gabtoli',along:150}].entries()){
  const model=trafficLod.lazy('bus',styleSeed(1000+i),acquireDetail,releaseDetail),n={...model,type:'bus',priority:1000+i,parked:site,lane:14.6,cruise:0,velocity:0,aiTime:0,modelLength:9.45};scene.add(n.g);traffic.push(n);
 }
 function pushTrafficBus(bus,distance){
  // Follow the actual curved road path, including a junction transition.
  let left=distance;for(let pass=0;pass<3&&left>.001;pass++){const remaining=bus.length-bus.along,advance=Math.min(left,remaining);bus.along+=advance;left-=advance;if(bus.along>=bus.length-.001)nextLeg(bus);}
  const p=bus.curve.getPointAt(Math.min(bus.along/bus.length,1)),v=bus.curve.getTangentAt(Math.min(bus.along/bus.length,1));bus.g.position.copy(p);bus.g.rotation.y=Math.atan2(-v.x,-v.z);bus.velocity=Math.max(bus.velocity,1.5);
 }
 function seedTraffic(placeId){const start=getPlace(placeId),nearby=[...roads].sort((a,b)=>{const centre=r=>{const p=getPlace(r.from),q=getPlace(r.to);return Math.hypot((p.x+q.x)/2-start.x,(p.z+q.z)/2-start.z)};return centre(a)-centre(b)});
  const occupied=[];traffic.forEach((n,i)=>{
   if(n.parked){planCar(n,n.parked.from,n.parked.to);n.along=Math.max(0,Math.min(n.length,n.parked.along-34));n.velocity=0;}
   else{const road=nearby[i<160?i%Math.min(5,nearby.length):i%nearby.length],reverse=Math.floor(i/nearby.length)%2;planCar(n,reverse?road.to:road.from,reverse?road.from:road.to);const initial=n.length*((i*.61803398875)%1);
    for(let attempt=0;attempt<48;attempt++){n.along=(initial+attempt*(n.modelLength+2.2))%n.length;const point=n.curve.getPointAt(n.along/n.length);if(Math.hypot(point.x-player.x,point.z-player.z)<10)continue;if(!occupied.some(o=>o.from===n.from&&o.to===n.to&&Math.abs(o.lane-n.lane)<(o.width+n.width)/2+.15&&Math.abs(o.along-n.along)<(o.modelLength+n.modelLength)/2+1))break;}
    n.velocity=n.cruise*.6;occupied.push(n);
   }
   const point=n.curve.getPointAt(n.along/n.length),tangent=n.curve.getTangentAt(n.along/n.length);n.g.position.copy(point);n.g.rotation.y=Math.atan2(-tangent.x,-tangent.z);n.aiTime=0;
  });rebuildTrafficGrid();gridTime=0;

 }
 const trafficGrid=new Map();let gridTime=0;
 function rebuildTrafficGrid(){trafficGrid.clear();for(const n of traffic){const key=Math.floor(n.g.position.x/18)+':'+Math.floor(n.g.position.z/18);if(!trafficGrid.has(key))trafficGrid.set(key,[]);trafficGrid.get(key).push(n)}}
 function blockedByTraffic(n,p,v){const gx=Math.floor(p.x/18),gz=Math.floor(p.z/18);for(let x=gx-1;x<=gx+1;x++)for(let z=gz-1;z<=gz+1;z++)for(const o of trafficGrid.get(x+':'+z)||[]){if(o===n)continue;const dx=o.g.position.x-p.x,dz=o.g.position.z-p.z,ahead=dx*v.x+dz*v.z,side=Math.abs(dx*v.z-dz*v.x),sameDirection=-Math.sin(o.g.rotation.y)*v.x-Math.cos(o.g.rotation.y)*v.z;
  if(sameDirection>.6&&ahead>.1&&ahead<(n.modelLength+o.modelLength)/2+1.3&&side<(n.width+o.width)/2+.12)return true;
  // Crossing movements yield by a stable priority, preventing circular mutual waits.
  if(n.turn&&o.turn&&n.to===o.to&&sameDirection<=.6&&o.priority<n.priority&&Math.hypot(dx,dz)<(n.modelLength+o.modelLength)/2+1.2)return true;
 }return false;}


 const peers=new Map();let presence;
 const online=document.createElement('div');online.className='network-online';online.textContent=tr('Connecting…','সংযোগ হচ্ছে…');root.append(online);
 function connect(){presence=createPresence({characterId,onStatus:count=>online.textContent=count===null?tr('Offline · local play','অফলাইন · নিজের খেলা'):tr(count+' players · same city',count+' জন · একই শহর'),onSnapshot:list=>{const ids=new Set(list.map(p=>p.id));for(const[id,p]of peers)if(!ids.has(id)){scene.remove(p.model.g);peers.delete(id)}for(const p of list){let peer=peers.get(p.id);if(!peer){const model=p.characterId==='cng'?cngFactory.create(1):p.characterId==='biker'?bikeFactory.create(1):p.characterId==='rickshaw'?createRickshaw(T,{box,label,mat,person},1):busFactory.create({variant:1});model.g.position.set(p.x,0,p.z);scene.add(model.g);peer={model,target:p};peers.set(p.id,peer)}peer.target=p}}})}
 connect();
 const follow=new T.Vector3(),target=new T.Vector3();let hud=0,steering=0;
 function frame(now){if(!active)return;raf=requestAnimationFrame(frame);const dt=Math.min((now-lastTime)/1000||0,.04);lastTime=now;presence?.update({x:player.x,z:player.z,yaw:player.yaw,speed});for(const peer of peers.values()){peer.model.g.position.lerp(target.set(peer.target.x,0,peer.target.z),1-Math.exp(-10*dt));const yaw=peer.model.g.rotation.y,difference=Math.atan2(Math.sin(peer.target.yaw-yaw),Math.cos(peer.target.yaw-yaw));peer.model.g.rotation.y+=difference*(1-Math.exp(-10*dt));peer.model.wheels.forEach(w=>w.rotation.x-=peer.target.speed*dt/.5)}if(!paused){elapsed+=dt;collisionCooldown=Math.max(0,collisionCooldown-dt);vegetation.update(elapsed,document.body.classList.contains('reduce-motion'));city.animateWalkers(world.chunks,elapsed);
  if(stage==='pickup'){boardTime+=dt;if(boardTime>=5.3){stage='drive';doorOpen=false;markers.clear();}}
  const gas=held.has('w'),reverseKey=held.has('s'),brake=held.has(' ');
  reverseWait=reverseKey&&Math.abs(speed)<.15?reverseWait+dt:0;
  if((gas||reverseKey)&&stage!=='pickup')doorOpen=false;
  if(!doorOpen){if(brake)speed=Math.sign(speed)*Math.max(0,Math.abs(speed)-18*dt);else if(gas)speed=Math.min(characterId==='bus'?110/3.6:27,speed+(speed<0?12:6.5)*dt);else if(reverseKey){if(speed>0)speed=Math.max(0,speed-18*dt);else if(reverseWait>.3||speed<-.01)speed=Math.max(-4,speed-3.5*dt);}else speed=Math.sign(speed)*Math.max(0,Math.abs(speed)-1.1*dt);}else speed=0;
  const steer=(held.has('a')?1:0)-(held.has('d')?1:0),old={...player};steering+=(steer-steering)*(1-Math.exp(-9*dt));const steeringSpeed=Math.abs(speed)<1.2&&(gas||reverseKey)?(reverseKey&&!gas?-1.2:1.2):speed;
  player.yaw+=steering*steeringSpeed/(characterId==='bus'?6.3:2.8)*Math.tan(.48/(1+Math.abs(speed)*.055))*dt;player.x-=Math.sin(player.yaw)*speed*dt;player.z-=Math.cos(player.yaw)*speed*dt;

  let forcedStop=false;
  if(!world.drivable(player.x,player.z)&&!world.canRecover(old,player)){forcedStop=true;player.x=old.x;player.z=old.z;speed=0;helper('Stay on the road. Turn slowly at the circle.','রাস্তায় থাকুন। গোলচত্বরে ধীরে মোড় নিন।')}
  if(speed>=0&&world.mustStop(player,elapsed)){forcedStop=true;player=old;speed=0;helper('Red light. Wait before the junction.','লাল বাতি। মোড়ের আগে অপেক্ষা করুন।')}
  if(world.crossingAhead(speed<0?{...player,yaw:player.yaw+Math.PI}:player,8+Math.abs(speed)*.6)){forcedStop=true;player=old;speed=0;helper('Let the pedestrians cross first.','পথচারীদের আগে যেতে দিন।')}
  const impact=busImpacts.update(dt,{player,previous:old,speed,traffic,enabled:stage==='drive'&&characterId==='bus'&&!forcedStop});speed=impact.speed;if(impact.hit)forcedStop=true;
  const metroTravel=((elapsed*18+metroPhase)%2800+2800)%2800;train.position.set(0,0,metroTravel<1400?500-metroTravel:-900+metroTravel-1400);train.rotation.y=metroTravel<1400?0:Math.PI;train.visible=Math.abs(player.x)<380;updateBus();bus.door.rotation.y=T.MathUtils.lerp(bus.door.rotation.y,doorOpen?1.25:0,dt*6);bus.wheels.forEach(w=>w.rotation.x-=speed*dt/.63);world.update(player,elapsed);
  updateTrafficDetail(dt);
  let blockingTraffic=false;
  gridTime+=dt;if(gridTime>.1){rebuildTrafficGrid();gridTime=0;}
  for(const n of traffic){const distance=Math.hypot(n.g.position.x-player.x,n.g.position.z-player.z);n.aiTime+=dt;n.g.visible=distance<230;if(n.parked){n.velocity=0;n.aiTime=0;continue;}if(distance>280&&n.aiTime<.14)continue;const step=n.aiTime;n.aiTime=0;
   n.point||=new T.Vector3();n.tangent||=new T.Vector3();const p=n.curve.getPointAt(Math.min(n.along/n.length,1),n.point),v=n.curve.getTangentAt(Math.min(n.along/n.length,1),n.tangent);
   const dx=player.x-p.x,dz=player.z-p.z,playerAhead=dx*v.x+dz*v.z,playerSide=Math.abs(dx*v.z-dz*v.x);
   const nearPlayer=playerAhead>0&&playerAhead<(n.modelLength+9.5)/2+2&&playerSide<((n.width||1.5)+3.1)/2+.2;
   if(nearPlayer&&Math.abs(speed)<.3)blockingTraffic=true;
   const pose={x:p.x,z:p.z,yaw:Math.atan2(-v.x,-v.z)},stopped=nearPlayer||blockedByTraffic(n,p,v)||world.crossingAhead(pose,9)||(!n.turn&&world.mustStop(pose,elapsed));
   const desired=stopped?0:Math.min(n.cruise,n.turn&&!n.straight?5:n.cruise);n.velocity+=T.MathUtils.clamp(desired-n.velocity,-16*step,3*step);n.along+=n.velocity*step;n.g.position.set(p.x,0,p.z);n.g.rotation.y=pose.yaw;
   if(n.g.visible&&n.detail.visible){n.animate?.(elapsed,n.velocity>.2);n.wheels.forEach(w=>w.rotation.x-=n.velocity*step/.4);}if(n.along>=n.length)nextLeg(n);
  }
  let queuedBehind=0,waitingForTraffic=false;if(Math.abs(speed)<.3){const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);for(const other of traffic){const dx=other.g.position.x-player.x,dz=other.g.position.z-player.z,along=dx*fx+dz*fz,side=Math.abs(dx*fz-dz*fx),sameDirection=Math.cos(other.g.rotation.y-player.yaw)>.7;if(along<-5&&along>-48&&side<3.4&&other.velocity<.8&&sameDirection)queuedBehind++;
   const gap=along-(9.45+other.modelLength)/2;if(along>0&&gap<5.5&&gap>-.5&&side<(3.05+other.width)/2-.1&&other.velocity<.8&&sameDirection)waitingForTraffic=true;
  }}
  busStops.update(dt,{player,speed:Math.abs(speed),driving:stage==='drive'&&characterId==='bus',forced:forcedStop||waitingForTraffic,blockingTraffic,congestion:queuedBehind>=2});

  slowJoke.update(dt,Math.abs(speed),stage==='drive'&&characterId==='bus'&&!busStops.busy&&!busImpacts.busy);

  sun.position.set(player.x-35,55,player.z+20);sun.target.position.set(player.x,0,player.z-15);streetAudio.update(dt,Math.abs(speed));
 }
 const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);follow.set(player.x-fx*17,7,player.z-fz*17);target.set(player.x+fx*5,2,player.z+fz*5);camera.position.lerp(follow,1-Math.exp(-7*dt));camera.lookAt(target);if(stage==='pickup')opening.update(boardTime);slowJoke.position();busStops.position();busImpacts.position();renderer.render(scene,camera);hud+=dt;if(hud>.15){ui();hud=0}}
 window.addEventListener('resize',()=>{renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
 instance={resume(nextLang,nextExit,nextStart,nextCharacter){language=nextLang;onExit=nextExit;const changed=nextCharacter!==characterId;characterId=nextCharacter||'bus';streetAudio.unlock();if(changed)setVehicle();reset(nextStart);connect();active=true;root.hidden=false;pause(false);document.body.style.overflow='hidden';lastTime=performance.now();raf=requestAnimationFrame(frame)}};
 // Prepare shaders and textures during loading, before turning can expose new blocks.
 const ready=document.createElement('div');ready.className='mission-preparing';ready.textContent=tr('Preparing the first stop…','প্রথম স্টপ প্রস্তুত হচ্ছে…');root.append(ready);
 camera.position.set(0,8,-850);camera.lookAt(0,2,-870);scene.updateMatrixWorld(true);
 const textures=new Set();scene.traverse(object=>{if(!object.material)return;for(const material of Array.isArray(object.material)?object.material:[object.material])for(const value of Object.values(material))if(value?.isTexture)textures.add(value)});
 let warmed=0;for(const texture of textures){renderer.initTexture(texture);if(++warmed%20===0)await new Promise(resolve=>requestAnimationFrame(resolve));}
 try{if(renderer.compileAsync)await renderer.compileAsync(scene,camera);else renderer.compile(scene,camera)}catch{}templateRoot.visible=false;ready.remove();
 reset();pause(false);active=true;document.body.style.overflow='hidden';camera.position.set(player.x+10,9,player.z+15);lastTime=performance.now();raf=requestAnimationFrame(frame);
}
