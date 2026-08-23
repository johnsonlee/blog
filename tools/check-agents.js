#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const FILE = path.join(ROOT, 'AGENTS.md');

function lineNumber(text, index) {
  return text.slice(0, index).split(/\n/).length;
}

function main() {
  const text = fs.readFileSync(FILE, 'utf8');
  const errors = [];

  const requiredPatterns = [
    ['repo title', /^# AGENTS\.md$/m],
    ['commands section', /^## Commands$/m],
    ['layout section', /^## Layout$/m],
    ['writing workflow section', /^## Writing Workflow$/m],
    ['post format section', /^## Post Format$/m],
    ['repo-scoped write-blog skill', /\.agents\/skills\/write-blog\//],
    ['build command', /npm run build/],
    ['post directory', /source\/_posts\//],
    ['front matter alignment', /i18n_key/],
  ];

  for (const [label, pattern] of requiredPatterns) {
    if (!pattern.test(text)) {
      errors.push(`AGENTS.md: missing ${label}.`);
    }
  }

  const deprecatedReferences = [
    'CLAUDE.md',
    'CONVENTIONS.md',
  ];

  for (const reference of deprecatedReferences) {
    const pattern = new RegExp(reference.replace('.', '\\.'), 'g');
    const match = text.match(pattern);
    if (match) {
      errors.push(`AGENTS.md:${lineNumber(text, text.indexOf(reference))}: deprecated reference to ${reference}.`);
    }
  }

  if (text.length > 32768) {
    errors.push('AGENTS.md: keep repository guidance below the default project_doc_max_bytes limit.');
  }

  if (errors.length > 0) {
    console.error(`AGENTS check failed with ${errors.length} issue(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('AGENTS check passed.');
}

main();
