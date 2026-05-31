#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, 'source', '_posts');
const PUBLIC_DIR = path.join(ROOT, 'public');
const CONFIG_FILE = path.join(ROOT, '_config.yml');

function walk(dir, predicate, files = []) {
  if (!fs.existsSync(dir)) {
    return files;
  }

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, predicate, files);
    } else if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }
  return files;
}

function lineNumber(text, index) {
  return text.slice(0, index).split(/\n/).length;
}

function snippet(text, index) {
  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + 80);
  return text.slice(start, end).replace(/\s+/g, ' ').trim();
}

function checkSmartypantsConfig(errors) {
  const config = fs.readFileSync(CONFIG_FILE, 'utf8');
  if (!/marked:\s*\n(?:[ \t]+[^\n]*\n)*?[ \t]+smartypants:\s*false\b/.test(config)) {
    errors.push(`${path.relative(ROOT, CONFIG_FILE)}: marked.smartypants must be false to avoid broken quote conversion in mixed Chinese/English text.`);
  }
}

function checkSourceMarkdown(file, text, errors) {
  for (const match of text.matchAll(/(^|[\s>：:])”[^“”\n]{1,120}“/g)) {
    errors.push(`${path.relative(ROOT, file)}:${lineNumber(text, match.index)}: reversed Chinese quote pair near "${snippet(text, match.index)}"`);
  }
}

function checkGeneratedHtml(file, text, errors) {
  for (const match of text.matchAll(/&amp;(quot|ldquo|rdquo|lsquo|rsquo);/g)) {
    errors.push(`${path.relative(ROOT, file)}:${lineNumber(text, match.index)}: double-escaped quote entity "${match[0]}" near "${snippet(text, match.index)}"`);
  }
}

function main() {
  const errors = [];

  checkSmartypantsConfig(errors);

  for (const file of walk(SOURCE_DIR, file => file.endsWith('.md'))) {
    checkSourceMarkdown(file, fs.readFileSync(file, 'utf8'), errors);
  }

  for (const file of walk(PUBLIC_DIR, file => file.endsWith('.html'))) {
    checkGeneratedHtml(file, fs.readFileSync(file, 'utf8'), errors);
  }

  if (errors.length > 0) {
    console.error(`Quote check failed with ${errors.length} issue(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Quote check passed.');
}

main();
