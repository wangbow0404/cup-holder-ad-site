<script>
/* 초경량 i18n 런타임 */
(function(){
  const SUPPORTED = ["ko","en","zh-hans","zh-hant","ja"];

  function detectLang() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;
    const saved = localStorage.getItem("lang");
    if (saved && SUPPORTED.includes(saved)) return saved;
    const htmlLang = document.documentElement.lang;
    if (htmlLang && SUPPORTED.includes(htmlLang)) return htmlLang;
    const nav = (navigator.language || "ko").toLowerCase();
    if (nav.startsWith("ko")) return "ko";
    if (nav.startsWith("en")) return "en";
    if (nav.startsWith("zh")) return "zh-hans";
    if (nav.startsWith("ja")) return "ja";
    return "ko";
  }

  async function loadDict(lang) {
    const res = await fetch(`/assets/i18n/${lang}.json`, { cache: "no-store" });
    if (!res.ok) throw new Error("i18n load failed: " + lang);
    return res.json();
  }

  function applyDict(dict) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (key in dict) el.textContent = dict[key];
    });
    document.querySelectorAll("[data-i18n-attr]").forEach(el => {
      el.getAttribute("data-i18n-attr").split(",").map(s=>s.trim()).forEach(pair=>{
        const [attr, key] = pair.split(":");
        if (attr && key && (key in dict)) el.setAttribute(attr, dict[key]);
      });
    });
    // 링크에 언어 유지 (내부 링크만, 선택적 동작)
    const lang = document.documentElement.lang;
    document.querySelectorAll("a[href]").forEach(a=>{
      try {
        const url = new URL(a.getAttribute("href", 2), location.origin);
        if (url.origin === location.origin && !url.searchParams.get("lang")) {
          url.searchParams.set("lang", lang);
          a.href = url.pathname + url.search + url.hash;
        }
      } catch(e){}
    });
  }

  async function setLang(lang) {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    const dict = await loadDict(lang);
    applyDict(dict);
    const sel = document.getElementById("lang");
    if (sel) sel.value = lang;
  }

  window.__setLang = setLang;

  // init
  setLang(detectLang());
})();
</script>
