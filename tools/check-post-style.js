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
    for (const file of runGit(['diff', '--name-only', '--diff-filter=ACMRT', `${mergeBase}...HEAD`]).split('\n')) {
      if (file) files.add(file);
    }
  }

  for (const range of [['--cached'], []]) {
    for (const file of runGit(['diff', '--name-only', '--diff-filter=ACMRT', ...range]).split('\n')) {
      if (file) files.add(file);
    }
  }

  for (const file of runGit(['ls-files', '--others', '--exclude-standard', POSTS_DIR]).split('\n')) {
    if (file) files.add(file);
  }

  return [...files]
    .filter(file => file.startsWith(`${POSTS_DIR}/`) && file.endsWith('.md'))
    .filter(file => fs.existsSync(path.join(ROOT, file)));
}

function bodyWithoutFrontMatter(text) {
  return text.replace(/^---\n[\s\S]*?\n---\n?/, '');
}

function isStructuralParagraph(value) {
  const text = value.trim();
  return (
    text === '' ||
    text.startsWith('#') ||
    text.startsWith('- ') ||
    text.startsWith('* ') ||
    /^\d+\.\s/.test(text) ||
    text.startsWith('>') ||
    text.startsWith('|') ||
    text.startsWith('<!--') ||
    text.startsWith('```') ||
    text.startsWith('~~~')
  );
}

function sentenceCount(text) {
  const cjkTerminalMarks = text.match(/[。！？]/g);
  const latinTerminalMarks = text
    .replace(/[。！？]/g, '')
    .match(/[.!?]+(?=$|["'”’）)]?\s)/g);
  return (cjkTerminalMarks ? cjkTerminalMarks.length : 0) + (latinTerminalMarks ? latinTerminalMarks.length : 0);
}

function isShortStandaloneSentence(value) {
  const text = value.trim();
  if (isStructuralParagraph(text)) return false;
  if (text.includes('\n')) return false;
  if (text.length > 120) return false;
  if (sentenceCount(text) > 1) return false;
  if (/[:：]\s*$/.test(text)) return false;
  return /[.!?。！？]$/.test(text) || /[?？]$/.test(text);
}

function paragraphsWithLines(text) {
  const paragraphs = [];
  const lines = text.split('\n');
  let startLine = 1;
  let current = [];

  function flush(line) {
    if (current.length > 0) {
      paragraphs.push({ value: current.join('\n').trim(), line: startLine });
      current = [];
    }
    startLine = line + 1;
  }

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '') {
      flush(index + 1);
    } else {
      if (current.length === 0) {
        startLine = index + 1;
      }
      current.push(line);
    }
  }

  flush(lines.length + 1);
  return paragraphs;
}

function checkFragmentedParagraphs(file, text, errors) {
  const paragraphs = paragraphsWithLines(text);
  let run = [];

  function flush() {
    if (run.length >= 3) {
      const line = run[0].line;
      errors.push(`${file}:${line}: ${run.length} consecutive short one-sentence paragraphs. Merge explanatory prose, use a real list, or keep only deliberate punchlines/questions as standalone paragraphs.`);
    }
    run = [];
  }

  for (const paragraph of paragraphs) {
    if (isShortStandaloneSentence(paragraph.value)) {
      run.push(paragraph);
    } else {
      flush();
    }
  }
  flush();
}

function checkHeadingPunctuation(file, text, errors) {
  const headingPunctuation = /[!"#$%&'()*+,./:;<=>?@[\\\]^_`{|}~，。；：？！、（）【】《》“”‘’「」『』—–-]/;
  const lines = text.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^(#{2,6})\s+(.+?)\s*#*\s*$/);
    if (!match) continue;

    const heading = match[2].trim();
    if (headingPunctuation.test(heading)) {
      errors.push(`${file}:${index + 1}: Markdown headings must not contain punctuation marks. Rewrite the heading text instead.`);
    }
  }
}

function main() {
  const errors = [];
  const files = changedPostFiles();

  for (const file of files) {
    const absolute = path.join(ROOT, file);
    const text = bodyWithoutFrontMatter(fs.readFileSync(absolute, 'utf8'));
    checkHeadingPunctuation(file, text, errors);
    checkFragmentedParagraphs(file, text, errors);
  }

  if (errors.length > 0) {
    console.error(`Post style check failed with ${errors.length} issue(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log(`Post style check passed${files.length ? ` (${files.length} changed post file(s))` : ''}.`);
}

main();
