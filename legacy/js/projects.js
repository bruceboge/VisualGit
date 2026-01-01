const username = "bruceboge";
const container = document.getElementById("projects");

fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
  .then(res => res.json())
  .then(repos => {
    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <div class="card-header">
          <h3>${repo.name}</h3>
          <span class="lang">${repo.language || "Mixed"}</span>
        </div>

        <p class="desc">
          ${repo.description || "No description provided."}
        </p>

        <div class="stats">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🕒 ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>

        <div class="actions">
          <a href="${repo.html_url}" target="_blank">View</a>
          <a href="#" class="readme-btn" data-repo="${repo.name}">README</a>
          <a href="https://github.com/${username}/${repo.name}/archive/refs/heads/${repo.default_branch}.zip">
            Download
          </a>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));

/* ===== README MODAL LOGIC ===== */

const modal = document.getElementById("readme-modal");
const closeBtn = document.getElementById("close-modal");
const readmeBody = document.getElementById("readme-body");

container.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("readme-btn")) return;

  e.preventDefault();
  const repoName = e.target.dataset.repo;

  modal.classList.remove("hidden");
  readmeBody.innerHTML = "<p>Loading README...</p>";

  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      { headers: { Accept: "application/vnd.github.v3.raw" } }
    );

    if (!res.ok) throw new Error("No README");

    const markdown = await res.text();
    readmeBody.innerHTML = markdownToHTML(markdown);
  } catch {
    readmeBody.innerHTML = "<p>No README found.</p>";
  }
});

closeBtn.onclick = () => modal.classList.add("hidden");

modal.onclick = (e) => {
  if (e.target === modal) modal.classList.add("hidden");
};

/* ===== SIMPLE MARKDOWN PARSER ===== */

function markdownToHTML(md) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
    .replace(/\n/g, "<br>");
}
/* Note: For a full-featured markdown parser, consider using a library like marked.js */