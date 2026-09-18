/* International Fest 2026, Loyola University New Orleans (ISA)
   Fuente: "International Festival Sign Up Fall 2026 (Responses).xlsx" + registro de programas (2026-09-10)
   Generado y revisado a mano el 2026-09-11. Una fila por mesa. South Korea viene de dos inscripciones fusionadas. */

const CONTINENTS = [
  { id: 'north-america', name: 'North America & the Caribbean', short: 'N. America', color: '#E8562A', ink: '#5A1B06', emoji: '🌎' },
  { id: 'south-america', name: 'South America',                 short: 'S. America', color: '#F2A93B', ink: '#5A3B04', emoji: '🌴' },
  { id: 'europe',        name: 'Europe',                        short: 'Europe',     color: '#2FA396', ink: '#0C3B36', emoji: '🏰' },
  { id: 'asia',          name: 'Asia',                          short: 'Asia',       color: '#D4457E', ink: '#4E0F2B', emoji: '🏮' },
  { id: 'africa',        name: 'Africa',                        short: 'Africa',     color: '#7FA63F', ink: '#2C3B10', emoji: '🦁' },
  { id: 'oceania',       name: 'Oceania',                       short: 'Oceania',    color: '#3E7FA8', ink: '#0F2E3F', emoji: '🐨' }
];

