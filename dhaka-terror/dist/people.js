// Original lightweight crowd models; references inform clothing, not individual likenesses.
export function createPeople(T,{mat}){
 const sphere=new T.SphereGeometry(1,12,8),tube=new T.CylinderGeometry(.85,1,1,9);
 const sharedGeometries=new Set([sphere,tube]),sharedMaterials=new Set(),clothCache=new Map();
 const palette=['#b73577','#287ca7','#e2af37','#767db4','#368979','#e16e55','#eee4cc','#31364b','#ea7895','#6d479a','#62a5a0','#bf663d','#8b293e','#adc15c','#4c69b0','#d895be'];
 function fabric(index,pattern=0){const color=palette[((index%16)+16)%16],key=color+pattern;if(clothCache.has(key))return clothCache.get(key);const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=color;x.fillRect(0,0,256,256);x.strokeStyle='#fff3d31a';x.lineWidth=1;for(let j=0;j<256;j+=4){x.beginPath();x.moveTo(0,j);x.lineTo(256,j);x.stroke()}
  if(pattern===1){for(let y=20;y<256;y+=52)for(let xx=20;xx<256;xx+=52){for(let p=0;p<5;p++){const a=p*Math.PI*2/5;x.fillStyle='#f6dca7';x.beginPath();x.ellipse(xx+Math.cos(a)*5,y+Math.sin(a)*5,5,2.5,a,0,Math.PI*2);x.fill()}x.fillStyle='#a82c5c';x.beginPath();x.arc(xx,y,2,0,Math.PI*2);x.fill()}}
  if(pattern===2){for(let j=0;j<256;j+=32){x.fillStyle='#19324b99';x.fillRect(j,0,11,256);x.fillRect(0,j,256,11);x.fillStyle='#f5dbb966';x.fillRect(j+14,0,2,256);x.fillRect(0,j+14,256,2)}}
  const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;const m=new T.MeshStandardMaterial({map:texture,roughness:.98,side:T.DoubleSide});sharedMaterials.add(m);clothCache.set(key,m);return m;
 }
 function ellipsoid(g,x,y,z,sx,sy,sz,material){const m=new T.Mesh(sphere,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;g.add(m);return m}
 function limb(g,x,y,z,length,r,material){const joint=new T.Group();joint.position.set(x,y,z);g.add(joint);const m=new T.Mesh(tube,material);m.position.y=-length/2;m.scale.set(r,length,r);m.castShadow=true;joint.add(m);return joint}
 function drape(g,top,bottom,upper,lower,depth,material,phase=0){const positions=[],uv=[],indices=[],rings=7,segments=24;for(let row=0;row<=rings;row++){const t=row/rings,y=top+(bottom-top)*t,w=upper+(lower-upper)*t;for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,fold=1+Math.sin(a*9+phase)*.045*t;positions.push(Math.cos(a)*w*fold,y,Math.sin(a)*depth*(.8+t*.2)*fold);uv.push(i/segments,t)}}for(let r=0;r<rings;r++)for(let i=0;i<segments;i++){const a=r*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,a+1,b,b+1)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new T.Mesh(geo,material);mesh.castShadow=true;g.add(mesh);return mesh}
 function person(parent,x,z,index,uniform=false){const kind=uniform?8:((index%9)+9)%9,color=(Math.abs(index)*7+Math.floor(Math.abs(index)/9))%16,g=new T.Group();g.position.set(x,.37,z);const height=.95+(Math.abs(index)%5)*.025;g.scale.set(height,height,height);parent.add(g);
  const skin=mat(['#b37c57','#ca936c','#9c684b','#d3a07c'][Math.abs(index)%4]),hair=mat('#292b30'),cloth=uniform?mat('#7eacc1'):fabric(color,kind<3?1:0),contrast=fabric(color+3,1),pants=uniform?mat('#23394f'):kind===6?fabric(1,0):mat(['#354052','#4b5363','#2d5678','#6e6254'][Math.abs(index)%4]);
  const legs=[];
  for(const side of [-1,1]){const leg=limb(g,side*.105,.82,0,.37,.075,pants);const knee=limb(leg,0,-.37,0,.35,.06,pants);ellipsoid(knee,0,-.35,-.065,.076,.055,.145,mat(kind<4?'#8c6f51':'#2d3540'));legs.push(leg)}
  drape(g,1.34,.81,.225,.19,.135,cloth);ellipsoid(g,0,1.29,0,.25,.12,.14,cloth);ellipsoid(g,0,1.405,0,.065,.085,.062,skin);
  const head=ellipsoid(g,0,1.595,-.025,.135,.185,.13,skin);ellipsoid(g,0,1.58,-.158,.031,.044,.045,skin);for(const side of [-1,1]){ellipsoid(g,side*.137,1.6,-.015,.025,.043,.027,skin);ellipsoid(g,side*.049,1.635,-.144,.027,.013,.008,mat('#efe7d6'));ellipsoid(g,side*.049,1.635,-.152,.012,.012,.006,mat('#292a2c'));ellipsoid(g,side*.05,1.665,-.138,.034,.009,.008,hair)}ellipsoid(g,0,1.53,-.145,.038,.007,.008,mat('#80534a'));
  const hairVariant=Math.floor(Math.abs(index)/9)%3;
  const covered=kind===1||(kind===0&&hairVariant===0)||(kind===2&&hairVariant===1);
  if(covered){ellipsoid(g,0,1.635,.025,.173,.202,.155,contrast); // Head wrap behind the visible face.
   const scarf=drape(g,1.5,1.16,.15,.255,.175,contrast);scarf.position.z=.035;ellipsoid(g,0,1.31,-.12,.23,.08,.055,contrast);
  }else{ellipsoid(g,0,1.72,.005,.143,.085,.135,hair);if(kind===3||kind===5)ellipsoid(g,0,1.49,-.03,.116,.07,.1,hair);}
  const arms=[];for(const side of [-1,1]){const arm=limb(g,side*.26,1.3,0,.27,.066,cloth);arm.rotation.z=side*.08;const forearm=limb(arm,0,-.27,0,.25,.05,kind===6?skin:cloth);forearm.rotation.x=-.1;ellipsoid(forearm,0,-.275,-.008,.046,.068,.031,skin);arms.push(arm)}
  if(kind===0){ // Floral salwar kameez with contrasting salwar and dupatta.
   drape(g,1.07,.42,.2,.29,.16,cloth);const tail=drape(g,1.35,.6,.06,.08,.045,contrast);tail.position.set(-.2,0,-.14);
  }else if(kind===1){ // Embroidered abaya, with a shaped full-length hem.
   drape(g,1.29,.13,.23,.34,.19,fabric(color===6?7:color,1));
  }else if(kind===2){ // Long printed tunic and wrapped scarf.
   drape(g,1.12,.27,.2,.29,.16,cloth);
  }else if(kind===3){ // Panjabi and pajama.
   drape(g,1.16,.48,.21,.25,.15,cloth);for(let i=0;i<4;i++)ellipsoid(g,0,1.25-i*.07,-.145,.012,.012,.007,mat('#ebd7a7'));
  }else if(kind===4){ // Shirt and checked lungi.
   drape(g,.84,.13,.2,.255,.16,fabric(color+1,2));
  }else if(kind===5){ // Office blazer, shirt front and cross-body accessories.
   const placket=ellipsoid(g,0,1.09,-.14,.1,.24,.025,fabric(6,0));for(const side of [-1,1]){const lapel=ellipsoid(g,side*.1,1.23,-.15,.055,.16,.025,cloth);lapel.rotation.z=side*.3;}
   for(const side of [-1,1])ellipsoid(g,side*.05,1.635,-.16,.039,.023,.012,mat('#263b47'));
  }else if(kind===6){ // T-shirt/hoodie and jeans, with seams and a hood.
   ellipsoid(g,0,1.32,.12,.16,.14,.09,cloth);
  }else if(kind===7){ // Saree silhouette with pleats and diagonal pallu.
   drape(g,.94,.12,.2,.285,.17,cloth);const pallu=ellipsoid(g,0,1.15,-.16,.085,.31,.035,contrast);pallu.rotation.z=-.5;const back=drape(g,1.3,.42,.065,.1,.035,contrast);back.position.set(.22,0,.15);
  }else{ // Casual collared shirt, trousers and shoulder bag.
   for(let i=0;i<5;i++)ellipsoid(g,0,1.26-i*.08,-.142,.01,.01,.007,mat('#e5d9bc'));
  }
  if(!covered&&[0,2,7].includes(kind)){
   if(hairVariant===0){ // A segmented braid hangs down the back.
    ellipsoid(g,0,1.58,.11,.13,.19,.07,hair);
    for(let braid=0;braid<7;braid++)ellipsoid(g,(braid%2?.018:-.018),1.44-braid*.065,.145,.043-braid*.002,.05,.04,hair);
    ellipsoid(g,0,1.02,.145,.035,.018,.035,mat('#d5a64a'));
   }else if(hairVariant===1){ // Tied ponytail with curved overlapping locks.
    ellipsoid(g,0,1.68,.14,.065,.065,.06,mat('#c86c94'));
    for(let lock=0;lock<5;lock++)ellipsoid(g,0,1.65-lock*.075,.2+Math.sin(lock*.6)*.06,.068-lock*.005,.09,.055,hair);
   }else{ // Uncovered shoulder-length hair.
    ellipsoid(g,0,1.49,.11,.145,.27,.075,hair);for(const side of [-1,1])ellipsoid(g,side*.13,1.46,.02,.045,.2,.055,hair);
   }
  }
  // Bags, shoes and a few phones make silhouettes vary from front, back and side.
  if(!uniform&&index%3===0){ellipsoid(g,.29,.88,.05,.1,.14,.06,mat('#755245'));const strap=ellipsoid(g,.16,1.19,.13,.015,.3,.02,mat('#57433d'));strap.rotation.z=.33}
  if(!uniform&&index%5===0){const phone=ellipsoid(arms[1],0,-.46,-.06,.033,.057,.009,mat('#283b49'));}
  // Small anatomical details share sphere geometry and cached materials.
  for(const side of [-1,1]){
   ellipsoid(g,side*.142,1.6,-.025,.014,.025,.014,mat('#8d604c'));
   const hand=arms[side>0?1:0].children.find(o=>o.isGroup);
   if(hand){for(let finger=0;finger<4;finger++)ellipsoid(hand,-.024+finger*.016,-.32,-.01,.008,.04-(finger%2)*.005,.009,skin);ellipsoid(hand,side*.043,-.28,-.018,.013,.026,.013,skin)}
   const calf=legs[side>0?1:0].children.find(o=>o.isGroup);
   if(calf){ellipsoid(calf,0,-.385,-.067,.078,.015,.148,mat('#d0c4aa'));for(let lace=0;lace<3;lace++)ellipsoid(calf,0,-.36,-.07-lace*.025,.045,.007,.008,mat('#a9b4b9'))}
  }
  ellipsoid(g,0,1.55,-.158,.023,.005,.005,mat('#a87061'));
  if(!covered){for(let lock=0;lock<4;lock++){const tuft=ellipsoid(g,-.08+lock*.045,1.755,.005,.039,.055,.09,hair);tuft.rotation.z=(lock-1.5)*.15}}
  return{group:g,arm:arms[1],left:arms[0],legs,kind};
 }
 return{person,sharedGeometries,sharedMaterials};
}
