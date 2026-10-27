# EventAccess V3 — Smart Urgency Classification

## Overview

This academic prototype now includes transparent **rules-based urgency recommendations**. It is not a machine-learning diagnosis, a safety certification, an emergency alerting system, or a substitute for an organiser's judgment.

Each submitted report stores its **system suggestion**, the **attendee's chosen urgency**, and (after review) whether the **organiser confirmed a final urgency**. Suggestions do not automatically change route status; only organiser-verified active incidents affect the simulated route graph.

## Suggestion rules (illustrative)

| Example issue | Location | Suggested level | Basis |
| --- | --- | --- | --- |
| Lift not working | Lift A / Level 1 lift | **High** | Only modelled step-free floor change. |
| Accessible toilet unavailable | Ground floor or Level 1 accessible toilet | **High** | Only mapped accessible toilet on that level. |
| Blocked accessible route | Main Hall / Entrance edge (severed graph connection) | **High** | Removes a mapped connection with no alternative from Registration. |
| Blocked accessible route | East Ground Corridor | **Medium** | An alternative route remains in the sample graph. |
| Unclear signage | Registration, Entrance, or Lift A | **Medium** | Key waypoint/wayfinding. |
| Unclear signage | Quiet Room or most other rooms | **Low** | Ordinary wayfinding concern. |
| Other accessibility concern | Any modelled location | **Medium** | Requires individual evaluation. |

The model checks **only the fictional network graph and issue type/location**. It does not inspect physical conditions, infer safety from photos, measure barrier dimensions, or observe real venue congestion.

## Demonstration (recommended)

1. Open the website as **Attendee** and choose **Report Issue**.
2. Set `Unclear accessibility signage` at `Quiet Room`. The proposed urgency becomes **Low**.
3. Change the issue to `Lift not working` at `Lift A`. The proposal becomes **High**, with a reason explaining the sole modelled lift.
4. Manually choose **Medium** to demonstrate attendee override. A label identifies the manual choice and a button allows restoring the recommendation.
5. Fill in a description and submit. The report is **Pending verification**, and its suggested and selected urgency are stored separately.
6. Switch the role picker to **Organiser** and open **Dashboard**. Active reports appear ahead of closed reports; within active records, High is listed before Medium and Low.
7. Open the new report. A review panel shows **System suggestion**, **Attendee selection**, and an independent **Organiser-confirmed priority** dropdown.
8. Set the organiser priority to **High**, then select **Verify issue**. The final priority and review event appear in the simulated record history.
9. Open **Analytics** to view the urgency distribution and **Track Reports** to see the selected versus suggested values.
10. To test map verification independently, confirm that urgency choice alone does not close routes: an incident must be **organiser-verified** before it can affect the example graph.

## Existing V3 features retained

- Animated SVG venue facility markers with Reduced Motion support
- Smart two-level step-free route simulator
- Verification workflow and attendee status tracker
- Organiser/Staff demonstration roles and assignments
- Analytics Dashboard and local sample records
- Responsive EN / BM interface, high contrast and larger text
- Live GitHub Pages QR codes for North Entrance, Registration and Main Event Hall
- Print-friendly `qr-print.html` QR checkpoint cards

## Deployment to GitHub Pages

1. Extract the ZIP.
2. Upload the **contents** of the extracted folder to the root of `izzathykall/EventAccess`.
3. Replace `index.html`, `styles.css`, `app.js` and `v3.js` and upload **`smart-urgency.js`** as a new file. Keep **`qr-live.js`** and **`qr-print.html`**.
4. Keep the **`assets/`** folder with the QR PNGs.
5. Commit changes, and visit `https://izzathykall.github.io/EventAccess/` once GitHub Pages deploys.
6. If the previous version remains in the browser cache, refresh or reopen the site in a private tab.

**Not a live shared service.** Reports and roles use the same browser's local storage where available. They do not sync across devices; role switching is not secure login, and urgency suggestions do not contact emergency services.
