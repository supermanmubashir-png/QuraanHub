# Quran Advance

A mobile-first, installable Quran reader built with vanilla HTML, CSS and JavaScript. No frameworks, no build step, no trackers, no ads. After the first load it works offline.

## Features

- All 114 surahs: Uthmani Arabic text with Saheeh International English translation
- Surah names in Arabic and English, revelation place, ayah count, juz, page and sajda markers
- Surah list with search by name, Arabic name or number; filter by Meccan or Medinan
- Search inside translations and Arabic text (diacritics ignored)
- Jump to any ayah: type `2:255` in the search box, or use "Go to ayah" in the reader
- Continue reading from your last visited ayah; recently read surahs; reading history
- Bookmarks with surah name, ayah number and timestamp
- Copy and share any ayah (Web Share API where supported)
- Audio recitation (Mishary Alafasy): play, pause, next, previous, repeat and speed, with the playing ayah highlighted
- Dark and light themes; adjustable Arabic and translation font sizes; translation on/off
- Offline indicator, install prompt, loading skeletons, error handling with retry
- Keyboard shortcuts: `/` search, `b` bookmark current ayah, `t` toggle theme, `Esc` close dialogs
- **Ask AyahAI**: floating button plus a button beside every ayah

## File structure

```
index.html   app markup, styles and logic
manifest.json PWA manifest (icons are inline SVG data URLs)
sw.js        service worker (caching and offline)
readme.md    this file
```

## Run locally

Service workers need `http://localhost` or HTTPS, so do not open `index.html` directly from disk.

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a repository and upload the four files to the root.
2. Go to Settings, then Pages, and choose the main branch and `/ (root)`.
3. Open the published URL. Reload once so the service worker takes control, then the app works offline.

## AyahAI integration

- The floating **Ask AyahAI** button opens `https://supermanmubashir-png.github.io/AyahAI` in a new tab.
- Each ayah has an **Ask AyahAI** button that opens:

```
https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah={SURAH_NAME}&surahNumber={SURAH_NUMBER}&ayahNumber={AYAH_NUMBER}&arabic={ARABIC}&translation={TRANSLATION}
```

| Parameter | Meaning |
|---|---|
| `askAyahAI` | Always `1`; tells AyahAI a question is coming from Quran Advance |
| `surah` | English surah name, passed through `encodeURIComponent()` |
| `surahNumber` | Surah number, 1 to 114 |
| `ayahNumber` | Ayah number within the surah |
| `arabic` | Arabic ayah text, passed through `encodeURIComponent()` |
| `translation` | English translation, passed through `encodeURIComponent()` |

All AyahAI links use `target="_blank" rel="noopener noreferrer"`. The service worker never intercepts them.

## Offline behavior

- App shell (HTML, manifest): cache-first
- Quran data from alquran.cloud and Google Fonts: network-first for data, cache fallback; fonts cache-first
- Audio: each ayah is cached the first time you play it, so only ayahs you have heard work offline
- Bookmarks, history, last-read position and settings live in `localStorage`
- Old caches are deleted when the service worker activates. Bump `V` in `sw.js` after changing the app

## Browser support

Current Chrome, Edge, Firefox and Safari. The install prompt appears in Chromium browsers; on iOS use Share, then Add to Home Screen. Web Share needs a browser that supports it, otherwise the ayah is copied.

## Privacy

No accounts, analytics or trackers. Preferences and bookmarks stay in your browser. Requests go only to alquran.cloud (text), islamic.network (audio) and Google Fonts. When you tap Ask AyahAI, the chosen ayah is sent to AyahAI in the URL.

## Future ideas

Tafsir, word-by-word translation, more translations and reciters, prayer times (without API keys), reading goals, notes on ayahs, export and import of bookmarks.

## Credits

- Quran text and translations: [AlQuran Cloud API](https://alquran.cloud/api) (Tanzil Uthmani text; Saheeh International translation)
- Recitation: Mishary Rashid Alafasy, served by [islamic.network](https://islamic.network)
- Fonts: Amiri Quran and Figtree via Google Fonts
