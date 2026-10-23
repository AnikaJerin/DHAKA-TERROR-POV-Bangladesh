export const RICKSHAW_PALETTES=[
 {body:'#1265de',cloth:'#154aaf',trim:'#ffe33e',seat:'#d73546'},
 {body:'#da2545',cloth:'#af163c',trim:'#ffd53e',seat:'#168a74'},
 {body:'#67229e',cloth:'#451279',trim:'#ffd75c',seat:'#c83c75'},
 {body:'#198d75',cloth:'#176653',trim:'#ffe19b',seat:'#c54c57'},
 {body:'#dc782a',cloth:'#aa5125',trim:'#fff2c1',seat:'#276b83'},
 {body:'#c64c92',cloth:'#883c78',trim:'#f6da59',seat:'#3d73a0'},
 {body:'#b69b37',cloth:'#79682e',trim:'#f5d8bd',seat:'#a93440'},
 {body:'#399ca8',cloth:'#286a7e',trim:'#f9d879',seat:'#9f3861'}
];
// Original geometry and painted motifs inspired by traditional Dhaka cycle rickshaws.
export function createRickshaw(T,{box,label,mat,person},variant=0){
 const g=new T.Group(),wheels=[],lights=[];
 const p=RICKSHAW_PALETTES[((variant%RICKSHAW_PALETTES.length)+RICKSHAW_PALETTES.length)%RICKSHAW_PALETTES.length];
 const chrome=new T.MeshStandardMaterial({color:'#d4e5e8',metalness:.8,roughness:.23});
 const enamel=new T.MeshStandardMaterial({color:p.body,metalness:.3,roughness:.26});
 function rod(parent,a,b,r=.035,material=chrome){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const mesh=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),8),material);mesh.position.copy(av.add(bv).multiplyScalar(.5));mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());parent.add(mesh);return mesh}
 function wheel(x,z){const group=new T.Group();group.position.set(x,.63,z);g.add(group);const tire=new T.Mesh(new T.TorusGeometry(.57,.055,8,32),mat('#25313b'));tire.rotation.y=Math.PI/2;group.add(tire);const rim=new T.Mesh(new T.TorusGeometry(.52,.019,6,32),chrome);rim.rotation.y=Math.PI/2;group.add(rim);const points=[];for(let k=0;k<24;k++){const a=k*Math.PI/12;points.push(0,0,0,0,Math.sin(a)*.51,Math.cos(a)*.51)}const spokes=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(points,3)),new T.LineBasicMaterial({color:'#c8dce2'}));group.add(spokes);const hub=new T.Mesh(new T.CylinderGeometry(.08,.08,.18,12),chrome);hub.rotation.z=Math.PI/2;group.add(hub);wheels.push(group)}
 wheel(-1,.9);wheel(1,.9);wheel(0,-1.65);
 // Tricycle chassis and the bicycle's two frame triangles.
 rod(g,[-1,.63,.9],[1,.63,.9],.06,enamel);
 for(const side of [-1,1]){rod(g,[side*.83,.76,.95],[side*.7,.9,-.08],.055,enamel);rod(g,[side*.7,.9,-.08],[0,.65,-.7],.045,enamel)}
 rod(g,[0,.65,-.7],[0,1.2,-.55],.045,enamel);rod(g,[0,1.2,-.55],[0,1.25,-1.43],.045,enamel);rod(g,[0,1.25,-1.43],[0,.65,-.7],.045,enamel);rod(g,[0,.65,-.7],[0,.63,.65],.04,enamel);
 for(const side of [-1,1])rod(g,[side*.09,.64,-1.65],[side*.09,1.26,-1.44],.025,enamel);
 rod(g,[0,1.26,-1.44],[0,1.55,-1.48]);rod(g,[-.4,1.55,-1.43],[.4,1.55,-1.43]);
 box(g,0,1.23,-.58,.43,.12,.47,'#26363a');box(g,0,.74,-.7,.7,.06,.14,'#839aa0');
 // Passenger compartment: footboard, padded bench, backrest and armrests.
 box(g,0,.86,.65,1.74,.25,1.85,p.body);box(g,0,.76,-.16,1.65,.14,.62,p.trim);box(g,0,1.16,.8,1.57,.2,1.2,p.seat);box(g,0,1.55,1.36,1.58,.7,.14,p.seat);
 for(const side of [-1,1]){box(g,side*.84,1.25,.87,.11,.65,1.4,p.body);rod(g,[side*.84,1.6,.2],[side*.84,1.6,1.48],.045,enamel)}
 // Complete fabric hood: a continuous curved roof, side skirts and a closed arched rear.
 const canvas=document.createElement('canvas');canvas.width=canvas.height=1024;const c=canvas.getContext('2d');c.fillStyle=p.cloth;c.fillRect(0,0,1024,1024);
 for(let y=100;y<1024;y+=205)for(let x=100;x<1024;x+=205){c.strokeStyle=p.trim;c.lineWidth=10;c.beginPath();c.moveTo(x,y-83);c.lineTo(x+83,y);c.lineTo(x,y+83);c.lineTo(x-83,y);c.closePath();c.stroke();for(let petal=0;petal<8;petal++){const a=petal*Math.PI/4;c.fillStyle=petal%2?'#f44e94':'#39dbc2';c.beginPath();c.ellipse(x+Math.cos(a)*35,y+Math.sin(a)*35,23,11,a,0,Math.PI*2);c.fill()}c.fillStyle='#ffdf46';c.beginPath();c.arc(x,y,13,0,Math.PI*2);c.fill()}
 const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;
 const cloth=new T.MeshStandardMaterial({map:texture,roughness:.38,metalness:.08,side:T.DoubleSide});
 const vertices=[],uv=[],indices=[];const steps=28;
 for(let row=0;row<2;row++)for(let i=0;i<=steps;i++){const a=-Math.PI/2+i/steps*Math.PI;vertices.push(Math.sin(a)*.9,2.04+Math.cos(a)*.67,row?1.61:-.08);uv.push(i/steps,row)}
 for(let i=0;i<steps;i++){const a=i,b=i+1,d=i+steps+1,e=d+1;indices.push(a,d,b,b,d,e)}
 const roofGeo=new T.BufferGeometry();roofGeo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));roofGeo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));roofGeo.setIndex(indices);roofGeo.computeVertexNormals();const roof=new T.Mesh(roofGeo,cloth);roof.castShadow=true;g.add(roof);
 const arch=new T.Shape();arch.moveTo(-.9,1.35);arch.lineTo(.9,1.35);arch.lineTo(.9,2.04);for(let i=0;i<=steps;i++){const a=Math.PI/2-i/steps*Math.PI;arch.lineTo(Math.sin(a)*.9,2.04+Math.cos(a)*.67)}arch.closePath();const rearGeo=new T.ShapeGeometry(arch),pos=rearGeo.attributes.position,coords=[];for(let i=0;i<pos.count;i++)coords.push((pos.getX(i)+.9)/1.8,(pos.getY(i)-1.35)/1.36);rearGeo.setAttribute('uv',new T.Float32BufferAttribute(coords,2));const rear=new T.Mesh(rearGeo,cloth);rear.position.z=1.62;g.add(rear);
 for(const side of [-1,1]){const skirt=new T.Mesh(new T.PlaneGeometry(1.69,.68),cloth);skirt.rotation.y=side*Math.PI/2;skirt.position.set(side*.9,1.7,.765);g.add(skirt)}
 for(const z of [-.08,.47,1.04,1.63]){const pts=[];for(let i=0;i<=steps;i++){const a=-Math.PI/2+i/steps*Math.PI;pts.push(new T.Vector3(Math.sin(a)*.915,2.04+Math.cos(a)*.683,z))}g.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),28,.022,5,false),mat(p.trim)))}
 // Decorative gold fringe follows both hood arches.
 for(const z of [-.09,1.66])for(let i=0;i<19;i++){const a=-Math.PI/2+i/18*Math.PI,x=Math.sin(a)*.92,y=2.04+Math.cos(a)*.7;rod(g,[x,y,z],[x,y-.1,z],.012,mat(p.trim))}
 // Curved wheel mudguards, rear bumper and two readable enamel signboards.
 for(const side of [-1,1]){const fender=new T.Mesh(new T.TorusGeometry(.66,.055,7,20,Math.PI),enamel);fender.rotation.y=Math.PI/2;fender.position.set(side*1,.63,.9);g.add(fender)}
 rod(g,[-1.05,.58,1.75],[1.05,.58,1.75],.045,enamel);rod(g,[-1.05,.58,1.75],[-1.05,.88,1.4],.04,enamel);rod(g,[1.05,.58,1.75],[1.05,.88,1.4],.04,enamel);
 const jokes=[['প্যাডেলে স্বপ্ন চলে','গতি কম, মায়া বেশি'],['মামা, উড়াল দিমু?','ঘণ্টা বাজে, জ্যাম সরে না'],['জ্যামের রাজকুমার','ভাড়া কম, গল্প বেশি']][((variant%3)+3)%3];
 label(g,jokes[0],0,1.91,1.665,1.72,.43,'#112743','#fff14b');label(g,jokes[1],0,1.1,1.69,1.72,.36,p.trim,'#4d154f');
 for(let i=0;i<9;i++)box(g,-.78+i*.195,.61,1.7,.12,.29,.045,['#fb477e','#ffdc43','#32dcbf','#439cff'][i%4]);
 // Emissive beads blink slowly, with no expensive dynamic light sources.
 const bulbColors=['#ff3b98','#32f5d0','#ffdc3a','#5c8dff'];
 for(let i=0;i<17;i++){const a=-Math.PI/2+i/16*Math.PI;const m=new T.MeshStandardMaterial({color:bulbColors[i%4],emissive:bulbColors[i%4],emissiveIntensity:1.2,roughness:.18,metalness:.35});const bead=new T.Mesh(new T.SphereGeometry(.035,7,6),m);bead.position.set(Math.sin(a)*.93,2.04+Math.cos(a)*.71,1.7);g.add(bead);lights.push({material:m,phase:i*.55})}
 // Seated, forward-leaning cyclist: bent elbows, knees, pedals and hand grips.
 const shirt=mat(['#e6dfcc','#d88637','#5f9db1'][variant%3]),skin=mat('#b47c56'),trousers=mat('#3d4148');
 rod(g,[0,1.35,-.58],[0,1.82,-.88],.18,shirt);
 const head=new T.Mesh(new T.SphereGeometry(.19,12,10),skin);head.position.set(0,2.02,-.99);g.add(head);const hair=new T.Mesh(new T.SphereGeometry(.194,12,8,0,Math.PI*2,0,Math.PI*.5),mat('#26313a'));hair.position.set(0,2.06,-.99);g.add(hair);
 const legMeshes=[];
 for(const side of [-1,1]){
  rod(g,[side*.19,1.73,-.83],[side*.29,1.48,-1.1],.085,shirt);rod(g,[side*.29,1.48,-1.1],[side*.35,1.55,-1.43],.057,skin);
  const thigh=rod(g,[side*.13,1.35,-.58],[side*.2,.99,-1.02],.085,trousers),shin=rod(g,[side*.2,.99,-1.02],[side*.2,.65,-.73],.065,trousers);
  const shoe=box(g,side*.2,.62,-.8,.16,.09,.3,'#28343b');legMeshes.push({side,thigh,shin,shoe});
  const sideText=label(g,'ঢাকার রঙ • মনের ঢং',side*.914,1.32,.72,1.38,.28,p.trim,'#45194c');sideText.rotation.y=side*Math.PI/2;
 }
 const headlamp=new T.Mesh(new T.SphereGeometry(.09,10,8),chrome);headlamp.position.set(0,1.35,-1.58);g.add(headlamp);
 function poseRod(m,a,b){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.clone().normalize());m.scale.y=d.length()/m.geometry.parameters.height}
 function animate(time,moving){const angle=moving?time*5:0;for(const leg of legMeshes){const phase=angle+(leg.side>0?Math.PI:0),foot=[leg.side*.2,.66+Math.sin(phase)*.14,-.76+Math.cos(phase)*.14],knee=[leg.side*.2,1.02+Math.sin(phase)*.08,-1.02];poseRod(leg.thigh,[leg.side*.13,1.35,-.58],knee);poseRod(leg.shin,knee,foot);leg.shoe.position.set(foot[0],foot[1]-.04,foot[2]-.06)}}
 return{g,wheels,lights,animate,length:3.65,width:2.15,type:'rickshaw'};

}
