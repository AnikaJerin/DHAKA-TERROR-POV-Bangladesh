// Browser-light foliage: instanced alpha-cutout leaf clusters and three distance levels.
export function createVegetation(T){
 let seed=78301;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
 function leafTexture(){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');
  for(let i=0;i<44;i++){const x=65+random()*382,y=65+random()*382,a=random()*Math.PI*2,size=20+random()*29;ctx.save();ctx.translate(x,y);ctx.rotate(a);const shade=ctx.createLinearGradient(-size,0,size,0);shade.addColorStop(0,'#244d27');shade.addColorStop(.45,['#487d37','#658f42','#38743c'][i%3]);shade.addColorStop(1,'#9cb96c');ctx.fillStyle=shade;ctx.beginPath();ctx.moveTo(-size,0);ctx.bezierCurveTo(-size*.4,-size*.57,size*.4,-size*.5,size,0);ctx.bezierCurveTo(size*.3,size*.5,-size*.4,size*.52,-size,0);ctx.fill();ctx.strokeStyle='#a4b77a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-size,0);ctx.lineTo(size*.9,0);ctx.stroke();ctx.strokeStyle='#b7c18a70';ctx.lineWidth=.7;for(let j=-2;j<3;j++){ctx.beginPath();ctx.moveTo(j*size*.23,0);ctx.lineTo(j*size*.23+size*.23,-size*.29);ctx.moveTo(j*size*.23,0);ctx.lineTo(j*size*.23+size*.23,size*.29);ctx.stroke()}ctx.restore()}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.anisotropy=8;return t}
 const leaves=leafTexture();
 const barkCanvas=document.createElement('canvas');barkCanvas.width=barkCanvas.height=256;const ctx=barkCanvas.getContext('2d');ctx.fillStyle='#79634d';ctx.fillRect(0,0,256,256);for(let i=0;i<280;i++){const x=random()*256,y=random()*256;ctx.strokeStyle=i%3?'#4e433956':'#b29b7555';ctx.lineWidth=1+random()*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+(random()-.5)*7,y+8+random()*65);ctx.stroke()}const barkMap=new T.CanvasTexture(barkCanvas);barkMap.colorSpace=T.SRGBColorSpace;barkMap.wrapS=barkMap.wrapT=T.RepeatWrapping;barkMap.repeat.set(2,3);
 const bark=new T.MeshStandardMaterial({map:barkMap,bumpMap:barkMap,bumpScale:.065,color:'#d1c1a9',roughness:1});
 const foliage=new T.MeshStandardMaterial({map:leaves,alphaTest:.38,side:T.DoubleSide,roughness:.93,metalness:0});
 const depth=new T.MeshDepthMaterial({map:leaves,alphaTest:.38,side:T.DoubleSide,depthPacking:T.RGBADepthPacking});
 const time={value:0},motion={value:1};foliage.onBeforeCompile=shader=>{shader.uniforms.treeTime=time;shader.uniforms.treeMotion=motion;shader.vertexShader='uniform float treeTime; uniform float treeMotion;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
 #ifdef USE_INSTANCING
 transformed.x += sin(treeTime * 0.8 + instanceMatrix[3].y * 1.7) * 0.035 * treeMotion * (position.y + 0.5);
 #endif
 `)};
 const leafGeo=new T.PlaneGeometry(1,1),branchGeo=new T.CylinderGeometry(.65,1,1,7),dummy=new T.Object3D();
 const sharedGeometries=new Set([leafGeo,branchGeo]),sharedMaterials=new Set([bark,foliage,depth]);
 function branchSet(parent,segments){const m=new T.InstancedMesh(branchGeo,bark,segments.length);for(let i=0;i<segments.length;i++){const [a,b,r]=segments[i],av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);dummy.position.copy(av.add(bv).multiplyScalar(.5));dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());dummy.scale.set(r,d.length(),r);dummy.updateMatrix();m.setMatrixAt(i,dummy.matrix)}m.castShadow=true;m.receiveShadow=true;parent.add(m)}
 function canopy(parent,clusters,count,seedOffset){const mesh=new T.InstancedMesh(leafGeo,foliage,count);const color=new T.Color();for(let i=0;i<count;i++){const cluster=clusters[i%clusters.length],a=i*2.39996+seedOffset,r=Math.sqrt((i*.618)%1),size=1.25+(i%5)*.15;dummy.position.set(cluster[0]+Math.cos(a)*r*1.2,cluster[1]+Math.sin(i*1.3)*.75,cluster[2]+Math.sin(a)*r*1.15);dummy.rotation.set(Math.sin(i*1.7)*.85,a,Math.cos(i)*.45);dummy.scale.set(size,size*.88,1);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);color.setHSL(.24+(i%3)*.018,.25,.64+(i%4)*.06);mesh.setColorAt(i,color)}mesh.castShadow=count>25;mesh.receiveShadow=true;mesh.customDepthMaterial=depth;parent.add(mesh)}
 function tree(parent,x,z,scale=1,variant=0){const root=new T.Group();root.position.set(x,.25,z);root.scale.setScalar(scale);root.rotation.y=variant*1.71;parent.add(root);
  const bend=(variant%3-1)*.16,height=3.1+(variant%4)*.25;
  const trunkCurve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(bend,1.4,.05),new T.Vector3(bend*.5,height,0)]);
  const trunk=new T.Mesh(new T.TubeGeometry(trunkCurve,8,.17,8,false),bark);trunk.castShadow=true;trunk.receiveShadow=true;root.add(trunk);
  const clusters=[[-1.0,height+.55,.1],[.95,height+.85,.25],[0,height+1.55,-.1],[.2,height+.75,-1],[.1,height+.85,1.05]];
  branchSet(root,clusters.map((v,i)=>[[bend*.5,height-.8,0],[v[0]*.8,v[1]-.3,v[2]*.8],.07+(i%2)*.025]));
  // Three LOD canopies share textures and materials; no per-leaf draw calls.
  const lod=new T.LOD(),near=new T.Group(),medium=new T.Group(),far=new T.Group();canopy(near,clusters,72,variant);canopy(medium,clusters,30,variant);canopy(far,clusters,12,variant);lod.addLevel(near,0);lod.addLevel(medium,48);lod.addLevel(far,105);root.add(lod);
  // Root flare blends the trunk into the soil instead of looking like a pole.
  branchSet(root,[[[0,.32,0],[.48,.03,.12],.09],[[0,.3,0],[-.4,.03,.22],.085],[[0,.28,0],[.02,.03,-.4],.075]]);
  return root;
 }
 // Detailed blossoms share four small textures; individual petals and stamens are painted once.
 const flowerMaterials=['#fff9ef','#eb72ae','#f28c28','#f4cf38'].map((color,variant)=>{
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');
  const petals=variant===2?8:5;
  for(let ring=variant===2?1:0;ring>=0;ring--)for(let i=0;i<petals;i++){
   c.save();c.translate(128,128);c.rotate(i*Math.PI*2/petals+ring*.3);
   const gradient=c.createRadialGradient(0,-22,2,0,-57,53);gradient.addColorStop(0,variant===0?'#d4bf76':color);gradient.addColorStop(.55,color);gradient.addColorStop(1,variant===0?'#ffffff':'#fff1cb');
   c.fillStyle=gradient;c.beginPath();c.ellipse(0,-48-ring*7,29-ring*7,50-ring*8,0,0,Math.PI*2);c.fill();
   c.strokeStyle=variant===0?'#d5cda96b':'#9d4b3a40';c.lineWidth=1.5;for(const x of [-9,0,9]){c.beginPath();c.moveTo(0,-14);c.quadraticCurveTo(x,-49,x,-81);c.stroke()}c.restore();
  }
  c.fillStyle='#d49b23';c.beginPath();c.arc(128,128,19,0,Math.PI*2);c.fill();
  for(let i=0;i<24;i++){const a=i*2.39996,r=3+Math.sqrt(i/24)*14;c.fillStyle=i%3?'#ffe397':'#8c6225';c.beginPath();c.arc(128+Math.cos(a)*r,128+Math.sin(a)*r,1.8,0,Math.PI*2);c.fill();}
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=4;
  const material=new T.MeshStandardMaterial({map:texture,alphaTest:.35,side:T.DoubleSide,roughness:.85});sharedMaterials.add(material);return material;
 });
 function shrubs(parent,beds){
  // One instanced leaf batch per distance level, rather than one draw call per leaf/bush.
  const root=new T.Group(),lod=new T.LOD();root.add(lod);parent.add(root);
  if(!beds.length)return root;
  root.position.set(beds.reduce((v,b)=>v+b.x,0)/beds.length,0,beds.reduce((v,b)=>v+b.z,0)/beds.length);
  const ox=root.position.x,oz=root.position.z,leafColor=new T.Color();
  for(const [level,leafCount,bloomCount,distance] of [[0,78,24,0],[1,30,10,45],[2,10,0,100]]){
   const g=new T.Group();lod.addLevel(g,distance);
   const leavesBatch=new T.InstancedMesh(leafGeo,foliage,beds.length*leafCount);leavesBatch.receiveShadow=true;leavesBatch.castShadow=false;
   beds.forEach((bed,k)=>{
    const w=bed.w||1.5,d=bed.d||3,base=bed.y??.46,phase=bed.seed??k;
    for(let i=0;i<leafCount;i++){
     const a=i*2.39996+phase,r=Math.sqrt((i*.6180339)%1),height=.24+.32*(1-r*r),size=.48+(i%5)*.065;
     dummy.position.set(bed.x-ox+Math.cos(a)*r*w*.48,base+height+Math.sin(i*1.7)*.12,bed.z-oz+Math.sin(a)*r*d*.48);
     dummy.rotation.set((i%4)*.55,a,Math.sin(i)*.5);dummy.scale.set(size,size*.8,1);dummy.updateMatrix();leavesBatch.setMatrixAt(k*leafCount+i,dummy.matrix);
     leafColor.setHSL(.24+(i%4)*.014,.32,.38+(i%5)*.045);leavesBatch.setColorAt(k*leafCount+i,leafColor);
    }
   });g.add(leavesBatch);
   if(!bloomCount)continue;
   for(let color=0;color<4;color++){
    const selected=beds.filter(b=>b.flowers===color);if(!selected.length)continue;
    const blooms=new T.InstancedMesh(leafGeo,flowerMaterials[color],selected.length*bloomCount);blooms.receiveShadow=true;
    selected.forEach((bed,k)=>{for(let i=0;i<bloomCount;i++){
     const a=i*2.39996+(bed.seed??k),r=Math.sqrt((i*.6180339)%1),size=.16+(i%4)*.025;
     dummy.position.set(bed.x-ox+Math.cos(a)*r*(bed.w||1.5)*.43,(bed.y??.46)+.5+Math.sin(i*2.1)*.13,bed.z-oz+Math.sin(a)*r*(bed.d||3)*.43);
     dummy.rotation.set(-.45-(i%3)*.45,a,Math.sin(i)*.3);dummy.scale.set(size,size,1);dummy.updateMatrix();blooms.setMatrixAt(k*bloomCount+i,dummy.matrix);
    }});g.add(blooms);
   }
  }
  // Fine woody twigs are visible inside the open, irregular foliage silhouettes.
  const twigs=[];beds.forEach((b,k)=>{for(let i=0;i<5;i++){const a=i*2.4+k;twigs.push([[b.x-ox,(b.y??.46),b.z-oz],[b.x-ox+Math.cos(a)*(b.w||1.5)*.28,(b.y??.46)+.48,b.z-oz+Math.sin(a)*(b.d||3)*.28],.014])}});branchSet(root,twigs);
  return root;
 }
 function update(seconds,reducedMotion){time.value=seconds;motion.value=reducedMotion?0:1}
 return{tree,shrubs,update,sharedMaterials,sharedGeometries};
}
