// Original lightweight sedan and wagon shapes; no licensed vehicle meshes or badges.
export function createDhakaCarFactory(T,{box,label,mat}){
 const colors=['#e9b51d','#151c24','#b8c2c9','#9b2948','#317c69','#d7c2a0','#e86032','#436ec5','#e4e8e1','#62458a'];
 const chrome=new T.MeshStandardMaterial({color:'#d4dee2',metalness:.85,roughness:.22});const rubber=mat('#20292f');
 // Static, tiny environment cube adds soft sky reflections without realtime mirrors.
 const faces=Array.from({length:6},(_,face)=>{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),gradient=x.createLinearGradient(0,0,0,128);gradient.addColorStop(0,'#d9f1fb');gradient.addColorStop(.48,'#8fc0d5');gradient.addColorStop(.54,'#c9d3cd');gradient.addColorStop(1,'#52636b');x.fillStyle=gradient;x.fillRect(0,0,128,128);if(face!==2){x.fillStyle='#e3e9dc99';x.fillRect(12,25,7,70);x.fillRect(88,45,18,50)}return c});
 const env=new T.CubeTexture(faces);env.needsUpdate=true;env.colorSpace=T.SRGBColorSpace;
 const glass=new T.MeshStandardMaterial({color:'#264855',metalness:.45,roughness:.17,envMap:env,envMapIntensity:.8,side:T.DoubleSide});
 const lens=new T.MeshStandardMaterial({color:'#edf8fa',emissive:'#9abec8',emissiveIntensity:.18,roughness:.14,metalness:.2});const tail=new T.MeshStandardMaterial({color:'#b51f37',emissive:'#7d1521',emissiveIntensity:.2,roughness:.23});
 function quad(g,points,material){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();const m=new T.Mesh(geo,material);m.castShadow=true;g.add(m);return m}
 function cylinder(g,x,y,z,r,h,material,sides=16){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),material);m.position.set(x,y,z);g.add(m);return m}
 function loft(g,rings,material){const positions=[],indices=[];const sides=8;for(const [z,w,y]of rings)for(let j=0;j<=sides;j++){const t=j/sides*2-1;positions.push(t*w,y+.065*(1-t*t),z)}for(let i=0;i<rings.length-1;i++)for(let j=0;j<sides;j++){const a=i*(sides+1)+j,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const m=new T.Mesh(geo,material);m.castShadow=true;g.add(m)}
 function create(variant=0){const g=new T.Group(),wheels=[],wagon=variant%3===1,color=colors[variant%colors.length],rear=wagon?2.15:2.2;
  const paint=new T.MeshStandardMaterial({color,metalness:.52,roughness:.26,envMap:env,envMapIntensity:.62,side:T.DoubleSide});
  box(g,0,.4,0,1.66,.18,3.95,'#26353e');
  loft(g,[[-2.22,.72,.72],[-2.08,.88,.87],[-1.7,.94,.96],[-1.05,.94,1.03],[-.4,.94,1.05],[.8,.95,1.06],[1.45,.94,.99],[2.03,.86,.9],[rear,.75,.74]],paint);
  for(const side of [-1,1]){
   // Genuine wheel openings in the side silhouette.
   const shape=new T.Shape();shape.moveTo(-2.2,.43);shape.lineTo(-1.88,.43);shape.absarc(-1.4,.43,.48,Math.PI,0,true);shape.lineTo(.92,.43);shape.absarc(1.4,.43,.48,Math.PI,0,true);shape.lineTo(rear,.43);shape.quadraticCurveTo(rear+.02,.72,2.03,.9);shape.lineTo(1.45,.99);shape.lineTo(.8,1.06);shape.lineTo(-1.05,1.03);shape.lineTo(-1.7,.96);shape.lineTo(-2.08,.87);shape.quadraticCurveTo(-2.24,.68,-2.2,.43);shape.closePath();const m=new T.Mesh(new T.ShapeGeometry(shape,10),paint);m.rotation.y=side*Math.PI/2;if(side===-1)m.scale.x=-1;m.position.x=side*.94;g.add(m);
   const roofEnd=wagon?1.18:.63,backEnd=wagon?1.88:1.36;
   quad(g,[[side*.94,1.045,-1.02],[side*.68,1.66,-.49],[side*.68,1.67,.12],[side*.93,1.065,.12]],glass);
   quad(g,[[side*.93,1.065,.23],[side*.68,1.67,.23],[side*.68,1.65,roofEnd],[side*.92,1.03,backEnd]],glass);
   // B-pillars, window sill chrome, panel seams and door handles.
   box(g,side*.92,1.34,.175,.055,.57,.095,'#1d303a');box(g,side*.95,1.055,.1,.025,.025,2.15,'#c4d1d4');
   for(const z of [.16,.99]){box(g,side*.959,.82,z,.016,.32,.014,'#455b66');box(g,side*.977,.96,z-.19,.025,.045,.2,'#c6d4d8')}
   box(g,side*.952,.58,.1,.026,.045,2.08,'#88969b');
   const mirror=box(g,side*1.025,1.15,-.78,.22,.13,.25,color);mirror.material=paint;box(g,side*1.045,1.15,-.69,.15,.09,.025,'#b2ccd5');
   for(const z of [-1.4,1.4]){
    const w=new T.Group();w.position.set(side*.95,.43,z);g.add(w);const tire=new T.Mesh(new T.TorusGeometry(.325,.095,8,24),rubber);tire.rotation.y=Math.PI/2;w.add(tire);const disc=cylinder(w,side*.035,0,0,.27,.13,mat('#394d59'));disc.rotation.z=Math.PI/2;
    for(let j=0;j<8;j++){const a=j*Math.PI/4,spoke=box(w,side*.115,Math.sin(a)*.13,Math.cos(a)*.13,.025,.045,.24,'#b7c4cc');spoke.material=chrome;spoke.rotation.x=-a}const hub=cylinder(w,side*.14,0,0,.075,.04,chrome,12);hub.rotation.z=Math.PI/2;wheels.push(w);
   }
  }
  // Sloping windshield and rear screen; a gently crowned roof joins both.
  quad(g,[[-.93,1.045,-1.04],[.93,1.045,-1.04],[.68,1.66,-.5],[-.68,1.66,-.5]],glass);
  const end=wagon?1.18:.63,back=wagon?1.88:1.36;
  loft(g,[[-.53,.68,1.665],[-.28,.69,1.725],[end-.16,.69,1.73],[end,.68,1.65]],paint);
  quad(g,[[-.68,1.65,end],[.68,1.65,end],[.91,1.02,back],[-.91,1.02,back]],glass);
  quad(g,[[-.75,.43,-2.23],[.75,.43,-2.23],[.88,.87,-2.09],[-.88,.87,-2.09]],paint);
  quad(g,[[-.75,.43,rear+.01],[.75,.43,rear+.01],[.86,.9,2.03],[-.86,.9,2.03]],paint);
  for(const side of [-1,1]){
   const frontLamp=box(g,side*.64,.79,-2.16,.45,.17,.06,'#d7eef2');frontLamp.material=lens;frontLamp.rotation.y=side*.18;const backLamp=box(g,side*.68,.81,2.12,.38,.22,.055,'#d83449');backLamp.material=tail;
   box(g,side*.64,.64,-2.19,.14,.08,.04,'#e5d9af');box(g,side*.7,.82,2.16,.16,.045,.02,'#efe8d7');
  }
  box(g,0,.62,-2.225,1.02,.16,.04,'#243c47');for(let i=0;i<7;i++)box(g,-.43+i*.145,.63,-2.25,.033,.12,.02,'#bdcbd0');box(g,0,.47,-2.21,1.45,.045,.06,'#667d87');box(g,0,.46,2.17,1.47,.045,.06,'#667d87');
  const digits=['১২-৪৭৮৬','২৩-৬০২৮','৩৫-১৮৪৯','৪১-৭৩২৬','১৮-৫৯০৭'][variant%5];label(g,'ঢাকা মেট্রো গ',0,.74,2.19,.72,.15,'#f8f1d7','#15394b');label(g,digits,0,.58,2.2,.7,.16,'#f8f1d7','#15394b');const plate=label(g,digits,0,.49,-2.26,.67,.16,'#f7efd9','#1d3c4b');plate.rotation.y=Math.PI;
  // Rear glass defroster, wiper, stop lamp and subtle local decals.
  for(let i=0;i<5;i++)box(g,0,1.1+i*.075,back-.08-i*.065,1.1,.007,.008,'#7b7261');box(g,0,1.58,end+.04,.44,.04,.04,'#b42637');
  label(g,['ধৈর্য ধরুন','জ্যামে আছি','হর্নে কাজ নাই','মামা, সাইড দেন'][variant%4],0,.97,2.145,1.08,.18,'#183e50','#fff0b5');
  if(wagon){for(const side of [-1,1])box(g,side*.58,1.82,.38,.045,.055,1.3,'#99aeb7');box(g,0,1.1,1.9,.72,.025,.025,'#253e47')}
  // Sparse lower-body dust and fine scratches, kept separate from sharp text.
  for(let i=0;i<12;i++){const side=i%2?1:-1,z=-.7+(i%6)*.28;box(g,side*.966,.56+(i%3)*.045,z,.012,.012,.08+(i%3)*.05,i%3?'#a5a699':'#6b7777')}
  return{g,wheels,length:4.5,width:2.04,type:'car'};
 }
 return{create};
}
