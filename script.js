/* KRIAA STORE + ADMIN — Supabase
   Product Page + Direct Checkout upgrade
   Keeps the existing Supabase/Auth/Admin/Orders/Products flow.
*/
const SUPABASE_URL="https://cytadjhcbqkzafvrlyys.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_BuZF3A3tXdXm4V4RlZxAOA_LDiZvavH";
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);

let products=[],selectedProduct=null,currentCategory="all",currentUser=null,currentUserIsAdmin=false;
let adminTab="dashboard",adminOrders=[],adminItems=[];
let storeSettings={}, checkoutState={productId:null,size:"",color:"",quantity:1}, galleryIndex=0;
const KRIAA_WHATSAPP="21627049943";

const STATUSES={new:"جديد",processing:"قيد المعالجة",confirmed:"تم التأكيد",shipping:"تم الشحن",delivered:"تم التسليم",cancelled:"ملغى"};
const GOVS={
Tunis:["Tunis","La Marsa","Carthage","Le Bardo","Sidi Bou Said"],Ariana:["Ariana","Raoued","La Soukra","Ettadhamen","Mnihla"],
"Ben Arous":["Ben Arous","Hammam Lif","Hammam Chott","Mornag","Rades"],Manouba:["Manouba","Douar Hicher","Oued Ellil","Tebourba","Djedeida"],
Nabeul:["Nabeul","Hammamet","Dar Chaabane","Korba","Kelibia","Menzel Temime"],Zaghouan:["Zaghouan","Zriba","El Fahs","Bir Mcherga"],
Bizerte:["Bizerte","Menzel Bourguiba","Mateur","Ras Jebel","Sejnane"],Béja:["Béja","Medjez el Bab","Testour","Nefza","Teboursouk"],
Jendouba:["Jendouba","Tabarka","Ain Draham","Bou Salem"],"Le Kef":["Le Kef","Dahmani","Tajerouine","Sakiet Sidi Youssef"],
Siliana:["Siliana","Bou Arada","Makthar","Gaafour"],Sousse:["Sousse","Msaken","Hammam Sousse","Akouda","Kalaa Kebira"],
Monastir:["Monastir","Moknine","Jemmal","Ksar Hellal","Sahline"],Mahdia:["Mahdia","Ksour Essef","Chebba","El Jem","Mellouleche"],
Sfax:["Sfax","Sakiet Ezzit","Sakiet Eddaier","Gremda","El Ain","Agareb"],Kairouan:["Kairouan","Haffouz","Oueslatia","Sbikha","Nasrallah"],
Kasserine:["Kasserine","Sbeitla","Foussana","Feriana","Thala"],"Sidi Bouzid":["Sidi Bouzid","Meknassy","Regueb","Jilma","Bir El Hafey"],
Gabes:["Gabes","Mareth","Metouia","El Hamma","Chenini"],Medenine:["Medenine","Djerba Midoun","Houmt Souk","Zarzis","Ben Gardane"],
Tataouine:["Tataouine","Ghomrassen","Remada","Dehiba"],Gafsa:["Gafsa","Metlaoui","Redeyef","Mdhilla","El Guettar"],
Tozeur:["Tozeur","Nefta","Degueche","Hazoua"],Kebili:["Kebili","Douz","Souk Lahad","Faouar"]
};

const I18N={
ar:{home:"الرئيسية",shop:"المتجر",portfolio:"Portfolio",login:"تسجيل الدخول",logout:"تسجيل الخروج",admin:"Admin",discover:"اكتشف المتجر",shopTitle:"المتجر",shopDesc:"اختر القطعة والمقاس واللون المناسب.",all:"الكل",tshirts:"T-SHIRTS",hoodies:"HOODIES",autres:"AUTRES",loading:"جاري تحميل المنتجات...",noProducts:"لا توجد منتجات حاليًا.",back:"العودة للمتجر",size:"المقاس",color:"اللون",quantity:"الكمية",order:"اطلب الآن",whatsapp:"اطلب عبر WhatsApp",delivery:"التوصيل",highlights:"المميزات",description:"الوصف",customer:"معلومات العميل",first:"الاسم الأول",last:"اللقب",phone:"رقم الهاتف",gov:"الولاية",address:"العنوان",city:"المدينة",choose:"اختر...",summary:"ملخص الطلب",total:"الإجمالي",payment:"الدفع عند التوصيل",confirm:"تأكيد الطلب",sending:"جاري إرسال الطلب...",success:"تم إرسال طلبك بنجاح!",required:"أكمل جميع المعلومات المطلوبة.",stock:"الكمية المطلوبة غير متوفرة.",selectSize:"اختر المقاس",selectColor:"اختر اللون",fullscreen:"عرض الصورة",deliveryUnset:"معلومات التوصيل من إعدادات المتجر",search:"ابحث عن منتج..."}, 
fr:{home:"Accueil",shop:"Boutique",portfolio:"Portfolio",login:"Connexion",logout:"Déconnexion",admin:"Admin",discover:"Découvrir la boutique",shopTitle:"La boutique",shopDesc:"Choisissez la pièce, la taille et la couleur.",all:"TOUT",tshirts:"T-SHIRTS",hoodies:"HOODIES",autres:"AUTRES",loading:"Chargement...",noProducts:"Aucun produit disponible.",back:"Retour à la boutique",size:"TAILLE",color:"COULEUR",quantity:"QUANTITÉ",order:"COMMANDER",whatsapp:"COMMANDER SUR WHATSAPP",delivery:"LIVRAISON",highlights:"HIGHLIGHTS",description:"DESCRIPTION",customer:"INFORMATIONS CLIENT",first:"PRÉNOM",last:"NOM",phone:"TÉLÉPHONE",gov:"GOUVERNORAT",address:"ADRESSE",city:"VILLE",choose:"Choisir...",summary:"RÉSUMÉ",total:"TOTAL",payment:"PAIEMENT À LA LIVRAISON",confirm:"CONFIRMER LA COMMANDE",sending:"Envoi de la commande...",success:"Commande envoyée avec succès !",required:"Veuillez remplir tous les champs obligatoires.",stock:"Quantité indisponible.",selectSize:"Choisir la taille",selectColor:"Choisir la couleur",fullscreen:"Plein écran",deliveryUnset:"Informations de livraison définies dans les réglages",search:"Rechercher un produit..."}, 
en:{home:"Home",shop:"Shop",portfolio:"Portfolio",login:"Login",logout:"Logout",admin:"Admin",discover:"Discover the shop",shopTitle:"Shop",shopDesc:"Choose your piece, size and color.",all:"ALL",tshirts:"T-SHIRTS",hoodies:"HOODIES",autres:"OTHER",loading:"Loading products...",noProducts:"No products available.",back:"Back to shop",size:"SIZE",color:"COLOR",quantity:"QUANTITY",order:"ORDER NOW",whatsapp:"ORDER ON WHATSAPP",delivery:"DELIVERY",highlights:"HIGHLIGHTS",description:"DESCRIPTION",customer:"CUSTOMER INFORMATION",first:"FIRST NAME",last:"LAST NAME",phone:"PHONE",gov:"GOVERNORATE",address:"ADDRESS",city:"CITY",choose:"Choose...",summary:"ORDER SUMMARY",total:"TOTAL",payment:"CASH ON DELIVERY",confirm:"CONFIRM ORDER",sending:"Sending order...",success:"Your order has been sent successfully!",required:"Please complete all required fields.",stock:"Requested quantity is unavailable.",selectSize:"Choose size",selectColor:"Choose color",fullscreen:"Fullscreen",deliveryUnset:"Delivery information is set in store settings",search:"Search products..."}
};
let currentLang=localStorage.getItem("kriaa_lang")||"fr";
const $=id=>document.getElementById(id);
function t(k){return I18N[currentLang]?.[k]||I18N.fr[k]||k;}
function esc(v){return String(v??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));}
function money(v){return `${Number(v||0).toFixed(2)} ${storeSettings.currency||"TND"}`;}
function toast(msg){alert(msg);}

