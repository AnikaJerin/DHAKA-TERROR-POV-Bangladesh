import {createDistrictScenery} from './district-scenery.js';
import { createStreetDetails } from './street-details.js';
import {places,roads,getPlace,landmarks,exits} from './network.js';
// Shared geometry/road queries only. Campaign rules and player vehicles stay outside.
export function createNetworkWorld(T,{scene,city,metro,neighborhoods,vegetation,box,label,mat}){
 const chunks=[],nodes=[],cars=[],traffic=[];
 const street=createStreetDetails(T,{box,mat,label});
 const root=new T.Group();scene.add(root);
 // Collapse repeated direct static boxes into material batches. Actors remain separate.
 function batchStatic(parent){const batches=new Map();for(const child of [...parent.children]){
  if(!child.isMesh||child.isInstancedMesh||child.geometry.type!=='BoxGeometry'||Array.isArray(child.material)||child.material.transparent)continue;
  const key=child.geometry.uuid+':'+child.material.uuid+':'+child.castShadow+':'+child.receiveShadow;
  if(!batches.has(key))batches.set(key,[]);batches.get(key).push(child);
 }for(const meshes of batches.values()){if(meshes.length<3)continue;const first=meshes[0],batch=new T.InstancedMesh(first.geometry,first.material,meshes.length);batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;meshes.forEach((mesh,i)=>{mesh.updateMatrix();batch.setMatrixAt(i,mesh.matrix);parent.remove(mesh)});batch.computeBoundingSphere();parent.add(batch);}}

 box(root,-280,-.55,-180,5000,.5,5000,'#9bac8f');
 function printed(parent,text,x,y,z,w,h,angle=0,bg='#155d45'){
  const sign=label(parent,text,x,y,z,w,h,bg,'#fff8dc');sign.rotation.y=angle;sign.material.side=T.FrontSide;return sign;
 }
 function signboard(parent,x,z,angle,lines){const board=new T.Group();board.position.set(x,0,z);board.rotation.y=angle;parent.add(board);box(board,0,3,0,.16,6,.16,'#a4b3b5');lines.forEach((line,i)=>printed(board,line,0,5.7-i*.92,.08,6.5,.83,0,i?'#155d45':'#164d71'));printed(board,'ধীরে চলুন • হাসিমুখে ফিরুন',0,4.1,-.08,6.5,1,Math.PI);return board}

 for(const road of roads){const a=getPlace(road.from),b=getPlace(road.to),dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len;
  for(let offset=28;offset<len-28;offset+=160){const size=Math.min(160,len-28-offset);const group=new T.Group();group.position.set(a.x+ux*offset,0,a.z+uz*offset);group.rotation.y=Math.atan2(-ux,-uz);group.scale.z=size/160;
   box(group,0,-.15,-80,60,.2,160,'#a6b391');box(group,0,.02,-80,28,.1,160,'#5e7380');city.decorate(group,chunks.length,road.metro?'metro':'street');
   // Shift existing sidewalks and frontage outward without stretching their models.
   group.userData.roadHalfWidth=14;
   for(const child of group.children){if(Math.abs(child.position.x)>=10.3)child.position.x+=Math.sign(child.position.x)*3;if(child.isMesh&&child.rotation.x===-Math.PI/2&&child.scale.x===22)child.scale.x=28;}
   for(const walker of group.userData.crossers||[]){walker.from+=Math.sign(walker.from)*3;walker.to+=Math.sign(walker.to)*3;}
   street.walls(group,chunks.length);street.clutter(group,chunks.length);
   for(const x of [-7,7])for(let z=-8;z>-156;z-=10)box(group,x,.115,z,.15,.025,4.5,'#eee9d8');
   for(const x of [-13.45,13.45])box(group,x,.115,-80,.14,.025,160,'#e6dfca');
   for(const x of [-.18,.18])box(group,x,.115,-80,.12,.025,160,'#d7b34d');
   if(['mazar','gabtoli'].includes(road.from)||['mazar','gabtoli'].includes(road.to))for(const side of [-1,1])for(let j=0;j<3;j++){
    const z=-25-j*48;box(group,side*23,1.5,z,8,3,10,['#976f52','#b89772','#815944'][j]);box(group,side*18.8,2.8,z,1.8,.15,10,['#325c69','#8d3933','#567356'][j]);const name=label(group,['মাজার রোড বাজার','চা • সিঙ্গারা • আড্ডা','বাসের টিকিট'][j],side*17.8,2.35,z,6,.7,'#23564c','#fff1cd');name.rotation.y=-side*Math.PI/2;
   }

if(road.metro){
 metro.decorate(group,chunks.length,(pier,index,originalZ)=>{city.decorateMetroPier(pier,index+Math.round(-originalZ/35),0);batchStatic(pier)});
 // Central reservation keeps both traffic directions clear of metro foundations.
 box(group,0,.24,-80,2.7,.42,160,'#a3a18b');
 for(let z=-4;z>-160;z-=4)for(const side of [-1,1])box(group,side*1.4,.4,z,.16,.38,3.95,Math.round(-z/4)%2?'#e1c344':'#303936');
 const beds=[];for(let z=-8,i=0;z>-160;z-=12,i++){
  // Leave clear space around each structural foundation.
  if([-18,-53,-88,-123,-158].some(pier=>Math.abs(z-pier)<3.6))continue;
  box(group,0,.46,z,1.7,.035,3.4,'#665340');beds.push({x:0,z,w:1.6,d:3.2,y:.48,flowers:i%3===0?null:(i+chunks.length)%4,seed:i+chunks.length*7});
 }vegetation.shrubs(group,beds);
 }if(offset===28&&road.length>270){neighborhoods.footbridge(group,chunks.length);const bridge=group.children[group.children.length-1];for(const child of bridge.children){if(Math.abs(child.position.x)>=13)child.position.x+=Math.sign(child.position.x)*3;if(child.isMesh&&child.scale.x>20)child.scale.x+=6;}}batchStatic(group);root.add(group);chunks.push({group,road,index:chunks.length,center:new T.Vector3(a.x+ux*(offset+size/2),0,a.z+uz*(offset+size/2))});
  }
  // Visibly marked legal bays correspond to the stop-scoring exemption.
  for(const reverse of [false,true]){const start=reverse?b:a,end=reverse?a:b,p=pose(start.id,end.id,48,10.5),bay=new T.Group();bay.position.set(p.x,0,p.z);bay.rotation.y=p.yaw;root.add(bay);
   for(const x of [-1.5,1.5])box(bay,x,.14,0,.1,.025,12,'#f1df9c');for(const z of [-6,6])box(bay,0,.14,z,3,.025,.1,'#f1df9c');box(bay,-5.6,1.55,0,.08,2.4,.08,'#758984');box(bay,-5.6,.4,0,.35,.16,.35,'#b4b09c');label(bay,'বাস স্টপ',-5.6,2.6,.06,2.6,.6,'#215c5d','#fff0b8');
  }
  // Reassurance signs along straight sections face each direction separately.
  for(let along=80;along<len-40;along+=110)for(const reverse of [false,true]){
   const from=reverse?b:a,to=reverse?a:b,dx=to.x-from.x,dz=to.z-from.z,length=Math.hypot(dx,dz),vx=dx/length,vz=dz/length;
   const x=from.x+vx*along+vz*18,z=from.z+vz*along-vx*18,angle=Math.atan2(-vx,-vz);
   signboard(root,x,z,angle,['এখন: '+(along<length/2?from.bn:to.bn),'↑ সামনে '+to.bn]);
  }
 }
 for(const p of places){const g=new T.Group();g.position.set(p.x,0,p.z);root.add(g);const nodeExits=exits(p.id),straight=nodeExits.length===2&&Math.abs((nodeExits[0].target.x-p.x)*(nodeExits[1].target.z-p.z)-(nodeExits[0].target.z-p.z)*(nodeExits[1].target.x-p.x))<.01;
  const disk=new T.Mesh(straight?new T.BoxGeometry(28,.12,58):new T.CylinderGeometry(p.junction==='circle'?33:19,p.junction==='circle'?33:19,.12,32),city.roadMaterial);
  if(straight)disk.rotation.y=Math.atan2(nodeExits[0].target.x-p.x,nodeExits[0].target.z-p.z);disk.position.y=.06;disk.receiveShadow=true;g.add(disk);
  if(p.junction==='circle'){const ring=new T.Mesh(new T.TorusGeometry(8,.2,6,48),mat('#f1d04b'));ring.rotation.x=Math.PI/2;ring.position.y=.2;g.add(ring);const garden=new T.Mesh(new T.CylinderGeometry(7.7,7.7,.4,32),mat('#4a8e66'));garden.position.y=.3;g.add(garden);}
  // Every approach has its own readable left/straight/right board.
  for(const approach of exits(p.id)){
   const previous=approach.target,ox=previous.x-p.x,oz=previous.z-p.z,len=Math.hypot(ox,oz),ux=ox/len,uz=oz/len;
   const choices=exits(p.id,previous.id).filter(e=>e.target.id!==previous.id),arrows={left:'←',right:'→',forward:'↑',back:'↶'};
   signboard(g,ux*48-uz*18,uz*48+ux*18,Math.atan2(ux,uz),['এখন: '+p.bn,...(choices.length?choices.map(e=>arrows[e.turn]+' '+e.target.bn):['↶ ঘুরে ফিরুন: '+previous.bn])]);
  }
  // Only real graph exits receive asphalt; no phantom circular side roads.
  for(const approach of exits(p.id)){
   const dx=approach.target.x-p.x,dz=approach.target.z-p.z,len=Math.hypot(dx,dz),join=new T.Group();join.rotation.y=Math.atan2(-dx/len,-dz/len);g.add(join);
   const asphalt=new T.Mesh(new T.PlaneGeometry(28,31),city.roadMaterial);asphalt.rotation.x=-Math.PI/2;asphalt.position.set(0,.125,-15.5);join.add(asphalt);
   for(const side of [-1,1]){box(join,side*14.25,.18,-25,.3,.25,12,'#c7b787');box(join,side*17,.08,-25,5,.12,12,'#9a9384');}
  }
  for(const corner of [[-43,-43],[43,43]]){box(g,corner[0],1.3,corner[1],7,2.6,4,'#c6bba1');printed(g,'চা খান • পথ চিনুন',corner[0],2.1,corner[1]+2.05,6,1,0,'#ae493b')}
  // Officers belong at actual junctions/turns, never at every repeating road block.
  const directions=nodeExits.map(e=>{const dx=e.target.x-p.x,dz=e.target.z-p.z,len=Math.hypot(dx,dz);return{x:dx/len,z:dz/len}});
  const turning=directions.length===2&&directions[0].x*directions[1].x+directions[0].z*directions[1].z>-.94;
  if(p.junction==='circle'||nodeExits.length>=3||turning){
   let location={x:0,z:0};if(p.junction!=='circle')location=[{x:-28,z:-28},{x:28,z:28},{x:-28,z:28},{x:28,z:-28}].sort((a,b)=>nearest(p.x+b.x,p.z+b.z).distance-nearest(p.x+a.x,p.z+a.z).distance)[0];
   street.policePost(g,p,city.createTrafficOfficer,location.x,location.z);
  }
  // Keep the railway continuous over node areas on the north-south spine.
  if(exits(p.id).length>=3)for(const approach of exits(p.id))street.signal(g,p,approach.target);
  if(p.metro&&straight){box(g,0,.22,0,2.7,.4,58,'#a3a18b');for(const x of [-1.4,1.4])box(g,x,.4,0,.16,.35,58,'#d5bd57');}
  if(p.metro){box(g,0,9.6,0,5.3,1,66,'#9b9e99');for(const x of [-1.05,1.05])box(g,x,10.41,0,.1,.09,66,'#7b8589');}
  nodes.push({group:g,place:p});
 }
 const scenery=createDistrictScenery(T,{root,box,label,mat,neighborhoods});
 const west=new T.Group();root.add(west);
 // Western Mirpur gets its own readable commercial identities, not metro scenery.
 for(const [id,title] of [['mirpur2','মিরপুর ২ • স্টেডিয়াম রোড'],['mirpur1','মিরপুর ১ • বাজার'],['technical','টেকনিক্যাল • বাস সংযোগ'],['kallyanpur','কল্যাণপুর • বাস কাউন্টার'],['shyamoli','শ্যামলী • নগর চত্বর']]){
  const p=getPlace(id);const board=new T.Group();board.position.set(p.x-40,0,p.z-40);west.add(board);box(board,0,2,0,11,4,5,'#d2c7aa');printed(board,title,0,3,2.56,10,1.3);printed(board,'টিকিট আছে • তাড়া নাই',0,1.4,2.56,10,1,'#a23d63');
 }
 const terminal=new T.Group();terminal.position.set(-731,0,240);west.add(terminal);box(terminal,0,.05,0,48,.1,52,'#6e7e83');for(let i=0;i<3;i++){const counter=box(terminal,-15+i*15,1.5,-20,12,3,5,['#e79936','#268e9b','#bc547d'][i]);printed(terminal,['মামা ট্রাভেলস','জ্যামবিলাস কাউন্টার','আগে চা পরিবহন'][i],-15+i*15,2.6,-17.44,11,1.1);const parked=city.vehicle('bus',100+i);parked.g.position.set(-15+i*15,0,3);terminal.add(parked.g)}
 const stadium=new T.Group();stadium.position.set(-210,0,-470);root.add(stadium);const bowl=new T.Mesh(new T.CylinderGeometry(42,47,8,40,1,true),mat('#d4cbb9'));bowl.position.y=5;stadium.add(bowl);const field=new T.Mesh(new T.CylinderGeometry(39,39,.2,40),mat('#45945e'));field.position.y=.2;stadium.add(field);for(let i=0;i<4;i++){const a=i*Math.PI/2;box(stadium,Math.cos(a)*48,12,Math.sin(a)*48,.45,24,.45,'#9faeb4');box(stadium,Math.cos(a)*48,24,Math.sin(a)*48,5,2,.4,'#f6edce')}label(stadium,'শের-ই-বাংলা ক্রিকেট স্টেডিয়াম',0,7,46,45,5,'#175b4c','#fff3bd');
 function nearest(x,z){let best=null;for(const road of roads){const a=getPlace(road.from),b=getPlace(road.to),dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/l2)),px=a.x+t*dx,pz=a.z+t*dz,d=Math.hypot(x-px,z-pz);if(!best||d<best.distance)best={road,t,x:px,z:pz,distance:d}}return best}
 function drivable(x,z){const closest=nearest(x,z);if(places.some(p=>p.metro&&exits(p.id).length===2&&Math.abs(x-p.x)<2.8&&Math.abs(z-p.z)<28))return false;if(closest.road.metro&&closest.distance<2.8&&closest.t*closest.road.length>24&&(1-closest.t)*closest.road.length>24)return false;if(places.some(p=>p.junction==='circle'&&Math.hypot(x-p.x,z-p.z)<9))return false;return nearest(x,z).distance<13.2||places.some(p=>Math.hypot(x-p.x,z-p.z)<(p.junction==='circle'?30.5:18.5))}
 function recoveryCost(p){if(drivable(p.x,p.z))return 0;const n=nearest(p.x,p.z);let cost=n.distance>13.2?n.distance-13.2:2.8-n.distance;for(const place of places)if(place.junction==='circle'&&Math.hypot(p.x-place.x,p.z-place.z)<9)cost=Math.max(cost,9-Math.hypot(p.x-place.x,p.z-place.z));return Math.max(.01,cost);}
 function canRecover(previous,next){return recoveryCost(previous)>0&&recoveryCost(next)<recoveryCost(previous)-.0001;}
 function pose(from,to,along=45,lane=6.5){const a=getPlace(from),b=getPlace(to),dx=b.x-a.x,dz=b.z-a.z,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len;return{x:a.x+ux*along+uz*lane,z:a.z+uz*along-ux*lane,yaw:Math.atan2(-ux,-uz)}}
 function stopPose(placeId){const e=exits(placeId)[0];return pose(placeId,e.target.id,47,10.5)}
 const crossers=[],crossingPoint=new T.Vector3();let lastVisibility=-Infinity,lastCrossings=-Infinity,visibleX=Infinity,visibleZ=Infinity;
 function update(player,time){street.update(time);
  if(time-lastCrossings>.08||time<lastCrossings){lastCrossings=time;crossers.length=0;for(const c of chunks){if(Math.hypot(c.center.x-player.x,c.center.z-player.z)>180)continue;for(const agent of c.group.userData.crossers||[]){if(Math.abs(agent.person.group.position.x)>13.7)continue;agent.person.group.getWorldPosition(crossingPoint);crossers.push({x:crossingPoint.x,z:crossingPoint.z});}}}
  if(time-lastVisibility<.2&&Math.hypot(player.x-visibleX,player.z-visibleZ)<12)return;lastVisibility=time;visibleX=player.x;visibleZ=player.z;scenery.update(player);for(const c of chunks)c.group.visible=Math.hypot(c.center.x-player.x,c.center.z-player.z)<340;for(const n of nodes)n.group.visible=Math.hypot(n.place.x-player.x,n.place.z-player.z)<360;stadium.visible=Math.hypot(player.x+210,player.z+470)<360;}
 function crossingAhead(player,range=14){const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);for(const p of crossers){const dx=p.x-player.x,dz=p.z-player.z,ahead=dx*fx+dz*fz,side=dx*fz-dz*fx;if(ahead>-4&&ahead<range&&Math.abs(side)<2)return true}return false}

 function legalBusStop(player){const n=nearest(player.x,player.z),along=Math.min(n.t,1-n.t)*n.road.length;return n.distance>=9&&along>=36&&along<=60;}
 let boardingPersonIndex=700;
 function borrowPassenger(player){const n=nearest(player.x,player.z),sideX=player.x-n.x,sideZ=player.z-n.z;let best=null,bestDistance=24;const point=new T.Vector3();
  for(const chunk of chunks){if(Math.hypot(chunk.center.x-player.x,chunk.center.z-player.z)>150)continue;for(const walker of chunk.group.userData.walkers||[]){if(walker.boarding)continue;walker.person.group.getWorldPosition(point);const d=Math.hypot(point.x-player.x,point.z-player.z);if(d<bestDistance&&(point.x-n.x)*sideX+(point.z-n.z)*sideZ>0){best=walker;bestDistance=d;}}}
  const synthetic=!best;if(!best){const length=Math.hypot(sideX,sideZ)||1,ux=length>1?sideX/length:-Math.cos(player.yaw),uz=length>1?sideZ/length:Math.sin(player.yaw);const person=city.createPedestrian(scene,n.x+ux*16.8-Math.sin(player.yaw)*9,n.z+uz*16.8-Math.cos(player.yaw)*9,boardingPersonIndex++);person.group.position.y=.37;best={person,boarding:false};}
  const group=best.person.group,parent=group.parent,position=group.position.clone(),rotation=group.rotation.clone(),scale=group.scale.clone();best.boarding=true;scene.attach(group);
  function place(visible){parent.attach(group);group.position.copy(position);group.rotation.copy(rotation);group.scale.copy(scale);group.visible=visible;best.boarding=!visible;}
  return{person:best.person,restore(){if(synthetic)scene.remove(group);else place(true)},board(){if(synthetic)scene.remove(group);else place(false)}};
 }
 function navigation(player){const n=nearest(player.x,player.z),a=getPlace(n.road.from),b=getPlace(n.road.to),fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw),forward=(b.x-a.x)*fx+(b.z-a.z)*fz>=0,upcoming=forward?b:a,previous=forward?a:b;return{here:n.t<.5?a:b,upcoming,distance:Math.round(Math.hypot(upcoming.x-player.x,upcoming.z-player.z)),choices:exits(upcoming.id,previous.id).filter(e=>e.target.id!==previous.id)}}
 return{root,chunks,nodes,nearest,legalBusStop,borrowPassenger,drivable,canRecover,pose,stopPose,update,crossingAhead,navigation,mustStop:street.mustStop};
}
