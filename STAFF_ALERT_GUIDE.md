# EventAccess V3 — High Urgency Staff Popup

This update adds **in-app staff alerts**, not push notifications or emergency dispatch. It extends the existing Smart Urgency Classification, real GitHub Pages QR checkpoints, animated venue map, organiser verification, analytics and staff action workflow.

## When does the alert appear?

The alert is shown when the presenter enters **Staff Mode → My Tasks**, or selects a different staff team, **if the current team has at least one new/unacknowledged task satisfying all conditions**:

1. Urgency is **High** (including an organiser-adjusted final priority).
2. The issue is **Verified by organiser**.
3. The organiser has **assigned the issue to the currently selected staff team**.
4. Work status is **New** or **In progress** (not resolved, rejected, or ready for organiser closure).

A pending or rejected attendee report does **not** trigger staff alerts. A High priority report without a team assignment also does not trigger the popup.

## What staff members see in the browser simulation

- A red **High Urgency Task Alert** popup with the reference ID, issue category, venue location, details, High urgency and the team receiving it.
- **Open task** directly opens the existing staff action modal.
- **Acknowledge all** or closing the popup marks visible alerts as seen on that browser; the underlying tasks remain open.
- A staff **notification bell** appears in the top bar. Its badge counts unread High urgency tasks for the selected team.
- The bell can reopen all active High urgency tasks, including previously acknowledged tasks.
- Staff Mode has a High urgency summary banner and visually highlighted High urgency task cards.
- Browser settings support English / Bahasa Melayu, responsive screens and reduced-motion settings.

## Easiest demo (no report submission needed)

1. Open `https://izzathykall.github.io/EventAccess/` after deployment.
2. Use the role picker in the top bar and select **Staff**.
3. The example seeded **EA-3105** High urgency task for **Facilities Team** causes the popup to appear automatically in My Tasks. This is fictional sample data.
4. Click **Open task** or **Acknowledge all**. The notification bell remains available.
5. Switch to **Accessibility Support**: the sample Facilities Team alert will not appear under the other team.

## Full linked reporting demo

1. As **Attendee**, submit a **High urgency** example report (e.g., Lift A not working).
2. As **Staff**, show that no staff notification is received while the report is not organiser-verified or assigned.
3. As **Organiser**, confirm the report and assign **Facilities Team**.
4. Switch to **Staff → My Tasks**. The new High urgency issue appears as a fresh popup and increments the bell count.
5. Use Open task, start work, add completion notes and mark the work complete. The organiser still approves closure.

## Technical and safety notes

- The alert uses the existing **local JavaScript report records**, not a remote server. Updates made on another phone/device do not arrive on this browser.
- The application does not request mobile notification permissions, use Web Push, trigger phone sounds, send email/SMS or contact emergency responders.
- Acknowledgements are kept in `localStorage` where supported. In restricted browser previews they may last only for the current session.
- The sample task **EA-3105** is fictional and deliberately does not close any route.
- Real-world deployment would require a secure shared backend, authenticated staff, verified organisational alert escalation, consent and privacy safeguards.

## Upload to existing GitHub Pages repository

Upload/replace the extracted files at the repository root, and **add `staff-alerts.js`** at root. Keep all existing assets and scripts, including `smart-urgency.js` and `qr-live.js`. The last script in `index.html` must be `staff-alerts.js`, loaded after the earlier V3 modules.
