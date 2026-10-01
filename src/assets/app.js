const STAR='<svg class="st" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0z"/></svg>';
function rnd(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};}
function starfield(n,seed){const r=rnd(seed);let s="";for(let i=0;i<n;i++){const x=(r()*100).toFixed(2),y=(r()*100).toFixed(2),rad=(r()*1.1+.3).toFixed(2),o=(r()*.6+.3).toFixed(2);
  s+=`<circle cx="${x}%" cy="${y}%" r="${rad}" opacity="${o}"${i%9===0?` class="tw" style="animation-delay:${(r()*3).toFixed(1)}s"`:""}/>`;}
  return `<svg class="stars" aria-hidden="true">${s}</svg>`;}
function sky(inner,cls,seed){return `<section class="sky ${cls}">${starfield(cls.includes("hero")?170:90,seed||7)}<div class="band"></div><div class="in">${inner}</div></section>`;}
const THEME={
 hero(){const top=brandsIn("k").map(b=>[b,byBrand(b.slug).length]).sort((a,b)=>b[1]-a[1]).slice(0,11).map(x=>x[0]);
  const pts=top.map((b,i)=>{const x=6+i*(88/(top.length-1));const y=50-32*Math.sin((i/(top.length-1))*Math.PI*1.15-.2)+(i%2?9:-7);return [b,x,y];});
  const poly=pts.map(([,x,y])=>`${x},${y}`).join(" ");
  const stars=pts.map(([b,x,y],i)=>`<a class="cs${i%2?" hm":""}" href="${BU(b)}" style="left:${x}%;top:${y}%;--s:${12+byBrand(b.slug).length*1.4}px">${STAR}<span>${esc(b.name)}</span></a>`).join("");
  return sky(L(`<p class="kick">Koreya kosmetikasi · Toshkent</p><h1>Har bir brend — <em>osmondagi yulduz</em></h1>
   <p>Mirinae (미리내) — koreyscha “Somon yo‘li”. Koreyaning ${brandsIn("k").length} ta brendi, dorixona derma-kosmetikasi va Daiso topilmalari — narxlar so‘mda, kargo bilan.</p>
   <a class="btn pri" href="${U("brendlar")}">Yulduzingizni toping</a><a class="btn" href="${U("hammasi")}">Barcha mahsulotlar</a>`,
   `<p class="kick">Корейская косметика · Ташкент</p><h1>Каждый бренд — <em>звезда на небе</em></h1>
   <p>Mirinae (미리내) — по-корейски «Млечный Путь». ${nB(brandsIn("k").length)} из Кореи, аптечная дерма-косметика и находки из Daiso — цены в сумах, с учётом карго.</p>
   <a class="btn pri" href="${U("brendlar")}">Найдите свою звезду</a><a class="btn" href="${U("hammasi")}">Все товары</a>`)+`
   <div class="const" role="navigation" aria-label="${L("Brendlar yulduz turkumi","Созвездие брендов")}"><svg class="lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polyline points="${poly}" vector-effect="non-scaling-stroke"/></svg>${stars}</div>`,"hero",11);},
 door(sec,href,np,nb){const t=(LANG==="ru"?{k:["Корейские бренды",`${nB(nb)} — Anua, Torriden, SKIN1004…`],p:["Аптека и дерма","Дерма-кремы, мази и гели"],v:["Коллаген и витамины","Коллаген в стиках, витамины C и D, женьшень"],d:["Daiso","В Корее 3 000–5 000 вон"]}:{k:["Koreys brendlari",`${nb} ta brend — Anua, Torriden, SKIN1004…`],p:["Dorixona va derma","Derma kremlar, malham va gellar"],v:["Kollagen va vitaminlar","Kollagen stiklari, vitamin C va D, jenshen"],d:["Daiso","Koreyada 3 000–5 000 von"]})[sec];
  return `<a class="door d-${sec}" href="${href}">${STAR}<h3>${t[0]}</h3><p>${t[1]}</p><span class="n">${nP(np)}</span></a>`;},
 brandTile(b,n){return `<a class="btile" href="${BU(b)}" style="--bc:${b.color}"><span class="orb">${esc(initials(b.name))}</span><span><b>${esc(b.name)}</b><small>${nP(n)}</small></span></a>`;},
 card(p,b){const ph=photo(p);
  return `<article class="card" style="--bc:${b.color}"><a class="pic" href="${U("mahsulot/"+p.slug)}" tabindex="-1">${ph?`<img src="${ph}" alt="${esc(b.name+" "+eN(p))}" loading="lazy">`:`<div class="ph">${STAR}<b>${esc(initials(b.name))}</b><small>${L("Rasm tez orada","Фото скоро")}</small></div>`}</a>
   <div class="cb"><a class="br" href="${BU(b)}">${esc(b.name)}</a><h3><a href="${U("mahsulot/"+p.slug)}">${esc(eN(p))}</a></h3><p class="loc">${esc(pN(p))}</p>
   <p class="desc">${esc(pD(p))}</p><div class="tags">${p.tags.slice(0,2).map(t=>`<span>${esc(kN(t))}</span>`).join("")}</div>
   <div class="buy"><div><div class="price">${so(p.price)}</div>${p.vol?`<div class="vol">${esc(vN(p.vol))}</div>`:""}</div><div data-slot="${p.slug}">${qtyHTML(p)}</div></div></div></article>`;},
 pageHead(t,s,k){return sky(`<h1>${esc(t)}</h1><p>${esc(s)}</p>`,"ph-sky",k==="p"?23:k==="k"?5:31)+`<div class="after-sky"></div>`;},
 brandHead(b,list,back){const cats=[...new Set(list.map(p=>p.cat))];const lo=Math.min(...list.map(p=>p.price));
  return `<div style="--bc:${b.color}">`+sky(`${back.replace('class="crumb">','class="crumb">'+STAR)}<div class="bstar"><div class="big">${esc(initials(b.name))}</div><div><h1>${esc(b.name)}</h1><p>${esc(bA(b))}</p>
   <div class="bmeta"><span>${nP(list.length)}</span><span>${L(so(lo)+"dan","от "+so(lo))}</span><span>${esc(cats.map(cN).join(", ").toLowerCase())}</span></div></div></div>`,"ph-sky",b.slug.length*13)+`</div><div class="after-sky"></div>`;},
 productHead(p,b){return `<div style="--bc:${b.color}">`+sky(`<a href="${BU(b)}" class="crumb">${STAR}${esc(b.name)}</a><h1>${esc(b.name+" "+eN(p))}</h1><p>${esc(pN(p))}</p>`,"ph-sky",p.slug.length*7)+`</div><div class="after-sky"></div>`;},
 daisoHead(b,list){return `<div style="--bc:#D8232A">`+sky(`<a href="${U("")}" class="crumb">${STAR}${L("Bosh sahifa","Главная")}</a><div class="bstar"><div class="big">D</div><div><h1>${L("Daiso topilmalari","Находки из Daiso")}</h1><p>${esc(bA(b))}</p><div class="bmeta"><span>${nP(list.length)}</span><span>${L("Koreyada 3 000–5 000 von","В Корее 3 000–5 000 вон")}</span></div></div></div>`,"ph-sky",41)+`</div><div class="after-sky"></div>`;}
};

