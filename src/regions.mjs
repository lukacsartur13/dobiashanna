// Regional landing pages (local SEO). One block per region per language.
// Keyword pattern per page: primary "kerttervezés {hely}" in slug, title, H1, first paragraph,
// question-form H2s with the place name, service H3s with keyword anchors, a town list for
// long-tail searches, a local FAQ (FAQPage schema) and a localised CTA heading.
import { T, PAGES } from './content.mjs';

export const REGION_KEYS = ['gyor', 'budapest', 'balaton'];

Object.assign(PAGES, {
  gyor:     { hu: 'kerttervezes-gyor.html',     en: 'garden-design-gyor.html' },
  budapest: { hu: 'kerttervezes-budapest.html', en: 'garden-design-budapest.html' },
  balaton:  { hu: 'kerttervezes-balaton.html',  en: 'garden-design-lake-balaton.html' },
});

const hu = {
  regionsUI: {
    nav: 'Régiók', label: 'Régiók', h: 'Ahol <em>tervezek</em>',
    p: 'Helyszíni bejárással Győrben és Győr-Moson-Sopron megyében, Budapesten és az agglomerációban, valamint a Balaton környékén – online konzultációval pedig az ország bármely részén.',
    other: 'Más régiók', home: 'Kezdőlap', region: 'Régió', map: 'Sematikus térkép', more: 'Kerttervezés itt', towns: 'település',
  },
  gyor: {
    n: '01', name: 'Győr és Győr-Moson-Sopron', short: 'Rendezett, szélvédett, jól kivitelezhető családi házas kertek a Kisalföldön.',
    title: 'Kerttervezés Győr és Győr-Moson-Sopron megye | HoneyGarden',
    desc: 'Egyedi kerttervezés Győrben és Győr-Moson-Sopron megyében: koncepcióterv, növénykiültetési terv, kiviteli kertterv és 3D látványterv családi házakhoz.',
    h1: 'Kerttervezés Győrben és Győr-Moson-Sopron megyében',
    tag: 'Rendezett kert a Kisalföld szelében is.',
    lead: 'Egyedi kertterveket készítek Győrben, Mosonmagyaróváron, Sopronban és a megye településein – családi házakhoz, új építésű otthonokhoz és megújuló kertekhez. A cél egy átgondolt, jól kivitelezhető és hosszú távon is működő kert, amely a ház karakteréhez és a telek adottságaihoz illeszkedik.',
    coord: '47,68° É · 17,63° K',
    localH: 'Miben más a kerttervezés <em>Győr-Moson-Sopron megyében?</em>',
    localP: [
      'A Kisalföld sík, nyitott tájain a kertet nemcsak a nap, hanem a szél is formálja. A Szigetközben és a folyók mentén sokszor magas a talajvíz, máshol kötött öntéstalajjal vagy kavicsos réteggel kell számolni. Egy jó kertterv ezeket az adottságokat nem utólag kezeli, hanem eleve beépíti a tervbe.',
      'A megye új építésű lakóövezeteiben – Győr környékén, Győrújbaráton, Abdán vagy Nyúlon – gyakoriak a kisebb, egymásra látó telkek. Itt a belátás takarása, a jól szervezett terasz és a kevés gondozást igénylő ültetés legalább olyan fontos, mint a látvány.',
    ],
    factors: [
      ['wind', 'Szél és nyitott táj', 'Szélfogó sövények és fasorok, amelyek védett, jól használható kertrészeket hoznak létre.'],
      ['water', 'Talajvíz és vízelvezetés', 'A Szigetközben és a folyók mentén a szintek és a vízelvezetés tervezése alapfeltétel.'],
      ['soil', 'Talaj és növényválasztás', 'Az öntéstalajhoz, a kavicsos rétegekhez és a nyári aszályhoz illő, tartós növénypaletta.'],
      ['eye', 'Belátás és telekméret', 'Intim, jól tagolt kert az új lakóövezetek kisebb telkein is.'],
    ],
    whoH: 'Kinek ajánlom a kerttervezést <em>Győr környékén?</em>',
    who: ['Új építésű családi házhoz Győrben vagy a környező településeken', 'Felújított ház mellé, ahol a régi kert már nem működik', 'Ha helyi kivitelezővel dolgoznál, és pontos, árazható terv kell'],
    svcH: 'Milyen kertterv készülhet <em>Győrben?</em>',
    svcP: 'A projekt céljától függően választhatsz tervezési szintet – a gyors irányadástól a részletes dokumentációig. A tervtípusok külön is kérhetők, de együtt adják a legtöbbet.',
    svc: {
      concept: ['A kert szerkezete, zónái és hangulata – minden jó kertterv alapja.', 'koncepcióterv'],
      planting: ['Fajra pontos, a kisalföldi klímához illő ültetési terv.', 'növénykiültetési terv'],
      construction: ['Méretezett rajzok, amelyekből a helyi kivitelező pontosan áraz.', 'kiviteli kertépítészeti terv'],
      visual: ['Valósághű képek a döntések előtt.', '3D kertterv'],
    },
    processH: 'Hogyan zajlik a kerttervezés <em>Győr-Moson-Sopron megyében?</em>',
    process: [
      ['Helyszíni bejárás', 'Kimegyek a telekre, felmérem a talajt, a fényeket, a szélirányt és a meglévő növényeket, közben átbeszéljük az igényeidet.'],
      ['Koncepció', 'Két-három irányt vázolok fel; közösen választjuk ki és finomítjuk a kert végleges szerkezetét.'],
      ['Részletes tervezés', 'Igény szerint elkészül az ültetési, a kiviteli és a 3D látványterv, anyag- és növénylistával.'],
      ['Kivitelezés előkészítése', 'A kész tervvel bármelyik győri vagy megyei kivitelező pontosan tud árazni; kérésre szakembert is ajánlok.'],
    ],
    areaH: 'Tervezési terület <em>Győr-Moson-Sopron megyében</em>',
    areaP: 'Helyszíni bejárással vállalok kerttervezést Győrben és a megye településein, többek között:',
    towns: ['Győr', 'Mosonmagyaróvár', 'Sopron', 'Csorna', 'Kapuvár', 'Pannonhalma', 'Győrújbarát', 'Abda', 'Nyúl', 'Győrszemere', 'Tét', 'Lébény', 'Fertőd', 'Fertőrákos', 'Ásványráró', 'Dunakiliti'],
    whyH: 'Miért érdemes tervvel kezdeni?',
    why: [
      'Egy kertterv előre rendezi a döntéseket: tudod, mi kerül a kertbe, mekkora lesz a terasz, hová kerülnek a fák, és mennyibe kerül a megvalósítás. Így kevesebb a menet közbeni rögtönzés és az utólagos átépítés.',
      'Győr-Moson-Sopron megyében sok olyan családi ház épül, ahol a kert minősége közvetlenül meghatározza az ingatlan összképét és használati értékét. Egy átgondolt kertterv itt nem extra, hanem a ház természetes folytatása.',
    ],
    faqH: 'Gyakori kérdések – <em>kerttervezés Győr</em>',
    faq: [
      ['Vállalsz kerttervezést Győrön kívül is a megyében?', 'Igen. Győr mellett Mosonmagyaróváron, Sopronban, Csornán, Kapuváron és a környező településeken is vállalok helyszíni bejárással induló tervezést.'],
      ['Mennyibe kerül egy kertterv Győrben?', 'A díj a telek méretétől, a kért tervtípusoktól és a részletezettségtől függ. A helyszíni bejárás után pontos, tételes ajánlatot küldök.'],
      ['Lehet csak koncepciótervvel indulni?', 'Igen, sok projektnél a koncepcióterv a legjobb kiindulópont; a részletes tervek később is elkészülhetnek.'],
      ['Helyi kivitelezővel is működik a terv?', 'Igen. A kiviteli terv pontos méretekkel és anyaglistával készül, így bármelyik győri vagy megyei kertépítő pontosan tud árazni és dolgozni belőle.'],
      ['Szeles, nyitott telekre is tudsz védett kertet tervezni?', 'Igen – sövényekkel, fasorokkal, pergolával és a terek tudatos elrendezésével a nyitott kisalföldi telken is kialakítható szélvédett, meghitt kertrész.'],
    ],
    ctaH: 'Kérj ajánlatot<br><em>kerttervezésre Győrben.</em>',
    ctaP: 'Írj pár sort a kertedről – hol van, mekkora, és mit szeretnél benne. Két munkanapon belül válaszolok, és egyeztetjük a helyszíni bejárást.',
    schemaArea: [['City', 'Győr'], ['AdministrativeArea', 'Győr-Moson-Sopron vármegye']],
  },
  budapest: {
    n: '02', name: 'Budapest és agglomeráció', short: 'Kis és lejtős telkek, új építésű házak – élhető kert a város mellett.',
    title: 'Kerttervezés Budapest és agglomeráció | HoneyGarden',
    desc: 'Egyedi kerttervezés Budapesten és az agglomerációban: koncepcióterv, növénykiültetési terv, kiviteli kertterv és 3D látványterv modern családi házakhoz.',
    h1: 'Kerttervezés Budapesten és az agglomerációban',
    tag: 'Kis telek, nagy kert – ha jól van megtervezve.',
    lead: 'Egyedi kertterveket készítek Budapest kertes kerületeiben és az agglomeráció településein – Budaörstől Szentendréig, Gödöllőtől Érdig. Modern családi házakhoz, új építésű otthonokhoz és felújított ingatlanokhoz, ahol a kertnek egyszerre kell igényesnek és a mindennapokban is élhetőnek lennie.',
    coord: '47,50° É · 19,04° K',
    localH: 'Mire figyel egy jó kertterv <em>Budapest környékén?</em>',
    localP: [
      'Budapest környékén a telkek gyakran kisebbek, a szomszédok közelebb vannak, a budai oldalon és a hegyvidéki településeken pedig sokszor lejtős terepen kell gondolkodni. Itt minden négyzetméternek dolga van: a terasznak, a játszórésznek, a tárolásnak és a növényeknek is meg kell találni a helyét.',
      'Az agglomerációban sok új ház épül, ahol a kert az építkezés végén üres, letaposott telekként marad. Egy jól felépített kertterv már ekkor kijelöli a szinteket, a közlekedést és a növényzónákat – így a kivitelezés átlátható, a kert pedig a ház színvonalához igazodik.',
    ],
    factors: [
      ['slope', 'Lejtős telkek', 'Támfalak, lépcsők és teraszolt szintek, amelyek a lejtőt használható térré alakítják.'],
      ['eye', 'Belátás és közelség', 'Takarás sövénnyel, pergolával és rétegzett ültetéssel – intim kert a szomszédok mellett.'],
      ['ruler', 'Kis alapterület', 'Többfunkciós, jól tagolt kert, ahol minden négyzetméternek szerepe van.'],
      ['sun', 'Városi hősziget', 'Árnyékot adó fák, vízáteresztő burkolatok és szárazságtűrő növények a forró nyarakra.'],
    ],
    whoH: 'Kinek ideális a kerttervezés <em>Budapest környékén?</em>',
    who: ['Új építésű házhoz az agglomerációban, ahol még üres a telek', 'Budai, hegyvidéki, lejtős telekhez, ahol a szintek jelentik a legnagyobb kihívást', 'Kisebb városi kerthez, ahol a terasz, a játék és a növények osztoznak a helyen'],
    svcH: 'Milyen kerttervezési szolgáltatások érhetők el <em>Budapesten?</em>',
    svcP: 'A tervezési szint a projekthez igazodik: indulhatsz egy gyors koncepcióval, vagy kérhetsz teljes, kivitelezésre kész tervcsomagot.',
    svc: {
      concept: ['A kert fő szerkezete és zónái – különösen fontos kis és lejtős telken.', 'koncepcióterv kerttervezéshez'],
      planting: ['Városi klímát, árnyékot és szárazságot is bíró növényösszeállítás.', 'részletes növénykiültetési terv'],
      construction: ['Szintek, támfalak és burkolatok pontos rajzai a szervezett kivitelezéshez.', 'kiviteli kertépítészeti terv'],
      visual: ['Közös kép a családnak a döntésekhez.', '3D látványterv'],
    },
    processH: 'Hogyan zajlik a kerttervezés <em>Budapesten?</em>',
    process: [
      ['Igényfelmérés és bejárás', 'Megnézem a telket, a szinteket, a fényviszonyokat és a szomszédos beépítést, és átbeszéljük, hogyan használnád a kertet.'],
      ['Koncepció', 'Kijelöljük a kert fő zónáit, arányait és hangulati irányát – kis telken ez dönti el a legtöbbet.'],
      ['Részletes tervezés', 'Igény szerint ültetési, kiviteli és 3D látványterv készül, anyag- és növénylistával.'],
      ['Megvalósítás támogatása', 'A kész dokumentációval a kivitelezés átlátható; kérésre megbízható szakembereket ajánlok.'],
    ],
    areaH: 'Tervezési terület <em>Budapesten és az agglomerációban</em>',
    areaP: 'Helyszíni bejárással vállalok kerttervezést Budapest kertes kerületeiben és az agglomeráció településein, többek között:',
    towns: ['Budapest II. kerület', 'Budapest III. kerület', 'Budapest XII. kerület', 'Budapest XVI. kerület', 'Budaörs', 'Budakeszi', 'Törökbálint', 'Érd', 'Biatorbágy', 'Szentendre', 'Pomáz', 'Üröm', 'Solymár', 'Gödöllő', 'Veresegyház', 'Fót', 'Dunakeszi', 'Szada'],
    whyH: 'Miért fontos a kertterv az agglomerációban?',
    why: [
      'Budapest környékén gyakori igény, hogy a kert egyszerre legyen letisztult, igényes és jól használható. Ezt ösztönös döntésekkel ritkán lehet elérni – egy kis telken minden rossz arány azonnal látszik.',
      'Egy jól elkészített kertterv nemcsak a látványt szervezi, hanem a kivitelezési döntéseket is leegyszerűsíti: előre tudod, mi mennyibe kerül, és mi készül el először.',
    ],
    faqH: 'Gyakori kérdések – <em>kerttervezés Budapest</em>',
    faq: [
      ['Budapesten belül is vállalsz kerttervezést?', 'Igen, Budapest kertes kerületeiben – például a II., III., XII. és XVI. kerületben – és az agglomeráció településein is.'],
      ['Új építésű házhoz mikor érdemes kerttervet készíteni?', 'Ideális esetben még a kivitelezés vége előtt, hogy a szintek, a közművek és a burkolatok már a kerttervhez igazodjanak.'],
      ['Lejtős telekre is tervezel?', 'Igen. A lejtős telek kertté alakítása szint- és támfaltervezést igényel – ezt a kiviteli terv részletesen tartalmazza.'],
      ['Kis kertre is érdemes tervet készíteni?', 'Különösen. Kis telken minden négyzetméternek szerepe van, ezért itt a terv térben és pénzben is a legtöbbet hozza.'],
      ['Lehet több tervezési szint közül választani?', 'Igen, a koncepcióterv, a növénykiültetési terv, a kiviteli kertterv és a 3D látványterv külön és együtt is kérhető.'],
    ],
    ctaH: 'Kérj ajánlatot<br><em>kerttervezésre Budapest környékén.</em>',
    ctaP: 'Írj pár sort a kertedről – hol van, mekkora, és mit szeretnél benne. Két munkanapon belül válaszolok, és egyeztetjük a helyszíni bejárást.',
    schemaArea: [['City', 'Budapest'], ['AdministrativeArea', 'Pest vármegye']],
  },
  balaton: {
    n: '03', name: 'Balaton környéke', short: 'Nyaralók és második otthonok – látványos kert, kevés gondozással.',
    title: 'Kerttervezés Balaton – nyaraló és lakókert | HoneyGarden',
    desc: 'Egyedi kerttervezés a Balaton környékén nyaralókhoz és második otthonokhoz: kevés gondozást igénylő, látványos kertek koncepciótervtől a 3D látványtervig.',
    h1: 'Kerttervezés a Balaton környékén',
    tag: 'Kert, ami akkor is rendben van, amikor nem vagy ott.',
    lead: 'Egyedi kertterveket készítek balatoni nyaralókhoz, második otthonokhoz és állandó lakóházakhoz – az északi part köves lejtőitől a déli part homokos telkeiig. A balatoni kert sokszor pihenésre, vendégfogadásra és szezonális használatra készül: látványosnak kell lennie, mégis kevés törődéssel is jól kell tartania magát.',
    coord: '46,85° É · 17,73° K',
    localH: 'Miben más a <em>balatoni kerttervezés?</em>',
    localP: [
      'Az északi parton sokszor köves, mészkő- vagy bazaltalapú, sekély talajjal és meredek telekkel kell dolgozni, a déli parton inkább homokos, gyorsan kiszáradó talaj és sík, szeles telkek a jellemzők. A tó közelsége enyhébb mikroklímát ad, de a nyári aszály és a szél itt is próbára teszi a növényeket.',
      'A szezonális használat miatt az is fontos szempont, hogy a kert hetekig rendezett maradjon felügyelet nélkül. Ezért a balatoni kertterv a tartós szerkezetre, a jól megválasztott, szárazságtűrő növényekre és az automatizálható öntözésre épít.',
    ],
    factors: [
      ['soil', 'Köves vagy homokos talaj', 'Az északi és a déli part eltérő talajához igazított növény- és talajelőkészítési terv.'],
      ['calendar', 'Szezonális használat', 'Olyan kert, amely hetekig rendben marad akkor is, ha senki nem gondozza.'],
      ['water', 'Víztakarékos öntözés', 'Öntözési zónák és szárazságtűrő, mediterrán hangulatú növények.'],
      ['sun', 'Kilátás és árnyék', 'A tóra nyíló kilátás megőrzése, árnyas teraszok a nyári délutánokra.'],
    ],
    whoH: 'Kinek szól a <em>balatoni kerttervezés?</em>',
    who: ['Nyaralóhoz vagy második otthonhoz, amelyet csak időszakosan használsz', 'Felújított balatoni házhoz, ahol a régi kert elvadult vagy elöregedett', 'Vendégházhoz, apartmanhoz, ahol a kert a vendégélmény része'],
    svcH: 'Elérhető kerttervezési szolgáltatások <em>a Balatonnál</em>',
    svcP: 'A balatoni kerttervezés is több szinten kérhető, így a projekt a tulajdonos igényeihez és a megvalósítás üteméhez igazítható.',
    svc: {
      concept: ['A kert funkcionális és hangulati alapja – kilátással, terasszal, vendégtérrel.', 'koncepcióterv'],
      planting: ['Szárazságtűrő, kevés gondozást igénylő, a balatoni tájhoz illő ültetés.', 'fenntartható növénykiültetési terv'],
      construction: ['Teraszok, lépcsők és támfalak pontos rajzai a lejtős telkekre.', 'részletes kiviteli kertterv'],
      visual: ['Előre láthatod a kert hangulatát nyáron és ősszel is.', '3D kertterv'],
    },
    processH: 'Hogyan zajlik a tervezés <em>a Balaton környékén?</em>',
    process: [
      ['Bejárás és igényfelmérés', 'Helyszíni bejárással indulunk; ha ritkán jársz le, a további egyeztetés online, fotók és felmérési adatok alapján is mehet.'],
      ['Koncepció', 'Kijelöljük a pihenő-, vendég- és kertrészeket, a kilátási irányokat és a kert hangulatát.'],
      ['Részletes tervezés', 'Igény szerint ültetési, kiviteli és 3D látványterv készül, öntözési javaslattal.'],
      ['Megvalósítás előkészítése', 'A tervvel a helyi kivitelező a távollétedben is pontosan dolgozhat; kérésre szakembert ajánlok.'],
    ],
    areaH: 'Tervezési terület <em>a Balaton körül</em>',
    areaP: 'Kerttervezést vállalok a Balaton északi és déli partján, valamint a környező településeken, többek között:',
    towns: ['Balatonfüred', 'Balatonalmádi', 'Alsóörs', 'Csopak', 'Tihany', 'Balatonakali', 'Zánka', 'Révfülöp', 'Badacsony', 'Szigliget', 'Keszthely', 'Hévíz', 'Siófok', 'Zamárdi', 'Balatonföldvár', 'Balatonszárszó', 'Balatonlelle', 'Balatonboglár', 'Fonyód', 'Balatonfenyves'],
    whyH: 'Miért fontos a fenntartható és látványos kert a Balatonnál?',
    why: [
      'Balatoni környezetben a kert értékét nemcsak a látvány adja, hanem az is, hogy időszakos használat mellett is rendezett és jól működő marad. A tudatos tervezés összehangolja a látványt, a használhatóságot és a fenntartás realitásait.',
      'Egy jól megtervezett nyaralókert kevesebb munkát ad, kevesebb vizet fogyaszt, és minden érkezéskor ugyanazt az élményt nyújtja – ezért érdemes tervvel kezdeni.',
    ],
    faqH: 'Gyakori kérdések – <em>kerttervezés Balaton</em>',
    faq: [
      ['Balatoni nyaralóhoz is érdemes kerttervet készíteni?', 'Igen, különösen szezonális használatnál fontos, hogy a kert átlátható és kevés gondozással fenntartható rendszerként működjön.'],
      ['Lehet kevés gondozást igénylő, mégis látványos kertet tervezni?', 'Igen – tartós szerkezettel, szárazságtűrő évelőkkel és díszfüvekkel, mulcsozással és automata öntözéssel ez jól elérhető.'],
      ['Távolról is lehet a tervezést intézni?', 'Igen. Egy helyszíni bejárás után a további egyeztetések online is történhetnek, a tervet pedig digitálisan adom át.'],
      ['Az északi és a déli parton is vállalsz tervezést?', 'Igen, Balatonfüredtől Keszthelyig és Siófoktól Fonyódig a tó körüli településeken is.'],
      ['Hasznos a 3D látványterv balatoni kertnél?', 'Igen, mert előre megmutatja a kilátásokat, a teraszok és a növények arányait – mielőtt bármi megépülne.'],
    ],
    ctaH: 'Kérj ajánlatot<br><em>balatoni kerttervezésre.</em>',
    ctaP: 'Írj pár sort a nyaralódról vagy házadról – hol van, mekkora a kert, és mikor használod. Két munkanapon belül válaszolok.',
    schemaArea: [['Place', 'Balaton'], ['AdministrativeArea', 'Veszprém vármegye'], ['AdministrativeArea', 'Somogy vármegye'], ['AdministrativeArea', 'Zala vármegye']],
  },
};

