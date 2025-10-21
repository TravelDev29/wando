#!/usr/bin/env node

/**
 * Auto Checkpoint Script
 * Creates Git commits and tags for successful major changes
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the next version number
function getNextVersion() {
  try {
    const tags = execSync('git tag -l "*auto"', { encoding: 'utf8' });
    const autoTags = tags.trim().split('\n').filter(tag => tag.includes('-auto'));
    
    if (autoTags.length === 0) return 1;
    
    const versions = autoTags.map(tag => {
      const match = tag.match(/v0\.(\d+)-auto/);
      return match ? parseInt(match[1]) : 0;
    });
    
    return Math.max(...versions) + 1;
  } catch (error) {
    return 1;
  }
}

// Get current timestamp in local timezone
function getLocalTimestamp() {
  return new Date().toLocaleString('en-US', {
    timeZone: 'America/New_York', // Adjust to your timezone
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

// Get commit hash
function getCommitHash() {
  try {
    return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch (error) {
    return 'unknown';
  }
}

// Main checkpoint function
function createCheckpoint(description) {
  try {
    const version = getNextVersion();
    const tagName = `v0.${version}-auto`;
    const timestamp = getLocalTimestamp();
    
    console.log(`🔄 Creating auto checkpoint: ${tagName}`);
    
    // Add all changes
    execSync('git add .', { stdio: 'inherit' });
    
    // Create commit
    const commitMessage = `Auto-checkpoint: ${description}`;
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    
    // Create tag
    execSync(`git tag -a ${tagName} -m "Auto checkpoint after ${description}"`, { stdio: 'inherit' });
    
    // Push changes
    execSync('git push', { stdio: 'inherit' });
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' });
    
    // Get commit hash
    const commitHash = getCommitHash();
    
    // Update changelog
    const changelogPath = path.join(__dirname, '..', 'docs', 'CHANGELOG_CHECKPOINTS.md');
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    
    const newEntry = `## v0.${version}-auto (${timestamp})
- **Description**: ${description}
- **Commit Hash**: ${commitHash}
- **Rollback**: \`git checkout ${tagName}\`

`;
    
    // Insert new entry after the header
    const insertPoint = changelog.indexOf('*No checkpoints yet - system ready for first checkpoint*');
    if (insertPoint !== -1) {
      changelog = changelog.replace('*No checkpoints yet - system ready for first checkpoint*', newEntry.trim());
    } else {
      // Find the last checkpoint and add after it
      const lastCheckpointIndex = changelog.lastIndexOf('## v0.');
      if (lastCheckpointIndex !== -1) {
        const nextLineIndex = changelog.indexOf('\n', lastCheckpointIndex);
        changelog = changelog.slice(0, nextLineIndex + 1) + newEntry + changelog.slice(nextLineIndex + 1);
      }
    }
    
    fs.writeFileSync(changelogPath, changelog);
    
    console.log(`✅ Auto checkpoint created successfully.`);
    console.log(`📝 Tag: ${tagName}`);
    console.log(`🔗 Commit: ${commitHash}`);
    console.log(`⏪ Roll back anytime with: git checkout ${tagName}`);
    
    return { success: true, tagName, commitHash };
    
  } catch (error) {
    console.error('❌ Error creating auto checkpoint:', error.message);
    console.error('📧 Notifying GPT-5 and user about checkpoint failure');
    return { success: false, error: error.message };
  }
}

// Export for use in other scripts
module.exports = { createCheckpoint };

// If run directly
if (require.main === module) {
  const description = process.argv[2] || 'Major changes completed';
  createCheckpoint(description);
}
