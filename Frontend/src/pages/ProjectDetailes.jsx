import {
  useEffect,
  useState,
} from "react";
import {
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import {
  addCandidate as apiAddCandidate,
  updateCandidate as apiUpdateCandidate,
  deleteCandidate as apiDeleteCandidate,
  runProjectAnalysis as apiRunProjectAnalysis,
  getProjectById,
} from "../services/api";

export const ProjectDetails = () => {
  const { projectId } =
    useParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [ranking, setRanking] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [candidateForm, setCandidateForm] =
    useState({
      name: "",
      username: "",
    });

  const [editingId, setEditingId] =
    useState(null);

  const [formError, setFormError] =
    useState("");

  const [fetchError, setFetchError] =
    useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject =
    async () => {
      try {
        setFetchError("");
        const res = await getProjectById(projectId);

        const fetchedProject = res.data;
        if (fetchedProject) {
          setProject(fetchedProject);
          if (fetchedProject.ranking) {
            setRanking(fetchedProject.ranking);
          }
        } else {
          setFetchError("Project not found.");
        }
      } catch (error) {
        console.log(error);
        const message =
          error.response?.status === 404
            ? "Project not found. Please check the ID and try again."
            : error.response?.data?.message ||
              "An error occurred while fetching the project.";
        setFetchError(message);
        console.error("Fetch project error:", error);
      } finally {
        setLoading(false);
      }
    };

  const handleChange = (e) => {
    setCandidateForm({
      ...candidateForm,
      [e.target.name]:
        e.target.value,
    });
  };

  const addCandidate =
    async (e) => {
      e.preventDefault();
      setFormError("");

      if (!candidateForm.name.trim() || !candidateForm.username.trim()) {
        setFormError(
          "Both name and GitHub username are required."
        );
        return;
      }

      const isDuplicate =
        (project.candidates || []).some(
          (c) =>
            c.username.toLowerCase() ===
            candidateForm.username
              .toLowerCase()
              .trim()
        );

      if (isDuplicate) {
        setFormError(
          "A candidate with this GitHub username already exists."
        );
        return;
      }

      try {
        const res = await apiAddCandidate(projectId, {
          ...candidateForm,
          username: candidateForm.username.trim(),
        });
        setProject(
          res.data.project,
        );

        cancelEdit();
      } catch (err) {
        const message = err.response?.status === 500
          ? "A server error occurred. Please check the server logs."
          : err.response?.data?.message || "Failed to add candidate. Please try again.";
        setFormError(message);
        console.log(err);
      }
    };

  const updateCandidate =
    async (e) => {
      e.preventDefault();
      setFormError("");

      if (!candidateForm.name.trim() || !candidateForm.username.trim()) {
        setFormError(
          "Both name and GitHub username are required."
        );
        return;
      }

      const isDuplicate =
        (project.candidates || []).some(
          (c) =>
            c.username.toLowerCase() ===
              candidateForm.username
                .toLowerCase()
                .trim() &&
            c._id !== editingId
        );

      if (isDuplicate) {
        setFormError(
          "Another candidate with this GitHub username already exists."
        );
        return;
      }

      try {
        const res = await apiUpdateCandidate(projectId, editingId, {
          ...candidateForm,
          username: candidateForm.username.trim(),
        });
        setProject(
          res.data.project,
        );

        cancelEdit();
      } catch (err) {
        const message = err.response?.status === 500
          ? "A server error occurred. Please check the server logs."
          : err.response?.data?.message ||
            "Failed to update candidate. Please try again.";
        setFormError(message);
        console.log(err);
      }
    };

  const editCandidate =
    (candidate) => {
      setEditingId(
        candidate._id
      );
      setFormError("");

      setCandidateForm({
        name:
          candidate.name,
        username:
          candidate.username,
      });
    };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError("");
    setCandidateForm({
      name: "",
      username: "",
    });
    };

  const deleteCandidate =
    async (id) => {
      if (
        !window.confirm(
          "Delete candidate?"
        )
      )
        return;

      try {
        await apiDeleteCandidate(projectId, id);

        fetchProject();
      } catch (error) {
        console.log(error);
        setFormError("Failed to delete candidate. Please try again.");
      }
    };

  const runAnalysis =
    async () => {
      try { 
        const res = await apiRunProjectAnalysis(projectId);
        setRanking(res.data.ranking);
      } catch (error) {
        console.error("Failed to run analysis:", error);
      }
    };

  if (loading)
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );

  if (fetchError || !project) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-white p-10 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p>
            {fetchError || "Project not found or there was an error loading it."}
          </p>
        </main>
        <Footer />
      </div>
    );
  }
  const filteredCandidates = project.candidates?.filter(
      (candidate) =>
        candidate.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        candidate.username
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
    
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <h1 className="text-4xl font-bold text-white">
            {project.name}
          </h1>

          <p className="text-gray-400 mt-4">
            {
              project.description
            }
          </p>

          {project.requirements && project.requirements.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {project.requirements.map((req, index) => (
                  <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">{req}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-6 mt-6">
            <div>
              <p className="text-gray-400">
                Requirements
              </p>

              <p className="text-white text-2xl font-bold">
                {
                  project
                    .requirements
                    ?.length
                }
              </p>
            </div>

            <div>
              <p className="text-gray-400">
                Candidates
              </p>

              <p className="text-white text-2xl font-bold">
                {
                  project
                    .candidates
                    ?.length
                }
              </p>
            </div>
          </div>
        </div>

    
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingId
              ? "Update Candidate"
              : "Add Candidate"}
          </h2>

          <form
            onSubmit={
              editingId
                ? updateCandidate
                : addCandidate
            }
            className="grid md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={
                candidateForm.name
              }
              onChange={
                handleChange
              }
              className="bg-gray-800 p-3 rounded-lg text-white"
            />

            <input
              type="text"
              name="username"
              placeholder="GitHub Username"
              value={
                candidateForm.username
              }
              onChange={
                handleChange
              }
              className="bg-gray-800 p-3 rounded-lg text-white"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 rounded-lg text-white"
                >
                  Cancel
                </button>
              )}
            </div>

            {formError && (
              <p className="text-red-500 text-sm md:col-span-3">
                {formError}
              </p>
            )}
          </form>
        </div>

        {/* Candidates */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">
              Candidates
            </h2>

            <input
              type="text"
              placeholder="Search candidate..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-gray-800 p-3 rounded-lg text-white"
            />
          </div>

          <div className="space-y-4">
            {filteredCandidates?.map(
              (candidate) => (
                <div
                  key={
                    candidate._id
                  }
                  className="bg-gray-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <h3 className="text-white text-xl font-semibold">
                      {
                        candidate.name
                      }
                    </h3>

                    <p className="text-gray-400">
                      @
                      {
                        candidate.username
                      }
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        editCandidate(
                          candidate
                        )
                      }
                      className="bg-yellow-600 px-4 py-2 rounded-lg text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCandidate(
                          candidate._id
                        )
                      }
                      className="bg-red-600 px-4 py-2 rounded-lg text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        
        <div className="mb-8">
          <button
            onClick={runAnalysis}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-semibold"
          >
            Run AI Analysis
          </button>
        </div>

        
        {ranking.length > 0 && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">
                Rankings
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 text-gray-400">
                        Rank
                      </th>

                      <th className="text-left py-4 text-gray-400">
                        Candidate
                      </th>

                      <th className="text-left py-4 text-gray-400">
                        Score
                      </th>

                      <th className="text-left py-4 text-gray-400">
                        Verdict
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {ranking.map(
                      (
                        candidate,
                        index
                      ) => (
                        <tr
                          key={index}
                          className="border-b border-gray-800"
                        >
                          <td className="py-4 text-white">
                            #
                            {index +
                              1}
                          </td>

                          <td className="py-4 text-white">
                            {
                              candidate.name
                            }
                          </td>

                          <td className="py-4 text-green-400 font-bold">
                            {
                              candidate.score
                            }
                            /10
                          </td>

                          <td className="py-4 text-blue-400">
                            {
                              candidate
                                .analysis
                                .verdict
                            }
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="grid lg:grid-cols-2 gap-6">
              {ranking.map(
                (
                  candidate,
                  index
                ) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
                  >
                    <h2 className="text-2xl font-bold text-white">
                      {
                        candidate.name
                      }
                    </h2>

                    <p className="text-gray-400">
                      @
                      {
                        candidate.username
                      }
                    </p>

                    <p className="text-5xl text-green-400 font-bold mt-5">
                      {
                        candidate.score
                      }
                      /10
                    </p>

                    <p className="text-blue-400 mt-4 font-semibold">
                      {
                        candidate
                          .analysis
                          .verdict
                      }
                    </p>

                    <p className="text-gray-300 mt-5">
                      {
                        candidate
                          .analysis
                          .summary
                      }
                    </p>

                    <div className="mt-6">
                      <h3 className="text-green-400 font-bold mb-3">
                        Strengths
                      </h3>

                      <ul className="space-y-2">
                        {candidate.analysis.strengths.map(
                          (
                            strength,
                            i
                          ) => (
                            <li
                              key={
                                i
                              }
                              className="text-gray-300"
                            >
                              •{" "}
                              {
                                strength
                              }
                            </li>
                          )
                        )}
                      </ul>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-red-400 font-bold mb-3">
                        Gaps
                      </h3>

                      <ul className="space-y-2">
                        {candidate.analysis.gaps.map(
                          (
                            gap,
                            i
                          ) => (
                            <li
                              key={
                                i
                              }
                              className="text-gray-300"
                            >
                              •{" "}
                              {gap}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}