/* ===== Mirinae — umumiy do‘kon mantig‘i (barcha dizaynlar uchun bir xil) ===== */
const SHOP={
  telegram:"mirinae_beauty",        // Telegram username, @ belgisisiz
  instagram:"mirinae.uz",          // Instagram username
  phone:"+998 90 000 00 00",        // Telefon / WhatsApp
  city:"Toshkent",
  deliveryCity:20000,               // Toshkent bo‘ylab yetkazib berish (so‘m)
  deliveryRegion:35000,             // Viloyatlarga yetkazib berish (so‘m)
  freeFrom:1000000,                 // Shu summadan yuqori buyurtmaga yetkazish BEPUL (0 = o‘chiq)
  etaCity:"1–2 kun", etaRegion:"2–4 kun",
  payment:["Naqd pul — buyurtma yetkazib berilganda","Payme / Click orqali onlayn","Plastik karta (UZCARD / HUMO)"],
  hours:"24/7 — har doim aloqadamiz",
  availability:"InStock"            // Google uchun: InStock | PreOrder | BackOrder
};
const FAQ_RU=[
 ["Это оригинальная продукция?","Да. Все товары покупаются в официальных магазинах Южной Кореи (Olive Young, Daiso), у проверенных дистрибьюторов и в аптеках и привозятся напрямую. Мы проверяем срок годности каждого товара."],
 ["Как оформить заказ?","Добавьте товары в корзину и нажмите «Заказать через Telegram» — готовый список откроется в Telegram. Достаточно написать имя, телефон и адрес."],
 ["Товар есть в наличии?","Многие товары привозятся из Кореи под заказ. После заказа мы сразу сообщим о наличии и сроке доставки."],
 ["Как пользоваться аптечными средствами?","Используйте мази и аптечные кремы согласно инструкции. При хронических или серьёзных проблемах сначала проконсультируйтесь с врачом."],
 ["Можно ли обменять товар?","Неоткрытый товар в целой упаковке можно обменять в течение 3 дней после получения. Открытая косметика по правилам гигиены возврату не подлежит."]
];
const FAQ_UZ=[
 ["Mahsulotlar asl (orijinal)mi?","Ha. Barcha mahsulotlar Janubiy Koreyadagi rasmiy do‘konlar (Olive Young, Daiso), ishonchli distribyutorlar va dorixonalardan sotib olinib, to‘g‘ridan-to‘g‘ri olib kelinadi. Har bir mahsulotning yaroqlilik muddatini tekshiramiz."],
 ["Buyurtma qanday rasmiylashtiriladi?","Mahsulotlarni savatchaga qo‘shing va “Telegram orqali buyurtma berish” tugmasini bosing — tayyor ro‘yxat Telegramda ochiladi. Ism, telefon va manzilni yozsangiz kifoya."],
 ["Mahsulot hozir bormi?","Ko‘p mahsulotlar oldindan buyurtma asosida Koreyadan olib kelinadi. Buyurtmadan so‘ng mavjudligi va yetib kelish muddatini darhol aytamiz."],
 ["Dorixona vositalarini qanday ishlataman?","Malham va dorixona kremlarini yo‘riqnomaga muvofiq ishlating. Surunkali yoki kuchli muammo bo‘lsa, avval shifokor bilan maslahatlashing."],
 ["Mahsulotni almashtirish mumkinmi?","Ochilmagan va qadog‘i buzilmagan mahsulotni qo‘lingizga olganingizdan keyin 3 kun ichida almashtirish mumkin. Ochilgan kosmetika gigiyena qoidalariga ko‘ra qaytarilmaydi."]
];

const FAQ_=()=>LANG==="ru"?FAQ_RU:FAQ_UZ;
const BR=Object.fromEntries(DATA.brands.map(b=>[b.slug,b]));
const PR=Object.fromEntries(DATA.products.map(p=>[p.slug,p]));
const CATS=["Tozalash","Toner","Serum & Ampula","Krem","Quyosh kremi","Niqob va pad","Ko‘z parvarishi","Dorixona vositasi","Kollagen","Vitamin va qo‘shimcha","Boshqa"];
const SEC={k:"Koreys brendlari",p:"Dorixona va derma",v:"Kollagen va vitaminlar",d:"Daiso"};
/* ---------- manzillar (URL) ---------- */
const BASE=window.SITE_BASE||"";
const SITE_URL=(window.SITE_URL||location.origin+BASE).replace(/\/$/,"");
function parsePath(pathname){let p=pathname;if(BASE&&p.startsWith(BASE))p=p.slice(BASE.length);let lang="uz";
  if(p==="/ru"||p.startsWith("/ru/")){lang="ru";p=p.slice(3);}
  p=p.replace(/index\.html$/,"").replace(/^\/+|\/+$/g,"");
  return {lang,path:p,parts:p?p.split("/").map(x=>{try{return decodeURIComponent(x);}catch(e){return x;}}):[]};}
let LANG=parsePath(location.pathname).lang,CUR="";
const U=(p,lang)=>BASE+((lang||LANG)==="ru"?"/ru":"")+"/"+(p?p+"/":"");
const ABS=(p,lang)=>SITE_URL+U(p,lang).slice(BASE.length);
const BU=b=>U(b.slug==="daiso"?"daiso":"brend/"+b.slug);
const IMG=f=>BASE+"/img/"+f;
const L=(u,r)=>LANG==="ru"?r:u;
const RUD=DATA.ru;
const pN=p=>LANG==="ru"&&p.rn?p.rn:p.name;
const eN=p=>{const o=p.orig||"";if(!o)return p.name;const bn=BR[p.brand]?BR[p.brand].name:"";const alts=[bn,bn.replace(/\s+/g,""),bn.replace("’","'"),"Dong-A","BIOHEAL BOH","LACTO-FIT"];
  for(const a of alts){if(a&&o.toLowerCase().startsWith(a.toLowerCase()+" "))return o.slice(a.length+1);}return o;};
const pD=p=>LANG==="ru"&&p.rd?p.rd:p.desc;
const cN=c=>LANG==="ru"?(RUD.cat[c]||c):c;
const kN=k=>LANG==="ru"?(RUD.conc[k]||DATA.conc[k]):DATA.conc[k];
const bA=b=>LANG==="ru"&&b.ra?b.ra:b.about;
const vN=v=>LANG==="ru"?String(v||"").replace(/(dona|tabletka|kapsula|stik)/g,m=>RUD.volw[m]):v;
const plr=(n,a,b,c)=>{const m=n%10,h=n%100;return m===1&&h!==11?a:m>=2&&m<=4&&(h<12||h>14)?b:c;};
const nP=n=>`${n} ${L("mahsulot",plr(n,"товар","товара","товаров"))}`;
const nB=n=>`${n} ${L("ta brend",plr(n,"бренд","бренда","брендов"))}`;
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const f=n=>String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const so=n=>f(n)+L(" so‘m"," сум");
const byBrand=s=>DATA.products.filter(p=>p.brand===s);
const inSec=s=>DATA.products.filter(p=>p.sec===s);
const brandsIn=s=>DATA.brands.filter(b=>b.sec===s);
const initials=n=>n.replace(/[^A-Za-z0-9 ]/g,"").split(/\s+/).filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase()||n.slice(0,2);
const photo=p=>p.photo&&DATA.photos[p.photo]?IMG(DATA.photos[p.photo]):"";
const tN=p=>LANG==="ru"&&RUD.type&&RUD.type[p.type]?RUD.type[p.type]:p.type;

