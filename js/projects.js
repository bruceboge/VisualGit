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
          <a href="https://github.com/${username}/${repo.name}/archive/refs/heads/${repo.default_branch}.zip">
            Download
          </a>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => console.error(err));
