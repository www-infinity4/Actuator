const https = require("https");

/**
 * Fetches YouTube video metadata using the oEmbed API (no API key required).
 * @param {string} youtubeUrl - A YouTube video URL.
 * @returns {Promise<object>} Resolves with video metadata.
 */
function fetchYouTubeMetadata(youtubeUrl) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`;

  return new Promise((resolve, reject) => {
    https.get(oembedUrl, (res) => {
      const chunks = [];
      res.on("data", (chunk) => { chunks.push(chunk); });
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(new Error(`YouTube oEmbed returned status ${res.statusCode} for URL: ${youtubeUrl}`));
          return;
        }
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (e) {
          reject(new Error(`Failed to parse YouTube oEmbed response: ${e.message}`));
        }
      });
    }).on("error", reject);
  });
}

/**
 * Formats YouTube video metadata into a Markdown string suitable for writing to a repo file.
 * @param {string} youtubeUrl - The original YouTube video URL.
 * @param {object} metadata - The metadata returned by fetchYouTubeMetadata.
 * @returns {string} Formatted Markdown content.
 */
function formatVideoContent(youtubeUrl, metadata) {
  return [
    `# ${metadata.title}`,
    "",
    `**Source:** YouTube`,
    `**URL:** ${youtubeUrl}`,
    `**Channel:** [${metadata.author_name}](${metadata.author_url})`,
    "",
    `[![${metadata.title}](${metadata.thumbnail_url})](${youtubeUrl})`,
    "",
    `> Synced by Actuator from YouTube.`,
  ].join("\n");
}

module.exports = { fetchYouTubeMetadata, formatVideoContent };
