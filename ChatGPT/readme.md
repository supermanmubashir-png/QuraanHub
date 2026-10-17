# Quran Advance

Quran Advance is a lightweight, mobile-first Quran reader built with vanilla HTML, CSS, and JavaScript. It is designed for GitHub Pages and can be installed as a Progressive Web App (PWA). It has no account system, ads, analytics, trackers, or app-specific backend.

> **Offline note:** the app shell can be cached on the first visit. To use the complete Quran offline, open the app while connected and allow the Arabic text and English translation to finish loading once. The complete data is then saved locally in IndexedDB and the API responses are cached by the service worker. A first-time offline visitor sees a clearly labelled, small Al-Fatiha demo subset instead of a false claim that the full Quran is available.

## Features

- Uthmani Arabic text for all 114 surahs with surah names, revelation place, and ayah count.
- Saheeh International English translation (`en.sahih`) from AlQuran Cloud.
- Surah list and search by English name, Arabic name, or number; Meccan/Medinan filter.
- Search Arabic text and English translations across downloaded ayahs.
- Jump directly to a surah and ayah, continue from the last visited ayah, and keep recent reading history.
- Local bookmarks with surah, ayah, and saved timestamp.
- Dark/light mode, independent Arabic and translation font sizes, and translation visibility toggle.
- Copy/share ayah actions and AyahAI links on every ayah.
- Ayah-by-ayah recitation by Mishary Rashid Alafasy, play/pause, previous/next, repeat, and playback speed.
- Service-worker app-shell caching, network-first Quran API caching, IndexedDB data storage, and limited caching for recently played audio.
- Install prompt on supported browsers, online/offline indicator, accessible button labels, and keyboard shortcuts.

## File structure

Exactly four files are required:

```text
quran-advance/
├── index.html      # Complete UI, CSS, and JavaScript
├── manifest.json   # PWA metadata and inline SVG data-URL icon
├── sw.js           # App shell, Quran data, font, and limited audio caching
└── readme.md       # This guide
```

No package manager, bundler, framework, or external JavaScript library is used. The Arabic typeface is requested from Google Fonts when online, with local/system fallbacks if that request is unavailable.

## Run locally

A service worker generally needs HTTPS or localhost. Opening `index.html` directly as a `file://` URL is fine for a quick layout preview, but browser API calls, installation, and offline caching may not work correctly.

Recommended lightweight options:

1. Upload the four files to a GitHub repository and enable GitHub Pages, or
2. Serve the folder from a local HTTP server on `localhost` (for example, a simple editor's preview server).

No Node.js tooling is needed by the app itself.

## Deploy to GitHub Pages

1. Create or open a repository.
2. Upload `index.html`, `manifest.json`, `sw.js`, and `readme.md` together in the published directory.
3. In repository **Settings → Pages**, choose the intended branch and folder (commonly `main` and `/ (root)`).
4. Open the HTTPS GitHub Pages URL. Wait for Quran data to load while online, then refresh once if the browser has just installed the service worker.
5. Use the browser's Install app / Add to Home Screen option on supported devices.

Keep all four files in the same directory. The paths are relative so the project can live at a repository subpath such as `https://USERNAME.github.io/REPOSITORY/`.

## Quran data source and data handling

The app retrieves data from these public endpoints:

- Arabic Uthmani edition: `https://api.alquran.cloud/v1/quran/quran-uthmani`
- English translation: `https://api.alquran.cloud/v1/quran/en.sahih`
- Ayah audio CDN pattern: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/{GLOBAL_AYAH_NUMBER}.mp3`

The API responses include global ayah numbering. The app joins the English text to Arabic by the global ayah number and uses surah metadata supplied with the Arabic edition. If an endpoint is unavailable or returns incomplete data, the app falls back to a **small, labelled Al-Fatiha demo dataset** and offers a retry control; this demonstration data is not intended to substitute for the complete Quran.

The complete text/translation dataset is stored in IndexedDB after a successful first download. The service worker also caches successful Quran API responses. This can use several megabytes of browser storage. Browsers or users can clear site storage, and storage quota policies vary by browser. Audio files are streamed and a limited number of recently requested ayah files are cached opportunistically; downloading all recitation audio is intentionally not attempted.

## AyahAI integration

The header button opens the AyahAI homepage in a new tab:

`https://supermanmubashir-png.github.io/AyahAI`

Each ayah has its own **Ask AyahAI** link to:

`https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah={SURAH_NAME}&surahNumber={SURAH_NUMBER}&ayahNumber={AYAH_NUMBER}&arabic={URL_ENCODED_ARABIC_TEXT}&translation={URL_ENCODED_TRANSLATION_TEXT}`

The app builds this URL dynamically from the chosen ayah. It runs `encodeURIComponent()` separately on the English surah name, Arabic ayah text, and translation, while passing the surah and ayah numbers as numeric parameters. For Surah 4, the URL name is `An-Nisaa` to match the requested example. AyahAI links include `target="_blank"` and `rel="noopener noreferrer"`.

### URL parameter explanation

- `askAyahAI=1`: tells AyahAI to open its selected-ayah flow.
- `surah`: URL-encoded English surah name.
- `surahNumber`: one-based surah number (1–114).
- `ayahNumber`: one-based ayah number within that surah.
- `arabic`: URL-encoded Arabic ayah text.
- `translation`: URL-encoded English translation.

The Quran Advance page cannot guarantee what AyahAI will do with these parameters; AyahAI must implement their handling on its own page.

## Keyboard shortcuts

- `/` focuses Quran search (when you're not typing in a field).
- `b` bookmarks or un-bookmarks the currently focused reading ayah.
- `t` toggles dark/light theme.
- `Esc` closes the jump dialog.

## Browser support

Modern versions of Chrome, Edge, Firefox, and Safari support the core reader. PWA installation, background caching, Web Share, and audio behavior vary by browser and operating system. Service workers require HTTPS or localhost. If IndexedDB is disabled or unavailable, offline text retention may be limited to the service worker's API cache.

## Privacy

Bookmarks, reading history, last reading position, theme, and text-size preferences are stored locally in the browser. The app does not send that personal reading state to a server. Quran data, Google Fonts, and audio are requested from their respective public hosts when needed; those providers may receive standard network request metadata such as IP address. No app-specific analytics or trackers are included. Use the browser settings to clear this app's local data.

## Credits

- **Quran text, surah metadata, and English edition API:** [AlQuran Cloud API](https://alquran.cloud/api) — see the [API reference](https://legacy.alquran.cloud/api).
- **English translation edition:** `en.sahih` (Saheeh International), returned by AlQuran Cloud.
- **Recitation CDN and audio path format:** [AlQuran Cloud CDN documentation](https://alquran.cloud/cdn), edition `ar.alafasy` (Mishary Rashid Alafasy).
- **Arabic typefaces:** Amiri / Amiri Quran via [Google Fonts](https://fonts.google.com/).
- **AyahAI:** [AyahAI homepage](https://supermanmubashir-png.github.io/AyahAI) integration supplied by the project owner.

Please review the data providers' terms and attribution requirements before using the app in a public or commercial product.

## Future feature ideas

- Additional verified translations and translator selector.
- Tafsir display with named sources and references.
- Download-on-demand audio packs with explicit storage controls.
- Reading goals, streaks, and user-exportable backups.
- More reciters and selectable Arabic typefaces.
- A stronger data-integrity check and an explicit dataset update date.
