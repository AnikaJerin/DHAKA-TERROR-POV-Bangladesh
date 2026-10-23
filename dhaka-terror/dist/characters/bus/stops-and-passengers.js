// One boarding opportunity and one exclusive score per genuine stopping episode.
export function createBusStops(T,{scene,root,camera,world,getBus,onBoard,onPoints,onDoor,audio,dialogueBusy}){
 const balloon=document.createElement('div');balloon.hidden=true;balloon.setAttribute('role','status');balloon.setAttribute('aria-live','polite');root.append(balloon);
 const door=new T.Vector3(),anchor=new T.Vector3(),lastStop=new T.Vector3();let enabled=false,armed=false,still=0,moved=0,episode=null,runner=null,consumed=[],queue=[],line=null,lineTime=0,congestionTime=0;
 const milestones={32:[['passenger','আর কয় লইবা? কোলে বসাই?','p32']],34:[['helper','ওই মামা, একটু ভিতরে যান না! ভিতরে পানি উঠছেনি?','h34'],['passenger','হ, তোমারে রাইখা যাইগা!','p34']],35:[['driver','ভাই, ভিতরে যাইয়া বহেন!','d35'],['passenger','হ, তুমি উইঠা বইতে দাও!','p35']]};
 function reset(value,pose){runner?.borrow.restore();for(const borrow of consumed)borrow.restore();enabled=value;armed=false;still=0;moved=0;episode=null;runner=null;consumed=[];queue=[];line=null;lineTime=0;congestionTime=0;balloon.hidden=true;lastStop.set(pose.x,0,pose.z);}
 function update(dt,{player,speed,driving,forced,blockingTraffic,congestion}){
  if(!enabled||!driving)return;
  if(speed>.6){moved+=speed*dt;if(moved>=2)armed=true;still=0;episode=null;}
  else if(speed<.3){still+=dt;if(armed&&still>=.8){armed=false;moved=0;lastStop.set(player.x,0,player.z);episode={awarded:false,exempt:forced||world.legalBusStop(player),roadside:world.nearest(player.x,player.z).distance>=9};
    const borrow=world.borrowPassenger(player);if(borrow){runner={borrow,climb:0};onDoor();}
   }}else still=0;
  // Additional recurring award; legitimate stops/forced waits never start this timer.
  if(speed<.3&&!forced&&!world.legalBusStop(player)&&congestion){congestionTime+=dt;while(congestionTime>=10){congestionTime-=10;onPoints(10);}}else congestionTime=0;
  if(episode&&!episode.awarded&&!episode.exempt&&speed<.3){const points=episode.roadside?5:blockingTraffic?10:0;if(points){episode.awarded=true;onPoints(points);}}
  if(runner){const person=runner.borrow.person,bus=getBus();bus.updateWorldMatrix(true,false);door.set(-1.95,.12,-1.65);bus.localToWorld(door);const g=person.group,dx=door.x-g.position.x,dz=door.z-g.position.z,d=Math.hypot(dx,dz);
   if(speed>.4){runner.borrow.restore();runner=null;}
   else if(d>.42){const step=Math.min(d,3.4*dt);g.position.x+=dx/d*step;g.position.z+=dz/d*step;g.position.y=world.nearest(g.position.x,g.position.z).distance>14?.37:.12;g.rotation.y=Math.atan2(-dx,-dz);const phase=performancePhase+=dt*10;person.legs?.forEach((leg,i)=>leg.rotation.x=Math.sin(phase+i*Math.PI)*.65);person.arm.rotation.x=Math.sin(phase)*.5;if(person.left)person.left.rotation.x=-Math.sin(phase)*.5;}
   else{runner.climb+=dt;g.position.y=.12+runner.climb*.9;if(runner.climb>=.55){runner.borrow.board();consumed.push(runner.borrow);runner=null;const count=onBoard();if(milestones[count])queue.push(...milestones[count]);}}
  }
  if(!line&&queue.length&&!dialogueBusy()){line=queue.shift();lineTime=0;balloon.hidden=false;balloon.className='bus-dialogue comic-pop '+(line[0]==='passenger'?'passenger-dialogue':'helper-dialogue');const who=line[0]==='passenger'?'যাত্রী':line[0]==='driver'?'ড্রাইভার':'হেলপার';balloon.innerHTML='<small>'+who+'</small><strong>'+line[1]+'</strong>';audio.say(line[2]);}
  if(line){lineTime+=dt;const duration=Math.max(3,audio.duration||0);balloon.classList.toggle('comic-burst',lineTime>2.77);if(lineTime>=3)balloon.hidden=true;if(lineTime>=duration+.1){line=null;balloon.hidden=true;}}
 }
 let performancePhase=0;
 function position(){if(!line||balloon.hidden)return;const bus=getBus(),passenger=line[0]==='passenger',driver=line[0]==='driver';anchor.set(driver ? .85 : passenger?-1.65:-1.95,3.25,driver?-3.72:passenger?1.8:-1.62);bus.localToWorld(anchor);camera.updateMatrixWorld();anchor.project(camera);balloon.style.left=`${Math.max(20,Math.min(80,(anchor.x*.5+.5)*100+(passenger?9:-6)))}%`;balloon.style.top=`${Math.max(22,Math.min(70,(-anchor.y*.5+.5)*100))}%`;}
 return{reset,update,position,get busy(){return !!line||queue.length>0},hide(){balloon.hidden=true;runner?.borrow.restore();runner=null;line=null;queue=[]}};
}
