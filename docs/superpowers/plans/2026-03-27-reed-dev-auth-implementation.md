# Reed Dev Auth Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Reed's dev-only Clerk and Convex auth flow reliable by aligning route guards with Convex-authenticated state.

**Architecture:** Keep the existing Clerk provider, Convex provider bridge, and Google SSO flow intact. Limit code changes to route-guard behavior and focused regression coverage so the client waits for Convex auth before redirecting into Convex-backed screens.

**Tech Stack:** Expo Router, React Native, Clerk Expo, Convex, Vitest, react-test-renderer

---

## File Structure

### Files to modify

- `src/app/(auth)/_layout.tsx`
  Replace raw Clerk guard logic with Convex auth state so redirects match the
  backend-authenticated shell.
- `tests/auth-layout.test.tsx`
  Update the route-guard tests to validate Convex-driven loading, redirect, and
  signed-out behavior.

### Files to verify without changes unless needed

- `src/app/(home)/_layout.tsx`
  Existing Convex-authenticated home shell that should remain the source of
  truth for protected screens.
- `tests/home-layout.test.tsx`
  Existing regression coverage for the authenticated home shell.
- `tests/sign-in-screen.test.tsx`
  Existing coverage for the Clerk Google SSO flow.

## Task 1: Align the auth route group with Convex auth

**Files:**

- Modify: `tests/auth-layout.test.tsx`
- Modify: `src/app/(auth)/_layout.tsx`

- [ ] **Step 1: Write the failing route-guard test**

Update `tests/auth-layout.test.tsx` so it covers:

- loading while Convex auth is unresolved
- redirect only when `useConvexAuth()` reports `isAuthenticated: true`
- rendering the auth stack when Convex auth reports signed out

Run: `bun run test tests/auth-layout.test.tsx`
Expected: FAIL because the component still reads Clerk's raw auth state.

- [ ] **Step 2: Implement the minimal guard change**

Update `src/app/(auth)/_layout.tsx` to read `useConvexAuth()` and use that for
loading and redirect decisions.

- [ ] **Step 3: Run the focused auth tests**

Run: `bun run test tests/auth-layout.test.tsx tests/home-layout.test.tsx tests/sign-in-screen.test.tsx`
Expected: PASS

- [ ] **Step 4: Run lint**

Run: `bun run lint`
Expected: PASS
