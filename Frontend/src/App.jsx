import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Projects } from "./pages/Projects";
import { ProjectDetails } from "./pages/ProjectDetailes";
import {GitHubVisualizer} from "./pages/GitHubVisualizer";


const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" />;
  }
  return children;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

                <Route
                    path="/dashboard"
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />
                <Route
                    path="/projects"
                    element={<ProtectedRoute><Projects /></ProtectedRoute>}
                />
                <Route
                    path="/projects/:projectId"
                    element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>}
                />
                <Route
                    path="/githubvisualizer"
                    element={<ProtectedRoute><GitHubVisualizer /></ProtectedRoute>}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;