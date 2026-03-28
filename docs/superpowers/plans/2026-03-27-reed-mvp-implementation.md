# Reed MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use
> superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Reed's MVP voice-to-task-to-reminder loop on top of the existing Expo, Clerk, and Convex foundation.

**Architecture:** Keep capture and local notifications in the Expo client, but
move secure transcription and persistence through Convex. Recorded audio should
be uploaded to Convex storage, transcribed in a Convex action using
`gpt-4o-mini-transcribe`, converted into task documents, and then surfaced in a
today-focused UI that can schedule local notifications based on user
preferences.

**Tech Stack:** Expo Router, React Native, NativeWind, Clerk, Convex,
`expo-audio`, `expo-notifications`, OpenAI `gpt-4o-mini-transcribe`, Vitest,
`convex-test`

---

## File Structure

### Existing files to modify

- `package.json`
  Add MVP dependencies and keep scripts unchanged.
- `app.json`
  Add any required notification plugin config and keep app metadata aligned.
- `src/app/(home)/_layout.tsx`
  Evolve the authenticated app shell into a tab-based home plus settings shell.
- `src/app/(home)/index.tsx`
  Replace the placeholder welcome screen with the daily task experience.
- `convex/schema.ts`
  Add task and reminder-preference tables plus indexes for user-scoped queries.

### New client files to create

- `src/app/(home)/settings.tsx`
  Settings tab for reminder behavior.
- `src/features/capture/components/task-recorder.tsx`
  Voice capture UI for start, stop, and retry.
- `src/features/capture/hooks/use-task-recording.ts`
  Recording lifecycle, permission handling, and audio result state.
- `src/features/capture/types.ts`
  Shared types for captured audio state.
- `src/features/transcription/api.ts`
  Client-side helper that uploads audio and requests a transcription.
- `src/features/tasks/api.ts`
  Client-side wrappers for task mutations and today queries.
- `src/features/tasks/components/task-list.tsx`
  Presentational list for today's tasks.
- `src/features/tasks/components/task-row.tsx`
  Row component for task state and actions.
- `src/features/tasks/hooks.ts`
  Hooks that bind Convex task APIs to screens and components.
- `src/features/tasks/types.ts`
  Shared task and task-status types used across the client.
- `src/features/reminders/api.ts`
  Local notification scheduling, cancelation, and permission helpers.
- `src/features/preferences/hooks.ts`
  Hooks for reading and updating reminder preferences.

### New Convex files to create

- `convex/tasks.ts`
  Task creation, today query, complete, and snooze mutations and queries.
- `convex/preferences.ts`
  Reminder preference query and mutation for the current user.
- `convex/transcriptions.ts`
  Upload URL generation and transcription action boundary.

### New tests to create

- `tests/task-recorder.test.tsx`
  Capture permission and recording interaction tests.
- `tests/home-screen.test.tsx`
  Daily task screen rendering, loading, and empty state coverage.
- `tests/settings-screen.test.tsx`
  Settings tab rendering and preference update coverage.
- `tests/reminders-api.test.ts`
  Local reminder scheduling behavior and cancelation coverage.
- `convex/tasks.test.ts`
  Task creation, today query, complete, and snooze coverage.
- `convex/preferences.test.ts`
  Preference defaults and update coverage.

## Implementation Notes

- Do not put the OpenAI API key in Expo client code or `EXPO_PUBLIC_*` env
  vars.
- Store `OPENAI_API_KEY` in Convex environment config and use it only from a Convex action.
- Keep all task reads scoped to the authenticated user by deriving identity server-side.
- Prefer bounded Convex queries with indexes over `.collect()`.
- Keep the first task model intentionally small: transcript-derived title,
  status, created time, due-today grouping metadata, snooze metadata, and
  reminder metadata only if truly needed.
- Local notifications should be scheduled in the client after task mutations
  succeed. The MVP does not need server-driven reminders.

## Task 1: Add voice capture with `expo-audio`

**Files:**

- Modify: `package.json`
- Modify: `src/app/(home)/index.tsx`
- Create: `src/features/capture/components/task-recorder.tsx`
- Create: `src/features/capture/hooks/use-task-recording.ts`
- Create: `src/features/capture/types.ts`
- Test: `tests/task-recorder.test.tsx`

- [ ] **Step 1: Write the failing recorder test**

Create `tests/task-recorder.test.tsx` covering:

- permission denied state
- start recording action
- stop recording action
- retry after an error

