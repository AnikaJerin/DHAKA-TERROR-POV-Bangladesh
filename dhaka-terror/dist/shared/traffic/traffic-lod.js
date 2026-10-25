import {RICKSHAW_PALETTES} from '../../rickshaw.js';
// Preserve detailed nearby vehicles; small shared meshes represent distant traffic.
export function createTrafficLod(T,{box,mat}){
 const tire=new T.TorusGeometry(.36,.075,5,10),head=new T.SphereGeometry(.14,7,5),canopy=new T.SphereGeometry(1,10,5,0,Math.PI*2,0,Math.PI/2);
 function wrap(model,type,index){const root=new T.Group(),lod=new T.LOD(),proxy=new T.Group(),detail=model.g;root.add(lod);lod.addLevel(detail,0);lod.addLevel(proxy,85);
  const colors=['#bb414e','#306d8a','#9d5192','#b68b31'],paint=RICKSHAW_PALETTES[index%RICKSHAW_PALETTES.length],color=type==='rickshaw'?paint.body:colors[index%4];
  function wheels(points,scale=1){for(const [x,z]of points){const wheel=new T.Mesh(tire,mat('#253137'));wheel.rotation.y=Math.PI/2;wheel.position.set(x,.42*scale,z);wheel.scale.setScalar(scale);proxy.add(wheel)}}
  function rider(z){box(proxy,0,1.32,z,.4,.55,.28,'#5c7784');const face=new T.Mesh(head,mat('#a57956'));face.position.set(0,1.77,z);proxy.add(face);}
  if(type==='rickshaw'){box(proxy,0,.79,.45,1.45,.25,1.65,color);box(proxy,0,1.2,.95,1.35,.75,.08,color);const roof=new T.Mesh(canopy,mat(paint.cloth));roof.position.set(0,1.72,.5);roof.scale.set(.85,.62,1.08);proxy.add(roof);wheels([[-.84,.75],[.84,.75],[0,-1.25]]);rider(-.75);}
  else if(type==='bike'){box(proxy,0,.68,0,.4,.34,1.4,'#263238');box(proxy,0,1,-.24,.56,.3,.7,color);wheels([[0,-.84],[0,.84]]);rider(.08);}
  else if(type==='bus'){box(proxy,0,1.8,0,2.9,2.7,9.2,color);box(proxy,0,3.2,0,3,.16,9.3,'#c9b74d');for(const side of [-1,1])box(proxy,side*1.46,2.55,0,.04,.9,8.5,'#2b4b55');wheels([[-1.5,-3],[1.5,-3],[-1.5,3],[1.5,3]],1.5);}
  else if(type==='cng'){const paint=['#267652','#8c9993','#d5ac35'][index%3];box(proxy,0,.93,0,1.6,1.1,2.5,paint);box(proxy,0,1.9,.3,1.7,.5,1.9,'#2b3536');box(proxy,0,1.55,-.98,1.35,.55,.05,'#416b73');wheels([[0,-1.1],[-.8,.8],[.8,.8]]);}
  else{box(proxy,0,.78,0,1.95,.65,4.3,['#b9b6a5','#376c73','#3d4448','#9c4843'][index%4]);box(proxy,0,1.3,.12,1.6,.58,2.3,'#334e58');wheels([[-1,-1.35],[1,-1.35],[-1,1.35],[1,1.35]]);}
  proxy.traverse(object=>{if(object.isMesh){object.castShadow=false;object.receiveShadow=true}});
  return{...model,g:root,detail};
 }
 function lazy(type,index,acquire,release){
  const dimensions={rickshaw:[3.65,2.15],bike:[2.25,.86],bus:[9.45,3.05],cng:[3.15,1.98],car:[4.5,2.04]}[type];
  const model=wrap({g:new T.Group(),wheels:[],length:dimensions[0],width:dimensions[1]},type,index);let active=null;
  const lod=model.g.children[0];lod.levels[1].distance=0;
  return{...model,ensureDetail(){if(active)return active;active=acquire(type,index);if(active){model.detail.add(active.g);lod.levels[1].distance=60;}return active},releaseDetail(){lod.levels[1].distance=0;if(!active)return;model.detail.remove(active.g);release(type,index,active);active=null;}};
 }
 return{wrap,lazy};
}
