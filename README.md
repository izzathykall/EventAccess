# EventAccess V3 — Animated Map Icons (GitHub Pages)

Updated from the previous EventAccess V3 GitHub Pages package.

## New interactive map display

- Facility pins use crisp SVG pictograms rather than text letters, across the **Ground floor** and **Level 1** maps.
- Small individual looping animations: entrance door, lift arrows, first aid, registration check mark, etc.
- Selected marker is highlighted; hover/keyboard focus highlights a marker.
- Accessibility labels for markers remain available to assistive technology.
- `prefers-reduced-motion: reduce` disables motion automatically.
- **No new image or icon assets** are required for these map icons; they are drawn directly in `v3.js` and animated in `styles.css`.

## Deploy on GitHub Pages

1. Extract this ZIP.
2. Upload **all extracted files and the `assets/` folder** to the root of the GitHub repository.
3. If the repository already has EventAccess V3 installed, **replace** `index.html`, `styles.css`, `app.js` and `v3.js` with the versions in this package. Keep or upload the `assets/` folder as well.
4. In repository **Settings → Pages**, select **Deploy from a branch → main → /(root)**.
5. Visit `https://USERNAME.github.io/REPOSITORY-NAME/`, and hard-refresh the page if the old icon version is cached.

## Assets

`assets/` still contains the sample QR concept PNGs. The new animated map facility icons are **embedded SVG markup**, so there is no separate icon folder and no external animation library.

## Limitations

All venue coordinates, accessibility routes and reports remain fictional. This is a browser-only academic simulation, not real indoor positioning, verified safe routing, emergency assistance, user authentication or cross-device storage.
