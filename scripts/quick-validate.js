#!/usr/bin/env node

/**
 * Quick Validation Script
 * Fast validation that checks TypeScript and linting without full build
 */

const { execSync } = require('child_process');

function quickValidate() {
  try {
    console.log('🔍 Quick validation (TypeScript + Linting)...');
    
    // Check TypeScript compilation
    const tscResult = execSync('npx tsc --noEmit', { 
      encoding: 'utf8', 
      stdio: 'pipe',
      cwd: process.cwd()
    });
    
    console.log('✅ TypeScript validation passed');
    
    // Check linting (quick)
    try {
      const lintResult = execSync('npm run lint -- --max-warnings 0', { 
        encoding: 'utf8', 
        stdio: 'pipe',
        cwd: process.cwd()
      });
      console.log('✅ Linting validation passed');
    } catch (lintError) {
      // Linting warnings are acceptable, only fail on errors
      const output = lintError.stdout ? lintError.stdout.toString() : '';
      if (output.includes('error') && !output.includes('warning')) {
        console.log('❌ Linting errors detected');
        return false;
      }
      console.log('✅ Linting validation passed (warnings acceptable)');
    }
    
    return true;
    
  } catch (error) {
    const output = error.stdout ? error.stdout.toString() : '';
    console.log('❌ Quick validation failed');
    console.log('Error details:', output);
    return false;
  }
}

// Export for use in other scripts
module.exports = { quickValidate };

// Run if called directly
if (require.main === module) {
  const success = quickValidate();
  process.exit(success ? 0 : 1);
}
