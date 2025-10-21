#!/usr/bin/env node

/**
 * Cursor Background Task: Checkpoint Monitor
 * Monitors for large changes and suggests checkpointing
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Import the checkpoint workflow
const checkpointWorkflow = require('../integrations/checkpoint-workflow');

class CheckpointMonitor {
  constructor() {
    this.isRunning = false;
    this.lastCheckTime = null;
    this.debounceTimeout = null;
  }

  /**
   * Start monitoring for changes
   */
  start() {
    if (this.isRunning) {
      console.log('Checkpoint monitor is already running');
      return;
    }

    console.log('🚀 Starting checkpoint monitor...');
    this.isRunning = true;
    
    // Monitor git changes
    this.monitorGitChanges();
    
    // Monitor file system changes
    this.monitorFileChanges();
  }

  /**
   * Stop monitoring
   */
  stop() {
    this.isRunning = false;
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }
    console.log('⏹️  Checkpoint monitor stopped');
  }

  /**
   * Monitor git changes using git hooks
   */
  monitorGitChanges() {
    // Set up post-commit hook to trigger analysis
    this.setupGitHooks();
  }

  /**
   * Monitor file system changes
   */
  monitorFileChanges() {
    // This would integrate with Cursor's file watching system
    // For now, we'll use a polling approach
    setInterval(() => {
      if (this.isRunning) {
        this.checkForSignificantChanges();
      }
    }, 30000); // Check every 30 seconds
  }

  /**
   * Set up git hooks for automatic triggering
   */
  setupGitHooks() {
    const hooksDir = path.join(process.cwd(), '.git', 'hooks');
    const postCommitHook = path.join(hooksDir, 'post-commit');
    
    const hookContent = `#!/bin/sh
# Auto-triggered by Cursor checkpoint monitor
node .cursor/tasks/checkpoint-monitor.js --analyze
`;

    try {
      if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir, { recursive: true });
      }
      
      fs.writeFileSync(postCommitHook, hookContent);
      fs.chmodSync(postCommitHook, '755');
      
      console.log('✅ Git hooks configured');
    } catch (error) {
      console.warn('⚠️  Could not set up git hooks:', error.message);
    }
  }

  /**
   * Check for significant changes and suggest actions
   */
  async checkForSignificantChanges() {
    try {
      const result = checkpointWorkflow.runValidationWorkflow();
      
      if (result.action === 'suggest_checkpoint') {
        this.suggestCheckpoint(result);
      } else if (result.action === 'suggest_rollback') {
        this.suggestRollback(result);
      }
      
    } catch (error) {
      console.error('Error in checkpoint monitor:', error.message);
    }
  }

  /**
   * Suggest checkpoint creation
   */
  suggestCheckpoint(result) {
    console.log('\n🎯 CHECKPOINT SUGGESTION');
    console.log('═══════════════════════════════════════');
    console.log(`📊 Summary: ${result.summary}`);
    console.log(`📁 Files changed: ${result.details.filesChanged}`);
    console.log(`📝 Lines changed: ${result.details.linesChanged}`);
    console.log(`📂 Key files: ${result.details.files.join(', ')}`);
    console.log('');
    console.log('💡 Suggested command:');
    console.log(`   ${result.command}`);
    console.log('');
    console.log('🔍 This suggestion is based on:');
    console.log('   • Multiple component files changed');
    console.log('   • Significant line count changes');
    console.log('   • Refactor/migration keywords detected');
    console.log('═══════════════════════════════════════\n');
  }

  /**
   * Suggest rollback
   */
  suggestRollback(result) {
    console.log('\n⚠️  ROLLBACK SUGGESTION');
    console.log('═══════════════════════════════════════');
    console.log(`❌ Reason: ${result.reason}`);
    console.log('');
    console.log('💡 Suggested command:');
    console.log(`   ${result.command}`);
    console.log('');
    console.log('🔍 This suggestion is based on:');
    console.log('   • Build validation failed');
    console.log('   • Compilation errors detected');
    console.log('   • Project may be in unstable state');
    console.log('═══════════════════════════════════════\n');
  }

  /**
   * Analyze current state (called by git hooks)
   */
  async analyzeCurrentState() {
    console.log('🔍 Analyzing current state for checkpoint suggestion...');
    
    try {
      const result = checkpointWorkflow.runValidationWorkflow();
      
      if (result.action === 'suggest_checkpoint') {
        this.suggestCheckpoint(result);
      } else if (result.action === 'suggest_rollback') {
        this.suggestRollback(result);
      } else {
        console.log('ℹ️  No checkpoint suggestion needed at this time');
      }
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
    }
  }
}

// Create monitor instance
const monitor = new CheckpointMonitor();

// Handle command line arguments
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--start')) {
    monitor.start();
  } else if (args.includes('--stop')) {
    monitor.stop();
  } else if (args.includes('--analyze')) {
    monitor.analyzeCurrentState();
  } else {
    console.log('Cursor Checkpoint Monitor');
    console.log('Usage:');
    console.log('  --start    Start monitoring');
    console.log('  --stop     Stop monitoring');
    console.log('  --analyze  Analyze current state');
  }
}

module.exports = CheckpointMonitor;
