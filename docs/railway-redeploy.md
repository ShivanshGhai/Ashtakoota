# Railway Redeploy Notes

## Final destination
Target repo: `sadhikahuria/CMPT_354_final_project`

## Redeploy steps
1. Push the finished codebase to the final GitHub repository.
2. In Railway, point the backend service at the backend directory from the final repo.
3. Recreate or verify these backend variables:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `PORT`
   - `FRONTEND_URL`
   - `ADMIN_EMAILS=arjun_demo@example.com`
   - Optional mail and Prokerala variables if you want those features active in the demo.
4. Attach a Railway volume to the backend service for uploaded photos:
   - Mount path: `/app/uploads`
   - Backend variable: `UPLOAD_DIR=./uploads`
   - This preserves existing `/uploads/...` URLs across redeploys.
   - Photos already lost from previous ephemeral deployments must be reuploaded unless you have a backup.
5. Configure Gmail verification mail:
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_SECURE=false`
   - `SMTP_USER=<ashtakoota Gmail address>`
   - `SMTP_PASS=<Google app password, not the normal Gmail password>`
   - `EMAIL_FROM="Ashtakoota <same Gmail address>"`
   - `FRONTEND_URL=<live frontend URL>`
6. Run [submission_setup.sql](/Users/shivanshghai/Library/Mobile Documents/com~apple~CloudDocs/CMPT 354/Project/ashtakoota/backend/config/submission_setup.sql) against the Railway MySQL instance from the `backend/config` directory if the database is new or empty.
7. Point the frontend deployment at the frontend directory from the final repo.
8. Verify:
   - login works for a seeded demo account
   - `arjun_demo@example.com` / `Part3Demo!` can access `Insights`
   - `Insights` loads successfully
   - at least one query card in the lab returns seeded rows
   - match deletion and notification/profile updates are reflected after refresh
   - `INSERT INTO LIKES (UserA, UserB) VALUES (1, 1);` fails because of the self-like trigger
   - a newly uploaded profile photo still loads after a backend redeploy
   - a real email account receives the verification link and `/api/auth/verify-email` marks the user verified