Run: `bun run test tests/task-recorder.test.tsx`
Expected: FAIL because the capture feature files do not exist yet.

- [ ] **Step 2: Install the audio dependency**

Run: `bunx expo install expo-audio`
Expected: `package.json` and `bun.lock` update successfully.

- [ ] **Step 3: Implement the recording hook**

Create `src/features/capture/hooks/use-task-recording.ts` with:

- microphone permission request flow
- recording start and stop handlers
- loading and error state
- a recorded result that includes at least a file URI and duration if available

- [ ] **Step 4: Implement the recorder UI**

Create `src/features/capture/components/task-recorder.tsx` and wire it into
`src/app/(home)/index.tsx`.

The first UI can be simple:

- primary record button
- stop button while recording
- transcript-pending placeholder after capture
- permission and error messaging

- [ ] **Step 5: Run tests and lint**

Run: `bun run test tests/task-recorder.test.tsx`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 6: Commit**

Run:

```bash
git add package.json bun.lock src/app/(home)/index.tsx src/features/capture tests/task-recorder.test.tsx
git commit -m "feature(capture): add task audio recording flow"
```

## Task 2: Add secure transcription via Convex and `gpt-4o-mini-transcribe`

**Files:**

- Modify: `package.json`
- Create: `convex/transcriptions.ts`
- Create: `src/features/transcription/api.ts`
- Test: `tests/task-recorder.test.tsx`

- [ ] **Step 1: Add a failing transcription client test or extend the recorder test**

Cover:

- upload request starts after a recording is available
- transcription success returns text
- transcription failure surfaces a recoverable error

Run: `bun run test tests/task-recorder.test.tsx`
Expected: FAIL because transcription helpers do not exist.

- [ ] **Step 2: Install the OpenAI SDK**

Run: `bun add openai`
Expected: `package.json` and `bun.lock` update successfully.

- [ ] **Step 3: Create the secure Convex transcription boundary**

Create `convex/transcriptions.ts` with:

- a mutation that generates a Convex storage upload URL
- an action that accepts a storage ID, fetches the uploaded file, and calls the
  OpenAI transcription API with `gpt-4o-mini-transcribe`

Set `OPENAI_API_KEY` in Convex environment configuration before manual testing.

- [ ] **Step 4: Create the client transcription helper**

Create `src/features/transcription/api.ts` that:

- requests an upload URL from Convex
- uploads the recorded audio file
- calls the transcription action
- returns plain transcript text to the caller

- [ ] **Step 5: Connect capture to transcription**

Update the recorder flow so a successful recording can start transcription and
surface loading, success, and failure states in the UI.

- [ ] **Step 6: Run tests and lint**

Run: `bun run test tests/task-recorder.test.tsx`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 7: Commit**

Run:

```bash
git add package.json bun.lock convex/transcriptions.ts src/features/transcription src/features/capture tests/task-recorder.test.tsx
git commit -m "feature(transcription): add secure voice transcription flow"
```

## Task 3: Create tasks from transcript text

**Files:**

- Modify: `convex/schema.ts`
- Create: `convex/tasks.ts`
- Create: `convex/tasks.test.ts`
- Create: `src/features/tasks/api.ts`
- Create: `src/features/tasks/types.ts`

- [ ] **Step 1: Write failing Convex task tests**

Create `convex/tasks.test.ts` covering:

- create task for authenticated user
- reject unauthenticated task creation
- today query only returns current user's tasks

Run: `bun run test convex/tasks.test.ts`
Expected: FAIL because the task schema and functions do not exist.

- [ ] **Step 2: Add the MVP task schema**

Update `convex/schema.ts` with a `tasks` table containing only MVP fields, for
example:

- `userId` or `userTokenIdentifier` derived server-side
- `title`
- `status`
- `createdAt`
- `scheduledForDate`
- `snoozedUntil`

Add indexes that support today-scoped and user-scoped reads.

- [ ] **Step 3: Implement task mutations and queries**

Create `convex/tasks.ts` with:

- `createFromTranscript`
- `listForToday`
- `complete`
- `snooze`

Use `ctx.auth.getUserIdentity()` for authorization instead of accepting a user
identifier from the client.

- [ ] **Step 4: Add client task wrappers**

Create `src/features/tasks/api.ts` and `src/features/tasks/types.ts` with
minimal client helpers for create, list, complete, and snooze.

- [ ] **Step 5: Run tests and lint**

Run: `bun run test convex/tasks.test.ts`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 6: Commit**

Run:

