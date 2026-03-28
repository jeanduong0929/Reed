# Reed MVP GitHub Issues Design

## Summary

This spec defines the initial MVP GitHub issue set for Reed.

The goal is to create a small, implementation-ready backlog that:

- reflects Reed's product direction as a voice-first task and reminder app
- uses fullstack vertical slices instead of frontend and backend split tickets
- includes architectural guidance so implementation stays cohesive
- helps the developer build Reed personally while using AI as a guide

## Product Context

Reed is a voice-first productivity mobile app for quickly capturing tasks and
helping users remember to complete them during the day.

The MVP centers on one complete loop:

1. The user signs in.
2. The user records a task with `expo-audio`.
3. Reed transcribes the audio with `gpt-4o-mini-transcribe`.
4. Reed creates a task for today from the transcript.
5. Reed displays the task in a focused daily list.
6. Reed schedules local reminders for follow-through.
7. The user can adjust reminder behavior in settings.

## Constraints And Assumptions

- The app is currently used through Expo Go on a mobile device.
- MVP reminders should use local scheduled notifications, not remote push.
- Issues should be written as fullstack user-facing slices.
- Reed should stay lightweight and avoid project-management complexity.
- Reminder behavior should be configurable in settings.
- The current repository already includes auth scaffolding with Clerk and Convex.

## MVP Architecture

The MVP should be implemented with clear boundaries between these layers:

### Capture Layer

Responsible for microphone permissions, recording state, and producing usable
audio assets through `expo-audio`.

### Transcription Layer

Responsible for sending recorded audio to `gpt-4o-mini-transcribe` and
returning clean transcript text to the application.

### Task Layer

Responsible for creating tasks, querying today's tasks, and supporting task
lifecycle actions such as complete and snooze.

### Reminder Layer

Responsible for scheduling and managing local notifications for active tasks in
a way that works with Expo Go.

### Preferences Layer

Responsible for storing user-configurable reminder behavior such as cadence,
tone, and persistence.

### UI Layer

Responsible for the voice capture flow, daily task list, task actions, and
settings experience.

## Ticket Design Principles

Each MVP issue should:

- describe a user-visible capability
- include all fullstack work needed for that slice
- include architecture guidance for where logic should live
- include acceptance criteria that are easy to verify
- explicitly note what is out of scope so tickets stay focused

## Recommended GitHub Issue Template

Each issue should use this structure:

### Goal

Describe the user-facing outcome.

### Why It Matters

Explain how the issue supports Reed's core promise of fast capture and
follow-through.

### Architecture

Explain where the feature belongs across the UI, integrations, data, and
notification layers.

### Scope

List what is included in the ticket.

### Out Of Scope

List what should wait for later tickets.

### Acceptance Criteria

Provide a short checklist of observable behaviors.

### Suggested Implementation Notes

Give practical guidance without prescribing the entire solution.

## Proposed MVP Issue Set

### 1. Set up voice capture for task recording

Goal:
Allow a signed-in user to record a task idea from the app using `expo-audio`.

Architecture:
This issue should establish the capture layer in the app and define the UI
entry point for starting, stopping, and reviewing a recording.

Scope:

- microphone permissions flow
- record and stop controls
- basic recording state and error handling
- audio asset output that can be passed to transcription later

Out of scope:

- transcription
- task creation
- reminder scheduling

Acceptance criteria:

- a signed-in user can grant microphone access
- a user can start and stop a recording from the app
- the recording flow handles denied permission gracefully
- the app produces an audio result that can be used by a later transcription
  step

Suggested implementation notes:

- keep capture logic isolated from task creation logic
- prefer a reusable feature module over embedding all recording logic in a
  screen component

### 2. Transcribe recorded task audio with gpt-4o-mini-transcribe

Goal:
Turn a recorded audio clip into transcript text that Reed can use for task
creation.

Architecture:
This issue should introduce the transcription layer and define the boundary
between raw audio input and cleaned transcript output.

Scope:

- upload or submission flow for recorded audio
- transcription request handling
- transcript result handling
- basic error and retry states

Out of scope:

- advanced task parsing beyond what is needed for MVP
- reminder scheduling

Acceptance criteria:

- a recorded audio clip can be submitted for transcription
- the app receives transcript text back from the transcription flow
- transcription errors are surfaced clearly to the user

Suggested implementation notes:

- keep transcription integration behind a focused API boundary
- return plain, usable transcript text before adding heavier interpretation

### 3. Create tasks from transcribed voice input

Goal:
Convert transcript text into a saved task for the current user.

Architecture:
This issue should establish the first task-domain workflow and define how a
task is created from transcript-driven input.

Scope:

