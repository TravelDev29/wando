#!/usr/bin/env node

/**
 * Cursor Checkpoint Workflow Integration
 * Monitors for large refactors and suggests checkpointing
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  // File patterns that indicate large refactors
  LARGE_CHANGE_PATTERNS: [
    '**/components/**/*.tsx',
    '**/pages/**/*.tsx',
    '**/app/**/*.tsx',
    '**/lib/**/*.ts',
    '**/hooks/**/*.ts',
    '**/types/**/*.ts',
    '**/contexts/**/*.tsx',
  ],

  // Minimum number of files changed to trigger suggestion
  MIN_FILES_CHANGED: 3,

  // Minimum lines changed to trigger suggestion
  MIN_LINES_CHANGED: 50,

  // Types of changes that should trigger checkpoint suggestions
  TRIGGER_PATTERNS: [
    'refactor',
    'migration',
    'reorganization',
    'restructure',
    'restructure',
    'refactor',
    'migrate',
    'reorganize',
    'restructure',
    'move',
    'rename',
    'consolidate',
    'split',
    'merge',
    'extract',
    'inline',
  ],
};

/**
 * Analyze git changes to determine if this was a large refactor
 */
function analyzeChanges() {
  try {
    // Get list of changed files
    const changedFiles = execSync('git diff --name-only HEAD~1', {
      encoding: 'utf8',
      stdio: 'pipe',
    })
      .trim()
      .split('\n')
      .filter(f => f.length > 0);

    // Get diff stats
    const diffStats = execSync('git diff --stat HEAD~1', {
      encoding: 'utf8',
      stdio: 'pipe',
    });

    // Parse diff stats for line counts
    const linesChanged = parseDiffStats(diffStats);

    // Get commit message to check for trigger patterns
    const commitMessage = execSync('git log -1 --pretty=%B', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).toLowerCase();

    // Check if commit message contains trigger patterns
    const hasTriggerPattern = CONFIG.TRIGGER_PATTERNS.some(pattern =>
      commitMessage.includes(pattern)
    );

    // Count relevant files changed
    const relevantFiles = changedFiles.filter(file =>
      CONFIG.LARGE_CHANGE_PATTERNS.some(pattern =>
        file.match(pattern.replace(/\*\*/g, '.*'))
      )
    );

    return {
      filesChanged: changedFiles.length,
      relevantFilesChanged: relevantFiles.length,
      linesChanged,
      hasTriggerPattern,
      changedFiles: relevantFiles,
      shouldSuggestCheckpoint:
        relevantFiles.length >= CONFIG.MIN_FILES_CHANGED ||
        linesChanged >= CONFIG.MIN_LINES_CHANGED ||
        hasTriggerPattern,
    };
  } catch (error) {
    console.warn('Could not analyze changes:', error.message);
    return { shouldSuggestCheckpoint: false };
  }
}

/**
 * Parse git diff stats to get line counts
 */
function parseDiffStats(stats) {
  const lines = stats.split('\n');
  let totalChanged = 0;

  for (const line of lines) {
    const match = line.match(
      /(\d+) files? changed(?:, (\d+) insertions?\(\+\))?(?:, (\d+) deletions?\(-\))?/
    );
    if (match) {
      const insertions = parseInt(match[2] || '0');
      const deletions = parseInt(match[3] || '0');
      totalChanged += insertions + deletions;
    }
  }

  return totalChanged;
}

/**
 * Generate checkpoint suggestion based on changes
 */
function generateCheckpointSuggestion(analysis) {
  const {
    relevantFilesChanged,
    linesChanged,
    hasTriggerPattern,
    changedFiles,
  } = analysis;

  let summary = '';

  if (hasTriggerPattern) {
    summary = 'Large refactor/migration completed';
  } else if (relevantFilesChanged >= 5) {
    summary = `Multiple component changes (${relevantFilesChanged} files)`;
  } else if (linesChanged >= 100) {
    summary = `Significant code changes (${linesChanged} lines)`;
  } else {
    summary = `Code reorganization (${relevantFilesChanged} files, ${linesChanged} lines)`;
  }

  return {
    shouldSuggest: analysis.shouldSuggestCheckpoint,
    summary,
    details: {
      filesChanged: relevantFilesChanged,
      linesChanged,
      files: changedFiles.slice(0, 5), // Show first 5 files
    },
  };
}

/**
 * Run validation and suggest appropriate action
 */
function runValidationWorkflow() {
  try {
    console.log('🔍 Running checkpoint workflow validation...');

    // Analyze recent changes
    const analysis = analyzeChanges();

    if (!analysis.shouldSuggestCheckpoint) {
      console.log(
        'ℹ️  No significant changes detected. No checkpoint suggestion needed.'
      );
      return { action: 'none', reason: 'No significant changes' };
    }

    // Generate suggestion
    const suggestion = generateCheckpointSuggestion(analysis);

    console.log('📊 Change Analysis:');
    console.log(`   Files changed: ${analysis.relevantFilesChanged}`);
    console.log(`   Lines changed: ${analysis.linesChanged}`);
    console.log(
      `   Trigger pattern: ${analysis.hasTriggerPattern ? 'Yes' : 'No'}`
    );

    // Run validation
    console.log('🔍 Validating build...');
    const validationResult = runValidation();

    if (validationResult.success) {
      console.log('✅ Validation successful!');
      console.log('💡 Suggestion: Run checkpoint');
      console.log(
        `   Command: npm run checkpoint "Auto after ${suggestion.summary}"`
      );

      return {
        action: 'suggest_checkpoint',
        command: `npm run checkpoint "Auto after ${suggestion.summary}"`,
        summary: suggestion.summary,
        details: suggestion.details,
      };
    } else {
      console.log('❌ Validation failed!');
      console.log('💡 Suggestion: Run rollback');
      console.log('   Command: npm run rollback');

      return {
        action: 'suggest_rollback',
        command: 'npm run rollback',
        reason: 'Build validation failed',
      };
    }
  } catch (error) {
    console.error('❌ Workflow error:', error.message);
    return {
      action: 'error',
      error: error.message,
    };
  }
}

/**
 * Run quick validation (TypeScript + Linting only)
 */
function runValidation() {
  try {
    const result = execSync('node scripts/quick-validate.js', {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    });

    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.stdout ? error.stdout.toString() : '',
    };
  }
}

/**
 * Main workflow function
 */
function main() {
  const result = runValidationWorkflow();

  // Output structured result for Cursor to parse
  console.log('\n--- CURSOR_CHECKPOINT_RESULT ---');
  console.log(JSON.stringify(result, null, 2));
  console.log('--- END_CURSOR_CHECKPOINT_RESULT ---\n');

  return result;
}

// Export for use in other scripts
module.exports = {
  analyzeChanges,
  generateCheckpointSuggestion,
  runValidationWorkflow,
  runValidation,
};

// Run if called directly
if (require.main === module) {
  main();
}
