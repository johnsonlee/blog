'use strict';

const { execSync } = require('child_process');
const path = require('path');

hexo.extend.filter.register('after_generate', () => {
  const sourceDir = hexo.source_dir;
  const outputDir = path.join(hexo.public_dir, 'og-cards');
  const script = path.join(hexo.base_dir, 'scripts', 'generate-og-cards.py');

  hexo.log.info('Generating OG card images...');

  try {
    const result = execSync(`python3 "${script}" "${sourceDir}" "${outputDir}"`, {
      encoding: 'utf-8',
      timeout: 120000,
    });
    if (result.trim()) {
      hexo.log.info(result.trim());
    }
  } catch (err) {
    hexo.log.warn('OG card generation failed:', err.message);
  }
});
