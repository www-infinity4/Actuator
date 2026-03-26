const { Octokit } = require("@octokit/rest");

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

// Example: Making repos "talk" by updating a shared log or status file
const owner = process.env.GITHUB_REPOSITORY_OWNER || "your-username";
const repos = (process.env.TARGET_REPOS || "repo-a,repo-b,repo-c").split(",");

repos.forEach(repo => {
  writeToRepo(owner, repo.trim(), "communication/status.txt", "Update from Actuator", "Connected and active.");
});
