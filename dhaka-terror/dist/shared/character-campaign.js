// Shared character campaign base. Each character extends this with their own mechanics and missions.
export class CharacterCampaign{
 constructor({characterId,vehicleFactory,vehicleVariant=0,startPlaceId='mirpur12',missions,onExit}){
  this.characterId=characterId;
  this.vehicleFactory=vehicleFactory;
  this.vehicleVariant=vehicleVariant;
  this.startPlaceId=startPlaceId;
  this.missions=missions||[];
  this.onExit=onExit;
  this.instance=null;
  this.saveKey=`dhaka-${characterId}-v1`;
  this.progress={schemaVersion:1,activeRoleId:characterId,completedMissionIds:[]};
  try{Object.assign(this.progress,JSON.parse(localStorage.getItem(this.saveKey)||'{}'))}catch{}
 }
 async start({language='en',startPlaceId=this.startPlaceId}={}){
  if(this.instance){this.instance.resume(language,this.onExit,startPlaceId);return}
  const streetAudio=await this.createAudio();
  streetAudio.unlock();
  const root=document.createElement('section');root.className='mission-screen';root.setAttribute('aria-label',`Dhaka Terror ${this.characterId} mission`);document.body.append(root);
  const bn=()=>language==='bn',tr=(en,b)=>bn()?b:en;
  root.innerHTML=`<div class="mission-fallback"><h2>Preparing Dhaka in 3D…</h2><p>Loading the 3D renderer.</p><button class="mission-pill" id="load-exit">Back to welcome</button></div>`;
  root.querySelector('#load-exit').onclick=()=>{streetAudio.stop();root.remove();this.onExit()};
  let T;try{T=await import('https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js')}catch{root.querySelector('.mission-fallback p').textContent=tr('The 3D library could not load. Connect to the internet and try again.','থ্রিডি লাইব্রেরি লোড হয়নি। ইন্টারনেট সংযোগ দিয়ে আবার চেষ্টা করুন।');return}
  if(!root.isConnected)return;
  if(document.fonts){try{await Promise.race([document.fonts.load('700 48px "Noto Sans Bengali"'),new Promise(resolve=>setTimeout(resolve,1800))])}catch{}}
  let renderer;try{renderer=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'})}catch{root.querySelector('.mission-fallback p').textContent='WebGL is unavailable. Enable hardware acceleration or use a WebGL-compatible browser.';return}
  root.innerHTML=this.buildHUD(tr);
  const elementCache=new Map();const el=id=>{if(!elementCache.has(id))elementCache.set(id,root.querySelector('#'+id));return elementCache.get(id)};const put=(id,value)=>{const e=el(id);if(e.textContent!==String(value))e.textContent=value};
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.98;renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label',`3D Dhaka street. ${this.characterId}.`);root.prepend(renderer.domElement);
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
   for(const side of [-1,1]){const leg=new T.Mesh(new T.CylinderGeometry(.09,.075,.76,9),mat('#304354'));leg.position.set(side*.13,.45,0);p.add(leg)}
   oval(0,1.1,0,.27,.35,.16,shirt);oval(0,1.63,-.02,.15,.2,.14,'#bc8765');
   for(const side of [-1,1]){const arm=new T.Mesh(new T.CylinderGeometry(.08,.055,.59,9),mat(shirt));arm.position.set(side*.34,1.13,0);p.add(arm)}const arm=p.children[5];
   for(const side of [-1,1]){oval(side*.13,.08,-.06,.095,.065,.18,'#29343b');oval(side*.34,.79,0,.055,.075,.04,'#bc8765');for(let i=0;i<4;i++)oval(side*.34-.023+i*.015,.74,-.005,.009,.033,.009,'#bc8765');oval(side*.15,1.64,0,.026,.045,.025,'#bc8765');oval(side*.055,1.66,-.153,.027,.014,.009,'#efe5d0');oval(side*.055,1.66,-.16,.012,.012,.006,'#26343b');oval(side*.056,1.69,-.14,.033,.009,.008,'#293038')}
   oval(0,1.61,-.16,.03,.042,.035,'#bd8865');oval(0,1.56,-.158,.037,.006,.006,'#86574b');oval(0,1.79,.01,.153,.07,.14,'#293038');
   if(cap){const hat=new T.Mesh(new T.CylinderGeometry(.15,.16,.09,12),mat('#aa3930'));hat.position.set(0,1.84,0);p.add(hat);box(p,0,1.8,-.14,.27,.035,.2,'#aa3930')}
   return{group:p,arm};
  }
  const vehicle=this.vehicleFactory.create({variant:this.vehicleVariant,player:true});
  scene.add(vehicle.group||vehicle.g);
  const vegetation=await import('./vegetation.js').then(m=>m.createVegetation(T));
  const neighborhoods=await import('./neighborhoods.js').then(m=>m.createNeighborhoods(T,{box,cylinder,label,mat,vegetation}));
  const metro=await import('./metro-structure.js').then(m=>m.createMetroStructure(T));
  const busFactory=await import('./bangladesh-bus.js').then(m=>m.createBangladeshBusFactory(T,{box,label,mat,person}));
  const city=await import('./city-details.js').then(m=>m.createCityDetails(T,{box,cylinder,label,person,mat,neighborhoods,busFactory}));
  const world=await import('./shared/map/world.js').then(m=>m.createNetworkWorld(T,{scene,city,metro,neighborhoods,vegetation,box,label,mat}));
  await this.setupCharacterSystems({root,camera,scene,vehicle,world,streetAudio,el,put,tr,bn,T,renderer,scene,box,cylinder,label,mat,person,city,world,language});
  const soundButton=document.createElement('button');soundButton.className='mission-pill mission-sound';soundButton.setAttribute('aria-label','Toggle street audio');root.append(soundButton);
  function soundUi(){soundButton.textContent=streetAudio.enabled?'♫ ON':'♫ OFF';soundButton.setAttribute('aria-pressed',String(streetAudio.enabled))}soundButton.onclick=()=>{streetAudio.setEnabled(!streetAudio.enabled);soundUi()};soundUi();
  root.addEventListener('pointerdown',()=>streetAudio.unlock());
  const keyMap={KeyW:'w',KeyA:'a',KeyS:'s',KeyD:'d',KeyE:'e',KeyP:'p',KeyH:'h',KeyM:'m',Space:' ',ArrowUp:'w',ArrowDown:'s',ArrowLeft:'a',ArrowRight:'d',Escape:'p'};
  window.addEventListener('keydown',e=>{if(!this.instance?.active)return;streetAudio.unlock();const k=keyMap[e.code];if(!k)return;e.preventDefault();if(k==='p'&&!e.repeat)this.instance.pause(!this.instance.paused);if(k==='e'&&!this.instance.paused&&!e.repeat)this.instance.gate?.();if(k==='m'&&!e.repeat){this.instance.largeMap=!this.instance.largeMap;this.instance.drawMap()}if(k==='h'&&!e.repeat){streetAudio.horn();this.instance.helper?.('Horn won\'t make the road wider!','হর্ন দিলে রাস্তা চওড়া হবে না!')}if(!this.instance.paused)this.instance.held.add(k)},true);
  window.addEventListener('keyup',e=>this.instance?.held.delete(keyMap[e.code]),true);
  window.addEventListener('blur',()=>this.instance?.held.clear());
  this.instance={root,renderer,scene,camera,vehicle,world,streetAudio,el,put,tr,bn,T,active:true,paused:false,held:new Set(),lastTime:0,elapsed:0,raf:null,startPlaceId,language,onExit:this.onExit,drawMap:this.drawMap.bind(this),pause:this.pause.bind(this),gate:this.gate.bind(this),helper:this.helper.bind(this),updateHUD:this.updateHUD.bind(this),updateUI:this.updateUI.bind(this),characterId:this.characterId};
  this.initCharacterState(this.instance);
  this.setupCharacterControls(this.instance);
  this.setupCharacterUpdate(this.instance);
  document.body.style.overflow='hidden';this.instance.lastTime=performance.now();this.instance.raf=requestAnimationFrame(this.frame.bind(this));
  return this.instance;
 }
 buildHUD(tr){
  return `<div class="mission-top"><div class="mama-hud"><strong>${tr('POWER','শক্তি')} <span id="mama-power">0</span></strong><small id="passengers">${tr('SCORE','স্কোর')}: 0</small></div><div><button class="mission-pill" id="pause"></button> <button class="mission-pill" id="exit"></button></div></div><div class="mission-controls"><button class="mission-action" id="action"></button><button id="horn"></button><button id="restart"></button></div><div class="mission-bottom" id="keys"></div><div class="drive-touch" aria-label="Driving controls"><button data-key="ArrowLeft" aria-label="Steer left">←</button><button data-key="ArrowUp" aria-label="Accelerate">↑</button><button data-key="ArrowRight" aria-label="Steer right">→</button><button data-key="ArrowDown" aria-label="Brake">↓</button></div><div class="mission-speed"><strong id="speed">0</strong><small>KM/H</small></div><div class="mission-pause" hidden><h2 id="pause-title"></h2><p id="pause-copy"></p><button class="primary" id="resume"></button></div>`;
 }
 async createAudio(){const m=await import('./characters/bus/audio.js');return m.createDhakaAudio();}
 async setupCharacterSystems(){}
 initCharacterState(instance){}
 setupCharacterControls(instance){}
 setupCharacterUpdate(instance){}
 updateHUD(instance){}
 updateUI(instance){}
 pause(v){instance.paused=v;instance.streetAudio.setPaused(v);instance.held.clear();instance.root.querySelector('.mission-pause').hidden=!v;}
 frame(now){if(!instance.active)return;instance.raf=requestAnimationFrame(this.frame.bind(this));const dt=Math.min((now-instance.lastTime)/1000||0,.04);instance.lastTime=now;instance.streetAudio?.update(dt,0);if(!instance.paused){instance.elapsed+=dt;this.updateCharacter(instance,dt);instance.world?.update({x:instance.player?.x||0,z:instance.player?.z||0,yaw:instance.player?.yaw||0},instance.elapsed);}instance.renderer?.render(instance.scene,instance.camera);}
 updateCharacter(instance,dt){}
 drawMap(){}
 gate(){}
 helper(text,bnText){}
 resume(language,onExit,startPlaceId){this.start({language,startPlaceId,onExit});}
}