# Coding Rules

These rules are non-negotiable.

## General

- No API calls in pages
- No feature imports another feature
- No business logic in shared components

## Components

- Avoid boolean props for layout
- Prefer slots (children composition) over layout props
- UI components should not know page context

## Reuse

- Reuse UI without reusing logic
- Extract logic into hooks or policies
- Do not copy-paste feature logic

Violations of these rules should be refactored.
