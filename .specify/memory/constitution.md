<!--
Sync Impact Report:
Version: 0.1.0 (initial)
Created: 2025-01-27
Last Amended: 2025-01-27
Principles: 6 core principles established
- Modern UI/UX Design
- Lightweight Technology Stack
- Code Quality & Formatting
- Component Architecture
- Code Reusability
- Testing Policy (explicitly excluded)
Templates Updated:
✅ .specify/templates/plan-template.md - Added constitution check gates
✅ .specify/templates/spec-template.md - Added constitution alignment notes
✅ .specify/templates/tasks-template.md - Clarified testing exclusion policy
Configuration Files:
✅ .prettierrc - Created Prettier configuration
✅ package.json - Added Prettier dependency and format scripts
-->

# Project Constitution

**Project:** VocabMaster AI  
**Version:** 0.1.0  
**Ratified:** 2025-01-27  
**Last Amended:** 2025-01-27

## Purpose

This constitution establishes the non-negotiable principles and governance rules for the VocabMaster AI project. All development decisions, code contributions, and architectural choices MUST align with these principles.

## Principles

### 1. Modern UI/UX Design

**MUST** maintain a beautiful, modern user interface that follows existing UI trends and design patterns established in the project. The application MUST use consistent design language, color schemes (indigo/slate palette), spacing, typography, and interaction patterns. All new components and features MUST seamlessly integrate with the existing visual design system.

**Rationale:** Consistent, modern UI enhances user experience, maintains brand identity, and ensures the application feels cohesive and professional.

### 2. Lightweight Technology Stack

**MUST** use lightweight, modern libraries and frameworks. Dependencies MUST be evaluated for bundle size impact and performance characteristics. Prefer smaller, focused libraries over large, monolithic solutions. Existing stack (React, TypeScript, Vite, Tailwind CSS, lucide-react) represents the preferred technology choices.

**Rationale:** Lightweight dependencies reduce bundle size, improve load times, and maintain better performance, especially for web applications.

### 3. Code Quality & Formatting

**MUST** follow established code conventions and maintain consistent formatting across the codebase. **MUST** use Prettier for automatic code formatting. All code MUST be formatted before commit. Code conventions include: TypeScript strict mode, meaningful variable/function names, proper type annotations, and consistent file organization.

**Rationale:** Consistent code formatting and conventions improve readability, reduce cognitive load, and facilitate collaboration and maintenance.

### 4. Component Architecture

**MUST** organize code into small, focused, reusable components. Components MUST be divided into the smallest logical units possible to maximize reusability. Each component SHOULD have a single responsibility. Components MUST be placed in appropriate directories (e.g., `components/` for UI components, `services/` for business logic).

**Rationale:** Small, focused components are easier to understand, test, maintain, and reuse across the application, reducing code duplication and improving development velocity.

### 5. Code Reusability

**MUST** prioritize code reusability in all design decisions. Shared logic, utilities, and UI patterns MUST be extracted into reusable modules, hooks, or components. Duplication MUST be avoided. When similar patterns emerge, refactor to create shared abstractions.

**Rationale:** Reusable code reduces maintenance burden, ensures consistency, and accelerates feature development by leveraging existing, tested components and utilities.

### 6. Testing Policy

**MUST NOT** include application testing infrastructure, test files, or testing frameworks. Testing is explicitly excluded from project requirements. Focus development effort on feature implementation and user experience.

**Rationale:** Testing infrastructure is not required for this project, allowing full focus on feature development and UI/UX refinement.

## Governance

### Amendment Procedure

1. Propose amendments by modifying this constitution file
2. Update version number according to semantic versioning
3. Update `LAST_AMENDED_DATE` to current date
4. Document changes in the Sync Impact Report (HTML comment at top)
5. Propagate changes to dependent templates and documentation

### Versioning Policy

Version numbers follow semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR:** Backward incompatible changes to principles or governance
- **MINOR:** New principles added or existing principles materially expanded
- **PATCH:** Clarifications, wording improvements, typo fixes, non-semantic refinements

### Compliance Review

All code contributions and architectural decisions MUST be reviewed against this constitution. Non-compliance MUST be addressed before merging. The constitution serves as the authoritative source for project standards and practices.