function setLanguage(lang){
  if(!I18N[lang]) return;
  currentLang=lang; localStorage.setItem("kriaa_lang",lang);
  document.documentElement.lang=lang; document.documentElement.dir=lang==="ar"?"rtl":"ltr";
  document.querySelectorAll("[data-i18n]").forEach(el=>el.textContent=t(el.dataset.i18n));
  document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));
  if($("searchInput")) $("searchInput").placeholder=t("search");
  renderProducts();
  if(selectedProduct && $("productPage")?.classList.contains("active")) renderProductPage();
  if(checkoutState.productId && $("checkoutPage")?.classList.contains("active")) renderCheckout();
}
function ensureLanguageSwitcher(){
  if($("languageSwitcher")) return;
  const header=document.querySelector(".site-header");
  if(!header) return;
  const nav=header.querySelector("nav");
  const holder=document.createElement("div");
  holder.id="languageSwitcher";
  holder.innerHTML=languageSwitcher();
  if(nav) nav.parentNode.insertBefore(holder,nav);
  else header.appendChild(holder);
}
function languageSwitcher(){
  return `<div class="language-switcher"><button class="lang-btn" data-lang="ar" onclick="setLanguage('ar')">AR</button><button class="lang-btn" data-lang="fr" onclick="setLanguage('fr')">FR</button><button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button></div>`;
}

function ensureCommercePages(){
  if($("productPage")) return;
  const main=document.querySelector("main")||document.body;
  const product=document.createElement("section");
  product.id="productPage"; product.className="page commerce-page";
  product.innerHTML=`<div class="commerce-shell">
    <button class="back-link" onclick="show('shop')">← <span data-i18n="back">${t("back")}</span></button>
    <div id="productView"></div>
  </div>`;
  const checkout=document.createElement("section");
  checkout.id="checkoutPage"; checkout.className="page commerce-page";
  checkout.innerHTML=`<div class="commerce-shell">
    <button class="back-link" onclick="show('productPage')">← <span data-i18n="back">${t("back")}</span></button>
    <div id="checkoutView"></div>
  </div>`;
  main.append(product,checkout);
  setLanguage(currentLang);
}

function show(id){
  ensureCommercePages(); ensureLanguageSwitcher();
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  $(id)?.classList.add("active");
  $("mainNav")?.classList.remove("open");
  if(id==="portfolio")loadPortfolio();
  if(id==="admin")openAdminDashboard();
  if(id==="productPage")renderProductPage();
  if(id==="checkoutPage")renderCheckout();
}
function toggleMobileMenu(){$("mainNav")?.classList.toggle("open");}
function setCategory(c){currentCategory=c;document.querySelectorAll(".category-btn").forEach(b=>b.classList.toggle("active",b.dataset.category===c));renderProducts();}

async function isAdmin(){
  if(!currentUser){const r=await sb.auth.getUser();currentUser=r.data?.user||null;}
  if(!currentUser)return false;
  const {data,error}=await sb.rpc("check_is_admin");
  if(error){console.error("check_is_admin",error);return false;}
  return data===true;
}
async function updateUserInterface(){
  currentUserIsAdmin=await isAdmin();
  if($("adminButton"))$("adminButton").style.display=currentUserIsAdmin?"inline-block":"none";
  if($("logoutButton"))$("logoutButton").style.display=currentUser?"inline-block":"none";
  if($("loginButton"))$("loginButton").style.display=currentUser?"none":"inline-block";
  ensureLanguageSwitcher(); const ls=$("languageSwitcher"); if(ls)ls.innerHTML=languageSwitcher();
}
function openLogin(){$("loginModal")?.classList.add("open");}
function closeLogin(){$("loginModal")?.classList.remove("open");}
async function login(){
  const email=$("loginEmail")?.value.trim(),password=$("loginPassword")?.value,msg=$("loginMessage");
  if(!email||!password){if(msg)msg.textContent="أدخل البريد وكلمة المرور.";return;}
  if(msg)msg.textContent="جاري تسجيل الدخول...";
  const {data,error}=await sb.auth.signInWithPassword({email,password});
  if(error){if(msg)msg.textContent=error.message;return;}
  currentUser=data.user;await updateUserInterface();closeLogin();show("home");
}
function openSignup(){
  closeLogin(); let m=$("signupModal");
  if(!m){m=document.createElement("div");m.id="signupModal";m.className="modal";m.innerHTML=`<div class="modal-box"><button class="close-modal" onclick="closeSignup()">×</button><span class="eyebrow">KRIAA</span><h2>إنشاء حساب</h2><input id="signupEmail" type="email" placeholder="البريد الإلكتروني"><input id="signupPassword" type="password" placeholder="كلمة المرور"><input id="signupPasswordConfirm" type="password" placeholder="تأكيد كلمة المرور"><button class="primary-btn full" onclick="signup()">إنشاء الحساب</button><p id="signupMessage"></p><button class="secondary-btn full" onclick="backToLogin()">لدي حساب</button></div>`;document.body.appendChild(m);}
  m.classList.add("open");
}
function closeSignup(){$("signupModal")?.classList.remove("open");}
function backToLogin(){closeSignup();openLogin();}
async function signup(){
  const email=$("signupEmail")?.value.trim(),p=$("signupPassword")?.value,c=$("signupPasswordConfirm")?.value,msg=$("signupMessage");
  if(!email||!p||!c){msg.textContent="أكمل المعلومات.";return;}
  if(p.length<6){msg.textContent="كلمة المرور 6 أحرف على الأقل.";return;}
  if(p!==c){msg.textContent="كلمتا المرور غير متطابقتين.";return;}
  msg.textContent="جاري إنشاء الحساب...";
  const {data,error}=await sb.auth.signUp({email,password:p});
  if(error){msg.textContent=error.message;return;}
  if(!data.session){msg.textContent="تم إنشاء الحساب. تحقق من البريد الإلكتروني إذا كان تأكيد البريد مفعّلًا.";return;}
  currentUser=data.user;await updateUserInterface();closeSignup();show("home");toast("تم إنشاء الحساب بنجاح");
}
async function logout(){await sb.auth.signOut();currentUser=null;currentUserIsAdmin=false;await updateUserInterface();show("home");}

