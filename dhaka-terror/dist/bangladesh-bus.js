// Original lightweight local-bus meshes and procedural liveries, informed by references.
export function createBangladeshBusFactory(T,{box,label,mat,person}){
 const silver=new T.MeshStandardMaterial({color:'#b4c1c5',metalness:.8,roughness:.32});
 const rubber=new T.MeshStandardMaterial({color:'#20292d',roughness:.95});
 const windowMat=new T.MeshStandardMaterial({color:'#326571',metalness:.35,roughness:.2,transparent:true,opacity:.68,side:T.DoubleSide});
 const black=mat('#203239'),rim=mat('#74838a');
 const palettes=[{main:'#f2c52b',lower:'#153e77',stripe:'#d13e37',accent:'#67a948',name:'মামার দোয়া',line:'ব্রেক আছে, শান্তি নাই!'},{main:'#d66c9d',lower:'#223e69',stripe:'#eee4c3',accent:'#156c76',name:'জ্যামবিলাস পরিবহন',line:'তাড়া থাকলে হেঁটে যান'},{main:'#eee8d6',lower:'#188053',stripe:'#edc72d',accent:'#a5262c',name:'লেট লতিফ এক্সপ্রেস',line:'সময় লাগে, গল্প জমে'},{main:'#48b7bd',lower:'#155268',stripe:'#e85835',accent:'#ffe14c',name:'স্বপ্নের লোকাল',line:'সিট নাই, আশা আছে'}];
 const paintCache=new Map();
 function paint(variant){const key=variant%4;if(paintCache.has(key))return paintCache.get(key);const p=palettes[key];const c=document.createElement('canvas');c.width=2048;c.height=512;const x=c.getContext('2d');x.fillStyle=p.main;x.fillRect(0,0,2048,512);x.fillStyle=p.lower;x.fillRect(0,344,2048,168);x.fillStyle=p.stripe;x.fillRect(0,200,2048,50);x.fillStyle=p.accent;x.beginPath();x.moveTo(0,260);x.lineTo(1350,260);x.lineTo(1820,78);x.lineTo(2048,78);x.lineTo(1580,309);x.lineTo(0,309);x.closePath();x.fill();
  let seed=324+variant*31;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
  // Fine scratches, exposed primer, rust, grubby seams and scraped wheel-level paint.
  for(let i=0;i<850;i++){const px=random()*2048,py=270+random()*242;x.fillStyle=['#b6b1a1','#734a37','#e3d1ae','#46524f'][i%4];x.globalAlpha=.25+random()*.5;x.fillRect(px,py,3+random()*30,1+random()*3)}x.globalAlpha=1;
  for(let i=0;i<85;i++){x.strokeStyle='rgba(230,223,198,.5)';x.lineWidth=1+random();const xx=random()*2048,yy=120+random()*350;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+30+random()*170,yy-3+random()*6);x.stroke()}
  for(let i=1;i<8;i++){x.strokeStyle='#3c443c60';x.lineWidth=2;x.strokeRect(i*242,280,230,207);x.fillStyle='#263f45';x.fillRect(i*242+192,310,16,8)}
  const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;const m=new T.MeshStandardMaterial({map:tex,roughness:.58,metalness:.17,side:T.DoubleSide});paintCache.set(key,m);return m;
 }
 function cylinder(parent,x,y,z,r,h,material,sides=16){const m=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),material);m.position.set(x,y,z);parent.add(m);m.castShadow=true;return m}
 function rod(parent,a,b,r=.025,material=silver){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),7),material);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(m);return m}
 function roundedPanel(parent,w,h,depth,x,y,z,material,r=.12){const s=new T.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const mesh=new T.Mesh(new T.ExtrudeGeometry(s,{depth,bevelEnabled:false,curveSegments:5}),material);const positions=mesh.geometry.attributes.position,coords=[];for(let i=0;i<positions.count;i++)coords.push(positions.getX(i)/w+.5,positions.getY(i)/h+.5);mesh.geometry.setAttribute('uv',new T.Float32BufferAttribute(coords,2));mesh.position.set(x,y,z);mesh.castShadow=true;parent.add(mesh);return mesh}
 function sidePanel(g,side,material,player){const s=new T.Shape();s.moveTo(-4.56,.65);s.lineTo(-3.74,.65);s.absarc(-3,.68,.74,Math.PI,0,true);s.lineTo(2.26,.65);s.absarc(3,.68,.74,Math.PI,0,true);s.lineTo(4.56,.65);s.lineTo(4.56,2.06);s.lineTo(-4.56,2.06);s.closePath();
  // The player entrance is a real opening in the left side body, not a painted door.
  if(player&&side===-1){const hole=new T.Path();hole.moveTo(1.04,.66);hole.lineTo(2.26,.66);hole.lineTo(2.26,2.05);hole.lineTo(1.04,2.05);hole.closePath();s.holes.push(hole)}
  const geo=new T.ShapeGeometry(s,8),pos=geo.attributes.position,uv=[];for(let i=0;i<pos.count;i++)uv.push((pos.getX(i)+4.6)/9.2,(pos.getY(i)-.6)/1.5);geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));const mesh=new T.Mesh(geo,material);mesh.rotation.y=side*Math.PI/2;if(side===-1)mesh.scale.x=-1;mesh.position.x=side*1.455;mesh.castShadow=true;g.add(mesh);
 }
 function wheel(g,x,z){const group=new T.Group();group.position.set(x,.68,z);g.add(group);const tire=new T.Mesh(new T.TorusGeometry(.48,.15,9,24),rubber);tire.rotation.y=Math.PI/2;group.add(tire);const drum=cylinder(group,0,0,0,.36,.27,rim,16);drum.rotation.z=Math.PI/2;const hub=cylinder(group,Math.sign(x)*.17,0,0,.13,.065,silver,12);hub.rotation.z=Math.PI/2;for(let j=0;j<8;j++){const a=j*Math.PI/4;const lug=cylinder(group,Math.sign(x)*.18,Math.sin(a)*.2,Math.cos(a)*.2,.022,.04,silver,6);lug.rotation.z=Math.PI/2}wheels.push(group)}
 let wheels=[];
 function create({variant=0,player=false}={}){wheels=[];const g=new T.Group(),p=palettes[variant%4],bodyMat=paint(variant);
  box(g,0,.72,0,2.4,.26,8.8,'#29373b');box(g,0,1.14,0,2.5,.17,8.8,'#53544a');
  for(const side of [-1,1])sidePanel(g,side,bodyMat,player);
  // Rounded corners, gently rolled roof and front/rear end shells.
  roundedPanel(g,2.88,1.55,.1,0,1.42,4.53,bodyMat,.19);
  roundedPanel(g,2.88,1.55,.1,0,1.42,-4.67,mat(p.main),.23);
  const roofShape=new T.Shape();roofShape.moveTo(-1.46,3.38);roofShape.quadraticCurveTo(-1.46,3.68,-1.15,3.73);roofShape.quadraticCurveTo(0,3.83,1.15,3.73);roofShape.quadraticCurveTo(1.46,3.68,1.46,3.38);roofShape.closePath();const roof=new T.Mesh(new T.ExtrudeGeometry(roofShape,{depth:9.12,bevelEnabled:false,curveSegments:8}),mat(variant===2?'#d7ded6':p.main));roof.position.z=-4.56;roof.castShadow=true;g.add(roof);
  for(const side of [-1,1]){
   box(g,side*1.46,2.12,0,.08,.12,9.12,'#a9aca3');box(g,side*1.46,3.39,0,.08,.095,9.05,'#273c40');
   const windowCenters=player&&side===-1?[-3.82,-.38,.8,1.98,3.16]:[-3.82,-2.64,-1.46,-.28,.9,2.08,3.26];for(let i=0;i<windowCenters.length;i++){const z=windowCenters[i];
    // Black gaskets, aluminum dividers and a partly slid-open pane.
    box(g,side*1.46,2.76,z,.055,1.17,1.13,'#263c40');const pane=box(g,side*1.5,2.77,z,.025,1.03,.99,'#326571');pane.material=windowMat;
    box(g,side*1.52,2.77,z+.04,.025,1.06,.035,'#bdc8c2');box(g,side*1.53,2.47,z,.025,.035,1.02,'#b3beb9');
    if(i%3===1){box(g,side*1.54,2.76,z+.27,.024,.96,.42,'#183439');box(g,side*1.55,2.29,z+.27,.045,.06,.2,'#c6c8b6')}
    if(i%2===0){const sticker=label(g,'লোকাল',side*1.555,3.05,z,.58,.2,'#173f45','#fff1bd');sticker.rotation.y=side*Math.PI/2;}
   }
   for(const z of [-3,3]){wheel(g,side*1.48,z);const arch=new T.Mesh(new T.TorusGeometry(.75,.045,6,20,Math.PI),mat(p.lower));arch.rotation.y=Math.PI/2;arch.position.set(side*1.48,.68,z);g.add(arch)}
   // Rubber rub strips and small compartment handles below the painted side name.
   box(g,side*1.48,1.06,.7,.035,.055,4,'#2c3b40');for(const z of [-1.6,.1,1.8]){box(g,side*1.48,.87,z,.035,.31,1.4,'#48545a');box(g,side*1.51,.98,z,.04,.035,.15,'#b6b9ac')}
   const title=label(g,player?'মামার দোয়া পরিবহন':p.name,side*1.49,1.76,.55,5.2,.46,p.main,'#94232b');title.rotation.y=side*Math.PI/2;
   rod(g,[side*1.3,3.15,-4.48],[side*1.85,3.15,-4.7],.04);rod(g,[side*1.85,3.15,-4.7],[side*1.85,2.65,-4.7],.04);roundedPanel(g,.26,.55,.12,side*1.85,2.74,-4.77,black,.07);
  }
  // End windows, destination panels, wipers and engine ventilation.
  roundedPanel(g,2.57,1.18,.045,0,2.79,-4.66,windowMat,.15);roundedPanel(g,2.5,1.04,.045,0,2.82,4.63,windowMat,.12);
  rod(g,[-.87,2.22,-4.73],[-.3,2.8,-4.73],.019,black);rod(g,[.65,2.22,-4.73],[1.05,2.8,-4.73],.019,black);
  const frontName=label(g,player?'মামার দোয়া':p.name,0,3.49,-4.72,2.65,.38,'#173c46','#fff0a2');frontName.rotation.y=Math.PI;
  label(g,player?'মামার দোয়া':p.name,0,2.81,4.7,2.47,.64,'#15394c','#ffe44c');label(g,player?'ব্রেক আছে, শান্তি নাই!':p.line,0,1.71,4.7,2.54,.45,p.main,'#8d182d');
  label(g,'ঢাকা মেট্রো ব ১৩-২০২৬',0,.86,4.74,1.65,.28,'#f1e4b4','#203c45');label(g,'থামুন',-1.05,.86,4.74,.51,.25,'#fff0cc','#293f41');
  for(const side of [-1,1]){box(g,side*1.14,1.2,4.69,.22,.49,.05,'#392c31');for(let j=0;j<3;j++)box(g,side*1.14,1.36-j*.16,4.73,.17,.13,.03,['#ef3c3e','#f6b63c','#d8ddd3'][j]);
   roundedPanel(g,.59,.27,.05,side*.91,1.17,-4.75,black,.06);for(let k=0;k<2;k++){const lamp=cylinder(g,side*.91+(k-.5)*.23,1.17,-4.79,.095,.04,mat('#fff1c1'),12);lamp.rotation.x=Math.PI/2}
   for(let j=0;j<6;j++)box(g,side*.83,2.08+j*.06,4.69,.56,.024,.035,'#314349');}
  for(let j=0;j<5;j++)box(g,0,1.45+j*.075,-4.73,1.18,.035,.06,'#2c4247');box(g,0,.59,4.69,2.96,.18,.2,'#3d4850');box(g,0,.63,-4.72,2.94,.2,.2,variant===2?'#9f3436':p.lower);
  for(let i=0;i<3;i++){const vent=roundedPanel(g,.62,.11,.58,0,3.75,-2+i*2.3,mat('#78858a'),.05);}
  const door=new T.Group();door.position.set(-1.5,1.81,-1.65);g.add(door);box(door,0,0,0,.05,2.12,1.12,'#19343b');const doorGlass=box(door,-.03,.4,0,.015,1.15,.91,'#628d92');doorGlass.material=windowMat;
  for(let i=0;i<3;i++)box(g,-1.49-i*.16,.39+i*.19,-1.65,.6,.13,1.13,'#8f9691');rod(g,[-1.68,.65,-2.2],[-1.68,2.3,-2.2],.025,silver);
  let helper=null;if(player){helper=person(g,-1.76,-1.62,'#c58b45',true);helper.group.position.y=.53;helper.group.rotation.y=-Math.PI/2;helper.arm.rotation.z=-.6;}
  const driver=person(g,.72,-3.72,'#d3d6c6');driver.group.position.y=.65;driver.group.rotation.y=Math.PI;box(g,.72,1.4,-3.5,.64,.65,.23,'#334951');
  const steering=new T.Mesh(new T.TorusGeometry(.25,.035,6,16),black);steering.position.set(.72,2,-4.15);steering.rotation.x=.65;g.add(steering);
  for(let i=0;i<(player?4:2);i++){const passenger=person(g,i%2?.72:-.72,-1.5+i*1.25,['#a15b72','#5a7eac','#d2b15c'][i%3]);passenger.group.scale.setScalar(.8);passenger.group.position.y=1.02;box(g,i%2?.72:-.72,1.5,-1.2+i*1.25,.65,.7,.16,'#3c6059')}
  return{group:g,g,wheels,door,helper,length:9.45,width:3.05,type:'bus'};
 }
 return{create};
}
