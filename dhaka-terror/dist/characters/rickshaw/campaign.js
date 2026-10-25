import {startBusMission} from '../../mission-network.js';

export const characterId='rickshaw';
export const rickshawMissions=[
 {id:'rickshaw-01',title:['Stop After Stop','স্টপ-পর-স্টপ'],desc:['Pick up passengers at designated stops.','নির্দিষ্ট স্টপে যাত্রী তুলুন।'],objective:'pickup',targetStops:3,startPlaceId:'mirpur12'},
 {id:'rickshaw-02',title:['One More Passenger','আরও একজন যাত্রী'],desc:['Respect safe passenger capacity (max 2).','নিরাপদ যাত্রী ধারনক্ষমতা (সর্বোচ্চ ২) মেনে চলুন।'],objective:'capacity',maxPassengers:2},
 {id:'rickshaw-03',title:['Pay the Fare','ভাড়া দিন'],desc:['Calculate fares and give correct change.','ভাড়া হিসাব করুন এবং ঠিক টাকা ফেরত দিন।'],objective:'fare',calculateChange:true},
 {id:'rickshaw-04',title:['Half Fare','আধা ভাড়া'],desc:['Apply student/elderly concession fairly.','ছাত্র/বয়স্ক দের রিয়ায়ত সঠিকভাবে প্রয়োগ করুন।'],objective:'concession',applyHalf:true},
 {id:'rickshaw-05',title:['Crowded Doorway','ভিড়ে দরজা'],desc:['Keep boarding area clear while passengers board.','যাত্রী ওঠানোর সময় চড়ানোর জায়গা খালি রাখুন।'],objective:'clearance',clearZone:true},
 {id:'rickshaw-06',title:['The 8 A.M. Rush','সকাল ৮-র ঝাঁক'],desc:['Navigate morning congestion without hitting vehicles.','সকালের জ্যামে যানবাহন ছোঁয়া ছাড়া যান।'],objective:'rush',trafficDensity:'high'},
 {id:'rickshaw-06b',title:['School Dismissal Bell','স্কুলের ছুটির ঘণ্টা'],desc:['Protect children and keep crossings clear.','শিশুদের রক্ষা করুন এবং পারাপার খালি রাখুন।'],objective:'school',protectChildren:true},
 {id:'rickshaw-07',title:['Office-Hour Traffic Jam','অফিস-আওয়ার জ্যাম'],desc:['Navigate a busy intersection safely.','ব্যস্ত চৌরস্তা নিরাপদে পার করুন।'],objective:'intersection',junction:'circle'},
 {id:'rickshaw-08',title:['Sudden Rain','হঠাৎ বৃষ্টি'],desc:['Adjust speed for wet roads and reduced visibility.','বৃষ্টিতে গতি কমান এবং দূরত্ব সীমিত থাকুন।'],objective:'rain',weather:'rain'},
 {id:'rickshaw-08b',title:['Broken Traffic Signal','ভাঙা ট্রাফিক সিগন্যাল'],desc:['Follow traffic officer hand signals.','ট্রাফিক সার্জেন্টের হাতের সংকেত মেনে চলুন।'],objective:'officer',followOfficer:true},
 {id:'rickshaw-09',title:['Phone Distraction','ফোনের ব্যস্ততা'],desc:['Avoid phone use while moving.','চলার সময় ফোন ব্যবহার করবেন না।'],objective:'nophone',noPhone:true},
 {id:'rickshaw-10',title:['A Newly Cut Road','নতুন কাটা রাস্তা'],desc:['Find alternative route around construction.','নির্মাণাধীন এলাকা এড়িয়ে বিকল্প পথ ধরুন।'],objective:'detour',construction:true},
 {id:'rickshaw-11',title:['Broken Road','ভাঙা রাস্তা'],desc:['Identify potholes and choose safer path.','গড়া চিহ্নিত করে নিরাপদ পথ বেছে নিন।'],objective:'potholes',potholes:true},
 {id:'rickshaw-12',title:['Market Day','বাজার দিন'],desc:['Navigate shoppers, vendors, and crowds.','কেনাকাটা, বিক্রেতা ও ভিড় নিয়ন্ত্রণ করুন।'],objective:'market',marketDay:true},
 {id:'rickshaw-12b',title:['Religious Festival Crowd','ধার্মিক উৎসবের ভিড়'],desc:['Move patiently through festival congestion.','উৎসবের জ্যামে ধৈর্যের সাথে যান।'],objective:'festival',festival:true},
 {id:'rickshaw-13',title:['Wrong Parking','ভুল পার্কিং'],desc:['Navigate around illegally parked vehicle.','অবৈধ পার্ক করা গাড়ি এড়িয়ে যান।'],objective:'parking',blocked:true},
 {id:'rickshaw-13b',title:['A Visitor Needs Help','দর্শককে সাহায্য'],desc:['Give correct directions to a visitor.','দর্শককে সঠিক দিকনির্দেশনা দিন।'],objective:'directions',giveDirections:true},
 {id:'rickshaw-14',title:['Eid Crowd','ঈদের ভিড়'],desc:['Handle holiday congestion responsibly.','ঈদের জ্যামে দায়ি�্বপূর্ণভাবে যান।'],objective:'eid',eid:true},
 {id:'rickshaw-15',title:['Last Trip at Night','রাতে শেষ ট্রিপ'],desc:['Navigate in low light with proper lamp.','রাতে ল্যাম্প জ্বালিয়ে নিরাপদে যান।'],objective:'night',night:true},
 {id:'rickshaw-15b',title:['Footpath Versus Road','ফুটপাথ বনাম রাস্তা'],desc:['Respect pedestrian space, avoid footpath.','পথচারীদের জায়গা মেনে চলুন, ফুটপাত এড়িয়ে যান।'],objective:'footpath',respectFootpath:true},
 {id:'rickshaw-16',title:['Just One Minute','সির্ফ এক মিনিট'],desc:['Resist rushing, choose safe action over speed.','তাড়া না করে নিরাপদ কর্ম বেছে নিন।'],objective:'patience',noRush:true},
 {id:'rickshaw-16b',title:['The VIP\'s Car','ভিআইপির গাড়ি'],desc:['Treat all road users fairly.','সব রাস্তা ব্যবহারকারীকে ন্যায়সঙ্গতভাবে বিবেচনা করুন।'],objective:'fairness',fairPlay:true},
 {id:'rickshaw-17',title:['Brother, Move a Little','ভাই, একটু সরো'],desc:['Share road space appropriately.','রাস্তার জায়গা সুনির্দিষ্ট ভাগ করুন।'],objective:'sharing',shareSpace:true},
 {id:'rickshaw-17b',title:['Mega-Jam Combo','মেগা-জ্যাম কোম্বো'],desc:['Handle multiple obstacles simultaneously.','একসাথে একাধিক বাধা নিয়ন্ত্রণ করুন।'],objective:'combo',multiObstacle:true},
 {id:'rickshaw-18',title:['Dhaka Finale','ঢাকা ফাইনাল'],desc:['Complete multi-step challenge combining all skills.','সব দক্ষতা একসাথে ব্যবহার করে চ্যালেঞ্জ সম্পন্ন করুন।'],objective:'finale',multiStep:true},
];

// Basic shared-city driving. Rickshaw-specific missions belong in this directory.
export function start(options={}){return startBusMission({...options,characterId})}