async function loadProducts(){
  const {data,error}=await sb.from("products").select("*").eq("active",true).order("position",{ascending:true}).order("created_at",{ascending:false});
  if(error){console.error(error);if($("productsContainer")||$("products"))($("productsContainer")||$("products")).innerHTML=`<div class="empty">${esc(t("loading"))}</div>`;return;}
  products=data||[];renderProducts();
}
function renderProducts(){
  const el=$("productsContainer")||$("products");if(!el)return;
  const q=($("searchInput")?.value||"").trim().toLowerCase();
  const list=products.filter(p=>(currentCategory==="all"||String(p.category||"").toLowerCase()===String(currentCategory).toLowerCase())&&(!q||(p.name||"").toLowerCase().includes(q)||(p.description||"").toLowerCase().includes(q)));
  if(!list.length){el.innerHTML=`<div class="empty">${esc(t("noProducts"))}</div>`;return;}
  el.innerHTML=list.map(p=>`<article class="product-card product-card-lux" onclick="openProduct('${esc(p.id)}')">
    <div class="product-card-image-wrap">${p.badge?`<span class="product-card-badge">${esc(p.badge)}</span>`:""}
      <img class="product-image" src="${esc(p.image_url||"")}" alt="${esc(p.name)}" loading="lazy">
    </div>
    <div class="product-info"><h3>${esc(p.name)}</h3><p>${esc(p.description||"")}</p>
      <div class="price-row"><span class="price">${money(p.price)}</span>${p.old_price?`<span class="old-price">${money(p.old_price)}</span>`:""}</div>
      <button class="product-btn" onclick="event.stopPropagation();openProduct('${esc(p.id)}')">${esc(t("order"))}</button>
    </div>
  </article>`).join("");
}

function getProductImages(p){
  const candidates=[p?.images,p?.image_urls,p?.gallery,p?.gallery_images];
  for(const v of candidates){
    if(Array.isArray(v)){const a=v.filter(Boolean).map(String);if(a.length)return a;}
    if(typeof v==="string"&&v.trim()){const a=v.split(/[\n,]+/).map(x=>x.trim()).filter(Boolean);if(a.length)return a;}
  }
  return p?.image_url?[p.image_url]:[];
}
function getSizes(p){
  return Array.isArray(p?.sizes)?p.sizes.filter(Boolean):typeof p?.sizes==="string"?p.sizes.split(",").map(x=>x.trim()).filter(Boolean):[];
}
function getColors(p){
  return Array.isArray(p?.colors)?p.colors.filter(Boolean):typeof p?.colors==="string"?p.colors.split(",").map(x=>x.trim()).filter(Boolean):[];
}
function getSizeStock(p,size){
  const maps=[p?.size_stock,p?.stock_by_size,p?.sizes_stock,p?.stockBySize];
  for(const map of maps) if(map && typeof map==="object" && Object.prototype.hasOwnProperty.call(map,size)) return Number(map[size]||0);
  return null;
}
function sizeAvailable(p,size){const v=getSizeStock(p,size);return v===null?Number(p.stock||0)>0:v>0;}
function selectProductSize(size){
  checkoutState.size=size;
  document.querySelectorAll(".size-option").forEach(b=>b.classList.toggle("selected",b.dataset.value===size));
}
function selectProductColor(color){
  checkoutState.color=color;
  document.querySelectorAll(".color-option").forEach(b=>b.classList.toggle("selected",b.dataset.value===color));
}
function changeProductQty(delta){
  const stock=Number(selectedProduct?.stock||1),q=Math.max(1,Math.min(stock,Number(checkoutState.quantity||1)+delta));
  checkoutState.quantity=q;if($("productQty"))$("productQty").textContent=q;
}
function renderGallery(images){
  const wrap=$("productGallery");if(!wrap)return;
  const img=images[galleryIndex]||images[0]||"";
  wrap.innerHTML=`<button class="gallery-fullscreen" onclick="openImageFullscreen()" aria-label="${esc(t("fullscreen"))}">⛶</button>
    <img id="galleryMainImage" src="${esc(img)}" alt="${esc(selectedProduct?.name||"KRIAA")}" onclick="openImageFullscreen()">
    ${images.length>1?`<button class="gallery-arrow gallery-prev" onclick="galleryMove(-1)">‹</button><button class="gallery-arrow gallery-next" onclick="galleryMove(1)">›</button>`:""}`;
  const dots=$("galleryDots");if(dots)dots.innerHTML=images.map((_,i)=>`<button class="gallery-dot ${i===galleryIndex?"active":""}" onclick="setGallery(${i})" aria-label="${i+1}"></button>`).join("");
  let sx=0;const node=$("galleryMainImage");
  node?.addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX,{passive:true});
  node?.addEventListener("touchend",e=>{const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>45)galleryMove(dx<0?1:-1);},{passive:true});
}
function setGallery(i){const images=getProductImages(selectedProduct);galleryIndex=Math.max(0,Math.min(i,images.length-1));renderGallery(images);}
function galleryMove(d){const images=getProductImages(selectedProduct);if(!images.length)return;galleryIndex=(galleryIndex+d+images.length)%images.length;renderGallery(images);}
function openImageFullscreen(){
  const images=getProductImages(selectedProduct),src=images[galleryIndex];if(!src)return;
  let m=$("imageLightbox");if(!m){m=document.createElement("div");m.id="imageLightbox";m.className="image-lightbox";m.innerHTML=`<button onclick="closeImageFullscreen()">×</button><img id="lightboxImage" alt="">`;document.body.appendChild(m);}
  $("lightboxImage").src=src;m.classList.add("open");
}
function closeImageFullscreen(){$("imageLightbox")?.classList.remove("open");}

