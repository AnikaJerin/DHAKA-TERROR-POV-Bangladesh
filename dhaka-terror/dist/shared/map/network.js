// Shared, character-independent contract. Coordinates are compressed game metres, not GPS.
// X east, Y up, Z south. Both endpoints of every road are traversable.
export const MAP_VERSION=1;
export const places=Object.freeze([
 {id:'mirpur12',en:'Mirpur 12 / Pallabi',bn:'মিরপুর ১২ / পল্লবী',x:0,z:-900,metro:true},
 {id:'mirpur11',en:'Mirpur 11',bn:'মিরপুর ১১',x:0,z:-680,metro:true},
 {id:'mirpur10',en:'Mirpur 10',bn:'মিরপুর ১০',x:0,z:-400,metro:true,junction:'circle'},
 {id:'kazipara',en:'Kazipara',bn:'কাজীপাড়া',x:0,z:-100,metro:true},
 {id:'shewrapara',en:'Shewrapara',bn:'শেওড়াপাড়া',x:0,z:190,metro:true},
 {id:'agargaon',en:'Agargaon',bn:'আগারগাঁও',x:0,z:500,metro:true},
 {id:'mirpur2',en:'Mirpur 2 · Stadium',bn:'মিরপুর ২ · স্টেডিয়াম',x:-310,z:-400,landmark:'stadium'},
 {id:'mirpur1',en:'Mirpur 1',bn:'মিরপুর ১',x:-610,z:-350},
 {id:'mazar',en:'Mazar Road',bn:'মাজার রোড',x:-850,z:-300},
 {id:'gabtoli',en:'Gabtoli',bn:'গাবতলী',x:-940,z:0},
 {id:'technical',en:'Technical',bn:'টেকনিক্যাল',x:-660,z:0},
 {id:'kallyanpur',en:'Kallyanpur',bn:'কল্যাণপুর',x:-660,z:240},
 {id:'shyamoli',en:'Shyamoli',bn:'শ্যামলী',x:-610,z:490},
 {id:'mirpur14',en:'Mirpur 14',bn:'মিরপুর ১৪',x:340,z:-400}
].map(Object.freeze));
const links=[['mirpur12','mirpur11'],['mirpur11','mirpur10'],['mirpur10','kazipara'],['kazipara','shewrapara'],['shewrapara','agargaon'],['mirpur10','mirpur2'],['mirpur2','mirpur1'],['mirpur1','technical'],['technical','kallyanpur'],['kallyanpur','shyamoli'],['mirpur10','mirpur14'],['mirpur1','mazar'],['mazar','gabtoli'],['gabtoli','technical']];
export const roads=Object.freeze(links.map(([from,to],i)=>{const a=places.find(p=>p.id===from),b=places.find(p=>p.id===to);return Object.freeze({id:'road-'+i,from,to,length:Math.round(Math.hypot(b.x-a.x,b.z-a.z)),metro:!!(a.metro&&b.metro),lanes:4})}));
export const landmarks=Object.freeze([{id:'stadium',placeId:'mirpur2',en:'Sher-e-Bangla National Cricket Stadium',bn:'শের-ই-বাংলা জাতীয় ক্রিকেট স্টেডিয়াম',x:-210,z:-460,type:'stadium'},{id:'science',placeId:'agargaon',en:'Science Museum area',bn:'বিজ্ঞান জাদুঘর এলাকা',x:-65,z:470,type:'museum'}].map(Object.freeze));
export function getPlace(id){return places.find(p=>p.id===id)}
export function exits(placeId,previousId=null){const current=getPlace(placeId);if(!current)throw new Error('Unknown map place: '+placeId);const previous=getPlace(previousId);return roads.filter(r=>r.from===placeId||r.to===placeId).map(road=>{const target=getPlace(road.from===placeId?road.to:road.from);let turn='forward';if(previous){const ax=current.x-previous.x,az=current.z-previous.z,bx=target.x-current.x,bz=target.z-current.z,cross=ax*bz-az*bx,dot=ax*bx+az*bz;turn=target.id===previousId?'back':Math.abs(cross)<.001?'forward':cross<0?'left':'right';if(dot<0&&Math.abs(cross)<.001)turn='back'}return{road,target,turn}})}
export function shortestRoute(start,end){if(!getPlace(start)||!getPlace(end))return[];const queue=[[start]],visited=new Set([start]);while(queue.length){const path=queue.shift(),last=path[path.length-1];if(last===end)return path;for(const e of exits(last))if(!visited.has(e.target.id)){visited.add(e.target.id);queue.push([...path,e.target.id])}}return[]}
export const defaultStart='mirpur12';