/* ---------- savatcha ---------- */
let CART={},DM="city";
try{CART=JSON.parse(localStorage.getItem("mirinae_cart_v1")||"{}")||{};}catch(e){CART={};}
for(const k in CART){if(!PR[k])delete CART[k];}
const save=()=>{try{localStorage.setItem("mirinae_cart_v1",JSON.stringify(CART));}catch(e){}};
const count=()=>Object.values(CART).reduce((a,b)=>a+b,0);
const subTotal=()=>Object.entries(CART).reduce((a,[k,n])=>a+PR[k].price*n,0);
const delFee=()=>{const s=subTotal();if(!s)return 0;if(SHOP.freeFrom&&s>=SHOP.freeFrom)return 0;return DM==="city"?SHOP.deliveryCity:SHOP.deliveryRegion;};
function setQty(slug,n){n=Math.max(0,Math.min(99,n));if(n)CART[slug]=n;else delete CART[slug];save();paintQty();paintCart();}
function add(slug){setQty(slug,(CART[slug]||0)+1);toast(L("Savatchaga qo‘shildi","Добавлено в корзину"));}
function qtyHTML(p){const n=CART[p.slug]||0;
  return n?`<div class="qty" data-q="${p.slug}"><button data-dec="${p.slug}" aria-label="${L("Kamaytirish","Уменьшить")}">−</button><b>${n}</b><button data-inc="${p.slug}" aria-label="${L("Ko‘paytirish","Увеличить")}">+</button></div>`
          :`<button class="addb" data-add="${p.slug}">${L("Savatga","В корзину")}</button>`;}
function paintQty(){document.querySelectorAll("[data-slot]").forEach(el=>{el.innerHTML=qtyHTML(PR[el.dataset.slot]);});
  const c=count();$("#fabn").textContent=c;$("#fab").classList.toggle("has",c>0);}
function paintCart(){
  const items=Object.entries(CART);
  $("#cl").innerHTML=items.length?items.map(([k,n])=>{const p=PR[k],b=BR[p.brand];const ph=photo(p);
    return `<div class="ci">${ph?`<img src="${ph}" alt="">`:`<span class="ci-ph" style="--bc:${b.color}">${esc(initials(b.name))}</span>`}
      <div class="ci-t"><small>${esc(b.name)}</small><b>${esc(eN(p))}</b><span>${n} × ${so(p.price)}</span></div>
      <div class="qty" data-q="${k}"><button data-dec="${k}">−</button><b>${n}</b><button data-inc="${k}">+</button></div></div>`;}).join("")
    :`<p class="cempty">${L("Savatcha hozircha bo‘sh. Brend sahifalaridan mahsulot tanlang.","Корзина пока пуста. Выберите товары на страницах брендов.")}</p>`;
  const sb=subTotal(),df=delFee();
  $("#csub").textContent=so(sb);$("#cdel").textContent=sb?(df?so(df):L("bepul","бесплатно")):"—";$("#ctot").textContent=so(sb+df);
  $("#cnote").textContent=SHOP.freeFrom&&sb&&sb<SHOP.freeFrom?L(`Yana ${so(SHOP.freeFrom-sb)} — va yetkazib berish bepul`,`Ещё ${so(SHOP.freeFrom-sb)} — и доставка бесплатно`):"";
  document.querySelectorAll("#dsel button").forEach(b=>b.classList.toggle("on",b.dataset.m===DM));}
function orderMsg(){if(LANG==="ru")return orderMsgRu();let m=`Assalomu alaykum! ${DATA.shop} do‘konidan buyurtma:\n\n`;let i=1;
  for(const [k,n] of Object.entries(CART)){const p=PR[k];m+=`${i++}. ${BR[p.brand].name} — ${eN(p)}${p.vol?" ("+p.vol+")":""}\n   ${n} × ${f(p.price)} = ${f(p.price*n)} so‘m\n`;}
  const sb=subTotal(),df=delFee();
  m+=`\nMahsulotlar: ${f(sb)} so‘m\nYetkazib berish (${DM==="city"?SHOP.city:"viloyat"}): ${df?f(df)+" so‘m":"bepul"}\nJami: ${f(sb+df)} so‘m\n\nIsm: \nTelefon: \nManzil: `;return m;}
function orderMsgRu(){let m=`Здравствуйте! Заказ в магазине ${DATA.shop}:\n\n`;let i=1;
  for(const [k,n] of Object.entries(CART)){const p=PR[k];m+=`${i++}. ${BR[p.brand].name} — ${eN(p)}${p.vol?" ("+vN(p.vol)+")":""}\n   ${n} × ${f(p.price)} = ${f(p.price*n)} сум\n`;}
  const sb=subTotal(),df=delFee();
  m+=`\nТовары: ${f(sb)} сум\nДоставка (${DM==="city"?"Ташкент":"регион"}): ${df?f(df)+" сум":"бесплатно"}\nИтого: ${f(sb+df)} сум\n\nИмя: \nТелефон: \nАдрес: `;return m;}
