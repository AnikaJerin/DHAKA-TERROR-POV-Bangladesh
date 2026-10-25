// Original footpath stall geometry: collapsible bamboo/steel frame, fabric canopy, display shelves, and vendor seat.
export function createBangladeshStallFactory(T,{box,cylinder,label,mat,person}){
 const palettes=[
  {frame:'#4a3728',cloth:'#e8c56d',accent:'#c0392b',shelf:'#5d4037'},
  {frame:'#2d3a2d',cloth:'#6db87a',accent:'#2e7d32',shelf:'#3e4a3e'},
  {frame:'#3a2d3a',cloth:'#d896c8',accent:'#a03a7a',shelf:'#4a3e4a'},
  {frame:'#2a3a3a',cloth:'#7ac8e8',accent:'#2a7a9a',shelf:'#3a4a4a'},
  {frame:'#3a2a2a',cloth:'#f0a858',accent:'#c05a2a',shelf:'#4a3a3a'}
 ];
 const chrome=new T.MeshStandardMaterial({color:'#b0b8bc',metalness:.8,roughness:.3});
 const rubber=mat('#2a3a3a');
 const cache=new Map();
 function materials(variant){
  const i=variant%palettes.length;
  if(cache.has(i))return cache.get(i);
  const p=palettes[i];
  const clothCanvas=document.createElement('canvas');clothCanvas.width=clothCanvas.height=512;
  const cx=clothCanvas.getContext('2d');cx.fillStyle=p.cloth;cx.fillRect(0,0,512,512);
  for(let j=0;j<3000;j++){cx.fillStyle=j%2?'#ffffff0c':'#00000010';cx.fillRect((j*73)%512,(j*97)%512,1,2)}
  const clothMap=new T.CanvasTexture(clothCanvas);clothMap.colorSpace=T.SRGBColorSpace;clothMap.wrapS=clothMap.wrapT=T.RepeatWrapping;clothMap.repeat.set(4,2);
  const cloth=new T.MeshStandardMaterial({map:clothMap,roughness:.75,side:T.DoubleSide});
  const frameMat=new T.MeshStandardMaterial({color:p.frame,roughness:.6,metalness:.3});
  const shelfMat=new T.MeshStandardMaterial({color:p.shelf,roughness:.65,metalness:.15});
  const accent=new T.MeshStandardMaterial({color:p.accent,roughness:.4,metalness:.5});
  cache.set(i,{frame:frameMat,shelf:shelfMat,cloth,accent});
  return cache.get(i);
 }
 function cylinder(g,x,y,z,r,h,m,sides=12){
  const obj=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),m);obj.position.set(x,y,z);g.add(obj);return obj;
 }
 function create(variant=0){
  const g=new T.Group();
  const m=materials(variant);
  // Base platform
  box(g,0,.15,0,3.2,.3,2.2,m.shelf);
  box(g,0,.05,0,3.4,.1,2.4,m.frame);
  // Four corner posts
  for(const sx of [-1,1])for(const sz of [-1,1]){
   const x=sx*1.5,z=sz*1.0;
   cylinder(g,x,1.1,z,.04,2.2,m.frame);
   cylinder(g,x,2.2,z,.035,1.2,m.frame);
  }
  // Roof frame
  for(const sx of [-1,1]){
   const x=sx*1.5;
   cylinder(g,x,2.8,1.0,.035,1.2,m.frame);
   cylinder(g,x,2.8,-1.0,.035,1.2,m.frame);
   rod(g,[x,2.8,1.0],[x,2.8,-1.0],.03,m.frame);
  }
  for(const sz of [-1,1]){
   const z=sz*1.0;
   cylinder(g,-1.5,2.8,z,.035,1.2,m.frame);
   cylinder(g,1.5,2.8,z,.035,1.2,m.frame);
   rod(g,[-1.5,2.8,z],[1.5,2.8,z],.03,m.frame);
  }
  // Fabric canopy
  const canopyShape=new T.Shape();
  canopyShape.moveTo(-1.6,0);canopyShape.lineTo(1.6,0);
  canopyShape.quadraticCurveTo(1.6,.4,1.4,.6);
  canopyShape.lineTo(-1.4,.6);
  canopyShape.quadraticCurveTo(-1.6,.4,-1.6,0);
  canopyShape.closePath();
  const canopyGeo=new T.ExtrudeGeometry(canopyShape,{depth:2.4,bevelEnabled:false,curveSegments:8});
  const canopyMat=m.cloth;
  const canopy=new T.Mesh(canopyGeo,canopyMat);
  canopy.position.set(0,3.1,0);
  canopy.rotation.x=-Math.PI/2;
  g.add(canopy);
  // Front valance
  for(const sx of [-1,1]){
   const x=sx*1.5;
   const valance=box(g,x,2.6,1.1,.1,.4,.2,m.accent);
   valance.rotation.y=sx*Math.PI/2;
  }
  // Display shelves (three tiers)
  for(let tier=0;tier<3;tier++){
   const y=.8+tier*.7;
   box(g,0,y,0,2.8,.12,1.2,m.shelf);
   box(g,0,y+.06,0,2.6,.04,1.0,m.accent);
   // Shelf supports
   for(const sx of [-1,1]){
    const x=sx*1.35;
    cylinder(g,x,y+.06,0,.025,.6,m.frame);
   }
  }
  // Display items on shelves
  for(let tier=0;tier<3;tier++){
   const y=.9+tier*.7;
   for(let i=0;i<6;i++){
    const x=-1.2+i*.48;
    const itemColors=['#e86b6b','#6be8a8','#e8e86b','#a86be8','#6bb8e8','#e8a86b'];
    box(g,x,y+.12,0,.15,.15,.15,mat(itemColors[(i+tier)%itemColors.length]));
    if(tier===1)label(g,['২৫','৩০','৪০','৫০','৬০','৭৫'][i],x,y+.2,0,.3,.15,'#fff8e0','#1a2a35');
   }
  }
  // Vendor seat
  box(g,-1.3,.45,-.8,.6,.4,.5,m.shelf);
  box(g,-1.3,.6,-.8,.5,.1,.4,m.accent);
  // Vendor
  const vendor=person(g,-1.3,.6,-.8,'#c8a978',false);
  vendor.group.scale.setScalar(.85);
  vendor.group.rotation.y=Math.PI/2;
  // Front signboard
  const sign=label(g,['চা ও বিস্কুট','ফুচকা ভান্ডার','জামাকাপড়','ফল ও জুস','সিংারা পুড়ি'][variant%palettes.length],0,3.2,1.2,2.8,.5,m.accent,'#fff8e0');
  sign.rotation.y=Math.PI;
  // Hanging items
  for(let i=0;i<4;i++){
   const a=-Math.PI/2+i/3*Math.PI;
   rod(g,[Math.sin(a)*1.4,2.9,Math.cos(a)*1.1],[Math.sin(a)*1.4,2.4,Math.cos(a)*1.1],.015,m.accent);
   box(g,Math.sin(a)*1.4,2.3,Math.cos(a)*1.1,.12,.2,.12,m.accent);
  }
  // Price tags
  for(let i=0;i<3;i++){
   label(g,['৫ টাকা','১০ টাকা','১৫ টাকা'][i],1.6,1.2+i*.7,-1.1,.6,.2,'#fff8e0','#1a2a35');
   label(g,['২০ টাকা','২৫ টাকা','৩০ টাকা'][i],-1.6,1.2+i*.7,1.1,.6,.2,'#fff8e0','#1a2a35');
  }
  // Bell
  const bell=cylinder(g,-1.5,1.3,1.1,.08,.08,m.accent,12);bell.rotation.x=Math.PI/2;
  const clapper=cylinder(g,-1.5,1.1,1.1,.02,.15,chrome);clapper.rotation.x=Math.PI/2;
  // Cash box
  box(g,-1.0,.45,1.0,.3,.2,.25,mat('#1a2a3a'));
  // Side panels (fabric roll-down)
  for(const sx of [-1,1]){
   const panel=new T.Mesh(new T.PlaneGeometry(1.8,1.8),m.cloth);
   panel.position.set(sx*1.55,1.8,0);
   panel.rotation.y=sx*Math.PI/2;
   g.add(panel);
  }
  return{g,length:3.4,width:2.4,type:'stall'};
 }
 function box(g,x,y,z,w,h,d,m){
  const mesh=new T.Mesh(new T.BoxGeometry(1,1,1),m);
  mesh.position.set(x,y,z);mesh.scale.set(w,h,d);
  mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh;
 }
 function rod(g,a,b,r=.02,m=chrome){
  const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);
  const mesh=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),8),m);
  mesh.position.copy(av.add(bv).multiplyScalar(.5));
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());
  g.add(mesh);return mesh;
 }
 return{create};
}