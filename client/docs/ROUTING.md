# Routing Conventions

This document defines how URLs are structured in the client app.

## Pluralization

- Use plural nouns for collections

Examples:

- `/chats`
- `/users`
- `/groups`

## Route Parameters

Use route params when the page **cannot exist without the value**.

Examples:

- `/chats/:chatId`
- `/users/:userId`

## Query Parameters

Use query params for **UI state only**.

Examples:

- `/chats?filter=unread`
- `/chats/:chatId?tab=members`
- `/chats/:chatId?highlight=msg_42`

## Variants

Do not encode variants (DM vs Group) in the URL.

Variants are determined by data, not routes.

Correct:

- `/chats/:chatId`

Incorrect:

- `/dm/:id`
- `/group/:id`

## Sub-routes

Use sub-routes for real navigable pages.

Examples:

- `/chats/:chatId/info`
- `/chats/:chatId/members`

## Bookmark Rule

- If users would bookmark it → route param or sub-route
- If users would toggle it → query param
