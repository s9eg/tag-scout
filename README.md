# TAG SCOUT iOS starter

This is a Safari/Home Screen web app starter. It saves data in the browser's localStorage on the current device.

## Included
- 3- or 4-character A–Z / 0–9 idea generator
- Add/remove watchlist entries
- Locally saved statuses and status-update times
- Manual alert when a tag is changed to `Available — confirmed`
- CSV export
- Link to Microsoft's official gamertag-change page
- Basic offline app shell after first load

## Honest availability behavior
This project does **not** run live availability checks. It does not connect to an official public Xbox availability API, and it never claims a tag is available automatically. Status is user-entered. Verify through https://social.xbox.com/changegamertag and only then update the status.

Microsoft documents the official retail gamertag-change flow here:
https://learn.microsoft.com/en-us/gaming/gdk/docs/services/fundamentals/identity/user-profile/gamertags/live-modern-gamertags-best-practices-and-testing?view=gdk-2604

## Easiest setup: GitHub Pages from an iPhone or computer
1. Sign in to GitHub and create a new **public** repository, e.g. `tag-scout`.
2. Upload `index.html`, `manifest.json`, and `sw.js` to the repository's top level.
3. In the repository, open **Settings → Pages**.
4. Under build/deployment, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish. Open the provided HTTPS URL (usually `https://YOUR-USERNAME.github.io/tag-scout/`) in Safari.
6. In Safari, tap **Share** → **Add to Home Screen** → enable **Open as Web App** if that option appears → **Add**.
7. Launch TAG SCOUT from the Home Screen. Add a few tags and reload to confirm the watchlist persists.

If GitHub Pages takes a minute to publish, refresh the Pages settings screen and use the URL GitHub displays. Do not put passwords or Xbox tokens into this project.

## Important iOS notes
- Saved tags live in Safari's local storage on that device/browser. Clearing website data can delete them; export CSV periodically.
- The alert is triggered only while the app is open and you manually change a status. It is not a background watcher and does not send push notifications.
- True background alerts require a hosted backend, push-notification setup, and an authorized availability source. Don't add unofficial scraping or account-token collection.
