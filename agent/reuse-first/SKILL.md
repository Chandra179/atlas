---
name: reuse-first
description: Before implementing anything new, search the codebase for existing reusable functions, modules, components, and abstractions, and prefer the simplest proven approach over custom code. Use whenever about to write a new feature, utility, component, or script — even if the user did not ask about reuse.
---

# Reuse First

Before implementing new functionality, determine whether the problem is already solved elsewhere. New code is the last resort, not the first.

## Reuse Before Reimplementing

Search the existing codebase for reusable:

- Functions
- Modules
- Components
- Utilities
- APIs
- Services
- Abstractions
- Data structures
- Existing patterns

Prefer extending existing well-designed functionality rather than duplicating behavior.

Use this implementation preference order:

1. Existing project functionality
2. Standard library
3. Framework-native functionality
4. Mature and well-maintained dependency
5. Custom implementation

Avoid manually implementing functionality already solved reliably by existing tools.

Do not introduce a dependency when the standard library or existing project code provides a sufficiently simple solution.

## Simplify Unnecessary Complexity

Look for implementations that are more complicated than the underlying problem requires.

Examples:

- Overengineering
- Excessive abstraction
- Deep indirection
- Complicated state management
- Custom infrastructure replacing framework functionality
- Large multi-responsibility modules
- Excessive branching
- Repeated transformations
- Difficult control flow
- Bespoke algorithms
- Manual implementations of established patterns

Before maintaining a complex custom implementation, determine whether there is a proven:

- Algorithm
- Data structure
- Design pattern
- Framework convention
- Architectural pattern
- Protocol
- Library
- Industry-standard blueprint

Prefer the simpler proven approach when it improves:

- Correctness
- Clarity
- Reliability
- Maintainability
- Testability
- Performance

## Output

State what was found before writing new code:

- What existing code (if any) covers the problem, and how it will be reused or extended
- If nothing exists, which option in the preference order applies and why

If reuse or simplification would change behavior the user may depend on, surface it first instead of silently replacing the implementation.
