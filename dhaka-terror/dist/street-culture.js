import { createPeople } from './people.js';
// Fictional posters and original procedural clothing, designed for this game.
export function createStreetCulture(T,{box,cylinder,label,mat}){
 const people=createPeople(T,{mat});
 const sharedMaterials=new Set(),posterCache=new Map();
 const suppliedPosters=[
  {file:'matha-noshto.png',aspect:597/335},
  {file:'noshto-chele.png',aspect:450/338},
  {file:'noshto-jibon.png',aspect:800/450},
  {file:'ek-mon-ek-pran.png',aspect:866/1390}
 ];
 const loader=new T.TextureLoader();
 const suppliedMaterials=suppliedPosters.map((asset,i)=>{
  const material=new T.MeshBasicMaterial({color:'#ffffff',side:T.DoubleSide,toneMapped:false});
  sharedMaterials.add(material);
  loader.load(new URL('./assets/posters/'+asset.file,import.meta.url).href,texture=>{texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;material.map=texture;material.needsUpdate=true},undefined,()=>{material.map=posterMaterial('film',i%3).map;material.needsUpdate=true});return material;
 });
 const films=[{title:['জ্যামের','জামাই'],tag:'এক রাস্তা • হাজার নাটক',color:'#b41557',accent:'#ffe337',cast:'অভিনয়ে: মামা ও ভাগ্নে'},{title:['মিরপুরের','মহারাজা'],tag:'এই শুক্রবার • জমবে শহর',color:'#194db4',accent:'#ffbe37',cast:'একটি কাল্পনিক বাংলা ছবি'},{title:['শেষ বাসের','ভালোবাসা'],tag:'টিকিট কাটুন • হাসতে থাকুন',color:'#04776d',accent:'#ffdf77',cast:'পরিচালনায়: জ্যাম উদ্দিন'}];
 function posterMaterial(kind,id){const key=kind+id;if(posterCache.has(key))return posterCache.get(key);const c=document.createElement('canvas');c.width=1024;c.height=1536;const x=c.getContext('2d');x.scale(2,2);const film=films[((id%3)+3)%3];x.fillStyle=kind==='film'?film.color:['#ffe34b','#fff3ce','#daf8ee'][((id%3)+3)%3];x.fillRect(0,0,512,768);x.strokeStyle=kind==='film'?'#ffe5ad':'#124556';x.lineWidth=14;x.strokeRect(12,12,488,744);x.textAlign='center';x.textBaseline='middle';
 const text=(s,y,size,color)=>{x.fillStyle=color;x.font=`800 ${size}px "Noto Sans Bengali", sans-serif`;while(x.measureText(s).width>458&&size>16){size-=2;x.font=`800 ${size}px "Noto Sans Bengali", sans-serif`}x.fillText(s,256,y)};
 if(kind==='film'){
  text('শুভ মুক্তি',62,43,'#fff7d0');x.fillStyle=film.accent;x.beginPath();x.arc(256,290,160,0,Math.PI*2);x.fill();
  // Two illustrated fictional film leads, not portraits of real actors.
  for(let i=0;i<2;i++){const cx=166+i*175,cy=290+i*12;x.fillStyle=i?'#24bdb1':'#183c65';x.beginPath();x.moveTo(cx-84,447);x.quadraticCurveTo(cx-83,350,cx,350);x.quadraticCurveTo(cx+83,350,cx+84,447);x.fill();x.fillStyle=i?'#bf8058':'#d7a078';x.beginPath();x.ellipse(cx,cy,49,62,0,0,Math.PI*2);x.fill();x.fillStyle='#192b39';x.beginPath();x.ellipse(cx,cy-41,51,24,0,Math.PI,Math.PI*2);x.fill();if(i){x.strokeStyle='#291f33';x.lineWidth=18;x.beginPath();x.moveTo(cx-44,cy-28);x.lineTo(cx-50,cy+60);x.moveTo(cx+45,cy-28);x.lineTo(cx+52,cy+62);x.stroke()}x.fillStyle='#20313c';x.fillRect(cx-29,cy-7,22,12);x.fillRect(cx+8,cy-7,22,12);x.fillRect(cx-9,cy-3,20,3);x.strokeStyle='#6d3535';x.lineWidth=3;x.beginPath();x.arc(cx,cy+24,13,.15,Math.PI-.15);x.stroke()}
  text(film.title[0],492,80,'#fff9dc');text(film.title[1],577,86,film.accent);text(film.tag,662,30,'#fff6db');text(film.cast,713,24,'#ffe9b2');
 }else{const copies=[['জ্যাম কমান','হাসি বাড়ান','হর্নে নয়, ধৈর্যে জয়','ঢাকা টেরর • নাগরিক বার্তা'],['চা খেয়ে যান','জ্যাম তো থাকবেই!','মামার চায়ের আড্ডা','চা গরম • মেজাজ ঠান্ডা'],['টু-লেট','বারান্দায় জ্যাম ভিউ','হর্নের শব্দ ফ্রি!','কাল্পনিক বিজ্ঞাপন']];const tuition=[['পড়াতে চাই','জ্যামে ধৈর্য শেখাই','বিষয়: হর্ন ছাড়া বাঁচা','যোগাযোগ: পাশের চায়ের দোকান'],['পড়াতে চাই','দরদামের অঙ্ক','সিএনজি ভাড়ায় দুর্বল?','ভর্তি চলছে • হাসি ফ্রি!'],['পড়াতে চাই','সময়মতো বের হওয়া','প্রথম ক্লাস: কাল থেকে!','শুধুই মজা • কাল্পনিক বিজ্ঞাপন']];const a=(kind==='tuition'?tuition:copies)[((id%3)+3)%3];text(a[0],118,72,'#123d53');text(a[1],216,51,'#bf2858');x.fillStyle='#e85146';x.beginPath();x.arc(256,397,108,0,Math.PI*2);x.fill();x.fillStyle='#fff2bf';x.font='bold 125px sans-serif';x.fillText(id%3===1?'☕':'!',256,410);text(a[2],582,40,'#164c58');text(a[3],687,28,'#144557')}
 const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;const m=new T.MeshBasicMaterial({map:tex,side:T.DoubleSide,toneMapped:false});posterCache.set(key,m);sharedMaterials.add(m);return m}
 function poster(p,kind,id,x,y,z,w,h,rotation=0){
  let material,pw=w,ph=h;
  if(kind==='film'){
   const index=((id%4)+4)%4;material=suppliedMaterials[index];const aspect=suppliedPosters[index].aspect;
   if(w/h>aspect)pw=h*aspect;else ph=w/aspect;
   // Paper backing fills the mount while the image keeps its source aspect ratio.
   const backing=new T.Mesh(new T.PlaneGeometry(pw+.05,ph+.05),mat('#f9e9c9'));backing.position.set(x,y,z);backing.rotation.y=rotation;p.add(backing);
  }else material=posterMaterial(kind,((id%3)+3)%3);
  material.side=T.FrontSide;const m=new T.Mesh(new T.PlaneGeometry(pw,ph),material);m.position.set(x+Math.sin(rotation)*.015,y,z+Math.cos(rotation)*.015);m.rotation.y=rotation;p.add(m);return m;
 }
 function pedestrian(parent,x,z,index){return people.person(parent,x,z,index)}
 function sergeant(parent,x,z){
  const officer=people.person(parent,x,z,8,true),g=officer.group;g.position.y=.12;
  // Tailored pale-blue shirt, navy trousers, high-vis vest and white peaked cap.
  for(const side of [-1,1]){box(g,side*.12,1.13,-.15,.15,.13,.035,'#7aa3b7');box(g,side*.12,1.21,-.173,.16,.025,.014,'#d4e1e4');box(g,side*.25,1.33,0,.08,.045,.17,'#233b53');box(g,side*.25,1.36,-.02,.04,.015,.09,'#dbbf53');}
  for(const side of [-1,1]){const vest=box(g,side*.115,1.13,-.173,.19,.4,.035,'#d5e63d');for(const y of [1.02,1.25])box(g,side*.115,y,-.2,.19,.035,.012,'#eef4ed')}
  box(g,0,1.14,.15,.39,.42,.035,'#cddf35');box(g,0,1.12,.176,.36,.04,.012,'#eef4ed');box(g,0,.85,0,.4,.055,.28,'#1a2c3a');box(g,0,.85,-.151,.055,.045,.015,'#b2a56a');box(g,.23,.9,.04,.08,.16,.08,'#263b45');
  cylinder(g,0,1.79,0,.158,.095,'#f2f0df',16);box(g,0,1.75,-.13,.29,.035,.21,'#273d51');box(g,0,1.8,-.154,.055,.04,.018,'#d0b951');
  label(g,'ট্রাফিক',0,1.13,-.207,.34,.12,'#d5e63d','#173c4d');
  const signal=officer.arm;box(signal,0,-.53,0,.075,.14,.07,'#f1eee3');
  return{group:g,signal};
 }
 function animateCrossings(segments,time){
  for(const s of segments){const cycle=((time+s.index*7)%38+38)%38,walking=cycle<21;
   for(const c of s.group.userData.crossers||[]){const progress=Math.min(cycle/21,1);c.person.group.position.x=c.from+(c.to-c.from)*progress;c.person.group.position.y=Math.abs(c.person.group.position.x)>(s.group.userData.roadHalfWidth||11)?.37:.12;c.person.group.rotation.y=c.to>c.from?-Math.PI/2:Math.PI/2;const swing=walking?Math.sin(time*5+c.phase)*.35:0;c.person.arm.rotation.x=swing;c.person.left.rotation.x=-swing;c.person.legs.forEach((leg,i)=>leg.rotation.x=swing*(i?1:-1));}
   for(const cop of s.group.userData.sergeants||[]){cop.signal.rotation.z=walking?2.7:1.5;}
  }
 }
 function crossingAhead(segments,x,z,heading=-1,halfLength=4.65){
  for(const s of segments)for(const c of s.group.userData.crossers||[]){const p=c.person.group.position;const ahead=(s.group.position.z+p.z-z)*heading;if(Math.abs(p.x)<10.7&&Math.abs(p.x-x)<1.7&&ahead>=-halfLength&&ahead<halfLength+5)return true}
  return false;
 }
 function decorate(parent,index,type){
 parent.userData.crossers=[];parent.userData.sergeants=[];
 // Two people cross together at the zebra, then wait safely on the opposite footpath.
 for(let i=0;i<2;i++){
  const from=index%2===0?-12.2:12.2,to=-from;
  const p=pedestrian(parent,from,-110-i*1.25,index*2+i+1);
  parent.userData.crossers.push({person:p,from,to,phase:i});
 }
 // Mounted beyond the widened road edge, with visible posts and pavement feet.
 const crossingSign=new T.Group();crossingSign.position.set(-13.3,0,-99);parent.add(crossingSign);
 for(const x of [-1.4,1.4]){box(crossingSign,x,1.65,0,.09,2.6,.09,'#74888b');box(crossingSign,x,.45,0,.35,.16,.35,'#b0aea1');}
 box(crossingSign,0,2.84,0,3.9,.91,.09,'#586b6e');label(crossingSign,'পথচারীকে আগে যেতে দিন',0,2.84,.06,3.8,.8,'#fff5d9','#163d53');
 // Marked pedestrian crossing and a stop approach line.
 for(const side of [-1,1])for(let stripe=0;stripe<7;stripe++)box(parent,side*5.6,.11,-108-stripe*.85,9.5,.025,.48,'#fff5d6');
 box(parent,-5.6,.11,-103,9.5,.025,.22,'#fff5d6');

 for(const side of [-1,1]){
  for(let j=0;j<4;j++){const z=-12-j*40;const panel=poster(parent,j%2===0?'tuition':'fun',index+Math.floor(j/2),side*10.52,4.5,z+.13,1.6,2.4);panel.rotation.y=side>0?-.25:.25;}
  // Street-facing wall poster galleries next to storefronts.
  for(let j=0;j<3;j++){const wall=new T.Group();wall.position.set(side*16.65,0,-35-j*48);wall.rotation.y=-side*Math.PI/2;parent.add(wall);box(wall,0,1.95,0,5.5,3.4,.25,'#e9d3b5');poster(wall,'film',index+j, -1.32,2,.15,2.35,3.1);poster(wall,'fun',index+j,1.32,2,.15,2.35,3.1)}
  const roadSign=new T.Group();roadSign.position.set(side*12.6,0,-43);parent.add(roadSign);cylinder(roadSign,0,2.4,0,.075,4.8,'#b5c7cf');
  const signCanvas=document.createElement('canvas');signCanvas.width=signCanvas.height=512;const c=signCanvas.getContext('2d');c.fillStyle='#fffaf0';c.beginPath();c.arc(256,256,239,0,Math.PI*2);c.fill();c.strokeStyle='#cf263b';c.lineWidth=38;c.stroke();c.fillStyle='#102f43';c.font='bold 220px "Noto Sans Bengali",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('৩০',256,270);const tex=new T.CanvasTexture(signCanvas);tex.colorSpace=T.SRGBColorSpace;const sign=new T.Mesh(new T.PlaneGeometry(1.65,1.65),new T.MeshBasicMaterial({map:tex,transparent:true,toneMapped:false,side:T.FrontSide}));sign.position.set(0,4.15,.06);roadSign.add(sign);label(roadSign,'ধীরে চলুন',0,3, .08,2.2,.6,'#fff8df','#14384d');
  const warning=new T.Group();warning.position.set(side*13.3,0,-112);warning.rotation.y=side>0?Math.PI:0;parent.add(warning);
  for(const dx of [-1.2,1.2]){box(warning,dx,1.8,0,.075,2.9,.075,'#7d8984');box(warning,dx,.45,0,.3,.16,.3,'#b0aea1');}
  box(warning,0,3.22,0,3.4,1.02,.08,'#645d3f');label(warning,side<0?'সামনে বাস স্টপ':'পথচারী পারাপার',0,3.22,.055,3.3,.92,'#ffdc36','#142f42');

 }
 }
 function decorateMetroPier(parent,index,z=0){
  // Flush panels sized to each concrete face; separate front/back artwork avoids mirrored text.
  const number=index+Math.round(-z/35),titles=['মাথা নষ্ট','নষ্ট ছেলে','নষ্ট জীবন','এক মন এক প্রাণ'];
  for(const face of [0,Math.PI]){
   const depth=face===0 ? .81 : -.81;
   poster(parent,'film',number,0,4.45,z+depth,1.9,3.3,face);
   poster(parent,'film',number+1,0,1.85,z+depth,1.9,1.1,face);
   const title=label(parent,titles[((number%4)+4)%4],0,8.07,z+depth,3.75,.25,'#5b1936','#fff0a5');title.rotation.y=face;title.material.side=T.FrontSide;
  }
  for(const side of [-1,1]){poster(parent,'film',number+2,side*1.045,4.55,z,1.42,3.25,side*Math.PI/2);poster(parent,'film',number+3,side*1.045,1.85,z,1.42,1.05,side*Math.PI/2);}

 }

 return{pedestrian,sergeant,decorate,decorateMetroPier,animateCrossings,crossingAhead,sharedGeometries:people.sharedGeometries,sharedMaterials:{has(material){return sharedMaterials.has(material)||people.sharedMaterials.has(material)}}};
}
