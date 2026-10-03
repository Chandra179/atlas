---
name: reuse-first
description: Before adding a feature, utility, component, or script, search for reusable project code and proven platform capabilities; prefer the simplest approach that fits. Use when beginning implementation work that might duplicate existing behavior or add a dependency.
---

# Reuse First

Before implementing new functionality, check whether the codebase or platform already solves the problem. Extend proven project behavior when that is simpler and safe.

## Search and choose

Look for existing functions, modules, components, utilities, APIs, services, abstractions, data structures, and established project patterns. Then use this order of preference:

1. Existing project functionality.
2. Standard library.
3. Framework-native functionality.
4. A mature, maintained dependency.
5. A custom implementation.

Do not add a dependency when existing code or the standard library provides a sufficiently simple, reliable solution. Avoid custom implementations of established algorithms, protocols, or framework patterns without a concrete reason.

## Simplify

Check whether complexity exceeds the problem: excessive abstraction or indirection, tangled responsibilities, repeated transformations, complex state or control flow, bespoke infrastructure, or unnecessary branching. Prefer a simpler proven design when it improves correctness, clarity, reliability, maintainability, testability, or performance. Do not simplify for its own sake when it would weaken a requirement.

## Report before implementation

State what existing code or platform capability covers the problem and how it will be reused. If nothing applies, identify the simplest option from the preference order and why it fits. If reuse or simplification may change behavior users depend on, surface that impact before replacing it.
