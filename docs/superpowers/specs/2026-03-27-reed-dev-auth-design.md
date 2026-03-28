# Reed Dev Auth Design

## Summary

This spec defines the dev-only authentication setup for Reed using Clerk on the
Expo client and Convex as the authenticated backend.

The goal is to make the current auth flow reliable in local development without
expanding the scope to production configuration.

## Current State

The repository already includes most of the required auth foundation:

- `@clerk/expo` is installed and wired in the root layout.
- `ConvexProviderWithClerk` is already used to send Clerk tokens to Convex.
- `convex/auth.config.ts` is configured to validate Clerk JWTs.
- the Convex dev deployment already has `CLERK_JWT_ISSUER_DOMAIN` set.
- authenticated user sync is implemented in Convex.
- Expo auth routes and a Google SSO sign-in screen already exist.

## Problem To Solve

The auth route group currently decides whether to redirect based on Clerk's
client auth state alone, while the authenticated home route group decides access
based on Convex auth state.

This split can cause redirect churn during development when Clerk has finished
sign-in but Convex has not yet confirmed the token, or when the Clerk and
Convex auth states temporarily disagree.

## Design

### Auth Source Of Truth

Use Convex-authenticated state as the route-guard source of truth for screens
that depend on Convex data.

This keeps both route groups aligned around the same backend-authenticated state
instead of mixing raw Clerk state and Convex state.

### Client Wiring

Keep the existing Expo client wiring:

- `ClerkProvider` remains the top-level auth provider.
- `ConvexProviderWithClerk` remains the backend auth bridge.
- `useSSO` continues to power Google sign-in in development.

No provider swap or route restructure is needed for this dev-only pass.

### Backend Wiring

Keep the current Convex auth configuration:

- `convex/auth.config.ts` continues to validate Clerk-issued tokens.
- `users.syncUser` remains the app-level user bootstrap mutation.
- `ctx.auth.getUserIdentity()` remains the only trusted backend identity source.

No production issuer or production Clerk keys are needed in this scope.

## Validation

The dev setup is considered complete when:

1. route guard tests verify the auth stack waits for Convex auth resolution
2. route guard tests verify only Convex-authenticated users are redirected into
   the home shell
3. existing sign-in and home-layout tests still pass
4. `bun run lint` passes

## Out Of Scope

- production Clerk configuration
- production redirect URLs
- broader auth UI redesign
- role-based authorization
- changes to the existing Google SSO strategy
