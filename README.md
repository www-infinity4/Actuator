# Actuator
Connector for all repos and writes, edits into files.

## YouTube Source

Actuator can fetch a YouTube video's metadata and sync it as a Markdown file (`sources/youtube-video.md`) into all target repositories.

### Setup

1. Set the `YOUTUBE_URL` repository variable in GitHub (Settings → Variables → Actions) to the YouTube video URL you want to sync.
2. Ensure `GH_PAT` (a Personal Access Token with repo write access) and `TARGET_REPOS` (comma-separated list of target repo names) are configured as repository secrets.

### How it works

When `YOUTUBE_URL` is set, `sync-repos.js` calls the YouTube oEmbed API to retrieve the video title, channel, and thumbnail, then writes a formatted Markdown file to each target repository. No YouTube API key is required.

When `YOUTUBE_URL` is not set, Actuator falls back to its default behaviour of writing a status file (`communication/status.txt`) to each target repository.
