// Original auto-rickshaw bodywork, vinyl canopy and safety grille geometry.
export function createBangladeshCngFactory(T,{box,label,mat,person}){
 const palettes=[{paint:'#098450',trim:'#e8dcca'},{paint:'#8c999e',trim:'#e9e0c9'},{paint:'#e4ba25',trim:'#f5e0a2'}];
 const chrome=new T.MeshStandardMaterial({color:'#adbdc0',metalness:.8,roughness:.3});const rubber=mat('#253034');
 const glass=new T.MeshStandardMaterial({color:'#53868e',roughness:.18,metalness:.28,transparent:true,opacity:.63,side:T.DoubleSide});
 const cache=new Map();function materials(variant){const i=variant%3;if(cache.has(i))return cache.get(i);const p=palettes[i],c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d');x.fillStyle=p.paint;x.fillRect(0,0,1024,512);let seed=53+i;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let j=0;j<320;j++){x.fillStyle=j%3?'#c5ba9377':'#674c3677';x.fillRect(random()*1024,200+random()*312,2+random()*19,1+random()*2)}x.fillStyle='#f1e4b7';x.fillRect(0,130,1024,28);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;const paint=new T.MeshStandardMaterial({color:p.paint,roughness:.4,metalness:.28,side:T.DoubleSide}),wear=new T.MeshStandardMaterial({map:texture,roughness:.65,side:T.DoubleSide});const clothCanvas=document.createElement('canvas');clothCanvas.width=clothCanvas.height=256;const cx=clothCanvas.getContext('2d');cx.fillStyle='#273335';cx.fillRect(0,0,256,256);for(let j=0;j<4000;j++){cx.fillStyle=j%2?'#ffffff08':'#00000015';cx.fillRect((j*43)%256,(j*67)%256,1,2)}const clothMap=new T.CanvasTexture(clothCanvas);clothMap.colorSpace=T.SRGBColorSpace;const vinyl=new T.MeshStandardMaterial({map:clothMap,roughness:.78,side:T.DoubleSide});const result={paint,wear,vinyl};cache.set(i,result);return result}
 function rod(g,a,b,r=.018,m=chrome){const av=new T.Vector3(...a),bv=new T.Vector3(...b),d=bv.clone().sub(av);const obj=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),7),m);obj.position.copy(av.add(bv).multiplyScalar(.5));obj.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(obj);return obj}
 function quad(g,p,m){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p.flat(),3));geo.setAttribute('uv',new T.Float32BufferAttribute([0,0,1,0,1,1,0,1],2));geo.setIndex([0,1,2,0,2,3]);geo.computeVertexNormals();const mesh=new T.Mesh(geo,m);g.add(mesh);return mesh}
 function cylinder(g,x,y,z,r,h,m,sides=16){const obj=new T.Mesh(new T.CylinderGeometry(r,r,h,sides),m);obj.position.set(x,y,z);g.add(obj);return obj}
 function create(variant=0){const g=new T.Group(),wheels=[],p=palettes[variant%3],m=materials(variant);
  const base=box(g,0,.53,.25,1.68,.22,2.25,p.paint);base.material=m.paint;box(g,0,.41,.36,1.3,.1,2.28,'#3c494a');
  function wheel(x,z){const w=new T.Group();w.position.set(x,.38,z);g.add(w);const tire=new T.Mesh(new T.TorusGeometry(.275,.095,8,20),rubber);tire.rotation.y=Math.PI/2;w.add(tire);const rim=cylinder(w,0,0,0,.205,.2,chrome);rim.rotation.z=Math.PI/2;for(let i=0;i<5;i++){const a=i*Math.PI*.4;const bolt=cylinder(w,Math.sign(x||1)*.115,Math.sin(a)*.125,Math.cos(a)*.125,.026,.02,mat('#3e4d50'),6);bolt.rotation.z=Math.PI/2}wheels.push(w)}
  wheel(-.88,.92);wheel(.88,.92);wheel(0,-1.26);
  // Curved front apron with a wider shoulder and a tapered lower nose.
  const positions=[],uv=[],indices=[],rings=[[.5,.63,.42],[.75,.79,.54],[1.12,.84,.55],[1.25,.78,.41]],steps=22;
  for(let j=0;j<rings.length;j++)for(let k=0;k<=steps;k++){const a=-Math.PI/2+k/steps*Math.PI,[y,r,d]=rings[j];positions.push(Math.sin(a)*r,y,-.9-Math.cos(a)*d);uv.push(k/steps,j/(rings.length-1))}for(let j=0;j<rings.length-1;j++)for(let k=0;k<steps;k++){const a=j*(steps+1)+k,b=a+steps+1;indices.push(a,b,a+1,a+1,b,b+1)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();g.add(new T.Mesh(geo,m.paint));
  // Rear engine body and side sill leave an actual passenger entrance.
  const rear=box(g,0,.88,1.1,1.74,.73,.72,p.paint);rear.material=m.paint;
  for(const side of [-1,1]){quad(g,[[side*.86,.55,-.7],[side*.86,.55,1.42],[side*.86,1.06,1.42],[side*.86,1.06,-.7]],m.wear);box(g,side*.85,.65,.15,.12,.12,1.3,'#9da9a1');rod(g,[side*.91,.58,-.1],[side*.91,.58,1.5],.045);}
  const roofShape=new T.Shape();roofShape.moveTo(-.91,1.8);roofShape.quadraticCurveTo(-.9,2.2,0,2.25);roofShape.quadraticCurveTo(.9,2.2,.91,1.8);roofShape.lineTo(.82,1.8);roofShape.quadraticCurveTo(.8,2.08,0,2.12);roofShape.quadraticCurveTo(-.8,2.08,-.82,1.8);roofShape.closePath();const roof=new T.Mesh(new T.ExtrudeGeometry(roofShape,{depth:2.3,bevelEnabled:false,curveSegments:10}),m.vinyl);roof.position.z=-.79;g.add(roof);
  const back=new T.Shape();back.moveTo(-.88,1.05);back.lineTo(.88,1.05);back.lineTo(.88,1.8);back.quadraticCurveTo(.83,2.23,0,2.25);back.quadraticCurveTo(-.83,2.23,-.88,1.8);back.closePath();const cover=new T.Mesh(new T.ShapeGeometry(back,12),m.vinyl);cover.position.z=1.51;g.add(cover);
  // Rear window, tied curtains, stitched canopy edges and durable clear lettering.
  box(g,0,1.6,1.53,1.03,.42,.025,'#96a8a0');for(const side of [-1,1]){const curtain=box(g,side*.29,1.6,1.56,.19,.37,.018,'#e3cfaa');curtain.rotation.z=side*.14;rod(g,[side*.86,1.1,1.54],[side*.86,1.86,1.54],.012,mat('#b4b3a3'))}
  label(g,['মিটারে মন নাই','মামা, ভাড়া ঠিক?','দরদামে ওস্তাদ'][variant%3],0,2,1.56,1.62,.34,'#182e34','#fff0b5');label(g,'মা-বাবার দোয়া',0,1.23,1.57,1.56,.27,'#182e34','#fff3cb');
  for(let i=0;i<6;i++)box(g,0,.72+i*.055,1.48,.84,.025,.026,'#3c5652');label(g,'ঢাকা থ ১২-৭৮৬৪',0,.81,1.53,1.03,.25,'#f8ecd0','#193d44');
  quad(g,[[-.76,1.25,-1.07],[.76,1.25,-1.07],[.79,1.93,-.77],[-.79,1.93,-.77]],glass);
  for(const side of [-1,1]){rod(g,[side*.76,1.23,-1.07],[side*.8,1.98,-.75],.035,m.paint);rod(g,[side*.8,1.98,-.75],[side*.87,1.83,1.48],.025);rod(g,[side*.93,.5,1.45],[side*.93,.5,-.2],.04);box(g,side*.65,.9,1.53,.17,.42,.05,'#b72f30');box(g,side*.65,1.02,1.57,.15,.12,.02,'#eaa63e');
   // Diagonal welded mesh only beside the driver; passenger doorway stays open.
   for(let i=0;i<6;i++){const z=-.67+i*.12;rod(g,[side*.86,1.12,z],[side*.86,1.84,Math.min(z+.28,.25)],.008,m.paint)}for(const y of [1.12,1.48,1.86])rod(g,[side*.86,y,-.71],[side*.86,y,.18],.015,m.paint);
   rod(g,[side*.78,1.75,-.81],[side*1.03,1.76,-.9],.018);box(g,side*1.04,1.77,-.93,.15,.2,.06,'#bdcbd0');
   const fender=new T.Mesh(new T.TorusGeometry(.46,.045,6,18,Math.PI),m.paint);fender.rotation.y=Math.PI/2;fender.position.set(side*.88,.38,.92);g.add(fender);
  }
  rod(g,[-.78,.5,1.59],[.78,.5,1.59],.04);rod(g,[-.65,.58,-1.48],[.65,.58,-1.48],.04);rod(g,[0,.8,-1.25],[0,.38,-1.26],.04,chrome);
  for(const side of [-1,1]){const light=cylinder(g,side*.43,1.04,-1.44,.125,.06,mat('#edf1cd'));light.rotation.x=Math.PI/2;for(let j=0;j<4;j++)box(g,side*.43,.9+j*.075,-1.49,.31,.014,.025,'#9bafb1')}
  for(let i=0;i<4;i++)box(g,0,.96+i*.06,-1.48,.36,.022,.025,'#2b3b3c');rod(g,[-.18,1.28,-1.09],[.14,1.61,-.97],.012,mat('#233b40'));
  box(g,0,1,.82,1.4,.15,.52,'#9e3e4d');box(g,0,1.25,1.34,1.4,.47,.1,'#a54350');const driver=person(g,0,-.46,'#9cb5b2');driver.group.scale.setScalar(.61);driver.group.position.y=.49;box(g,0,1.08,-.71,.51,.045,.04,'#23393e');
  // Additional front and side treatment; the existing rear artwork is retained.
  const frontBand=box(g,0,1.18,-1.35,1.22,.09,.055,p.trim);
  for(const side of [-1,1]){
   rod(g,[side*.66,.68,-1.42],[side*.66,1.13,-1.4],.024);rod(g,[side*.66,1.13,-1.4],[side*.22,1.21,-1.4],.022);
   box(g,side*.7,1.2,-1.25,.15,.065,.04,'#e7a242');
   // Full-height driver-side grille perimeter and diagonal cross mesh.
   rod(g,[side*.87,1.08,-.73],[side*.87,1.91,-.73],.023,m.paint);rod(g,[side*.87,1.08,.18],[side*.87,1.91,.18],.023,m.paint);
   for(let k=0;k<5;k++)rod(g,[side*.875,1.12,-.66+k*.16],[side*.875,1.83,-.7+k*.16],.009,chrome);
   const sideName=label(g,'সি এন জি চালিত',side*.882,.94,.7,1.1,.2,p.trim,'#244549');sideName.rotation.y=side*Math.PI/2;
   box(g,side*.877,1.26,.2,.04,.09,.14,'#adbcb8');
   for(let rivet=0;rivet<7;rivet++){const bolt=new T.Mesh(new T.SphereGeometry(.014,5,4),chrome);bolt.position.set(side*.9,1.83,-.6+rivet*.3);g.add(bolt)}
  }
  const mudguard=new T.Mesh(new T.TorusGeometry(.44,.065,7,20,Math.PI),m.paint);mudguard.rotation.y=Math.PI/2;mudguard.position.set(0,.38,-1.26);g.add(mudguard);
  for(const side of [-1,1])rod(g,[side*.1,.38,-1.26],[side*.1,.92,-1.09],.028,chrome);
  const frontPlate=label(g,'ঢাকা থ ১২-৭৮৬৪',0,.74,-1.47,.72,.18,'#f4e6ba','#174331');frontPlate.rotation.y=Math.PI;
  const visor=label(g,'ধীরে যাই, ভালো থাকি',0,2.04,-.82,1.48,.2,p.paint,'#fff4c9');visor.rotation.y=Math.PI;
  // Subtle hood seams and front apron paint chips.
  for(let i=0;i<10;i++){const xx=-.5+i*.11;box(g,xx,.62+(i%3)*.035,-1.35,.045,.012,.012,i%2?'#aeb4a3':'#6d7668')}
  return{g,wheels,length:3.15,width:1.98,type:'cng'};
 }
 return{create};
}
