'use strict';

const { JSDOM } = require('jsdom');

const ACCENT = '#2563eb';
const TEXT = '#1f2937';
const MUTED = '#6b7280';
const FONT_FAMILY = '\'mp-quote\',\'PingFang SC\',system-ui,-apple-system,BlinkMacSystemFont,\'Helvetica Neue\',\'Hiragino Sans GB\',\'Microsoft YaHei UI\',\'Microsoft YaHei\',Arial,sans-serif';

const INLINE_STYLES = {
  article: [
    'font-size:16px',
    'line-height:1.78',
    'color:' + TEXT,
    'font-family:' + FONT_FAMILY,
    'letter-spacing:0',
    'word-break:break-word'
  ].join(';'),
  p: 'margin:0 0 18px;font-size:16px;line-height:1.78;color:' + TEXT + ';',
  h1: 'margin:34px 0 18px;font-size:22px;line-height:1.4;font-weight:700;color:#111827;',
  h2: 'margin:34px 0 16px;padding:0;font-size:20px;line-height:1.45;font-weight:700;color:#111827;',
  h3: 'margin:28px 0 14px;font-size:18px;line-height:1.5;font-weight:700;color:#111827;',
  h4: 'margin:24px 0 12px;font-size:17px;line-height:1.5;font-weight:700;color:#111827;',
  blockquote: 'border-left:3px solid #0969da;margin:0;padding:0.2em 1em;color:#656d76;',
  blockquoteParagraph: 'margin:0 0 10px;font-size:16px;line-height:1.75;color:#656d76;',
  ul: 'margin:0 0 18px 0;padding-left:24px;color:' + TEXT + ';',
  ol: 'margin:0 0 18px 0;padding-left:24px;color:' + TEXT + ';',
  li: 'margin:0 0 8px;font-size:16px;line-height:1.75;color:' + TEXT + ';',
  a: 'color:' + ACCENT + ';text-decoration:none;border-bottom:1px solid rgba(37,99,235,0.35);',
  strong: 'font-weight:700;color:#111827;',
  em: 'font-style:italic;color:' + TEXT + ';',
  img: 'display:block;max-width:100%;height:auto;margin:24px auto;border-radius:6px;',
  pre: 'margin:22px 0;padding:14px 16px;background:#f6f8fa;border:1px solid #e5e7eb;border-radius:6px;white-space:pre-wrap;word-break:break-word;line-height:1.65;font-size:14px;color:#111827;overflow-x:auto;',
  codeBlock: 'font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;font-size:14px;line-height:1.65;color:#111827;background:transparent;',
  inlineCode: 'margin:0 2px;padding:2px 5px;border-radius:4px;background:#f3f4f6;color:#be123c;font-family:SFMono-Regular,Consolas,"Liberation Mono",Menlo,monospace;font-size:0.92em;',
  table: 'width:100%;border-collapse:collapse;margin:22px 0;font-size:14px;line-height:1.6;color:' + TEXT + ';',
  th: 'border:1px solid #d1d5db;background:#f9fafb;padding:8px 10px;font-weight:700;text-align:left;',
  td: 'border:1px solid #d1d5db;padding:8px 10px;text-align:left;',
  hr: 'border:0;border-top:1px solid #e5e7eb;margin:30px 0;',
  figure: 'margin:24px 0;',
  figcaption: 'margin-top:8px;text-align:center;font-size:13px;line-height:1.6;color:' + MUTED + ';'
};

function appendStyle(element, style) {
  const current = element.getAttribute('style');
  element.setAttribute('style', current ? current.replace(/;?\s*$/, ';') + style : style);
}

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isAbsoluteUrl(value) {
  return /^[a-z][a-z0-9+.-]*:/i.test(value) || value.indexOf('//') === 0;
}

function toAbsoluteUrl(value, baseUrl) {
  if (!value) return value;
  if (value.indexOf('//') === 0) return 'https:' + value;
  if (isAbsoluteUrl(value)) return value;

  try {
    return new URL(value, baseUrl).toString();
  } catch (err) {
    return value;
  }
}

function getPostSlug(post) {
  return String(post.slug || '').replace(/\.en$/, '');
}

function getCanonicalPostPath(post) {
  const prefix = post.lang === 'en' ? 'en/' : '';
  return prefix + post.date.format('YYYY/MM/DD') + '/' + getPostSlug(post) + '/index.html';
}