- task data model for MVP needs
- create-task mutation flow
- lightweight transcript cleanup or confirmation behavior
- associating tasks with the authenticated user

Out of scope:

- recurring tasks
- advanced natural-language scheduling
- team or shared task behavior

Acceptance criteria:

- a transcript can be turned into a saved task
- the created task belongs to the current signed-in user
- a user can confirm or lightly edit a transcript before task creation if
  needed

Suggested implementation notes:

- keep task creation focused on fast capture
- avoid requiring too many fields at creation time

### 4. Build the daily task list experience

Goal:
Give users a clear home for the tasks they need to complete today.

Architecture:
This issue should define the main task-list UI and the query layer for loading
a focused set of tasks for the current user.

Scope:

- today-focused task list screen or home experience
- empty, loading, and basic error states
- display of task status and key task details

Out of scope:

- complex filtering
- projects, tags, or folders
- long-range planning views

Acceptance criteria:

- a signed-in user can view their current tasks for today
- the list handles empty and loading states cleanly
- the task list stays focused on daily clarity rather than advanced organization

Suggested implementation notes:

- keep the first list narrow and easy to scan
- prefer bounded task queries over unbounded reads

### 5. Support completing and snoozing tasks

Goal:
Let users resolve a task or push it forward without losing it.

Architecture:
This issue should define the initial task lifecycle actions and the data rules
they trigger for task state changes.

Scope:

- complete action
- snooze action
- updated task state handling in the list
- reminder rescheduling hooks as needed for snooze behavior

Out of scope:

- archival workflows
- analytics
- advanced task recurrence

Acceptance criteria:

- a user can mark a task complete
- a user can snooze a task
- completed and snoozed tasks update the daily list correctly

Suggested implementation notes:

- define task states clearly before wiring UI actions
- keep snooze behavior simple for MVP

### 6. Schedule local reminders for active tasks

Goal:
Ensure Reed actively reminds users about tasks they have not handled.

Architecture:
This issue should create the reminder layer and define how task state and local
notification scheduling stay in sync.

Scope:

- permission flow for local notifications
- scheduling local reminders for active tasks
- canceling or updating reminders when tasks are completed or snoozed
- Expo Go compatible local notification handling

Out of scope:

- remote push notifications
- server-driven reminder delivery
- complex reminder rules engines

Acceptance criteria:

- an active task can schedule a local reminder
- completing a task prevents stale reminders from continuing
- snoozing a task updates or reschedules the next reminder
- the reminder approach works within Expo Go constraints

Suggested implementation notes:

- keep reminder scheduling logic centralized
- do not tie notification scheduling too tightly to individual UI components

### 7. Add reminder preferences in settings

Goal:
Allow users to control how Reed reminds them.

Architecture:
This issue should define the preferences layer and connect reminder settings to
local scheduling behavior.

Scope:

- settings UI for reminder behavior
- persistence for reminder preferences
- connection between preferences and newly scheduled reminders

Out of scope:

- highly granular automation systems
- team-level policies

Acceptance criteria:

- a user can change reminder behavior from settings
- reminder settings persist for that user
- new reminder scheduling reflects the selected settings

Suggested implementation notes:

- keep the first settings model small and understandable
- expose only the options that meaningfully change Reed's reminder behavior

### 8. Polish the end-to-end MVP flow

Goal:
Close the biggest gaps across capture, transcription, task creation, daily
visibility, and reminders so Reed feels coherent as one product.

Architecture:
This issue should focus on integration quality, not large new systems.

Scope:

- fix UX gaps across the end-to-end flow
- tighten loading, empty, and error states
- handle obvious edge cases between voice capture, tasks, and reminders
- improve implementation consistency where boundaries are unclear

Out of scope:

- new major product areas
- roadmap features beyond the MVP loop

Acceptance criteria:

- the end-to-end voice-to-task-to-reminder flow feels consistent
- critical edge cases have an intentional user experience
- the MVP is usable without relying on hidden manual steps

Suggested implementation notes:

- use this ticket to improve cohesion, not to expand scope
- prefer removing friction over adding more settings or controls

## Recommended Order

The issues should generally be implemented in this sequence:

1. Set up voice capture for task recording
2. Transcribe recorded task audio with `gpt-4o-mini-transcribe`
3. Create tasks from transcribed voice input
4. Build the daily task list experience
5. Support completing and snoozing tasks
6. Schedule local reminders for active tasks
7. Add reminder preferences in settings
8. Polish the end-to-end MVP flow

## Success Criteria For The Backlog

The MVP issue set is successful if it:

- covers the full Reed daily loop without major gaps
- gives enough architecture guidance to support implementation
- avoids artificial frontend and backend ticket separation
- stays small enough to remain an actual MVP backlog