function copyTxt(t){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>toast(L("Buyurtma matni nusxalandi","Текст заказа скопирован")),()=>{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");toast(L("Buyurtma matni nusxalandi","Текст заказа скопирован"));}catch(e){}a.remove();});}
function checkout(){if(!count())return toast(L("Savatcha bo‘sh","Корзина пуста"));const m=orderMsg();
  if(SHOP.telegram)window.open("https://t.me/"+SHOP.telegram+"?text="+encodeURIComponent(m),"_blank","noopener");else copyTxt(m);}
function openCart(o){document.body.classList.toggle("cart-open",o);if(o)paintCart();}
let tt;function toast(t){const e=$("#toast");e.textContent=t;e.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>e.classList.remove("show"),1800);}

/* ---------- ro‘yxat filtrlari ---------- */
let FL={q:"",cat:"",conc:"",sort:"rec"};
function applyFilters(list){let r=list.filter(p=>(!FL.cat||p.cat===FL.cat)&&(!FL.conc||p.tags.includes(FL.conc)));
  if(FL.q){const q=FL.q.toLowerCase();r=r.filter(p=>(p.name+" "+p.orig+" "+BR[p.brand].name+" "+p.type+" "+p.desc+" "+(p.rn||"")+" "+(p.rd||"")).toLowerCase().includes(q));}
  if(FL.sort==="asc")r=[...r].sort((a,b)=>a.price-b.price);
  if(FL.sort==="desc")r=[...r].sort((a,b)=>b.price-a.price);
  if(FL.sort==="az")r=[...r].sort((a,b)=>eN(a).localeCompare(eN(b)));
  return r;}
function toolbar(list,opts={}){
  const cats=CATS.filter(c=>list.some(p=>p.cat===c));
  const concs=Object.keys(DATA.conc).filter(c=>list.some(p=>p.tags.includes(c)));
  return `<div class="tools">
   ${opts.search?`<label class="srch"><span class="vh">${L("Qidirish","Поиск")}</span><input id="q" type="search" placeholder="${L("Mahsulot yoki brend nomi…","Название товара или бренда…")}" value="${esc(FL.q)}"></label>`:""}
   <div class="chips" role="group" aria-label="${L("Turi","Тип")}"><button class="chip ${!FL.cat?"on":""}" data-cat="">${L("Hammasi","Все")} <i>${list.length}</i></button>${cats.map(c=>`<button class="chip ${FL.cat===c?"on":""}" data-cat="${esc(c)}">${esc(cN(c))} <i>${list.filter(p=>p.cat===c).length}</i></button>`).join("")}</div>
   ${concs.length>1?`<div class="chips conc" role="group" aria-label="${L("Teri muammosi","Проблема кожи")}"><span class="clab">${L("Muammo bo‘yicha:","По проблеме:")}</span>${concs.map(c=>`<button class="chip ${FL.conc===c?"on":""}" data-conc="${c}">${esc(kN(c))}</button>`).join("")}</div>`:""}
   <label class="sort">${L("Saralash","Сортировка")} <select id="sort"><option value="rec">${L("tavsiya etilgan","рекомендуемые")}</option><option value="asc">${L("arzondan qimmatga","сначала дешевле")}</option><option value="desc">${L("qimmatdan arzonga","сначала дороже")}</option><option value="az">A–Z</option></select></label>
  </div>`;}
function grid(list){const r=applyFilters(list);
  return r.length?`<div class="grid">${r.map(p=>THEME.card(p,BR[p.brand])).join("")}</div>`
   :`<p class="empty">${L("Bu filtr bo‘yicha mahsulot yo‘q. Boshqa turini tanlang yoki filtrni tozalang.","По этому фильтру товаров нет. Выберите другой тип или сбросьте фильтр.")} <button class="linkb" data-reset>${L("Filtrni tozalash","Сбросить фильтр")}</button></p>`;}
function listView(list,opts){return `<div id="lv" data-opts='${JSON.stringify(opts||{})}'>${toolbar(list,opts||{})}<div id="lg">${grid(list)}</div></div>`;}
let CURLIST=[];
function refreshList(){const lv=$("#lv");if(!lv)return;const opts=JSON.parse(lv.dataset.opts);
  const focus=document.activeElement&&document.activeElement.id==="q";
  lv.innerHTML=toolbar(CURLIST,opts)+`<div id="lg">${grid(CURLIST)}</div>`;$("#sort").value=FL.sort;
  if(focus){const q=$("#q");q.focus();q.setSelectionRange(q.value.length,q.value.length);}}

/* ---------- sahifalar ---------- */
function pgHome(){CURLIST=[];
  const kb=brandsIn("k"),pb=brandsIn("p");
  const pick=["anua-heartleaf-toner","torriden-serum-50","boj-relief-sun","ildong-collagen-1000","aestura-atobarrier-cream","medicube-pdrn-serum","daiso-vt-pdrn-toner","celimax-retinal-shot"].map(s=>PR[s]).filter(Boolean);
  return THEME.hero()+
  `<section class="doors">${THEME.door("k",U("brendlar"),inSec("k").length,kb.length)}${THEME.door("p",U("dorixona"),inSec("p").length,pb.length)}${THEME.door("v",U("vitaminlar"),inSec("v").length,brandsIn("v").length)}${THEME.door("d",U("daiso"),inSec("d").length,1)}</section>
   <section class="blk"><div class="bh"><h2>${L("Brendlar","Бренды")}</h2><a href="${U("brendlar")}" class="more">${L(`Barcha ${kb.length} brend`,`Все ${nB(kb.length)}`)}</a></div>
   <div class="bgrid">${kb.slice(0,12).map(b=>THEME.brandTile(b,byBrand(b.slug).length)).join("")}</div></section>
   <section class="blk"><div class="bh"><h2>${L("Mirinae tanlovi","Выбор Mirinae")}</h2><a href="${U("hammasi")}" class="more">${L("Barcha mahsulotlar","Все товары")}</a></div>
   <p style="margin:-6px 0 18px;color:var(--mut)">${L(`Teringizga mosligini bilmayapsizmi? <a href="https://t.me/mirinae_beauty" target="_blank" rel="noopener">@mirinae_beauty</a> ga yozing — shaxsan maslahat beramiz, 24/7.`,`Не уверены, подойдёт ли средство вашей коже? Напишите <a href="https://t.me/mirinae_beauty" target="_blank" rel="noopener">@mirinae_beauty</a> — проконсультируем лично, 24/7.`)}</p>
   <div class="grid">${["torriden-toner-300","skin1004-centella-ampoule","skin1004-centella-ampoule-100","celimax-retinal-shot"].map(s=>PR[s]).filter(Boolean).map(p=>THEME.card(p,BR[p.brand])).join("")}</div></section>
   <section class="blk"><div class="bh"><h2>${L("Koreyada eng ko‘p sotilganlar","Бестселлеры Кореи")}</h2><a href="${U("hammasi")}" class="more">${L("Barcha mahsulotlar","Все товары")}</a></div>
   <div class="grid">${pick.map(p=>THEME.card(p,BR[p.brand])).join("")}</div></section>`+infoHTML();}
function pgBrands(){CURLIST=[];const kb=brandsIn("k");
  return THEME.pageHead(L("Barcha brendlar","Все бренды"),L(`Janubiy Koreyadan olib kelinadigan ${kb.length} ta kosmetika brendi. Brendni tanlang — uning sahifasida barcha mahsulotlari va narxlari.`,`${nB(kb.length)} косметики из Южной Кореи. Выберите бренд — на его странице все товары и цены.`),"k")+
  `<section class="blk"><div class="bgrid all">${kb.map(b=>THEME.brandTile(b,byBrand(b.slug).length)).join("")}</div></section>`;}
function pgBrand(slug){const b=BR[slug];if(!b)return pgNotFound();const list=byBrand(slug);CURLIST=list;
  const back=b.sec==="p"?`<a href="${U("dorixona")}" class="crumb">${L("Dorixona va derma","Аптека и дерма")}</a>`:b.sec==="v"?`<a href="${U("vitaminlar")}" class="crumb">${L("Kollagen va vitaminlar","Коллаген и витамины")}</a>`:`<a href="${U("brendlar")}" class="crumb">${L("Barcha brendlar","Все бренды")}</a>`;
  return THEME.brandHead(b,list,back)+`<section class="blk">${listView(list)}</section>`+otherBrands(b);}
function otherBrands(b){const o=brandsIn(b.sec).filter(x=>x.slug!==b.slug).slice(0,8);if(!o.length)return "";
  return `<section class="blk"><div class="bh"><h2>${L("Boshqa brendlar","Другие бренды")}</h2></div><div class="bgrid">${o.map(x=>THEME.brandTile(x,byBrand(x.slug).length)).join("")}</div></section>`;}
function pgPharma(){const pb=brandsIn("p");const list=inSec("p");CURLIST=list;
  return THEME.pageHead(L("Dorixona va derma-kosmetika","Аптечная и дерма-косметика"),L("Koreya dorixonalari va dermatologik brendlar: to‘siqni tiklovchi kremlar, chandiq gellari, aknega qarshi vositalar va malhamlar.","Корейские аптеки и дерматологические бренды: кремы для восстановления барьера, гели от рубцов, средства против акне и мази."),"p")+
  `<section class="blk"><p class="warn">${L("Dorixona vositalari (malham, gel) yo‘riqnomaga muvofiq ishlatiladi. Surunkali yoki kuchli teri muammosida avval shifokor bilan maslahatlashing.","Аптечные средства (мази, гели) применяются согласно инструкции. При хронических или серьёзных проблемах кожи сначала проконсультируйтесь с врачом.")}</p>
   <div class="bgrid">${pb.map(b=>THEME.brandTile(b,byBrand(b.slug).length)).join("")}</div></section>
   <section class="blk"><div class="bh"><h2>${L("Barcha dorixona mahsulotlari","Все аптечные товары")}</h2></div>${listView(list)}</section>`;}
function pgVit(){const vb=brandsIn("v");const list=inSec("v");CURLIST=list;
  return THEME.pageHead(L("Kollagen va vitaminlar","Коллаген и витамины"),L("Koreyaning kundalik qo‘shimchalari: kollagen stiklari, vitamin C va D, omega-3, kaltsiy, temir, lutein va qizil jenshen.","Ежедневные корейские добавки: коллаген в стиках, витамины C и D, омега-3, кальций, железо, лютеин и красный женьшень."),"v")+
  `<section class="blk"><p class="note">${L("Bular dori emas, biologik faol qo‘shimchalar. Homiladorlik, emizish, surunkali kasallik yoki doimiy dori qabul qilishda avval shifokor bilan maslahatlashing. Yo‘riqnomadagi kunlik me’yordan oshirmang.","Это не лекарства, а биологически активные добавки. При беременности, кормлении грудью, хронических заболеваниях или постоянном приёме лекарств сначала проконсультируйтесь с врачом. Не превышайте суточную дозу из инструкции.")}</p>
   <div class="bgrid">${vb.map(b=>THEME.brandTile(b,byBrand(b.slug).length)).join("")}</div></section>
   <section class="blk"><div class="bh"><h2>${L("Barcha qo‘shimchalar","Все добавки")}</h2></div>${listView(list)}</section>`;}
function pgDaiso(){const list=inSec("d");CURLIST=list;const b=BR.daiso;
  return THEME.daisoHead(b,list)+`<section class="blk">${listView(list)}</section>
  <section class="blk"><p class="note">${L("Daiso mahsulotlari tez tugaydi va do‘konlar bo‘yicha farq qiladi — buyurtmadan so‘ng mavjudligini tasdiqlaymiz.","Товары Daiso быстро заканчиваются и отличаются по магазинам — после заказа мы подтвердим наличие.")}</p></section>`;}
function pgAll(){CURLIST=DATA.products;
  return THEME.pageHead(L("Barcha mahsulotlar","Все товары"),L(`${DATA.products.length} ta mahsulot — qidiruvdan foydalaning, turi va teri muammosi bo‘yicha filtrlang.`,`${nP(DATA.products.length)} — используйте поиск и фильтры по типу и проблеме кожи.`),"all")+`<section class="blk">${listView(DATA.products,{search:true})}</section>`;}
function pgProduct(slug){const p=PR[slug];if(!p)return pgNotFound();const b=BR[p.brand];CURLIST=[];const ph=photo(p);
  const more=byBrand(p.brand).filter(x=>x.slug!==p.slug);const rel=(more.length?more:inSec(p.sec).filter(x=>x.slug!==p.slug)).slice(0,4);
  const secL={k:[U("brendlar"),L("Barcha brendlar","Все бренды")],p:[U("dorixona"),L("Dorixona va derma","Аптека и дерма")],v:[U("vitaminlar"),L("Kollagen va vitaminlar","Коллаген и витамины")],d:[U("daiso"),"Daiso"]}[p.sec];
  return THEME.productHead(p,b)+`<section class="blk pd" style="--bc:${b.color}">
   <div class="pic">${ph?`<img src="${ph}" alt="${esc(b.name+" "+eN(p))}">`:`<div class="ph">${STAR}<b>${esc(initials(b.name))}</b><small>${L("Rasm tez orada","Фото скоро")}</small></div>`}</div>
   <div class="pd-i"><a class="br" href="${BU(b)}">${esc(b.name)}</a>${p.orig?`<p class="orig">${esc(p.orig)}</p>`:""}
    <div class="pd-buy"><div><div class="price">${so(p.price)}</div>${p.vol?`<div class="vol">${esc(vN(p.vol))}</div>`:""}</div><div data-slot="${p.slug}">${qtyHTML(p)}</div></div>
    <p class="pd-d">${esc(pD(p))}</p>
    <dl class="pd-m"><dt>${L("Turi","Тип")}</dt><dd>${esc(tN(p))}</dd><dt>${L("Bo‘lim","Раздел")}</dt><dd><a href="${secL[0]}">${esc(secL[1])}</a> · ${esc(cN(p.cat))}</dd>${p.tags.length?`<dt>${L("Teri muammosi","Проблема кожи")}</dt><dd>${p.tags.map(t=>esc(kN(t))).join(", ")}</dd>`:""}</dl>
    ${p.sec==="p"?`<p class="warn">${L("Yo‘riqnomaga muvofiq ishlating. Surunkali yoki kuchli muammoda avval shifokor bilan maslahatlashing.","Применяйте согласно инструкции. При хронических или серьёзных проблемах сначала проконсультируйтесь с врачом.")}</p>`:p.sec==="v"?`<p class="note">${L("Bu dori emas, biologik faol qo‘shimcha. Kunlik me’yordan oshirmang.","Это не лекарство, а БАД. Не превышайте суточную дозу.")}</p>`:""}
    <p class="pd-h">${L(`Savatchaga qo‘shing va Telegram orqali buyurtma bering yoki <a href="https://t.me/${SHOP.telegram}" target="_blank" rel="noopener">@${SHOP.telegram}</a> ga yozing. ${SHOP.city} bo‘ylab yetkazib berish — ${so(SHOP.deliveryCity)}, viloyatlarga — ${so(SHOP.deliveryRegion)}.`,`Добавьте в корзину и закажите через Telegram или напишите <a href="https://t.me/${SHOP.telegram}" target="_blank" rel="noopener">@${SHOP.telegram}</a>. Доставка по Ташкенту — ${so(SHOP.deliveryCity)}, в регионы — ${so(SHOP.deliveryRegion)}.`)}</p>
   </div></section>
   ${rel.length?`<section class="blk"><div class="bh"><h2>${more.length?L(`${b.name}: boshqa mahsulotlar`,`${b.name}: другие товары`):L("O‘xshash mahsulotlar","Похожие товары")}</h2>${more.length?`<a href="${BU(b)}" class="more">${L("Barchasi","Все")}</a>`:""}</div><div class="grid">${rel.map(x=>THEME.card(x,BR[x.brand])).join("")}</div></section>`:""}`;}
function pgNotFound(){return THEME.pageHead(L("Sahifa topilmadi","Страница не найдена"),L("Bu manzilda sahifa yo‘q. Bosh sahifaga qayting yoki brendni tanlang.","По этому адресу страницы нет. Вернитесь на главную или выберите бренд."),"all")+`<section class="blk"><a class="more" href="${U("")}">${L("Bosh sahifaga","На главную")}</a></section>`;}
function infoHTML(){const ru=LANG==="ru";
  const pay=ru?["Наличными — при получении заказа","Онлайн через Payme / Click","Банковской картой (UZCARD / HUMO)"]:SHOP.payment;
  const eta=x=>ru?x.replace("kun","дн."):x;
  return `<section class="blk info" id="info"><div class="bh"><h2>${L("Yetkazib berish va aloqa","Доставка и контакты")}</h2></div>
  <div class="icards">
   <div class="ic"><h3>${L("Yetkazib berish","Доставка")}</h3><ul><li>${L(SHOP.city+" bo‘ylab","По Ташкенту")} — ${so(SHOP.deliveryCity)}, ${eta(SHOP.etaCity)}</li><li>${L("Viloyatlarga","В регионы")} — ${so(SHOP.deliveryRegion)}, ${eta(SHOP.etaRegion)}</li>${SHOP.freeFrom?`<li>${L(so(SHOP.freeFrom)+" dan yuqori buyurtmaga bepul","Бесплатно при заказе от "+so(SHOP.freeFrom))}</li>`:""}</ul></div>
   <div class="ic"><h3>${L("To‘lov","Оплата")}</h3><ul>${pay.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
   <div class="ic"><h3>${L("Bog‘lanish","Контакты")}</h3><ul><li><a href="https://t.me/${SHOP.telegram}" target="_blank" rel="noopener">Telegram: @${SHOP.telegram}</a></li><li><a href="https://instagram.com/${SHOP.instagram}" target="_blank" rel="noopener">Instagram: @${SHOP.instagram}</a></li><li>${esc(SHOP.phone)}</li><li>${esc(L(SHOP.hours,"24/7 — всегда на связи"))}</li></ul></div>
  </div>
  <div class="faq">${FAQ_().map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div></section>`;}

/* ---------- SEO: sarlavha, meta, structured data ---------- */
const clip=(t,n)=>{t=String(t).replace(/\s+/g," ").trim();return t.length>n?t.slice(0,n-1).replace(/\s+\S*$/,"")+"…":t;};
const SHOPNAME="Mirinae Beauty";
function setMeta(sel,attr,val,make){let el=document.head.querySelector(sel);if(!el){el=document.createElement(make[0]);for(const [k,v] of Object.entries(make[1]))el.setAttribute(k,v);document.head.appendChild(el);}el.setAttribute(attr,val);}
function crumbsLD(items){return {"@type":"BreadcrumbList","itemListElement":items.map(([n,p],i)=>({"@type":"ListItem","position":i+1,"name":n,"item":ABS(p)}))};}
function listLD(list){return {"@type":"ItemList","numberOfItems":list.length,"itemListElement":list.map((p,i)=>({"@type":"ListItem","position":i+1,"url":ABS("mahsulot/"+p.slug)}))};}
function productLD(p){const b=BR[p.brand],ph=photo(p);
  return {"@type":"Product","name":b.name+" "+eN(p)+(p.vol?" "+vN(p.vol):""),"description":pD(p),"sku":p.slug,"category":cN(p.cat),
    "brand":{"@type":"Brand","name":b.name},...(ph?{"image":SITE_URL+ph.slice(BASE.length)}:{}),
    "offers":{"@type":"Offer","url":ABS("mahsulot/"+p.slug),"price":p.price,"priceCurrency":"UZS","availability":"https://schema.org/"+SHOP.availability,"itemCondition":"https://schema.org/NewCondition",
      "seller":{"@type":"Organization","name":SHOPNAME},
      "shippingDetails":{"@type":"OfferShippingDetails","shippingRate":{"@type":"MonetaryAmount","value":SHOP.deliveryCity,"currency":"UZS"},"shippingDestination":{"@type":"DefinedRegion","addressCountry":"UZ"}},
      "hasMerchantReturnPolicy":{"@type":"MerchantReturnPolicy","applicableCountry":"UZ","returnPolicyCategory":"https://schema.org/MerchantReturnFiniteReturnWindow","merchantReturnDays":3,"returnMethod":"https://schema.org/ReturnInStore","returnFees":"https://schema.org/FreeReturn"}}};}
function storeLD(){const phone=/000 00 00/.test(SHOP.phone)?null:SHOP.phone;
  return [{"@type":"OnlineStore","@id":SITE_URL+"/#store","name":SHOPNAME,"alternateName":["Mirinae","미리내"],"url":ABS(""),"logo":SITE_URL+"/img/icon-512.png","image":SITE_URL+"/img/og.jpg",
    "description":L("Koreyadan olib kelingan asl kosmetika, dorixona derma vositalari, kollagen va vitaminlar. Toshkent va O‘zbekiston bo‘ylab yetkazib berish.","Оригинальная корейская косметика, аптечная дерма-косметика, коллаген и витамины. Доставка по Ташкенту и Узбекистану."),
    "areaServed":{"@type":"Country","name":"Uzbekistan"},"currenciesAccepted":"UZS","paymentAccepted":"Cash, Payme, Click, UZCARD, HUMO",
    "sameAs":["https://t.me/"+SHOP.telegram,"https://instagram.com/"+SHOP.instagram],
    "contactPoint":{"@type":"ContactPoint","contactType":"customer service","url":"https://t.me/"+SHOP.telegram,...(phone?{"telephone":phone}:{}),"availableLanguage":["uz","ru"]}},
   {"@type":"WebSite","@id":SITE_URL+"/#site","name":SHOPNAME,"url":ABS(""),"inLanguage":LANG,"publisher":{"@id":SITE_URL+"/#store"}},
   {"@type":"FAQPage","mainEntity":FAQ_().map(([q,a])=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))}];}
