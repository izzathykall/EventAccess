# EventAccess V3 — Smart Urgency + Staff High Urgency Popup

This is a GitHub Pages–ready academic **simulation**, based on EventAccess V3 with animated SVG facility icons.

## Upload to your existing repository

1. Extract the ZIP.
2. Open the `EventAccess` repository at `github.com/izzathykall/EventAccess`.
3. Upload the extracted **contents** to the repository root. Replace existing `index.html`, `styles.css`, `app.js`, `v3.js`, and upload the new `qr-live.js`.
4. Upload/replace all images inside the `assets/` directory, keeping the folder name as `assets`. **Also upload the new `smart-urgency.js` script** at the repository root.
5. Commit changes and check **Settings → Pages → Deploy from a branch → main → /(root)** (if Pages is not already enabled).
6. Open `https://izzathykall.github.io/EventAccess/` and hard refresh if an old version is cached.

## Three working location-specific QR targets

| Venue placement | Landing URL | Image asset |
| --- | --- | --- |
| North Entrance | https://izzathykall.github.io/EventAccess/?entry=entrance#map | `assets/qr-north-entrance.png` |
| Registration | https://izzathykall.github.io/EventAccess/?entry=registration#map | `assets/qr-registration.png` |
| Main Event Hall | https://izzathykall.github.io/EventAccess/?entry=hall#map | `assets/qr-main-hall.png` |

**Scan behaviour:** Each QR opens the same actual GitHub Pages URL with its `entry` parameter. The `qr-live.js` script sets the simulated starting point and opens the map. It also selects Attendee mode to avoid a previous demo organiser role interfering with QR arrival. No location permission or external services are needed.

The homepage **QR access demo** now shows a real scannable QR for the chosen venue placement, direct URL, Save QR option and an in-page preview.

## What is real vs simulated

- **Real after deployment:** The QR images encode functional HTTPS links to the GitHub Pages project URL and will open it when scanned, provided the site has been deployed and is accessible.
- **Simulated:** The selected start location is taken from `?entry=...` (not GPS, Bluetooth, or a real indoor positioning system). Venue layout, accessible paths, travel distances, staff identities and report management are all demonstration data.
- **Browser-only:** Reports and role changes are held in local browser storage where supported; there is no cloud database and no synchronisation across phones.

## Source layout

```
index.html
styles.css
app.js
v3.js
qr-live.js
assets/
  qr-north-entrance.png
  qr-registration.png
  qr-main-hall.png
  V3_integration_flowchart.png
```

All file paths are relative, compatible with GitHub Pages' `/EventAccess/` repository subpath.

## Print the three QR checkpoints

Open `qr-print.html` after uploading the full folder to GitHub Pages (`https://izzathykall.github.io/EventAccess/qr-print.html`) or in a browser with `assets/` next to it. Click **Print QR location cards**. The page is formatted for A4 landscape printing.

## Smart Urgency update

The Report Issue form now recommends Low, Medium or High based on incident type and the **fictional** venue network. Attendees can change the recommendation. The organiser can confirm a different final urgency during report review. Dashboard sorting considers open status first and urgency second, while Analytics shows the urgency distribution. These are transparent sample rules, **not** AI-based emergency risk assessment or verified venue conditions.

See [`SMART_URGENCY_GUIDE.md`](SMART_URGENCY_GUIDE.md) for the precise decision rules and a step-by-step demonstration.

## NEW: High Urgency Popup in Staff Mode

An in-app High priority alert now opens automatically when the simulated **Staff Mode** receives **organiser-verified, team-assigned** High urgency tasks that have not been acknowledged on that browser. A bell icon shows the unread task count; staff may open the task or dismiss the notification without deleting the report. A sample fictional alert (`EA-3105`, Facilities Team) is included for easy demonstrations.

**Important:** Upload the new **`staff-alerts.js`** file alongside `smart-urgency.js`, `qr-live.js`, `v3.js`, `app.js`, `styles.css` and `index.html`. The scripts are loaded in order by the provided `index.html`. See [`STAFF_ALERT_GUIDE.md`](STAFF_ALERT_GUIDE.md) for demo instructions.

These are browser-local notifications, not real push alerts or emergency dispatch.
