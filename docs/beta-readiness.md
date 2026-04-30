# Beta Readiness

Use this as the release gate before inviting testers beyond the core team. The goal is to keep the current product stable, not to add new features.

## Scope

- Feature freeze: do not add product features until the first beta feedback pass is complete.
- Preserve the current desktop and mobile UI unless a workflow is broken or unreadable.
- Use an external feedback form instead of adding an in-app feedback surface.
- Do not rename the app or buy a domain before beta unless the live URL blocks testers.

## Deployment Gate

Before sending the app to testers, verify the live deployment:

- Backend `/health` returns JSON with `status: "ok"`.
- Frontend `/health` returns JSON with `status: "ok"`.
- Frontend `/config.js` exposes the live backend API URL.
- Backend CORS accepts the live frontend URL.
- Railway backend variables are present:
  - `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
  - `JWT_SECRET`, `JWT_EXPIRES_IN`, `FRONTEND_URL`
  - `RESEND_API_KEY`, `RESEND_FROM`
  - `UPLOAD_DIR`
- Railway frontend variable is present:
  - `FRONTEND_API_URL`
- Backend upload volume is attached and mounted so `/uploads/...` photos survive redeploys.

Run the deployment helper from the repo root:

```bash
node scripts/verify-beta-deployment.js \
  --frontend https://your-frontend.up.railway.app \
  --backend https://your-backend.up.railway.app
```

## Automated Gate

Run both test suites before every beta wave:

```bash
cd backend && npm test
cd ../frontend && npm test
```

Do not invite a new tester wave while either suite is failing.

## Manual QA Gate

Complete [beta-qa-checklist.md](./beta-qa-checklist.md) on the live deployment before Wave 1. Repeat the critical path after every bug fix that touches auth, profiles, uploads, matching, compatibility, chat, reports, or deployment config.

## Feedback Form

Create a Google Form or Tally form with these fields:

- Name
- Email
- Device and browser
- What did you test?
- What worked well?
- What broke or felt confusing?
- Screenshot or screen recording upload
- Overall rating from 1-5
- Permission to follow up

Keep the feedback link outside the app for now. Include it in direct messages, Instagram messages, and the LinkedIn beta post.

## Rollout

1. **Wave 0: internal QA**  
   Use your own accounts to complete the full checklist.

2. **Wave 1: friends, family, Instagram, known contacts**  
   Ask testers to create a real profile, verify email, browse, like, request compatibility, chat, and submit the feedback form.

3. **Wave 2: broader warm network**  
   Invite more people only after Wave 1 blockers are fixed.

4. **Wave 3: LinkedIn**  
   Post publicly only after the live app survives real users without blocker bugs.

## Bug Triage

Track every issue with one of these labels:

- `blocker`: prevents signup, verification, login, profile creation, matching, chat, reports, or data persistence.
- `major`: beta flow works only with a workaround or fails for some devices/accounts.
- `minor`: confusing copy, rough edge, or non-critical visual issue.
- `polish`: improvement for after beta validation.

Fix all blockers before the next tester wave.