function pageMeta(a,b){const home=[L("Bosh sahifa","Главная"),""],kb=brandsIn("k");
  const sec=(k,t,d,path,cr)=>({title:t,desc:d,ld:[{"@type":"CollectionPage","name":t,"url":ABS(path),"description":d},crumbsLD([home,...(cr||[]),[t.split(/ — | \| /)[0],path]]),listLD(k)]});
  if(!a)return {title:L("Mirinae Beauty — Koreya kosmetikasi Toshkentda: asl koreys kosmetikasi","Mirinae Beauty — корейская косметика в Ташкенте: оригинал из Кореи"),
    desc:L(`Koreyadan olib kelingan asl kosmetika: Anua, Torriden, SKIN1004, Medicube va yana ${kb.length-4} ta brend, dorixona derma vositalari, kollagen va Daiso. Narxlar so‘mda, Toshkent va viloyatlarga yetkazib berish.`,
           `Оригинальная косметика из Кореи: Anua, Torriden, SKIN1004, Medicube и ещё ${kb.length-4} брендов, аптечная дерма-косметика, коллаген и Daiso. Цены в сумах, доставка по Ташкенту и регионам.`),ld:storeLD()};
  if(a==="brendlar"&&!b)return {title:L("Koreys kosmetika brendlari — Toshkentda | Mirinae","Бренды корейской косметики — в Ташкенте | Mirinae"),
    desc:L(`Janubiy Koreyaning ${kb.length} ta kosmetika brendi: ${kb.slice(0,8).map(x=>x.name).join(", ")} va boshqalar. Asl mahsulotlar, narxlar so‘mda.`,`${nB(kb.length)} корейской косметики: ${kb.slice(0,8).map(x=>x.name).join(", ")} и другие. Оригинал, цены в сумах.`),
    ld:[{"@type":"CollectionPage","name":L("Koreys kosmetika brendlari","Бренды корейской косметики"),"url":ABS("brendlar")},crumbsLD([home,[L("Brendlar","Бренды"),"brendlar"]])]};
  if(a==="brend"&&BR[b]&&!(b==="daiso")){const br=BR[b],list=byBrand(b),lo=Math.min(...list.map(p=>p.price));
    const parent=br.sec==="p"?[L("Dorixona","Аптека"),"dorixona"]:br.sec==="v"?[L("Vitaminlar","Витамины"),"vitaminlar"]:[L("Brendlar","Бренды"),"brendlar"];
    const t=L(`${br.name} — Toshkentda narxlari, asl mahsulotlar | Mirinae`,`${br.name} — купить в Ташкенте, цены | Mirinae`);
    return {title:t,desc:clip(L(`${br.name}: ${list.length} ta mahsulot, ${so(lo)}dan. `,`${br.name}: ${nP(list.length)}, от ${so(lo)}. `)+bA(br),158),
      ld:[{"@type":"CollectionPage","name":br.name,"url":ABS("brend/"+b),"description":bA(br),"about":{"@type":"Brand","name":br.name}},crumbsLD([home,parent,[br.name,"brend/"+b]]),listLD(list)]};}
  if(a==="mahsulot"&&PR[b]){const p=PR[b],br=BR[p.brand],full=br.name+" "+eN(p);
    const parent=br.slug==="daiso"?["Daiso","daiso"]:[br.name,"brend/"+br.slug];
    return {title:clip(L(`${full}${p.vol?" "+p.vol:""} — narxi ${so(p.price)} | Mirinae`,`${full}${p.vol?" "+vN(p.vol):""} — цена ${so(p.price)} | Mirinae`),95),
      desc:clip(L(`${full} — ${so(p.price)}. ${pD(p)} Toshkent va viloyatlarga yetkazib berish.`,`${full} — ${so(p.price)}. ${pD(p)} Доставка по Ташкенту и регионам.`),160),
      image:photo(p),ld:[productLD(p),crumbsLD([home,parent,[full,"mahsulot/"+p.slug]])]};}
  if(a==="dorixona"&&!b)return sec(inSec("p"),L("Dorixona va derma-kosmetika — Koreya dorixonasi | Mirinae","Аптечная и дерма-косметика из Кореи | Mirinae"),
    L("Koreya dorixonalari va dermatologik brendlar: Aestura, Dr.G, Madeca va boshqalar — to‘siqni tiklovchi kremlar, chandiq gellari, aknega qarshi vositalar. Narxlar so‘mda.","Корейские аптеки и дерматологические бренды — кремы для восстановления барьера, гели от рубцов, средства против акне. Цены в сумах."),"dorixona");
  if(a==="vitaminlar"&&!b)return sec(inSec("v"),L("Koreya kollageni va vitaminlari — Toshkentda | Mirinae","Корейский коллаген и витамины — в Ташкенте | Mirinae"),
    L("Koreyaning kundalik qo‘shimchalari: kollagen stiklari, vitamin C va D, omega-3, kaltsiy, temir, lutein va qizil jenshen. Narxlar so‘mda.","Корейские добавки: коллаген в стиках, витамины C и D, омега-3, кальций, железо, лютеин и красный женьшень. Цены в сумах."),"vitaminlar");
  if(a==="daiso"&&!b)return sec(inSec("d"),L("Daiso Koreya mahsulotlari — Toshkentda | Mirinae","Daiso Корея — товары в Ташкенте | Mirinae"),
    clip(L("Koreya Daiso do‘konlaridan kosmetika topilmalari: ","Находки косметики из корейского Daiso: ")+inSec("d").map(p=>eN(p)).slice(0,4).join(", ")+L(". Narxlar so‘mda.",". Цены в сумах."),160),"daiso");
  if(a==="hammasi"&&!b)return sec(DATA.products,L("Barcha mahsulotlar — koreys kosmetikasi katalogi | Mirinae","Все товары — каталог корейской косметики | Mirinae"),
    L(`Koreya kosmetikasining to‘liq katalogi: ${DATA.products.length} ta mahsulot — tonerlar, serumlar, kremlar, quyosh kremlari, niqoblar, kollagen. Narxlar so‘mda.`,`Полный каталог корейской косметики: ${nP(DATA.products.length)} — тонеры, сыворотки, кремы, солнцезащитные средства, маски, коллаген. Цены в сумах.`),"hammasi");
  return null;}
