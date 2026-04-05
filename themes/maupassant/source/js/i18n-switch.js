(function() {
  var LANG_KEY = 'lang-preference';

  function getLang() {
    var params = new URLSearchParams(window.location.search);
    var paramLang = params.get('lang');
    if (paramLang) return paramLang;
    return localStorage.getItem(LANG_KEY) || null;
  }

  function setLang(lang) {
    if (lang && lang !== 'zh-CN') {
      localStorage.setItem(LANG_KEY, lang);
    } else {
      localStorage.removeItem(LANG_KEY);
    }
  }

  function updateURL(lang) {
    var url = new URL(window.location.href);
    if (lang && lang !== 'zh-CN') {
      url.searchParams.set('lang', lang);
    } else {
      url.searchParams.delete('lang');
    }
    history.replaceState(null, '', url.toString());
  }

  function getEnglishPath() {
    // Current path like /2026/02/11/ai-writes-my-blog/
    // English version at /en/2026/02/11/ai-writes-my-blog/
    return '/en' + window.location.pathname;
  }

  var translations = {
    'en': {
      '分类': 'Categories', '标签': 'Tags', '最近文章': 'Recent',
      '友情链接': 'Links', '首页': 'Home', '归档': 'Archive',
      '关于': 'About', '订阅': 'RSS', '阅读全文': 'Read More',
      '分享': 'Share', '上一篇': 'Previous', '下一篇': 'Next'
    },
    'zh-CN': {
      'Categories': '分类', 'Tags': '标签', 'Recent': '最近文章',
      'Links': '友情链接', 'Home': '首页', 'Archive': '归档',
      'About': '关于', 'RSS': '订阅', 'Read More': '阅读全文',
      'Share': '分享', 'Previous': '上一篇', 'Next': '下一篇'
    }
  };

  function translateUI(lang) {
    var dict = translations[lang];
    if (!dict) return;

    // Translate text nodes in the page
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      var node = walker.currentNode;
      var text = node.textContent.trim();
      if (text && dict[text]) {
        node.textContent = node.textContent.replace(text, dict[text]);
      }
    }
  }

  function swapContent(html, lang) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');

    // Replace entire body
    document.body.innerHTML = doc.body.innerHTML;

    // Update head: title and lang
    document.title = doc.title;
    document.documentElement.setAttribute('lang', lang || 'en');

    // Translate UI elements that Hexo's __() didn't catch
    translateUI(lang || 'en');
  }

  function loadEnglish() {
    var enPath = getEnglishPath();
    fetch(enPath)
      .then(function(res) {
        if (!res.ok) throw new Error('No English version');
        return res.text();
      })
      .then(function(html) {
        swapContent(html, 'en');
        setLang('en');
        updateURL('en');
        updateSwitchButton('en');
      })
      .catch(function(err) {
        console.warn('i18n: failed to load English version:', err.message, enPath);
      });
  }

  function loadChinese() {
    // Reload without lang param to get original Chinese content
    setLang(null);
    var url = new URL(window.location.href);
    url.searchParams.delete('lang');
    window.location.href = url.toString();
  }

  function updateSwitchButton(currentLang) {
    var btn = document.querySelector('.lang-switch');
    if (!btn) return;
    if (currentLang === 'en') {
      btn.textContent = '\u4E2D\u6587';
      btn.setAttribute('data-target-lang', 'zh-CN');
    } else {
      btn.textContent = 'EN';
      btn.setAttribute('data-target-lang', 'en');
    }
  }

  function init() {
    // Attach click handler to lang switch button
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.lang-switch');
      if (!btn) return;
      e.preventDefault();
      var targetLang = btn.getAttribute('data-target-lang') || 'en';
      if (targetLang === 'en') {
        loadEnglish();
      } else {
        loadChinese();
      }
    });

    // Auto-load English if ?lang=en or localStorage preference
    var lang = getLang();
    if (lang === 'en') {
      // Check if English version exists by looking for lang-switch button
      var btn = document.querySelector('.lang-switch');
      if (btn) {
        loadEnglish();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
