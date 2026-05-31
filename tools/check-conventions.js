#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const FILE = path.join(ROOT, 'CONVENTIONS.md');

function lineNumber(text, index) {
  return text.slice(0, index).split(/\n/).length;
}

function main() {
  const text = fs.readFileSync(FILE, 'utf8');
  const errors = [];

  for (const match of text.matchAll(/[\u3400-\u9fff]/g)) {
    errors.push(`CONVENTIONS.md:${lineNumber(text, match.index)}: CJK prose does not belong in this English conventions file.`);
  }

  const bannedHeadings = [
    'Project',
    'Commands?',
    'Repository Layout',
    'Setup',
    'Build',
    'Deploy',
    'Development',
    'Agent Workflow',
  ];

  for (const heading of bannedHeadings) {
    const pattern = new RegExp(`^##\\s+${heading}\\b`, 'im');
    const match = text.match(pattern);
    if (match) {
      errors.push(`CONVENTIONS.md:${lineNumber(text, match.index)}: README-style heading "${match[0]}" does not belong in CONVENTIONS.md.`);
    }
  }

  if (!text.includes('This file contains post-format and writing conventions only.')) {
    errors.push('CONVENTIONS.md: missing scope statement.');
  }

  if (errors.length > 0) {
    console.error(`Conventions check failed with ${errors.length} issue(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Conventions check passed.');
}

main();
