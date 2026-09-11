/* International Fest 2026 — Loyola University New Orleans (ISA)
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

const TABLES = [
  { id:'mexico', type:'country', name:'México', iso:'mx', emoji:'🇲🇽', continent:'north-america',
    hosts:['Emilio Rodríguez','Matías Jurado'], emails:['earodri1@my.loyno.edu'],
    phone:'(832) 389-4626', phoneHref:'+18323894626',
    activities:'Flag, music, food', food:'TBD: tacos', heating:true, signedUp:'2026-09-04', notes:'' },

  { id:'guatemala', type:'country', name:'Guatemala', iso:'gt', emoji:'🇬🇹', continent:'north-america',
    hosts:['Pili Chen'], emails:['mchenbu@my.loyno.edu'],
    phone:'(504) 206-7945', phoneHref:'+15042067945',
    activities:'', food:'Paletas', heating:false, signedUp:'2026-09-02', notes:'' },

  { id:'honduras', type:'country', name:'Honduras', iso:'hn', emoji:'🇭🇳', continent:'north-america',
    hosts:['Lauren Irias','Emely Velasquez'], emails:['lsirias@my.loyno.edu'],
    phone:'(786) 813-7285', phoneHref:'+17868137285',
    activities:'Flag, music', food:'Baleadas and maybe zambos preparados', heating:true, signedUp:'2026-08-25', notes:'' },

  { id:'nicaragua', type:'country', name:'Nicaragua', iso:'ni', emoji:'🇳🇮', continent:'north-america',
    hosts:['Jorge Incer','Jan Perner','Juan Pablo Valle','Gonzalo Pertz','Ariana Espinoza'], emails:['jperner@my.loyno.edu'],
    phone:'(504) 427-6538', phoneHref:'+15044276538',
    activities:'Food, flags, music', food:'Fritanga nica', heating:true, signedUp:'2026-09-06', notes:'' },

  { id:'costa-rica', type:'country', name:'Costa Rica', iso:'cr', emoji:'🇨🇷', continent:'north-america',
    hosts:['Juliana Jimenez','Piper'], emails:['Jjimenez@my.loyno.edu'],
    phone:'(504) 409-8545', phoneHref:'+15044098545',
    activities:'Music and flag', food:'Arroz con pollo', heating:true, signedUp:'2026-08-28', notes:'' },

  { id:'panama', type:'country', name:'Panama', iso:'pa', emoji:'🇵🇦', continent:'north-america',
    hosts:['Jorge Alcedo'], emails:['jealcedo@my.loyno.edu'],
    phone:'(504) 841-8918', phoneHref:'+15048418918',
    activities:'Food and music', food:'Guacho con patacones', heating:true, signedUp:'2026-08-28', notes:'' },

  { id:'puerto-rico', type:'country', name:'Puerto Rico', iso:'pr', emoji:'🇵🇷', continent:'north-america',
    hosts:['Gabriel Calero','Kai'], emails:['Gecalero@my.loyno.edu'],
    phone:'(787) 508-8621', phoneHref:'+17875088621',
    activities:'Music, maybe flags', food:'TBD', heating:true, signedUp:'2026-09-02', notes:'' },

  { id:'brazil', type:'country', name:'Brazil', iso:'br', emoji:'🇧🇷', continent:'south-america',
    hosts:['Maria Eduarda Nastarino Leite','Cléo','Sabryne (maybe)','Tatiana (maybe)'], emails:['mnleite@my.loyno.edu'],
    phone:'+1 (504) 657-9496', phoneHref:'+15046579496',
    activities:'Food and flags', food:'', heating:true, signedUp:'2026-09-01', notes:'' },

  { id:'peru', type:'country', name:'Peru', iso:'pe', emoji:'🇵🇪', continent:'south-america',
    hosts:['Gabriella Berges Lazo'], emails:['gberges@my.loyno.edu'],
    phone:'(516) 329-0702', phoneHref:'+15163290702',
    activities:'Games, food, music, drinks', food:'Arroz chaufa and chicha morada (juice)', heating:true, signedUp:'2026-08-27', notes:'' },

  { id:'ecuador', type:'country', name:'Ecuador', iso:'ec', emoji:'🇪🇨', continent:'south-america',
    hosts:['Sofia Costa','Valentina Mosquera'], emails:['smcosta@my.loyno.edu'],
    phone:'(504) 892-3132', phoneHref:'+15048923132',
    activities:'Flags, music', food:'Tigrillo', heating:true, signedUp:'2026-09-10',
    notes:'Submitted on behalf of someone else who will be present.' },

  { id:'venezuela', type:'country', name:'Venezuela', iso:'ve', emoji:'🇻🇪', continent:'south-america',
    hosts:['Pablo Piñeiro','Leon Mitski'], emails:['ppineiro@my.loyno.edu'],
    phone:'(689) 342-3002', phoneHref:'+16893423002',
    activities:'Food, flag', food:'', heating:true, signedUp:'2026-09-04',
    notes:'The preferred e-mail on the form read ppineirl@ — one letter off from the Loyola account. Using ppineiro@my.loyno.edu; worth confirming.' },

  { id:'italy', type:'country', name:'Italy', iso:'it', emoji:'🇮🇹', continent:'europe',
    hosts:['Alessandro Conta','Enrico','Francesca','Giacomo','Pietro'], emails:['alessandroconta50@gmail.com'],
    phone:'+39 334 114 7095', phoneHref:'+393341147095',
    activities:'', food:'', heating:null, signedUp:'2026-08-31', notes:'' },

  { id:'germany', type:'country', name:'Germany', iso:'de', emoji:'🇩🇪', continent:'europe',
    hosts:['Brian Wilkins','Sonja Höning','Benita Veyhelmann','a few more pending'], emails:['Bdwilkin@my.loyno.edu'],
    phone:'(201) 724-2276', phoneHref:'+12017242276',
    activities:'Not sure yet', food:'Lots of German food of all types', heating:true, signedUp:'2026-09-01',
    notes:'Signed up as “Deutschland (Germany)”.' },

  { id:'france', type:'country', name:'France', iso:'fr', emoji:'🇫🇷', continent:'europe',
    hosts:['Camille Baldach-Lefebvre','Augustin Patte','Alexandre Perfettini','Yann Sittler','Samuel Marin'], emails:['smarin@my.loyno.edu'],
    phone:'+33 7 81 86 81 84', phoneHref:'+33781868184',
    activities:"Don't know yet", food:"Don't know yet", heating:true, signedUp:'2026-09-02', notes:'' },

  { id:'austria', type:'country', name:'Austria', iso:'at', emoji:'🇦🇹', continent:'europe',
    hosts:['Jakob Brigola','Alex','Victoria'], emails:['jbbrigol@my.loyno.edu'],
    phone:'+1 (213) 589-8111', phoneHref:'+12135898111',
    activities:'Austria flag and an alcohol-free Austrian beer stein holding contest', food:'Schnitzel, Kaiserschmarrn and Apfelstrudel', heating:true, signedUp:'2026-09-08', notes:'' },

  { id:'switzerland', type:'country', name:'Switzerland', iso:'ch', emoji:'🇨🇭', continent:'europe',
    hosts:['Lukas Buerkler','TBD'], emails:['lukas.buerkler@bluewin.ch'],
    phone:'+41 78 728 90 50', phoneHref:'+41787289050',
    activities:'Flags, music', food:'TBD', heating:true, signedUp:'2026-09-09', notes:'' },

  { id:'latvia', type:'country', name:'Latvia', iso:'lv', emoji:'🇱🇻', continent:'europe',
    hosts:['Markuss Sipko'], emails:['msipko@my.loyno.edu'],
    phone:'+1 (504) 210-9625', phoneHref:'+15042109625',
    activities:'To be decided', food:'Not sure how to source Latvian food here', heating:false, signedUp:'2026-09-03',
    notes:'Solo host — a good table to pair with a neighbour.' },

  { id:'romania', type:'country', name:'Romania', iso:'ro', emoji:'🇷🇴', continent:'europe',
    hosts:['Luciana Flavia Tanase Marziano'], emails:['lftanase@my.loyno.edu'],
    phone:'(504) 532-5348', phoneHref:'+15045325348',
    activities:'Flag and music', food:'Mămăligă', heating:true, signedUp:'2026-09-04', notes:'' },

  { id:'turkiye', type:'country', name:'Türkiye', iso:'tr', emoji:'🇹🇷', continent:'europe',
    hosts:['Ece Tanriverdi'], emails:['etanrive@my.loyno.edu'],
    phone:'(412) 370-7416', phoneHref:'+14123707416',
    activities:'Flags, food and music', food:'Being worked on', heating:true, signedUp:'2026-09-09',
    notes:'Transcontinental — grouped under Europe for the fest.' },

  { id:'india', type:'country', name:'India', iso:'in', emoji:'🇮🇳', continent:'asia',
    hosts:['Presha Shanthamoorthi','Aaliyah Achary','Aryan Patel','Poojyatha','Shivika','and possibly more'], emails:['pshantha@my.loyno.edu'],
    phone:'(504) 444-6506', phoneHref:'+15044446506',
    activities:'', food:'', heating:null, signedUp:'2026-09-01', notes:'' },

  { id:'south-korea', type:'country', name:'South Korea', iso:'kr', emoji:'🇰🇷', continent:'asia',
    hosts:['Gaeun Kim','Chaehyun Yoon','Luda Lee','Younseo Song','Chaeyun Hwang','Eunjoo Lee','Shiloh Grace'],
    emails:['elee1@my.loyno.edu','Sggerlac@gmail.com'],
    phone:'(504) 408-4742', phoneHref:'+15044084742',
    activities:'Games', food:'', heating:false, signedUp:'2026-09-05',
    notes:'Two separate sign-ups (Eunjoo Lee and Shiloh Grace) merged into one table.' },

  { id:'vietnam', type:'country', name:'Vietnam', iso:'vn', emoji:'🇻🇳', continent:'asia',
    hosts:['Jett Nguyen','Claire Luig'], emails:['jettnguyen0707@gmail.com'],
    phone:'(337) 706-4055', phoneHref:'+13377064055',
    activities:'Food', food:'Egg rolls and spring rolls', heating:false, signedUp:'2026-09-06', notes:'' },

  { id:'nepal', type:'country', name:'Nepal', iso:'np', emoji:'🇳🇵', continent:'asia',
    hosts:['Shivika Sharma','Priyanka Ghimire'], emails:['ssharma@my.loyno.edu'],
    phone:'(504) 505-3896', phoneHref:'+15045053896',
    activities:'Food', food:'Not yet decided', heating:false, signedUp:'2026-09-10', notes:'' },

  { id:'south-africa', type:'country', name:'South Africa', iso:'za', emoji:'🇿🇦', continent:'africa',
    hosts:['Que Fortune'], emails:['cqfortun@my.loyno.edu'],
    phone:'(515) 302-0553', phoneHref:'+15153020553',
    activities:'Flags, history, music knowledge', food:'Undecided — maybe milk tart or pickled fish', heating:false, signedUp:'2026-08-31', notes:'' },

  { id:'tanzania', type:'country', name:'Tanzania', iso:'tz', emoji:'🇹🇿', continent:'africa',
    hosts:['Veronica Ishengoma','Alunda Chikawe'], emails:['vvisheng@my.loyno.edu'],
    phone:'+1 (504) 940-4305', phoneHref:'+15049404305',
    activities:'Flag, music', food:'TBD', heating:true, signedUp:'2026-09-04', notes:'' },

  { id:'australia', type:'country', name:'Australia', iso:'au', emoji:'🇦🇺', continent:'oceania',
    hosts:['Milo Hershman','Flynn Martinez-Briggs'], emails:['mlhershm@my.loyno.edu'],
    phone:'(504) 416-2194', phoneHref:'+15044162194',
    activities:'Food, music, games', food:'Australian snacks', heating:false, signedUp:'2026-08-27', notes:'' },

  { id:'prague-vienna-budapest', type:'program', name:'Summer in Prague / Vienna / Budapest', iso:'cz', emoji:'🇨🇿', continent:'europe',
    hosts:['Tracey Watts','Justin Nystrom','Kevin Rabalais'],
    emails:['tawatts@loyno.edu','jnystrom@loyno.edu','klrabal1@loyno.edu'],
    phone:'', phoneHref:'',
    activities:'Country flag and program tablecloth', food:'Justin Nystrom will be bringing something with poppy seeds', heating:false, signedUp:'2026-09-10',
    setup:'No special equipment needed', neighbour:'iceland',
    notes:'Loyola study abroad program. Asked to be seated next to Iceland.' },

  { id:'iceland', type:'program', name:'Iceland', iso:'is', emoji:'🇮🇸', continent:'europe',
    hosts:['Tracey Watts'], emails:['tawatts@loyno.edu'],
    phone:'', phoneHref:'',
    activities:'Country flag and program tablecloth', food:'None', heating:false, signedUp:'2026-09-10',
    setup:'No special equipment needed', neighbour:'prague-vienna-budapest',
    notes:'Loyola study abroad program. Asked to be seated next to Prague / Vienna / Budapest.' }
];

const FEST = {
  title: "Loyola's International Fest",
  host: 'Brought to you by ISA',
  date: 'September 30th, 2026',
  time: '3:30 – 5:00 PM',
  place: 'Peace Quad',
  contact: 'isa@loyno.edu',
  sponsors: 'Larry & Anna Davis'
};
