// Ripple click effect
document.querySelectorAll('.link-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.left = `${e.offsetX}px`;
    ripple.style.top = `${e.offsetY}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Mousemove tilt effect on buttons + container
document.querySelectorAll('.link-btn, .container').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

// GitHub commits loader
async function loadCommits() {
  const username = "christinespades";
  const repos = ["christineee.com", "ildzium-engine", "linguist"];
  const container = document.getElementById("github-commits");
  
  try {
    const results = await Promise.all(
      repos.map(repo =>
        fetch(`https://api.github.com/repos/${username}/${repo}/commits`)
          .then(res => res.json())
          .then(data =>
            Array.isArray(data)
              ? data.slice(0, 3).map(c => ({
                  message: c.commit.message.split("\n")[0],
                  repo: repo,
                  url: c.html_url,
                  date: c.commit.author.date
                }))
              : []
          )
          .catch(() => [])
      )
    );

    const commits = results
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 15);

    if (commits.length === 0) {
      container.innerHTML = "No recent commits.";
      return;
    }

    container.innerHTML = commits.map(c => {
      const date = new Date(c.date).toLocaleDateString();
      return `
        <div class="commit">
          <a href="${c.url}" target="_blank" rel="noopener">
            ${c.message}
          </a>
          <div class="meta">
            ${c.repo} • ${date}
          </div>
        </div>
      `;
    }).join("");
  } catch (err) {
    console.error(err);
    container.innerHTML = "Failed to load commits.";
  }
}

// Page loaded class + commits
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  loadCommits();
});