function openProduct(id){
  selectedProduct=products.find(p=>String(p.id)===String(id));if(!selectedProduct)return;
  galleryIndex=0;checkoutState={productId:selectedProduct.id,size:"",color:"",quantity:1};
  const sizes=getSizes(selectedProduct),colors=getColors(selectedProduct);
  checkoutState.size=sizes.find(s=>sizeAvailable(selectedProduct,s))||"";
  checkoutState.color=colors.length===1?colors[0]:"";
  show("productPage");
}
function renderProductPage(){
  if(!selectedProduct)return;
  const p=selectedProduct,images=getProductImages(p),sizes=getSizes(p),colors=getColors(p);
  const el=$("productView");if(!el)return;
  const highlights=p.highlights||p.features||p.product_highlights;
  const hi=Array.isArray(highlights)?highlights.filter(Boolean):typeof highlights==="string"?highlights.split(/\n|•/).map(x=>x.trim()).filter(Boolean):[];
  el.innerHTML=`<div class="product-detail-grid">
    <div class="product-detail-gallery"><div id="productGallery" class="product-gallery"></div><div id="galleryDots" class="gallery-dots"></div></div>
    <div class="product-detail-info">
      <div class="eyebrow">KRIAA / ${esc(p.category||"")}</div>
      ${p.badge?`<div class="lux-badge">${esc(p.badge)}</div>`:""}
      <h1>${esc(p.name)}</h1>
      <div class="detail-price"><strong>${money(p.price)}</strong>${p.old_price?`<span class="old-price">${money(p.old_price)}</span>`:""}</div>
      ${p.description?`<div class="detail-description"><h3>${esc(t("description"))}</h3><p>${esc(p.description)}</p></div>`:""}
      ${sizes.length?`<div class="choice-block"><div class="choice-head"><span>${esc(t("size"))}</span><small>${esc(t("selectSize"))}</small></div><div class="choice-options">${sizes.map(s=>`<button class="size-option ${checkoutState.size===s?"selected":""} ${sizeAvailable(p,s)?"":"disabled"}" ${sizeAvailable(p,s)?`onclick="selectProductSize('${esc(s)}')"`:"disabled"} data-value="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>`:""}
      ${colors.length?`<div class="choice-block"><div class="choice-head"><span>${esc(t("color"))}</span><small>${esc(t("selectColor"))}</small></div><div class="choice-options">${colors.map(c=>`<button class="color-option ${checkoutState.color===c?"selected":""}" onclick="selectProductColor('${esc(c)}')" data-value="${esc(c)}">${esc(c)}</button>`).join("")}</div></div>`:""}
      <div class="choice-block"><div class="choice-head"><span>${esc(t("quantity"))}</span></div><div class="quantity-control"><button onclick="changeProductQty(-1)">−</button><strong id="productQty">${checkoutState.quantity}</strong><button onclick="changeProductQty(1)">+</button></div></div>
      <div class="order-actions"><button class="lux-order-btn" onclick="goToCheckout()">${esc(t("order"))}</button><button class="lux-wa-btn" onclick="orderOnWhatsApp()"><span>◉</span>${esc(t("whatsapp"))}</button></div>
      ${storeSettings.delivery_text?`<div class="delivery-card"><span class="delivery-icon">⌁</span><div><strong>${esc(t("delivery"))}</strong><p>${esc(storeSettings.delivery_text)}</p></div></div>`:""}
      ${hi.length?`<div class="highlights-block"><h3>${esc(t("highlights"))}</h3><ul>${hi.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>`:""}
    </div>
  </div>`;
  renderGallery(images);
}
function validateProductChoice(){
  const sizes=getSizes(selectedProduct),colors=getColors(selectedProduct);
  if(sizes.length&&!checkoutState.size){toast(t("selectSize"));return false;}
  if(colors.length&&!checkoutState.color){toast(t("selectColor"));return false;}
  if(Number(selectedProduct.stock||0)<checkoutState.quantity){toast(t("stock"));return false;}
  return true;
}
function goToCheckout(){if(!validateProductChoice())return;show("checkoutPage");}

function populateGovernoratesSelect(id="checkoutGovernorate"){
  const s=$(id);if(!s)return;
  s.innerHTML=`<option value="">${esc(t("choose"))}</option>`+Object.keys(GOVS).map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join("");
}
function populateCitiesFor(id,g){
  const s=$(id);if(!s)return;
  s.innerHTML=`<option value="">${esc(t("choose"))}</option>`+(GOVS[g]||[]).map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
}
function deliveryFee(){
  const text=String(storeSettings.delivery_text||"");
  const m=[...text.matchAll(/(\d+(?:[.,]\d+)?)\s*(?:DT|TND)/gi)];
  return m.length?Number(m[m.length-1][1].replace(",",".")):0;
}
function renderCheckout(){
  if(!selectedProduct)return;
  const p=selectedProduct,colors=getColors(p),sizes=getSizes(p),fee=deliveryFee(),subtotal=Number(p.price||0)*Number(checkoutState.quantity||1),total=subtotal+fee;
  const el=$("checkoutView");if(!el)return;
  el.innerHTML=`<div class="checkout-layout">
    <div class="checkout-main">
      <div class="eyebrow">KRIAA / CHECKOUT</div><h1>${esc(t("customer"))}</h1>
      <form id="checkoutForm" onsubmit="event.preventDefault();submitCheckoutOrder()">
        <div class="checkout-section"><div class="field-grid two">
          <label>${esc(t("first"))} *<input id="checkoutFirstName" required placeholder="${esc(t("first"))}"></label>
          <label>${esc(t("last"))} *<input id="checkoutLastName" required placeholder="${esc(t("last"))}"></label>
        </div>
        <label>${esc(t("phone"))} *<input id="checkoutPhone" required inputmode="tel" placeholder="+216 XX XXX XXX"></label>
        <div class="field-grid two"><label>${esc(t("gov"))} *<select id="checkoutGovernorate" required onchange="populateCitiesFor('checkoutCity',this.value)"></select></label>
        <label>${esc(t("city"))} *<select id="checkoutCity" required><option value="">${esc(t("choose"))}</option></select></label></div>
        <label>${esc(t("address"))} *<input id="checkoutAddress" required placeholder="${esc(t("address"))}"></label>
        ${sizes.length?`<label>${esc(t("size"))} *<select id="checkoutSize" required>${sizes.map(s=>`<option value="${esc(s)}" ${s===checkoutState.size?"selected":""} ${sizeAvailable(p,s)?"":"disabled"}>${esc(s)}</option>`).join("")}</select></label>`:""}
        ${colors.length?`<label>${esc(t("color"))} *<select id="checkoutColor" required>${colors.map(c=>`<option value="${esc(c)}" ${c===checkoutState.color?"selected":""}>${esc(c)}</option>`).join("")}</select></label>`:""}
        </div>
        <div class="payment-note"><span>✓</span><div><strong>${esc(t("payment"))}</strong></div></div>
        <button class="lux-confirm-btn" type="submit">${esc(t("confirm"))}</button>
        <p id="checkoutMessage" class="checkout-message"></p>
      </form>
    </div>
    <aside class="checkout-summary"><div class="eyebrow">${esc(t("summary"))}</div><img src="${esc(p.image_url||"")}" alt="${esc(p.name)}"><h2>${esc(p.name)}</h2>
      <div class="summary-line"><span>${esc(t("size"))}</span><strong>${esc(checkoutState.size||"—")}</strong></div>
      ${colors.length?`<div class="summary-line"><span>${esc(t("color"))}</span><strong>${esc(checkoutState.color||"—")}</strong></div>`:""}
      <div class="summary-line"><span>${esc(t("quantity"))}</span><strong>${checkoutState.quantity}</strong></div>
      <div class="summary-line"><span>Price</span><strong>${money(subtotal)}</strong></div>
      ${storeSettings.delivery_text?`<div class="summary-line"><span>${esc(t("delivery"))}</span><strong>${fee?money(fee):esc(storeSettings.delivery_text)}</strong></div>`:""}
      <div class="summary-total"><span>${esc(t("total"))}</span><strong>${money(total)}</strong></div>
    </aside>
  </div>`;
  populateGovernoratesSelect();
}
function normalizeTnPhone(v){
  const raw=String(v||"").replace(/[^\d+]/g,"");
  if(/^216[24579]\d{7}$/.test(raw))return raw;
  if(/^\+216[24579]\d{7}$/.test(raw))return raw.slice(1);
  if(/^[24579]\d{7}$/.test(raw))return "216"+raw;
  return null;
}
function currentCheckoutValues(){
  return {
    first: $("checkoutFirstName")?.value.trim(),last:$("checkoutLastName")?.value.trim(),phone:$("checkoutPhone")?.value.trim(),
    gov:$("checkoutGovernorate")?.value,city:$("checkoutCity")?.value,address:$("checkoutAddress")?.value.trim(),
    size:$("checkoutSize")?.value||checkoutState.size,color:$("checkoutColor")?.value||checkoutState.color
  };
}
async function insertOrderCompatible(orderId,values,total){
  const payload={id:orderId,customer_name:`${values.first} ${values.last}`.trim(),whatsapp:values.phone,governorate:values.gov,city:values.city,total,user_id:currentUser?.id||null,
    first_name:values.first,last_name:values.last,address:values.address};
  let r=await sb.from("orders").insert(payload);
  if(r.error && /column .* does not exist|schema cache/i.test(r.error.message||"")){
    const legacy={id:orderId,customer_name:payload.customer_name,whatsapp:values.phone,governorate:values.gov,city:values.city,total,user_id:payload.user_id};
    r=await sb.from("orders").insert(legacy);
  }
  return r;
}
async function submitCheckoutOrder(){
  if(!selectedProduct)return;
  const v=currentCheckoutValues(),phone=normalizeTnPhone(v.phone),qty=Math.max(1,Number(checkoutState.quantity||1)),msg=$("checkoutMessage");
  const sizes=getSizes(selectedProduct),colors=getColors(selectedProduct);
  if(!v.first||!v.last||!phone||!v.gov||!v.city||!v.address||(sizes.length&&!v.size)||(colors.length&&!v.color)){msg.textContent=t("required");return;}
  if(Number(selectedProduct.stock||0)<qty){msg.textContent=t("stock");return;}
  msg.textContent=t("sending");
  const orderId=(crypto.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==="x"?r:(r&3|8);return v.toString(16);}));
  const fee=deliveryFee(),total=Number(selectedProduct.price||0)*qty+fee;
  const {error:orderError}=await insertOrderCompatible(orderId,{...v,phone},total);
  if(orderError){console.error(orderError);msg.textContent="تعذر إرسال الطلب: "+orderError.message;return;}
  const {error:itemError}=await sb.from("order_items").insert({order_id:orderId,product_id:selectedProduct.id,product_name:selectedProduct.name,size:v.size,quantity:qty,price:Number(selectedProduct.price),color:v.color||null});
  if(itemError){console.error(itemError);msg.textContent="تم إنشاء الطلب لكن حدث خطأ في تفاصيل المنتج.";return;}
  const {data:stockOk,error:stockError}=await sb.rpc("decrement_product_stock",{p_product_id:selectedProduct.id,p_quantity:qty});
  if(stockError)console.error("STOCK ERROR",stockError);
  if(stockOk===false){console.warn("Stock was not decremented because quantity was no longer available.");}
  msg.textContent=t("success");toast(t("success"));loadProducts();
  setTimeout(()=>show("shop"),1000);
}
function orderOnWhatsApp(){
  if(!validateProductChoice())return;
  const p=selectedProduct,qty=checkoutState.quantity,total=Number(p.price||0)*qty;
  const text=`KRIAA ORDER\nProduct: ${p.name}\nSize: ${checkoutState.size||"-"}\nColor: ${checkoutState.color||"-"}\nQuantity: ${qty}\nPrice: ${money(total)}`;
  window.open(`https://wa.me/${KRIAA_WHATSAPP}?text=${encodeURIComponent(text)}`,"_blank","noopener");
}

/* Legacy order modal remains available for compatibility with the current HTML. */
function populateGovernorates(){const s=$("orderGovernorate");if(!s)return;s.innerHTML=`<option value="">${esc(t("choose"))}</option>`+Object.keys(GOVS).map(g=>`<option value="${esc(g)}">${esc(g)}</option>`).join("");s.onchange=()=>populateCities(s.value);}
function populateCities(g){const s=$("orderCity");if(!s)return;s.innerHTML=`<option value="">${esc(t("choose"))}</option>`+(GOVS[g]||[]).map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");}
function openOrder(id){openProduct(id);}
function closeOrder(){$("orderModal")?.classList.remove("open");}
async function submitOrder(){if(selectedProduct){goToCheckout();}}

async function openAdminDashboard(){if(!currentUser){openLogin();return;}currentUserIsAdmin=await isAdmin();if(!currentUserIsAdmin){toast("ليس لديك صلاحية Admin");show("home");return;}showAdminPage();switchAdminTab(adminTab||"dashboard");}
function showAdminPage(){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));$("admin")?.classList.add("active");}
function switchAdminTab(tab){if(!currentUserIsAdmin){openAdminDashboard();return;}adminTab=tab;document.querySelectorAll(".admin-tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));const titles={dashboard:"Dashboard",products:"CLOTHES / المنتجات",orders:"ORDERS / الطلبات",portfolioAdmin:"PORTFOLIO",settings:"SETTINGS"};if($("adminTitle"))$("adminTitle").textContent=titles[tab]||"Dashboard";if(tab==="dashboard")renderDashboard();if(tab==="products")renderProductsAdmin();if(tab==="orders")renderOrdersAdmin();if(tab==="portfolioAdmin")renderPortfolioAdmin();if(tab==="settings")renderSettingsAdmin();}

async function getOrders(){const {data,error}=await sb.from("orders").select("*").order("created_at",{ascending:false});if(error)throw error;return data||[];}
async function getOrderItems(){const {data,error}=await sb.from("order_items").select("*");if(error)throw error;return data||[];}
async function renderDashboard(){
 const el=$("adminContent");if(!el)return;el.innerHTML=`<div class="loading-box">جاري تحميل الإحصائيات...</div>`;
 try{
  const orders=await getOrders();const activeProducts=(await sb.from("products").select("id,stock",{count:"exact"}).eq("active",true)).data||[];
  const today=new Date();today.setHours(0,0,0,0);const todayOrders=orders.filter(o=>new Date(o.created_at)>=today);
  const sales=orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+Number(o.total||0),0);const low=activeProducts.filter(p=>Number(p.stock)<=5).length;
  el.innerHTML=`<div class="stats-grid"><div class="stat-card"><small>الطلبات اليوم</small><strong>${todayOrders.length}</strong></div><div class="stat-card"><small>إجمالي الطلبات</small><strong>${orders.length}</strong></div><div class="stat-card"><small>المبيعات</small><strong>${sales.toFixed(2)}</strong><small>TND</small></div><div class="stat-card"><small>المنتجات</small><strong>${activeProducts.length}</strong></div><div class="stat-card"><small>قليلة المخزون</small><strong>${low}</strong></div></div><div class="admin-box"><h3>آخر الطلبات</h3>${orders.slice(0,8).map(orderRowCompact).join("")||'<div class="empty">لا توجد طلبات</div>'}</div>`;
 }catch(e){console.error(e);el.innerHTML=`<div class="admin-box"><p>تعذر تحميل Dashboard.</p><small>${esc(e.message)}</small></div>`;}
}
function orderRowCompact(o){return `<div class="product-admin-row"><div><span class="status-badge status-${esc(o.status)}">${STATUSES[o.status]||esc(o.status)}</span></div><div><b>${esc(o.customer_name)}</b><br><small>${esc(o.governorate||"")} — ${esc(o.city||"")} · ${money(o.total)}</small></div><button class="mini-btn" onclick="switchAdminTab('orders')">فتح</button></div>`;}

async function renderProductsAdmin(){
 const el=$("adminContent");if(!el)return;el.innerHTML=`<div class="loading-box">جاري تحميل المنتجات...</div>`;
 const {data,error}=await sb.from("products").select("*").order("position",{ascending:true}).order("created_at",{ascending:false});if(error){el.innerHTML=`<div class="admin-box">${esc(error.message)}</div>`;return;}
 const list=data||[];el.innerHTML=`<div class="admin-top-actions"><button class="primary-btn" onclick="openProductEditor()">＋ إضافة منتج جديد</button></div><div class="admin-box"><h3>المنتجات (${list.length})</h3>${list.map(p=>`<div class="product-admin-row"><img src="${esc(p.image_url||"")}" alt=""><div><b>${esc(p.name)}</b> ${p.badge?`<span class="badge">${esc(p.badge)}</span>`:""}<br>${money(p.price)} · Stock: ${p.stock} · ${p.active?'ظاهر':'مخفي'} ${p.featured?'· ★ Featured':''}</div><div class="admin-actions"><button onclick="openProductEditor('${esc(p.id)}')">✏️</button><button onclick="toggleProduct('${esc(p.id)}',${!p.active})">${p.active?'👁️':'🙈'}</button><button onclick="moveProduct('${esc(p.id)}',-1)">↑</button><button onclick="moveProduct('${esc(p.id)}',1)">↓</button><button class="danger" onclick="deleteProduct('${esc(p.id)}')">🗑️</button></div></div>`).join("")||'<div class="empty">لا توجد منتجات.</div>'}</div>`;
}
function closeEditor(){$("editorModal")?.classList.remove("open");}
async function openProductEditor(id=null){
 const p=id?(await sb.from("products").select("*").eq("id",id).single()).data:null;selectedProduct=p;
 const x=p||{name:"",description:"",price:0,old_price:"",category:"tshirts",sizes:["S","M","L","XL","XXL"],colors:[],stock:0,image_url:"",badge:"",featured:false,active:true,position:0};
 $("editorContent").innerHTML=`<span class="eyebrow">KRIAA CLOTHES</span><h2>${id?'تعديل المنتج':'إضافة منتج'}</h2><div class="admin-form"><div class="form-grid"><input id="pName" value="${esc(x.name)}" placeholder="اسم المنتج"><select id="pCategory"><option value="tshirts">T-SHIRTS</option><option value="hoodies">HOODIES</option><option value="autres">AUTRES</option></select><input id="pPrice" type="number" step="0.01" value="${x.price??0}" placeholder="السعر"><input id="pOldPrice" type="number" step="0.01" value="${x.old_price??''}" placeholder="السعر القديم"><input id="pBadge" value="${esc(x.badge||'')}" placeholder="Badge: NEW / SALE / LIMITED"><input id="pStock" type="number" min="0" value="${x.stock??0}" placeholder="Stock"><input id="pSizes" class="form-full" value="${esc((x.sizes||[]).join(', '))}" placeholder="المقاسات: S, M, L, XL, XXL"><input id="pColors" class="form-full" value="${esc((x.colors||[]).join(', '))}" placeholder="الألوان: Black, White, Red"><textarea id="pDescription" class="form-full" rows="4" placeholder="وصف المنتج">${esc(x.description||'')}</textarea><input id="pImageUrl" class="form-full" value="${esc(x.image_url||'')}" placeholder="رابط الصورة أو ارفع صورة أسفل"><input id="pImageFile" class="form-full" type="file" accept="image/*"><label class="checkbox-row"><input id="pFeatured" type="checkbox" ${x.featured?'checked':''}> Featured</label><label class="checkbox-row"><input id="pActive" type="checkbox" ${x.active!==false?'checked':''}> إظهار المنتج</label></div><button class="primary-btn full" onclick="saveProduct('${id||''}')">حفظ المنتج</button></div>`;$("editorModal").classList.add("open");$("pCategory").value=x.category||"autres";
}
async function uploadImage(file,bucket){if(!file)return null;const ext=(file.name.split('.').pop()||'jpg').toLowerCase();const path=`${Date.now()}-${crypto.randomUUID()}.${ext}`;const {error}=await sb.storage.from(bucket).upload(path,file,{upsert:false,contentType:file.type});if(error)throw error;return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;}
async function saveProduct(id){try{const file=$("pImageFile").files[0];let image=$("pImageUrl").value.trim();if(file)image=await uploadImage(file,'product-images');const payload={name:$("pName").value.trim(),description:$("pDescription").value.trim(),price:Number($("pPrice").value||0),old_price:$("pOldPrice").value?Number($("pOldPrice").value):null,category:$("pCategory").value,sizes:$("pSizes").value.split(',').map(x=>x.trim()).filter(Boolean),colors:$("pColors").value.split(',').map(x=>x.trim()).filter(Boolean),stock:Math.max(0,Number($("pStock").value||0)),badge:$("pBadge").value.trim(),featured:$("pFeatured").checked,active:$("pActive").checked,image_url:image};const r=id?await sb.from("products").update(payload).eq("id",id):await sb.from("products").insert(payload);if(r.error)throw r.error;closeEditor();toast("تم حفظ المنتج");renderProductsAdmin();loadProducts();}catch(e){console.error(e);toast("تعذر حفظ المنتج: "+e.message);}}
async function deleteProduct(id){if(!confirm("حذف المنتج؟"))return;const {error}=await sb.from("products").delete().eq("id",id);if(error){toast("تعذر الحذف: "+error.message);return;}renderProductsAdmin();loadProducts();}
async function toggleProduct(id,active){const {error}=await sb.from("products").update({active}).eq("id",id);if(error)toast(error.message);else renderProductsAdmin();}
async function moveProduct(id,direction){const {data}=await sb.from("products").select("id,position").order("position",{ascending:true});const i=(data||[]).findIndex(x=>x.id===id),j=i+direction;if(i<0||j<0||j>=data.length)return;const a=data[i],b=data[j];await sb.from("products").update({position:b.position}).eq("id",a.id);await sb.from("products").update({position:a.position}).eq("id",b.id);renderProductsAdmin();loadProducts();}

async function renderOrdersAdmin(){
 const el=$("adminContent");if(!el)return;el.innerHTML=`<div class="loading-box">جاري تحميل الطلبات...</div>`;
 try{adminOrders=await getOrders();adminItems=await getOrderItems();drawOrdersTable();}catch(e){console.error(e);el.innerHTML=`<div class="admin-box"><p>تعذر تحميل الطلبات.</p><small>${esc(e.message)}</small></div>`;}
}
function drawOrdersTable(){
 const el=$("adminContent");const q=($("orderSearch")?.value||"").toLowerCase();const f=$("orderFilter")?.value||"all";
 const list=adminOrders.filter(o=>(f==="all"||o.status===f)&&(!q||`${o.customer_name} ${o.whatsapp} ${o.city} ${o.governorate}`.toLowerCase().includes(q)));
 el.innerHTML=`<div class="admin-box"><div class="admin-filters"><input id="orderSearch" value="${esc(q)}" oninput="drawOrdersTable()" placeholder="ابحث عن طلب / اسم / رقم"><select id="orderFilter" onchange="drawOrdersTable()"><option value="all">كل الحالات</option>${Object.entries(STATUSES).map(([k,v])=>`<option value="${k}" ${f===k?'selected':''}>${v}</option>`).join("")}</select></div><div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>العميل</th><th>المنتج</th><th>المقاس</th><th>اللون</th><th>الكمية</th><th>المكان</th><th>التاريخ</th><th>الحالة</th><th>WhatsApp</th><th>إجراء</th></tr></thead><tbody>${list.map(o=>{const its=adminItems.filter(i=>i.order_id===o.id);return `<tr><td><b>${esc(o.customer_name)}</b><br><small>${esc(o.whatsapp||"")}</small></td><td>${its.map(i=>esc(i.product_name)).join("<br>")||"-"}</td><td>${its.map(i=>esc(i.size)).join("<br>")||"-"}</td><td>${its.map(i=>esc(i.color||"-")).join("<br>")||"-"}</td><td>${its.map(i=>i.quantity).join("<br>")||"-"}</td><td>${esc(o.governorate||"")}<br>${esc(o.city||"")}</td><td>${new Date(o.created_at).toLocaleString("fr-TN")}</td><td><select onchange="changeOrderStatus('${esc(o.id)}',this.value)">${Object.entries(STATUSES).map(([k,v])=>`<option value="${k}" ${o.status===k?'selected':''}>${v}</option>`).join("")}</select></td><td><a class="whatsapp" target="_blank" rel="noopener" href="https://wa.me/${encodeURIComponent(String(o.whatsapp||"").replace(/\\D/g,''))}">WhatsApp</a></td><td><button class="mini-btn" onclick="deleteOrder('${esc(o.id)}')">حذف</button></td></tr>`}).join("")||'<tr><td colspan="10" class="empty">لا توجد طلبات مطابقة.</td></tr>'}</tbody></table></div></div>`;
}
async function changeOrderStatus(id,status){const {error}=await sb.from("orders").update({status}).eq("id",id);if(error)toast(error.message);else renderOrdersAdmin();}
async function archiveOrder(id,archived){const {error}=await sb.from("orders").update({archived}).eq("id",id);if(error)toast(error.message);else renderOrdersAdmin();}
async function deleteOrder(id){if(!confirm("حذف الطلب نهائيًا؟"))return;const {error}=await sb.from("orders").delete().eq("id",id);if(error)toast(error.message);else renderOrdersAdmin();}

async function loadPortfolio(){const {data,error}=await sb.from("portfolio").select("*").eq("active",true).order("position",{ascending:true});const el=$("portfolioContainer");if(!el)return;if(error){el.innerHTML=`<div class="empty">تعذر تحميل Portfolio.</div>`;return;}el.innerHTML=(data||[]).map(p=>`<article class="portfolio-card">${p.image_url?`<img src="${esc(p.image_url)}" alt="${esc(p.title)}">`:""}<div class="p-body"><h3>${esc(p.title)}</h3><p>${esc(p.description||"")}</p></div></article>`).join("")||'<div class="empty">لا توجد أعمال.</div>';}
async function renderPortfolioAdmin(){const {data,error}=await sb.from("portfolio").select("*").order("position",{ascending:true});const el=$("adminContent");if(error){el.innerHTML=`<div class="admin-box">${esc(error.message)}</div>`;return;}el.innerHTML=`<div class="admin-top-actions"><button class="primary-btn" onclick="openPortfolioEditor()">＋ إضافة صورة</button></div><div class="admin-box">${(data||[]).map(p=>`<div class="product-admin-row"><img src="${esc(p.image_url||"")}" alt=""><div><b>${esc(p.title)}</b><br>${esc(p.description||"")}</div><div class="admin-actions"><button onclick="openPortfolioEditor('${esc(p.id)}')">✏️</button><button onclick="togglePortfolio('${esc(p.id)}',${!p.active})">${p.active?'👁️':'🙈'}</button><button class="danger" onclick="deletePortfolio('${esc(p.id)}')">🗑️</button></div></div>`).join("")||'<div class="empty">لا توجد صور.</div>'}</div>`;}
async function openPortfolioEditor(id=null){const p=id?(await sb.from("portfolio").select("*").eq("id",id).single()).data:null;const x=p||{title:'',description:'',image_url:'',active:true,position:0};$("editorContent").innerHTML=`<span class="eyebrow">PORTFOLIO</span><h2>${id?'تعديل الصورة':'إضافة صورة'}</h2><div class="admin-form"><input id="pfTitle" value="${esc(x.title)}" placeholder="العنوان"><textarea id="pfDescription" rows="4" placeholder="الوصف">${esc(x.description||"")}</textarea><input id="pfUrl" value="${esc(x.image_url||'')}" placeholder="رابط الصورة"><input id="pfFile" type="file" accept="image/*"><label class="checkbox-row"><input id="pfActive" type="checkbox" ${x.active!==false?'checked':''}> إظهار</label><button class="primary-btn full" onclick="savePortfolio('${id||''}')">حفظ</button></div>`;$("editorModal").classList.add("open");}
async function savePortfolio(id){try{const f=$("pfFile").files[0];let url=$("pfUrl").value.trim();if(f)url=await uploadImage(f,'portfolio-images');const payload={title:$("pfTitle").value.trim(),description:$("pfDescription").value.trim(),image_url:url,active:$("pfActive").checked};const r=id?await sb.from("portfolio").update(payload).eq("id",id):await sb.from("portfolio").insert(payload);if(r.error)throw r.error;closeEditor();renderPortfolioAdmin();loadPortfolio();}catch(e){toast("تعذر حفظ الصورة: "+e.message);}}
async function togglePortfolio(id,active){const {error}=await sb.from("portfolio").update({active}).eq("id",id);if(error)toast(error.message);else renderPortfolioAdmin();}
async function deletePortfolio(id){if(!confirm("حذف الصورة؟"))return;const {error}=await sb.from("portfolio").delete().eq("id",id);if(error)toast(error.message);else renderPortfolioAdmin();}

async function renderSettingsAdmin(){
 const {data,error}=await sb.from("store_settings").select("*").eq("id",1).single();const el=$("adminContent");if(error){el.innerHTML=`<div class="admin-box">${esc(error.message)}</div>`;return;}const s=data||{};
 el.innerHTML=`<div class="admin-box"><h3>إعدادات المتجر</h3><div class="admin-form"><div class="form-grid"><input id="sName" value="${esc(s.store_name||'KRIAA')}" placeholder="اسم المتجر"><input id="sCurrency" value="${esc(s.currency||'TND')}" placeholder="العملة"><input id="sLogo" class="form-full" value="${esc(s.logo_url||'')}" placeholder="رابط Logo"><input id="sLogoFile" class="form-full" type="file" accept="image/*"><input id="sSizes" class="form-full" value="${esc((s.default_sizes||[]).join(', '))}" placeholder="المقاسات الافتراضية"><input id="sColors" class="form-full" value="${esc((s.default_colors||[]).join(', '))}" placeholder="الألوان الافتراضية"><textarea id="sDelivery" class="form-full" rows="3" placeholder="إعدادات التوصيل">${esc(s.delivery_text||'')}</textarea><textarea id="sOrder" class="form-full" rows="3" placeholder="إعدادات الطلب">${esc(s.order_text||'')}</textarea></div><button class="primary-btn full" onclick="saveSettings()">حفظ الإعدادات</button></div></div><div class="admin-box"><h3>الحساب</h3><p>${esc(currentUser?.email||'')}</p><button class="secondary-btn" onclick="logout()">تسجيل الخروج</button></div>`;
}
async function saveSettings(){try{const f=$("sLogoFile").files[0];let logo=$("sLogo").value.trim();if(f)logo=await uploadImage(f,'store-assets');const payload={store_name:$("sName").value.trim()||'KRIAA',currency:$("sCurrency").value.trim()||'TND',logo_url:logo,default_sizes:$("sSizes").value.split(',').map(x=>x.trim()).filter(Boolean),default_colors:$("sColors").value.split(',').map(x=>x.trim()).filter(Boolean),delivery_text:$("sDelivery").value.trim(),order_text:$("sOrder").value.trim(),updated_at:new Date().toISOString()};const {error}=await sb.from("store_settings").upsert({...payload,id:1});if(error)throw error;toast("تم حفظ الإعدادات");loadSettings();}catch(e){toast("تعذر حفظ الإعدادات: "+e.message);}}
async function loadSettings(){const {data}=await sb.from("store_settings").select("*").eq("id",1).single();if(data){storeSettings=data;if($("heroStoreName"))$("heroStoreName").textContent=data.store_name||"KRIAA";document.title=data.store_name||"KRIAA";}}

sb.auth.onAuthStateChange((_event,session)=>{setTimeout(async()=>{currentUser=session?.user||null;currentUserIsAdmin=await isAdmin();await updateUserInterface();},0);});
sb.channel("kriaa-orders").on("postgres_changes",{event:"*",schema:"public",table:"orders"},()=>{if(currentUserIsAdmin&&adminTab){if(adminTab==="dashboard")renderDashboard();if(adminTab==="orders")renderOrdersAdmin();}}).subscribe();

(async function start(){
  try{ensureCommercePages();ensureLanguageSwitcher();const {data}=await sb.auth.getUser();currentUser=data?.user||null;currentUserIsAdmin=await isAdmin();}catch(e){console.error(e);}
  populateGovernorates();await loadSettings();await loadProducts();await loadPortfolio();await updateUserInterface();setLanguage(currentLang);
})();
