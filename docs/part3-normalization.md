# Part 3 Normalization Notes

## Goal
Part 3 makes the relational database the primary source for compatibility rules, seeded demo data, and rubric-driven query demonstrations. The backend still keeps a fallback in-memory rule cache for availability, but the intended final submission path is to run `backend/config/submission_setup.sql` so the database-backed rule tables are present.

## Functional Dependencies

### Core lookup tables
- `PLANET`: `PlanetID -> PlanetName`
  - Meaning: each planet id identifies exactly one planet name.
- `RASHI`: `RashiID -> RashiName, Varna, VashyaGroup, PlanetID`
  - Meaning: each rashi id determines the sign name, its varna class, its vashya class, and its ruling planet.
- `NAKSHATRA`: `NakshatraID -> NakshatraName, Index1to27, Gana, Nadi, Yoni`
  - Meaning: each nakshatra id determines its display name and its fixed astrological classifications.
- `MATCH_QUALITY_LABEL`: `Label -> MinScore, MaxScore, Description`
  - Meaning: each compatibility label determines one score interval and one description.

### Rule tables
- `VARNA_RANK`: `Varna -> RankValue`
  - Meaning: each varna class maps to one ranking used by the scoring logic.
- `VASHYA_SCORE`: `(SubjectGroup, ObjectGroup) -> ScoreValue`
  - Meaning: each ordered pair of vashya groups determines one vashya score.
- `YONI_SCORE`: `(SubjectYoni, ObjectYoni) -> ScoreValue`
  - Meaning: each ordered pair of yoni values determines one yoni score.
- `PLANET_RELATION`: `(FromPlanetID, ToPlanetID) -> RelationType`
  - Meaning: each ordered planet pair determines one relationship type such as friend or enemy.
- `GRAHA_MAITRI_SCORE`: `(FromPlanetID, ToPlanetID) -> ScoreValue`
  - Meaning: each ordered planet pair determines one graha maitri score.
- `GANA_SCORE`: `(SubjectGana, ObjectGana) -> ScoreValue`
  - Meaning: each ordered gana pair determines one gana score.
- `BHAKOOT_SCORE`: `ForwardCount -> ScoreValue, ReasonText`
  - Meaning: each forward rashi distance determines one bhakoot score and one explanation.
- `NADI_SCORE`: `(SubjectNadi, ObjectNadi) -> ScoreValue`
  - Meaning: each ordered nadi pair determines one nadi score.
- `TARA_SCORE`: `(SubjectAuspicious, ObjectAuspicious) -> ScoreValue, ReasonText`
  - Meaning: each tara auspiciousness combination determines one tara score and one explanation.

### User and social data
- `USER`: `UserID -> Username, Email, PasswordHash, DateOfBirth, TimeOfBirth, BirthLocation, Latitude, Longitude, RashiID, NakshatraID, AvatarURL, Bio, GenderIdentity, LookingFor, RelationshipIntent, ProfilePrompt, AcceptedSafetyAt, EmailVerifiedAt, EmailVerifyTokenHash, EmailVerifyExpiresAt, PasswordResetTokenHash, PasswordResetExpiresAt, CreatedAt`
  - Meaning: each user id determines one complete user profile row.
- `USER_PHOTO`: `PhotoID -> UserID, PhotoURL, SortOrder, IsPrimaryPhoto, CreatedAt`
  - Meaning: each photo id identifies one uploaded user photo and its ordering metadata.
- `USER_BLOCK`: `(BlockerUserID, BlockedUserID) -> Reason, CreatedAt`
  - Meaning: each blocker-blocked pair determines one block record.
- `USER_REPORT`: `ReportID -> ReporterUserID, ReportedUserID, Category, Details, Status, CreatedAt`
  - Meaning: each report id determines one moderation report.
- `USER_REPORT_ACTION`: `ActionID -> ReportID, AdminUserID, ActionType, Note, CreatedAt`
  - Meaning: each action id determines one moderation action on one report.
- `LIKES`: `(UserA, UserB) -> CreatedAt`
  - Meaning: each directed like pair determines one like timestamp.
- `MATCH_RECORD`: `MatchID -> MatchCreatedAt`
  - Meaning: each match id determines one match creation time.
- `INVOLVES`: `MatchID -> UserA, UserB, UserLowID, UserHighID`
  - Meaning: each match id determines the two matched users plus the canonical low/high ordering used to prevent symmetric duplicates.
- `COMPAT_REQUEST`: `RequestID -> FromUserID, ToUserID, Status, CreatedAt, ExpiresAt, RespondedAt`
  - Meaning: each compatibility request id determines one request lifecycle record.
- `COMPATIBILITY_EVAL`: `EvalID -> TotalScore, MatchQualityLabel, EvaluatedAtTimestamp, EvalUser1ID, EvalUser2ID, EvalUserLowID, EvalUserHighID, RequestID`
  - Meaning: each evaluation id determines one compatibility reading between one canonical user pair.
- `KOOTA_SCORE`: `(EvalID, KootaType) -> MaxScore, ScoreValue, ExplanationText`
  - Meaning: within one evaluation, each koota type determines one per-koota breakdown row.
