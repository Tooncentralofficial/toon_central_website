# Git Commit Message Guide

Use this guide to write clear, consistent commit messages.

---

## Format


git commit -m "type: short summary

longer description explaining what and why

key change 1
key change 2
key change 3"

---

## Commit Types

Choose one:

- feat: new feature  
- fix: bug fix  
- refactor: code change without adding features or fixing bugs  
- chore: maintenance tasks  
- docs: documentation updates  
- test: adding or updating tests  

---

## Rules

- Keep the summary under 50 characters  
- Use lowercase for the type  
- Write in present tense  
  - Example: "add search feature"  
- Do not end the summary with a period  
- Leave one blank line after the summary  
- Use bullet points for details  
- Focus on what changed and why  

---

## Template

Copy and fill this:


git commit -m "type: short summary

clear explanation of what was done and why it matters

change 1
change 2
change 3"

---

## Example


git commit -m "feat: add concurrent file search

implement worker pool using goroutines and channels
improve performance for large directory scans

create buffered jobs channel
add searchWorker function
spawn multiple worker goroutines
refactor main to distribute jobs
handle file processing errors"

---

## Quick Checklist

Before committing, ask:

- Does the title clearly describe the change?  
- Can someone understand this without reading the code?  
- Did I explain why the change was made?  

---

## Optional Improvements

### Scope


feat(search): add concurrent file search


### Breaking Changes


feat: change API response format

BREAKING CHANGE: response structure updated


---

## Best Practices

- Keep commits small  
- One purpose per commit  
- Commit often  
- Write messages for humans, not just yourself  