function applySeo(m,path){const h=document.head;
  document.title=m?m.title:L("Sahifa topilmadi","Страница не найдена")+" — "+SHOPNAME;
  setMeta('meta[name="description"]',"content",m?m.desc:"",["meta",{name:"description"}]);
  setMeta('meta[name="robots"]',"content",m?"index,follow,max-image-preview:large":"noindex",["meta",{name:"robots"}]);
  h.querySelectorAll('link[rel="canonical"],link[rel="alternate"][hreflang],script[type="application/ld+json"]').forEach(x=>x.remove());
  const og={"og:type":path.startsWith("mahsulot/")?"product":"website","og:site_name":SHOPNAME,"og:title":m?m.title:"","og:description":m?m.desc:"","og:url":ABS(path),"og:locale":LANG==="ru"?"ru_RU":"uz_UZ",
    "og:image":SITE_URL+(m&&m.image?m.image.slice(BASE.length):"/img/og.jpg")};
  for(const [k,v] of Object.entries(og))setMeta(`meta[property="${k}"]`,"content",v,["meta",{property:k}]);
  setMeta('meta[name="twitter:card"]',"content","summary_large_image",["meta",{name:"twitter:card"}]);
  if(!m)return;
  const ln=(rel,href,hl)=>{const l=document.createElement("link");l.rel=rel;l.href=href;if(hl)l.hreflang=hl;h.appendChild(l);};
  ln("canonical",ABS(path));ln("alternate",ABS(path,"uz"),"uz");ln("alternate",ABS(path,"ru"),"ru");ln("alternate",ABS(path,"uz"),"x-default");
  const sc=document.createElement("script");sc.type="application/ld+json";sc.textContent=JSON.stringify({"@context":"https://schema.org","@graph":m.ld});h.appendChild(sc);}

