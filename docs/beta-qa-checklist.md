# Beta QA Checklist

Run this on the live deployment. Keep notes for account emails used, device/browser, screenshots, and bug severity.

## Accounts

- [ ] Create 8-12 test accounts with different real email accounts.
- [ ] Verify at least 3 accounts through real verification emails.
- [ ] Keep at least 2 verified accounts available for matching and chat tests.
- [ ] Keep 1 admin account available for moderation tests.

## Auth And Verification

- [ ] Register with required profile details and multiple photos.
- [ ] Confirm registration shows a clear verification message.
- [ ] Receive the verification email.
- [ ] Open the verification link and confirm the app marks the account verified.
- [ ] Log out and log back in.
- [ ] Refresh after login and confirm session restore works.
- [ ] Use resend verification on an unverified account.
- [ ] Test forgot password and reset password.
- [ ] Confirm expired or invalid verification/reset links fail cleanly.

## Profiles And Photos

- [ ] Browse profile cards after login.
- [ ] Open a profile detail view.
- [ ] Edit own profile bio/details.
- [ ] Upload or update a profile photo.
- [ ] Refresh and confirm the new photo still appears.
- [ ] Redeploy backend, then confirm uploaded photo URLs still load.

## Matching And Compatibility

- [ ] Like another profile.
- [ ] Unlike a profile.
- [ ] Create a mutual match between two verified accounts.
- [ ] Confirm match appears for both users.
- [ ] Send a compatibility request.
- [ ] Accept a compatibility request.
- [ ] Decline a compatibility request.
- [ ] Open compatibility detail.
- [ ] Open compatibility history.
- [ ] Download the compatibility certificate.

## Chat And Notifications

- [ ] Send the first chat message after a match.
- [ ] Send a follow-up chat message.
- [ ] Refresh and confirm messages persist.
- [ ] Log out and back in, then confirm messages still appear.
- [ ] Confirm notifications load.
- [ ] Mark notifications as read.

## Safety And Admin

- [ ] Block a user from profile detail.
- [ ] Confirm blocked user actions become unavailable.
- [ ] Unblock the user.
- [ ] Report a user.
- [ ] Log in as admin.
- [ ] Confirm the report appears in moderation.
- [ ] Mark report reviewed.
- [ ] Resolve report.
- [ ] Resolve a report with block action.

## Mobile

- [ ] Test signup on phone width.
- [ ] Test login and session restore on phone width.
- [ ] Browse profiles using mobile layout.
- [ ] Use mobile bottom navigation.
- [ ] Open profile detail on mobile.
- [ ] Send a chat message on mobile.
- [ ] Submit report/block actions on mobile.
- [ ] Confirm no important text overlaps or becomes unreadable.

## Account Deletion

- [ ] Delete a test profile.
- [ ] Confirm the deleted account cannot log in.
- [ ] Confirm its photos, matches, chats, and compatibility history no longer appear for other users.

## Release Decision

- [ ] Backend tests pass.
- [ ] Frontend smoke test passes.
- [ ] No blocker bugs remain.
- [ ] Major bugs have known workarounds or are fixed.
- [ ] Feedback form link is ready.
- [ ] Outreach copy is ready.
