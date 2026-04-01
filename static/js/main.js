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
  const repos = ["christineee.com", "christine-machine", "ildzium-engine", "ildz-compiler", "linguist"];
  const container = document.getElementById("github-commits");
  
  try {
    const results = await Promise.all(
      repos.map(repo =>
        fetch(`https://api.github.com/repos/${username}/${repo}/commits?per_page=10`)
          .then(res => res.json())
          .then(data =>
            Array.isArray(data)
              ? data.map(c => ({
                  message: c.commit.message.split("\n")[0],
                  repo: repo,
                  url: c.html_url,
                  date: c.commit.author.date,
                  sha: c.sha.substring(0, 7)
                }))
              : []
          )
          .catch(() => [])
      )
    );

    // Flatten, sort by date (newest first), and take more commits
    const commits = results
      .flat()
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 30);   // You can increase this further if you want

    if (commits.length === 0) {
      container.innerHTML = "No recent commits found.";
      return;
    }

    container.innerHTML = commits.map(c => {
      const date = new Date(c.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      return `
        <div class="commit">
          <a href="${c.url}" target="_blank" rel="noopener" class="commit-link">
            <span class="commit-message">${c.message}</span>
            <span class="commit-sha">${c.sha}</span>
          </a>
          <div class="meta">
            <span class="repo">${c.repo}</span>
            <span class="date">${date}</span>
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