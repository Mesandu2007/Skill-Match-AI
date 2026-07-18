import axios from "axios";

const getHeaders = () => ({
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
});

const getTopicsHeaders = () => ({
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github.mercy-preview+json",
});

const fetchReadme = async (username, repoName) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/readme`,
      {
        headers: getHeaders(),
      }
    );

    return Buffer.from(
      response.data.content,
      "base64"
    ).toString("utf-8").substring(0, 1500);

  } catch (error) {
    return null;
  }
};

const fetchRepoCommits = async (username, repoName) => {
  try {
    // Fetch the last 5 commits for a quick overview
    const response = await axios.get(
      `https://api.github.com/repos/${username}/${repoName}/commits?author=${username}&per_page=5`,
      { headers: getHeaders() }
    );
    return response.data.map((c) => ({
      sha: c.sha,
      message: c.commit.message,
      date: c.commit.author.date,
    }));
  } catch (error) {
    // A 409 conflict can occur for empty repos, which is fine.
    if (error.response && error.response.status !== 409) {
      console.error(`Could not fetch commits for ${username}/${repoName}: ${error.message}`);
    }
    return [];
  }
};

export const getGithubProfile = async (username) => {
  try {
    const [profileRes, reposRes, eventsRes] = await Promise.all([
      axios.get(
        `https://api.github.com/users/${username}`,
        { headers: getHeaders() }
      ),
      axios.get(
        `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`,
        { headers: getTopicsHeaders() }
      ),
      axios.get(`https://api.github.com/users/${username}/events?per_page=100`, { headers: getHeaders() }),
    ]);

    const profile = profileRes.data;
    const repos = reposRes.data;

    const frameworkKeywords = {
      "react": ["react", "reactjs", "nextjs", "next.js"],
      "angular": ["angular", "angularjs"],
      "vue": ["vue", "vuejs"],
      "node.js": ["node", "nodejs", "express", "nestjs", "koa"],
      "spring boot": ["spring-boot", "spring"],
      "django": ["django"],
      "flask": ["flask"],
      "fastapi": ["fastapi"],
      "ruby on rails": ["rails"],
      "laravel": ["laravel"],
    };

    const detectedFrameworks = {};

    const reposWithReadmes = await Promise.all(
      repos.map(async (repo) => ({
        ...repo,
        readme: await fetchReadme(
          username,
          repo.name
        ),
      }))
    );

    const languages = {};

    reposWithReadmes.forEach((repo) => {
      if (repo.language) {
        languages[repo.language] =
          (languages[repo.language] || 0) + 1;
      }

      repo.topics?.forEach((topic) => {
        languages[topic] =
          (languages[topic] || 0) + 0.5;
      });

      const content = `${repo.description || ""} ${repo.readme || ""}`.toLowerCase();
      const repoTopics = (repo.topics || []).map(t => t.toLowerCase());

      Object.entries(frameworkKeywords).forEach(([framework, keywords]) => {
        for (const keyword of keywords) {
          if (repoTopics.includes(keyword) || content.includes(keyword)) {
            detectedFrameworks[framework] = (detectedFrameworks[framework] || 0) + 1;
            // Once a framework is detected for a repo from one of its keywords,
            // we can stop checking other keywords for the same framework in the same repo.
            break; 
          }
        }
      });
    });

    const topRepos = [...reposWithReadmes]
      .sort(
        (a, b) =>
          b.stargazers_count -
          a.stargazers_count
      )
      .slice(0, 20);

    const activity = {};
    let totalCommits = 0;

    // Calculate total commits from push events in the last 90 days
    eventsRes.data.forEach(event => {
      if (event.type === 'PushEvent' && event.payload.commits) {
        totalCommits += event.payload.commits.length;
      }
    });

    reposWithReadmes.forEach((repo) => {
      const month =
        repo.updated_at?.substring(0, 7);

      if (month) {
        // This tracks repo updates, not necessarily commits
        activity[month] =
          (activity[month] || 0) + 1;
      }
    });

    return {
      profile: {
        username: profile.login,
        name: profile.name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
        public_repos: profile.public_repos,
        followers: profile.followers,
        following: profile.following,
        profile_url: profile.html_url,
        created_at: profile.created_at,
      },

      languages,
      frameworks: detectedFrameworks,
      topRepos: await Promise.all(
        topRepos.map(async (repo) => ({
          ...repo,
          recent_commits: await fetchRepoCommits(username, repo.name),
        }))
      ),
      activity,
      contributions: {
        total_commits_90_days: totalCommits,
      },

      allRepos: reposWithReadmes.map((repo) => ({
        name: repo.name,
       
        description: repo.description,
        language: repo.language,
        topics: repo.topics || [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        updated_at: repo.updated_at,
        readme: repo.readme,
      })),
    };
  } catch (error) {
    console.error(`Failed to get GitHub profile for ${username}:`, error.message);
    
    return {
      profile: { username },
      languages: {},
      frameworks: {},
      topRepos: [],
      activity: {},
      contributions: {},
      allRepos: [],
      error: "Failed to fetch profile",
    };
  }
};