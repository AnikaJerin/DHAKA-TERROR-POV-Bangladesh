// Customer order generator and management for the standalone footpath shop game.
import {CATALOGUE} from './catalogue.js';

export function productById(id){ return CATALOGUE.find(p=>p.id===id); }

const CUSTOMERS=[
 {name:['Uncle','আল্লাহ ভাই'],   shirt:'#ceac68'},
 {name:['Aunty','আন্টি'],          shirt:'#d896c8'},
 {name:['Boy','লেলে ভাই'],         shirt:'#6bb8e8'},
 {name:['Girl','মেয়ে ভাই'],       shirt:'#e8a86b'},
 {name:['Office guy','অফিসের ভাই'],shirt:'#2a4a41'},
 {name:['Student','ছাত্র'],        shirt:'#a86be8'}
];

export function randomCustomer(){
 const c=CUSTOMERS[Math.floor(Math.random()*CUSTOMERS.length)];
 return {id:'c'+Math.random().toString(36).slice(2,8), ...c, patience:26};
}

export function randomOrder(){
 const n=1+Math.floor(Math.random()*3);
 const items=[];
 const pool=[...CATALOGUE];
 for(let i=0;i<n && pool.length;i++){
  const idx=Math.floor(Math.random()*pool.length);
  const p=pool[idx];
  const qty=1+Math.floor(Math.random()*Math.min(3,p.stock));
  items.push({id:p.id, qty});
  pool.splice(idx,1);
 }
 return items;
}

export function orderTotal(items){
 return items.reduce((s,i)=>{const p=productById(i.id); return s+(p?p.price:0)*i.qty;},0);
}

export function hasStock(id,qty,inventory){
 const item=inventory.find(i=>i.id===id);
 return !!item && item.stock>=qty;
}

export function canFulfill(items,inventory){
 return items.every(i=>hasStock(i.id,i.qty,inventory));
}

export function applyOrder(items,inventory){
 items.forEach(i=>{const it=inventory.find(x=>x.id===i.id); if(it) it.stock-=i.qty;});
}