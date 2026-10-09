/* ====== CONFIG: ضع بيانات مشروعك من Supabase > Project Settings > API ====== */
const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co";
const SUPABASE_KEY = "YOUR_PUBLISHABLE_OR_ANON_KEY";
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const $ = i => document.getElementById(i);
const esc = v => String(v ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const DT = n => `${Number(n || 0)} DT`;
const ST = {new:"جديد", doing:"قيد التنفيذ", done:"مكتمل", cancel:"ملغى"};
const PL = {instagram:"Instagram", tiktok:"TikTok", youtube:"YouTube", facebook:"Facebook", thumbnail:"Thumbnail"};
const TY = {followers:"متابعين", views:"مشاهدات", likes:"لايكات", design:"تصميم"};
const opts = o => Object.entries(o);

let D = {services:[], work:[], cfg:{}}, F = {p:"all", t:"all"}, isAdm = false, AT = "dash", AO = [], timer;

/* ---------- تحميل البيانات ---------- */
async function load() {
  const [s, w, c] = await Promise.all([
    sb.from("services").select("*").eq("active", true).order("platform").order("quantity"),
    sb.from("portfolio").select("*").order("created_at", {ascending:false}),
    sb.from("settings").select("*")
  ]);
  D.services = s.data || []; D.work = w.data || [];
  D.cfg = Object.fromEntries((c.data || []).map(r => [r.key, r.value]));
  renderServices(); renderThumbs(); renderPromo();
  $("waLink").href = "https://wa.me/" + String(D.cfg.whatsapp || "").replace(/\D/g, "");
  $("igLink").href = "https://instagram.com/" + (D.cfg.instagram || "");
}

/* ---------- خدمات السوشيال ميديا ---------- */
function card(x) {
  return `<div class="card"><span class="tag">${esc(PL[x.platform] || x.platform)}</span><h3>${esc(x.name)}</h3>
  <div class="qty">${x.quantity ? Number(x.quantity).toLocaleString() + " " : ""}${esc(TY[x.type] || x.type)}</div>
  <div class="price">${DT(x.price)}</div><small class="mut">⏱ ${esc(x.delivery_time || "—")}</small>
  <button class="btn" data-order="${x.id}">اطلب الآن</button></div>`;
}
function renderServices() {
  const L = D.services.filter(x => x.platform !== "thumbnail");
  const ps = [...new Set(L.map(x => x.platform))], ts = [...new Set(L.map(x => x.type))];
  const chip = (k, v, l) => `<button class="chip ${F[k] === v ? "on" : ""}" data-k="${k}" data-v="${esc(v)}">${esc(l)}</button>`;
  $("filters").innerHTML = chip("p","all","كل المنصات") + ps.map(p => chip("p", p, PL[p] || p)).join("") + "<i></i>" +
    chip("t","all","كل الأنواع") + ts.map(t => chip("t", t, TY[t] || t)).join("");
  const R = L.filter(x => (F.p === "all" || x.platform === F.p) && (F.t === "all" || x.type === F.t));
  $("svcGrid").innerHTML = R.map(card).join("") || '<p class="mut">لا توجد باقات حالياً.</p>';
}

/* ---------- Thumbnails + أمثلة المواقع ---------- */
function renderThumbs() {
  const T = D.work.filter(w => w.category === "thumbnail");
  $("gallery").innerHTML = T.map(w => `<div class="card work" data-lb="${w.id}"><img loading="lazy" src="${esc(w.image_url)}" alt="${esc(w.title)}"><div>${esc(w.title)}${w.after_url ? " · قبل/بعد" : ""}</div></div>`).join("") || '<p class="mut">قريباً.</p>';
  $("thumbPacks").innerHTML = D.services.filter(x => x.platform === "thumbnail").map(card).join("");
  $("examples").innerHTML = D.work.filter(w => w.category === "website").map(w => `<div class="card work" data-lb="${w.id}"><img loading="lazy" src="${esc(w.image_url)}" alt="${esc(w.title)}"><div>${esc(w.title)}</div></div>`).join("") || '<p class="mut">قريباً.</p>';
}
function lightbox(id) {
  const w = D.work.find(x => x.id === id); if (!w) return;
  $("lbBody").innerHTML = `<h3>${esc(w.title)}</h3><div class="pair">` +
    (w.after_url ? `<div><p class="mut">قبل</p><img src="${esc(w.image_url)}" alt=""></div><div><p class="mut">بعد</p><img src="${esc(w.after_url)}" alt=""></div>` : `<img src="${esc(w.image_url)}" alt="${esc(w.title)}">`) + "</div>";
  $("lb").classList.add("open");
}

/* ---------- عرض الموقع PROMO + العدّاد ---------- */
function renderPromo() {
  const c = D.cfg;
  $("pTitle").textContent = c.promo_title || "موقع احترافي بلوحة Admin كاملة";
  $("pOld").textContent = c.promo_old ? c.promo_old + " DT" : "";
  $("pPrice").textContent = (c.promo_price || 450) + " DT";
  clearInterval(timer);
  const end = c.promo_end ? new Date(c.promo_end).getTime() : 0, el = $("cd");
  if (!end || end < Date.now()) { el.innerHTML = ""; return; }
  const tick = () => {
    let s = Math.max(0, Math.floor((end - Date.now()) / 1000));
    const p = n => String(n).padStart(2, "0");
    el.innerHTML = [["يوم", s / 86400], ["ساعة", s % 86400 / 3600], ["دقيقة", s % 3600 / 60], ["ثانية", s % 60]].map(([l, v]) => `<b>${p(Math.floor(v))}<br><small>${l}</small></b>`).join("");
    if (!s) clearInterval(timer);
  };
  tick(); timer = setInterval(tick, 1000);
}

/* ---------- نافذة عامة + نموذج ---------- */
function closeM() { $("modal").classList.remove("open"); }
function msg(t, ok) { const m = $("mMsg"); if (m) { m.textContent = t; m.className = "msg" + (ok ? " ok" : ""); } }
/* fields: [name, label, type, value, selectOptions] */
function form(title, fields, save, btn = "حفظ", note = "") {
  $("mBody").innerHTML = `<h3>${title}</h3>${note}<form id="mf">${fields.map(([k, l, t, v = "", o]) =>
    `<label>${l}${t === "textarea" ? `<textarea name="${k}">${esc(v)}</textarea>` :
    t === "select" ? `<select name="${k}">${o.map(([a, b]) => `<option value="${esc(a)}" ${String(a) === String(v) ? "selected" : ""}>${esc(b)}</option>`).join("")}</select>` :
    `<input name="${k}" type="${t}" value="${esc(v)}" ${t === "file" ? 'accept="image/*"' : ""}>`}</label>`).join("")}
    <p id="mMsg" class="msg"></p><button class="btn full">${btn}</button></form>`;
  $("modal").classList.add("open");
  $("mf").onsubmit = async e => {
    e.preventDefault(); const b = e.target.querySelector("button"); b.disabled = true;
    try { await save(new FormData(e.target)); } catch (x) { msg(x.message); }
    b.disabled = false;
  };
}

/* ---------- الطلب المباشر (بدون سلة) ---------- */
function openOrder(kind, id) {
  const s = D.services.find(x => x.id === id);
  const extra = {
    smm: [["link", "رابط الحساب / الفيديو", "url"]],
    thumbnail: [["link", "رابط الفيديو", "url"], ["idea", "الفكرة", "textarea"], ["notes", "ملاحظات", "textarea"]],
    website: [["idea", "نوع موقعك / نشاطك", "text"], ["notes", "ملاحظات", "textarea"]]
  }[kind];
  const fields = [["name", "الاسم", "text"], ["phone", "الهاتف", "tel"], ...extra];
  const note = (s ? `<p class="mut">${esc(s.name)} — ${DT(s.price)}</p>` : `<p class="mut">${D.cfg.promo_price || 450} DT</p>`) +
    (kind === "smm" ? '<div class="warn">لا نطلب كلمة السر أبداً.</div>' : "");
  form("إرسال الطلب", fields, async fd => {
    const name = fd.get("name").trim(), phone = fd.get("phone").trim();
    if (!name || !/^\+?[\d\s]{8,15}$/.test(phone)) throw Error("أدخل الاسم ورقم هاتف صحيح.");
    if (kind === "smm" && !fd.get("link").trim()) throw Error("أدخل الرابط.");
    const d = s ? [`الباقة: ${s.name} (${s.quantity || ""}) — ${s.price} DT`] : ["عرض موقع PROMO"];
    extra.forEach(([k, l]) => { const v = fd.get(k).trim(); if (v) d.push(`${l}: ${v}`); });
    const {error} = await sb.from("orders").insert({id: crypto.randomUUID(), name, phone, order_type: kind, details: d.join("\n"), total: s ? s.price : Number(D.cfg.promo_price || 450), status: "new"});
    if (error) throw error;
    $("mBody").innerHTML = `<h3>✅ تم إرسال طلبك</h3><p>سنتواصل معك قريباً.</p><a class="btn full" target="_blank" rel="noopener" href="${$("waLink").href}">تواصل عبر WhatsApp</a>`;
  }, "إرسال", note);
}

/* ---------- Auth ---------- */
async function checkAdmin() {
  const {data} = await sb.auth.getSession();
  isAdm = false;
  if (data.session) { const r = await sb.rpc("is_admin"); isAdm = r.data === true; }
  $("admBtn").style.display = isAdm ? "" : "none";
  $("loginBtn").style.display = data.session ? "none" : "";
}
function loginForm() {
  form("تسجيل الدخول", [["email", "البريد", "email"], ["password", "كلمة المرور", "password"]], async fd => {
    const {error} = await sb.auth.signInWithPassword({email: fd.get("email").trim(), password: fd.get("password")});
    if (error) throw error;
    await checkAdmin(); closeM(); if (isAdm) openAdmin(); else alert("هذا الحساب ليس أدمن.");
  }, "دخول");
}
async function logout() { await sb.auth.signOut(); $("admin").classList.remove("open"); checkAdmin(); }

/* ---------- لوحة Admin ---------- */
const TABS = {dash: "الإحصائيات", services: "الخدمات", orders: "الطلبات", gallery: "المعرض", promo: "العرض والإعدادات"};
function openAdmin() { if (!isAdm) return; $("admin").classList.add("open"); admin("dash"); }
async function admin(tab) {
  AT = tab;
  $("aTabs").innerHTML = opts(TABS).map(([k, v]) => `<button class="chip ${k === tab ? "on" : ""}" onclick="admin('${k}')">${v}</button>`).join("");
  const el = $("aBody"); el.innerHTML = '<p class="mut">...</p>';
  if (tab === "dash" || tab === "orders") { const {data} = await sb.from("orders").select("*").order("created_at", {ascending: false}); AO = data || []; }
  if (tab === "dash") {
    const rev = AO.filter(o => o.status === "done").reduce((s, o) => s + Number(o.total || 0), 0);
    el.innerHTML = `<div class="stats"><div class="stat">الطلبات<b>${AO.length}</b></div><div class="stat">الجديدة<b>${AO.filter(o => o.status === "new").length}</b></div><div class="stat">الإيرادات (مكتمل)<b>${rev} DT</b></div></div><h3>آخر الطلبات</h3>${AO.slice(0, 5).map(orderRow).join("")}`;
  }
  if (tab === "orders") {
    el.innerHTML = `<div class="bar"><input id="oq" placeholder="بحث بالاسم / الهاتف" oninput="drawOrders()"><select id="os" onchange="drawOrders()" style="max-width:150px"><option value="">كل الحالات</option>${opts(ST).map(([k, v]) => `<option value="${k}">${v}</option>`).join("")}</select></div><div id="oList"></div>`;
    drawOrders();
  }
  if (tab === "services") {
    const {data} = await sb.from("services").select("*").order("platform").order("quantity");
    window.SV = data || [];
    el.innerHTML = `<button class="btn" onclick="svcForm()">+ خدمة جديدة</button>` + SV.map(s => `<div class="row"><div><b>${esc(s.name)}</b><br><small class="mut">${esc(s.platform)} · ${esc(s.type)} · ${s.quantity || ""} · ${DT(s.price)} · ${s.active ? "مفعّلة" : "معطّلة"}</small></div><button class="btn ghost sm" data-act="es" data-id="${s.id}">تعديل</button><button class="btn ghost sm" data-act="ts" data-id="${s.id}">${s.active ? "تعطيل" : "تفعيل"}</button><button class="btn red sm" data-act="ds" data-id="${s.id}">حذف</button></div>`).join("");
  }
  if (tab === "gallery") {
    const {data} = await sb.from("portfolio").select("*").order("created_at", {ascending: false});
    el.innerHTML = `<button class="btn" onclick="workForm()">+ رفع عمل</button>` + (data || []).map(w => `<div class="row"><img src="${esc(w.image_url)}" alt=""><div><b>${esc(w.title)}</b><br><small class="mut">${esc(w.category)}</small></div><button class="btn red sm" data-act="dw" data-id="${w.id}">حذف</button></div>`).join("");
  }
  if (tab === "promo") {
    const c = D.cfg, f = ["promo_title", "نص العرض", "promo_old", "السعر القديم", "promo_price", "سعر PROMO", "promo_end", "نهاية العرض (تاريخ ISO مثل 2026-12-31T23:59)", "whatsapp", "رقم WhatsApp (216XXXXXXXX)", "instagram", "اسم حساب Instagram"];
    el.innerHTML = '<form id="pf">' + [0, 2, 4, 6, 8, 10].map(i => `<label>${f[i + 1]}<input name="${f[i]}" value="${esc(c[f[i]] || "")}"></label>`).join("") + '<p id="pm" class="msg"></p><button class="btn full">حفظ</button></form>';
    $("pf").onsubmit = async e => {
      e.preventDefault();
      const rows = [...new FormData(e.target).entries()].map(([key, value]) => ({key, value}));
      const {error} = await sb.from("settings").upsert(rows);
      $("pm").textContent = error ? error.message : "تم الحفظ ✅"; if (!error) load();
    };
  }
}
function orderRow(o) {
  return `<div class="row"><div><b>${esc(o.name)}</b> · <a href="tel:${esc(o.phone)}">${esc(o.phone)}</a><br><small class="mut">${esc(o.order_type)} · ${new Date(o.created_at).toLocaleString("fr-TN")}</small><pre style="margin:4px 0;white-space:pre-wrap;font:inherit;font-size:13px">${esc(o.details)}</pre></div>
  <select onchange="setSt('${o.id}',this.value)" style="width:130px">${opts(ST).map(([k, v]) => `<option value="${k}" ${o.status === k ? "selected" : ""}>${v}</option>`).join("")}</select>
  <button class="btn red sm" data-act="do" data-id="${o.id}">حذف</button></div>`;
}
function drawOrders() {
  const q = $("oq").value.toLowerCase(), s = $("os").value;
  $("oList").innerHTML = AO.filter(o => (!s || o.status === s) && (!q || `${o.name} ${o.phone}`.toLowerCase().includes(q))).map(orderRow).join("") || '<p class="mut">لا نتائج.</p>';
}
async function setSt(id, status) { await sb.from("orders").update({status}).eq("id", id); }

function svcForm(s = {}) {
  form(s.id ? "تعديل خدمة" : "خدمة جديدة", [
    ["platform", "المنصة", "select", s.platform || "instagram", opts(PL)], ["type", "النوع", "select", s.type || "followers", opts(TY)],
    ["name", "الاسم", "text", s.name], ["quantity", "الكمية", "number", s.quantity], ["price", "السعر (DT)", "number", s.price],
    ["delivery_time", "مدة التسليم", "text", s.delivery_time], ["active", "الحالة", "select", s.active === false ? "0" : "1", [["1", "مفعّلة"], ["0", "معطّلة"]]]
  ], async fd => {
    const row = {platform: fd.get("platform"), type: fd.get("type"), name: fd.get("name").trim(), quantity: Number(fd.get("quantity")) || null, price: Number(fd.get("price")), delivery_time: fd.get("delivery_time").trim(), active: fd.get("active") === "1"};
    if (!row.name || isNaN(row.price)) throw Error("الاسم والسعر مطلوبان.");
    const {error} = s.id ? await sb.from("services").update(row).eq("id", s.id) : await sb.from("services").insert(row);
    if (error) throw error; closeM(); admin("services"); load();
  });
}
async function up(file) {
  const path = `${Date.now()}-${crypto.randomUUID()}.${(file.name.split(".").pop() || "jpg").toLowerCase()}`;
  const {error} = await sb.storage.from("gallery").upload(path, file, {contentType: file.type});
  if (error) throw error;
  return sb.storage.from("gallery").getPublicUrl(path).data.publicUrl;
}
function workForm() {
  form("رفع عمل", [["title", "العنوان", "text"], ["category", "القسم", "select", "thumbnail", [["thumbnail", "Thumbnail"], ["website", "موقع منجز"]]],
    ["img", "الصورة (قبل)", "file"], ["after", "صورة بعد (اختياري)", "file"]], async fd => {
    const f = fd.get("img"), a = fd.get("after");
    if (!f || !f.size) throw Error("اختر صورة.");
    const row = {title: fd.get("title").trim(), category: fd.get("category"), image_url: await up(f), after_url: a && a.size ? await up(a) : null};
    const {error} = await sb.from("portfolio").insert(row);
    if (error) throw error; closeM(); admin("gallery"); load();
  }, "رفع");
}

/* ---------- أحداث عامة (event delegation) ---------- */
document.addEventListener("click", async e => {
  const t = e.target.closest("[data-k],[data-order],[data-lb],[data-act]"); if (!t) return;
  const d = t.dataset;
  if (d.k) { F[d.k] = d.v; renderServices(); }
  else if (d.order) { const s = D.services.find(x => x.id === d.order); openOrder(s && s.platform === "thumbnail" ? "thumbnail" : "smm", d.order); }
  else if (d.lb) lightbox(d.lb);
  else if (d.act) {
    const id = d.id;
    if (d.act === "es") svcForm(SV.find(x => x.id === id));
    if (d.act === "ts") { const s = SV.find(x => x.id === id); await sb.from("services").update({active: !s.active}).eq("id", id); admin("services"); load(); }
    if (d.act === "ds" && confirm("حذف الخدمة؟")) { await sb.from("services").delete().eq("id", id); admin("services"); load(); }
    if (d.act === "dw" && confirm("حذف العمل؟")) { await sb.from("portfolio").delete().eq("id", id); admin("gallery"); load(); }
    if (d.act === "do" && confirm("حذف الطلب؟")) { await sb.from("orders").delete().eq("id", id); admin(AT); }
  }
});
sb.auth.onAuthStateChange(() => setTimeout(checkAdmin, 0));
load(); checkAdmin();
