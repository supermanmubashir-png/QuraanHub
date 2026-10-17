# Quran Advance

**Quran Advance** is a complete, production-ready, mobile-first Progressive Web Application (PWA) designed for reading, listening, and studying the Holy Quran. Built with strict adherence to clean Islamic aesthetics, zero ads, zero trackers, and robust offline capabilities.

---

## 🌟 Features

- **Full Quran Reader**: Access all 114 surahs with Uthmani Arabic text and clear English translation.
- **Audio Recitation Player**: Stream verse-by-verse recitation by Mishary Rashid Alafasy with play, pause, next/previous ayah, repeat, and playback speed controls (0.75x to 2.0x).
- **AyahAI Integration**:
  - **Main Floating Button**: Quick access to the AyahAI homepage (`https://supermanmubashir-png.github.io/AyahAI`).
  - **Per-Ayah AyahAI Button**: Directly ask AyahAI about any specific ayah with pre-filled dynamic URL parameters (surah name, number, ayah number, Arabic text, and translation).
- **Smart Search & Filtering**: Instant search by surah name, Arabic name, or surah number. Filter by Meccan or Medinan revelation type.
- **Bookmarks & History**: Save your favorite ayahs with timestamps and automatically track your reading history.
- **Customizable Reading Experience**:
  - Dark mode and light mode toggle.
  - Adjustable Arabic font size and translation font size.
  - Translation visibility toggle.
- **Offline Support**: Fully functional offline after first load using Service Workers and dynamic caching for API data.
- **PWA Installable**: Install directly to your device home screen.
- **Keyboard Shortcuts**:
  - `/` to focus search
  - `t` to toggle theme
  - `Esc` to return to surah list

---

## 📁 File Structure

The entire application consists of exactly four files:
1. `index.html` - Single-page application containing all HTML, CSS styling, and JavaScript logic.
2. `manifest.json` - PWA manifest configuration with inline SVG data URL icons.
3. `sw.js` - Service Worker implementing cache-first and network-first caching strategies.
4. `readme.md` - Complete documentation and guide.

---

## 🚀 How to Run Locally

1. Clone or download the four repository files into a local directory.
2. Start a local HTTP server (due to Service Worker security restrictions):
   - Using Python: `python3 -m http.server 8000`
   - Using Node.js: `npx http-server`
3. Open your browser and navigate to `http://localhost:8000`.

---

## 🌐 How to Deploy to GitHub Pages

1. Create a new public repository on GitHub.
2. Upload the four files (`index.html`, `manifest.json`, `sw.js`, `readme.md`) directly to the repository root.
3. Go to your repository **Settings** > **Pages**.
4. Under **Build and deployment**, select **Deploy from a branch** (Branch: `main` / `root`).
5. Click **Save**. Your app will be live within a minute!

---

## 🔗 AyahAI Integration & URL Parameter Explanation

Quran Advance integrates seamlessly with **AyahAI** via structured query parameters.

### Per-Ayah URL Structure:
```text
[https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah=](https://supermanmubashir-png.github.io/AyahAI/home.html?askAyahAI=1&surah=){SURAH_NAME}&surahNumber={SURAH_NUMBER}&ayahNumber={AYAH_NUMBER}&arabic={URL_ENCODED_ARABIC_TEXT}&translation={URL_ENCODED_TRANSLATION_TEXT}
