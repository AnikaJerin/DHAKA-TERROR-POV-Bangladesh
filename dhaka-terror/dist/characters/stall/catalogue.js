// Product catalogue for the standalone footpath shop game.
export const CATALOGUE=[
 {id:'chips',   name:['Chips packet','চিপসের প্যাকেট'],    price:20, cost:10,  stock:12,  category:'snack',  color:'#e86b6b'},
 {id:'biscuit', name:['Biscuit packet','বিস্কুটের প্যাকেট'], price:10, cost:5,   stock:18,  category:'snack',  color:'#e8a86b'},
  {id:'chocolate',name:['Chocolate bar','চকলেটের বার'],            price:30, cost:15,  stock:8,   category:'sweet',  color:'#a86be8'},
  {id:'candy',   name:['Candy','ক্যান্ডি'],                         price:5,  cost:2,   stock:30,  category:'sweet',  color:'#6bb8e8'},
  {id:'gum',     name:['Chewing gum','টোপস গাম'],                  price:5,  cost:2,   stock:24,  category:'sweet',  color:'#6be8a8'},
  {id:'water',   name:['Bottled water','পানির বোতল'],             price:20, cost:10,  stock:10,  category:'drink', color:'#6bb8e8'},
  {id:'soda',    name:['Soft drink','সফট ড্রিংক'],                price:30, cost:14,  stock:8,   category:'drink', color:'#e86b6b'},
  {id:'juice',   name:['Juice box','জুসের বক্স'],                 price:20, cost:10,  stock:8,   category:'drink', color:'#e8e86b'}
];
export function freshInventory(){ return CATALOGUE.map(p=>({...p, stock:p.stock})); }
export function productById(id){ return CATALOGUE.find(p=>p.id===id); }