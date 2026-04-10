# Part 3 Submission Checklist

## Include In Final Zip
- `backend/` source files
- `frontend/` source files
- `backend/config/schema.sql`
- `backend/config/submission_setup.sql`
- `docs/part3-normalization.md`
- `docs/part3-query-pack.sql`
- `docs/part3-implementation-demo.md`
- `docs/part3-application-demo.md`
- `README.md`
- Only the image assets actually used by the app or presentation

## Exclude From Final Zip
- `.git/`
- `backend/node_modules/`
- `frontend/node_modules/`
- `.env`
- `.DS_Store`
- `frontend/tmp-desktop.png`
- `frontend/tmp-mobile.png`
- `frontend/tmp-how-desktop.png`
- `frontend/tmp-how-mobile.png`
- `frontend/tmp-landing-desktop.png`
- `frontend/tmp-landing-mobile.png`
- any local cache folders or OS-generated files

## Final Pre-Submission Checks
- Run `backend/config/submission_setup.sql` on a clean MySQL database and confirm it finishes without manual edits.
- Log in as `arjun_demo@example.com` with password `Part3Demo!`.
- Confirm the Insights section loads and the query lab cards are non-empty.
- Confirm one unmatch action removes the selected `MATCH_RECORD` and its dependent `INVOLVES` and `MESSAGES` rows.
- Confirm `Mark all read` and one profile save visibly update the query lab demo state after refresh.
- Confirm one trigger failure can be shown with `INSERT INTO LIKES (UserA, UserB) VALUES (1, 1);`.
