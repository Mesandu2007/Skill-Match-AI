import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/api";

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // REQUIREMENTS
  const [requirementsInput, setRequirementsInput] = useState("");
  const [requirements, setRequirements] = useState([]);

 
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();

      const data = res?.data;

      if (Array.isArray(data)) setProjects(data);
      else if (Array.isArray(data?.projects)) setProjects(data.projects);
      else setProjects([]);
    } catch (error) {
      console.error("Fetch error:", error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

 
  const validateProject = () => {
    if (!name.trim()) {
      alert("Project name is required");
      return false;
    }

    if (!description.trim()) {
      alert("Project description is required");
      return false;
    }

    if (!requirements.length) {
      alert("At least one requirement is required");
      return false;
    }

    return true;
  };

 
  const addRequirement = () => {
    if (!requirementsInput.trim()) return;

    setRequirements((prev) => [...prev, requirementsInput.trim()]);
    setRequirementsInput("");
  };

  const removeRequirement = (index) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRequirementKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addRequirement();
    }
  };


  const openCreateForm = () => {
    setShowForm(true);
    setEditMode(false);
    setEditingId(null);

    setName("");
    setDescription("");
    setRequirements([]);
    setRequirementsInput("");
  };


  const openEditForm = (project) => {
    setShowForm(true);
    setEditMode(true);
    setEditingId(project._id);

    setName(project.name || "");
    setDescription(project.description || "");
    setRequirements(project.requirements || []);
  };

  
  const handleSaveProject = async (e) => {
    e.preventDefault();

    if (!validateProject()) return;

    try {
      if (editMode) {
        await updateProject(editingId, {
          name: name.trim(),
          description: description.trim(),
          requirements,
        });
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim(),
          requirements,
        });
      }

    
      setShowForm(false);
      setEditMode(false);
      setEditingId(null);
      setName("");
      setDescription("");
      setRequirements([]);
      setRequirementsInput("");

      fetchProjects();
    } catch (error) {
      console.error("Save error:", error);
    }
  };


  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this project?");
    if (!confirmDelete) return;

    try {
      await deleteProject(id);

      setProjects((prev) =>
        prev.filter((project) => project._id !== id)
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  const filteredProjects = useMemo(() => {
    return (projects || []).filter((project) => {
      const n = project.name?.toLowerCase() || "";
      const d = project.description?.toLowerCase() || "";

      return (
        n.includes(search.toLowerCase()) ||
        d.includes(search.toLowerCase())
      );
    });
  }, [projects, search]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Projects
            </h1>
            <p className="text-gray-400 mt-2">
              Create and manage your recruitment projects.
            </p>
          </div>

          <button
            onClick={openCreateForm}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-white font-semibold"
          >
            + Create Project
          </button>
        </div>

        
        {showForm && (
          <form
            onSubmit={handleSaveProject}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-4"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Project Name"
              className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white"
            />

            
            <div>
              <div className="flex gap-2">
                <input
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  onKeyDown={handleRequirementKeyDown}
                  placeholder="Add requirement (Enter)"
                  className="flex-1 p-3 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />

                <button
                  type="button"
                  onClick={addRequirement}
                  className="bg-blue-600 hover:bg-blue-700 px-4 rounded-xl text-white"
                >
                  Add
                </button>
              </div>

              <div className="mt-3 space-y-2">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-800 px-3 py-2 rounded-lg text-white"
                  >
                    <span>{req}</span>

                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

          
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg text-white"
              >
                {editMode ? "Update Project" : "Create Project"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

      
        <div className="mb-8">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full md:w-96 p-3 rounded-xl bg-gray-900 border border-gray-800 text-white"
          />
        </div>

        
        {loading && (
          <div className="text-gray-400 text-center">
            Loading projects...
          </div>
        )}

  
        {!loading && filteredProjects.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-white">
            No Projects Found
          </div>
        )}

    
        {!loading && filteredProjects.length > 0 && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6"
              >
                <h2 className="text-white text-xl font-bold">
                  {project.name}
                </h2>

                <p className="text-gray-400 mt-2">
                  {project.description}
                </p>

                <div className="flex gap-3 mt-6">
                  <Link
                    to={`/projects/${project._id}`}
                    className="bg-blue-600 px-4 py-2 rounded-lg text-white"
                  >
                    Open
                  </Link>

                  <button
                    onClick={() => openEditForm(project)}
                    className="bg-yellow-600 px-4 py-2 rounded-lg text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(project._id)}
                    className="bg-red-600 px-4 py-2 rounded-lg text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};