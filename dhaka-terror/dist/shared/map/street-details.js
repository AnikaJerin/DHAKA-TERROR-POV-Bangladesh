// Lightweight street boundaries and functional two-phase junction signals.
export function createStreetDetails(T,{box,mat,label}){
 const signals=[],officers=[];
 function walls(parent,index){for(const side of [-1,1])for(let section=0;section<4;section++){if((section+index)%3===0)continue;const z=-22-section*38;
  box(parent,side*20, .65,z,.25,1.2,16,index%2?'#a67a56':'#c5b99c');box(parent,side*20,1.29,z,.4,.16,16,'#756957');
  for(let rail=0;rail<20;rail++)box(parent,side*20,1.9,z-7.5+rail*.78,.055,1.15,.055,'#273b3d');box(parent,side*20,2.42,z,.07,.055,16,'#273b3d');
  for(const dz of [-8,8]){box(parent,side*20,1.15,z+dz,.65,2.2,.65,'#9d7153');box(parent,side*20,2.32,z+dz,.8,.18,.8,'#d1b990')}
 }}
 // Shared masonry and small fittings keep the police boxes detailed without big assets.
 const brickCanvas=document.createElement('canvas');brickCanvas.width=brickCanvas.height=256;const paint=brickCanvas.getContext('2d');paint.fillStyle='#a68d78';paint.fillRect(0,0,256,256);for(let row=0;row<16;row++)for(let col=-1;col<9;col++){paint.fillStyle=['#8c4c39','#99573f','#ad684b','#814634'][(row+col+10)%4];paint.fillRect(col*32+(row%2)*16+1,row*16+1,30,14)}
 const brickMap=new T.CanvasTexture(brickCanvas);brickMap.colorSpace=T.SRGBColorSpace;brickMap.wrapS=brickMap.wrapT=T.RepeatWrapping;brickMap.repeat.set(2,1);const brick=new T.MeshStandardMaterial({map:brickMap,roughness:1});
 function policePost(parent,node,createOfficer,x=0,z=0){
  const g=new T.Group();g.position.set(x,0,z);parent.add(g);
  box(g,0,.28,0,7.8,.4,6.2,'#777b70');for(let i=0;i<8;i++)for(const side of [-1,1])box(g,-3.5+i,.51,side*3.03,.96,.22,.2,i%2?'#c6bfa9':'#34413f');
  const wall=box(g,0,1.72,0,5.7,2.65,4.4,'#98513c');wall.material=brick;
  box(g,0,3.13,0,6.4,.2,5,'#b4beb3');box(g,0,3.48,0,6.45,.55,5.05,'#c4c9b6');
  for(const side of [-1,1]){
   const board=label(g,'ট্রাফিক পুলিশ বক্স',0,3.47,side*2.55,6,.43,'#204d66','#fff4c8');board.rotation.y=side>0?0:Math.PI;
   box(g,side*1.5,2.03,2.24,1.8,1.25,.12,'#c6c7b7');box(g,side*1.5,2.03,2.32,1.56,1.04,.07,'#315b66');
   for(const dx of [-.5,0,.5])box(g,side*1.5+dx,2.03,2.39,.035,1.05,.03,'#a1b3ae');box(g,side*1.5,2.02,2.39,1.58,.035,.03,'#a1b3ae');
   box(g,side*1.5,1.35,2.38,2,.1,.36,'#b9b9a7');
  }
  label(g,node.bn,0,2.83,2.29,2.3,.27,'#a08b6a','#fff3d2');
  box(g,0,1.47,2.25,1,2.18,.13,'#273f46');box(g,0,1.93,2.34,.76,.93,.04,'#6d8e8b');box(g,.34,1.35,2.37,.07,.05,.05,'#d7caae');box(g,0,.5,2.8,1.6,.12,1,'#b1ad98');
  box(g,-2.9,2.45,0,.22,.7,1.15,'#dedacc');const fan=new T.Mesh(new T.CylinderGeometry(.24,.24,.025,16),mat('#657571'));fan.rotation.z=Math.PI/2;fan.position.set(-3.03,2.45,0);g.add(fan);for(let i=0;i<5;i++)box(g,-3.05,2.18+i*.12,.4,.03,.02,.25,'#8d9990');
  for(const xx of [-2.8,2.8]){box(g,xx,.94,2.8,.1,.8,.1,'#213d43');box(g,xx,1.32,2.8,.6,.08,.6,'#b49b6a');}
  const officer=createOfficer(g,3.1,1.5);officer.group.rotation.y=-.35;officer.signal.rotation.z=1.2;officers.push(officer);
  const second=createOfficer(g,-2.1,-1.5);second.group.rotation.y=Math.PI*.8;second.signal.rotation.z=.2;officers.push(second);
  // Tethered cones, a bench, water can and drainage grating ground the booth in its island.
  box(g,-1.6,.85,-2.7,2.6,.12,.5,'#8f7150');box(g,-1.6,1.17,-2.9,2.6,.6,.09,'#8f7150');for(const xx of [-2.5,-.7])box(g,xx,.63,-2.7,.08,.4,.45,'#344d48');
  const bottle=new T.Mesh(new T.CylinderGeometry(.14,.18,.5,10),mat('#95b7b4'));bottle.position.set(1.7,.8,-2.8);g.add(bottle);
  for(const xx of [-3.4,3.4]){box(g,xx,.53,3.1,.45,.08,.45,'#263e42');const cone=new T.Mesh(new T.ConeGeometry(.18,.6,10),mat('#ed833c'));cone.position.set(xx,.85,3.1);g.add(cone);}
  return g;
 }
 function clutter(parent,index){
  // Small, uneven pavement details; nothing is scattered into a driving lane.
  const paper=new T.InstancedMesh(new T.BoxGeometry(1,1,1),mat('#b9aa8c'),16),dummy=new T.Object3D();
  for(let i=0;i<16;i++){const side=i%2?1:-1;dummy.position.set(side*(14.9+(i%3)*.9),.43,-10-((i*31+index*13)%145));dummy.rotation.set(0,i*1.71,0);dummy.scale.set(.12+(i%3)*.07,.012,.16+(i%4)*.06);dummy.updateMatrix();paper.setMatrixAt(i,dummy.matrix)}parent.add(paper);
  for(const side of [-1,1]){const z=-58-(index%2)*70;box(parent,side*18.1,.7,z,.8,.6,.7,'#88704f');for(let i=0;i<3;i++)box(parent,side*18.1,.53+i*.19,z+.36,.78,.025,.025,'#b49a6a');box(parent,side*18.4,.76,z+2,.7,.8,.65,'#3c6f60');box(parent,side*18.4,1.18,z+2,.78,.08,.72,'#40574a');}
 }
 function signal(parent,node,previous){const dx=previous.x-node.x,dz=previous.z-node.z,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len,g=new T.Group();g.position.set(ux*29-uz*15.2,0,uz*29+ux*15.2);g.rotation.y=Math.atan2(ux,uz);parent.add(g);
  box(g,0,3.4,0,.17,6.8,.17,'#27383d');box(g,1.55,6.65,0,3.25,.13,.14,'#27383d');box(g,2.9,5.8,0,.63,1.85,.4,'#172b32');const bulbs=[];
  for(let i=0;i<3;i++){const m=new T.MeshStandardMaterial({color:'#263138',emissive:'#000000',roughness:.45});const light=new T.Mesh(new T.CylinderGeometry(.2,.2,.075,14),m);light.rotation.x=Math.PI/2;light.position.set(2.9,6.38-i*.55,.25);g.add(light);bulbs.push(m);box(g,2.9,6.61-i*.55,.34,.5,.07,.4,'#172b32')}
  box(g,8.5,.13,-2,12,.025,.35,'#eee8d6');for(let i=0;i<6;i++)box(g,8.5,.13,-5-i*.8,12,.025,.42,'#e5e3d6');
  signals.push({node,previous,bulbs,axis:Math.abs(dx)>Math.abs(dz)?1:0});
 }
 function state(s,time){const phase=time%34;return s.axis===0?(phase<14?'green':phase<17?'amber':'red'):(phase<17?'red':phase<31?'green':'amber')}
 function update(time){for(let i=0;i<officers.length;i++){const o=officers[i];o.signal.rotation.z=1.2+Math.sin(time*.65+i)*.28;}for(const s of signals){const current=state(s,time);if(s.lastState===current)continue;s.lastState=current;s.bulbs.forEach((m,i)=>{const on=(i===0&&current==='red')||(i===1&&current==='amber')||(i===2&&current==='green');const color=['#ed3a32','#ffb82c','#38da71'][i];m.color.set(on?color:'#263138');m.emissive.set(on?color:'#000000');m.emissiveIntensity=on?1.15:0})}}
 function mustStop(p,time){const fx=-Math.sin(p.yaw),fz=-Math.cos(p.yaw);for(const s of signals){if(state(s,time)==='green')continue;const dx=s.previous.x-s.node.x,dz=s.previous.z-s.node.z,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len,rx=p.x-s.node.x,rz=p.z-s.node.z,along=rx*ux+rz*uz,lateral=Math.abs(rx*uz-rz*ux);if(along>23&&along<36&&lateral<14&&fx*ux+fz*uz<-.6)return true}return false}
 return{walls,clutter,policePost,signal,update,mustStop};
}