```bash
git add convex/schema.ts convex/tasks.ts convex/tasks.test.ts src/features/tasks
git commit -m "feature(tasks): add transcript-driven task creation"
```

## Task 4: Replace the home placeholder with the daily task list

**Files:**

- Modify: `src/app/(home)/index.tsx`
- Create: `src/features/tasks/components/task-list.tsx`
- Create: `src/features/tasks/components/task-row.tsx`
- Create: `src/features/tasks/hooks.ts`
- Test: `tests/home-screen.test.tsx`

- [ ] **Step 1: Write the failing home screen test**

Create `tests/home-screen.test.tsx` covering:

- loading state
- empty state
- populated today task list

Run: `bun run test tests/home-screen.test.tsx`
Expected: FAIL because the new task-list UI does not exist.

- [ ] **Step 2: Build the task list components**

Create `task-list.tsx` and `task-row.tsx` with:

- a compact today-focused layout
- task title display
- placeholder affordances for complete and snooze actions

- [ ] **Step 3: Bind the home screen to task data**

Create `src/features/tasks/hooks.ts` and update `src/app/(home)/index.tsx` so
the screen:

- shows the recorder
- shows transcription/create feedback
- renders today's tasks below the capture UI

- [ ] **Step 4: Run tests and lint**

Run: `bun run test tests/home-screen.test.tsx`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add src/app/(home)/index.tsx src/features/tasks tests/home-screen.test.tsx
git commit -m "feature(tasks): add daily task list screen"
```

## Task 5: Add complete and snooze actions

**Files:**

- Modify: `convex/tasks.ts`
- Modify: `convex/tasks.test.ts`
- Modify: `src/features/tasks/components/task-row.tsx`
- Modify: `src/features/tasks/hooks.ts`
- Test: `tests/home-screen.test.tsx`

- [ ] **Step 1: Extend failing tests for lifecycle actions**

Add coverage for:

- marking a task complete
- snoozing a task
- hiding or reshaping task visibility in the today list after state changes

Run: `bun run test convex/tasks.test.ts tests/home-screen.test.tsx`
Expected: FAIL because lifecycle actions are incomplete.

- [ ] **Step 2: Implement complete and snooze mutations**

Update `convex/tasks.ts` to:

- mark tasks complete
- store a snooze timestamp or snooze-until date
- keep list queries aligned with the intended today experience

- [ ] **Step 3: Wire actions into the task row**

Update `task-row.tsx` and `hooks.ts` so users can trigger complete and snooze
from the list.

- [ ] **Step 4: Run tests and lint**

Run: `bun run test convex/tasks.test.ts tests/home-screen.test.tsx`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 5: Commit**

Run:

```bash
git add convex/tasks.ts convex/tasks.test.ts src/features/tasks/components/task-row.tsx src/features/tasks/hooks.ts tests/home-screen.test.tsx
git commit -m "feature(tasks): add complete and snooze actions"
```

## Task 6: Add local reminders with `expo-notifications`

**Files:**

- Modify: `package.json`
- Modify: `app.json`
- Create: `src/features/reminders/api.ts`
- Modify: `src/features/tasks/hooks.ts`
- Test: `tests/reminders-api.test.ts`

- [ ] **Step 1: Write failing reminder API tests**

Create `tests/reminders-api.test.ts` covering:

- permission request helper
- schedule helper
- cancel helper
- reschedule behavior for snooze

Run: `bun run test tests/reminders-api.test.ts`
Expected: FAIL because the reminder helper does not exist.

- [ ] **Step 2: Install notifications support**

Run: `bunx expo install expo-notifications`
Expected: `package.json`, `bun.lock`, and any required Expo metadata update.

- [ ] **Step 3: Add notification config**

Update `app.json` with the notification plugin configuration needed for future
builds while keeping Expo Go compatibility for MVP development.

- [ ] **Step 4: Implement reminder helpers**

Create `src/features/reminders/api.ts` with:

- local notification permission request
- schedule reminder helper
- cancel reminder helper
- reschedule helper for snooze flows

- [ ] **Step 5: Call reminder helpers from task flows**

Update `src/features/tasks/hooks.ts` so:

- newly created tasks can schedule reminders
- completing tasks cancels pending reminders
- snoozing tasks reschedules reminders

- [ ] **Step 6: Run tests and lint**

Run: `bun run test tests/reminders-api.test.ts`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 7: Commit**

Run:

```bash
git add package.json bun.lock app.json src/features/reminders src/features/tasks/hooks.ts tests/reminders-api.test.ts
git commit -m "feature(reminders): add local task reminders"
```

## Task 7: Add a settings tab for reminder preferences

**Files:**

- Modify: `src/app/(home)/_layout.tsx`
- Create: `src/app/(home)/settings.tsx`
- Create: `convex/preferences.ts`
- Create: `convex/preferences.test.ts`
- Create: `src/features/preferences/hooks.ts`
- Test: `tests/settings-screen.test.tsx`

- [ ] **Step 1: Write the failing settings test**

Create `tests/settings-screen.test.tsx` covering:

- settings tab renders
- current reminder preferences load
- updating preferences triggers the mutation

Run: `bun run test tests/settings-screen.test.tsx convex/preferences.test.ts`
Expected: FAIL because preferences and settings UI do not exist.

- [ ] **Step 2: Add reminder preference persistence**

Create `convex/preferences.ts` and extend `convex/schema.ts` if needed with a
preferences table keyed to the current user.

Keep the first preference model small, for example:

- reminder enabled
- reminder cadence preset
- reminder tone preset

- [ ] **Step 3: Add the settings hooks and screen**

Create `src/features/preferences/hooks.ts` and `src/app/(home)/settings.tsx`.

Update `src/app/(home)/_layout.tsx` to provide tabs for:

- Home
- Settings

- [ ] **Step 4: Connect preferences to reminder scheduling**

Update reminder scheduling call sites so newly scheduled notifications use the
latest saved preferences.

- [ ] **Step 5: Run tests and lint**

Run: `bun run test tests/settings-screen.test.tsx convex/preferences.test.ts`
Expected: PASS

Run: `bun run lint`
Expected: PASS

- [ ] **Step 6: Commit**

Run:

```bash
git add src/app/(home)/_layout.tsx src/app/(home)/settings.tsx \
  convex/preferences.ts convex/preferences.test.ts convex/schema.ts \
  src/features/preferences tests/settings-screen.test.tsx
