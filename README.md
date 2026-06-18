# Ashtakoota

Ashtakoota is a full-stack dating app prototype that combines profile discovery with Vedic compatibility scoring.

[Live Demo](https://shivanshghai.github.io/ashtakoota/?demo=1) · [Source Code](https://github.com/shivanshghai/ashtakoota)

## Overview

This project explores what a more intentional dating experience could look like: users create detailed profiles, browse compatible people, request deeper readings, view match breakdowns, and move into chat when there is mutual interest.

The live demo is self-contained and runs without a backend service. It uses built-in sample data so the main product flows can be reviewed even while the full deployment is paused during my studies.

## Highlights

- Profile onboarding with relationship intent, birth details, photos, and personal prompts.
- Compatibility scoring based on the Ashtakoota system, shown as clear match summaries and detailed breakdowns.
- Discovery feed with profile cards, match signals, likes, and reading requests.
- Match history, saved compatibility results, and certificate download flow.
- Chat interface for mutual matches, including first-message guidance.
- Safety-minded flows for blocking, reporting, notifications, and a moderation view.

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Database: MySQL
- Auth and security: JWT, bcrypt, cookie/session handling, route middleware
- Realtime: Socket.io
- Other services: file uploads, PDF generation, email notifications

## Project Status

The GitHub Pages demo is available now and does not require Railway or any paid hosting. The full backend implementation remains in the repository and can be redeployed later when I have time to actively maintain the project again.

## Run Locally

```bash
cd frontend
npm install
npm start
```

Then open `http://localhost:3000/?demo=1` for the self-contained demo.

To run the backend locally, install dependencies in `backend/`, create the required environment variables for MySQL and auth secrets, and start `backend/server.js`.

## What I Built

I designed and implemented the end-to-end product prototype: the single-page frontend, Express API, compatibility logic, database schema, auth flows, match/request/chat features, and demo mode used for the public project link.
