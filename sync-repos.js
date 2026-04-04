const { Octokit } = require("@octokit/rest");
const { fetchYouTubeMetadata, formatVideoContent } = require("./youtube-source");

// Initialize Octokit with your PAT secret passed from the workflow
const octokit = new Octokit({ auth: process.env.GH_PAT });

async function writeToRepo(owner, repo, path, message, content) {
  try {
    // Get the current file (if it exists) to get its SHA
    let sha;
    try {
      const { data } = await octokit.repos.getContent({ owner, repo, path });
      sha = data.sha;
    } catch (e) { /* File doesn't exist yet */ }

    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
    });
    console.log(`Successfully wrote to ${repo}/${path}`);
  } catch (error) {
    console.error(`Error writing to ${repo}:`, error.message);
  }
}

const owner = process.env.GITHUB_REPOSITORY_OWNER || "your-username";
const repos = (process.env.TARGET_REPOS || "repo-a,repo-b,repo-c").split(",");
const youtubeUrl = process.env.YOUTUBE_URL;

async function main() {
  if (youtubeUrl) {
    // YouTube source mode: fetch video metadata and sync to all target repos
    console.log(`Fetching YouTube metadata for: ${youtubeUrl}`);
    let metadata;
    try {
      metadata = await fetchYouTubeMetadata(youtubeUrl);
    } catch (error) {
      console.error("Failed to fetch YouTube metadata:", error.message);
      process.exit(1);
    }

    const content = formatVideoContent(youtubeUrl, metadata);
    const filePath = "sources/youtube-video.md";
    const message = `Add YouTube video: ${metadata.title}`;

    for (const repo of repos) {
      await writeToRepo(owner, repo.trim(), filePath, message, content);
    }
  } else {
    // Default mode: update a shared status file in all target repos
    for (const repo of repos) {
      await writeToRepo(owner, repo.trim(), "communication/status.txt", "Update from Actuator", "Connected and active.");
    }
  }
}

main().catch((error) => {
  console.error("Actuator encountered an unexpected error:", error.message);
  process.exit(1);
});
