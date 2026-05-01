# Frontend Architecture

This document defines how the frontend codebase is organized.

## Core Layers

### Pages

- Route-level components
- Compose multiple features
- Decide layout and context (DM vs Group, Admin vs User)
- Contain no business logic or API calls

### Features

- Domain-level capabilities (auth, chat, users, etc.)
- Own API calls, state, websocket logic, and policies
- Reusable across pages
- Must not import other features

### Shared

- Reusable UI components, hooks, and utilities
- No business logic
- No domain knowledge

### App

- Routing setup
- Global providers
- Application bootstrap

## Dependency Rules

- Pages may import features and shared code
- Features may import shared code
- Features must not import other features
- Shared code imports nothing domain-specific

If a file violates these rules, it is in the wrong place.
