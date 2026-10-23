// Original umbrella markets and traditional push/van-cart shop geometry.
export function createMarketShops(T,{box,cylinder,label,person,mat}){
 function spokeWheel(g,x,z){const w=new T.Group();w.position.set(x,.4,z);g.add(w);const rim=new T.Mesh(new T.TorusGeometry(.36,.035,6,20),mat('#243b43'));rim.rotation.y=Math.PI/2;w.add(rim);const v=[];for(let i=0;i<12;i++){const a=i*Math.PI/6;v.push(0,0,0,0,Math.cos(a)*.33,Math.sin(a)*.33)}w.add(new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(v,3)),new T.LineBasicMaterial({color:'#c2d7db'})))}
 function umbrella(g,x,z,variant){const colors=['#ec4a59','#f7d43d','#239fce','#35b879','#9371ce','#ed9829'];cylinder(g,x,1.87,z,.035,3.1,'#a5b3b7');
  // Eight curved, slightly scalloped fabric gores make a complete canopy.
  for(let k=0;k<8;k++){const positions=[],indices=[];const rings=5,wedges=4;
   for(let r=0;r<=rings;r++)for(let s=0;s<=wedges;s++){const t=r/rings,a=(k+s/wedges)*Math.PI/4,radius=t*1.55,y=3.43-.43*t*t-.07*t*Math.sin(s/wedges*Math.PI);positions.push(x+Math.cos(a)*radius,y,z+Math.sin(a)*radius)}
   for(let r=0;r<rings;r++)for(let s=0;s<wedges;s++){const a=r*(wedges+1)+s,b=a+wedges+1;indices.push(a,b,a+1,a+1,b,b+1)}const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();const material=mat(colors[(k+variant)%colors.length]);material.side=T.DoubleSide;const panel=new T.Mesh(geo,material);panel.castShadow=true;g.add(panel);
   const pts=[];for(let r=0;r<=rings;r++){const t=r/rings,a=k*Math.PI/4;pts.push(new T.Vector3(x+Math.cos(a)*t*1.55,3.41-.43*t*t,z+Math.sin(a)*t*1.55))}g.add(new T.Line(new T.BufferGeometry().setFromPoints(pts),new T.LineBasicMaterial({color:'#8d9a96'})));
  }cylinder(g,x,3.48,z,.075,.16,'#d4d8cc');
 }
 function shop(parent,x,z,index){const g=new T.Group();g.position.set(x,.37,z);g.rotation.y=x<0?Math.PI/2:-Math.PI/2;parent.add(g);const kind=((index%3)+3)%3;const wood=['#c29261','#158c9c','#b24d6e'][kind];
  box(g,0,.86,0,2.7,.16,1.6,wood);box(g,0,1.02,0,2.8,.12,1.7,'#d8bb87');for(const xx of [-1.25,1.25]){box(g,xx,.55,0,.08,.66,1.4,'#4c6461');spokeWheel(g,xx,.15)}box(g,0,.4,.15,2.6,.08,.1,'#4c6461');
  for(let i=0;i<10;i++)box(g,-1.2+i*.27,.85,0,.025,.06,1.6,'#a17f55');
  // A van-cart handle protrudes behind the stall rather than into the walking lane.
  for(const xx of [-.9,.9])box(g,xx,.9,-1.15,.055,.055,.9,'#778d8e');
  umbrella(g,0,-.1,Math.abs(index)%6);
  if(kind===0){ // Shoe seller: pairs with soles, uppers and sandal straps.
   for(let row=0;row<3;row++)for(let col=0;col<5;col++)for(const pair of [-1,1]){const xx=-1.08+col*.53+pair*.1,zz=-.5+row*.47;box(g,xx,1.13,zz,.15,.055,.32,'#233944');box(g,xx,1.19,zz+.02,.14,.1,.24,['#85583f','#334958','#b56144'][col%3]);box(g,xx,1.25,zz-.03,.15,.025,.05,'#d1bb90')}
  }else if(kind===1){ // Fruit van, stacked crates and separate produce.
   for(let row=0;row<2;row++)for(let col=0;col<3;col++){const xx=-.93+col*.93,zz=-.38+row*.76;box(g,xx,1.12,zz,.81,.13,.66,'#a67b4c');for(let i=0;i<6;i++){const fruit=new T.Mesh(new T.SphereGeometry(.115,7,6),mat(['#ffc432','#f06b26','#62ad40'][(col+row)%3]));fruit.position.set(xx-.22+(i%3)*.22,1.27,zz-.14+Math.floor(i/3)*.27);g.add(fruit)}}
  }else{ // Clothing/table shop: colorful folded garments and hanging shirts.
   for(let i=0;i<8;i++){const color=['#ef5e88','#368cd4','#e9bf3c','#7d54b4'][i%4];box(g,-1+i%4*.66,1.18+Math.floor(i/4)*.04,-.33+Math.floor(i/4)*.6,.53,.14,.43,color)}
   box(g,0,2.05,-.62,2.45,.045,.045,'#7f9296');for(let i=0;i<3;i++){const xx=-.8+i*.8;box(g,xx,1.76,-.64,.44,.55,.09,['#3c9aaf','#e85c4f','#f3c845'][i]);box(g,xx,1.95,-.64,.7,.14,.09,['#3c9aaf','#e85c4f','#f3c845'][i])}
  }
  label(g,['মামার জুতার ভ্যান','ফল খান, ফুরফুরে থাকুন','কম দামে রঙিন জামা'][kind],0,.76,.87,2.65,.4,'#154c63','#fff3b5');person(g,.9,-1.2,['#e9a638','#3b9ac0','#cc5092'][kind],index%2===0);
 }
 return{shop};
}
