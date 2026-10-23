// Rear-end bus contact: one reward per contact, not one reward per rendered frame.
export function createBusImpacts(T,{root,camera,getBus,audio,onPoints,onPush}){
 const balloon=document.createElement('div');balloon.hidden=true;balloon.className='bus-dialogue passenger-dialogue';balloon.innerHTML='<small>যাত্রী</small><strong>ওই ভাই, যাও না ক্যা?</strong>';balloon.setAttribute('role','status');root.append(balloon);
 const anchor=new T.Vector3();const contacts=new Set();let remaining=0;
 function reset(){contacts.clear();remaining=0;balloon.hidden=true;}
 function update(dt,{player,previous,speed,traffic,enabled}){
  remaining=Math.max(0,remaining-dt);if(remaining===0)balloon.hidden=true;if(!enabled)return{speed,hit:false};
  const fx=-Math.sin(player.yaw),fz=-Math.cos(player.yaw);let hit=false;
  for(const other of traffic){if(other.type!=='bus')continue;const dx=other.g.position.x-player.x,dz=other.g.position.z-player.z,ahead=dx*fx+dz*fz,side=Math.abs(dx*fz-dz*fx),limit=(9.45+other.modelLength)/2;
   const aligned=Math.cos(other.g.rotation.y-player.yaw)>.8;
   if(!aligned||ahead<0||ahead>limit+.9||side>(3.05+other.width)/2+.35){contacts.delete(other);continue;}
   if(ahead>limit+.1||side>(3.05+other.width)/2-.08||speed<=.1||speed-(other.velocity||0)<=.08)continue;
   const fresh=!contacts.has(other);contacts.add(other);onPush(other,Math.min(2.2,1.25+speed*.07));
   player.x=previous.x;player.z=previous.z;player.yaw=previous.yaw;speed=0;hit=true;
   if(fresh){onPoints(15);audio.impact();remaining=2.8;balloon.hidden=false;balloon.className='bus-dialogue passenger-dialogue comic-pop';}
   break;
  }
  return{speed,hit};
 }
 function position(){if(balloon.hidden)return;const bus=getBus();bus.updateWorldMatrix(true,false);anchor.set(-1.65,3.35,1.8);bus.localToWorld(anchor);camera.updateMatrixWorld();anchor.project(camera);balloon.style.left=`${Math.max(20,Math.min(80,(anchor.x*.5+.5)*100+8))}%`;balloon.style.top=`${Math.max(22,Math.min(70,(-anchor.y*.5+.5)*100))}%`;balloon.classList.toggle('comic-burst',remaining<.23);}
 return{reset,update,position,get busy(){return remaining>0},hide:reset};
}
