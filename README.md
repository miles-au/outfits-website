# Outfits — outfitstravel.app

Static marketing and support website for **Outfits**, the travel outfit planner for iOS and Android. Built with plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no analytics, no cookies, no third-party scripts.

The website is intentionally minimal: the product lives in the mobile apps. This site exists to provide a landing page, legal pages, support, and the Universal Link / Android App Link infrastructure for collaborative trip invitations.

## Structure

```
.
├── index.html                      Landing page
├── styles.css                      Single shared stylesheet (design tokens + components)
├── script.js                       Shared behaviour (footer year, scroll reveals)
├── 404.html                        Custom not-found page (served automatically by GitHub Pages)
├── favicon.svg                     Placeholder favicon
├── CNAME                           Custom domain for GitHub Pages
├── .nojekyll                       Disables Jekyll so .well-known/ is served as-is
├── privacy/index.html              Privacy Policy (placeholder — needs legal review)
├── terms/index.html                Terms of Service (placeholder — needs legal review)
├── support/index.html              Support page with FAQ
├── invite/
│   ├── index.html                  Invitation landing page
│   └── invite.js                   Token masking + platform detection (no redirects, no tracking)
├── join/
│   ├── index.html                  Shared-trip join landing (code query or path)
│   └── join.js                     Shows invite code + outfits:// deep link
├── .well-known/
│   ├── apple-app-site-association  iOS Universal Links (JSON, no file extension)
│   └── assetlinks.json             Android App Links
└── robots.txt / sitemap.xml        Crawl hints for outfitstravel.app
```

## Running locally

There is no build step. Because the site uses root-absolute paths (`/styles.css`, `/invite/`), serve it from the project root rather than opening files directly:

```sh
cd website   # or the repository root once this is its own repo
python3 -m http.server 8000
```

Then open <http://localhost:8000>. To test the invitation page, visit:

```
http://localhost:8000/invite/?token=TEST_TOKEN
```

## Placeholders you must replace

Search the project for these strings and replace every occurrence:

| Placeholder | Where | Replace with |
|---|---|---|
| `support@outfitstravel.app` | `support/` | Real support email address (legal pages use `miles.d.au@gmail.com` from the canonical policy) |
| ~~`APPLE_TEAM_ID` / `IOS_BUNDLE_ID`~~ | `.well-known/apple-app-site-association` | **Set:** `H6W2DP26MF.com.milesau.Outfits` (includes `/join/*`) |
| ~~`ANDROID_SHA256_CERT_FINGERPRINT`~~ | `.well-known/assetlinks.json` | **Set:** upload/release `84:6B:4E:15:…:78:2D` and debug `E8:CB:3F:1F:…:41:9D` (package `com.milesau.Outfits`). If Play App Signing is on, also add the **App signing** SHA-256 from Play Console. |
| `/assets/og-image.png` | All pages (`og:image` / `twitter:image`) | A real 1200×630 social preview image |
| `favicon.svg` | Site root | Final app icon (consider adding PNG + apple-touch-icon) |

The Privacy Policy and Terms pages contain the canonical legal copy ported from the SwiftyIndie site (`src/components/Outfits/PrivacyPolicy.js` and `src/components/Standard/Terms.js`). Keep them in sync if the SwiftyIndie versions change.

To get the Android fingerprint:

```sh
keytool -list -v -keystore your-release.keystore | grep SHA256
```

If Google Play App Signing manages your release key, copy the fingerprint from **Play Console → Setup → App signing** instead.

## Deploying to GitHub Pages

1. Create a GitHub repository and push this folder as the repository root of the `main` branch.
2. In the repository, go to **Settings → Pages** and set **Source** to **Deploy from a branch**, branch `main`, folder `/`.
3. Push to `main`. GitHub’s built-in Pages builder publishes the repo root. There is no Actions deploy workflow — this site has no build step.
4. The `.nojekyll` file is required — without it, Jekyll processing can interfere with serving the `.well-known/` directory.

## Connecting outfitstravel.app

1. The `CNAME` file in this repository already contains `outfitstravel.app`; GitHub Pages picks it up on deploy.
2. In **Settings → Pages → Custom domain**, enter `outfitstravel.app` and save.
3. Configure DNS at your domain registrar:

   **Apex domain (`outfitstravel.app`)** — four `A` records pointing at GitHub Pages:

   ```
   A  @  185.199.108.153
   A  @  185.199.109.153
   A  @  185.199.110.153
   A  @  185.199.111.153
   ```

   Optionally add the equivalent `AAAA` records for IPv6 (`2606:50c0:8000::153` through `2606:50c0:8003::153`).

   **`www` subdomain (recommended)** — a `CNAME` record so `www.outfitstravel.app` redirects to the apex:

   ```
   CNAME  www  <your-github-username>.github.io
   ```

4. Back in **Settings → Pages**, wait for the DNS check to pass, then enable **Enforce HTTPS**. Certificate provisioning can take up to an hour after DNS propagates.

Note: the `.app` TLD is on the HSTS preload list, so the site **must** be served over HTTPS — which GitHub Pages provides once the certificate is issued.

## Universal Links (iOS)

The association file lives at `/.well-known/apple-app-site-association`. It must:

- be served with **no file extension** (it is),
- be valid JSON (it is — but re-validate after editing),
- be publicly accessible over HTTPS with no redirects.

Steps:

1. Replace `APPLE_TEAM_ID` and `IOS_BUNDLE_ID` in the file (format: `TEAMID.bundle.id`).
2. Deploy, then verify the file is reachable:

   ```sh
   curl -i https://outfitstravel.app/.well-known/apple-app-site-association
   ```

   You should get `200 OK` and the JSON body. Apple's CDN fetches this file, so it must be publicly accessible — no auth, no bot-blocking.

3. **In the iOS app** (not part of this website): add the Associated Domains capability with the entitlement `applinks:outfitstravel.app`, and handle incoming `https://outfitstravel.app/invite/?token=...` URLs in your scene/app delegate or SwiftUI `onOpenURL`.
4. Apple caches the association file on its CDN; after changes, reinstalling the app or waiting up to ~24 hours may be needed. You can check Apple's CDN copy at:

   ```
   https://app-site-association.cdn-apple.com/a/v1/outfitstravel.app
   ```

## Android App Links

The statement file lives at `/.well-known/assetlinks.json`. Steps:

1. Fingerprints are already set (upload/release + debug). If Play App Signing is on, add the Play **App signing** SHA-256 to the same array.
2. Deploy, then verify it is publicly reachable:

   ```sh
   curl -i https://outfitstravel.app/.well-known/assetlinks.json
   ```

   You can also use Google's validator:

   ```
   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://outfitstravel.app&relation=delegate_permission/common.handle_all_urls
   ```

3. **In the Android app** (not part of this website): declare an intent filter with `android:autoVerify="true"` for `https://outfitstravel.app` covering the `/invite/` path, and handle the incoming intent's data URI to extract the token.

## How invitations work

- Invitation URLs look like `https://outfitstravel.app/invite/?token=INVITE_TOKEN`.
- If the app is installed and links are verified, the OS opens the app directly and the website is never shown.
- If the app is not installed, this website shows a landing page that masks the token, explains the flow, and links to the correct store for the visitor's platform. The "I already have Outfits" button links back to the exact same invitation URL so tapping it re-fires the app link after installation.
- **The website never validates, displays, stores, or transmits invitation tokens.** All invitation validation happens inside the mobile apps and their backend.