const en = {
  regionsUI: {
    nav: 'Regions', label: 'Regions', h: 'Where <em>I design</em>',
    p: 'With site visits in Győr and Győr-Moson-Sopron county, in Budapest and its surroundings, and around Lake Balaton – and anywhere in Hungary through online consultation.',
    other: 'Other regions', home: 'Home', region: 'Region', map: 'Schematic map', more: 'Garden design here', towns: 'towns',
  },
  gyor: {
    n: '01', name: 'Győr & Győr-Moson-Sopron', short: 'Orderly, wind-sheltered, buildable family gardens on the Little Hungarian Plain.',
    title: 'Garden Design in Győr & Győr-Moson-Sopron | HoneyGarden',
    desc: 'Bespoke garden design in Győr and Győr-Moson-Sopron county: concept plan, planting plan, construction drawings and 3D visualisation for family homes.',
    h1: 'Garden design in Győr and Győr-Moson-Sopron county',
    tag: 'An orderly garden, even in the plain’s wind.',
    lead: 'I create bespoke garden designs in Győr, Mosonmagyaróvár, Sopron and towns across the county – for family homes, new builds and gardens in need of renewal. The aim is a well-considered, buildable garden that works for years and suits both the house and the plot.',
    coord: '47.68° N · 17.63° E',
    localH: 'What makes garden design <em>in Győr-Moson-Sopron different?</em>',
    localP: [
      'On the flat, open Little Hungarian Plain the garden is shaped by wind as much as by sun. In the Szigetköz and along the rivers groundwater is often high; elsewhere you deal with heavy alluvial soil or gravel layers. A good garden plan builds these conditions in from the start rather than fixing them later.',
      'In the county’s newer residential areas – around Győr, in Győrújbarát, Abda or Nyúl – plots are often small and overlooked. There, privacy, a well-organised terrace and low-maintenance planting matter as much as the look.',
    ],
    factors: [
      ['wind', 'Wind and open landscape', 'Windbreak hedges and tree rows that create sheltered, usable garden rooms.'],
      ['water', 'Groundwater and drainage', 'In the Szigetköz and along the rivers, levels and drainage come first.'],
      ['soil', 'Soil and plant choice', 'A durable plant palette for alluvial soil, gravel and dry summers.'],
      ['eye', 'Privacy and plot size', 'An intimate, well-structured garden even on smaller new-build plots.'],
    ],
    whoH: 'Who is garden design <em>around Győr for?</em>',
    who: ['A new family home in Győr or a nearby town', 'A renovated house where the old garden no longer works', 'You’ll work with a local contractor and need a precise, priceable plan'],
    svcH: 'Which garden plans can be made <em>in Győr?</em>',
    svcP: 'Choose the level of design your project needs – from quick direction to full documentation. Plan types can be ordered separately, but together they give the most.',
    svc: {
      concept: ['Structure, zones and mood – the basis of every good garden plan.', 'concept plan'],
      planting: ['A species-accurate planting plan suited to the regional climate.', 'planting plan'],
      construction: ['Dimensioned drawings a local contractor can price precisely.', 'construction drawings'],
      visual: ['Realistic images before you decide.', '3D garden visualisation'],
    },
    processH: 'How does garden design work <em>in Győr-Moson-Sopron?</em>',
    process: [
      ['Site visit', 'I visit the plot, assess soil, light, wind direction and existing plants, and we talk through what you need.'],
      ['Concept', 'I sketch two or three directions; together we choose and refine the garden’s final structure.'],
      ['Detailed design', 'Planting, construction and 3D plans as needed, with material and plant lists.'],
      ['Preparing the build', 'Any contractor in Győr or the county can price the finished plan precisely; I can recommend professionals.'],
    ],
    areaH: 'Service area <em>in Győr-Moson-Sopron county</em>',
    areaP: 'I take on garden design with site visits in Győr and towns across the county, including:',
    towns: hu => hu.gyor.towns,
    whyH: 'Why start with a plan?',
    why: [
      'A garden plan settles decisions in advance: you know what goes in, how big the terrace will be, where the trees go and what it will cost. That means less improvising and less rebuilding later.',
      'Many family homes in Győr-Moson-Sopron are built where the garden directly shapes the property’s overall look and everyday value. A considered plan is not an extra there – it is the natural continuation of the house.',
    ],
    faqH: 'FAQ – <em>garden design in Győr</em>',
    faq: [
      ['Do you work outside Győr in the county?', 'Yes. Besides Győr I design gardens in Mosonmagyaróvár, Sopron, Csorna, Kapuvár and surrounding towns, starting with a site visit.'],
      ['How much does a garden plan cost in Győr?', 'The fee depends on plot size, plan types and level of detail. After the site visit I send a precise, itemised quote.'],
      ['Can I start with just a concept plan?', 'Yes, for many projects the concept plan is the best starting point; detailed plans can follow later.'],
      ['Does the plan work with a local contractor?', 'Yes. Construction drawings come with exact dimensions and material lists, so any landscaper in Győr or the county can price and build from them.'],
      ['Can you design a sheltered garden on a windy, open plot?', 'Yes – hedges, tree rows, a pergola and a deliberate layout create a sheltered, intimate corner even on an open plot.'],
    ],
    ctaH: 'Request a quote<br><em>for garden design in Győr.</em>',
    ctaP: 'Write a few lines about your garden – where it is, how big, and what you want from it. I reply within two working days and we arrange a site visit.',
  },
  budapest: {
    n: '02', name: 'Budapest & surroundings', short: 'Small and sloping plots, new builds – liveable gardens next to the city.',
    title: 'Garden Design in Budapest & Surroundings | HoneyGarden',
    desc: 'Bespoke garden design in Budapest and its agglomeration: concept plan, planting plan, construction drawings and 3D visualisation for modern family homes.',
    h1: 'Garden design in Budapest and its surroundings',
    tag: 'Small plot, big garden – if it’s well planned.',
    lead: 'I create bespoke garden designs in Budapest’s garden districts and the towns around the city – from Budaörs to Szentendre, from Gödöllő to Érd. For modern family homes, new builds and renovated properties where the garden must be refined and liveable at the same time.',
    coord: '47.50° N · 19.04° E',
    localH: 'What does a good garden plan <em>around Budapest consider?</em>',
    localP: [
      'Around Budapest plots are often smaller, neighbours closer, and on the Buda side and in the hill towns you often work on slopes. Every square metre has a job: terrace, play area, storage and planting all need their place.',
      'Many new houses are built in the agglomeration, and the garden is left as an empty, trampled plot at the end. A well-structured plan sets levels, circulation and planting zones at this stage – so construction stays clear and the garden matches the house.',
    ],
    factors: [
      ['slope', 'Sloping plots', 'Retaining walls, steps and terraced levels that turn a slope into usable space.'],
      ['eye', 'Privacy and proximity', 'Screening with hedges, pergolas and layered planting – an intimate garden beside neighbours.'],
      ['ruler', 'Small footprint', 'A multi-functional, well-structured garden where every square metre counts.'],
      ['sun', 'Urban heat', 'Shade trees, permeable paving and drought-tolerant plants for hot summers.'],
    ],
    whoH: 'Who is garden design <em>around Budapest for?</em>',
    who: ['A new house in the agglomeration with an empty plot', 'A sloping plot in the Buda hills where levels are the main challenge', 'A smaller city garden where terrace, play and plants share the space'],
    svcH: 'Which garden design services are available <em>in Budapest?</em>',
    svcP: 'The level of design follows the project: start with a quick concept, or order a complete, build-ready package.',
    svc: {
      concept: ['Main structure and zones – especially important on small or sloping plots.', 'concept plan for garden design'],
      planting: ['Planting that copes with city climate, shade and drought.', 'detailed planting plan'],
      construction: ['Exact drawings of levels, retaining walls and paving for an organised build.', 'garden construction drawings'],
      visual: ['A shared picture for the family to decide on.', '3D visualisation'],
    },
    processH: 'How does garden design work <em>in Budapest?</em>',
    process: [
      ['Brief and site visit', 'I look at the plot, its levels, light and neighbouring buildings, and we discuss how you’d use the garden.'],
      ['Concept', 'We set the garden’s main zones, proportions and mood – on a small plot this decides the most.'],
      ['Detailed design', 'Planting, construction and 3D plans as needed, with material and plant lists.'],
      ['Supporting the build', 'With finished documentation the build stays clear; I can recommend reliable professionals.'],
    ],
    areaH: 'Service area <em>in Budapest and its surroundings</em>',
    areaP: 'I take on garden design with site visits in Budapest’s garden districts and towns of the agglomeration, including:',
    towns: hu => hu.budapest.towns,
    whyH: 'Why a garden plan matters in the agglomeration',
    why: [
      'Around Budapest people often want a garden that is clean, refined and practical at once. Instinctive decisions rarely get there – on a small plot every wrong proportion shows immediately.',
      'A good plan not only organises the look, it simplifies construction decisions: you know in advance what costs what, and what gets built first.',
    ],
    faqH: 'FAQ – <em>garden design in Budapest</em>',
    faq: [
      ['Do you also work inside Budapest?', 'Yes, in Budapest’s garden districts – for example districts II, III, XII and XVI – and in the towns of the agglomeration.'],
      ['When should a new-build garden be planned?', 'Ideally before construction ends, so levels, services and paving already follow the garden plan.'],
      ['Do you design for sloping plots?', 'Yes. Turning a slope into a garden needs level and retaining-wall design – the construction drawings cover it in detail.'],
      ['Is a plan worth it for a small garden?', 'Especially. On a small plot every square metre counts, so a plan pays off most in both space and money.'],
      ['Can I choose between design levels?', 'Yes, concept, planting, construction and 3D plans can be ordered separately or together.'],
    ],
    ctaH: 'Request a quote<br><em>for garden design around Budapest.</em>',
    ctaP: 'Write a few lines about your garden – where it is, how big, and what you want from it. I reply within two working days and we arrange a site visit.',
  },
  balaton: {
    n: '03', name: 'Lake Balaton', short: 'Holiday homes and second homes – a striking garden with little upkeep.',
    title: 'Garden Design at Lake Balaton | HoneyGarden',
    desc: 'Bespoke garden design around Lake Balaton for holiday and second homes: striking, low-maintenance gardens from concept plan to 3D visualisation.',
    h1: 'Garden design around Lake Balaton',
    tag: 'A garden that stays in shape while you’re away.',
    lead: 'I create bespoke garden designs for holiday houses, second homes and year-round homes around Lake Balaton – from the stony slopes of the north shore to the sandy plots of the south. A Balaton garden is often made for rest, guests and seasonal use: it must look striking, yet hold its shape with little care.',
    coord: '46.85° N · 17.73° E',
    localH: 'What makes <em>Balaton garden design different?</em>',
    localP: [
      'On the north shore you often work with stony, shallow limestone or basalt soils and steep plots; the south shore tends to have sandy, fast-drying soil and flat, windy plots. The lake softens the microclimate, but summer drought and wind still test the plants.',
      'Because of seasonal use, the garden must stay tidy for weeks without supervision. So a Balaton garden plan relies on durable structure, well-chosen drought-tolerant plants and irrigation that can be automated.',
    ],
    factors: [
      ['soil', 'Stony or sandy soil', 'Planting and soil preparation matched to the north and south shores.'],
      ['calendar', 'Seasonal use', 'A garden that stays in order for weeks with nobody tending it.'],
      ['water', 'Water-wise irrigation', 'Irrigation zones and drought-tolerant, Mediterranean-feel planting.'],
      ['sun', 'Views and shade', 'Keeping the lake view open, with shaded terraces for summer afternoons.'],
    ],
    whoH: 'Who is <em>Balaton garden design for?</em>',
    who: ['A holiday or second home you use only part of the year', 'A renovated Balaton house where the old garden is overgrown', 'A guesthouse or apartment where the garden is part of the stay'],
    svcH: 'Garden design services <em>at Lake Balaton</em>',
    svcP: 'Balaton garden design can be ordered at several levels, so the project fits the owner’s needs and the pace of construction.',
    svc: {
      concept: ['The functional and atmospheric base – with views, terrace and guest space.', 'concept plan'],
      planting: ['Drought-tolerant, low-maintenance planting suited to the Balaton landscape.', 'sustainable planting plan'],
      construction: ['Exact drawings of terraces, steps and retaining walls for sloping plots.', 'detailed construction drawings'],
      visual: ['See the garden’s mood in summer and autumn before it’s built.', '3D garden visualisation'],
    },
    processH: 'How does design work <em>around Lake Balaton?</em>',
    process: [
      ['Visit and brief', 'We start with a site visit; if you rarely come down, further coordination can run online with photos and survey data.'],
      ['Concept', 'We set the relaxing, guest and garden areas, the view lines and the mood.'],
      ['Detailed design', 'Planting, construction and 3D plans as needed, with an irrigation proposal.'],
      ['Preparing the build', 'A local contractor can work precisely from the plan while you’re away; I can recommend professionals.'],
    ],
    areaH: 'Service area <em>around Lake Balaton</em>',
    areaP: 'I take on garden design on the north and south shores of Lake Balaton and in nearby towns, including:',
    towns: hu => hu.balaton.towns,
    whyH: 'Why a sustainable, striking garden matters at Balaton',
    why: [
      'By Lake Balaton a garden’s value lies not only in its looks, but in staying tidy and functional under occasional use. Deliberate design balances looks, usability and the realities of upkeep.',
      'A well-designed holiday garden means less work, less water and the same experience every time you arrive – that is why it’s worth starting with a plan.',
    ],
    faqH: 'FAQ – <em>garden design at Lake Balaton</em>',
    faq: [
      ['Is a garden plan worth it for a holiday home?', 'Yes, with seasonal use it’s especially important that the garden works as a clear, low-maintenance system.'],
      ['Can a low-maintenance garden still look striking?', 'Yes – with durable structure, drought-tolerant perennials and grasses, mulching and automatic irrigation.'],
      ['Can the design be handled remotely?', 'Yes. After one site visit further meetings can be online, and the plans are delivered digitally.'],
      ['Do you work on both the north and south shores?', 'Yes, from Balatonfüred to Keszthely and from Siófok to Fonyód, in towns all around the lake.'],
      ['Is a 3D visualisation useful for a Balaton garden?', 'Yes, it shows views, terraces and planting proportions in advance – before anything is built.'],
    ],
    ctaH: 'Request a quote<br><em>for Balaton garden design.</em>',
    ctaP: 'Write a few lines about your holiday home or house – where it is, how big the garden is and when you use it. I reply within two working days.',
  },
};
for (const k of ['gyor', 'budapest', 'balaton']) {
  en[k].towns = en[k].towns(hu);
  en[k].schemaArea = hu[k].schemaArea;
}