function getPostPermalink(config, post) {
  const siteUrl = String(config.url || '').replace(/\/+$/, '');
  return siteUrl + '/' + getCanonicalPostPath(post).replace(/index\.html$/, '');
}

function getWechatPath(post) {
  return getCanonicalPostPath(post).replace(/index\.html$/, 'wechat.html');
}

function replaceHighlightBlocks(fragment) {
  const document = fragment.ownerDocument;
  Array.from(fragment.querySelectorAll('figure.highlight')).forEach(figure => {
    const source = figure.querySelector('.code pre') || figure.querySelector('td.code pre') || figure.querySelector('pre');
    if (!source) return;

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.textContent = extractCodeText(source);
    pre.appendChild(code);
    figure.replaceWith(pre);
  });
}

function extractCodeText(source) {
  const lines = Array.from(source.querySelectorAll('span.line'));
  if (lines.length > 0) {
    return lines.map(line => line.textContent).join('\n').replace(/\n+$/, '');
  }

  return Array.from(source.childNodes).map(node => {
    return node.nodeName.toLowerCase() === 'br' ? '\n' : node.textContent;
  }).join('').replace(/\n+$/, '');
}

function replaceUnsupportedEmbeds(fragment, baseUrl) {
  const document = fragment.ownerDocument;
  Array.from(fragment.querySelectorAll('iframe,object,embed')).forEach(embed => {
    const rawUrl = embed.getAttribute('src') || embed.getAttribute('data');
    if (!rawUrl) {
      embed.remove();
      return;
    }

    const url = toAbsoluteUrl(rawUrl, baseUrl);
    const paragraph = document.createElement('p');
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.textContent = url;
    paragraph.appendChild(link);
    embed.replaceWith(paragraph);
  });
}

function normalizeLinksAndImages(fragment, baseUrl) {
  Array.from(fragment.querySelectorAll('a[href]')).forEach(link => {
    link.setAttribute('href', toAbsoluteUrl(link.getAttribute('href'), baseUrl));
  });

  Array.from(fragment.querySelectorAll('img[src]')).forEach(img => {
    img.setAttribute('src', toAbsoluteUrl(img.getAttribute('src'), baseUrl));
    img.removeAttribute('width');
    img.removeAttribute('height');
  });
}

function removeUnsupportedElements(fragment) {
  Array.from(fragment.querySelectorAll('script,style,link,.headerlink,#more')).forEach(element => element.remove());
}

function numberHeadings(fragment) {
  let h2 = 0;
  let h3 = 0;
  let h4 = 0;

  Array.from(fragment.querySelectorAll('h2,h3,h4')).forEach(heading => {
    const tag = heading.tagName.toLowerCase();
    let prefix = '';

    if (tag === 'h2') {
      h2 += 1;
      h3 = 0;
      h4 = 0;
      prefix = h2 + '.  ';
    } else if (tag === 'h3') {
      h3 += 1;
      h4 = 0;
      prefix = h2 + '.' + h3 + '.  ';
    } else if (tag === 'h4') {
      h4 += 1;
      prefix = h2 + '.' + h3 + '.' + h4 + '.  ';
    }

    heading.insertBefore(fragment.ownerDocument.createTextNode(prefix), heading.firstChild);
  });
}

