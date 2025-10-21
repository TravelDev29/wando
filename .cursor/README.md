# Cursor Checkpoint Workflow Integration

This integration automatically monitors your Wando project for large refactors, migrations, and folder reorganizations, then suggests appropriate checkpoint actions.

## How It Works

### 1. **Change Detection**

The system monitors for:

- **File Changes**: Tracks modifications to key directories (`components/`, `app/`, `lib/`, `hooks/`, etc.)
- **Line Count**: Detects significant code changes (50+ lines by default)
- **Keywords**: Identifies refactor-related commit messages
- **Pattern Matching**: Recognizes common refactor patterns

### 2. **Automatic Analysis**

After detecting changes, the system:

- Analyzes the scope and impact of changes
- Runs build validation (`npm run validate`)
- Determines if checkpointing is appropriate
- Generates contextual suggestions

### 3. **Smart Suggestions**

Based on analysis results:

#### ✅ **Checkpoint Suggestion** (when validation passes)

```
🎯 CHECKPOINT SUGGESTION
═══════════════════════════════════════
📊 Summary: Large refactor/migration completed
📁 Files changed: 8
📝 Lines changed: 156
📂 Key files: components/Header.tsx, lib/utils.ts, hooks/useAuth.ts

💡 Suggested command:
   npm run checkpoint "Auto after Large refactor/migration completed"
```

#### ⚠️ **Rollback Suggestion** (when validation fails)

```
⚠️  ROLLBACK SUGGESTION
═══════════════════════════════════════
❌ Reason: Build validation failed

💡 Suggested command:
   npm run rollback
```

## Configuration

### Trigger Conditions

The system suggests checkpoints when:

- **3+ relevant files** are changed
- **50+ lines** of code are modified
- **Refactor keywords** are detected in commit messages:
  - `refactor`, `migration`, `reorganization`
  - `restructure`, `migrate`, `reorganize`
  - `move`, `rename`, `consolidate`
  - `split`, `merge`, `extract`, `inline`

### Monitored File Patterns

```
**/components/**/*.tsx    # React components
**/pages/**/*.tsx        # Next.js pages
**/app/**/*.tsx          # App router pages
**/lib/**/*.ts           # Utility libraries
**/hooks/**/*.ts         # Custom hooks
**/types/**/*.ts         # TypeScript types
**/contexts/**/*.tsx     # React contexts
```

## Usage

### Manual Analysis

```bash
# Analyze current state
node .cursor/tasks/checkpoint-monitor.js --analyze

# Start background monitoring
node .cursor/tasks/checkpoint-monitor.js --start

# Stop background monitoring
node .cursor/tasks/checkpoint-monitor.js --stop
```

### Git Hook Integration

The system automatically sets up a `post-commit` git hook that triggers analysis after each commit.

### Background Monitoring

The monitor runs in the background and:

- Checks for changes every 30 seconds
- Analyzes recent commits for refactor patterns
- Suggests actions when appropriate

## Integration Points

### 1. **Cursor IDE Integration**

- Monitors file changes in real-time
- Integrates with Cursor's file watching system
- Provides contextual suggestions in the IDE

### 2. **Git Workflow Integration**

- Automatically triggers on commits
- Analyzes commit messages for refactor keywords
- Suggests checkpointing after successful changes

### 3. **Build System Integration**

- Runs `npm run validate` to check build health
- Suggests rollback if validation fails
- Ensures checkpoints are only created for stable states

## Workflow Examples

### Example 1: Component Refactor

```bash
# You refactor multiple components
git add .
git commit -m "refactor: consolidate header components"

# System detects:
# - 4 component files changed
# - 89 lines modified
# - "refactor" keyword detected
# - Build validation passes

# Suggestion:
npm run checkpoint "Auto after Component consolidation refactor"
```

### Example 2: Failed Migration

```bash
# You attempt a large migration
git add .
git commit -m "migrate: update to new API structure"

# System detects:
# - 12 files changed
# - 234 lines modified
# - "migrate" keyword detected
# - Build validation fails

# Suggestion:
npm run rollback
```

## Customization

### Adjusting Sensitivity

Edit `.cursor/config.json`:

```json
{
  "integrations": {
    "checkpoint-workflow": {
      "config": {
        "minFilesChanged": 5, // Increase threshold
        "minLinesChanged": 100, // Increase threshold
        "triggerPatterns": [
          // Add custom keywords
          "refactor",
          "migration",
          "your-custom-keyword"
        ]
      }
    }
  }
}
```

### Adding File Patterns

```json
{
  "filePatterns": [
    "**/components/**/*.tsx",
    "**/your-custom-dir/**/*.ts" // Add custom patterns
  ]
}
```

## Benefits

1. **Prevents Lost Work**: Automatic suggestions ensure important changes are checkpointed
2. **Maintains Stability**: Only suggests checkpoints for validated builds
3. **Contextual Awareness**: Understands the nature of changes (refactor vs. bug fix)
4. **Non-Intrusive**: Only suggests, never automatically executes
5. **Educational**: Helps developers understand when checkpointing is appropriate

## Troubleshooting

### Monitor Not Running

```bash
# Check if monitor is active
node .cursor/tasks/checkpoint-monitor.js --analyze

# Restart monitor
node .cursor/tasks/checkpoint-monitor.js --start
```

### Git Hooks Not Working

```bash
# Manually set up hooks
chmod +x .git/hooks/post-commit
```

### False Positives

Adjust sensitivity in `.cursor/config.json` to reduce false suggestions.

## Security Notes

- **No Automatic Execution**: All suggestions require manual confirmation
- **Read-Only Analysis**: System only analyzes, never modifies code
- **Transparent Process**: All analysis steps are logged and visible
- **Reversible**: All suggestions can be ignored or overridden
