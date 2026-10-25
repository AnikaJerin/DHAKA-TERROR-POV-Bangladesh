// Sculpted viaduct geometry; original weathering textures, not photographs.
export function createMetroStructure(T){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');let seed=137;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 ctx.fillStyle='#b5b7b2';ctx.fillRect(0,0,512,512);
 for(let i=0;i<18000;i++){const grey=120+Math.floor(random()*95);ctx.fillStyle=`rgba(${grey},${grey+1},${grey-3},.15)`;ctx.fillRect(random()*512,random()*512,1+random()*3,1+random()*3)}
 for(let i=0;i<55;i++){const x=random()*512;ctx.fillStyle=`rgba(65,66,57,${.02+random()*.06})`;ctx.fillRect(x,random()*120,1+random()*9,130+random()*350)}
 ctx.strokeStyle='#72766f35';ctx.lineWidth=2;for(const y of [127,255,383]){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke()}
 const concreteTex=new T.CanvasTexture(c);concreteTex.colorSpace=T.SRGBColorSpace;concreteTex.wrapS=concreteTex.wrapT=T.RepeatWrapping;concreteTex.repeat.set(.28,.28);concreteTex.anisotropy=8;
 const concrete=new T.MeshStandardMaterial({color:'#b2b4b0',map:concreteTex,bumpMap:concreteTex,bumpScale:.035,roughness:.96});
 const cap=new T.MeshStandardMaterial({color:'#9b9f9a',map:concreteTex,roughness:.93});const rail=new T.MeshStandardMaterial({color:'#7b8589',metalness:.82,roughness:.34});const fastener=new T.MeshStandardMaterial({color:'#515856',metalness:.3,roughness:.75});const rubber=new T.MeshStandardMaterial({color:'#343a39',roughness:1});const wire=new T.LineBasicMaterial({color:'#58686e'});
 const sharedMaterials=new Set([concrete,cap,rail,fastener,rubber,wire]);
 function mesh(parent,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
 const blockGeometry=new T.BoxGeometry(1,1,1);
 function block(parent,x,y,z,w,h,d,material=concrete){const m=mesh(parent,blockGeometry,material,x,y,z);m.scale.set(w,h,d);return m}
 function profile(parent,points,length,z,material=concrete){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return mesh(parent,new T.ExtrudeGeometry(s,{depth:length,bevelEnabled:false,steps:1}),material,0,0,z)}
 function flaredPier(parent,z){
  const pier=new T.Group();pier.position.z=z;parent.add(pier);parent=pier;z=0;
  block(parent,0,.28,z,2.1,.5,2.6,cap);block(parent,0,.65,z,1.62,.3,2.1);
  const s=new T.Shape();s.moveTo(-.99,.75);s.lineTo(.99,.75);s.lineTo(.99,6.65);s.bezierCurveTo(.99,7.25,1.3,7.8,2.1,7.94);s.lineTo(2.1,8.24);s.lineTo(-2.1,8.24);s.lineTo(-2.1,7.94);s.bezierCurveTo(-1.3,7.8,-.99,7.25,-.99,6.65);s.closePath();
  mesh(parent,new T.ExtrudeGeometry(s,{depth:1.5,bevelEnabled:true,bevelThickness:.035,bevelSize:.045,bevelSegments:2,steps:1,curveSegments:12}),concrete,0,0,z-.75);
  // Casting seams, twin bearing pads and a shallow drain line.
  for(const y of [2.6,5.0])block(parent,0,y,z+.77,1.94,.018,.018,cap);
  for(const x of [-1.15,1.15]){block(parent,x,8.32,z,.8,.16,1.05,rubber);block(parent,x,8.44,z,.94,.08,1.16,cap)}
  return pier;
 }
 // Portal legs sit beyond the 14 m carriageway edge; only the beam spans traffic.
 function portal(parent,z){
  for(const side of [-1,1]){block(parent,side*17.2,.3,z,2,.55,2.7,cap);block(parent,side*17.2,4.05,z,1.3,7.6,1.65);block(parent,side*17.2,7.8,z,1.8,.75,2);}
  block(parent,0,7.95,z,35.7,1,1.8);for(const x of [-1.15,1.15])block(parent,x,8.48,z,.95,.12,1.15,rubber);
 }
 function decorate(parent,index,onPier=null){
  // Hollow-looking trapezoidal box-girder underside with a wide slab on top.
  profile(parent,[[-2.55,10.13],[2.55,10.13],[2.55,9.75],[1.38,8.54],[-1.38,8.54],[-2.55,9.75]],160,-160);
  block(parent,0,10.18,-80,5.35,.18,160,cap);
  for(const side of [-1,1]){block(parent,side*2.64,10.62,-80,.18,.85,160);block(parent,side*2.64,11.08,-80,.24,.12,160,cap)}
  for(let z=-18;z>-160;z-=35){if(index%4===2&&z===-53)portal(parent,z);else{const pier=flaredPier(parent,z);onPier?.(pier,index,z)}}
  // Rail heads and concrete sleeper pairs are continuous through every segment boundary.
  for(const x of [-1.05,1.05]){block(parent,x,10.32,-80,.18,.12,160,fastener);block(parent,x,10.41,-80,.09,.09,160,rail)}
  const sleeperEntries=[];for(let z=-1;z>-160;z-=1.3)sleeperEntries.push(z);
  const instance=new T.InstancedMesh(new T.BoxGeometry(2.8,.09,.22),cap,sleeperEntries.length),dummy=new T.Object3D();sleeperEntries.forEach((z,i)=>{dummy.position.set(0,10.3,z);dummy.updateMatrix();instance.setMatrixAt(i,dummy.matrix)});instance.receiveShadow=true;parent.add(instance);
  // Expansion joints and casting-panel lines across the visible soffit.
  for(let z=-.1;z>-160;z-=20){block(parent,0,8.53,z,2.74,.025,.035,fastener);for(const side of [-1,1])block(parent,side*2.565,9.94,z,.018,.34,.035,cap)}
  // Portal catenary frames, contact wire and supporting cable at rail height.
  for(let z=-18;z>-160;z-=35){for(const side of [-1,1])block(parent,side*2.35,12.25,z,.08,3,.09,rail);block(parent,0,13.8,z,4.8,.09,.1,rail);block(parent,0,13.46,z,.045,.65,.045,rail)}
  for(const y of [13.15,13.68]){const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(0,y,0),new T.Vector3(0,y,-160)]),wire);parent.add(line)}
 }
 return{decorate,sharedMaterials};
}
