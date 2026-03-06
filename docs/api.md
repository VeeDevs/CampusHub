# API Overview

Base URL: `/api`

## Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/reset-password`
- `GET /auth/me`

## Users
- `PATCH /users/profile`
- `POST /users/logout`

## Services
- `GET /services`
- `POST /services`
- `PATCH /services/:id`
- `DELETE /services/:id`
- `POST /services/:id/book`
- `POST /services/:id/reviews`

## Notes
- `GET /notes`
- `POST /notes`
- `POST /notes/:id/purchase`
- `GET /notes/:id/download`
- `POST /notes/:id/ratings`

## Jobs
- `GET /jobs`
- `POST /jobs` (business/admin)
- `POST /jobs/:id/apply` (student)

## Items
- `GET /items`
- `POST /items`
- `PATCH /items/:id`

## Chat
- `GET /chats`
- `POST /chats`
- `POST /chats/:chatId/messages`

Socket.io events:
- `join_chat`
- `send_message`
- `new_message`

## Feed
- `GET /feed`
- `POST /feed`
- `POST /feed/:id/comments`
- `POST /feed/:id/like`

## Deals
- `GET /deals`
- `POST /deals` (business/admin)

## Search
- `GET /search?q=&category=&university=&maxPrice=`

## Notifications
- `GET /notifications`
- `PATCH /notifications/:id/read`

## Payments
- `POST /payments/checkout`
- `POST /payments/:id/confirm`

## AI
- `POST /ai/summarize`
- `POST /ai/ask`
- `POST /ai/quiz`
- `POST /ai/flashcards`
- `POST /ai/study-plan`

## Admin
- `GET /admin/analytics`
- `GET /admin/users`
- `DELETE /admin/listings/:type/:id`
- `DELETE /admin/posts/:id`
