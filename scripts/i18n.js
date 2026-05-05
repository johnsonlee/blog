'use strict';

var i18nMap = {};

// Keep .en in slug — default generator creates /yyyy/mm/dd/xxx.en/ (harmless)
// Our i18n_en_posts generator creates the clean /en/yyyy/mm/dd/xxx/ URL

// Build i18n pair map (lazy, rebuilt when needed)
var i18nMapBuilt = false;

function ensureI18nMap() {
  if (i18nMapBuilt) return;
  i18nMap = {};
  hexo.locals.get('posts').forEach(function(post) {
    if (!post.i18n_key) return;
    if (!i18nMap[post.i18n_key]) i18nMap[post.i18n_key] = {};
    i18nMap[post.i18n_key][post.lang || 'zh-CN'] = post;
  });
  i18nMapBuilt = true;
}

// Rebuild on generate (for watch mode / file changes)
hexo.extend.filter.register('before_generate', function() {
  i18nMapBuilt = false;
});

// Helper: get URL for a post based on its language
function getPostUrl(post) {
  var slug = post.slug.replace(/\.en$/, '');
  var datePath = post.date.format('YYYY/MM/DD');
  if (post.lang === 'en') {
    return '/en/' + datePath + '/' + slug + '/';
  }
  return '/' + datePath + '/' + slug + '/';
}

// Inject i18n data into template locals
hexo.extend.filter.register('template_locals', function(locals) {
  var page = locals.page;
  if (!page) return locals;

  // Inject i18n_pair for posts with i18n_key
  ensureI18nMap();
  if (page.i18n_key && i18nMap[page.i18n_key]) {
    var pair = {};
    Object.keys(i18nMap[page.i18n_key]).forEach(function(lang) {
      pair[lang] = hexo.config.url + getPostUrl(i18nMap[page.i18n_key][lang]);
    });
    page.i18n_pair = pair;
    page.i18n_lang = page.lang || 'zh-CN';
  }

  // Language-aware prev/next navigation
  if (page.title && (page.prev || page.next || page.lang === 'en')) {
    var pageLang = page.lang || 'zh-CN';
    var allPosts = hexo.locals.get('posts').sort('-date').toArray();
    var sameLangPosts = allPosts.filter(function(p) {
      return (p.lang || 'zh-CN') === pageLang;
    });
    // Find current post in same-language list by i18n_key or slug
    var currentSlug = page.slug ? page.slug.replace(/\.en$/, '') : '';
    var idx = -1;
    for (var i = 0; i < sameLangPosts.length; i++) {
      var pSlug = sameLangPosts[i].slug ? sameLangPosts[i].slug.replace(/\.en$/, '') : '';
      if (page.i18n_key && sameLangPosts[i].i18n_key === page.i18n_key) {
        idx = i; break;
      }
      if (pSlug === currentSlug) {
        idx = i; break;
      }
    }
    if (idx !== -1) {
      // Hexo convention: prev = newer post (lower index), next = older post (higher index)
      page.prev = idx > 0 ? sameLangPosts[idx - 1] : null;
      page.next = idx < sameLangPosts.length - 1 ? sameLangPosts[idx + 1] : null;
      // Set prev_link/next_link for English posts to use /en/ URLs
      if (pageLang === 'en') {
        if (page.prev) page.prev_link = getPostUrl(page.prev);
        if (page.next) page.next_link = getPostUrl(page.next);
      }
    }
  }

  // Mark page with i18n flag so templates can filter English posts
  if (page.posts && !page.lang) {
    page._i18n_filter_en = true;
  }

  return locals;
});

// Generator: English post pages under /en/
hexo.extend.generator.register('i18n_en_posts', function(locals) {
  return locals.posts.filter(function(post) {
    return post.lang === 'en';
  }).map(function(post) {
    var slug = post.slug.replace(/\.en$/, '');
    var path = 'en/' + post.date.format('YYYY/MM/DD') + '/' + slug + '/';
    return {
      path: path + 'index.html',
      data: Object.assign({}, post, { slug: slug, path: path + 'index.html', lang: 'en', language: 'en' }),
      layout: ['post', 'page', 'index']
    };
  });
});

// Generator: English index at /en/
hexo.extend.generator.register('i18n_en_index', function(locals) {
  var enPosts = locals.posts.filter(function(post) {
    return post.lang === 'en';
  }).sort('-date');

  if (enPosts.length === 0) return [];

  // Convert to plain array in case Warehouse returns a query object
  var enPostsArray = enPosts.toArray ? enPosts.toArray() : Array.prototype.slice.call(enPosts);

  // Create modified post objects with correct /en/ paths
  var mappedPosts = enPostsArray.map(function(post) {
    var slug = post.slug.replace(/\.en$/, '');
    var enPath = 'en/' + post.date.format('YYYY/MM/DD') + '/' + slug + '/index.html';
    return Object.assign({}, post, { path: enPath, slug: slug });
  });

  var perPage = hexo.config.per_page || 10;
  var totalPages = Math.ceil(mappedPosts.length / perPage) || 1;
  var result = [];

  for (var i = 0; i < totalPages; i++) {
    var path = i === 0 ? 'en/' : 'en/page/' + (i + 1) + '/';
    result.push({
      path: path + 'index.html',
      data: {
        posts: (function(arr) { arr.toArray = function() { return arr; }; return arr; })(mappedPosts.slice(i * perPage, (i + 1) * perPage)),
        total: totalPages,
        current: i + 1,
        current_url: path,
        base: 'en/',
        lang: 'en',
        language: 'en',
        __index: true
      },
      layout: ['index', 'archive']
    });
  }

  return result;
});
