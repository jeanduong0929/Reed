# Guidelines

- Use `bun`, `bunx` instead of `npm`, `npx`.
- Git commits must use scoped [Conventional Commits](https://www.conventionalcommits.org/) format: `type(scope): message`.
  - **Types:** `feature`, `fix`, `refactor`, `chore`, `docs`, `style`, `test`, `perf`, `ci`, `build`
  - **Scope:** a short identifier for the affected area (e.g., `auth`, `tab-bar`, `voice-capture`, `schema`, `deps`)
  - **Examples:**
    - `feature(voice-capture): add recording modal and transcription flow`
    - `fix(tab-bar): center FAB so it doesn't clip real tabs`
    - `chore(deps): add expo-audio and openai dependencies`
    - `refactor(tab-bar): convert record button to floating action button`
  - Develop features on branches and squash-merge into `main` so each feature lands as one clean commit.
- Must add JSDoc comments.
- Organize code sections with comment divider headers.
  - Main section headers (components, hooks, utilities, etc.):

```typescript
/* =================================
 *          EXAMPLE HEADER
 * =================================
 */
```

- Sub-headers for organizing code within sections:

```typescript
// =================================
//           TYPES
// =================================

// =================================
//          VARIABLES
// =================================

// =================================
//          CONSTANTS
// =================================

// =================================
//          STATES
// =================================

// =================================
//          HOOKS
// =================================

// =================================
//        FUNCTIONS
// =================================

// =================================
//         EFFECTS
// =================================

// =================================
//        RENDERING
// =================================
```

- Verify code changes with `bun run lint` and fix any issues before committing.
- Use NativeWind for styling and avoid using React Native's built-in `StyleSheet` API.

## Recommended Folder Tree

```txt
my-app/
├─ src/
│  ├─ app/
│  │  ├─ _layout.tsx
│  │  ├─ +not-found.tsx
│  │  ├─ (tabs)/
│  │  │  ├─ _layout.tsx
│  │  │  ├─ index.tsx
│  │  │  ├─ settings.tsx
│  │  ├─ users/
│  │  │  └─ [userId].tsx
│  │  └─ modal.tsx
│  ├─ components/
│  │  ├─ ui/
│  │  │  └─ screen.tsx
│  │  └─ user-card.tsx
│  ├─ features/
│  │  └─ users/
│  │     ├─ api.ts
│  │     ├─ hooks.ts
│  │     └─ types.ts
│  ├─ constants/
│  │  └─ theme.ts
│  ├─ hooks/
│  │  └─ use-theme.ts
│  └─ lib/
│     └─ query-client.ts
├─ app.config.ts
├─ eslint.config.js
├─ package.json
└─ tsconfig.json
```

## Import Guidelines

Group imports by their path prefix. Order alphabetically within each group.

**Import Groups:**

1. **Side-effect imports** (CSS, polyfills) - no space between them
2. **Imports that DO NOT start with `@`** (e.g., `expo-router`, `react-native`)
3. **Imports that START with `@`** (e.g., `@clerk/expo`, `@/hooks`, `@react-navigation/native`)

**Rule:** Group by the import path prefix, NOT by whether it's a third-party package. Scoped npm packages
like `@clerk/expo` or `@react-navigation/native` belong in group 3 because their paths start with `@`.

**Good:**

```typescript
import "react-native-reanimated";

// Imports that DO NOT start with `@`
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// Imports that START with `@` (scoped packages + path aliases)
import { ClerkProvider } from "@clerk/expo";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
```

**Bad - Wrong group for @clerk/expo:**

```typescript
import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/expo"; // ❌ Wrong group - starts with @
import { StatusBar } from "expo-status-bar";
```

**Bad - Mixed order:**

```typescript
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
```

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first**
for important guidelines on how to correctly use Convex APIs and patterns. The file
contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->