function inlineElementStyles(fragment) {
  removeUnsupportedElements(fragment);

  Array.from(fragment.querySelectorAll('*')).forEach(element => {
    const tag = element.tagName.toLowerCase();
    const inBlockquote = Boolean(element.closest('blockquote'));

    switch (tag) {
      case 'p':
        appendStyle(element, inBlockquote ? INLINE_STYLES.blockquoteParagraph : INLINE_STYLES.p);
        break;
      case 'h1':
        appendStyle(element, INLINE_STYLES.h1);
        break;
      case 'h2':
        appendStyle(element, INLINE_STYLES.h2);
        break;
      case 'h3':
        appendStyle(element, INLINE_STYLES.h3);
        break;
      case 'h4':
      case 'h5':
      case 'h6':
        appendStyle(element, INLINE_STYLES.h4);
        break;
      case 'blockquote':
        appendStyle(element, INLINE_STYLES.blockquote);
        break;
      case 'ul':
        appendStyle(element, INLINE_STYLES.ul);
        break;
      case 'ol':
        appendStyle(element, INLINE_STYLES.ol);
        break;
      case 'li':
        appendStyle(element, INLINE_STYLES.li);
        break;
      case 'a':
        appendStyle(element, INLINE_STYLES.a);
        break;
      case 'strong':
      case 'b':
        appendStyle(element, inBlockquote ? 'font-weight:700;color:#656d76;' : INLINE_STYLES.strong);
        break;
      case 'em':
      case 'i':
        appendStyle(element, inBlockquote ? 'font-style:italic;color:#656d76;' : INLINE_STYLES.em);
        break;
      case 'img':
        appendStyle(element, INLINE_STYLES.img);
        break;
      case 'pre':
        appendStyle(element, INLINE_STYLES.pre);
        break;
      case 'code':
        if (element.parentElement && element.parentElement.tagName.toLowerCase() === 'pre') {
          appendStyle(element, INLINE_STYLES.codeBlock);
        } else {
          appendStyle(element, INLINE_STYLES.inlineCode);
        }
        break;
      case 'table':
        appendStyle(element, INLINE_STYLES.table);
        break;
      case 'th':
        appendStyle(element, INLINE_STYLES.th);
        break;
      case 'td':
        appendStyle(element, INLINE_STYLES.td);
        break;
      case 'hr':
        appendStyle(element, INLINE_STYLES.hr);
        break;
      case 'figure':
        appendStyle(element, INLINE_STYLES.figure);
        break;
      case 'figcaption':
        appendStyle(element, INLINE_STYLES.figcaption);
        break;
      default:
        break;
    }
  });

}

function renderWechatContent(html, baseUrl, lang) {
  const fragment = JSDOM.fragment(html || '');

  replaceHighlightBlocks(fragment);
  replaceUnsupportedEmbeds(fragment, baseUrl);
  normalizeLinksAndImages(fragment, baseUrl);
  removeUnsupportedElements(fragment);
  if (lang !== 'en') {
    numberHeadings(fragment);
  }
  inlineElementStyles(fragment);

  const wrapper = fragment.ownerDocument.createElement('section');
  appendStyle(wrapper, INLINE_STYLES.article);
  wrapper.appendChild(fragment);
  return wrapper.innerHTML;
}

function getCategories(post) {
  if (!post.categories || !post.categories.toArray) return [];
  return post.categories.toArray().map(category => category.name);
}

function renderWechatPost(post, config) {
  const lang = post.lang || config.language || 'zh-CN';
  const isEnglish = lang === 'en';
  const permalink = getPostPermalink(config, post);
  const date = post.date.format(config.date_format || 'YYYY-MM-DD');
  const categories = getCategories(post).join(' / ');
  const meta = [date, config.author, categories].filter(Boolean).join(' · ');
  const title = escapeHtml(post.title);
  const originalLabel = isEnglish ? 'Original' : '原文链接';

  return [
    '<!doctype html>',
    '<html lang="' + escapeHtml(lang) + '">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width,initial-scale=1">',
    '  <meta name="robots" content="noindex,nofollow">',
    '  <link rel="canonical" href="' + escapeHtml(permalink) + '">',
    '  <title>' + title + ' | WeChat</title>',
    '</head>',
    '<body style="margin:0;padding:0;background:#f6f7f9;font-family:' + FONT_FAMILY + ';">',
    '  <main style="box-sizing:border-box;max-width:677px;margin:0 auto;padding:28px 16px 42px;background:#ffffff;font-family:' + FONT_FAMILY + ';">',
    '    <h1 style="margin:0 0 12px;font-size:26px;line-height:1.35;font-weight:700;color:#111827;letter-spacing:0;">' + title + '</h1>',
    '    <p style="margin:0 0 28px;font-size:14px;line-height:1.6;color:' + MUTED + ';">' + escapeHtml(meta) + '</p>',
    renderWechatContent(post.content, permalink, lang),
    '    <section style="margin:34px 0 0;padding-top:18px;border-top:1px solid #e5e7eb;">',
    '      <p style="margin:0;font-size:14px;line-height:1.7;color:' + MUTED + ';">' + escapeHtml(originalLabel) + '：<a href="' + escapeHtml(permalink) + '" style="' + INLINE_STYLES.a + '">' + escapeHtml(permalink) + '</a></p>',
    '    </section>',
    '  </main>',
    '</body>',
    '</html>'
  ].join('\n');
}

hexo.extend.generator.register('wechat_posts', function(locals) {
  return locals.posts
    .filter(post => post.draft !== true)
    .map(post => ({
      path: getWechatPath(post),
      data: renderWechatPost(post, this.config)
    }));
});