function route(){const P=parsePath(location.pathname);const [a,b]=P.parts;LANG=P.lang;CUR=P.path;paintStatic();
  FL={q:"",cat:"",conc:"",sort:"rec"};
  let html;
  if(!a)html=pgHome();else if(a==="brendlar"&&!b)html=pgBrands();else if(a==="brend")html=b==="daiso"?pgDaiso():pgBrand(b||"");else if(a==="mahsulot")html=pgProduct(b||"");
  else if(b)html=pgNotFound();else if(a==="dorixona")html=pgPharma();else if(a==="vitaminlar")html=pgVit();else if(a==="daiso")html=pgDaiso();else if(a==="hammasi")html=pgAll();else html=pgNotFound();
  $("#view").innerHTML=html;
  const pr=a==="mahsulot"&&PR[b]?PR[b]:null,bs=a==="brend"&&BR[b]?BR[b].sec:pr?pr.sec:"";
  const act=bs==="p"?"dorixona":bs==="v"?"vitaminlar":bs==="d"?"daiso":bs==="k"?"brendlar":a;
  document.querySelectorAll(".nav a").forEach(x=>x.classList.toggle("on",x.dataset.p===act));
  applySeo(pageMeta(a,b),b==="daiso"&&a==="brend"?"daiso":P.path);
  if(THEME.after)THEME.after();}
