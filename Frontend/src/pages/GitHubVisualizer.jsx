import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { previewGitHub } from "../services/api";

import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";


export const GitHubVisualizer = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openReadme, setOpenReadme] = useState(null);

  const handleVisualize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await previewGitHub({ githubUrl });
      setData(res.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 500) {
          setError(
            "An internal server error occurred. Please check the backend server logs for more details."
          );
        } else {
          setError(
            `Error: ${err.response.data.message || err.message}`
          );
        }
      } else {
        setError(
          "Failed to fetch GitHub data. Please check your network connection and the URL, then try again."
        );
      }

      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  if (!data?.profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-950 text-white">
        <Navbar />
        <main className="flex-1 p-4 sm:p-3 flex flex-col items-center  text-center">
          <h1 className="text-3xl font-bold mb-4">GitHub Profile Visualizer</h1>
          <p className="text-gray-400 mb-8">
            Enter a GitHub profile URL to visualize repositories, languages, and more.
          </p>
          <form onSubmit={handleVisualize} className="w-full max-w-lg flex gap-2">
            <input
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/username"
              required
              className="w-full bg-gray-900 border border-gray-800 rounded-xl p-4 text-white outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-xl text-white font-semibold disabled:bg-blue-800 disabled:cursor-not-allowed"
            >
              {loading ? "..." : "Visualize"}
            </button>
          </form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </main>
        <Footer />
      </div>
    );
  }

  const { profile, languages, topRepos, frameworks } = data;

  const COLORS = ["#6366F1", "#22C55E", "#F59E0B", "#EF4444", "#06B6D4"];

  const langData = Object.entries(languages || {}).map(([name, value]) => ({
    name,
    value,
  }));
  const frameworkData = Object.entries(frameworks || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">

      <Navbar />

      <main className="flex-1 p-4 sm:p-6">

        {/* PROFILE */}
        <div className="bg-gray-900 p-4 sm:p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 shadow-lg text-center sm:text-left">

          <img
            src={profile.avatar_url}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border"
          />

          <div>
            <h1 className="text-xl sm:text-2xl font-bold">
              {profile.name}
            </h1>

            <p className="text-gray-400 text-sm">
              @{profile.username}
            </p>

            <p className="text-sm mt-2 text-gray-300">
              {profile.bio}
            </p>

            <a
              href={profile.profile_url}
              target="_blank"
              className="text-blue-400 text-sm mt-2 inline-block"
            >
              View GitHub →
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">

          <div className="bg-gray-900 p-4 rounded-xl text-center">
            <h2 className="text-lg sm:text-xl font-bold">
              {profile.public_repos}
            </h2>
            <p className="text-gray-400 text-sm">Repositories</p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl text-center">
            <h2 className="text-lg sm:text-xl font-bold">
              {profile.followers}
            </h2>
            <p className="text-gray-400 text-sm">Followers</p>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl text-center">
            <h2 className="text-lg sm:text-xl font-bold">
              {profile.following}
            </h2>
            <p className="text-gray-400 text-sm">Following</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

          <div className="bg-gray-900 p-4 rounded-xl overflow-x-auto">
            <h2 className="text-lg font-semibold mb-3">
              Language Distribution
            </h2>

            <div className="flex justify-center" style={{ height: 240 }}>
              <PieChart width={300} height={240}>
                <Pie
                  data={langData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {langData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend wrapperStyle={{ overflowY: 'auto', maxHeight: 240 }} />
              </PieChart>
            </div>
          </div>

          <div className="bg-gray-900 p-4 rounded-xl overflow-x-auto">
            <h2 className="text-lg font-semibold mb-3">
              Framework Distribution
            </h2>
            <div className="flex justify-center" style={{ height: 240 }}>
              <PieChart width={300} height={240}>
                <Pie
                  data={frameworkData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {frameworkData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ overflowY: 'auto', maxHeight: 240 }} />
              </PieChart>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4" style={{ minHeight: 'calc(100vh - 800px)' }}>
          All Projects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {topRepos.map((repo, index) => {

            const repoLangs = repo.languages || {};
            const total = Object.values(repoLangs).reduce(
              (a, b) => a + b,
              0
            );

            return (
              <div
                key={repo.id}
                className="bg-gray-900 p-4 rounded-xl hover:scale-[1.02] transition"
              >

                <h3 className="text-lg font-semibold break-words">
                  {repo.name}
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Main Language: {repo.language || "N/A"}
                </p>

                <div className="flex flex-wrap gap-2 text-xs text-gray-300 mt-2">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                  <span>📦 {repo.size} KB</span>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Commits: {repo.commit_count || "N/A"}
                </p>

                {total > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">
                      Languages Used
                    </p>

                    {Object.entries(repoLangs).map(([lang, bytes]) => {
                      const percent = (bytes / total) * 100;

                      return (
                        <div key={lang} className="mb-2">
                          <div className="flex justify-between text-xs">
                            <span>{lang}</span>
                            <span className="text-gray-500">
                              {percent.toFixed(1)}%
                            </span>
                          </div>

                          <div className="w-full bg-gray-800 h-1 rounded">
                            <div
                              className="bg-blue-500 h-1 rounded"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  className="text-blue-400 text-sm mt-3"
                  onClick={() =>
                    setOpenReadme(
                      openReadme === index ? null : index
                    )
                  }
                >
                  {openReadme === index
                    ? "Hide README"
                    : "View README"}
                </button>

                {openReadme === index && (
                  <pre className="text-xs bg-black p-3 mt-2 rounded max-h-40 overflow-auto whitespace-pre-wrap break-words">
                    {repo.readme || "No README available"}
                  </pre>
                )}
              </div>
            );
          })}
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4">
          Recent Commits
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topRepos.map((repo) => (
            <div key={repo.id} className="bg-gray-900 p-4 rounded-xl">
              <h3 className="text-lg font-semibold break-words mb-2">{repo.name}</h3>
              <ul className="space-y-2">
                {(repo.recent_commits || []).slice(0, 5).map((commit) => (
                  <li key={commit.sha} className="text-xs text-gray-400 truncate" title={commit.message}>
                    - {commit.message.split('\n')[0]}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
    </div>  

    );
  }
