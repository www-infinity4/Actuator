# Actuator
Connector for all repos and writes, edits into files.

## Love Page

Actuator can serve a full HTML love page (`index.html`) to the root of all target repositories.

### Setup

1. Set the `LOVE_PAGE` repository variable to any non-empty value (e.g. `true`) in GitHub (Settings → Variables → Actions).
2. Ensure `GH_PAT` and `TARGET_REPOS` secrets are configured (see below).

### How it works

When `LOVE_PAGE` is set, `sync-repos.js` reads `love.html` from this repository and writes it as `index.html` to the root of every target repository. This makes the love page available at the GitHub Pages URL (or any host serving that repo's root) for each target repo.

## YouTube Source

Actuator can fetch a YouTube video's metadata and sync it as a Markdown file (`sources/youtube-video.md`) into all target repositories.

### Setup

1. Set the `YOUTUBE_URL` repository variable in GitHub (Settings → Variables → Actions) to the YouTube video URL you want to sync.
2. Ensure `GH_PAT` (a Personal Access Token with repo write access) and `TARGET_REPOS` (comma-separated list of target repo names) are configured as repository secrets.

### How it works

When `YOUTUBE_URL` is set, `sync-repos.js` calls the YouTube oEmbed API to retrieve the video title, channel, and thumbnail, then writes a formatted Markdown file to each target repository. No YouTube API key is required.

When `YOUTUBE_URL` is not set, Actuator falls back to its default behaviour of writing a status file (`communication/status.txt`) to each target repository.