/* === INICIO TABLES: lo genera scripts/sync.js. No editar a mano. === */
const TABLES = [
  { id:"costa-rica", type:"country", name:"Costa Rica", iso:"cr", emoji:"🇨🇷", continent:"north-america", hosts:["Juliana Jimenez","Piper"], emails:["Jjimenez@my.loyno.edu"], phone:"(504) 409-8545", phoneHref:"+15044098545", activities:"Music and flag", food:"Arroz con pollo", heating:true, signedUp:"2026-08-28", notes:"" },

  { id:"dominican-republic", type:"country", name:"Dominican Republic", iso:"do", emoji:"🇩🇴", continent:"north-america", hosts:["Nikol Fernandez"], emails:["nvfernan@my.loyno.edu"], phone:"(504) 326-4990", phoneHref:"+15043264990", activities:"Dominican flag and music", food:"Yaroa y pastelitos", heating:true, signedUp:"2026-09-15", notes:"" },

  { id:"el-salvador", type:"country", name:"El Salvador", iso:"sv", emoji:"🇸🇻", continent:"north-america", hosts:["Lala Angelucci","Juan Pablo Rivas","Rodrigo Samour"], emails:["rsamour@my.loyno.edu"], phone:"(504) 547-5027", phoneHref:"+15045475027", activities:"Food and great info", food:"Pupusas", heating:true, signedUp:"2026-09-14", notes:"" },

  { id:"guatemala", type:"country", name:"Guatemala", iso:"gt", emoji:"🇬🇹", continent:"north-america", hosts:["Pili Chen"], emails:["mchenbu@my.loyno.edu"], phone:"(504) 206-7945", phoneHref:"+15042067945", activities:"", food:"Paletas", heating:false, signedUp:"2026-09-02", notes:"" },

  { id:"haiti", type:"country", name:"Haiti", iso:"ht", emoji:"🇭🇹", continent:"north-america", hosts:["Zoe Desrouleaux"], emails:["zsdesrou@my.loyno.edu"], phone:"(954) 261-6599", phoneHref:"+19542616599", activities:"Flags, music, Haitian food", food:"Griot, rice, pâté, plantains, soda", heating:true, signedUp:"2026-09-15", notes:"" },

  { id:"honduras", type:"country", name:"Honduras", iso:"hn", emoji:"🇭🇳", continent:"north-america", hosts:["Emely Velasquez","Lauren Irias"], emails:["lsirias@my.loyno.edu"], phone:"(786) 813-7285", phoneHref:"+17868137285", activities:"Flag, music", food:"Baleadas and maybe zambos preparados", heating:true, signedUp:"2026-08-25", notes:"" },

  { id:"jamaica", type:"country", name:"Jamaica", iso:"jm", emoji:"🇯🇲", continent:"north-america", hosts:["Evon Gocan","Thandie Sampson","Ryan Ramson"], emails:["elgocan@my.loyno.edu","Tnsampso@my.loyno.edu"], phone:"(216) 470-3820", phoneHref:"+12164703820", activities:"Not completely sure yet but definitely music and food for now", food:"Jerk Chicken, Beef Patties", heating:true, signedUp:"2026-09-15", notes:"2 separate sign-ups merged into one table. Evon may bring more people." },

  { id:"mexico", type:"country", name:"México", iso:"mx", emoji:"🇲🇽", continent:"north-america", hosts:["Matías jurado","Emilio Rodríguez"], emails:["earodri1@my.loyno.edu"], phone:"(832) 389-4626", phoneHref:"+18323894626", activities:"Flag, music, food", food:"Tbd: tacos", heating:true, signedUp:"2026-09-04", notes:"" },

  { id:"nicaragua", type:"country", name:"Nicaragua", iso:"ni", emoji:"🇳🇮", continent:"north-america", hosts:["Jorge Incer","Jan Perner","Juan Pablo valle","Gonzalo pertz","Ariana Espinoza"], emails:["jperner@my.loyno.edu"], phone:"(504) 427-6538", phoneHref:"+15044276538", activities:"Food,flags,music", food:"Fritanga nica", heating:true, signedUp:"2026-09-06", notes:"" },

  { id:"panama", type:"country", name:"Panama", iso:"pa", emoji:"🇵🇦", continent:"north-america", hosts:["Jorge Alcedo"], emails:["jealcedo@my.loyno.edu"], phone:"(504) 841-8918", phoneHref:"+15048418918", activities:"Food and music", food:"Guacho con patacones", heating:true, signedUp:"2026-08-28", notes:"" },

  { id:"puerto-rico", type:"country", name:"Puerto Rico", iso:"pr", emoji:"🇵🇷", continent:"north-america", hosts:["Gabriel Calero","Kai"], emails:["Gecalero@my.loyno.edu"], phone:"(787) 508-8621", phoneHref:"+17875088621", activities:"Music, maybe flags", food:"TBD", heating:true, signedUp:"2026-09-02", notes:"" },

  { id:"oaxaca-mexico-summer-program", type:"program", name:"Oaxaca, Mexico Summer Program", iso:"mx", emoji:"🇲🇽", continent:"north-america", hosts:["Diana Soto-Olson"], emails:["dsotools@loyno.edu"], phone:"", phoneHref:"", activities:"Country flag and program tablecloth", food:"Pastel de tres leches or icicles", heating:false, signedUp:"2026-09-17", setup:"No special equipment needed", notes:"Loyola summer program in Oaxaca. Asked for a spot out of the sun, so her snack doesn't suffer." },

  { id:"argentina", type:"country", name:"Argentina", iso:"ar", emoji:"🇦🇷", continent:"south-america", hosts:["Isaac Valarezo"], emails:["jivalare@my.loyno.edu"], phone:"(504) 478-8141", phoneHref:"+15044788141", activities:"", food:"Empanadas", heating:null, signedUp:"2026-09-19", notes:"Also the coolest table with the coolest host. Yes, same guy. 😎" },

  { id:"bolivia", type:"country", name:"Bolivia", iso:"bo", emoji:"🇧🇴", continent:"south-america", hosts:["Valentina Rojas","Bianca Harris"], emails:["bmharris@my.loyno.edu"], phone:"(682) 702-5507", phoneHref:"+16827025507", activities:"Flags, food", food:"Cuñapes, candy", heating:false, signedUp:"2026-09-11", notes:"Submitting on behalf of someone else who will be present." },

  { id:"brazil", type:"country", name:"Brazil", iso:"br", emoji:"🇧🇷", continent:"south-america", hosts:["Maria Eduarda Nastarino Leite","Cléo","Sabryne (maybe)","Tatiana (maybe)"], emails:["mnleite@my.loyno.edu"], phone:"+1 (504) 657-9496", phoneHref:"+15046579496", activities:"Food and flags", food:"", heating:true, signedUp:"2026-09-01", notes:"" },

  { id:"colombia", type:"country", name:"Colombia", iso:"co", emoji:"🇨🇴", continent:"south-america", hosts:["Maria Guzman"], emails:["mariajose.guzpar08@gmail.com"], phone:"(803) 543-8604", phoneHref:"+18035438604", activities:"flag, food", food:"arepas", heating:true, signedUp:"2026-09-16", notes:"" },

  { id:"ecuador", type:"country", name:"Ecuador", iso:"ec", emoji:"🇪🇨", continent:"south-america", hosts:["Sofia Costa","Valentina Mosquera"], emails:["smcosta@my.loyno.edu"], phone:"(504) 892-3132", phoneHref:"+15048923132", activities:"flags, music", food:"Tigrillo", heating:true, signedUp:"2026-09-10", notes:"Submitting on behalf of someone else who will be present." },

  { id:"peru", type:"country", name:"Peru", iso:"pe", emoji:"🇵🇪", continent:"south-america", hosts:["Gabriella Berges Lazo"], emails:["gberges@my.loyno.edu"], phone:"(516) 329-0702", phoneHref:"+15163290702", activities:"Games, Food, Music, Drinks", food:"Arroz chaufa and chicha morada (juice)", heating:true, signedUp:"2026-08-27", notes:"" },

  { id:"venezuela", type:"country", name:"Venezuela", iso:"ve", emoji:"🇻🇪", continent:"south-america", hosts:["Leon Mitski","Pablo Piñeiro"], emails:["ppineiro@my.loyno.edu"], phone:"(689) 342-3002", phoneHref:"+16893423002", activities:"Food, flag", food:"", heating:true, signedUp:"2026-09-04", notes:"The preferred e-mail on the form read ppineirl@, one letter off from the Loyola account. Using ppineiro@my.loyno.edu; worth confirming." },

  { id:"austria", type:"country", name:"Austria", iso:"at", emoji:"🇦🇹", continent:"europe", hosts:["Jakob Brigola","Alex","Victoria"], emails:["jbbrigol@my.loyno.edu"], phone:"+1 (213) 589-8111", phoneHref:"+12135898111", activities:"Austria flag and an alcohol-free Austrian beer stein holding contest", food:"Schnitzel, Kaiserschmarrn and Apfelstrudel", heating:true, signedUp:"2026-09-08", notes:"" },

  { id:"denmark", type:"country", name:"Denmark", iso:"dk", emoji:"🇩🇰", continent:"europe", hosts:["Martin Ashworth"], emails:["mnashwor@my.loyno.edu"], phone:"+4529281188", phoneHref:"+4529281188", activities:"Food", food:"Rugbrød, pastries", heating:false, signedUp:"2026-09-15", notes:"" },

  { id:"france", type:"country", name:"France", iso:"fr", emoji:"🇫🇷", continent:"europe", hosts:["Camille Baldach-Lefebvre","Augustin Patte","Alexandre Perfettini","Yann Sittler","Samuel Marin"], emails:["smarin@my.loyno.edu"], phone:"+33781868184", phoneHref:"+33781868184", activities:"Don't know yet", food:"Don't know yet", heating:true, signedUp:"2026-09-02", notes:"" },

  { id:"germany", type:"country", name:"Germany", iso:"de", emoji:"🇩🇪", continent:"europe", hosts:["Brian Wilkins","Sonja Höning","Benita Veyhelmann","a few more pending"], emails:["Bdwilkin@my.loyno.edu"], phone:"(201) 724-2276", phoneHref:"+12017242276", activities:"Not sure yet", food:"Lots of German food of all types", heating:true, signedUp:"2026-09-02", notes:"Signed up as “Deutschland (Germany)”." },

  { id:"hungary", type:"country", name:"Hungary", iso:"hu", emoji:"🇭🇺", continent:"europe", hosts:["Anna Nagy","Alexander Radics"], emails:["aznagy@my.loyno.edu"], phone:"(504) 300-7795", phoneHref:"+15043007795", activities:"We are planning to play music and we would like a flag", food:"We are planning to bake dessert", heating:false, signedUp:"2026-09-12", notes:"" },

  { id:"italy", type:"country", name:"Italy", iso:"it", emoji:"🇮🇹", continent:"europe", hosts:["Alessandro Conta","Enrico","Francesca","Giacomo","Pietro"], emails:["alessandroconta50@gmail.com"], phone:"+393341147095", phoneHref:"+393341147095", activities:"", food:"", heating:null, signedUp:"2026-09-01", notes:"" },

  { id:"latvia", type:"country", name:"Latvia", iso:"lv", emoji:"🇱🇻", continent:"europe", hosts:["Markuss Sipko"], emails:["msipko@my.loyno.edu"], phone:"+1 (504) 210-9625", phoneHref:"+15042109625", activities:"No idea, andrea forced me to😂", food:"Not sure how to get my type of food here.", heating:false, signedUp:"2026-09-03", notes:"Solo host, a good table to pair with a neighbour." },

  { id:"romania", type:"country", name:"Romania", iso:"ro", emoji:"🇷🇴", continent:"europe", hosts:["Luciana Flavia Tanase Marziano"], emails:["lftanase@my.loyno.edu"], phone:"(504) 532-5348", phoneHref:"+15045325348", activities:"flag and music", food:"Mămăligă", heating:true, signedUp:"2026-09-04", notes:"" },

  { id:"spain", type:"country", name:"Spain", iso:"es", emoji:"🇪🇸", continent:"europe", hosts:["Fátima Pérez","Nicolás Villegas Mato","Lucía Martínez","Miguel Ardid","Miguel Benjumea","Jose Catala","Gonzalo Jimenez"], emails:["fperezd@my.loyno.edu","nvillega@my.loyno.edu"], phone:"+34622099902", phoneHref:"+34622099902", activities:"Music, food and flags", food:"Tortilla de patatas", heating:false, signedUp:"2026-09-15", notes:"2 separate sign-ups merged into one table." },

  { id:"switzerland", type:"country", name:"Switzerland", iso:"ch", emoji:"🇨🇭", continent:"europe", hosts:["Lukas Buerkler"], emails:["lukas.buerkler@bluewin.ch"], phone:"+41787289050", phoneHref:"+41787289050", activities:"Flags, music", food:"tbd", heating:true, signedUp:"2026-09-09", notes:"" },

  { id:"turkiye", type:"country", name:"Türkiye", iso:"tr", emoji:"🇹🇷", continent:"europe", hosts:["Ece Tanriverdi"], emails:["etanrive@my.loyno.edu"], phone:"(412) 370-7416", phoneHref:"+14123707416", activities:"flags and foods and music", food:"I am working on it", heating:true, signedUp:"2026-09-09", notes:"Transcontinental, grouped under Europe for the fest." },

  { id:"united-kingdom", type:"country", name:"United Kingdom", iso:"gb", emoji:"🇬🇧", continent:"europe", hosts:["Fin Jones"], emails:["ffjones@my.loyno.edu"], phone:"(910) 818-3211", phoneHref:"+19108183211", activities:"English flag (St George's cross), music from England", food:"Tea and biscuits", heating:false, signedUp:"2026-09-17", notes:"Signed up as “England”." },

  { id:"iceland", type:"program", name:"Iceland", iso:"is", emoji:"🇮🇸", continent:"europe", hosts:["Tracey Watts"], emails:["tawatts@loyno.edu"], phone:"", phoneHref:"", activities:"Country flag and program tablecloth", food:"None", heating:false, signedUp:"2026-09-10", setup:"No special equipment needed", neighbour:"summer-in-prague-vienna-budapest", notes:"Loyola study abroad program." },

  { id:"loyola-s-ireland-program", type:"program", name:"Loyola's Ireland Program", iso:"ie", emoji:"🇮🇪", continent:"europe", hosts:["Natasha Bingham","Kevin Rabalais","Emily Capdeville"], emails:["nbingham@loyno.edu","klrabal1@loyno.edu","ecapdevi@loyno.edu"], phone:"", phoneHref:"", activities:"Country flag and program tablecloth", food:"Not available at the time", heating:false, signedUp:"2026-09-14", setup:"No special equipment needed", notes:"Loyola study abroad program. Would like to sit near Emily and Kevin's programs." },

  { id:"spain-dual-degree-program", type:"program", name:"Spain Dual Degree Program", iso:"es", emoji:"🇪🇸", continent:"europe", hosts:["Fiorella Fillippini"], emails:["fnfillip@my.loyno.edu"], phone:"", phoneHref:"", activities:"", food:"", heating:null, signedUp:"", neighbour:"spain", notes:"Loyola dual degree program." },

  { id:"summer-in-prague-vienna-budapest", type:"program", name:"Summer in Prague / Vienna / Budapest", iso:"cz", emoji:"🇨🇿", continent:"europe", hosts:["Tracey Watts","Justin Nystrom","Kevin Rabalais"], emails:["tawatts@loyno.edu","jnystrom@loyno.edu","klrabal1@loyno.edu"], phone:"", phoneHref:"", activities:"Country flag and program tablecloth", food:"Justin Nystrom will be bringing something with poppy seeds!", heating:false, signedUp:"2026-09-10", setup:"No special equipment needed", neighbour:"iceland", notes:"Loyola study abroad program." },

  { id:"india", type:"country", name:"India", iso:"in", emoji:"🇮🇳", continent:"asia", hosts:["Presha Shanthamoorthi","Aaliyah Achary","Aryan Patel","Poojyatha","Shivika"], emails:["pshantha@my.loyno.edu"], phone:"(504) 444-6506", phoneHref:"+15044446506", activities:"", food:"", heating:null, signedUp:"2026-09-02", notes:"Presha may bring more people." },

  { id:"japan", type:"country", name:"Japan", iso:"jp", emoji:"🇯🇵", continent:"asia", hosts:["Isaac Valarezo"], emails:["jivalare@my.loyno.edu"], phone:"(504) 478-8141", phoneHref:"+15044788141", activities:"", food:"Sushi & Pokis", heating:null, signedUp:"2026-09-18", notes:"The coolest table with the coolest host. 😎" },

  { id:"nepal", type:"country", name:"Nepal", iso:"np", emoji:"🇳🇵", continent:"asia", hosts:["Shivika Sharma","Priyanka Ghimire"], emails:["ssharma@my.loyno.edu"], phone:"(504) 505-3896", phoneHref:"+15045053896", activities:"Food", food:"Not yet decided", heating:false, signedUp:"2026-09-11", notes:"Phone came in as “+(504) 5053896”; read as a New Orleans number. Worth confirming." },

  { id:"south-korea", type:"country", name:"South Korea", iso:"kr", emoji:"🇰🇷", continent:"asia", hosts:["Gaeun Kim","Chaehyun Yoon","Luda Lee","Younseo Song","Chaeyun Hwang","Eunjoo Lee"], emails:["elee1@my.loyno.edu"], phone:"(504) 408-4742", phoneHref:"+15044084742", activities:"games", food:"", heating:false, signedUp:"2026-09-05", notes:"" },

  { id:"vietnam", type:"country", name:"Vietnam", iso:"vn", emoji:"🇻🇳", continent:"asia", hosts:["Jett Nguyen","Claire Luig"], emails:["jettnguyen0707@gmail.com"], phone:"(337) 706-4055", phoneHref:"+13377064055", activities:"Food", food:"Egg rolls and spring rolls", heating:false, signedUp:"2026-09-06", notes:"" },

  { id:"india-j-term-2027", type:"program", name:"India J-Term 2027", iso:"in", emoji:"🇮🇳", continent:"asia", hosts:["Program representative"], emails:["jcoday@loyno.edu"], phone:"", phoneHref:"", activities:"Country flag and program tablecloth", food:"Undecided", heating:false, signedUp:"2026-09-14", setup:"No special equipment needed", notes:"Loyola study abroad program. The form named the host only as “Me”; the name is still to confirm." },

  { id:"south-korea-summer-program", type:"program", name:"South Korea Summer Program", iso:"kr", emoji:"🇰🇷", continent:"asia", hosts:["Shiloh Grace"], emails:["Sggerlac@gmail.com"], phone:"(504) 952-3706", phoneHref:"+15049523706", activities:"", food:"", heating:null, signedUp:"2026-09-10", notes:"Loyola summer program. Signed up on the student form; kept apart from the South Korea country table." },

  { id:"south-africa", type:"country", name:"South Africa", iso:"za", emoji:"🇿🇦", continent:"africa", hosts:["Que Fortune"], emails:["cqfortun@my.loyno.edu"], phone:"(515) 302-0553", phoneHref:"+15153020553", activities:"Flags, history, music knowledge", food:"Undecided: maybe milk tart or pickled fish", heating:false, signedUp:"2026-08-31", notes:"" },

  { id:"tanzania", type:"country", name:"Tanzania", iso:"tz", emoji:"🇹🇿", continent:"africa", hosts:["Alunda Chikawe","Veronica Ishengoma"], emails:["vvisheng@my.loyno.edu"], phone:"+1 (504) 940-4305", phoneHref:"+15049404305", activities:"Flag, Music", food:"TBD", heating:true, signedUp:"2026-09-04", notes:"" },

  { id:"australia", type:"country", name:"Australia", iso:"au", emoji:"🇦🇺", continent:"oceania", hosts:["Milo Hershman","Flynn Martinez-Briggs"], emails:["mlhershm@my.loyno.edu"], phone:"(504) 416-2194", phoneHref:"+15044162194", activities:"Food/ music/ games", food:"Australian snacks", heating:false, signedUp:"2026-08-27", notes:"" }
];
/* === FIN TABLES === */

const FEST = {
  title: "Loyola's International Fest",
  host: 'Brought to you by ISA',
  date: 'September 30th, 2026',
  time: '3:30 – 5:00 PM',
  place: 'Peace Quad',
  contact: 'isa@loyno.edu',
  sponsors: 'Larry & Anna Davis'
};
