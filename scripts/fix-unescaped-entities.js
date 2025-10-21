#!/usr/bin/env node

/**
 * Fix Unescaped Entities Script
 * Automatically fixes unescaped quotes and apostrophes in JSX
 */

const fs = require('fs');
const path = require('path');

// Files that need fixing based on the lint output
const filesToFix = [
  'src/components/pages/settings-layout/payouts/index.tsx',
  'src/components/pages/settings-layout/plans/index.tsx', 
  'src/components/pages/settings-layout/preferences/index.tsx',
  'src/components/pages/settings-layout/privacy-policy/index.tsx',
  'src/components/pages/settings-layout/terms/index.tsx',
  'src/components/pages/settings-layout/usage/index.tsx',
  'src/hooks/app-layout/home/use-assistant-message.tsx'
];

function fixUnescapedEntities(content) {
  // Fix single quotes
  content = content.replace(/(?<!&apos;)(?<!&lsquo;)(?<!&#39;)(?<!&rsquo;)'(?![^<]*>)/g, '&apos;');
  
  // Fix double quotes (but not in attributes or already escaped)
  content = content.replace(/(?<!&quot;)(?<!&ldquo;)(?<!&#34;)(?<!&rdquo;)"(?![^<]*>)/g, '&quot;');
  
  return content;
}

function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixUnescapedEntities(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed: ${filePath}`);
    } else {
      console.log(`No changes needed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// Process all files
console.log('Fixing unescaped entities...');
filesToFix.forEach(processFile);
console.log('Done!');
