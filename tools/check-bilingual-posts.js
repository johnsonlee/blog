#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = process.cwd();
const POSTS_DIR = path.join('source', '_posts');

function runGit(args) {
  try {
    return execFileSync('git', args, {
      cwd: ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return '';
  }
}

function changedPostFiles() {
  const files = new Set();
  const mergeBase =
    runGit(['merge-base', 'HEAD', 'origin/master']) ||
    runGit(['merge-base', 'HEAD', 'master']);

  if (mergeBase) {
    for (const file of runGit(['diff', '--name-only', '--diff-filter=ACMRTD', `${mergeBase}...HEAD`]).split('\n')) {
      if (file) files.add(file);
    }
  }

  for (const range of [['--cached'], []]) {
    for (const file of runGit(['diff', '--name-only', '--diff-filter=ACMRTD', ...range]).split('\n')) {
      if (file) files.add(file);
    }
  }

  for (const file of runGit(['ls-files', '--others', '--exclude-standard', POSTS_DIR]).split('\n')) {
    if (file) files.add(file);
  }

  return [...files].filter(file => file.startsWith(`${POSTS_DIR}/`) && file.endsWith('.md'));
}

function pairFor(file) {
  if (file.endsWith('.en.md')) {
    return {
      zh: file.replace(/\.en\.md$/, '.md'),
      en: file,
    };
  }
  return {
    zh: file,
    en: file.replace(/\.md$/, '.en.md'),
  };
}

function parsePost(file, errors) {
  const absolute = path.join(ROOT, file);
  const text = fs.readFileSync(absolute, 'utf8');
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    errors.push(`${file}: missing valid YAML front matter.`);
    return null;
  }

  const frontMatter = {};
  let listKey = null;
  for (const line of match[1].split(/\r?\n/)) {
    const item = line.match(/^\s+-\s+(.+)\s*$/);
    if (item && listKey) {
      frontMatter[listKey].push(item[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }

    const field = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!field) {
      listKey = null;
      continue;
    }

    const [, key, rawValue] = field;
    if (rawValue === '') {
      frontMatter[key] = [];
      listKey = key;
    } else {
      frontMatter[key] = rawValue.trim().replace(/^["']|["']$/g, '');
      listKey = null;
    }
  }

  return {
    file,
    frontMatter,
    body: text.slice(match[0].length),
  };
}

function count(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function headingLevels(body) {
  return body
    .split(/\r?\n/)
    .map(line => line.match(/^(#{2,3})\s+\S/))
    .filter(Boolean)
    .map(match => match[1].length);
}

function externalUrls(body) {
  return [...new Set(body.match(/https?:\/\/[^\s)>\]]+/g) || [])].sort();
}

function imageTargets(body) {
  const targets = [];
  for (const match of body.matchAll(/!\[[^\]]*\]\(([^\s)]+)(?:\s+["'][^)]*)?\)/g)) {
    targets.push(match[1]);
  }
  return [...new Set(targets)].sort();
}

function normalizedImageTarget(target) {
  return target.replace(/\.en(?=\.[^.\/?#]+(?:[?#].*)?$)/, '');
}

function englishSvgTarget(target) {
  return target.replace(/\.svg(?=([?#].*)?$)/, '.en.svg');
}

function sameArray(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function checkPair(zh, en, errors) {
  const scalarFields = ['date', 'i18n_key'];
  const listFields = ['categories', 'tags'];

  if (zh.frontMatter.lang === 'en') {
    errors.push(`${zh.file}: Chinese post must not set lang: en.`);
  }
  if (en.frontMatter.lang !== 'en') {
    errors.push(`${en.file}: English post must set lang: en.`);
  }

  for (const field of scalarFields) {
    if (!zh.frontMatter[field] || !en.frontMatter[field]) {
      errors.push(`${zh.file} / ${en.file}: both posts must define ${field}.`);
    } else if (zh.frontMatter[field] !== en.frontMatter[field]) {
      errors.push(`${zh.file} / ${en.file}: ${field} must match exactly.`);
    }
  }

  for (const field of listFields) {
    const zhValue = Array.isArray(zh.frontMatter[field]) ? zh.frontMatter[field] : [];
    const enValue = Array.isArray(en.frontMatter[field]) ? en.frontMatter[field] : [];
    if (!sameArray(zhValue, enValue)) {
      errors.push(`${zh.file} / ${en.file}: ${field} must contain the same values in the same order.`);
    }
  }

  const zhMore = count(zh.body, /<!--\s*more\s*-->/g);
  const enMore = count(en.body, /<!--\s*more\s*-->/g);
  if (zhMore !== 1 || enMore !== 1) {
    errors.push(`${zh.file} / ${en.file}: each post must contain exactly one <!-- more --> marker.`);
  }

  const zhHeadings = headingLevels(zh.body);
  const enHeadings = headingLevels(en.body);
  if (!sameArray(zhHeadings, enHeadings)) {
    errors.push(`${zh.file} / ${en.file}: H2/H3 structure must match. Chinese=${zhHeadings.join(',')} English=${enHeadings.join(',')}.`);
  }

  const zhUrls = externalUrls(zh.body);
  const enUrls = externalUrls(en.body);
  if (!sameArray(zhUrls, enUrls)) {
    errors.push(`${zh.file} / ${en.file}: external URL sets must match exactly.`);
  }

  const zhImages = imageTargets(zh.body);
  const enImages = imageTargets(en.body);
  const normalizedZhImages = zhImages.map(normalizedImageTarget).sort();
  const normalizedEnImages = enImages.map(normalizedImageTarget).sort();
  if (!sameArray(normalizedZhImages, normalizedEnImages)) {
    errors.push(`${zh.file} / ${en.file}: image reference sets must match after language suffix normalization.`);
  }

  for (const target of zhImages.filter(value => value.startsWith('/images/') && /\.svg(?:[?#].*)?$/.test(value))) {
    const expected = englishSvgTarget(target);
    if (!enImages.includes(expected)) {
      errors.push(`${en.file}: visible-text SVG must use the paired asset ${expected}.`);
      continue;
    }
    const sourcePath = expected.replace(/^\//, 'source/');
    if (!fs.existsSync(path.join(ROOT, sourcePath))) {
      errors.push(`${en.file}: paired SVG does not exist: ${sourcePath}.`);
    }
  }
}

function main() {
  const errors = [];
  const pairs = new Map();

  for (const file of changedPostFiles()) {
    const pair = pairFor(file);
    pairs.set(pair.zh, pair);
  }

  for (const pair of pairs.values()) {
    const zhExists = fs.existsSync(path.join(ROOT, pair.zh));
    const enExists = fs.existsSync(path.join(ROOT, pair.en));

    if (zhExists !== enExists) {
      const missing = zhExists ? pair.en : pair.zh;
      errors.push(`${missing}: missing bilingual counterpart for changed published post.`);
      continue;
    }
    if (!zhExists && !enExists) {
      continue;
    }

    const zh = parsePost(pair.zh, errors);
    const en = parsePost(pair.en, errors);
    if (zh && en) {
      checkPair(zh, en, errors);
    }
  }

  if (errors.length > 0) {
    console.error(`Bilingual post check failed with ${errors.length} issue(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Bilingual post check passed${pairs.size ? ` (${pairs.size} changed pair(s))` : ''}.`);
}

main();
