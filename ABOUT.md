# Reed

This document gives AI agents and collaborators product context for Reed.
It explains what Reed is, what exists in the repository today, and what the
app is intended to become in the near term so future work stays aligned.

## What Reed Is

Reed is a voice-first productivity mobile app built to help people remember
and complete the tasks that matter today.

At a high level, Reed should let users:

- speak a task instead of typing it
- quickly turn voice input into actionable todos
- keep a clear view of what needs to happen today
- receive persistent reminders so tasks do not get forgotten
- choose how Reed reminds them through settings

Reed is not meant to be a heavy project management system. Its value comes
from fast capture, daily clarity, and consistent follow-through.

## Core User Problem

Reed exists for users who think of things in the moment, but often lose them
before they act on them.

The product should solve a few specific problems well:

- typing can be too slow when a task appears in the middle of a busy day
- people forget small but important tasks after the moment passes
- traditional todo apps often collect tasks without helping users follow through
- users need reminders that match their personal motivation style, not a single
  fixed tone

Reed should feel like a lightweight system that helps users remember, refocus,
and act.

## Product Vision

The near-term vision for Reed is a mobile app where the fastest path to adding
a task is speaking naturally.

A likely happy path looks like this:

1. A user opens Reed and records or speaks a task.
2. Reed converts the speech into structured task text.
3. The task is added to the user's list for today or the relevant timeframe.
4. Reed follows up with reminders until the task is completed, snoozed, or
   otherwise resolved.
5. The user can adjust reminder style, intensity, or cadence in settings.

The product should emphasize action over organization. Reed should help users
move from "I need to remember this" to "I actually did it" with as little
friction as possible.

## Current State

As of now, the repository is still in an early foundation stage.

What currently exists:

- Expo Router mobile app scaffold
- Clerk authentication with Google sign-in
- Convex backend setup and authenticated user syncing
- a basic authenticated home screen placeholder

What does not appear to be implemented yet:

- voice capture for tasks
- speech-to-text task creation flow
- task data model and task management UI
- reminder scheduling and delivery
- settings for reminder behavior

Future agents should not assume those product features already exist just
because they are part of Reed's intended direction.

## Core Experience Principles

When implementing Reed, optimize for these principles:

- Voice-first, not voice-only.
  Voice should be the primary capture flow, but sensible typed or edited
  fallbacks are acceptable when they reduce friction.

- Fast capture beats rich structure.
  It is better to capture a task quickly than to require too many fields,
  categories, or decisions upfront.

- Today matters more than someday.
  Reed should help users manage and complete what matters in the current day
  before expanding into broader productivity complexity.

- Reminders are part of the core product, not an afterthought.
  Reed is not just a place to store tasks. It should actively help users
  remember and follow through.

- Reminder behavior must be user-configurable.
  Some users want gentle nudges. Others want firmer accountability. Reed should
  support that through settings instead of enforcing one personality.

- Stay lightweight.
  Reed should not drift into a bloated workspace, docs system, or enterprise
  planning tool unless that direction is explicitly chosen later.

## Reminder Philosophy

Reminders are one of Reed's defining features.

The goal is not simply to notify once and disappear. Reed should help prevent
important tasks from silently falling out of attention.

This likely means reminder behavior should eventually support ideas like:

- repeated reminders until a task is handled
- configurable tone, intensity, or persistence
- user control over how supportive or firm Reed feels
- sensible boundaries such as avoiding spammy or counterproductive behavior

Reminder style should be treated as a product setting. A user should be able to
shape Reed into a gentler assistant, a stronger accountability partner, or
something in between.

## Feature Direction

Near-term work should likely cluster around these product areas:

- voice recording and capture UX
- speech-to-text processing
- parsing voice input into clear task objects
- a focused list of tasks for today
- task completion, snooze, and resurface flows
- notification and reminder scheduling
- settings for reminder cadence, tone, and behavior

If tradeoffs come up, prefer the option that makes task capture faster and
follow-through more reliable.

## Non-Goals For Now

Unless explicitly requested, Reed should not be treated as:

- a team collaboration platform
- a complex project or kanban management system
- a long-form notes app
- a general personal knowledge base

Those ideas may overlap with productivity, but they are not Reed's core job
right now.

## Guidance For AI Agents

When adding features or making product decisions, use these rules:

- preserve Reed's identity as a voice-first task and reminder app
- optimize for reducing user friction at the moment of capture
- prioritize features that help users act today instead of just organizing data
- keep current implementation reality separate from planned product direction
- avoid introducing unnecessary complexity, especially during early builds
- treat reminder personalization as a first-class settings concern

If a proposed feature does not improve capture speed, daily clarity, or
follow-through, it is probably not central to Reed.