function go(href,push){if(push)history.pushState(null,"",href);route();window.scrollTo(0,0);paintQty();}

/* ---------- til ---------- */
const STR={"logo_sub": ["미리내 · Somon yo‘li", "미리내 · Млечный Путь"], "n1": ["Brendlar", "Бренды"], "n2": ["Dorixona", "Аптека"], "n3": ["Vitaminlar", "Витамины"], "n5": ["Barchasi", "Все"], "f1": ["Mirinae (미리내) — koreyscha “Somon yo‘li”. Har bir brend — osmondagi bir yulduz.", "Mirinae (미리내) — по-корейски «Млечный Путь». Каждый бренд — звезда на небе."], "f2": ["Koreyadan olib kelingan asl kosmetika. Narxlar so‘mda, kargo narxi bilan.", "Оригинальная косметика из Кореи. Цены в сумах, с учётом карго."], "fab": ["Savatcha", "Корзина"], "ch": ["Savatcha", "Корзина"], "d1": ["Toshkent", "Ташкент"], "d2": ["Viloyatga", "В регион"], "r1": ["Mahsulotlar", "Товары"], "r2": ["Yetkazib berish", "Доставка"], "r3": ["Jami", "Итого"], "go": ["Telegram orqali buyurtma berish", "Заказать через Telegram"], "cp": ["Buyurtma matnini nusxalash", "Скопировать текст заказа"], "fn": ["Bo‘limlar", "Разделы"], "fd": ["Dorixona va derma", "Аптека и дерма"], "fv": ["Kollagen va vitaminlar", "Коллаген и витамины"], "fa": ["Barcha mahsulotlar", "Все товары"], "fc": ["Bog‘lanish", "Контакты"], "fh": ["Toshkent · O‘zbekiston bo‘ylab yetkazib berish", "Ташкент · доставка по всему Узбекистану"]};
function paintStatic(){const i=LANG==="ru"?1:0;document.documentElement.lang=LANG;
  document.querySelectorAll("[data-t]").forEach(el=>{const v=STR[el.dataset.t];if(v)el.textContent=v[i];});
  document.querySelectorAll("[data-p]").forEach(el=>{el.href=U(el.dataset.p);});
  const lg=$("#lang");lg.href=U(CUR,LANG==="ru"?"uz":"ru");lg.hreflang=LANG==="ru"?"uz":"ru";
  document.querySelectorAll("#lang span").forEach((x,j)=>x.classList.toggle("on",j===i));}
/* ---------- hodisalar ---------- */
document.addEventListener("click",e=>{const t=e.target.closest("button,a");if(!t)return;
  if(t.tagName==="A"){const href=t.getAttribute("href")||"";
    if(href.startsWith(BASE+"/")&&!t.target&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey&&e.button===0){e.preventDefault();
      if(t.id==="lang"){const y=window.scrollY;history.pushState(null,"",href);route();window.scrollTo(0,y);paintQty();paintCart();}
      else{openCart(false);go(href,href!==location.pathname);}}
    return;}
  if(t.dataset.add){add(t.dataset.add);}
  else if(t.dataset.inc){setQty(t.dataset.inc,(CART[t.dataset.inc]||0)+1);}
  else if(t.dataset.dec){setQty(t.dataset.dec,(CART[t.dataset.dec]||0)-1);}
  else if(t.dataset.cat!==undefined){FL.cat=t.dataset.cat;refreshList();}
  else if(t.dataset.conc!==undefined){FL.conc=FL.conc===t.dataset.conc?"":t.dataset.conc;refreshList();}
  else if(t.hasAttribute("data-reset")){FL={...FL,cat:"",conc:"",q:""};refreshList();}
  else if(t.id==="fab")openCart(true);
  else if(t.id==="cx"||t.id==="cbk")openCart(false);
  else if(t.dataset.m){DM=t.dataset.m;paintCart();}
  else if(t.id==="cgo")checkout();
  else if(t.id==="ccp"){if(!count())return toast(L("Savatcha bo‘sh","Корзина пуста"));copyTxt(orderMsg());}
});
$("#cbk").addEventListener("click",()=>openCart(false));
document.addEventListener("input",e=>{if(e.target.id==="q"){FL.q=e.target.value;refreshList();}});
document.addEventListener("change",e=>{if(e.target.id==="sort"){FL.sort=e.target.value;refreshList();}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")openCart(false);});
window.addEventListener("popstate",()=>{route();paintQty();paintCart();});
/* eski #/ havolalarini yangi manzilga o‘tkazish */
if(/^#\/./.test(location.hash)){const h=location.hash.slice(2).replace(/\/+$/,"");history.replaceState(null,"",U(h));}
route();paintQty();paintCart();
