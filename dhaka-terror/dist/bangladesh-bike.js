// Original motorcycle geometry: commuter bikes, delivery bikes, and sport variants seen on Dhaka streets.
export function createBangladeshBikeFactory(T,{box,cylinder,label,mat,person}){
 const palettes=[
  {paint:'#e84d2a',trim:'#ffb84d',seat:'#2a2f36'},{paint:'#2d5aa0',trim:'#6ec6ff',seat:'#2a2f36'},
  {paint:'#1a7a3d',trim:'#7eff7e',seat:'#2a2f36'},{paint:'#6b3fa0',trim:'#d48cff',seat:'#2a2f36'},
  {paint:'#c83e4d',trim:'#ff6b6b',seat:'#2a2f36'},{paint:'#3a3f47',trim:'#b0b8c1',seat:'#2a2f36'}
 ];
 const chrome=new T.MeshStandardMaterial({color:'#c8d0d4',metalness:.85,roughness:.2});
 const rubber=mat('#20282c');
 const glass=mat('#3a5a6a');
 const lightMat=new T.MeshBasicMaterial({color:'#fff8e7',toneMapped:false});
 const brakeMat=new T.MeshBasicMaterial({color:'#e83a3a',toneMapped:false});
 const indicatorMat=new T.MeshBasicMaterial({color:'#ffaa00',toneMapped:false});
 const cache=new Map();
 function materials(variant){
  const i=variant%palettes.length;
  if(cache.has(i))return cache.get(i);
  const p=palettes[i];
  const c=document.createElement('canvas');c.width=1024;c.height=512;
  const x=c.getContext('2d');x.fillStyle=p.paint;x.fillRect(0,0,1024,512);
  let seed=71+i;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  for(let j=0;j<200;j++){x.fillStyle=j%3?'#ffffff18':'#00000018';x.fillRect(random()*1024,100+random()*300,1+random()*12,1+random()*8)}
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;
  const paint=new T.MeshStandardMaterial({color:p.paint,roughness:.35,metalness:.4,map:tex,side:T.DoubleSide});
  const trim=new T.MeshStandardMaterial({color:p.trim,roughness:.25,metalness:.55});
  const seat=new T.MeshStandardMaterial({color:p.seat,roughness:.85,metalness:.1});
  cache.set(i,{paint,trim,seat});
  return cache.get(i);
 }
 function rod(g,a,b,r=.02,m=chrome){
  const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);
  const mesh=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),8),m);
  mesh.position.copy(av.add(bv).multiplyScalar(.5));
  mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());
  g.add(mesh);return mesh;
 }
 function wheel(g,x,z,radius=.33,width=.07,isFront=true){
  const w=new T.Group();w.position.set(x,.38,z);g.add(w);
  const tire=new T.Mesh(new T.TorusGeometry(radius,width,8,28),rubber);tire.rotation.y=Math.PI/2;w.add(tire);
  const rim=cylinder(w,0,0,0,radius*.7,.18,chrome,16);rim.rotation.z=Math.PI/2;
  const spokes=new T.Group();const count=18;
  for(let k=0;k<count;k++){const a=k*Math.PI*2/count;rod(spokes,[0,0,0],[Math.sin(a)*radius*.65,Math.cos(a)*radius*.65,0],.012,chrome)}spokes.rotation.z=Math.PI/2;w.add(spokes);
  const hub=cylinder(w,0,0,0,radius*.12,.1,chrome,12);hub.rotation.z=Math.PI/2;
  if(isFront){
   const disc=cylinder(w,radius*.85,0,0,radius*.55,.03,mat('#4a5560'),12);disc.rotation.z=Math.PI/2;
   for(let k=0;k<3;k++){const a=k*Math.PI*1.5;cylinder(w,Math.sin(a)*radius*.35,Math.cos(a)*radius*.35,0,.025,.04,mat('#3a4450'),6).rotation.z=Math.PI/2}
  }
  return w;
 }
 function cylinder(g,x,y,z,r,h,m,sides=16){
  const obj=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),m);obj.position.set(x,y,z);g.add(obj);return obj;
 }
 function create(variant=0){
  const g=new T.Group(),wheels=[];
  const p=palettes[variant%palettes.length];
  const m=materials(variant);
  // Main frame triangles
  const frame=m.paint;
  rod(g,[-.4,1.1,.3],[.4,1.1,.3],.045,frame);
  rod(g,[-.35,.65,.3],[.35,.65,.3],.04,frame);
  rod(g,[-.4,1.1,.3],[-.35,.65,.3],.04,frame);
  rod(g,[.4,1.1,.3],[.35,.65,.3],.04,frame);
  // Front fork
  rod(g,[0,1.1,.3],[0,.75,.85],.035,frame);
  rod(g,[-.08,.75,.85],[-.08,.45,1.1],.03,frame);
  rod(g,[.08,.75,.85],[.08,.45,1.1],.03,frame);
  // Rear triangle
  rod(g,[-.35,.65,.3],[-.25,.35,-.6],.035,frame);
  rod(g,[.35,.65,.3],[.25,.35,-.6],.035,frame);
  rod(g,[-.25,.35,-.6],[.25,.35,-.6],.03,frame);
  // Seat post
  rod(g,[0,.65,.3],[0,1.0,-.1],.025,frame);
  // Seat
  box(g,0,1.05,-.1,.35,.08,.3,m.seat);
  box(g,0,1.1,-.15,.32,.1,.35,trim);
  // Fuel tank
  const tankShape=new T.Shape();tankShape.moveTo(-.18,1.1);tankShape.quadraticCurveTo(-.18,1.45,0,1.55);tankShape.quadraticCurveTo(.18,1.45,.18,1.1);tankShape.closePath();
  const tank=new T.Mesh(new T.ExtrudeGeometry(tankShape,{depth:.36,bevelEnabled:false,curveSegments:8}),m.paint);
  tank.position.set(0,0,.3);g.add(tank);
  // Handlebars
  rod(g,[-.32,1.2,.3],[-.32,1.45,.3],.025,chrome);
  rod(g,[.32,1.2,.3],[.32,1.45,.3],.025,chrome);
  rod(g,[-.32,1.45,.3],[.32,1.45,.3],.025,chrome);
  // Mirrors
  for(const side of [-1,1]){
   const mirror=box(g,side*.35,1.4,.3,.08,.04,.08,mat('#2a3540'));
   mirror.rotation.y=side*.3;
   const stem=rod(g,[side*.3,1.3,.3],[side*.35,1.4,.3],.012,chrome);
  }
  // Front wheel
  wheels.push(wheel(g,0,1.1,true));
  // Rear wheel
  wheels.push(wheel(g,0,-.6,false));
  // Engine block
  box(g,0,.45,-.4,.25,.25,.4,mat('#3a4450'));
  box(g,0,.5,-.55,.2,.15,.3,mat('#2a3340'));
  // Exhaust
  rod(g,[.25,.4,-.5],[.35,.3,-.9],.02,mat('#5a6570'));
  // Footpegs
  for(const side of [-1,1]){
   rod(g,[side*.28,.35,.2],[side*.5,.25,.1],.02,chrome);
   rod(g,[side*.28,.35,-.5],[side*.5,.25,-.6],.02,chrome);
  }
  // Chain guard
  rod(g,[.2,.35,.2],[.2,.25,-.4],.012,trim);
  // Lights
  const headlamp=new T.Mesh(new T.SphereGeometry(.09,12,8),lightMat);headlamp.position.set(0,1.15,1.1);g.add(headlamp);
  const tail=cylinder(g,0,.65,-.9,.06,.04,brakeMat,10);tail.rotation.x=Math.PI/2;
  // Indicators
  for(const side of [-1,1]){
   cylinder(g,side*.22,1.1,1.05,.04,.04,indicatorMat,10).rotation.x=Math.PI/2;
   cylinder(g,side*.22,.65,-.95,.04,.04,indicatorMat,10).rotation.x=Math.PI/2;
  }
  // License plate
  label(g,['ঢাকা মেট্রো ক ১২-৪৫৮৭','ঢাকা মেট্রো খ ১৪-৯০২১','ঢাকা মেট্রো গ ১১-৩৩৪৪'][variant%3],0,.55,-.92,.6,.18,'#f4e8d0','#1a2a35');
  // Decal
  label(g,['পার্সেল এক্সপ্রেস','ফুড ডেলিভারি','রাইড শেয়ারিং'][variant%3],0,.7,.4,.5,.2,p.trim,'#1a2a35');
  // Rider
  const rider=person(g,.05,.05,'#c8a978',true);
  rider.group.scale.setScalar(.7);
  rider.group.position.set(0,.75,-.05);
  rider.group.rotation.y=Math.PI;
  return{g,wheels,length:1.9,width:.8,type:'bike'};
 }
 function box(g,x,y,z,w,h,d,m){const mesh=new T.Mesh(new T.BoxGeometry(1,1,1),m);mesh.position.set(x,y,z);mesh.scale.set(w,h,d);mesh.castShadow=true;mesh.receiveShadow=true;g.add(mesh);return mesh}
 const trim=chrome;
 return{create};
}