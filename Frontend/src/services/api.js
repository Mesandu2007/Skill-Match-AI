import axios from "axios";



const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export default API;



API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});



API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);

   
    return Promise.reject(error);
  }
);




export const registerUser = (data) =>
  API.post("/auth/register", data);

export const loginUser = (data) =>
  API.post("/auth/login", data);

export const getMe = () => API.get("/auth/me");



export const getDashboardAnalytics = () => API.get("/dashboard");



export const getCandidates = (projectId) =>
  API.get(`/projects/${projectId}/candidate`);


export const addCandidate = (projectId, data) =>
  API.post(`/projects/${projectId}/candidate`, data);


export const addCandidatesBulk = (projectId, data) =>
  API.post(`/projects/${projectId}/candidate/bulk`, data);


export const updateCandidate = (projectId, candidateId, data) =>
  API.put(`/projects/${projectId}/candidate/${candidateId}`, data);


export const deleteCandidate = (projectId, candidateId) =>
  API.delete(`/projects/${projectId}/candidate/${candidateId}`);


export const previewGitHub = (data) =>
  API.post("/github/preview", data);

export const getGithubOverview = (payload) =>
  API.post("/github/overview", payload);

export const analyzeGitHub = (data) =>
  API.post("/github/analyze", data);



export const getProjects = () => API.get("/projects");

export const getProjectById = (id) =>
  API.get(`/projects/${id}`);

export const createProject = (data) =>
  API.post("/projects", data);

export const updateProject = (id, data) =>
  API.put(`/projects/${id}`, data);

export const deleteProject = (id) =>
  API.delete(`/projects/${id}`);


export const runProjectAnalysis = (projectId) =>
  API.post(`/projects/run-analysis`, { projectId });