git commit -m "feature(settings): add reminder preference controls"
```

## Task 8: Polish the MVP loop and add regression coverage

**Files:**

- Modify: `src/app/(home)/index.tsx`
- Modify: `src/app/(home)/settings.tsx`
- Modify: `src/features/capture/components/task-recorder.tsx`
- Modify: `src/features/tasks/components/task-list.tsx`
- Modify: `src/features/tasks/components/task-row.tsx`
- Modify: `tests/home-screen.test.tsx`
- Modify: `tests/settings-screen.test.tsx`
- Modify: `tests/task-recorder.test.tsx`

- [ ] **Step 1: Identify the biggest UX gaps from manual MVP testing**

Check:

- denied microphone permission
- failed transcription
- empty list after completing everything
- reminder permission denied
- settings changed after tasks already exist

- [ ] **Step 2: Add regression tests for the chosen gaps**

Extend existing screen tests to lock in the intended UX for the highest-risk
edge cases first.

- [ ] **Step 3: Make the smallest UI and state fixes needed**

Prioritize:

- clear status messaging
- recoverable errors
- reduced friction between recording, transcription, and task creation

- [ ] **Step 4: Run the focused tests**

Run:

```bash
bun run test tests/task-recorder.test.tsx tests/home-screen.test.tsx \
  tests/settings-screen.test.tsx convex/tasks.test.ts \
  convex/preferences.test.ts
```

Expected: PASS

- [ ] **Step 5: Run the full verification pass**

Run:

```bash
bun run test
bun run lint
```

Expected: PASS

- [ ] **Step 6: Commit**

Run:

```bash
git add src/app/(home) src/features tests convex/tasks.test.ts convex/preferences.test.ts
git commit -m "feature(mvp): polish the voice task reminder flow"
```

## Issue Mapping

Use the approved spec to create one GitHub issue per task:

1. Voice capture
2. Secure transcription
3. Transcript-driven task creation
4. Daily task list
5. Complete and snooze actions
6. Local reminders
7. Reminder preferences in settings
8. MVP polish

Each issue body should include:

- Goal
- Why It Matters
- Architecture
- Scope
- Out Of Scope
- Acceptance Criteria
- Suggested Implementation Notes

## Verification Checklist

Before calling the MVP ready, verify:

- a signed-in user can record a task
- the recording can be transcribed securely
- the transcript can become a task
- today's tasks load correctly for the current user only
- tasks can be completed and snoozed
- local reminders schedule and cancel correctly
- reminder preferences can be changed in settings
- lint and test commands pass
