#!/usr/bin/env node

/**
 * Auto Rollback Script
 * Validates build and rolls back to most recent checkpoint if build fails
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configure Git to be quiet
const GIT_OPTIONS = { 
  encoding: 'utf8',
  stdio: 'pipe'
};

// Get the most recent auto checkpoint tag
function getLatestCheckpoint() {
  try {
    const tags = execSync('git tag -l "*auto" --sort=-version:refname', GIT_OPTIONS);
    const autoTags = tags.trim().split('\n').filter(tag => tag.includes('-auto'));
    
    if (autoTags.length === 0) {
      throw new Error('No auto checkpoints found');
    }
    
    return autoTags[0]; // Most recent tag
  } catch (error) {
    throw new Error(`Failed to find auto checkpoints: ${error.message}`);
  }
}

// Validate build
function validateBuild() {
  try {
    console.log('🔍 Validating build...');
    execSync('npm run build', { 
      encoding: 'utf8', 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    console.log('✅ Build validation successful');
    return true;
  } catch (error) {
    console.log('❌ Build validation failed');
    return false;
  }
}

// Rollback to checkpoint
function rollbackToCheckpoint(tagName) {
  try {
    console.log(`⏪ Rolling back to ${tagName}...`);
    
    // Reset to the checkpoint
    execSync(`git checkout ${tagName}`, { 
      encoding: 'utf8', 
      stdio: 'inherit' 
    });
    
    console.log(`✅ Successfully rolled back to ${tagName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to rollback to ${tagName}:`, error.message);
    return false;
  }
}

// Log rollback to changelog
function logRollback(tagName, reason) {
  try {
    const changelogPath = path.join(__dirname, '..', 'docs', 'CHANGELOG_CHECKPOINTS.md');
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const rollbackEntry = `## ROLLBACK (${timestamp})
- **Rolled back to**: ${tagName}
- **Reason**: ${reason}
- **Current state**: \`git checkout ${tagName}\`

`;
    
    // Insert rollback entry at the top of checkpoints section
    const insertPoint = changelog.indexOf('## Checkpoints');
    if (insertPoint !== -1) {
      const nextLineIndex = changelog.indexOf('\n', insertPoint);
      changelog = changelog.slice(0, nextLineIndex + 1) + rollbackEntry + changelog.slice(nextLineIndex + 1);
    }
    
    fs.writeFileSync(changelogPath, changelog);
    console.log('📝 Rollback logged to changelog');
  } catch (error) {
    console.warn('⚠️  Failed to log rollback to changelog:', error.message);
  }
}

// Main rollback function
function performRollback(reason = 'Build validation failed') {
  try {
    console.log('🚀 Starting auto rollback process...');
    
    // Get latest checkpoint
    const latestTag = getLatestCheckpoint();
    console.log(`📍 Latest checkpoint: ${latestTag}`);
    
    // Perform rollback
    const rollbackSuccess = rollbackToCheckpoint(latestTag);
    
    if (rollbackSuccess) {
      // Log the rollback
      logRollback(latestTag, reason);
      
      console.log('✅ Auto rollback completed successfully');
      console.log(`📍 Current state: ${latestTag}`);
      console.log('💡 You can now fix issues and create a new checkpoint');
      
      return { success: true, tagName: latestTag };
    } else {
      console.error('❌ Auto rollback failed');
      return { success: false, error: 'Rollback operation failed' };
    }
    
  } catch (error) {
    console.error('❌ Auto rollback error:', error.message);
    return { success: false, error: error.message };
  }
}

// Validate and rollback if needed
function validateAndRollback() {
  try {
    console.log('🔍 Validating current state...');
    
    // First, validate the build
    const buildValid = validateBuild();
    
    if (buildValid) {
      console.log('✅ Current state is valid. No rollback needed.');
      return { success: true, rollback: false };
    } else {
      console.log('❌ Build failed. Initiating automatic rollback...');
      return performRollback('Build validation failed');
    }
    
  } catch (error) {
    console.error('❌ Validation error:', error.message);
    return performRollback(`Validation error: ${error.message}`);
  }
}

// Export functions
module.exports = { 
  validateAndRollback, 
  performRollback, 
  getLatestCheckpoint,
  validateBuild 
};

// If run directly
if (require.main === module) {
  const reason = process.argv[2] || 'Manual rollback';
  
  if (process.argv.includes('--validate')) {
    validateAndRollback();
  } else {
    performRollback(reason);
  }
}
