# Coding Standards

This document outlines the coding standards and best practices for this project.

---

## Table of Contents

- [TypeScript Standards](#typescript-standards)
  - [Constants and Labels Separation](#constants-and-labels-separation)
  - [Type Safety](#type-safety)
- [React Standards](#react-standards)
- [Naming Conventions](#naming-conventions)
- [File Organization](#file-organization)

---

## TypeScript Standards

### Constants and Labels Separation

**Rule**: Always separate code-based constants from display labels. Never use display text as code identifiers.

**❌ Bad Practice:**
```typescript
// Using display text as code identifiers
export type TabType = 'Patient Basic Info' | 'Insurance' | 'Appointments';

// Component code
{activeTab === "Patient Basic Info" && <Content />}
```

**✅ Good Practice:**
```typescript
// Define constants with code-based identifiers
export const TAB_TYPES = {
  PATIENT_BASIC_INFO: 'PATIENT_BASIC_INFO',
  INSURANCE: 'INSURANCE',
  APPOINTMENTS: 'APPOINTMENTS',
} as const;

// Create type from constants
export type TabType = typeof TAB_TYPES[keyof typeof TAB_TYPES];

// Separate display labels
export const TAB_LABELS: Record<TabType, string> = {
  [TAB_TYPES.PATIENT_BASIC_INFO]: 'Patient Basic Info',
  [TAB_TYPES.INSURANCE]: 'Insurance',
  [TAB_TYPES.APPOINTMENTS]: 'Appointments',
};

// Component code
{activeTab === TAB_TYPES.PATIENT_BASIC_INFO && <Content />}

// Display in UI
<button>{TAB_LABELS[tab]}</button>
```

**Benefits:**
- **Type Safety**: Constants prevent typos and provide IDE autocomplete
- **Maintainability**: Update display text in one place without touching logic
- **Refactoring**: Easy to rename constants across the codebase
- **Localization Ready**: Labels can be easily replaced with i18n keys
- **Better IDE Support**: Jump to definition, find all references work correctly

**Example Implementation:**
See `src/types/patient.ts` for the tab constants implementation:
- Main tabs: `TAB_TYPES` and `TAB_LABELS`
- Sub-tabs: `INSURANCE_SUB_TAB_TYPES` and `INSURANCE_SUB_TAB_LABELS`

---

### Type Safety

**Rule**: Always prefer type-safe approaches over string literals or magic values.

**✅ Good Practice:**
```typescript
// Use enums or const objects with 'as const'
export const STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type Status = typeof STATUS[keyof typeof STATUS];
```

**❌ Bad Practice:**
```typescript
// Avoid loose string types
type Status = string;

// Avoid magic strings in code
if (status === 'pending') { ... }
```

---

## React Standards

### Component Organization

**Rule**: Organize components with a consistent structure:

```typescript
// 1. Imports
import React, { useState } from 'react';
import { ComponentProps } from '../types';

// 2. Type definitions
interface MyComponentProps {
  data: string;
  onAction: () => void;
}

// 3. Helper components (if small and local)
const HelperComponent: React.FC = () => { ... };

// 4. Main component
const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
  // 4a. Hooks
  const [state, setState] = useState('');

  // 4b. Helper functions
  const handleClick = () => { ... };

  // 4c. Render
  return ( ... );
};

// 5. Export
export default MyComponent;
```

---

## Naming Conventions

### Constants

**Rule**: Use SCREAMING_SNAKE_CASE for constants and constant objects.

```typescript
// ✅ Good
export const TAB_TYPES = { ... };
export const API_ENDPOINTS = { ... };
export const MAX_RETRY_COUNT = 3;

// ❌ Bad
export const tabTypes = { ... };
export const apiEndpoints = { ... };
```

### Types and Interfaces

**Rule**: Use PascalCase for types and interfaces. Add meaningful suffixes.

```typescript
// ✅ Good
export type TabType = ...;
export interface PatientDetailProps { ... }
export type InsuranceSubTabType = ...;

// ❌ Bad
export type tab = ...;
export interface patientDetailProps { ... }
```

### Functions and Variables

**Rule**: Use camelCase for functions and variables.

```typescript
// ✅ Good
const handleSubmit = () => { ... };
const isValidEmail = (email: string) => { ... };
const userProfile = { ... };

// ❌ Bad
const HandleSubmit = () => { ... };
const IsValidEmail = (email: string) => { ... };
```

---

## File Organization

### Directory Structure

```
src/
├── components/       # React components
├── types/           # TypeScript type definitions
├── data/            # Static data and mock data
├── services/        # API services and external integrations
├── styles/          # Shared styles and style utilities
└── utils/           # Utility functions
```

### Type Definitions

**Rule**: Place all shared types in `src/types/` directory. Use descriptive filenames.

```
types/
├── patient.ts       # Patient-related types and constants
├── insurance.ts     # Insurance-related types
└── common.ts        # Common/shared types
```

---

## Best Practices

### 1. DRY (Don't Repeat Yourself)

Extract common patterns into reusable constants and utilities.

### 2. Single Source of Truth

Define values in one place and reference them everywhere else.

### 3. Meaningful Names

Use descriptive names that clearly communicate intent:
- ✅ `TAB_TYPES.PATIENT_BASIC_INFO`
- ❌ `TABS.PBI` or `T1`

### 4. Comments

Add comments for complex logic, but prefer self-documenting code:
```typescript
// ✅ Good - code is self-explanatory
const isEligibleForDiscount = age >= 65 || hasStudentId;

// ❌ Bad - needs comment to explain
const eligible = a >= 65 || s; // Check if eligible for discount
```

---

## Changelog

- **2025-11-14**: Initial coding standards document created
  - Added Constants and Labels Separation rule
  - Added TypeScript and React standards
  - Added naming conventions
