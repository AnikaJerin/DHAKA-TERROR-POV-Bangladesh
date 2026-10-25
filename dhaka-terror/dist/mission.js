import { createRoutePlan } from './shared/map/route-plan.js';
import { createBangladeshBusFactory } from './bangladesh-bus.js';
import { createVegetation } from './vegetation.js';
import { createNeighborhoods } from './neighborhoods.js';
import { createMetroStructure } from './metro-structure.js';
import { createCityDetails } from './city-details.js';
// One persistent world; mission definitions can be extended without separate game pages.
export const missions=[{id:'bus-01',title:['First trip, Mirpur','প্রথম ট্রিপ, মিরপুর'],pickup:0,dropoff:620,passengers:3}];
let instance;
export async function startBusMission({language='en',startPlaceId='mirpur12',onExit=()=>{}}={}){
 if(instance){instance.resume(language,onExit,startPlaceId);return}
 const root=document.createElement('section');root.className='mission-screen';root.setAttribute('aria-label','Dhaka Terror 3D bus mission');document.body.append(root);
 let routePlan=createRoutePlan(startPlaceId);
 const bn=()=>language==='bn',tr=(en,b)=>bn()?b:en;
 root.innerHTML=`<div class="mission-fallback"><h2>Preparing Dhaka in 3D…</h2><p>Loading the 3D renderer.</p><button class="mission-pill" id="load-exit">Back to welcome</button></div>`;
 root.querySelector('#load-exit').onclick=()=>{root.remove();onExit()};
 let T;try{T=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')}catch{root.querySelector('.mission-fallback p').textContent=tr('The 3D library could not load. Connect to the internet and try again.','থ্রিডি লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ দিয়ে আবার চেষ্টা করুন।');return}
 if(!root.isConnected)return;
 // Rasterize world lettering only after Bengali glyphs are ready (bounded offline fallback).
 if(document.fonts){try{await Promise.race([document.fonts.load('700 48px "Noto Sans Bengali"'),new Promise(resolve=>setTimeout(resolve,1800))])}catch{}}
 let renderer;try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'})}catch{root.querySelector('.mission-fallback p').textContent='WebGL is unavailable. Enable hardware acceleration or use a WebGL-compatible browser.';return}
 root.innerHTML=`<div class="mission-top"><div class="mission-brand">DHAKA TERROR<small id="district"></small></div><div><button class="mission-pill" id="pause"></button> <button class="mission-pill" id="exit"></button></div></div><aside class="mission-objective"><div class="eyebrow" id="mission-number"></div><h2 id="mission-title"></h2><p id="objective"></p><div class="mission-progress"><i id="progress"></i></div><div class="mission-stats"><span id="passengers"></span><span id="respect"></span></div></aside><aside class="mission-helper"><small id="helper-label"></small><span id="helper-line"></span></aside><div class="mission-controls"><button class="mission-action" id="doors"></button><button id="horn"></button><button id="restart"></button></div><div class="mission-bottom" id="keys"></div><div class="drive-touch" aria-label="Driving controls"><button data-key="ArrowLeft" aria-label="Steer left">←</button><button data-key="ArrowUp" aria-label="Accelerate">↑</button><button data-key="ArrowRight" aria-label="Steer right">→</button><button data-key="ArrowDown" aria-label="Brake">↓</button></div><div class="mission-speed"><strong id="speed">0</strong><small>KM/H</small></div><div class="mission-pause" hidden><h2 id="pause-title"></h2><p id="pause-copy"></p><button class="primary" id="resume"></button></div>`;
 const el=id=>root.querySelector('#'+id);
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','3D Dhaka street. Use arrow keys to drive the bus.');root.prepend(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#a8d7e7');scene.fog=new T.Fog('#a8d7e7',120,310);
 const camera=new T.PerspectiveCamera(48,innerWidth/innerHeight,.1,330);
 scene.add(new T.HemisphereLight('#ffffff','#b0d4e5',2.1));const sun=new T.DirectionalLight('#fffaf1',2.5);sun.position.set(-35,55,20);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-40;sun.shadow.camera.right=40;sun.shadow.camera.top=55;sun.shadow.camera.bottom=-55;sun.shadow.normalBias=.04;scene.add(sun,sun.target);
 const mats=new Map(),geo=new T.BoxGeometry(1,1,1);function mat(color){if(!mats.has(color))mats.set(color,new T.MeshStandardMaterial({color,roughness:.82}));return mats.get(color)}
 function box(parent,x,y,z,w,h,d,color){const m=new T.Mesh(geo,mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=h>.4;m.receiveShadow=true;parent.add(m);return m}
 function cylinder(parent,x,y,z,r,h,color,sides=10){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),mat(color));m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m}
 function label(parent,text,x,y,z,w=5,h=1.1,bg='#234b43',fg='#fff9e5'){
  const c=document.createElement('canvas');c.width=1024;c.height=Math.max(128,Math.min(1024,Math.round(1024*h/w)));
  const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=fg;ctx.globalAlpha=.45;ctx.lineWidth=5;ctx.strokeRect(7,7,c.width-14,c.height-14);ctx.globalAlpha=1;
  ctx.textAlign='center';ctx.textBaseline='middle';let size=Math.floor(c.height*.56);ctx.font=`800 ${size}px "Noto Sans Bengali", sans-serif`;
  while(ctx.measureText(text).width>c.width-54&&size>18){size-=2;ctx.font=`800 ${size}px "Noto Sans Bengali", sans-serif`}
  ctx.fillStyle=fg;ctx.fillText(text,c.width/2,c.height*.52);
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
  const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:tex,side:T.DoubleSide,toneMapped:false}));m.position.set(x,y,z);parent.add(m);return m;
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
 const busFactory=createBangladeshBusFactory(T,{box,label,mat,person});
 const bus=busFactory.create({variant:0,player:true});scene.add(bus.group);
 // Southbound neighborhood order; Mirpur 12 is the Pallabi-area game start.
 const districts=Array.from({length:4},(_,i)=>routePlan.districtAt(i));
 const metroStructure=createMetroStructure(T);
 const vegetation=createVegetation(T);
 const neighborhoods=createNeighborhoods(T,{box,cylinder,label,mat,vegetation});
 const cityDetails=createCityDetails(T,{box,cylinder,label,person,mat,neighborhoods,busFactory});
 const segmentLength=160,segments=[];
 function tree(p,x,z){return vegetation.tree(p,x,z,1,Math.floor(Math.abs(z+x))%9)}
 function makeSegment(index){const g=new T.Group();g.position.z=-index*segmentLength;scene.add(g);const district=routePlan.districtAt(index);box(g,0,-.3,-80,110,.5,160,'#9caa91');box(g,0,.02,-80,22,.12,160,'#546365');for(const side of [-1,1]){box(g,side*12.7,.18,-80,3.4,.35,160,'#b7b8a2');for(let j=0;j<20;j++)box(g,side*11,.26,-j*8-4,.28,.35,4,j%2?'#d1cba9':'#424f4b')}
 for(let z=-4;z>-160;z-=9){box(g,-5.7,.095,z,.12,.025,4,'#e7dfb9');box(g,5.7,.095,z,.12,.025,4,'#e7dfb9')}
 // Street-facing facades, tiled pavements, vendors and walkers.
 cityDetails.decorate(g,index,district.type);
 for(const side of [-1,1])for(let j=0;j<8;j++){
  const z=-12-j*20;
  if(j%2===0)tree(g,side*16.8,z+8);
  cylinder(g,side*10.6,4.3,z,.075,8.6,'#7b96a5');box(g,side*9.8,8.6,z,1.7,.1,.4,'#f6f1da');
 }
 if(district.type==='metro')metroStructure.decorate(g,index);
 if(district.type==='expressway'){box(g,15,10,-80,11,1.1,160,'#929f98');for(const x of [9.6,20.4])box(g,x,11,-80,.3,1.1,160,'#bdc1ab');for(let z=-20;z>-160;z-=40)box(g,15,5,z,1.6,10,2,'#8c9d94')}
 if(index%2===0)neighborhoods.footbridge(g,index);
 return{group:g,index}}
 for(let i=-1;i<4;i++)segments.push(makeSegment(i));
 // A looping metro train shares the same procedural world.
 const train=new T.Group();for(let i=0;i<3;i++){box(train,0,11.7,i*12,3.7,2.7,11.5,'#dde2cf');box(train,0,10.7,i*12,3.75,.45,11.6,'#347e5e');for(const x of [-1.87,1.87])for(let w=0;w<5;w++)box(train,x,12,i*12-4+w*2,.04,.9,1.5,'#3b6064')}for(let car=0;car<3;car++){
 for(const side of [-1,1])for(const dz of [-3,3]){box(train,side*1.89,11.7,car*12+dz,.045,1.9,.9,'#e9ede4');box(train,side*1.92,12.1,car*12+dz,.025,.65,.65,'#3c8e9f')}
 box(train,0,11.7,car*12+5.85,3.3,1.6,.06,'#24835f');
 for(const dz of [-3.55,3.55]){
  box(train,0,10.58,car*12+dz,2.4,.26,1.55,'#354247');
  for(const side of [-1,1])for(const axle of [-.4,.4]){const wheel=cylinder(train,side*1.06,10.58,car*12+dz+axle,.23,.12,'#66777c',12);wheel.rotation.z=Math.PI/2;}
 }
}label(train,'ঢাকা মেট্রো',0,11.85,29.9,3, .6,'#16845a','#fff9d5');scene.add(train);
 function stop(z,name){const g=new T.Group();g.position.z=z;scene.add(g);box(g,-9.1,.13,0,3.5,.12,14,'#c7b15f');for(const x of [-13,-16])box(g,x,1.65,0,.12,3.3,7,'#43675b');box(g,-14.5,3.4,0,4,.18,7.4,'#d2c497');label(g,name,-13.6,2.6,3.8,4,.8);cylinder(g,-10.5,2.1,6,.09,4.2,'#47675b');label(g,'BUS STOP',-10.5,3.7,6.1,1.8,.65);return g}
 let pickupStop=stop(0,routePlan.start.en.toUpperCase()),dropoffStop=stop(-620,routePlan.goal.en.toUpperCase());const waiting=[person(scene,-11.9,1,'#a47a6b'),person(scene,-12.4,3,'#708b97'),person(scene,-13,5,'#bda16c')];
 const traffic=[];const vehicleTypes=['cng','car','rickshaw','bike','bus','auto','car','cng','bus','rickshaw','bike','auto','car','rickshaw','car','bike','cng','car','bus','bike','auto','car','cng','bike'];
 for(let i=0;i<vehicleTypes.length;i++){
  const model=cityDetails.vehicle(vehicleTypes[i],i);const opposite=i%3===2;
  model.g.position.set(opposite?(i%2?7.5:3.2):(i%2?-2.8:-6.1),0,-38-i*16);
  if(opposite)model.g.rotation.y=Math.PI;
  const cruising=({rickshaw:3.8,bike:15,car:13,cng:9.5,auto:7.5,bus:10})[vehicleTypes[i]]+(i%3)*.7;scene.add(model.g);traffic.push({...model,v:cruising*(opposite?-1:1),speed:cruising});
 }
 let distance=0,speed=0,x=-8.5,stage='pickup',boarded=0,respect=0,doorOpen=false,paused=false,active=true,lastTime=0,boardTimer=0,collisionCooldown=0,completed=false,raf,elapsed=0;const held=new Set();
 const progressState={schemaVersion:1,activeRoleId:'bus',completedMissionIds:[]};try{Object.assign(progressState,JSON.parse(localStorage.getItem('dhaka-missions')||'{}'))}catch{}
 function helper(en,b){el('helper-line').textContent=tr(en,b)}
 function ui(){const district=routePlan.districtAt(Math.floor(distance/160));el('district').textContent=(bn()?district.bn:district.name)+' / '+tr('CONTINUOUS DHAKA','বিরামহীন ঢাকা');el('mission-number').textContent=completed?tr('FREE DRIVE / MORE STORIES AHEAD','মুক্ত ভ্রমণ / সামনে আরও গল্প'):tr('BUS CAMPAIGN / MISSION 01','বাস অভিযান / মিশন ০১');el('mission-title').textContent=completed?tr('The city keeps moving','শহর চলতেই থাকে'):tr('First trip: '+routePlan.start.en,'প্রথম ট্রিপ: '+routePlan.start.bn);el('objective').textContent=stage==='pickup'?tr('Your helper is boarding 3 passengers. The gate closes automatically, then hold W or ↑ to drive.','হেলপার ৩ জন যাত্রী তুলছেন। গেট নিজে বন্ধ হলে W বা ↑ চেপে চালান।'):stage==='drive'?tr(`Drive to the marked stop. ${Math.max(0,Math.round(620-distance))} m remaining to ${routePlan.goal.en}. Brake near the yellow bay, pull left and open the gate.`,`চিহ্নিত স্টপে যান। বাকি ${Math.max(0,Math.round(620-distance))} মিটার (${routePlan.goal.bn})। হলুদ স্টপে ব্রেক করে বামে দাঁড়িয়ে গেট খুলুন।`):tr('Mission 1 complete. Keep driving through the endless city. Future missions will join this same route.','মিশন ১ সম্পন্ন। বিরামহীন শহরে চালিয়ে যান। ভবিষ্যতের মিশন এই রুটেই যুক্ত হবে।');el('passengers').textContent=tr('ON BOARD ','যাত্রী ')+boarded+'/3';el('respect').textContent=tr('RESPECT ','সম্মান ')+respect;el('progress').style.width=(stage==='pickup'?boarded/3*20:completed?100:20+Math.min(distance/620,1)*75)+'%';el('doors').textContent=doorOpen?tr('E · Close gate','E · গেট বন্ধ'):tr('E · Open gate','E · গেট খুলুন');el('pause').textContent=tr('P · Pause','P · বিরতি');el('exit').textContent=tr('Menu','মেনু');el('horn').textContent=tr('H · Horn','H · হর্ন');el('restart').textContent=tr('Restart trip','ট্রিপ আবার');el('keys').textContent=tr('WASD / ARROWS · DRIVE     SPACE · BRAKE     E · GATE','WASD / তীর · চালান     SPACE · ব্রেক     E · গেট');el('helper-label').textContent=tr('YOUR HELPER / AT THE GATE','আপনার হেলপার / বাসের গেটে');el('speed').textContent=Math.round(speed*3.6)}
 function reset(){distance=0;speed=0;x=-8.5;stage='pickup';boarded=0;respect=0;doorOpen=true;boardTimer=0;completed=false;elapsed=0;for(const p of waiting){p.group.visible=true;p.group.position.x=-12.1}for(let i=0;i<segments.length;i++){scene.remove(segments[i].group);disposeSegment(segments[i]);segments[i]=makeSegment(i-1)}traffic.forEach((n,i)=>{n.g.position.z=-38-i*16;n.speed=Math.abs(n.v)});helper('Mirpur 12! I’m boarding everyone. Then hold W or ↑ and we’re off!','মিরপুর ১২! যাত্রী তুলে নিই। তারপর W বা ↑ চেপে চালান ওস্তাদ!');ui()}
 function gate(){if(speed>.3){helper('Stop the bus first, Ostad. The gate stays closed while moving.','আগে বাস থামান ওস্তাদ। চলন্ত বাসে গেট খুলবে না।');return}doorOpen=!doorOpen;if(doorOpen&&stage==='drive'){if(Math.abs(distance-620)<18&&x<-6.6){stage='done';completed=true;boarded=0;respect+=60;if(!progressState.completedMissionIds.includes('bus-01'))progressState.completedMissionIds.push('bus-01');try{localStorage.setItem('dhaka-missions',JSON.stringify(progressState))}catch{}helper('All passengers safely dropped off! First trip done. Shall we keep going?','সব যাত্রী নিরাপদে নেমেছেন! প্রথম ট্রিপ শেষ। সামনে যাই ওস্তাদ?')}else helper('Not our stop yet. Look for the yellow bay at Mirpur 10.','এখনো স্টপ আসেনি। মিরপুর ১০-এর হলুদ স্টপ খুঁজুন।')}ui()}
 function pause(value){paused=value;held.clear();root.querySelector('.mission-pause').hidden=!value;el('pause-title').textContent=tr('A little breathing room.','একটু বিরতি।');el('pause-copy').textContent=tr('Your driver and helper are waiting. Resume when you are ready.','চালক ও হেলপার অপেক্ষায় আছেন। প্রস্তুত হলে আবার শুরু করুন।');el('resume').textContent=tr('Resume trip ↗','আবার চালান ↗')}
 function horn(){helper('A little patience, Ostad. The jam won’t disappear with the horn!','একটু ধৈর্য ওস্তাদ। হর্ন দিলে জ্যাম উধাও হয় না!')}
 function action(key){if(key==='e')gate();if(key==='p'||key==='escape')pause(!paused);if(key==='h')horn()}
 // Physical key codes work with both Bengali and English keyboard layouts.
 const keyMap={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',KeyP:'p',KeyH:'h',Escape:'escape',Space:' ',ArrowUp:'arrowup',ArrowDown:'arrowdown',ArrowLeft:'arrowleft',ArrowRight:'arrowright'};
 window.addEventListener('keydown',e=>{
  if(!active||e.target instanceof HTMLInputElement||e.target instanceof HTMLTextAreaElement)return;
  const key=keyMap[e.code]||e.key.toLowerCase();if(!Object.values(keyMap).includes(key))return;
  e.preventDefault();e.stopPropagation();
  if(paused&&['w','arrowup','a','d','arrowleft','arrowright'].includes(key))pause(false);
  if(!e.repeat)action(key);if(!paused)held.add(key);
 },true);
 window.addEventListener('keyup',e=>{held.delete(keyMap[e.code]||e.key.toLowerCase())},true);
 window.addEventListener('blur',()=>held.clear());
 document.addEventListener('visibilitychange',()=>{if(document.hidden)held.clear()});
 renderer.domElement.addEventListener('pointerdown',()=>{if(paused)pause(false);renderer.domElement.focus({preventScroll:true})});
 root.querySelectorAll('[data-key]').forEach(b=>{b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);held.add(b.dataset.key.toLowerCase())};b.onpointerup=b.onpointercancel=b.onlostpointercapture=()=>held.delete(b.dataset.key.toLowerCase())});el('doors').onclick=gate;el('horn').onclick=horn;el('restart').onclick=reset;el('pause').onclick=()=>pause(!paused);el('resume').onclick=()=>{pause(false);renderer.domElement.focus({preventScroll:true})};el('exit').onclick=()=>{active=false;held.clear();root.hidden=true;cancelAnimationFrame(raf);document.body.style.overflow='';onExit()};
 function disposeSegment(s){s.group.traverse(o=>{if(o.isInstancedMesh)o.dispose();if(o.isLine){o.geometry.dispose();if(!metroStructure.sharedMaterials.has(o.material)&&!neighborhoods.sharedMaterials.has(o.material)&&!vegetation.sharedMaterials.has(o.material))o.material.dispose()}if(o.isMesh&&o.geometry!==geo&&!cityDetails.sharedGeometries.has(o.geometry)&&!vegetation.sharedGeometries.has(o.geometry))o.geometry.dispose();if(o.isMesh&&o.material.map&&!cityDetails.sharedMaterials.has(o.material)&&!metroStructure.sharedMaterials.has(o.material)&&!neighborhoods.sharedMaterials.has(o.material)&&!vegetation.sharedMaterials.has(o.material)){o.material.map.dispose();o.material.dispose()}else if(o.isMesh&&o.material.isMeshBasicMaterial&&!cityDetails.sharedMaterials.has(o.material)&&!metroStructure.sharedMaterials.has(o.material)&&!neighborhoods.sharedMaterials.has(o.material)&&!vegetation.sharedMaterials.has(o.material)){o.material.dispose()}})}
 const follow=new T.Vector3(),look=new T.Vector3();let hudTimer=0;
 function frame(now){if(!active)return;raf=requestAnimationFrame(frame);const dt=Math.min((now-lastTime)/1000||0,.05);lastTime=now;if(!paused){elapsed+=dt;vegetation.update(elapsed,document.body.classList.contains('reduce-motion')||window.matchMedia('(prefers-reduced-motion: reduce)').matches);cityDetails.animateWalkers(segments,elapsed);collisionCooldown=Math.max(0,collisionCooldown-dt);const accel=held.has('w')||held.has('arrowup'),brake=held.has('s')||held.has('arrowdown')||held.has(' ');if(accel&&stage!=='pickup'&&doorOpen){doorOpen=false;helper('Gate closed. Let’s go, Ostad!','গেট বন্ধ। চালান ওস্তাদ!')}if(!doorOpen){speed=Math.max(0,Math.min(16,speed+(accel?3.5:brake?-12:-1)*dt));if(brake)speed=Math.max(0,speed-8*dt)}else speed=0;
 if(stage==='pickup'&&boarded<3&&speed>.3){speed=0;doorOpen=true;helper('I’m boarding the passengers. Close the gate when everyone is aboard, then drive!','যাত্রী তুলে নিচ্ছি। সবাই উঠলে গেট বন্ধ করে চালান ওস্তাদ!')}
 const steer=(held.has('a')||held.has('arrowleft')?-1:0)+(held.has('d')||held.has('arrowright')?1:0);x=T.MathUtils.clamp(x+steer*dt*(speed*.16),-9.1,9.1);if(cityDetails.crossingAhead(segments,x,-distance,-1,4.65)){
  speed=0;helper('Pedestrians crossing, Ostad. Let them pass first.','পথচারী পার হচ্ছেন ওস্তাদ। আগে তাঁদের যেতে দিন।');
 }distance+=speed*dt;
 if(stage==='pickup'&&doorOpen){boardTimer+=dt;const p=waiting[boarded];if(p){p.group.position.x=T.MathUtils.lerp(p.group.position.x,x-1.8,dt*2);p.group.position.z=T.MathUtils.lerp(p.group.position.z,-distance-1.65,dt*2);if(boardTimer>1.7){p.group.visible=false;boarded++;boardTimer=0;respect+=10;if(boarded===3){stage='drive';doorOpen=false;helper('Three aboard, gate closed! Hold W or ↑ to drive.','তিনজন উঠেছেন, গেট বন্ধ! W বা ↑ চেপে চালান ওস্তাদ!')}else helper('Aste, aste! One at a time.','আস্তে, আস্তে! একজন একজন করে ওঠেন।')}}}
 if(stage==='drive'&&distance>642){distance=590;speed=0;x=-8.5;helper('We passed the stop. Back to the approach—brake early and pull left.','স্টপ পেরিয়ে গেছি। আবার একটু আগে থেকে—ব্রেক করে বামে দাঁড়ান।')}
 bus.group.position.set(x,.06+Math.sin(elapsed*8)*Math.min(speed*.002,.025),-distance);bus.group.rotation.z=-steer*speed*.0015;bus.door.rotation.y=T.MathUtils.lerp(bus.door.rotation.y,doorOpen?1.25:0,dt*6);bus.helper.arm.rotation.z=-.6+(doorOpen&&!document.body.classList.contains('reduce-motion')?Math.sin(elapsed*5)*.35:0);bus.wheels.forEach(w=>w.rotation.x-=speed*dt/.62);
 for(const s of segments)if(s.index*160<distance-240){scene.remove(s.group);disposeSegment(s);const next=Math.max(...segments.map(n=>n.index))+1;const replacement=makeSegment(next);s.group=replacement.group;s.index=replacement.index}
 // Bind the complete train (including its rear carriage) to a connected rail span.
 const railSegments=segments.filter(s=>routePlan.districtAt(s.index).type==='metro').sort((a,b)=>a.index-b.index);
 const railRuns=[];for(const s of railSegments){const run=railRuns[railRuns.length-1];if(run&&s.index===run[run.length-1].index+1)run.push(s);else railRuns.push([s])}
 const run=railRuns.find(r=>r.some(s=>s.index===Math.floor(distance/160)));
 train.visible=!!run;
 if(run){const frontLimit=-(run[run.length-1].index+1)*segmentLength+7,backLimit=-run[0].index*segmentLength-32;const travel=backLimit-frontLimit;if(travel>0){train.position.set(0,.11,backLimit-((elapsed*13)%travel))}else train.visible=false}

 // More frequent traffic with type-specific speeds and same-lane headway.
 for(const n of traffic){
  const heading=n.v>0?-1:1,cruise=Math.abs(n.v),stopRange=n.length/2+n.speed*n.speed/18;
  const crossing=cityDetails.crossingAhead(segments,n.g.position.x,n.g.position.z,heading,stopRange);
  let target=crossing?0:cruise,closest=Infinity;
  for(const other of traffic){if(other===n||Math.sign(other.v)!==Math.sign(n.v)||Math.abs(other.g.position.x-n.g.position.x)>1.3)continue;const gap=(other.g.position.z-n.g.position.z)*heading-(other.length+n.length)/2;if(gap>-.2&&gap<closest){closest=gap;const desired=3+n.speed*.9;if(gap<desired)target=Math.min(target,Math.max(0,(gap-2)*.85))}}
  if(Math.abs(n.g.position.x-x)<(n.width/2+1.45)){
   const gap=(-distance-n.g.position.z)*heading-(9.3+n.length)/2;
   if(gap>-.2&&gap<3+n.speed*1.3)target=Math.min(target,Math.max(0,(gap-2)*.7));
  }
  n.speed=T.MathUtils.clamp(n.speed+(target<n.speed?-11:3.2)*dt,0,Math.max(target,n.speed));if(target===0&&closest<2)n.speed=0;
  n.g.position.z+=heading*n.speed*dt;
  if(n.g.position.z>-distance+85||n.g.position.z<-distance-340){
   // Spawn only beyond the visible foreground and leave space for other vehicles.
   for(let attempt=0;attempt<12;attempt++){const candidate=n.v>0?-distance+65+attempt*14:-distance-280-attempt*14;const clear=traffic.every(other=>other===n||Math.abs(other.g.position.x-n.g.position.x)>1.5||Math.abs(other.g.position.z-candidate)>(other.length+n.length)/2+9);if(clear){n.g.position.z=candidate;n.speed=cruise;break}}
  }
  n.wheels.forEach(w=>w.rotation.x-=Math.sign(n.v)*n.speed*dt/.4);n.animate?.(elapsed,n.speed>.2);
  const reduced=document.body.classList.contains('reduce-motion')||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  for(const light of n.lights||[])light.material.emissiveIntensity=reduced?1.1:1.15+.75*Math.sin(elapsed*2.2+light.phase);
  if(Math.abs(n.g.position.z+distance)<(4.65+n.length/2)&&Math.abs(n.g.position.x-x)<(1.45+n.width/2)&&collisionCooldown===0){speed=0;x=-8.5;collisionCooldown=3;helper('Easy, Ostad! Keep a little distance from the traffic.','আস্তে ওস্তাদ! সামনের গাড়ি থেকে একটু দূরত্ব রাখুন।')}
 }
 sun.position.set(x-35,55,-distance+20);sun.target.position.set(x,0,-distance-15);
 }
 const z=-distance;follow.set(x+1.6,6.2,z+16);look.set(x,2,z-4);camera.position.lerp(follow,1-Math.exp(-4*dt));camera.lookAt(look);renderer.render(scene,camera);hudTimer+=dt;if(hudTimer>.1){ui();hudTimer=0}}
 window.addEventListener('resize',()=>{if(!root.isConnected)return;renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()});
 instance={resume(nextLang,nextExit,nextStart){language=nextLang;onExit=nextExit;if(nextStart&&routePlan.start.id!==nextStart){routePlan=createRoutePlan(nextStart);scene.remove(pickupStop,dropoffStop);disposeSegment({group:pickupStop});disposeSegment({group:dropoffStop});pickupStop=stop(0,routePlan.start.en.toUpperCase());dropoffStop=stop(-620,routePlan.goal.en.toUpperCase());reset();helper('Starting at '+routePlan.start.en+'. Passengers are boarding.','যাত্রা শুরু '+routePlan.start.bn+' থেকে। যাত্রী উঠছেন।')}active=true;root.hidden=false;pause(false);document.body.style.overflow='hidden';lastTime=performance.now();ui();raf=requestAnimationFrame(frame)}};
 document.body.style.overflow='hidden';reset();helper('Starting at '+routePlan.start.en+'. Your helper is boarding passengers.','যাত্রা শুরু '+routePlan.start.bn+' থেকে। হেলপার যাত্রী তুলছেন।');pause(false);bus.group.position.set(x,.06,0);camera.position.set(x+1.6,6.2,16);camera.lookAt(x,2,-4);renderer.render(scene,camera);renderer.domElement.focus({preventScroll:true});lastTime=performance.now();raf=requestAnimationFrame(frame);
}
