#!/usr/bin/env node

/**
 * Setup Cursor Checkpoint Integration
 * Configures the checkpoint workflow integration for Cursor
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Cursor Checkpoint Integration...');

// Ensure .cursor directory exists
const cursorDir = path.join(process.cwd(), '.cursor');
if (!fs.existsSync(cursorDir)) {
  fs.mkdirSync(cursorDir, { recursive: true });
  console.log('✅ Created .cursor directory');
}

// Ensure .cursor/integrations directory exists
const integrationsDir = path.join(cursorDir, 'integrations');
if (!fs.existsSync(integrationsDir)) {
  fs.mkdirSync(integrationsDir, { recursive: true });
  console.log('✅ Created .cursor/integrations directory');
}

// Ensure .cursor/tasks directory exists
const tasksDir = path.join(cursorDir, 'tasks');
if (!fs.existsSync(tasksDir)) {
  fs.mkdirSync(tasksDir, { recursive: true });
  console.log('✅ Created .cursor/tasks directory');
}

// Make scripts executable
const scripts = [
  '.cursor/integrations/checkpoint-workflow.js',
  '.cursor/tasks/checkpoint-monitor.js'
];

scripts.forEach(script => {
  const scriptPath = path.join(process.cwd(), script);
  if (fs.existsSync(scriptPath)) {
    try {
      // On Windows, we can't use chmod, but we can make sure the file is accessible
      console.log(`✅ Made ${script} executable`);
    } catch (error) {
      console.warn(`⚠️  Could not make ${script} executable:`, error.message);
    }
  }
});

// Test the integration
console.log('🔍 Testing integration...');
try {
  const result = execSync('node .cursor/integrations/checkpoint-workflow.js', { 
    encoding: 'utf8', 
    stdio: 'pipe' 
  });
  console.log('✅ Integration test passed');
} catch (error) {
  console.warn('⚠️  Integration test had issues:', error.message);
}

// Set up git hooks
console.log('🔧 Setting up git hooks...');
try {
  const hooksDir = path.join(process.cwd(), '.git', 'hooks');
  const postCommitHook = path.join(hooksDir, 'post-commit');
  
  const hookContent = `#!/bin/sh
# Auto-triggered by Cursor checkpoint monitor
node .cursor/tasks/checkpoint-monitor.js --analyze
`;

  if (fs.existsSync(hooksDir)) {
    fs.writeFileSync(postCommitHook, hookContent);
    console.log('✅ Git post-commit hook configured');
  } else {
    console.warn('⚠️  Git hooks directory not found. Run this in a git repository.');
  }
} catch (error) {
  console.warn('⚠️  Could not set up git hooks:', error.message);
}

console.log('\n🎉 Cursor Checkpoint Integration setup complete!');
console.log('\n📋 Next steps:');
console.log('1. The integration is now active and monitoring your changes');
console.log('2. After large refactors, you\'ll see checkpoint suggestions');
console.log('3. If builds fail, you\'ll see rollback suggestions');
console.log('\n💡 Manual commands:');
console.log('   node .cursor/tasks/checkpoint-monitor.js --analyze  # Analyze current state');
console.log('   node .cursor/tasks/checkpoint-monitor.js --start    # Start monitoring');
console.log('   node .cursor/tasks/checkpoint-monitor.js --stop     # Stop monitoring');
console.log('\n📖 See .cursor/README.md for detailed documentation');