// Home page: the H1 carries the regional keyword; the big lock-up stays as display type.
hu.home = { seoH1: 'Kerttervezés Győr · Budapest · Balaton' };
en.home = { seoH1: 'Garden design in Győr · Budapest · Lake Balaton' };

for (const [lang, src] of [['hu', hu], ['en', en]]) {
  const t = T[lang];
  t.regionsUI = src.regionsUI;
  for (const k of REGION_KEYS) t[k] = src[k];
  Object.assign(t.home, src.home);
}

// Home SEO: regional title/description and a clearer service-area answer in the FAQ.
Object.assign(T.hu.home, {
  title: 'Kerttervezés Győr, Budapest, Balaton | HoneyGarden',
  desc: 'Egyedi kerttervezés Győrben, Budapesten és a Balaton környékén: koncepcióterv, növénykiültetési terv, kiviteli kertterv és 3D látványterv. HoneyGarden kerttervezés – Dóbiás Hanna.',
});
Object.assign(T.en.home, {
  title: 'Garden Design in Győr, Budapest & Lake Balaton | HoneyGarden',
  desc: 'Bespoke garden design in Győr, Budapest and around Lake Balaton: concept plan, planting plan, construction drawings and 3D visualisation. HoneyGarden garden design by Hanna Dóbiás.',
});
T.hu.home.faq.items[4][1] = 'Helyszíni bejárással Győrben és Győr-Moson-Sopron megyében, Budapesten és az agglomerációban, valamint a Balaton környékén. Online konzultációval, fotók és felmérési adatok alapján az ország bármely részére.';
T.en.home.faq.items[4][1] = 'With site visits in Győr and Győr-Moson-Sopron county, in Budapest and its surroundings, and around Lake Balaton. Anywhere else in Hungary through online consultation, photos and survey data.';
