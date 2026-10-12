/* Elofid shared header: labels in four languages, language menu, mobile menu.
   Each page keeps its own language logic. This script only follows it. */
(function () {
  var T = {
    en: { tagline: 'On-chain security', hub: 'Security Hub', firewall: 'Firewall', developers: 'Developers', pricing: 'Pricing', docs: 'Docs', community: 'Community', cta_token: 'Scan a token', cta_wallet: 'Check my wallet', cta_build: 'Start building free', signin: 'Sign in', menu: 'Menu', language: 'Language', full_access: 'Full access' },
    zh: { tagline: '链上安全', hub: '安全中心', firewall: '防火墙', developers: '开发者', pricing: '定价', docs: '文档', community: '社区', cta_token: '扫描代币', cta_wallet: '检查我的钱包', cta_build: '免费开始构建', signin: '登录', menu: '菜单', language: '语言', full_access: '完整访问' },
    ar: { tagline: 'الأمان على البلوكشين', hub: 'مركز الأمان', firewall: 'الجدار الناري', developers: 'المطورون', pricing: 'الأسعار', docs: 'الوثائق', community: 'المجتمع', cta_token: 'افحص توكن', cta_wallet: 'افحص محفظتي', cta_build: 'ابدأ البناء مجانًا', signin: 'تسجيل الدخول', menu: 'القائمة', language: 'اللغة', full_access: 'وصول كامل' },
    ru: { tagline: 'Ончейн-безопасность', hub: 'Security Hub', firewall: 'Файервол', developers: 'Разработчикам', pricing: 'Тарифы', docs: 'Документация', community: 'Сообщество', cta_token: 'Проверить токен', cta_wallet: 'Проверить кошелёк', cta_build: 'Начать бесплатно', signin: 'Войти', menu: 'Меню', language: 'Язык', full_access: 'Полный доступ' }
  };
  var CODE = { en: 'EN', zh: '中文', ar: 'عربي', ru: 'RU' };

  function header() { return document.querySelector('[data-eui-header]'); }

  function currentLang() {
    var h = header();
    var active = h && h.querySelector('.lang-btn.active');
    var l = active && active.getAttribute('data-lang');
    var sel = document.getElementById('language');
    if (!l && sel && sel.value) l = sel.value;
    return T[l] ? l : 'en';
  }

  function paint() {
    var h = header(); if (!h) return;
    var lang = currentLang(), d = T[lang];
    h.querySelectorAll('[data-eui]').forEach(function (el) {
      var k = el.getAttribute('data-eui');
      if (d[k] !== undefined) el.textContent = d[k];
    });
    h.querySelectorAll('[data-eui-aria]').forEach(function (el) {
      var k = el.getAttribute('data-eui-aria');
      if (d[k] !== undefined) el.setAttribute('aria-label', d[k]);
    });
    var cur = h.querySelector('[data-eui-lang-current]');
    if (cur) cur.textContent = CODE[lang];
  }

  // Some pages scale the whole document (html zoom). The header always renders at true size.
  function trueSize() {
    var h = header(); if (!h) return;
    h.style.zoom = '';
    var z = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    if (Math.abs(z - 1) > 0.01) h.style.zoom = String(1 / z);
  }

  function init() {
    var h = header(); if (!h) return;
    trueSize();
    window.addEventListener('resize', trueSize);
    var lang = h.querySelector('.eui-lang');
    var trigger = h.querySelector('.eui-lang-trigger');
    var burger = h.querySelector('.eui-burger');
    var sel = document.getElementById('language');

    function closeLang() { if (lang) { lang.classList.remove('is-open'); trigger && trigger.setAttribute('aria-expanded', 'false'); } }

    if (trigger) trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !lang.classList.contains('is-open');
      lang.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });

    h.querySelectorAll('.eui-lang-menu .lang-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var l = b.getAttribute('data-lang');
        // Developers page: its language logic listens to the hidden select
        if (sel && sel.tagName === 'SELECT') {
          h.querySelectorAll('.eui-lang-menu .lang-btn').forEach(function (x) { x.classList.toggle('active', x === b); });
          if (sel.value !== l) { sel.value = l; sel.dispatchEvent(new Event('change', { bubbles: true })); }
        }
        setTimeout(function () { paint(); closeLang(); }, 0);
      });
    });

    document.addEventListener('click', function (e) { if (lang && !lang.contains(e.target)) closeLang(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeLang(); h.classList.remove('is-open'); burger && burger.setAttribute('aria-expanded', 'false'); } });

    if (burger) burger.addEventListener('click', function () {
      var open = !h.classList.contains('is-open');
      h.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    h.querySelectorAll('[data-eui-action="quick"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var btn = document.getElementById('heroQuickScanBtn');
        if (btn) { e.preventDefault(); btn.click(); }
      });
    });

    // Follow the page's own language switching
    if (window.MutationObserver) {
      var mo = new MutationObserver(paint);
      h.querySelectorAll('.lang-btn').forEach(function (b) { mo.observe(b, { attributes: true, attributeFilter: ['class'] }); });
    }
    if (sel) sel.addEventListener('change', function () {
      h.querySelectorAll('.eui-lang-menu .lang-btn').forEach(function (x) { x.classList.toggle('active', x.getAttribute('data-lang') === sel.value); });
      paint();
    });
    paint();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
