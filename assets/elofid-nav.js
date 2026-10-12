/* Elofid shared header: labels in four languages, language menu, mobile menu.
   Each page keeps its own language logic. This script only follows it. */
(function () {
  var T = {
    en: { f_about: "Elofid is an on-chain security and continuous risk intelligence platform. Token scanning, wallet protection, continuous monitoring and a developer API.", f_tag: "Security that starts before the loss.", f_products: "Products", f_hub: "Security Hub", f_firewall: "Firewall", f_developers: "Developers", f_bot: "Scanner Bot", f_community: "Community", f_whitepaper: "Whitepaper", f_faq: "FAQ", f_legal: "Legal", f_terms: "Terms", f_privacy: "Privacy", f_refund: "Refund Policy", tagline: 'On-chain security', hub: 'Security Hub', firewall: 'Firewall', developers: 'Developers', pricing: 'Pricing', docs: 'Docs', community: 'Community', cta_token: 'Scan a token', cta_wallet: 'Check my wallet', cta_build: 'Start building free', signin: 'Sign in', menu: 'Menu', language: 'Language', full_access: 'Full access' },
    zh: { f_about: "Elofid 是一个链上安全与持续风险情报平台。提供代币扫描、钱包保护、持续监控和开发者 API。", f_tag: "安全始于损失之前。", f_products: "产品", f_hub: "安全中心", f_firewall: "防火墙", f_developers: "开发者", f_bot: "扫描机器人", f_community: "社区", f_whitepaper: "白皮书", f_faq: "常见问题", f_legal: "法律", f_terms: "条款", f_privacy: "隐私", f_refund: "退款政策", tagline: '链上安全', hub: '安全中心', firewall: '防火墙', developers: '开发者', pricing: '定价', docs: '文档', community: '社区', cta_token: '扫描代币', cta_wallet: '检查我的钱包', cta_build: '免费开始构建', signin: '登录', menu: '菜单', language: '语言', full_access: '完整访问' },
    ar: { f_about: "Elofid منصة للأمان على البلوكشين ولاستخبارات المخاطر المستمرة. فحص التوكنات، وحماية المحافظ، والمراقبة المستمرة، و Developer API.", f_tag: "أمان يبدأ قبل الخسارة.", f_products: "المنتجات", f_hub: "مركز الأمان", f_firewall: "الجدار الناري", f_developers: "المطورون", f_bot: "بوت الفحص", f_community: "المجتمع", f_whitepaper: "الورقة البيضاء", f_faq: "الأسئلة الشائعة", f_legal: "قانوني", f_terms: "الشروط", f_privacy: "الخصوصية", f_refund: "سياسة الاسترداد", tagline: 'الأمان على البلوكشين', hub: 'مركز الأمان', firewall: 'الجدار الناري', developers: 'المطورون', pricing: 'الأسعار', docs: 'الوثائق', community: 'المجتمع', cta_token: 'افحص توكن', cta_wallet: 'افحص محفظتي', cta_build: 'ابدأ البناء مجانًا', signin: 'تسجيل الدخول', menu: 'القائمة', language: 'اللغة', full_access: 'وصول كامل' },
    ru: { f_about: "Elofid — платформа ончейн-безопасности и непрерывной аналитики рисков. Сканирование токенов, защита кошельков, непрерывный мониторинг и Developer API.", f_tag: "Безопасность, которая начинается до потерь.", f_products: "Продукты", f_hub: "Security Hub", f_firewall: "Файервол", f_developers: "Разработчикам", f_bot: "Бот-сканер", f_community: "Сообщество", f_whitepaper: "Whitepaper", f_faq: "FAQ", f_legal: "Правовая информация", f_terms: "Условия", f_privacy: "Конфиденциальность", f_refund: "Политика возврата", tagline: 'Ончейн-безопасность', hub: 'Security Hub', firewall: 'Файервол', developers: 'Разработчикам', pricing: 'Тарифы', docs: 'Документация', community: 'Сообщество', cta_token: 'Проверить токен', cta_wallet: 'Проверить кошелёк', cta_build: 'Начать бесплатно', signin: 'Войти', menu: 'Меню', language: 'Язык', full_access: 'Полный доступ' }
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
    document.querySelectorAll('[data-eui-footer] [data-eui]').forEach(function (el) {
      var k = el.getAttribute('data-eui');
      if (d[k] !== undefined) el.textContent = d[k];
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
