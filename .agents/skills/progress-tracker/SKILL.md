---
name: progress-tracker
description: A built-in skill used to track the broader technical context of the project, log progress, and record current application state. Make sure to use this skill whenever the user explicitly asks to "track progress", "save current state", "log update", or wants to document their accomplishments, current state of the project, next steps, or open issues.
---

# Progress Tracker

This skill records project progress securely and centrally by appending an entry to the `progressctx/changelog.md` log file. It tracks the current broader context of the workspace, such as the overall project state, newly completed work, pending issues, and immediate next steps.

## Instructions

Whenever the user indicates they want to capture the state of the project or log progress, follow these instructions exactly:

1. **Assess the Current Context**: Gather information from the running conversation to understand:
    * What was recently accomplished?
    * What is the current architectural/technical state of the application?
    * Are there any known blockers, bugs, or open issues?
    * What are the logical next steps?
    (If you are unsure of any of these, ask the user or piece it out from the files modified recently).

2. **Format the Log Entry**: Draft a Markdown block using the structure defined below. Always include the current date and time (which you can figure out from system context).

3. **Append to the Log File**: Write the structured block to the end of the `progressctx/changelog.md` file located at the root of the workspace. If the folder `progressctx` or the file `changelog.md` does not exist, you must create them. 

### Output Format

Always use this exact template for the appended changelog block:

```markdown
## [YYYY-MM-DD HH:MM] - [Brief Summary of Update]

### 🏗️ Current State
[Brief summary of the current state of the codebase, project architecture, or recently worked-on feature]

### ✅ Accomplishments
- [Completed item 1]
- [Completed item 2]

### 🚧 Open Issues & Blockers
- [Issue or blocker 1 - write "None" if there are no evident blockers]

### ⏭️ Next Steps
- [Next step 1]
- [Next step 2]

---
```

## Tips for Success
- Be concise but specific. Avoid generic filler. Incorporate file names, specific tech stacks, and concrete error states when documenting issues.
- It's important to keep track of the broader technical context rather than just copying a git commit message.
- You can read the file to establish what the last update was if you want to avoid redundancy.
