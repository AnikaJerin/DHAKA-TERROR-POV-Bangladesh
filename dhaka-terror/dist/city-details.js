import { createBangladeshCngFactory } from './bangladesh-cng.js';
import { createDhakaCarFactory } from './dhaka-cars.js';
import { createMarketShops } from './market-shops.js';
import { createRickshaw } from './rickshaw.js';
import { createStreetCulture } from './street-culture.js';
// Original procedural Dhaka street assets. No external art or model downloads.
export function createCityDetails(T,{box,cylinder,label,person,mat,neighborhoods,busFactory}){
 const cngs=createBangladeshCngFactory(T,{box,label,mat,person});
 let cngVariant=0,bikeVariant=0;
 const cars=createDhakaCarFactory(T,{box,label,mat});
 let carVariant=0;
 const markets=createMarketShops(T,{box,cylinder,label,person,mat});
 let rickshawVariant=0,busVariant=1;
 const culture=createStreetCulture(T,{box,cylinder,label,mat});
 const makeTexture=(paint,repeatX=1,repeatY=1)=>{const c=document.createElement('canvas');c.width=c.height=512;paint(c.getContext('2d'));const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(repeatX,repeatY);t.anisotropy=4;return t};
 let seed=32611;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 const road=makeTexture(c=>{c.fillStyle='#505b62';c.fillRect(0,0,512,512);for(let i=0;i<16000;i++){const v=90+Math.floor(rnd()*65);c.fillStyle=`rgba(${v},${v+6},${v+12},.28)`;c.fillRect(rnd()*512,rnd()*512,1+rnd()*2,1+rnd()*2)}for(let i=0;i<2;i++){const x=rnd()*512,y=rnd()*512;c.fillStyle='#536773';c.fillRect(x,y,8+rnd()*16,5+rnd()*12);c.strokeStyle='#344b5655';c.lineWidth=1;c.beginPath();c.moveTo(x,y);for(let j=0;j<5;j++)c.lineTo(x+j*7+rnd()*8,y+j*7);c.stroke()}},3,8);
 const pavement=makeTexture(c=>{c.fillStyle='#aaa9a0';c.fillRect(0,0,512,512);for(let row=0;row<16;row++)for(let col=-1;col<9;col++){c.fillStyle=['#ca7e66','#e5c2a4','#a8b9bc','#d7a385'][(row*3+col+10)%4];c.fillRect(col*64+(row%2)*32+2,row*32+2,60,28)}},1,23);
 const brick=makeTexture(c=>{c.fillStyle='#dfb09a';c.fillRect(0,0,512,512);for(let row=0;row<16;row++)for(let col=-1;col<9;col++){c.fillStyle=['#cf745a','#b55e49','#d9876a','#e19b7c'][(row+col+20)%4];c.fillRect(col*64+(row%2)*32+2,row*32+2,60,28)}},2,2);
 const roadMat=new T.MeshStandardMaterial({map:road,roughness:1});const sidewalkMat=new T.MeshStandardMaterial({map:pavement,roughness:.95});const brickMat=new T.MeshStandardMaterial({map:brick,roughness:1});
 const planeGeo=new T.PlaneGeometry(1,1);function ground(parent,x,y,z,w,d,material){const m=new T.Mesh(planeGeo,material);m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.scale.set(w,d,1);m.receiveShadow=true;m.userData.sharedCityAsset=true;parent.add(m);return m}
 function batches(parent,entries,color){if(!entries.length)return;const geom=new T.BoxGeometry(1,1,1),m=new T.InstancedMesh(geom,mat(color),entries.length),dummy=new T.Object3D();entries.forEach((v,i)=>{dummy.position.set(...v.slice(0,3));dummy.scale.set(...v.slice(3));dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)});m.receiveShadow=true;m.castShadow=false;parent.add(m)}
 function streetSign(p,text,x,y,z,w,h,color){const s=label(p,text,x,y,z,w,h,color,'#fff8df');return s}
 function facade(parent,x,z,side,index){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=-side*Math.PI/2;parent.add(g);const kind=((index%5)+5)%5;const palettes=['#a66c4d','#418b9d','#c8984c','#856799','#65987b'];const height=[13,25,11,19,15][kind],width=12,depth=12;
 box(g,0,height/2,0,width,height,depth,palettes[kind]);box(g,0,height+.22,0,width+.5,.44,depth+.5,'#fff0d4');box(g,0,height+.8,0,width,.9,depth,'#e9e2ce');box(g,0,height+1,0,9,1,9,palettes[kind]);
 // The frontage faces the street rather than the segment boundary.
 const windows=[],frames=[],balconies=[];
 if(kind===1){box(g,0,height/2+.8,6.04,10,height-3,.1,'#3d9bb9');for(let y=4;y<height;y+=3.3)frames.push([0,y,6.14,10.2,.13,.13]);for(let wx=-5;wx<=5;wx+=2)frames.push([wx,height/2+.8,6.17,.1,height-3,.12]);streetSign(g,'ঢাকা টেক টাওয়ার',0,2.8,6.3,11,1.2,'#176da2');box(g,0,1.2,6.1,3,2.4,.2,'#b4e6eb')}
 else if(kind===2){box(g,0,5,6.1,11,6,.15,'#358dac');for(let wx=-4;wx<=4;wx+=2)frames.push([wx,5,6.23,.12,6,.14]);box(g,0,8.8,6.3,12.4,2,.4,'#ce3d81');streetSign(g,'রঙিন প্লাজা • SHOPPING',0,8.8,6.55,11.8,1.4,'#ce3d81');box(g,0,.85,7,10,.3,2,'#e5ded1');for(let j=0;j<3;j++)box(g,-3.8+j*3.8,2,6.25,3,2.2,.15,['#f5c43e','#dc7254','#38a995'][j])}
 else {for(let y=4.8;y<height-1;y+=3)for(let wx=-4;wx<=4;wx+=4){frames.push([wx,y,6.06,2.2,2.15,.15]);windows.push([wx,y,6.16,1.85,1.8,.08]);frames.push([wx,y,6.23,.08,1.8,.12]);if(kind===0||kind===3){balconies.push([wx,y-1.1,6.7,2.8,.18,1.4]);frames.push([wx,y-.55,7.35,2.8,.08,.08]);for(let r=-1;r<=1;r++)frames.push([wx+r,y-.8,7.35,.055,.65,.08])}}const names=['শান্তি নিবাস','','','নীল আকাশ ভবন','মামা মার্কেট'];streetSign(g,names[kind],0,2.8,6.25,10.5,1.1,['#197d68','#2265a5','#d07725','#784da2','#cb513b'][kind]);box(g,0,1.05,6.04,10.5,2.1,.12,'#279c91');for(let q=-4;q<=4;q+=2.5)box(g,q,1.05,6.14,1.8,2,.12,'#286478')}
 batches(g,frames,'#fff2db');batches(g,windows,kind===3?'#6b81bb':'#417e9d');batches(g,balconies,'#f9e7d1');
 if(kind===0){const panel=new T.Mesh(new T.PlaneGeometry(11,height-3),brickMat);panel.position.set(0,height/2+1.5,-6.02);panel.rotation.y=Math.PI;panel.userData.sharedCityAsset=true;g.add(panel);const streetBrick=new T.Mesh(new T.PlaneGeometry(11,height-3),brickMat);streetBrick.position.set(0,height/2+1.5,6.025);g.add(streetBrick)}
 cylinder(g,-3,height+2.1,1,1.15,2.5,'#4b6472');box(g,4,height+1.8,-2,.14,3,.14,'#485a68');box(g,4,height+3,-2,2,.08,.08,'#485a68');
 if(kind===0||kind===3){const ac=[];for(let y=5;y<height;y+=6)ac.push([5.35,y,6.4,.9,.55,.55]);batches(g,ac,'#eff3eb');box(g,-3.8,6.3,7,.08,1.3,.08,'#f08a9c');box(g,.2,9.3,7,.8,1,.05,'#f9c632')}
 }
 function stall(parent,x,z,index){const g=new T.Group();g.position.set(x,.4,z);g.rotation.y=x<0?Math.PI/2:-Math.PI/2;parent.add(g);const cart=index%2===0;const paint=['#f5b52a','#e75c45','#18a897','#559bd3'][((index%4)+4)%4];box(g,0,.8,0,2.8,1.1,1.6,paint);box(g,0,1.42,0,3.1,.13,1.9,'#f5e3bd');for(const a of [-1.3,1.3]){box(g,a,2.1,.55,.08,2.3,.08,'#725640');if(cart){const w=cylinder(g,a,.35,0,.4,.16,'#334653');w.rotation.z=Math.PI/2}}
 box(g,0,3.28,0,3.5,.12,2.3,paint);for(let j=0;j<6;j++)box(g,-1.46+j*.59,3.2,1.05,.32,.28,.16,j%2?'#fff0ce':paint);streetSign(g,cart?'চা খাই, জ্যাম ভুলে যাই':'মামার ঝালমুড়ি',0,2.9,1.18,3.1,.48,paint);
 for(let i=0;i<6;i++)cylinder(g,-.9+i*.35,1.62,.2,.12,.3,['#efc52a','#f88724','#f4dfc3'][i%3]);cylinder(g,.7,1.85,-.4,.31,.65,'#d2dadd');person(g,0,-.85,'#f2d13c',index%2===0);return g}
 function decorate(parent,index,type){ground(parent,0,.086,-80,22,160,roadMat);const walkers=[];parent.userData.walkers=walkers;
 for(const side of [-1,1]){ground(parent,side*13.7,.365,-80,5,160,sidewalkMat);box(parent,side*11,.32,-80,.22,.24,160,'#ffce35');for(let i=0;i<20;i++)box(parent,side*11,.4,-4-i*8,.23,.32,4,i%2?'#202e39':'#ffe23b');for(let j=0;j<8;j++){const z=-10-j*20;if(j%4===1)neighborhoods.office(parent,side*23,z,side,index+j);else if((j===3&&side===-1)||(j===6&&side===1))neighborhoods.greenSpace(parent,side*25,z,side,side===1);else facade(parent,side*(23+(j%3===0?2:0)),z,side,index*3+j+(side>0?2:0));if(j%2===0&&!(index%2===0&&j===2)){if((j+Math.abs(index))%3===0)stall(parent,side*15.3,z+8,j+index);else markets.shop(parent,side*15.3,z+8,j+index+(side>0?1:0));}{const p=culture.pedestrian(parent,side*(12.2+(j%2)*1.6),z,index*8+j+(side>0?3:0));p.group.rotation.y=side<0?0:Math.PI;walkers.push({person:p,z,phase:j*.9,side});}if(j%3===1){box(parent,side*14.5,.8,z+5,2,.18,.65,'#c9894d');box(parent,side*14.5,1.4,z+5.3,2,.9,.12,'#d89c56')}}
 const drains=[];for(let z=-8;z>-160;z-=16)for(let i=0;i<5;i++)drains.push([side*10.65,.105,z+i*.11,.5,.02,.035]);batches(parent,drains,'#283e4b');
 }
 culture.decorate(parent,index,type);
 // Utility lines and festive pennants give each block a local street silhouette.
 const wireMat=new T.LineBasicMaterial({color:'#3a5262'});
 for(const side of [-1,1])for(let line=0;line<3;line++){
  const points=[];for(let z=0;z>=-160;z-=2)points.push(new T.Vector3(side*(15.8+line*.25),9.5+line*.27-Math.sin((-z%40)/40*Math.PI)*.8,z));
  const wire=new T.Line(new T.BufferGeometry().setFromPoints(points),wireMat);parent.add(wire);
 }
 const ropePoints=[];for(let x=-15;x<=15;x++)ropePoints.push(new T.Vector3(x,8.7-Math.sin((x+15)/30*Math.PI)*1.2,-31));
 parent.add(new T.Line(new T.BufferGeometry().setFromPoints(ropePoints),wireMat));
 for(let i=0;i<13;i++){
  const x=-14+i*2.3,y=8.7-Math.sin((x+15)/30*Math.PI)*1.2;
  const geom=new T.BufferGeometry();geom.setAttribute('position',new T.Float32BufferAttribute([-.4,0,0,.4,0,0,0,-.7,0],3));
  const flag=new T.Mesh(geom,new T.MeshBasicMaterial({color:['#f4b72c','#ec4285','#149f7b','#458bdb'][i%4],side:T.DoubleSide}));flag.position.set(x,y,-31);parent.add(flag);
 }
 // The metro module owns structural columns; avoid duplicate box cladding.
 const streetBoard=new T.Group();streetBoard.position.set(-13.5,0,-105);streetBoard.rotation.y=Math.PI/5;parent.add(streetBoard);
 for(const x of [-1.5,1.5]){box(streetBoard,x,3.05,0,.1,5.4,.1,'#657875');box(streetBoard,x,.44,0,.4,.16,.4,'#aaa996');}
 box(streetBoard,0,5.5,0,4.1,1.5,.1,'#52635d');label(streetBoard,['মিরপুরের মায়া','আস্তে যান, হাসতে যান','ঢাকা • ভালোবাসার শহর'][((index%3)+3)%3],0,5.5,.065,4,1.4,'#176b93','#ffe244');

 }
 function roadWheels(g,x,z,r=.34){const w=cylinder(g,x,r,z,r,.18,'#223443',12);w.rotation.z=Math.PI/2;cylinder(g,x*1.02,r,z,.12,.19,'#cad5da',8).rotation.z=Math.PI/2;return w}
 function vehicle(type,index){if(type==='cng'||type==='auto'){const model=cngs.create(cngVariant++);return {...model,type}}if(type==='car')return cars.create(carVariant++);if(type==='bus')return busFactory.create({variant:busVariant++%4});if(type==='rickshaw')return createRickshaw(T,{box,label,mat,person},rickshawVariant++);const g=new T.Group();let length=3.6,width=1.9;const colors=['#f7b52d','#ee6256','#26b79b','#409add','#b26bdd','#f3e8ce'];const color=type==='bike'?['#e2b628','#8d999f','#be343d','#24537c','#222b35','#26816a'][bikeVariant++%6]:colors[index%colors.length];const wheels=[];let tag;
 if(type==='bike'){
  width=.86;length=2.25;
  // Wheel groups, engine, tank, fork and rider are all explicit geometry.
  for(const z of [-.82,.82]){const wheel=new T.Group();wheel.position.set(0,.4,z);g.add(wheel);const tire=new T.Mesh(new T.TorusGeometry(.3,.09,8,20),mat('#25333c'));tire.rotation.y=Math.PI/2;wheel.add(tire);const hub=cylinder(wheel,0,0,0,.22,.12,'#b9c9ce',12);hub.rotation.z=Math.PI/2;wheels.push(wheel)}
  function tube(a,b,r=.035,c='#7b969f'){const aa=new T.Vector3(...a),bb=new T.Vector3(...b),d=bb.clone().sub(aa);const m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),7),mat(c));m.position.copy(aa.add(bb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(m)}
  tube([0,.42,.82],[0,.98,-.45]);tube([0,.98,-.45],[0,.43,-.82]);tube([0,.55,-.05],[0,.42,.82]);tube([0,.55,-.05],[0,.98,-.45]);
  box(g,0,.61,-.08,.38,.4,.43,'#657c84');const tank=new T.Mesh(new T.SphereGeometry(.33,14,10),new T.MeshStandardMaterial({color,metalness:.4,roughness:.3}));tank.scale.set(.78,.65,1.3);tank.position.set(0,.96,-.27);g.add(tank);
  box(g,0,.95,.35,.42,.14,.69,'#233b45');tube([-.09,.43,-.82],[-.09,1.1,-.62],.025);tube([.09,.43,-.82],[.09,1.1,-.62],.025);tube([-.36,1.14,-.62],[.36,1.14,-.62],.025);
  const lamp=cylinder(g,0,1.02,-.78,.11,.07,'#f3f3d2',12);lamp.rotation.x=Math.PI/2;box(g,.28,.46,.5,.09,.09,.75,'#bcc7ca');
  const rider=person(g,0,.18,['#bc493e','#317cbe','#d8aa35'][index%3]);rider.group.scale.setScalar(.68);rider.group.position.y=.36;rider.group.rotation.x=-.12;const helmet=new T.Mesh(new T.SphereGeometry(.19,12,8),mat(['#e43d42','#f3be26','#415d85'][index%3]));helmet.position.set(0,1.57,.08);g.add(helmet);box(g,0,1.6,-.087,.27,.065,.03,'#344e5b');
  // Preserve the original tank, engine, frame and wheels; add commuter-bike detail.
  for(let fin=0;fin<7;fin++)box(g,0,.52+fin*.045,-.08,.43,.015,.42,'#a2b0b3');
  for(const side of [-1,1]){
   tube([side*.1,.45,.8],[side*.22,.9,.4],.025,'#9aaeb4');
   for(let ring=0;ring<7;ring++){const spring=new T.Mesh(new T.TorusGeometry(.043,.009,5,10),mat('#e8644d'));spring.rotation.x=Math.PI/2;spring.position.set(side*.22,.62+ring*.035,.58-ring*.018);g.add(spring)}
   tube([side*.32,1.14,-.62],[side*.48,1.43,-.63],.012);const mirror=new T.Mesh(new T.SphereGeometry(.1,10,6),mat('#a7c4cf'));mirror.scale.set(1.1,.67,.32);mirror.position.set(side*.48,1.45,-.63);g.add(mirror);
   const indicator=box(g,side*.23,1.03,-.8,.1,.055,.07,'#f2aa27');box(g,side*.2,.8,1.01,.09,.06,.06,'#f2ab2d');
   // Folded knees and bent arms replace straight standing limbs on the seated rider.
   tube([side*.15,1.28,.06],[side*.24,1.12,-.27],.065,['#bc493e','#317cbe','#d8aa35'][index%3]);tube([side*.24,1.12,-.27],[side*.3,1.14,-.61],.047,'#ba8763');
   tube([side*.13,1,.26],[side*.22,.74,-.07],.072,'#344c64');tube([side*.22,.74,-.07],[side*.23,.46,.24],.055,'#344c64');box(g,side*.23,.43,.19,.14,.08,.25,'#24323a');
  }
  [0,1,4,5].forEach(i=>{if(rider.group.children[i])rider.group.children[i].visible=false});
  for(const wheel of wheels){const disc=cylinder(wheel,.075,0,0,.23,.018,'#aebdc1',20);disc.rotation.z=Math.PI/2;for(let k=0;k<8;k++){const a=k*Math.PI/4;const hole=cylinder(wheel,.09,Math.sin(a)*.175,Math.cos(a)*.175,.017,.02,'#384b56',6);hole.rotation.z=Math.PI/2;}}
  const cowlShape=new T.Shape();cowlShape.moveTo(-.2,-.19);cowlShape.lineTo(.2,-.19);cowlShape.lineTo(.25,.08);cowlShape.lineTo(.12,.24);cowlShape.lineTo(-.12,.24);cowlShape.lineTo(-.25,.08);cowlShape.closePath();const cowl=new T.Mesh(new T.ExtrudeGeometry(cowlShape,{depth:.08,bevelEnabled:true,bevelSize:.025,bevelThickness:.02,bevelSegments:1}),mat(color));cowl.position.set(0,1.05,-.81);g.add(cowl);const headlens=new T.Mesh(new T.SphereGeometry(.145,12,8),mat('#e4f1e7'));headlens.scale.set(1,.85,.23);headlens.position.set(0,1.04,-.85);g.add(headlens);
  for(const z of [-.82,.82]){const guard=new T.Mesh(new T.TorusGeometry(.43,.042,6,18,Math.PI),mat(color));guard.rotation.y=Math.PI/2;guard.position.set(0,.4,z);g.add(guard)}
  box(g,0,.84,.99,.18,.09,.04,'#d83840');box(g,0,.57,1.03,.38,.3,.035,'#243b43');label(g,'ঢাকা মেট্রো ল',0,.62,1.06,.43,.11,'#fff0d1','#234153');label(g,'২৪-৭৩২৬',0,.49,1.065,.43,.11,'#fff0d1','#234153');
  const occupantCount=1+(bikeVariant-1)%3;
  if(occupantCount===1&&index%3===1){const luggage=box(g,0,1.14,.74,.48,.4,.45,'#344958');box(g,0,1.15,.975,.4,.045,.02,'#d4c486');}
  // Mix solo riders, two-person bikes and crowded three-person traffic actors.
  if(occupantCount>1)box(g,0,.97,.61,.43,.12,1.05,'#283c47');
  for(let passengerIndex=1;passengerIndex<occupantCount;passengerIndex++){
   const seatZ=.19+passengerIndex*.39,scale=occupantCount===3?.55:.61;
   const passenger=person(g,0,seatZ,['#965a9d','#dcb447','#5a9c8e'][passengerIndex%3]);passenger.group.scale.setScalar(scale);passenger.group.position.y=.49;
   [0,1,4,5].forEach(i=>{if(passenger.group.children[i])passenger.group.children[i].visible=false});
   for(const side of [-1,1]){tube([side*.15,1.05,seatZ],[side*.25,.76,seatZ-.07],.06,'#3b5267');tube([side*.25,.76,seatZ-.07],[side*.27,.49,seatZ+.1],.05,'#3b5267');box(g,side*.27,.46,seatZ+.06,.13,.07,.23,'#263a45');tube([side*.15,1.25,seatZ],[side*.2,1.06,seatZ-.25],.05,['#965a9d','#dcb447','#5a9c8e'][passengerIndex%3]);}
   const passengerHelmet=new T.Mesh(new T.SphereGeometry(.165,12,8),mat(passengerIndex===1?'#f2c53c':'#e2e5dd'));passengerHelmet.position.set(0,.49+scale*1.75,seatZ);g.add(passengerHelmet);box(g,0,.49+scale*1.77,seatZ-.155,.23,.06,.025,'#385460');
  }
  g.userData.occupantCount=occupantCount;
  label(g,'জ্যামে ধৈর্য',0,.77,1.04,.56,.2,'#f6e3b0','#21485c');
 }else{throw new Error('Unsupported traffic vehicle type: '+type)}
 for(const side of [-1,1]){box(g,side*width*.36,.75,length/2+.04,.2,.16,.07,'#ff4144');box(g,side*width*.36,.75,-length/2-.04,.2,.16,.07,'#fff5d5')}return{g,wheels,length,width,type}}
 function animateWalkers(segments,time){culture.animateCrossings(segments,time);for(const s of segments.filter(s=>s.group.visible))for(const w of (s.group.userData.walkers||[]).filter(w=>!w.boarding)){w.person.group.position.z=w.z+Math.sin(time*.17+w.phase)*5;w.person.group.rotation.y=Math.cos(time*.17+w.phase)>0?Math.PI:0;w.person.arm.rotation.x=Math.sin(time*4+w.phase)*.35;if(w.person.left)w.person.left.rotation.x=-Math.sin(time*4+w.phase)*.35;if(w.person.legs)w.person.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(time*4+w.phase+i*Math.PI)*.2);w.person.group.position.y=.37+Math.abs(Math.sin(time*4+w.phase))*.025}}
 return{decorate,createPedestrian:culture.pedestrian,createTrafficOfficer:culture.sergeant,decorateMetroPier:culture.decorateMetroPier,vehicle,animateWalkers,roadMaterial:roadMat,pavementMaterial:sidewalkMat,crossingAhead:culture.crossingAhead,sharedGeometries:new Set([planeGeo,...culture.sharedGeometries]),sharedMaterials:{has(material){return culture.sharedMaterials.has(material)||neighborhoods.sharedMaterials.has(material)||material===roadMat||material===sidewalkMat||material===brickMat}}};
}
