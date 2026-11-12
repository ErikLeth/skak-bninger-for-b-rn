const OPENINGS = [
  {
    id: 'italiensk',
    name: 'Det Italienske Spil',
    emoji: '🇮🇹',
    desc: 'Den klassiske og venlige åbning — begge løbere kommer med i kampen med det samme!',
    moves: [
      { m: 'e2e4', note: 'Hvid rykker bonden til e4 — det åbner vejen for løber og dronning!' },
      { m: 'e7e5', note: 'Sort gør det samme: e5!' },
      { m: 'g1f3', note: 'Hvid sætter springeren på f3 og truer e5.' },
      { m: 'b8c6', note: 'Sort forsvarer e5 med springeren. Godt gjort!' },
      { m: 'f1c4', note: 'Hvid peger løberen mod det svage f7-felt!' },
      { m: 'f8c5', note: 'Sort gør det samme mod f2 — pas godt på!' },
      { m: 'c2c3', note: 'Hvid støtter centrum og gør klar til d3.' },
      { m: 'g8f6', note: 'Sort får sin anden springer i spil.' },
      { m: 'd2d3', note: 'Hvid støtter e4 og gør klar til at rokere.' },
      { m: 'd7d6', note: 'Sort styrker også sit centrum. Sådan bygger man en stilling op!' }
    ]
  },
  {
    id: 'siciliansk',
    name: 'Siciliansk Forsvar',
    emoji: '🌶️',
    desc: 'Sort svarer ikke e5, men c5 — det bliver et spændende slagsmål om centrum!',
    moves: [
      { m: 'e2e4', note: 'Hvid åbner med e4.' },
      { m: 'c7c5', note: 'Sort spiller c5 — ikke e5! Nu kæmper I om centrum på en helt ny måde.' },
      { m: 'g1f3', note: 'Hvid vil gerne spille d4 og åbne stillingen.' },
      { m: 'd7d6', note: 'Sort gør klar til at få løberen ud.' },
      { m: 'd2d4', note: 'Hvid åbner centrum med d4!' },
      { m: 'c5d4', note: 'Sort slår med det samme — "x" betyder slag!' },
      { m: 'f3d4', note: 'Hvid slår igen. Springeren står rigtig godt på d4.' },
      { m: 'g8f6', note: 'Sort angriber springeren på d4.' },
      { m: 'b1c3', note: 'Hvid får en ekstra springer i kampen.' },
      { m: 'a7a6', note: 'Sort spiller a6 — senere vil han sparke en eventuel løber på b5 væk.' }
    ]
  },
  {
    id: 'fransk',
    name: 'Fransk Forsvar',
    emoji: '🇫🇷',
    desc: 'Sort bygger en stærk kæde af bønder — solid som en borg!',
    moves: [
      { m: 'e2e4', note: 'Hvid åbner med e4.' },
      { m: 'e7e6', note: 'Sort bygger med e6 og forbereder en hel bondekæde.' },
      { m: 'd2d4', note: 'Hvid får to bønder i centrum: e4 og d4!' },
      { m: 'd7d5', note: 'Sort angriber e4-bonden med d5.' },
      { m: 'e4e5', note: 'Hvid rykker fremad — nu lukker stillingen.' },
      { m: 'c7c5', note: 'Sort bryder igennem på siden med c5.' },
      { m: 'c2c3', note: 'Hvid støtter den fremskutte bonde på e5.' },
      { m: 'b8c6', note: 'Sort får springeren ud.' },
      { m: 'g1f3', note: 'Hvid sætter sin springer på f3.' },
      { m: 'd8b6', note: 'Sort sætter dronningen på b6 — den kigger på bønderne b2 og f2!' }
    ]
  },
  {
    id: 'spansk',
    name: 'Spansk Åbning (Ruy Lopez)',
    emoji: '🇪🇸',
    desc: 'Hvid lægger pres på sort med det samme — læg mærke til løberen på b5!',
    moves: [
      { m: 'e2e4', note: 'Hvid: e4!' },
      { m: 'e7e5', note: 'Sort: e5.' },
      { m: 'g1f3', note: 'Hvid: springeren til f3.' },
      { m: 'b8c6', note: 'Sort: springeren forsvarer e5.' },
      { m: 'f1b5', note: 'Hvid: løberen til b5 — den truer springeren på c6!' },
      { m: 'a7a6', note: 'Sort: a6 — løberen må væk.' },
      { m: 'b5a4', note: 'Hvid går tilbage til a4, men presset fortsætter.' },
      { m: 'g8f6', note: 'Sort: springeren til f6.' },
      { m: 'e1g1', note: 'Hvid rokerer! Klik kongen og flyt den to felter hen mod tårnet — så hopper tårnet med.' },
      { m: 'f8e7', note: 'Sort: løberen til e7, klar til selv at rokere.' }
    ]
  },
  {
    id: 'dronningegambit',
    name: 'Dronningegambit',
    emoji: '👑',
    desc: 'Hvid tilbyder en bonde — en "gambit" — for at få kontrol over centrum!',
    moves: [
      { m: 'd2d4', note: 'Hvid starter med d4.' },
      { m: 'd7d5', note: 'Sort: d5.' },
      { m: 'c2c4', note: 'Hvid tilbyder bonden med c4 — det kaldes en gambit!' },
      { m: 'e7e6', note: 'Sort forsvarer d5-bonden med e6.' },
      { m: 'b1c3', note: 'Hvid: springeren til c3 og støtter c4.' },
      { m: 'g8f6', note: 'Sort: springeren til f6.' },
      { m: 'c1g5', note: 'Hvid binder springeren på f6 fast — den må ikke flytte sig!' },
      { m: 'f8e7', note: 'Sort: løberen forsvarer springeren.' },
      { m: 'e2e3', note: 'Hvid gør feltet e3 klar — senere kan løberen stå der.' },
      { m: 'b8d7', note: 'Sort: den anden springer til d7. Læg mærke til forskellen på "Nbd7" og "Nf6"!' }
    ]
  },
  {
    id: 'kongeindisk',
    name: 'Kongeindisk Forsvar',
    emoji: '🕌',
    desc: 'Sort lader hvid bygge et stort centrum — og angriber bagefter!',
    moves: [
      { m: 'd2d4', note: 'Hvid: d4.' },
      { m: 'g8f6', note: 'Sort sætter med det samme springeren på f6.' },
      { m: 'c2c4', note: 'Hvid: c4 — et bredt centrum.' },
      { m: 'g7g6', note: 'Sort: g6 — forbereder løberen på g7.' },
      { m: 'b1c3', note: 'Hvid: springeren til c3.' },
      { m: 'f8g7', note: 'Sort: løberen ud på den lange diagonal g7.' },
      { m: 'e2e4', note: 'Hvid: e4 — nu står fire bønder i centrum!' },
      { m: 'd7d6', note: 'Sort: d6 — sort bygger sin egen kæde op.' },
      { m: 'g1f3', note: 'Hvid: springeren til f3.' },
      { m: 'e8g8', note: 'Sort rokerer! Klik kongen og flyt den to felter hen mod tårnet — så hopper tårnet med. Kongen gemmer sig sikkert bag bønderne.' }
    ]
  },
  {
    id: 'engelsk',
    name: 'Engelsk Åbning',
    emoji: '🇬🇧',
    desc: 'Hvid starter fra siden med c4 — det giver et helt andet og spændende spil!',
    moves: [
      { m: 'c2c4', note: 'Hvid starter med c4 i stedet for e4 eller d4.' },
      { m: 'e7e5', note: 'Sort svarer direkte i centrum med e5.' },
      { m: 'b1c3', note: 'Hvid: springeren til c3.' },
      { m: 'g8f6', note: 'Sort: springeren til f6.' },
      { m: 'g1f3', note: 'Hvid får endnu en springer i spil!' },
      { m: 'b8c6', note: 'Sort får også sin anden springer ud.' },
      { m: 'g2g3', note: 'Hvid forbereder løberen på g2.' },
      { m: 'd7d5', note: 'Sort: d5 — prøver at bryde igennem i centrum.' },
      { m: 'c4d5', note: 'Hvid slår med det samme: cxd5! "x" betyder slag.' },
      { m: 'f6d5', note: 'Sort slår tilbage med springeren: Nxd5.' }
    ]
  },
  {
    id: 'carokann',
    name: 'Caro-Kann Forsvaret',
    emoji: '🛡️',
    desc: 'Sort er solid som en borgmur — næsten umulig at bryde igennem!',
    moves: [
      { m: 'e2e4', note: 'Hvid: e4.' },
      { m: 'c7c6', note: 'Sort: c6 — forbereder d5 uden at låse løberen inde.' },
      { m: 'd2d4', note: 'Hvid: d4.' },
      { m: 'd7d5', note: 'Sort: d5 — angriber centrum med det samme.' },
      { m: 'b1c3', note: 'Hvid: springeren til c3.' },
      { m: 'd5e4', note: 'Sort slår e4-bonden.' },
      { m: 'c3e4', note: 'Hvid slår tilbage med springeren — den står stærkt på e4.' },
      { m: 'c8f5', note: 'Sort: løberen til f5, klar til at bytte.' },
      { m: 'e4g3', note: 'Hvid bytter springere af.' },
      { m: 'f5g6', note: 'Sort: løberen tilbage til g6, klar til mere.' }
    ]
  },
  {
    id: 'skandinavisk',
    name: 'Skandinavisk Forsvar',
    emoji: '⚔️',
    desc: 'Sort slår med det samme og tager centrum med dronningen!',
    moves: [
      { m: 'e2e4', note: 'Hvid: e4.' },
      { m: 'd7d5', note: 'Sort spiller med det samme d5 — vil slå i centrum.' },
      { m: 'e4d5', note: 'Hvid slår bonden på d5.' },
      { m: 'd8d5', note: 'Sort slår igen med dronningen — centrum tilhører sort!' },
      { m: 'b1c3', note: 'Hvid angriber dronningen med springeren.' },
      { m: 'd5a5', note: 'Sort flytter dronningen til a5 — pas på b2-bonden!' },
      { m: 'd2d4', note: 'Hvid: d4 og støtter centrum.' },
      { m: 'g8f6', note: 'Sort: springeren til f6.' },
      { m: 'g1f3', note: 'Hvid: springeren til f3.' },
      { m: 'c8g4', note: 'Sort binder springeren på f3 fast.' }
    ]
  },
  {
    id: 'london',
    name: 'London-systemet',
    emoji: '🏙️',
    desc: 'Hvid bygger en lille, sikker fæstning på få træk — nem at lære!',
    moves: [
      { m: 'd2d4', note: 'Hvid: d4.' },
      { m: 'd7d5', note: 'Sort: d5.' },
      { m: 'c1f4', note: 'Hvid sætter først løberen ud på f4 — fæstningen vokser!' },
      { m: 'g8f6', note: 'Sort: springeren til f6.' },
      { m: 'e2e3', note: 'Hvid: e3 og støtter d4.' },
      { m: 'e7e6', note: 'Sort: e6.' },
      { m: 'c2c3', note: 'Hvid: c3 — nu står bønderne på plads.' },
      { m: 'c7c5', note: 'Sort: c5 — prøver at bryde igennem.' },
      { m: 'f1d3', note: 'Hvid: løberen til d3, klar til at rokere.' },
      { m: 'b8c6', note: 'Sort: springeren til c6.' }
    ]
  }
];
