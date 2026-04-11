'use strict';

// Custom Atom feed generator for English posts.
// Emits /atom.en.xml containing only posts with `lang: en`,
// using the /en/YYYY/MM/DD/slug/ permalinks produced by scripts/i18n.js.

const { encodeURL, full_url_for } = require('hexo-util');

function xmlEscape(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function stripControlChars(str) {
  // eslint-disable-next-line no-control-regex
  return String(str || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
}

function getEnPostPath(post) {
  const slug = post.slug.replace(/\.en$/, '');
  return 'en/' + post.date.format('YYYY/MM/DD') + '/' + slug + '/';
}

hexo.extend.generator.register('en_feed', function(locals) {
  const config = this.config;
  const feedConfig = config.feed || {};
  const limit = feedConfig.limit || 100;
  const contentLimit = feedConfig.content_limit || 140;
  const contentLimitDelim = feedConfig.content_limit_delim || ' ';
  const includeContent = feedConfig.content;

  const siteUrl = config.url.replace(/\/+$/, '');
  const enHomeUrl = siteUrl + '/en/';
  const feedUrl = siteUrl + '/atom.en.xml';

  let posts = locals.posts
    .filter(post => post.lang === 'en' && post.draft !== true)
    .sort('-date');

  const postsArray = posts.toArray ? posts.toArray() : Array.prototype.slice.call(posts);
  if (postsArray.length === 0) return [];

  const limited = limit ? postsArray.slice(0, limit) : postsArray;

  const firstPost = limited[0];
  const feedUpdated = (firstPost.updated || firstPost.date).toISOString();

  const entries = limited.map(post => {
    const permalink = siteUrl + '/' + getEnPostPath(post);
    const published = post.date.toISOString();
    const updated = (post.updated || post.date).toISOString();

    let summary = post.description || post.excerpt || '';
    if (!summary && post.content) {
      let shortContent = post.content.substring(0, contentLimit);
      if (contentLimitDelim) {
        const delimPos = shortContent.lastIndexOf(contentLimitDelim);
        if (delimPos > -1) shortContent = shortContent.substring(0, delimPos);
      }
      summary = shortContent;
    }

    const categories = post.categories && post.categories.toArray
      ? post.categories.toArray()
      : [];
    const tags = post.tags && post.tags.toArray ? post.tags.toArray() : [];

    const parts = [];
    parts.push('  <entry>');
    parts.push('    <title>' + xmlEscape(post.title) + '</title>');
    parts.push('    <link href="' + encodeURL(permalink) + '"/>');
    parts.push('    <id>' + encodeURL(permalink) + '</id>');
    parts.push('    <published>' + published + '</published>');
    parts.push('    <updated>' + updated + '</updated>');

    if (includeContent && post.content) {
      parts.push('    <content type="html"><![CDATA[' + stripControlChars(post.content) + ']]></content>');
    }
    if (summary) {
      parts.push('    <summary type="html">' + xmlEscape(stripControlChars(summary)) + '</summary>');
    }

    categories.forEach(cat => {
      parts.push('    <category term="' + xmlEscape(cat.name) + '" scheme="' + encodeURL(cat.permalink) + '"/>');
    });
    tags.forEach(tag => {
      parts.push('    <category term="' + xmlEscape(tag.name) + '" scheme="' + encodeURL(tag.permalink) + '"/>');
    });

    parts.push('  </entry>');
    return parts.join('\n');
  });

  const iconUrl = feedConfig.icon ? full_url_for.call(this, feedConfig.icon) : '';
  const feedTitle = config.title + ' (English)';
  const feedSubtitle = 'English posts on AI-native engineering, Agent architecture, LLM engineering, and Harness Engineering.';

  const lines = [];
  lines.push('<?xml version="1.0" encoding="utf-8"?>');
  lines.push('<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en">');
  lines.push('  <title>' + xmlEscape(feedTitle) + '</title>');
  if (iconUrl) lines.push('  <icon>' + xmlEscape(iconUrl) + '</icon>');
  lines.push('  <subtitle>' + xmlEscape(feedSubtitle) + '</subtitle>');
  lines.push('  <link href="' + encodeURL(feedUrl) + '" rel="self"/>');
  lines.push('  <link href="' + encodeURL(enHomeUrl) + '"/>');
  lines.push('  <updated>' + feedUpdated + '</updated>');
  lines.push('  <id>' + encodeURL(enHomeUrl) + '</id>');
  if (config.author) {
    lines.push('  <author>');
    lines.push('    <name>' + xmlEscape(config.author) + '</name>');
    if (config.email) lines.push('    <email>' + xmlEscape(config.email) + '</email>');
    lines.push('  </author>');
  }
  lines.push('  <generator uri="https://hexo.io/">Hexo</generator>');
  lines.push(entries.join('\n'));
  lines.push('</feed>');

  return {
    path: 'atom.en.xml',
    data: lines.join('\n')
  };
});
