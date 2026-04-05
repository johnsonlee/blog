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
      data: Object.assign({}, post, { slug: slug, path: path + 'index.html' }),
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
        __index: true
      },
      layout: ['index', 'archive']
    });
  }

  return result;
});
