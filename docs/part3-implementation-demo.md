# Part 3 Implementation Demo Script

## Setup
- Open the app and log in with `arjun_demo@example.com` / `Part3Demo!`.
- `arjun_demo@example.com` is the canonical Part 3 demo admin account. If `ADMIN_EMAILS` is set, include `arjun_demo@example.com` in that list. If `ADMIN_EMAILS` is unset, the backend defaults to that demo admin email automatically.
- Mention that the database was initialized with `backend/config/submission_setup.sql`, which loads both the schema and demo data.
- Open the browser dev tools network tab only if you want to point at `/api/insights/overview` and `/api/insights/query-lab`.

## Suggested 5-minute flow
1. Start in `Insights`.
   - Explain that this section was added for Part 3 and is backed by live SQL, not mocked tables.
   - Point at the `Rule Source` card and say that compatibility rules now come from relational rule tables, with a fallback cache only if the database tables are unavailable.
2. Show the join query card.
   - Say that it joins `COMPATIBILITY_EVAL`, both `USER` aliases, `RASHI`, and `NAKSHATRA`.
   - Point at usernames, rashis, gana values, total score, and quality label in one result row.
3. Show the division query card.
   - Explain the `NOT EXISTS` pattern: the query returns users who have compatibility readings with partners from all three Gana categories.
   - Mention that the seeded data guarantees at least one qualifying user.
4. Show the aggregation card.
   - Explain the overall count, average, minimum, and maximum score over all compatibility readings.
5. Show the grouped aggregation card.
   - Explain the `GROUP BY` over normalized Gana pair categories.
   - Mention that this demonstrates analytics over application data, not only lookup tables.
6. Show the delete-with-cascade card.
   - Explain that the target row is a real match owned by the logged-in user.
   - Click `Open demo match`, then unmatch that pair from the app.
   - Say that deleting `MATCH_RECORD` cascades to `INVOLVES` and `MESSAGES`, which is enforced by foreign keys.
   - Clarify that `COMPATIBILITY_EVAL` and `KOOTA_SCORE` remain as reading history in the current design, so the demo is specifically proving cascade behavior on match-owned rows.
7. Show the update-operation card.
   - Open notifications and use `Mark all read`.
   - Open `My Profile` and save a visible `RelationshipIntent` or `LookingFor` change.
   - Return to `Insights` and refresh to show the updated unread-count/profile state.
8. Show one trigger rule explicitly.
   - In MySQL, attempt a self-like such as `INSERT INTO LIKES (UserA, UserB) VALUES (1, 1);`.
   - Point out that the insert fails because `trg_likes_no_self` rejects self-likes.
   - Mention that similar triggers also protect `INVOLVES`, `COMPATIBILITY_EVAL`, and `COMPAT_REQUEST`.

## SQL talking points
- Compatibility rules are stored in `VARNA_RANK`, `VASHYA_SCORE`, `YONI_SCORE`, `PLANET_RELATION`, `GRAHA_MAITRI_SCORE`, `GANA_SCORE`, `BHAKOOT_SCORE`, `NADI_SCORE`, `TARA_SCORE`, and `MATCH_QUALITY_LABEL`.
- `COMPATIBILITY_EVAL` and `INVOLVES` use canonical low/high columns populated by triggers to prevent duplicate symmetric pairs.
- The query pack used in the demo is included in [part3-query-pack.sql](/Users/shivanshghai/Library/Mobile Documents/com~apple~CloudDocs/CMPT 354/Project/ashtakoota/docs/part3-query-pack.sql).
- The active rule source is visible in Insights, so if the app ever falls back to the cached rules you can say that explicitly instead of overstating the DB claim.

## Expected visible outputs
- Non-empty overview cards.
- Non-empty results for join, division, aggregation, and grouped aggregation.
- One concrete cascade target for the logged-in user.
- One concrete update target showing unread notifications and current profile intent fields.
- One concrete trigger failure message from a self-like insert attempt.
