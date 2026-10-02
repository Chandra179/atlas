---
name: code-audit
description: Systematic read-only audit of existing code for bugs, race conditions, missing validation, architectural drift, performance problems, and dead code. Use when the user asks to audit, review, or check the health of a codebase, find problems or weak spots, or asks what is wrong with an implementation — even without naming a specific concern.
---

# Code Audit

Perform a systematic technical audit of the current implementation. This is a read-only review: report findings, do not fix anything unless explicitly asked.

Work through each area below. If an area does not apply to the code under review, say so rather than silently skipping it.

## Technical Health Audit

Evaluate:

- Bugs
- Incorrect behavior
- Unhandled edge cases
- Fragile implementation patterns
- Race conditions
- Error-handling problems
- Reliability issues
- Missing validation
- Inconsistent state
- Excessive complexity
- Duplicated logic
- Unnecessary abstractions
- Large functions or classes
- Tight coupling
- Poor separation of concerns
- Difficult-to-understand control flow
- Inconsistent implementation patterns
- Deprecated APIs
- Deprecated dependencies

## Architecture

Determine whether the current architecture remains appropriate for the intended product end state.

Review:

- Module boundaries
- Separation of concerns
- Dependency direction
- Data flow
- State ownership
- API boundaries
- Persistence strategy
- Error handling
- Concurrency model
- Background processing
- External service dependencies
- Deployment assumptions
- Observability
- Extensibility

Identify architectural decisions that:

- Block product completion
- Make future development unnecessarily difficult
- Create excessive coupling
- Cause repeated bugs
- Prevent scaling where scaling is actually required

Prefer incremental architectural improvements.

Do not recommend a major rewrite unless incremental improvement is insufficient and the benefit clearly justifies the cost.

## Performance and Efficiency

Identify meaningful performance problems involving:

- Algorithmic complexity
- Database queries
- Network requests
- Serialization
- Caching
- Memory usage
- CPU usage
- Disk I/O
- Startup time
- Build time
- Request latency
- Frontend rendering
- Repeated computation
- Unnecessary polling
- Excessive background processing

Optimize based on evidence when possible.

Avoid speculative micro-optimization that increases complexity without meaningful product benefit.

## Dead and Obsolete Code

Identify:

- Unused code
- Unreachable code
- Replaced implementations
- Code left behind after refactoring
- Unsupported legacy behavior
- Duplicate implementations
- Unused feature flags
- Obsolete configuration
- Unused dependencies
- Outdated compatibility layers

Removal is safe only when it can be done without behavior change. If removal is requested, also remove or update related:

- Tests
- Configuration
- Documentation
- Comments
- Dependencies
- Feature flags

## Output

For each finding, report:

- Location (file and line reference)
- Area (technical health / architecture / performance / dead code)
- What is wrong and why it matters
- A suggested fix, marked as a suggestion only

Do not treat an unconfirmed suspicion as a finding — verify against the code first.
