# Quran Advance

Quran Advance is a mobile-first, installable Progressive Web App (PWA) for reading the Noble Quran with Arabic Uthmani text, English translation, bookmarks, reading history, audio recitation, and per-ayah AyahAI integration.

It uses only four files, vanilla HTML/CSS/JavaScript, and no build tools or external JavaScript libraries.

## Features

- All 114 surahs and all ayahs, loaded dynamically.
- Arabic Uthmani text with RTL layout and a Quran-friendly Arabic font stack.
- Saheeh International English translation.
- Surah search by English name, Arabic name, translation meaning, or number.
- Translation search and surah filtering by Meccan/Medinan revelation.
- Jump to any surah and ayah.
- Continue reading from the last visited ayah.
- Recently read surahs.
- Bookmarks with surah, ayah, and timestamp.
- Copy and Web Share API support for individual ayahs.
- Dark and light themes.
- Adjustable Arabic and translation font sizes.
- Translation visibility toggle.
- Per-ayah audio recitation with play, pause, next, previous, repeat, speed control, and current-ayah highlighting.
- Offline indicator, loading skeletons, accessible controls, and keyboard shortcuts.
- Installable PWA with service-worker offline caching.
- Ask AyahAI integration on every ayah.

## File structure

```text
/
├── index.html      # App UI, styles, and JavaScript
├── manifest.json   # PWA installation metadata and inline SVG icons
├── sw.js           # Service worker and offline caching
└── readme.md       # Documentation
```

## Run locally

Because service workers require a secure context, use a local server rather than opening `index.html` directly.

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Then open:

```text
http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload only these four files to the repository root:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `readme.md`
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select your default branch and `/ (root)`, then save.
6. Open the generated GitHub Pages URL.

No build step is required.

## Quran data

The app fetches data from the free AlQuran Cloud API:

- Surah list: `https://api.alquran.cloud/v1/surah`
- Arabic and translation: `https://api.alquran.cloud/v1/surah/{surah}/editions/quran-uthmani,en.sahih`

AlQuran Cloud provides public Quran text, translations, metadata, and recitation-related APIs without requiring an API key. [1][2][3]

Audio recitation uses public MP3 files from EveryAyah:

```text
[https://everyayah.com/data/Alafasy_128kbps/{SSS}{AAA}.mp3](https://everyayah.com/data/Alafasy_128kbps/{SSS}{AAA}.mp3)
```

Where `SSS` is the zero-padded surah number and `AAA` is the zero-padded ayah number.

## AyahAI integration

The header contains a prominent **Ask AyahAI** button linking to:

```text
[https://supermanmubashir-png.github.io/AyahAI](https://supermanmubashir-png.github.io/AyahAI)
```

Every ayah also has a compact **Ask AyahAI** button. It opens AyahAI in a new tab with the ayah context:

```text
[https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah={SURAH_NAME}&surahNumber={SURAH_NUMBER}&ayahNumber={AYAH_NUMBER}&arabic={URL_ENCODED_ARABIC_TEXT}&translation={URL_ENCODED_TRANSLATION_TEXT}](https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah={SURAH_NAME}&surahNumber={SURAH_NUMBER}&ayahNumber={AYAH_NUMBER}&arabic={URL_ENCODED_ARABIC_TEXT}&translation={URL_ENCODED_TRANSLATION_TEXT})
```

Example for Surah An-Nisa, Ayah 1:

```text
[https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah=An-Nisaa&surahNumber=4&ayahNumber=1&arabic=ENCODED_ARABIC_TEXT&translation=ENCODED_TRANSLATION_TEXT](https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah=An-Nisaa&surahNumber=4&ayahNumber=1&arabic=ENCODED_ARABIC_TEXT&translation=ENCODED_TRANSLATION_TEXT)
```

The app builds this URL in JavaScript using `encodeURIComponent()` for the surah name, Arabic text, and translation text.

### URL parameters

| Parameter | Meaning |
|---|---|
| `askAyahAI` | Always `1`; signals that AyahAI should handle an ayah question. |
| `surah` | English surah name, URL-encoded. |
| `surahNumber` | Surah number from 1 to 114. |
| `ayahNumber` | Ayah number within the surah. |
| `arabic` | URL-encoded Arabic ayah text. |
| `translation` | URL-encoded English translation text. |

All AyahAI links use `target="_blank"` and `rel="noopener noreferrer"`.

## Offline behavior

- On first successful load, the service worker caches the app shell.
- Quran API responses are cached using a network-first strategy with cache fallback.
- After a surah has been viewed once, its text and translation response can be available offline.
- The surah list is also saved to `localStorage` after a successful load.
- Audio is streamed from the EveryAyah CDN; browsers may cache played audio, but complete pre-caching of all recitations is intentionally not forced because it would consume substantial storage.
- AyahAI external links are not intercepted or cached by the service worker.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `/` | Focus search |
| `b` | Bookmark the currently playing ayah |
| `t` | Toggle dark/light theme |
| `Esc` | Close the settings modal |

## Browser support

- Chrome, Edge, Firefox, and Safari on modern desktop and mobile devices.
- PWA installation requires a browser that supports Web App Manifests and service workers.
- Web Share is used where available; otherwise, the app falls back to copying the ayah.
- Audio playback may require a user interaction on mobile browsers.

## Privacy

Quran Advance contains no ads, analytics, trackers, accounts, or unnecessary permissions.

Preferences, bookmarks, history, and the last-read position are stored only in your browser’s `localStorage`. Quran text and audio are requested from public Quran services when online. Clicking **Ask AyahAI** sends the selected ayah’s context to the AyahAI website in a new tab.

## Future feature ideas

- Multiple translations and languages.
- Multiple reciters and continuous surah audio.
- Tafsir and word-by-word translation.
- Tajweed-colored script.
- Prayer-time display using a keyless local calculation method.
- Export and import bookmarks.
- Full-text search across all translations.
- Reading plans and memorization tools.

## Credits

- Quran text, metadata, and translations: [AlQuran Cloud](https://alquran.cloud/)
- English translation: Saheeh International, via AlQuran Cloud.
- Audio recitation: Mishary Rashid Alafasy, via [EveryAyah](https://everyayah.com/).
- AI assistance integration: [AyahAI](https://supermanmubashir-png.github.io/AyahAI/).