- `MESSAGES`: `MessageID -> MatchID, SenderID, Body, SentAt, ReadAt`
  - Meaning: each message id determines one chat message row.
- `NOTIFICATIONS`: `NotifID -> UserID, Type, Payload, IsRead, CreatedAt`
  - Meaning: each notification id determines one notification row.

## 3NF / BCNF Reasoning
- `RASHI` and `NAKSHATRA` keep astrological classification attributes in lookup tables instead of repeating them inside every user row.
- Each rule table stores facts about one determinant only, so rule changes happen in one place instead of inside JavaScript constants or duplicated rows.
- `KOOTA_SCORE` is separated from `COMPATIBILITY_EVAL`, so an evaluation stores one total row plus one row per koota rather than repeating evaluation-level data eight times.
- Canonical user-pair columns in `INVOLVES` and `COMPATIBILITY_EVAL` are populated by triggers, not generated columns. This prevents duplicate symmetric rows such as `(1,2)` and `(2,1)`.
- No non-key attribute depends on only part of a composite key in the junction or rule tables, so the design is in 3NF. The lookup and rule tables are also in BCNF because every determinant used above is a candidate key.

## Final Tables With PKs and FKs

### Primary keys
- `PLANET(PlanetID)`
- `RASHI(RashiID)`
- `NAKSHATRA(NakshatraID)`
- `MATCH_QUALITY_LABEL(Label)`
- `VARNA_RANK(Varna)`
- `VASHYA_SCORE(SubjectGroup, ObjectGroup)`
- `YONI_SCORE(SubjectYoni, ObjectYoni)`
- `PLANET_RELATION(FromPlanetID, ToPlanetID)`
- `GRAHA_MAITRI_SCORE(FromPlanetID, ToPlanetID)`
- `GANA_SCORE(SubjectGana, ObjectGana)`
- `BHAKOOT_SCORE(ForwardCount)`
- `NADI_SCORE(SubjectNadi, ObjectNadi)`
- `TARA_SCORE(SubjectAuspicious, ObjectAuspicious)`
- `USER(UserID)`
- `USER_PHOTO(PhotoID)`
- `USER_BLOCK(BlockerUserID, BlockedUserID)`
- `USER_REPORT(ReportID)`
- `USER_REPORT_ACTION(ActionID)`
- `MATCH_RECORD(MatchID)`
- `LIKES(UserA, UserB)`
- `INVOLVES(MatchID)`
- `COMPAT_REQUEST(RequestID)`
- `COMPATIBILITY_EVAL(EvalID)`
- `KOOTA_SCORE(EvalID, KootaType)`
- `MESSAGES(MessageID)`
- `NOTIFICATIONS(NotifID)`

### Key foreign keys
- `RASHI.PlanetID -> PLANET.PlanetID`
- `USER.RashiID -> RASHI.RashiID`
- `USER.NakshatraID -> NAKSHATRA.NakshatraID`
- `USER_PHOTO.UserID -> USER.UserID`
- `USER_BLOCK.BlockerUserID -> USER.UserID`
- `USER_BLOCK.BlockedUserID -> USER.UserID`
- `USER_REPORT.ReporterUserID -> USER.UserID`
- `USER_REPORT.ReportedUserID -> USER.UserID`
- `USER_REPORT_ACTION.ReportID -> USER_REPORT.ReportID`
- `USER_REPORT_ACTION.AdminUserID -> USER.UserID`
- `LIKES.UserA -> USER.UserID`
- `LIKES.UserB -> USER.UserID`
- `INVOLVES.MatchID -> MATCH_RECORD.MatchID`
- `INVOLVES.UserA -> USER.UserID`
- `INVOLVES.UserB -> USER.UserID`
- `COMPAT_REQUEST.FromUserID -> USER.UserID`
- `COMPAT_REQUEST.ToUserID -> USER.UserID`
- `COMPATIBILITY_EVAL.EvalUser1ID -> USER.UserID`
- `COMPATIBILITY_EVAL.EvalUser2ID -> USER.UserID`
- `COMPATIBILITY_EVAL.RequestID -> COMPAT_REQUEST.RequestID`
- `COMPATIBILITY_EVAL.MatchQualityLabel -> MATCH_QUALITY_LABEL.Label`
- `KOOTA_SCORE.EvalID -> COMPATIBILITY_EVAL.EvalID`
- `MESSAGES.MatchID -> MATCH_RECORD.MatchID`
- `MESSAGES.SenderID -> USER.UserID`
- `NOTIFICATIONS.UserID -> USER.UserID`

## What Changed From Part 2
- The final schema consistently uses `MATCH_RECORD` in the SQL implementation and backend code.
- Compatibility thresholds and score matrices were moved into relational rule tables so the seeded database can drive Part 3 demonstrations.
- The backend retains a fallback cache only if those rule tables are unavailable, and the app exposes the current rule source in Insights so the demo can state which source is active.
- Canonical pair integrity is enforced with trigger-populated low/high columns in `INVOLVES` and `COMPATIBILITY_EVAL`.
- `backend/config/submission_setup.sql` now creates both the schema and a demo dataset that guarantees non-empty outputs for join, division, aggregation, grouped aggregation, delete-cascade targeting, and update-operation targeting.
