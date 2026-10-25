// Original bridge, office and green-space meshes, sized for the existing city blocks.
export function createNeighborhoods(T,{box,cylinder,label,mat,vegetation}){
 const steel=new T.MeshStandardMaterial({color:'#087eaa',metalness:.55,roughness:.38});
 const roofMat=new T.MeshStandardMaterial({color:'#2189c6',metalness:.5,roughness:.42});
 const glass=new T.MeshStandardMaterial({color:'#368bb0',metalness:.58,roughness:.18});
 const glassAlt=new T.MeshStandardMaterial({color:'#81b9cf',metalness:.48,roughness:.25});
 const sharedMaterials=new Set([steel,roofMat,glass,glassAlt]);
 function rod(parent,a,b,r=.045,material=steel){const aa=new T.Vector3(...a),bb=new T.Vector3(...b),d=bb.clone().sub(aa);const m=new T.Mesh(new T.CylinderGeometry(r,r,d.length(),7),material);m.position.copy(aa.add(bb).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());m.castShadow=true;parent.add(m);return m}
 function metal(parent,x,y,z,w,h,d,material=steel){const m=box(parent,x,y,z,w,h,d,'#0b83ac');m.material=material;return m}
 function stair(parent,x,z,y,run,rise){const width=2.3,steps=16;
  for(let i=0;i<steps;i++){const h=y+(i+1)*rise/steps;box(parent,x,h-.075,z-(i+.5)*run/steps,width,.15,run/steps+.025,'#c0c5c3');metal(parent,x,h+.01,z-(i+.08)*run/steps,width,.025,.07)}
  for(const side of [-1,1]){rod(parent,[x+side*1.08,y-.12,z],[x+side*1.08,y+rise-.12,z-run],.09);rod(parent,[x+side*1.12,y+1.05,z],[x+side*1.12,y+rise+1.05,z-run],.045);for(let i=0;i<=8;i++){const t=i/8;rod(parent,[x+side*1.12,y+rise*t,z-run*t],[x+side*1.12,y+rise*t+1.05,z-run*t],.028)}}
  for(let i=0;i<=4;i++){const t=i/4;rod(parent,[x-1.26,y+rise*t,z-run*t],[x-1.26,y+rise*t+2.08,z-run*t],.045);rod(parent,[x+1.26,y+rise*t,z-run*t],[x+1.26,y+rise*t+2.08,z-run*t],.045)}
  const sheet=metal(parent,x,y+rise/2+2.1,z-run/2,2.95,.09,Math.hypot(run,rise)+.3,roofMat);sheet.rotation.x=Math.atan2(rise,run);
  for(let i=0;i<13;i++){const xx=x-1.44+i*.24;rod(parent,[xx,y+2.17,z],[xx,y+rise+2.17,z-run],.012,roofMat)}
 }
 function footbridge(parent,index){const g=new T.Group();g.position.z=-64;parent.add(g);const blue=index%4===0?'#1388bb':'#168e9d';
  box(g,0,5.96,0,29.4,.32,3.05,'#a6b2b5');for(const z of [-1.5,1.5]){metal(g,0,5.87,z,29.7,.24,.16);metal(g,0,7.78,z,29.7,.14,.14);metal(g,0,6.95,z,29.7,.06,.065);for(let x=-14.4;x<14.5;x+=2.4){metal(g,x,6.9,z,.1,1.9,.1);rod(g,[x,6.1,z],[Math.min(x+2.4,14.4),7.73,z],.05);rod(g,[x,7.73,z],[Math.min(x+2.4,14.4),6.1,z],.05)}for(let x=-14.4;x<=14.4;x+=.6)metal(g,x,6.55,z,.025,.85,.025)}
  // A shallow corrugated gable roof fits below the rail viaduct.
  for(const side of [-1,1]){const sheet=metal(g,0,8.04,side*.86,30.3,.07,1.9,roofMat);sheet.rotation.x=side*.12;metal(g,0,7.94,side*1.78,30.5,.13,.1);for(let x=-15;x<=15;x+=.3)rod(g,[x,8.16,0],[x,7.94,side*1.78],.01,roofMat)}
  for(const side of [-1,1]){const x=side*14.3;for(const dz of [-1.1,1.1]){box(g,x,.22,dz,1.05,.4,1.05,'#b4b7b0');metal(g,x,3,dz,.25,5.7,.25)}
   box(g,x,6,0,2.5,.2,3.2,'#b6bfbc');
   // Connected two-flight stairs with a genuine halfway landing.
   stair(g,x,24,.36,10.8,2.87);box(g,x,3.14,12.2,2.4,.18,2,'#bec7c4');stair(g,x,11.2,3.23,10.8,2.87);
   for(const dx of [-1.12,1.12]){rod(g,[x+dx,3.23,13.2],[x+dx,4.28,13.2]);rod(g,[x+dx,4.28,13.2],[x+dx,4.28,11.2]);}
   metal(g,x,5.34,12.2,2.95,.09,2.2,roofMat);for(const zz of [12.2,0])for(const dx of [-1.08,1.08])metal(g,x+dx,(zz===0?3:1.55),zz,.12,zz===0?5.8:3,.12);
  }
  label(g,'ফুটওভার ব্রিজ ব্যবহার করুন',0,6.57,1.62,7.6,.68,'#064b73','#fff8d5');label(g,'সিঁড়ি দিয়ে উঠুন ↑',-11.4,7.1,1.62,4.2,.75,blue,'#fff8dc');
 }
 function office(parent,x,z,side,index){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=-side*Math.PI/2;parent.add(g);const height=24+(Math.abs(index)%3)*5;
  box(g,0,.22,0,13.5,.4,14.5,'#cad0cc');metal(g,0,height/2,0,11.8,height,12.2,glass);
  // Curtain-wall panes cover all four elevations, with visible floor and mullion grids.
  const panes=[],silver=[];for(let face=0;face<4;face++){const f=new T.Group();f.rotation.y=face*Math.PI/2;g.add(f);const entries=[];for(let y=2;y<height-1;y+=2.8)for(let xx=-4.8;xx<5;xx+=2.4)entries.push([xx,y,6.13,2.28,2.65,.035]);const mm=new T.InstancedMesh(new T.BoxGeometry(1,1,1),face%2?glassAlt:glass,entries.length),dummy=new T.Object3D();entries.forEach((v,i)=>{dummy.position.set(...v.slice(0,3));dummy.scale.set(...v.slice(3));dummy.updateMatrix();mm.setMatrixAt(i,dummy.matrix)});f.add(mm);for(let y=.6;y<height;y+=2.8)box(f,0,y,6.19,12,.07,.07,'#d8e2e4');for(let xx=-6;xx<=6;xx+=2.4)box(f,xx,height/2,6.2,.055,height,.065,'#d8e2e4')}
  box(g,0,height+.15,0,12.5,.3,12.6,'#dce0db');box(g,0,1.6,6.3,3.6,3.1,.16,'#b6ddeb');metal(g,0,3.45,7.2,6,.1,2.4,glassAlt);label(g,'নগর গ্লাস টাওয়ার',0,4.55,6.35,9,1.1,'#164c72','#ffffff');box(g,0,.42,7.2,5,.25,2,'#d4d7cc');
 }
 function tree(parent,x,z,scale=1){return vegetation.tree(parent,x,z,scale,Math.floor(Math.abs(x*3+z))%9)}
 function greenSpace(parent,x,z,side,playground=false){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=-side*Math.PI/2;parent.add(g);
  box(g,0,.16,0,14,.25,16,'#79b86a');box(g,0,.31,0,2,.08,15,'#dbcfac');box(g,0,.32,1,13,.08,1.5,'#dbcfac');
  for(const edge of [-1,1]){box(g,edge*6.8,.55,0,.18,.7,16,'#b9c0ac');for(let zz=-8;zz<=8;zz+=.8)rod(g,[edge*6.8,.8,zz],[edge*6.8,1.65,zz],.025);rod(g,[edge*6.8,1.6,-8],[edge*6.8,1.6,8],.035)}
  for(const xx of [-5,-3,3,5]){rod(g,[xx,.5,7.8],[xx,1.7,7.8],.04);rod(g,[xx,1.7,7.8],[xx+(xx<0?-1:1),1.7,7.8],.035)}
  for(const xx of [-4.5,4.5])for(const zz of [-5,4.8])tree(g,xx,zz,.85);
  for(const xx of [-3.5,3.5]){box(g,xx,.65,2.6,2.5,.15,.7,'#cf9e62');box(g,xx,1.05,2.95,2.5,.7,.1,'#cf9e62');for(const a of [-.9,.9])box(g,xx+a,.4,2.6,.09,.5,.55,'#35564c')}
  vegetation.shrubs(g,[{x:-5.5,z:0,w:1.5,d:3.2,y:.3,flowers:0},{x:5.5,z:0,w:1.5,d:3.2,y:.3,flowers:1},{x:-3,z:-6,w:2,d:1.3,y:.3,flowers:2},{x:3,z:-6,w:2,d:1.3,y:.3,flowers:3}]);
  label(g,playground?'শিশুদের খেলার মাঠ':'একটু সবুজ • নগর উদ্যান',0,2.1,7.9,8,1.1,'#136a4d','#fff3bf');
  if(playground){
   for(const zz of [-3.8,-.8]){rod(g,[-3,0,zz],[-1.5,2.8,zz],.065);rod(g,[0,0,zz],[-1.5,2.8,zz],.065)}rod(g,[-1.5,2.8,-3.8],[-1.5,2.8,-.8],.08);
   for(const zz of [-2.9,-1.6]){rod(g,[-1.5,2.7,zz-.22],[-1.5,1,zz-.22],.015);rod(g,[-1.5,2.7,zz+.22],[-1.5,1,zz+.22],.015);box(g,-1.5,.95,zz,.6,.1,.55,'#e85c3c')}
   box(g,3,1.6,-3.4,1.5,.2,1.5,'#ffc23f');for(const xx of [2.4,3.6])box(g,xx,.8,-3.9,.1,1.6,.1,'#e44c62');for(let i=0;i<5;i++)box(g,3,.35+i*.3,-4.2,.95,.07,.08,'#e44c62');const slide=box(g,3,.93,-1.7,1.2,.08,3.5,'#30a9df');slide.rotation.x=.4;for(const xx of [2.38,3.62])rod(g,[xx,1.8,-3.25],[xx,.45,-.2],.045,mat('#f6c230'));
   box(g,0,.35,-6,4,.12,2.8,'#e9cc7a');
  }else {box(g,-3,.4,-2,3.2,.22,3.2,'#ebe2c2');cylinder(g,-3,.66,-2,1.25,.22,'#55bfc6');cylinder(g,-3,1.02,-2,.2,.65,'#c9c7ae');}
 }
 return{footbridge,office,greenSpace,sharedMaterials};
}
