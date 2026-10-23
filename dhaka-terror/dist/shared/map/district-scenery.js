// Low-cost rear streets and neighborhood landmarks. Game interpretation, not a survey.
import {places,roads,getPlace} from './network.js';
export function createDistrictScenery(T,{root,box,label,mat,neighborhoods}){
 const districts=[];
 const parkPlaces=new Set(['agargaon','shewrapara','kazipara','mirpur2','mirpur14','shyamoli']);
 const identities={agargaon:'আগারগাঁও • অফিস ও নগর উদ্যান',kazipara:'কাজীপাড়া • পাড়া বাজার',shewrapara:'শেওড়াপাড়া • আসবাব বাজার',mirpur12:'পল্লবী • আবাসিক এলাকা',mirpur11:'মিরপুর ১১ • মেট্রো বাজার',mirpur10:'মিরপুর ১০ • গোলচত্বর',mirpur2:'মিরপুর ২ • ক্রিকেট ও সিনেমা',mirpur1:'মিরপুর ১ • বাজার',technical:'টেকনিক্যাল • বাস কাউন্টার',kallyanpur:'কল্যাণপুর • যাত্রী ছাউনি',shyamoli:'শ্যামলী • দোকান ও হাসপাতাল',mirpur14:'মিরপুর ১৪ • বাস স্ট্যান্ড',mazar:'মাজার রোড • পুরনো বাজার',gabtoli:'গাবতলী • পরিবহন এলাকা'};
 const cube=new T.BoxGeometry(1,1,1),paint=['#a57d61','#b79c7a','#9e8371','#c3b69c','#7c9591'];
 function roadDistance(x,z){let d=Infinity;for(const r of roads){const a=getPlace(r.from),b=getPlace(r.to),dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz)));d=Math.min(d,Math.hypot(x-a.x-t*dx,z-a.z-t*dz))}return d}
 places.forEach((p,index)=>{
  const g=new T.Group();g.position.set(p.x,0,p.z);root.add(g);districts.push({group:g,place:p});
  // Instanced rows of buildings/windows close the view behind the first shopfronts.
  const buildings=[],windows=[];
  for(let row=-2;row<=2;row++)for(let col=-2;col<=2;col++){
   const x=col*37,z=row*37;if(Math.abs(x)<60&&Math.abs(z)<20||roadDistance(p.x+x,p.z+z)<29)continue;
   const h=9+((index*7+row*3+col+60)%6)*3.4;buildings.push({x,z,h});
   for(let y=3;y<h-1;y+=3)for(let w=-6;w<=6;w+=4)for(const side of [-1,1]){windows.push([x+w,y,z+side*9.06,1.7,1.7,.06]);windows.push([x+side*9.06,y,z+w,.06,1.7,1.7]);}
  }
  const dummy=new T.Object3D();const blocks=new T.InstancedMesh(cube,mat(paint[index%paint.length]),buildings.length);blocks.receiveShadow=true;buildings.forEach((b,i)=>{dummy.position.set(b.x,b.h/2,b.z);dummy.scale.set(18,b.h,18);dummy.updateMatrix();blocks.setMatrixAt(i,dummy.matrix)});g.add(blocks);
  const panes=new T.InstancedMesh(cube,mat('#344c50'),windows.length);windows.forEach((v,i)=>{dummy.position.set(...v.slice(0,3));dummy.scale.set(...v.slice(3));dummy.updateMatrix();panes.setMatrixAt(i,dummy.matrix)});g.add(panes);
  // Fill the exact approach gaps: a park on one side, a visible street frontage opposite.
  for(const side of [-1,1]){
   const x=side*43,z=0;if(roadDistance(p.x+x,p.z+z)<28)continue;
   if(side===-1&&parkPlaces.has(p.id)){
    neighborhoods.greenSpace(g,x,0,side,index%2===0);
    label(g,p.bn+' • নগর উদ্যান',x,2.6,9,13,1.2,'#205d40','#fff2ca');
    for(const dz of [-15,15]){box(g,x,.16,dz,19,.22,4,'#a8b58b');box(g,x,.3,dz,16,.06,1,'#d6c5a4');}
   }else{
    const h=p.id==='agargaon'?10:7+index%4*2;box(g,x,h/2,0,19,h,17,paint[(index+2)%5]);box(g,x,h+.15,0,20,.3,18,'#d4c4ac');
    for(let y=3;y<h;y+=2.8)for(let dz=-5;dz<=5;dz+=3.3)box(g,x-side*9.56,y,dz,.08,1.7,1.8,'#38585c');
    const sign=label(g,identities[p.id],x-side*9.65,2.5,0,14,1.25,'#7c4030','#fff0cb');sign.rotation.y=-side*Math.PI/2;
    box(g,x-side*10,1,0,.4,2,12,'#6e7367');
   }
  }
  if(p.id==='agargaon'){
   // Broad low civic office behind the park; recognisable silhouette without heavy models.
   box(g,-76,6,30,28,12,20,'#c4b59a');for(let x=-86;x<-64;x+=4)box(g,x,6,40.1,1.2,9,.15,'#456e74');box(g,-76,12.4,30,30,.6,22,'#e7dcc6');
  }
  if(p.id==='mirpur2'){
   box(g,44,8,30,23,16,16,'#934b37');label(g,'সনি স্কয়ার • সিনেমা',44,11,38.1,20,2.5,'#5c233c','#ffecc0');
  }
  if(['technical','kallyanpur','gabtoli'].includes(p.id)){
   for(let i=0;i<3;i++){const x=-42-i*10,z=24;if(roadDistance(p.x+x,p.z+z)<24)continue;box(g,x,1.4,z,8,2.8,5,paint[i]);box(g,x,3,z+1,9,.18,7,'#507c70');label(g,['বাসের টিকিট','আগে চা ট্রাভেলস','অপেক্ষা পরিবহন'][i],x,2.2,z+2.56,7,1,'#8b4037','#fff0ce');}
  }
 });
 return{update(player){for(const d of districts)d.group.visible=Math.hypot(d.place.x-player.x,d.place.z-player.z)<385}};
}
